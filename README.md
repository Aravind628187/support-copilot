# SupportCopilot

An AI-powered customer-support workspace built with React, Express, Prisma, PostgreSQL, and Google Gemini. It brings ticket triage, customer records, knowledge-base content, AI-assisted drafting, and operational reporting into one responsive application.

## Highlights

- Secure email/password authentication with refresh-token rotation in httpOnly cookies.
- Role-based access for administrators and agents.
- Ticket search, filters, pagination, bulk close, CSV export, messages, and audit records.
- Customer directory and knowledge base with create, edit, and soft-delete flows.
- Gemini-assisted drafting grounded in knowledge-base content; every reply remains human-reviewed.
- Data-backed dashboard and analytics, dark mode, responsive navigation, and accessible UI controls.
- Liveness and readiness probes: `GET /health` and `GET /ready`.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, Recharts |
| Backend | Node.js, Express, TypeScript, Zod |
| Data | PostgreSQL, Prisma |
| Auth | JWT, bcrypt, httpOnly cookies |
| AI | Google Gemini |
| Testing | Vitest, Testing Library, Supertest, Playwright |

## Local development

Requirements: Node.js 18.18+ and PostgreSQL 16+ (or Docker Desktop).

```bash
# Start PostgreSQL with Docker (from the repository root)
docker compose up -d postgres

# Backend
cd backend
cp .env.example .env
# Set DATABASE_URL to your local PostgreSQL connection string.
npm install
npm run db:migrate
npm run db:seed
npm run dev

# Frontend, in a second terminal
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The seeded demo users are:

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `demo@demo.com` | `Demo1234!` |
| Agent | `agent@demo.com` | `Demo1234!` |

## Environment variables

Copy `backend/.env.example` to `backend/.env`. The required variables are:

- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` — unique, long secrets for production.
- `CORS_ORIGIN` — allowed frontend origin (defaults to `http://localhost:5173`).

Optional AI configuration:

- `GEMINI_API_KEY` — enables AI drafting.
- `GEMINI_MODEL` — defaults to `gemini-2.5-flash`.

Optional Google sign-in configuration:

- Create a **Web application** OAuth client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- Add `http://localhost:4000/api/auth/google/callback` (or your deployed API equivalent) to **Authorized redirect URIs**.
- Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `FRONTEND_URL` in `backend/.env`.
- Apply the database migration with `npm run db:migrate` before deploying.

Set `VITE_API_URL` in the frontend only when the API is hosted at a different origin. Local Vite development proxies API calls to port 4000.

## Quality checks

```bash
# Frontend
cd frontend
npm run build
npm run lint
npm test

# Backend
cd backend
npm run build
npm run lint
npm test
```

Backend integration tests require a reachable disposable PostgreSQL database. The browser critical-path test also requires the frontend, backend, and seeded database to be running:

```bash
cd frontend
npm run test:e2e
```

## Deployment

Build the frontend with `npm run build` and serve `frontend/dist`. Build the backend with `npm run build`, configure the production environment variables, apply migrations with `npm run db:migrate:deploy`, and start with `npm start`.

For Docker deployment, run `docker compose up --build`, then execute migrations and seed data inside the backend container once:

```bash
docker compose exec backend npm run db:migrate:deploy
docker compose exec backend npm run db:seed
```

## License

MIT — see [LICENSE](./LICENSE).
