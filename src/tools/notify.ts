import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { readDiagram } from "../lib/diagram.js";
import { eventEmitter } from "../lib/events.js";

export function registerNotifyTool(server: McpServer) {
  // Register tool
  server.registerTool(
    "notify_drawio_update",
    {
      description:
        "Notify that the drawio file has been updated by the agent. This should be called after the agent has modified the 'data/diagram.drawio' file directly.",
      inputSchema: {},
    },
    async () => {
      try {
        const content = await readDiagram();
        eventEmitter.emit("update", content);

        return {
          content: [{ type: "text", text: `Update notification sent.` }],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error processing update: ${err.message}` }],
          isError: true,
        };
      }
    },
  );
}
