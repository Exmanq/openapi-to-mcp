
import { safeDefaults } from './runtime.mjs';
const defaults = safeDefaults;
const server = {
  name: 'petstore-mcp',
  defaults,
  tools: [
  { name: 'listPets', method: 'GET', path: '/pets', description: "List pets" },
  { name: 'createPet', method: 'POST', path: '/pets', description: "Create pet" },
  { name: 'getPetById', method: 'GET', path: '/pets/{petId}', description: "Get pet by id" }
  ]
};

export function listTools() {
  return server.tools;
}

export function invoke(toolName, args = {}) {
  const tool = server.tools.find((t) => t.name === toolName);
  if (!tool) {
    throw new Error('Unknown tool: ' + toolName + '. Run listTools() to inspect generated tool names.');
  }
  return {
    ok: true,
    tool: tool.name,
    method: tool.method,
    path: tool.path,
    args,
    note: 'Replace with actual API transport implementation.'
  };
}

if (process.argv[1] && process.argv[1].endsWith('server.mjs')) {
  console.log(JSON.stringify({ name: server.name, tools: server.tools.length, defaults: server.defaults }, null, 2));
}
