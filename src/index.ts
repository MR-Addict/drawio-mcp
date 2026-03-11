import type { ServerType } from "@hono/node-server";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { runAppServer } from "./app-server.js";
import { runMCPServer } from "./mcp-server.js";

async function main() {
  let appServer: ServerType;
  let mcpServer: McpServer;

  try {
    mcpServer = await runMCPServer();
    appServer = runAppServer();
  } catch (err) {
    console.error("Fatal error in main():", err);
    process.exit(1);
  }

  const cleanup = async () => {
    console.error("Shutting down...");
    if (appServer) appServer.close();
    if (mcpServer) await mcpServer.close();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

main();
