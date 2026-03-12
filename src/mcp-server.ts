import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerNotifyTool } from "./tools/notify.js";

export async function runMCPServer() {
  // Create MCP server
  const server = new McpServer({
    name: "drawio-mcp-server",
    version: "1.0.0",
  });

  // Register tools
  registerNotifyTool(server);

  // Connect via Stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log connection success
  console.error("MCP server is running");

  return server;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  runMCPServer();
}
