# 🎫 Support Copilot

<<<<<<< HEAD
> An AI-powered customer support and ticket management platform built with **React, Node.js, Express, Prisma, PostgreSQL, and Google Gemini AI**.

Support Copilot helps support teams manage customer tickets, collaborate efficiently, and generate AI-assisted responses using a Knowledge Base. All AI-generated replies are reviewed by a human before being sent.
=======
> A premium enterprise support platform for modern teams: ticket triage, knowledge-driven AI assistance, and a polished experience designed for scale.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

SupportCopilot brings together a refined support workspace, strong role-based access controls, and AI-assisted drafting grounded in your knowledge base. The experience now feels closer to the quality bar set by Linear, Stripe, and Vercel while staying fully functional and backward-compatible.

![Hero screenshot](docs/screenshots/hero.png)

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `demo@demo.com` | `Demo1234!` |
| Agent | `agent@demo.com` | `Demo1234!` |

Both are created by the seed script (`npm run db:seed` in `backend/`) —
never real accounts, safe to share publicly.

## Features

- Email/password auth with email verification, password reset, and rotating refresh tokens in httpOnly cookies.
- Server-enforced role-based access control for admins and agents.
- Ticket management with search, filters, sorting, pagination, bulk actions, and CSV export.
- Knowledge-base grounded AI drafting with human review before any reply is sent.
- Executive dashboard with charts for ticket volume, priority balance, status flow, and workload.
- Premium shell experience with polished navigation, refined cards, stronger typography, and accessible dark mode.
- Profile and account experience ready for future settings expansion.

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT with rotating refresh tokens and bcrypt hashing |
| AI | Gemini-powered drafting for support replies |
| Validation | Zod on the client and server |
| Data fetching | TanStack Query |
| Charts | Recharts |
| Testing | Vitest, Supertest, Testing Library, and Playwright |

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

See [docs/architecture.md](docs/architecture.md) for the data model, auth and authorization flow, AI drafting architecture, and the upgrade path for future enterprise features.

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

- [x] Auth, RBAC, and row-level authorization
- [x] Ticket CRUD with search, filter, sort, and pagination
- [x] AI-drafted, human-reviewed replies grounded in a knowledge base
- [x] Executive dashboard, audit log, CSV export, and bulk actions
- [ ] Real-time updates with WebSockets
- [ ] Embeddings-based knowledge retrieval
- [ ] Advanced analytics and SLA monitoring

## Screenshots

*(Add screenshots of the dashboard, ticket detail with an AI draft, and the
knowledge base to `docs/screenshots/` and reference them here.)*

## License

MIT — see [LICENSE](./LICENSE).
>>>>>>> f128602 (feat: redesign UI with premium dashboard and profile page)

---

## 🚀 Live Demo

🌐 **Frontend**

https://support-copilot-seven.vercel.app

⚙️ **Backend API**

https://support-copilot-m0k5.onrender.com

📂 **GitHub Repository**

https://github.com/Aravind628187/support-copilot

---

# 📸 Screenshots

> Add screenshots inside `docs/screenshots/`

| Dashboard | Tickets |
|------------|----------|
| Dashboard Screenshot | Ticket Screenshot |

| AI Draft | Knowledge Base |
|-----------|----------------|
| AI Draft Screenshot | KB Screenshot |

| Team | Audit Log |
|------|-----------|
| Team Screenshot | Audit Screenshot |

---

# ✨ Features

## 🔐 Authentication

- Secure Login
- User Registration
- JWT Authentication
- Rotating Refresh Tokens
- HTTP Only Cookies
- Email Verification
- Forgot Password
- Password Reset

---

## 👥 Role-Based Access Control

### 👑 Admin

- View all tickets
- Create tickets
- Update tickets
- Delete tickets
- Assign tickets
- Manage agents
- Create Knowledge Base articles
- Edit articles
- Delete articles
- View Audit Logs
- Dashboard Analytics

### 👨‍💻 Agent

- View assigned tickets
- Update assigned tickets
- Reply to customers
- Generate AI Drafts
- Read Knowledge Base

---

# 🎫 Ticket Management

- Create Ticket
- Update Ticket
- Delete Ticket
- Assign Ticket
- Search Tickets
- Filter Tickets
- Sort Tickets
- Pagination
- Bulk Close
- Export CSV
- Soft Delete

---

# 🤖 AI Features

Support Copilot integrates **Google Gemini AI** to help support agents respond faster.

Features include

- AI Reply Draft
- Context-aware Suggestions
- Knowledge Base Grounding
- Human Review Required
- Faster Customer Support

---

# 📚 Knowledge Base

- Create Articles
- Edit Articles
- Delete Articles
- Search Articles
- Tag Support
- AI Knowledge Grounding

---

# 📊 Dashboard

Visual analytics include

- Open Tickets
- Pending Tickets
- Closed Tickets
- Priority Distribution
- Status Distribution
- Average Resolution Time
- Agent Workload

---

# 📝 Audit Logs

Every important system activity is recorded.

Examples

- User Login
- Ticket Created
- Ticket Updated
- Ticket Deleted
- Knowledge Base Changes
- Team Management

---

# 🔍 Search

Search across

- Tickets
- Customers
- Knowledge Base

---

# 🛠 Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Lucide React

---

## Backend

- Node.js
- Express.js
- TypeScript

---

## Database

- PostgreSQL
- Prisma ORM

---

## Authentication

- JWT
- Refresh Tokens
- HTTP Only Cookies
- bcrypt

---

## AI

- Google Gemini API

---

## Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

---

# 📂 Project Structure

```text
support-copilot

├── frontend
│
│   ├── src
│   ├── api
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── lib
│   ├── pages
│   ├── styles
│   └── types
│
├── backend
│
│   ├── prisma
│   ├── src
│   │
│   ├── config
│   ├── lib
│   ├── middleware
│   ├── modules
│   ├── utils
│   ├── routes
│   ├── app.ts
│   └── server.ts
│
└── README.md
```

---

# ⚙️ Installation

Clone repository

```bash
git clone https://github.com/Aravind628187/support-copilot.git

cd support-copilot
```

Backend

```bash
cd backend

npm install

cp .env.example .env

npx prisma migrate deploy

npm run seed

npm run dev
```

Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

```env
DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

CORS_ORIGIN=

GEMINI_API_KEY=
```

---

# 📡 API Modules

Authentication

```
POST /auth/signup

POST /auth/login

POST /auth/logout

GET /auth/me
```

Tickets

```
GET /tickets

POST /tickets

PATCH /tickets/:id

DELETE /tickets/:id
```

Knowledge Base

```
GET /kb

POST /kb

PATCH /kb/:id

DELETE /kb/:id
```

Dashboard

```
GET /dashboard
```

Users

```
GET /users

PATCH /users/:id
```

Audit Logs

```
GET /audit
```

---

# 🔒 Security

- JWT Authentication
- Refresh Tokens
- HTTP Only Cookies
- bcrypt Password Hashing
- Role-Based Authorization
- Protected Routes
- Zod Validation
- Prisma ORM

---

# 📈 Future Improvements

- Customer Portal
- File Uploads
- Email Notifications
- Real-Time Updates
- WebSockets
- AI Semantic Search (RAG)
- Docker Support
- Kubernetes Deployment
- Automated Testing
- Multi-language Support

---

# 👨‍💻 Author

## Aravind Kumar

B.Tech CSE (AI & ML)

📧 Email

chithamanaravind@gmail.com

🐙 GitHub

https://github.com/Aravind628187

💼 LinkedIn

https://www.linkedin.com/in/chinthamanuaravindkumar/

🌐 Portfolio
https://aravind-kumar-portfolio.vercel.app/

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you like this project, don't forget to ⭐ the repository.

---

# 📜 License

Licensed under the MIT License.

---

## ⭐ If you found this project useful, please give it a Star.
