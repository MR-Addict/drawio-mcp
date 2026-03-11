import { EventEmitter } from "node:events";

export const eventEmitter = createEmitter();

function createEmitter() {
  const emitter = new EventEmitter();

  const emit = (event: "update", content: string) => {
    emitter.emit(event, content);
  };

  const on = (event: "update", listener: (content: string) => void) => {
    emitter.on(event, listener);
  };

  const off = (event: "update", listener: (content: string) => void) => {
    emitter.off(event, listener);
  };

  return {
    emit,
    on,
    off,
  };
}
