# SupportCopilot

> A helpdesk for small teams: ticket triage, a knowledge base, and Claude-drafted reply suggestions an agent always reviews before sending.

[![CI](https://github.com/YOUR_USERNAME/support-copilot/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/support-copilot/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**Live demo →** `https://your-app.vercel.app` *(add your deployed URL here)*

Built for the [Digital Heroes](https://github.com/) Full Stack Developer
Trial Task, founded by Prasun Anand — a build-a-real-product trial, not a
take-home quiz. See `docs/` for the full case study.

![Hero screenshot](docs/screenshots/hero.png)

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `demo@demo.com` | `Demo1234!` |
| Agent | `agent@demo.com` | `Demo1234!` |

Both are created by the seed script (`npm run db:seed` in `backend/`) —
never real accounts, safe to share publicly.

## Features

- Email/password auth with email verification, password reset, and rotating
  refresh tokens in httpOnly cookies — no client-side token storage.
- Role-based access control (Admin/Agent) enforced server-side on every route.
- Full ticket CRUD with server-side search, filter, sort, and pagination
  mirrored into the URL so it's shareable and survives the back button.
- Row-level authorization — agents can only edit tickets they own or that
  are unassigned; admins can edit anything.
- Bulk-close, streamed CSV export, and an audit log of every mutation.
- A knowledge base that grounds the AI reply drafts — ask for a draft, get
  back a clearly-labeled AI card you must review/edit before sending, never
  an auto-sent reply.
- Dashboard with real charts: ticket volume trend, status/priority
  breakdowns, average resolution time, and agent workload.
- Command palette (⌘K), system-aware dark mode, full keyboard navigation,
  and responsive layout down to 320px.

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18 + Vite + TypeScript (strict) + Tailwind CSS |
| Backend | Node.js + Express + TypeScript (strict) |
| Database | PostgreSQL via Prisma ORM |
| Auth | Custom JWT (access + rotating refresh) + bcrypt password hashing |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) for reply drafting |
| Validation | Zod on both the client and the server |
| Data fetching | TanStack Query |
| Charts | Recharts |
| Testing | Vitest + Supertest (backend), Vitest + Testing Library + Playwright (frontend) |
| CI | GitHub Actions (lint, typecheck, test, build on every push) |

This mirrors the MERN-style stack already used in the
[HUB Cars](https://github.com/Aravind628187/car-price-prediction-system) and
[BIForge](https://github.com/Aravind628187/enterprise-ai-bi-platform) projects
(React/Vite + Node/Express + JWT auth, plus a Claude API integration), rather
than introducing an unfamiliar framework for its own sake.

## Quick start

Requires Node.js ≥ 18.18 and a PostgreSQL database (local, Docker, or a free
tier on [Neon](https://neon.tech) / [Supabase](https://supabase.com)).

```bash
git clone https://github.com/YOUR_USERNAME/support-copilot && cd support-copilot

# 1. Backend
cd backend
cp .env.example .env         # then fill in DATABASE_URL at minimum
npm install
npm run db:migrate           # creates tables
npm run db:seed              # creates the demo accounts above
npm run dev                  # http://localhost:4000

# 2. Frontend (in a second terminal)
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

Open `http://localhost:5173` and log in with the demo credentials above.

### Or with Docker Compose

```bash
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxx docker compose up --build
# frontend: http://localhost:5173 · backend: http://localhost:4000
```

You'll still need to run migrations + seed once against the containerized
database: `docker compose exec backend npm run db:migrate:deploy && docker compose exec backend npm run db:seed`.

## Environment variables

Backend (`backend/.env` — every variable is documented in `backend/.env.example`):

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Long random strings — never reuse the example values |
| `GEMINI_API_KEY` | From [console.anthropic.com](https://console.anthropic.com) — "Draft with AI" is disabled with a clear message if unset |
| `ANTHROPIC_MODEL` | Defaults to `claude-sonnet-4-6` |
| `CORS_ORIGIN` | The frontend origin allowed to send credentialed requests |

Frontend: none required for local dev — Vite proxies `/api` to
`http://localhost:4000` (see `frontend/vite.config.ts`). Set `VITE_API_URL`
only if you deploy the API to a different origin than the frontend.

## Architecture

See [`docs/architecture.md`](./docs/architecture.md) for the full data
model, the auth/authorization design, how the AI draft-reply feature is
grounded and kept human-reviewed, and every non-obvious trade-off we made
along with the reasoning and upgrade path.

## Testing

```bash
# Backend — unit tests run standalone; integration tests need a real
# Postgres reachable via DATABASE_URL (use a disposable database, not prod)
cd backend
npm test

# Frontend — component/unit tests
cd frontend
npm test

# Frontend — end-to-end critical path (requires both apps running + seed data)
npm run test:e2e
```

## Deployment

**Frontend → Vercel or Netlify:** import the `frontend/` directory as the
project root, build command `npm run build`, output directory `dist`.

**Backend → any Node host with a Postgres connection** (Render, Railway,
Fly.io): set the environment variables above, run
`npm run db:migrate:deploy` once against the production database, then
`npm run build && npm start`.

Before calling it deployed:
- [ ] Live URL loads with no console errors and no broken images.
- [ ] Auth works end-to-end on production, not just localhost.
- [ ] No secret keys leaked to the client bundle (check the Network tab).
- [ ] `GEMINI_API_KEY` is set if you want "Draft with AI" to work.

## Roadmap

- [x] Auth, RBAC, row-level authorization
- [x] Ticket CRUD with search/filter/sort/pagination
- [x] AI-drafted, human-reviewed replies grounded in a knowledge base
- [x] Dashboard, audit log, CSV export, bulk actions
- [ ] Real-time updates (WebSocket) instead of manual refetch
- [ ] Embeddings-based KB retrieval (pgvector) once the KB grows
- [ ] Prerendering/SSR for full crawler-visible SEO

## Screenshots

*(Add screenshots of the dashboard, ticket detail with an AI draft, and the
knowledge base to `docs/screenshots/` and reference them here.)*

## License

MIT — see [LICENSE](./LICENSE).

---

Built as a submission for the Digital Heroes Full Stack Developer Trial Task.
