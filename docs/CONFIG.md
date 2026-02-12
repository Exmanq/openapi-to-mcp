# Configuration

## CLI flags
- `init --out <dir>`: create starter init config
- `build --input <file> --out <dir> --type <openapi|graphql|jsonrpc> --name <server>`
- `--emit-openapi-runtime`: emit `runtime.mjs` defaults file
- `--version`: print CLI version

## Environment variables
- `OPENAPI_TO_MCP_VERBOSE=1` — prints stack traces on errors
- `MCP_AUTH_TOKEN` — token expected by generated runtime/server
- `MCP_RATE_LIMIT_PER_MINUTE` — per-minute request budget hint (default 60)
- `MCP_LOG_LEVEL` — `debug|info|warn|error`
- `OTEL_SERVICE_NAME` — optional OpenTelemetry service name
- `OTEL_EXPORTER_OTLP_ENDPOINT` — optional OTLP endpoint

## Files
- `examples/minimal/petstore.openapi.json` demo OpenAPI
- `examples/advanced/rpc.json` demo JSON-RPC
- Generated: `<out>/server.mjs`, `<out>/mcp.config.json`, optional `<out>/runtime.mjs`
