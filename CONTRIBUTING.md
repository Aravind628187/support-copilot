# Contributing

## Local setup

Follow the Quick Start in the [README](./README.md) to get the backend and
frontend running against a local Postgres database.

## Branch naming

- `feat/<short-description>` — new functionality
- `fix/<short-description>` — bug fixes
- `chore/<short-description>` — tooling, deps, docs

## Commit style

This repo follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add bulk-close action to the tickets table
fix: correct row-level auth check on ticket update
docs: document the AI draft-reply grounding strategy
refactor: extract pagination parsing into a shared util
```

Keep commits small and focused — one logical change per commit.

## Before opening a PR

```bash
# backend
cd backend && npm run lint && npm run typecheck && npm test

# frontend
cd frontend && npm run lint && npm run typecheck && npm test
```

CI runs the same checks on every push and blocks merge on failure.

## Pull requests

- Describe **what changed and why**, not just what — the reviewer's speed is
  capped by how fast they can reconstruct your intent.
- Link the issue it closes, if any.
- Keep PRs scoped to one vertical slice (schema, then endpoint, then screen)
  rather than a sprawling diff nobody can fully review.
