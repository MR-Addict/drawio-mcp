import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

import { eventEmitter } from "../lib/events.js";
import { readDiagram, writeDiagram } from "../lib/diagram.js";

const app = new Hono();

// GET / - Get file content
app.get("/", async (c) => {
  const content = await readDiagram();
  return c.text(content);
});

// POST / - Update content
app.post("/", async (c) => {
  const content = await c.req.text();
  if (!content) return c.json({ error: "Content is required" }, 400);

  // Write content to file
  await writeDiagram(content);

  // Notify listeners
  eventEmitter.emit("update", content);

  return c.json({ success: true });
});

// GET /events - SSE
app.get("/events", async (c) => {
  return streamSSE(c, async (stream) => {
    // Function to send updates to the client
    const onUpdate = (content: string) => stream.writeSSE({ data: content, event: "update" });

    // Send initial state immediately upon connection
    const initialContent = await readDiagram();
    await onUpdate(initialContent);

    // Listen for updates
    eventEmitter.on("update", onUpdate);

    // Clean up listener when connection closes
    stream.onAbort(() => {
      eventEmitter.off("update", onUpdate);
    });

    // Keep the connection open
    while (true) {
      await stream.sleep(1000);
    }
  });
});

export default app;
