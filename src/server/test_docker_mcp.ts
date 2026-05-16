import { mcpClient } from './mcp/MCPClient.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function testDocker() {
  try {
    const containers = await mcpClient.callTool('docker', 'list_containers', { all: true });
    console.log("Container Object Sample:", JSON.stringify(containers[0], null, 2));
  } catch (error) {
    console.error("Test Failed:", error);
  } finally {
    await mcpClient.disconnectAll();
    process.exit();
  }
}

testDocker();
