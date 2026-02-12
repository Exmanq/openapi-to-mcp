# Contributing

## Setup
```bash
make setup
make doctor
```

## Quality gates
```bash
make lint
make test
make demo
```

## Commit style
Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

## Adding features
1. Implement behavior in `packages/*`.
2. Add/extend tests in `tests/`.
3. Update docs/examples if CLI behavior changes.
4. Run full Makefile checks before opening PR.
