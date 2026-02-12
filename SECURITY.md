# Security Policy

## Reporting vulnerabilities
Open a private security advisory on GitHub with impact, repro, and suggested fix.

## Secrets handling
- Do not commit secrets or production credentials.
- Use env vars (`MCP_AUTH_TOKEN`, OTEL endpoints, API tokens).
- Generated output does not log auth token values.
- Use `OPENAPI_TO_MCP_VERBOSE=1` only in controlled debugging.
