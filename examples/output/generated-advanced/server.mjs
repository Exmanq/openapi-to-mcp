

const defaults = { authEnv: 'MCP_AUTH_TOKEN', rateLimitPerMinuteEnv: 'MCP_RATE_LIMIT_PER_MINUTE', logLevelEnv: 'MCP_LOG_LEVEL' };
const server = {
  name: 'rpc-mcp',
  defaults,
  tools: [
  { name: 'inventory.search', method: 'JSONRPC', path: 'inventory.search', description: "Search inventory records" },
  { name: 'inventory.update', method: 'JSONRPC', path: 'inventory.update', description: "Update inventory item" }
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
