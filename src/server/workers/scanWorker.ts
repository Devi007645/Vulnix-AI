import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis.js';
import { SCAN_QUEUE_NAME } from '../lib/queue.js';
import { supabase } from '../lib/supabase.js';
import { exec } from 'child_process';
import util from 'util';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = util.promisify(exec);

export const startScanWorker = () => {
  const worker = new Worker(SCAN_QUEUE_NAME, async (job: Job) => {
    const { scanId, target, scanTypes, scanSpeed } = job.data;
    
    try {
      await updateJobStatus(scanId, job.id!, 'processing');
      await log(scanId, `Starting scan job for ${target} with types: ${scanTypes.join(',')}`);

      if (scanTypes.includes('nmap')) {
        await runNmapScan(scanId, target, scanSpeed);
      }

      // TODO: Add other scanners here like ZAP, testssl, nuclei

      // Calculate final vulnerability count
      const { count } = await supabase
        .from('vulnerabilities')
        .select('*', { count: 'exact', head: true })
        .eq('scan_id', scanId);

      await updateScanStatus(scanId, 'Complete', 100, count || 0);
      await updateJobStatus(scanId, job.id!, 'completed');
      await log(scanId, `Scan completed successfully.`);

    } catch (error: any) {
      console.error(`Job ${job.id} failed:`, error);
      await updateScanStatus(scanId, 'Failed', null);
      await updateJobStatus(scanId, job.id!, 'failed', error.message);
      await log(scanId, `Scan failed: ${error.message}`, 'error');
      throw error;
    }
  }, { connection: redisConnection });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error ${err.message}`);
  });

  console.log(`Worker started for queue: ${SCAN_QUEUE_NAME}`);
  return worker;
};

async function log(scanId: string, message: string, level: string = 'info') {
  await supabase.from('scan_logs').insert([{ scan_id: scanId, message, level }]);
}

async function updateJobStatus(scanId: string, jobId: string, status: string, error?: string) {
  await supabase.from('scan_jobs').update({ status, error }).eq('job_id', jobId);
}

async function updateScanStatus(scanId: string, status: string, progress: number | null, vuln_count?: number) {
  const updateData: any = { status };
  if (progress !== null) updateData.progress = progress;
  if (vuln_count !== undefined) updateData.vuln_count = vuln_count;
  await supabase.from('scans').update(updateData).eq('id', scanId);
}

async function runNmapScan(scanId: string, target: string, speed: string) {
  await log(scanId, `Running nmap scan on ${target}...`);
  await updateScanStatus(scanId, 'Running', 10);

  // Prevent command injection by very basic sanitization (should be much stricter in prod)
  const safeTarget = target.replace(/[^a-zA-Z0-9.-]/g, '');
  const speedFlag = speed === 'fast' ? '-T4' : '-T3';
  const cmd = `nmap ${speedFlag} -oX - ${safeTarget}`; 

  try {
    const { stdout, stderr } = await execAsync(cmd);
    
    await log(scanId, `Nmap scan completed. Parsing output...`);
    await updateScanStatus(scanId, 'Running', 50);

    await parseNmapWithAI(scanId, stdout);

    await updateScanStatus(scanId, 'Running', 90);
  } catch (err: any) {
    await log(scanId, `Nmap failed: ${err.message}`, 'error');
    throw err;
  }
}

async function parseNmapWithAI(scanId: string, rawXml: string) {
  const openAIKey = process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    await log(scanId, `OpenAI API key not found. Skipping AI analysis.`, 'warn');
    return;
  }

  await log(scanId, `Sending raw output to AI for analysis...`);
  
  const openai = new OpenAI({ apiKey: openAIKey });
  
  const prompt = `You are a cybersecurity expert. Analyze the following Nmap XML output. 
  Extract any security issues, misconfigurations, or noteworthy open ports. 
  Return a JSON object with a single key "vulnerabilities" that contains an array of objects.
  Each object MUST have:
  "name" (string), 
  "description" (string), 
  "remediation" (string), 
  "severity" (string: Critical, High, Medium, Low), 
  "cvss" (number 0-10), 
  "confidence" (number 0-100).
  If no issues are found, return { "vulnerabilities": [] }.
  
  Nmap Output (truncated):
  ${rawXml.substring(0, 4000)}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (content) {
      const parsed = JSON.parse(content);
      const vulns = parsed.vulnerabilities || [];
      
      for (const v of vulns) {
        await supabase.from('vulnerabilities').insert([{
          scan_id: scanId,
          name: v.name,
          description: v.description,
          remediation: v.remediation,
          severity: v.severity,
          cvss: v.cvss || 0,
          confidence: v.confidence || 100,
          raw_output: rawXml.substring(0, 1000)
        }]);
      }
      await log(scanId, `AI Analysis complete. Found ${vulns.length} issues.`);
    }
  } catch (error: any) {
    await log(scanId, `AI Analysis failed: ${error.message}`, 'error');
  }
}
