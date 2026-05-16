import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function listTools() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@swartdraak/docker-mcp-server"]
  });

  // @ts-ignore
  const client = new Client({ name: "test", version: "1.0.0" }, { capabilities: { tools: {} } });
  await client.connect(transport);
  
  // Use a proper validator or no validator
  // @ts-ignore
  const result = await client.request({ method: "tools/list" });
  console.log(JSON.stringify(result.tools.map((t: any) => t.name), null, 2));
  
  await transport.close();
}

listTools();
