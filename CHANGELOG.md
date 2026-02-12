# Changelog

## [0.1.2] - 2026-02-12
### Fixed
- Removed absolute local filesystem paths from committed demo artifact (`examples/output/demo-summary.json`).
- Demo summary now writes repository-relative output paths only.

## [0.1.1] - 2026-02-12
### Fixed
- Docker build in CI/release now installs dependencies with `--ignore-scripts` before source copy.
- Added `.dockerignore` to reduce context size and avoid leaking local build artifacts.

## [0.1.0] - 2026-02-12
### Added
- TypeScript monorepo layout with generator/runtime/templates/cli packages
- CLI commands: `init`, `build`, `--version`
- Schema ingestion for OpenAPI, GraphQL, and JSON-RPC
- Generated MCP server stubs with safe defaults (auth/rate-limit/logging env hints)
- Demo generation outputs committed in `examples/output`
- CI + Release workflows, Docker build validation, issue/PR templates
