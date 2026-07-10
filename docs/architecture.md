# Architecture

## Data model

```
User ──< Ticket (assignee)          Customer ──< Ticket
User ──< TicketMessage (author)     Ticket ──< TicketMessage
User ──< KnowledgeBaseArticle       User ──< AuditLog (actor)
User ──< RefreshToken
User ──< PasswordResetToken
User ──< EmailVerificationToken
```

```
┌─────────────┐        ┌──────────────┐        ┌──────────────────┐
│   Customer   │───1:N──│    Ticket    │───1:N──│  TicketMessage    │
└─────────────┘        │ status       │        │ authorType        │
                        │ priority     │        │ isAiDraft         │
                        │ assigneeId ──┼──N:1───▶│                  │
                        └──────────────┘        └──────────────────┘
                               ▲                          ▲
                               │ N:1                      │ N:1 (nullable)
                        ┌──────┴───────┐                  │
                        │     User     │──────────────────┘
                        │ role: ADMIN/AGENT │
                        └──────┬───────┘
                               │ 1:N
                 ┌─────────────┼─────────────────┐
                 ▼             ▼                 ▼
          RefreshToken   AuditLog        KnowledgeBaseArticle
```

Full field-level detail lives in `backend/prisma/schema.prisma` — that file
is the single source of truth; this doc explains the *why*, not the *what*.

## Auth & authorization

- **Sessions** are two JWTs in httpOnly, Secure (in production), SameSite=Lax
  cookies: a short-lived access token (15 min) and a longer refresh token (7
  days) scoped to `/api/auth` only. Every refresh **rotates** the refresh
  token — the old one is marked revoked, so replaying a stolen-but-already-used
  token kills every session for that user rather than silently trusting it.
- **RBAC** (`Role.ADMIN` / `Role.AGENT`) is checked server-side in
  `middleware/rbac.ts` against the role loaded fresh from the database on
  every request — never against a role the client claims to have.
- **Row-level authorization**: an agent may only modify a ticket that is
  unassigned or assigned to them; admins can modify any ticket
  (`tickets.service.ts#assertCanModify`). This is checked in the service
  layer, not just the UI, so a crafted request can't bypass it.
- **Email verification** gates every write action (`requireVerified`
  middleware) but not reads — an unverified agent can look around before
  confirming their email.

## The AI draft-reply feature

`POST /api/tickets/:id/messages/draft` is the one AI-native surface in the
app. On call it:

1. Pulls the ticket + message thread (customer/agent turns only — never a
   previous AI draft, so drafts can't compound on each other).
2. Retrieves up to 3 knowledge base articles via **keyword matching**
   (`kb.service.ts#findRelevantArticles`) — every word over 3 characters in
   the ticket subject/description becomes an OR'd `ILIKE` term, ranked by
   how many terms matched.
3. Sends both to Claude with a system prompt that explicitly instructs it to
   ground every claim in the retrieved KB content and say so plainly if the
   KB doesn't cover the issue, rather than inventing an answer.
4. Stores the result as a `TicketMessage` with `isAiDraft: true` —
   **it is never shown to the customer and never sent automatically.** An
   agent must open it, optionally edit it, and explicitly click send, which
   is the only path that flips `isAiDraft` to `false` and attributes the
   message to that agent.

The UI reinforces this: AI drafts render in a visually distinct dashed
violet card labeled "AI DRAFT — review before sending," never mixed in with
the styling used for messages that were actually sent.

## Trade-offs we accepted (and the honest reason why)

**Keyword search instead of embeddings for KB retrieval.** A vector index
(pgvector + embeddings) would retrieve more semantically relevant articles,
especially as the KB grows past a few hundred entries. For a KB this size,
keyword matching is transparent, debuggable without extra infrastructure,
and good enough — the natural upgrade path is documented right in
`kb.service.ts`.

**Offset pagination instead of keyset/cursor pagination.** The handbook
recommends cursor pagination past ~10k rows because offset pagination's
performance degrades at that scale. This app's ticket volume won't approach
that in a trial context, so we took the simpler, more readable
implementation and left a comment at the one call site that would need to
change (`utils/pagination.ts`).

**bcryptjs instead of native bcrypt.** Pure JS costs a little speed but
removes a native-module build step that regularly breaks `npm install` on
whatever machine a reviewer happens to be using. Cost factor 12 still meets
the handbook's floor.

**Separate frontend/backend packages instead of a shared-package monorepo.**
Validation rules exist in two files (`backend/.../*.schema.ts` and
`frontend/src/lib/validation.ts`) instead of one shared import, because the
two apps deploy independently (Vercel/Netlify for the SPA, anywhere with a
Postgres connection for the API) and a shared npm workspace package adds
build-tooling complexity that isn't worth it at this scale. The two are kept
rule-for-rule identical by convention; an npm workspaces + shared
`@support-copilot/schemas` package is the natural next step if they ever
drift.

**Client-rendered SPA instead of Next.js/SSR.** This matches the resume's
existing React + Node/Express stack (as used in the HUB Cars project)
rather than introducing a new framework. The real cost: crawlers that don't
execute JavaScript only see the static tags in `index.html`, not
`react-helmet-async`'s per-route overrides, and there's no per-route
server-rendered OG image. `robots.txt` and a static `sitemap.xml` cover what
a CSR app can honestly offer; prerendering (`vite-plugin-ssr`) or a move to
Next.js is the documented upgrade path if organic search traffic becomes a
priority.

**First signup becomes admin.** There's no seed-only "create the first
admin" script step — whoever signs up first on a fresh database is
bootstrapped as `ADMIN` (`auth.service.ts#signup`). Simple, and fine for a
small-team tool; a multi-tenant version would need an invite-only flow
instead.

**Docker Compose is for local development, not the recommended deploy
path.** The README's primary deploy instructions are Vercel/Netlify
(frontend) + a managed Postgres (Neon/Supabase) for the backend, matching
the handbook's recommendation and avoiding the operational overhead of
running your own containers in production. The Dockerfiles and
`docker-compose.yml` exist so the whole stack also runs identically on any
machine with Docker installed — useful for local dev and for demonstrating
containerization skills — but production deploys should use the platform
guide in the README.
