import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { 
  CallToolResultSchema, 
  ListToolsResultSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";
import fs from 'fs';
import path from 'path';

export interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export class MCPClient {
  private clients: Map<string, Client> = new Map();
  private transports: Map<string, StdioClientTransport> = new Map();
  private config: any;

  constructor(configPath: string = 'mcp_config.json') {
    const fullPath = path.resolve(configPath);
    if (fs.existsSync(fullPath)) {
      this.config = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    } else {
      console.warn(`MCP config not found at ${fullPath}`);
      this.config = { mcpServers: {} };
    }
  }

  async connect(serverName: string): Promise<Client> {
    if (this.clients.has(serverName)) {
      return this.clients.get(serverName)!;
    }

    const serverConfig = this.config.mcpServers[serverName];
    if (!serverConfig) {
      throw new Error(`Server configuration for ${serverName} not found`);
    }

    const transport = new StdioClientTransport({
      command: serverConfig.command,
      args: serverConfig.args,
      env: { ...process.env, ...serverConfig.env }
    });

    const client = new Client(
      {
        name: "vulnix-orchestrator",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    await client.connect(transport);
    this.clients.set(serverName, client);
    this.transports.set(serverName, transport);

    console.log(`Connected to MCP server: ${serverName}`);
    return client;
  }

  async listTools(serverName: string): Promise<Tool[]> {
    const client = await this.connect(serverName);
    const result = await client.request(
      { method: "tools/list" },
      ListToolsResultSchema
    );
    return result.tools;
  }

  async callTool(serverName: string, toolName: string, args: any = {}): Promise<any> {
    const client = await this.connect(serverName);
    const result = await client.request(
      {
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
      },
      CallToolResultSchema
    );

    // If the result contains a single text item that looks like JSON, parse it
    if (result.content && result.content.length > 0 && result.content[0].type === 'text') {
      try {
        return JSON.parse(result.content[0].text);
      } catch (e) {
        return result.content[0].text;
      }
    }

    return result;
  }

  async disconnectAll() {
    for (const [name, transport] of this.transports) {
      await transport.close();
      console.log(`Disconnected from MCP server: ${name}`);
    }
    this.clients.clear();
    this.transports.clear();
  }
}

export const mcpClient = new MCPClient();
