import { BaseAgent } from './BaseAgent.js';
import { ReconAgent } from './agents/ReconAgent.js';
import { VulnerabilityAgent } from './agents/VulnerabilityAgent.js';
import { DevOpsAgent } from './agents/DevOpsAgent.js';

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    // We will initialize specific agents here
    // For now, these classes might not exist yet, so we'll add them as we build them
    this.agents.set('recon', new ReconAgent());
    this.agents.set('vulnerability', new VulnerabilityAgent());
    this.agents.set('devops', new DevOpsAgent());
  }

  getAgent(type: string): BaseAgent | undefined {
    return this.agents.get(type);
  }

  async runWorkflow(workflowName: string, target: string, scanId: string) {
    console.log(`Starting workflow: ${workflowName} for ${target}`);
    
    if (workflowName === 'full-scan') {
      const recon = this.getAgent('recon');
      const vuln = this.getAgent('vulnerability');

      if (recon) {
        await recon.run({ target, scanId });
      }

      if (vuln) {
        await vuln.run({ target, scanId });
      }
    } else if (workflowName === 'system-check') {
      const devops = this.getAgent('devops');
      if (devops) {
        return await devops.run({ action: 'health-check' });
      }
    }
    
    return { success: true };
  }
}

export const orchestrator = new AgentOrchestrator();
