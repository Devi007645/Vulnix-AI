import { BaseAgent } from '../BaseAgent.js';

export class DevOpsAgent extends BaseAgent {
  constructor() {
    super({
      name: 'DevOpsAgent',
      role: 'Infrastructure Specialist',
      description: 'Monitors and manages system health, containers, and orchestration.',
      tools: [
        'docker:list_containers',
        'docker:container_logs',
        'docker:inspect_container',
        'docker:start_container',
        'docker:stop_container'
      ]
    });
  }

  async run(input: { action: 'health-check' | 'restart-worker' | 'get-logs', containerName?: string }) {
    const { action, containerName } = input;
    await this.log('system', `DevOps action initiated: ${action}`);

    if (action === 'health-check') {
      return await this.performHealthCheck();
    } else if (action === 'restart-worker') {
      return await this.restartContainer(containerName || 'worker');
    } else if (action === 'get-logs') {
      return await this.getContainerLogs(containerName || 'worker');
    }

    return { error: 'Unknown action' };
  }

  private async performHealthCheck() {
    await this.log('system', "Performing comprehensive system health check...");
    try {
      const containers = await this.callTool('docker', 'list_containers', { all: true });
      const stats = {
        total: containers.length,
        running: containers.filter((c: any) => c.state === 'running').length,
        stopped: containers.filter((c: any) => c.state !== 'running').length
      };

      await this.log('system', `Infrastructure status: ${stats.running}/${stats.total} containers running.`);
      return stats;
    } catch (err: any) {
      await this.log('system', `Health check failed: ${err.message}`, 'error');
      throw err;
    }
  }

  private async restartContainer(name: string) {
    await this.log('system', `Attempting to restart container: ${name}`);
    try {
      await this.callTool('docker', 'stop_container', { name });
      await this.callTool('docker', 'start_container', { name });
      await this.log('system', `Successfully restarted ${name}.`);
      return { success: true };
    } catch (err: any) {
      await this.log('system', `Failed to restart ${name}: ${err.message}`, 'error');
      throw err;
    }
  }

  private async getContainerLogs(name: string) {
    await this.log('system', `Fetching logs for: ${name}`);
    try {
      const logs = await this.callTool('docker', 'container_logs', { name, tail: 50 });
      return { logs };
    } catch (err: any) {
      await this.log('system', `Failed to fetch logs: ${err.message}`, 'error');
      throw err;
    }
  }
}
