# Drawio MCP Demo

This is a demo of using MCP to create a simple tool that notifies the agent when the drawio file has been updated.

The tool is registered in the `src/tools/notify.ts` file and listens for changes to the `data/diagram.drawio` file.

When the file is updated, the tool reads the content of the file and emits an update event. The agent can then listen for this event and take appropriate actions, such as reloading the diagram or notifying the user.
