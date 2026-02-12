# Design Decisions

- **TypeScript + Node 20:** strong DX and broad MCP ecosystem compatibility.
- **Monorepo packages:** generator/runtime/templates/cli separation keeps logic maintainable.
- **No secrets in codegen:** runtime defaults only reference env var names.
- **Fast deterministic demo:** examples always produce committed artifacts for trust.
- **Minimal runtime stubs first:** safe defaults now, pluggable transports next.
