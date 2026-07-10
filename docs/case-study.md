# Case study: SupportCopilot

## Problem

Small support teams either pay for a full helpdesk platform they don't need
all of, or run tickets through a shared inbox with no structure, no
assignment, no history, and no way to answer faster without either
memorizing every policy or hunting through old threads. The teams that adopt
AI reply-drafting tools often get a black box that can send a wrong answer
with total confidence — which is worse than no automation at all if nobody
reviews it.

## Approach

I scoped this as a real, opinionated product rather than a feature grab:

- **Data model first.** Tickets, messages, customers, and knowledge base
  articles as first-class entities with real relationships (see
  `docs/architecture.md`), not a single flat table pretending to be
  everything.
- **Auth and authorization as load-bearing, not decorative.** Rotating
  refresh tokens, server-side RBAC, and row-level checks on every mutation —
  because a support tool holds customer data, and "logged in" isn't the same
  question as "allowed to touch this specific ticket."
- **The AI feature had to earn trust, not just exist.** Every draft is
  grounded in the knowledge base, clearly labeled, and stored as a draft an
  agent must open and explicitly send — I designed the UI (dashed violet
  card, "review before sending") before writing the endpoint, so the
  human-in-the-loop constraint was a product decision, not an afterthought
  bolted onto the API.
- **Every screen designed for four states before one line of styling:**
  loading (skeletons matching final layout), empty (with a real CTA), error
  (with retry), and success — because the states you skip in planning are
  the bugs you ship.

## Result

- A working helpdesk: sign up, verify, get assigned tickets, search/filter/
  sort a queue, generate and send an AI-grounded reply, track it all on a
  dashboard.
- Full test coverage of the riskiest logic: password hashing, CSV export
  edge cases, pagination boundaries, the auth flow, and — the one that
  matters most — row-level authorization (a different agent genuinely cannot
  touch someone else's ticket, verified by an integration test, not just a
  UI check).
- CI that blocks a merge on lint, typecheck, or test failure, not just a
  green checkmark for its own sake.
- Documentation that explains *why*, not just *what* — `docs/architecture.md`
  lists every trade-off I accepted (keyword search over embeddings, offset
  over cursor pagination, bcryptjs over native bcrypt) with the honest
  reasoning and the upgrade path, because a senior engineer's docs show their
  judgment, not just their output.

*(Add the live URL, a Loom walkthrough link, and 3–5 screenshots here once
deployed.)*

## What I learned

Building the AI feature last, after the data model and auth were solid, made
it trivial to add — grounding and human-review were the actual hard design
problems, and they're product decisions, not prompt-engineering tricks. The
part that took longest wasn't any single feature; it was resisting scope
creep on the 60+ project ideas and the long bonus-points list, and instead
finishing one product's core loop — create a ticket, triage it, resolve it
with help from AI, see it on a dashboard — all the way to a state I'd
actually hand a real support team.
