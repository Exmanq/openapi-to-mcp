# FAQ

## Does it create a fully deployed MCP server?
It generates a ready stub with safe defaults and tool wiring; deploy transport/auth infra per environment.

## Is GraphQL supported?
Yes, schema parsing for Query/Mutation fields is included.

## Is OpenAPI YAML supported?
Yes, YAML and JSON are both parsed.

## Can I block unsafe defaults?
Yes, generated config references env vars only and avoids embedded secrets.

## Is this production ready?
Yes for scaffolding and CI generation workflows; extend handlers before exposing public APIs.

## Does it support OpenTelemetry?
Env vars are wired in config/runtime defaults; full span instrumentation is on roadmap.
