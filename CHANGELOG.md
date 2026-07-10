# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-07-10

### Added
- Email/password authentication with email verification, password reset,
  httpOnly cookie sessions, and refresh-token rotation.
- Role-based access control (Admin/Agent) enforced server-side on every route.
- Full ticket CRUD with server-side search, filter, sort, and pagination.
- Row-level authorization: agents can only modify tickets they own or that
  are unassigned; admins can modify any ticket.
- Bulk-close for tickets, with per-row authorization applied to each ticket
  in the batch.
- Streamed CSV export of the current filtered ticket view.
- Knowledge base (CRUD) used to ground AI-drafted replies.
- Claude-powered "Draft with AI" reply suggestions, always stored as an
  editable draft an agent must review and explicitly send — never auto-sent.
- Dashboard with ticket volume trend, status/priority breakdowns, average
  resolution time, and agent workload.
- Immutable audit log capturing every mutation, queryable by entity (admin only).
- Command palette (Cmd/Ctrl+K), dark mode (system-aware), and full keyboard
  navigation.
- Unit tests (password hashing, CSV export, pagination, formatting helpers),
  integration tests (auth flow, ticket CRUD + row-level auth), and one
  Playwright end-to-end test of the critical path.
- GitHub Actions CI running lint, typecheck, and tests on every push.
- Docker Compose setup for local development (Postgres + backend + frontend).

### Known limitations (see docs/architecture.md for the full trade-off notes)
- Client-rendered SPA, so per-route SEO tags only reach crawlers that execute
  JavaScript.
- Offset-based pagination rather than keyset/cursor pagination.
- Knowledge-base retrieval for AI grounding is keyword-based, not embeddings.
