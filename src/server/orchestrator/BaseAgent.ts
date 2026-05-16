import { GoogleGenerativeAI } from '@google/generative-ai';
import { mcpClient } from '../mcp/MCPClient.js';
import { supabase } from '../lib/supabase.js';

export interface AgentMetadata {
  name: string;
  role: string;
  description: string;
  tools: string[]; // List of MCP tools this agent can use
}

export abstract class BaseAgent {
  protected model: any;
  protected metadata: AgentMetadata;

  constructor(metadata: AgentMetadata) {
    this.metadata = metadata;
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  abstract run(input: any): Promise<any>;

  protected async log(scanId: string, message: string, level: string = 'info') {
    console.log(`[${this.metadata.name}] ${message}`);
    await supabase.from('scan_logs').insert([{ 
      scan_id: scanId, 
      message: `[${this.metadata.name}] ${message}`, 
      level 
    }]);
  }

  protected async callTool(server: string, tool: string, args: any) {
    try {
      this.log('system', `Calling tool ${server}:${tool}`, 'debug');
      return await mcpClient.callTool(server, tool, args);
    } catch (error: any) {
      this.log('system', `Tool call failed: ${error.message}`, 'error');
      throw error;
    }
  }

  // Common utility for agents to generate thoughts/actions
  protected async think(prompt: string) {
    if (!this.model) {
      throw new Error("AI Model not initialized. Check GEMINI_API_KEY.");
    }
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
