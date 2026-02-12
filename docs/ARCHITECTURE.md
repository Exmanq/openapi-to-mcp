# Architecture

```mermaid
flowchart LR
  A[CLI: openapi-to-mcp] --> B[Schema Parser\nOpenAPI/GraphQL/JSON-RPC]
  B --> C[Generator Engine]
  C --> D[Templates]
  C --> E[Runtime Defaults\nauth/rate-limit/logging]
  D --> F[Generated MCP Server]
  E --> F
  F --> G[examples/output or user target dir]
```

## Dataflow
1. CLI loads user input schema and explicit schema type.
2. Parser extracts operations/methods as MCP tool candidates.
3. Generator normalizes operations and applies naming safeguards.
4. Templates produce portable Node server stubs.
5. Runtime defaults include auth/rate-limit/logging env conventions.
6. Build output includes `server.mjs` and `mcp.config.json` for immediate run.
