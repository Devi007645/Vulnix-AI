import { BaseAgent } from '../BaseAgent.js';

export class ReconAgent extends BaseAgent {
  constructor() {
    super({
      name: 'ReconAgent',
      role: 'Reconnaissance Specialist',
      description: 'Discovers subdomains, endpoints, and technologies using OSINT and web crawling.',
      tools: ['brave-search:search', 'playwright:navigate', 'playwright:screenshot']
    });
  }

  async run(input: { target: string, scanId: string }) {
    const { target, scanId } = input;
    await this.log(scanId, `Starting reconnaissance for ${target}`);

    // Example: Use Brave Search to find subdomains
    try {
      await this.log(scanId, `Searching for intelligence on ${target} via Brave Search...`);
      const searchResult = await this.callTool('brave-search', 'brave_search', { 
        query: `site:${target} -www` 
      });
      
      await this.log(scanId, `Found ${searchResult.content?.length || 0} potential subdomains/endpoints.`);
    } catch (err) {
      await this.log(scanId, `Brave Search failed: ${err.message}`, 'warn');
    }

    // Example: Use Playwright to crawl the main page
    try {
      await this.log(scanId, `Crawling ${target} via Playwright...`);
      // Note: Actual tool names depend on the MCP server's implementation
      await this.callTool('playwright', 'navigate', { url: `https://${target}` });
      const screenshot = await this.callTool('playwright', 'screenshot', { path: `reports/${scanId}_recon.png` });
      
      await this.log(scanId, `Reconnaissance screenshot captured.`);
    } catch (err) {
      await this.log(scanId, `Playwright crawl failed: ${err.message}`, 'warn');
    }

    await this.log(scanId, `Reconnaissance phase complete.`);
  }
}
