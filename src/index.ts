import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { streamSSE } from "hono/streaming";
import { EventEmitter } from "node:events";

import { readDiagram, writeDiagram } from "./lib/utils/drawio.js";

const app = new Hono();
const ee = new EventEmitter();

app.get("/", (c) => {
  return c.text("Access /drawio to get the diagram.");
});

// GET /drawio - Get file content, create if not exists
app.get("/drawio", async (c) => {
  const content = await readDiagram();
  return c.text(content);
});

// POST /drawio - Update content, create if not exists
app.post("/drawio", async (c) => {
  const content = await c.req.text();
  if (!content) return c.json({ error: "Content is required" }, 400);

  // Write content to file
  await writeDiagram(content);

  // Notify listeners
  ee.emit("update", content);

  return c.json({ success: true });
});

// /drawio/events SSE - Send update events when content changes
app.get("/drawio/events", async (c) => {
  return streamSSE(c, async (stream) => {
    const onUpdate = (content: string) => stream.writeSSE({ data: content, event: "update" });

    // Listen for updates
    ee.on("update", onUpdate);

    // Clean up listener when connection closes
    stream.onAbort(() => {
      ee.off("update", onUpdate);
    });

    // Keep the connection open
    while (true) {
      await stream.sleep(1000);
    }
  });
});

serve({ fetch: app.fetch, port: 3000 }, (info) => console.log(`Server is running on http://localhost:${info.port}`));
