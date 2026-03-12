import { watch } from "node:fs";
import { join, dirname } from "node:path";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";

import { eventEmitter } from "./events.js";

const DIAGRAM_FILE_PATH = join(process.cwd(), "data", "diagram.drawio");
const DEFAULT_CONTENT = `<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>`;

export async function readDiagram() {
  await ensureFile();
  return await readFile(DIAGRAM_FILE_PATH, "utf-8");
}

export async function writeDiagram(content: string) {
  await ensureFile();
  await writeFile(DIAGRAM_FILE_PATH, content, "utf-8");
}

async function ensureFile() {
  const dir = dirname(DIAGRAM_FILE_PATH);
  await mkdir(dir, { recursive: true });

  try {
    await stat(DIAGRAM_FILE_PATH);
  } catch {
    await writeFile(DIAGRAM_FILE_PATH, DEFAULT_CONTENT, "utf-8");
  }
}

async function watchFile() {
  await ensureFile();

  watch(DIAGRAM_FILE_PATH, async () => {
    try {
      const content = await readFile(DIAGRAM_FILE_PATH, "utf-8");
      eventEmitter.emit("update", content);
    } catch (error) {}
  });
}

watchFile();
