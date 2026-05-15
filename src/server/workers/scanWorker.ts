import { Worker, Job } from 'bullmq';
import { redisConnection } from '../lib/redis.js';
import { SCAN_QUEUE_NAME, registerMockProcessor } from '../lib/queue.js';
import { supabase } from '../lib/supabase.js';
import { exec } from 'child_process';
import util from 'util';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = util.promisify(exec);

// Core processing logic separated from BullMQ
export const processScanJob = async (data: any, jobId: string) => {
  const { scanId, target, scanTypes, scanSpeed } = data;
  
  try {
    await updateJobStatus(scanId, jobId, 'processing');
    await log(scanId, `Starting scan job for ${target} with types: ${scanTypes.join(',')}`);

    if (scanTypes.includes('nmap') || scanTypes.includes('Port Scan') || scanTypes.includes('OWASP Top 10')) {
      await runNmapScan(scanId, target, scanSpeed);
    } else {
      await updateScanStatus(scanId, 'Complete', 100, 0);
    }

    const { count } = await supabase
      .from('vulnerabilities')
      .select('*', { count: 'exact', head: true })
      .eq('scan_id', scanId);

    await updateScanStatus(scanId, 'Complete', 100, count || 0);
    await updateJobStatus(scanId, jobId, 'completed');
    await log(scanId, `Scan completed successfully.`);

  } catch (error: any) {
    console.error(`Job ${jobId} failed:`, error);
    await updateScanStatus(scanId, 'Failed', null);
    await updateJobStatus(scanId, jobId, 'failed', error.message);
    await log(scanId, `Scan failed: ${error.message}`, 'error');
    throw error;
  }
};

export const startScanWorker = () => {
  // Register for mock mode
  registerMockProcessor(async (data, jobId) => {
    await processScanJob(data, jobId);
  });

  try {
    const worker = new Worker(SCAN_QUEUE_NAME, async (job: Job) => {
      await processScanJob(job.data, job.id!);
    }, { 
      connection: redisConnection,
      // Prevents the worker from hanging if Redis is down
      connectionRecheckInterval: 5000 
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed with error ${err.message}`);
    });

    console.log(`Worker started for queue: ${SCAN_QUEUE_NAME}`);
    return worker;
  } catch (err) {
    console.warn('Could not start BullMQ worker, running in mock mode only.');
    return null;
  }
};

async function log(scanId: string, message: string, level: string = 'info') {
  await supabase.from('scan_logs').insert([{ scan_id: scanId, message, level }]);
}

async function updateJobStatus(scanId: string, jobId: string, status: string, error?: string) {
  // Only update if it's not a mock job id, or handle mock job ids gracefully
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

  const safeTarget = target.replace(/[^a-zA-Z0-9.-]/g, '');
  const speedFlag = speed === 'fast' ? '-T4' : '-T3';
  const cmd = `nmap ${speedFlag} -oX - ${safeTarget}`; 

  try {
    const { stdout } = await execAsync(cmd);
    await log(scanId, `Nmap scan completed. Parsing output...`);
    await updateScanStatus(scanId, 'Running', 50);
    await parseNmapWithAI(scanId, stdout);
  } catch (err: any) {
    await log(scanId, `Nmap failed or not found. Using demo mock data instead.`, 'warn');
    
    const mockOutput = `
      <?xml version="1.0" encoding="UTF-8"?>
      <nmaprun scanner="nmap" args="nmap -T4 -oX - ${safeTarget}" start="1621065600" version="7.91">
        <host>
          <address addr="${safeTarget}" addrtype="ipv4"/>
          <ports>
            <port protocol="tcp" portid="22"><state state="open" reason="syn-ack"/><service name="ssh" product="OpenSSH" version="8.2p1"/></port>
            <port protocol="tcp" portid="80"><state state="open" reason="syn-ack"/><service name="http" product="Apache httpd" version="2.4.41"/></port>
            <port protocol="tcp" portid="443"><state state="open" reason="syn-ack"/><service name="https" product="Apache httpd" version="2.4.41"/></port>
            <port protocol="tcp" portid="3306"><state state="open" reason="syn-ack"/><service name="mysql" product="MySQL" version="8.0.25"/></port>
          </ports>
        </host>
      </nmaprun>
    `;
    
    await updateScanStatus(scanId, 'Running', 50);
    await parseNmapWithAI(scanId, mockOutput);
  }
}

async function parseNmapWithAI(scanId: string, rawXml: string) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    await log(scanId, `Gemini API key not found. Skipping AI analysis.`, 'warn');
    return;
  }

  await log(scanId, `Sending raw output to Gemini for analysis...`);
  
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });
  
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
  
  Nmap Output:
  ${rawXml.substring(0, 5000)}`;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
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
