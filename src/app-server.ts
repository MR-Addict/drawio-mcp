import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import drawioRouter from "./routes/drawio.js";

export function runAppServer() {
  const app = new Hono();

  app.use("/*", cors());

  // Basic route
  app.get("/", (c) => c.text("Access /drawio to get the diagram."));

  // Mount the drawio router
  app.route("/drawio", drawioRouter);

  return serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.error(`Server is running on http://localhost:${info.port}`);
  });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  runAppServer();
}
