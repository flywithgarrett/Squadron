# Squadron Content OS

A content operations dashboard for The Squadron NYC. Four views — Calendar, Brainstorm, List, Types — plus a single-password gate, all in one Next.js 15 app. Posts ship in `data/seed.json`. Status updates, ideas, and AI-generated scripts persist in Upstash Redis. AI generation runs through the Anthropic API.

## Stack

- Next.js 15 (App Router) + TypeScript, RSC by default
- Tailwind CSS v4 with a custom design system (no shadcn)
- Upstash Redis via `@upstash/redis` for ideas + status overrides + promoted posts
- Anthropic API via `@anthropic-ai/sdk` for AI script generation (Sonnet 4.6)
- `lucide-react` for utility icons; custom SVG glyphs for platforms and the Squadron mark
- Single-password cookie auth via middleware

## Local dev

```bash
pnpm install
cp .env.example .env.local
# fill in APP_PASSWORD; the others are optional locally
pnpm dev
```

The dashboard works without `UPSTASH_*` or `ANTHROPIC_API_KEY` — the calendar/list/types views still render from seed. The brainstorm capture and status updates are gated and show a quiet "connect storage" notice. AI generation shows "connect ANTHROPIC_API_KEY".

## Connecting Upstash Redis (for ideas, status, promote)

1. In your Vercel project: **Storage** → **Create Database** → **Upstash for Redis**
2. Pick a region close to your function region
3. Click **Connect Project** → environment variables auto-populate (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
4. Redeploy

That's it. No schema migration, no seeding step.

## Connecting the Anthropic API (for AI script generation)

1. https://console.anthropic.com/ → **API Keys** → create a key
2. In Vercel **Settings** → **Environment Variables**: add `ANTHROPIC_API_KEY`
3. Redeploy

The system prompt enforces the Squadron voice rules: cinematic-but-human, words like *mission / brief / debrief / sortie / wingman / cockpit / ignition*, no *fun / awesome / amazing / cool / hangout / party*, one exclamation point max, hooks that stop the scroll, limited em dashes.

## Editing the calendar

Two ways to update the plan:

1. **Edit `data/seed.json`** directly, commit, push. Vercel redeploys.
2. **Use Brainstorm → Promote to post**. Capture an idea, optionally generate a script, then promote — a new post is created, stored in Redis, and merged into the calendar at read time.

To regenerate the seed from the script:

```bash
pnpm seed:gen
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import on Vercel
3. Set `APP_PASSWORD`. Connect Upstash Redis (auto-injects `UPSTASH_*`). Add `ANTHROPIC_API_KEY`.
4. Deploy

## Roles

There is no per-user auth in the app. Everyone with the dashboard URL uses `APP_PASSWORD`. The calendar is shared. Status updates are global — when one person marks a post Posted, everyone sees it.

## Roadmap (v2)

- Drag-and-drop rescheduling on the calendar
- Real-time collaboration on idea cards
- Native analytics integrations (IG / TikTok / YouTube / LinkedIn)
- Per-user audit trail

## File map

```
app/
  layout.tsx                          Root layout, Inter font
  page.tsx                            Redirects to /calendar
  globals.css                         Design tokens — canvas, ink, hairlines, Apple easing
  actions.ts                          Server actions (logout)
  login/                              Single-password access
  api/
    auth/route.ts                     POST password → set httpOnly cookie
    posts/route.ts                    GET → JSON posts (seed + KV merged)
    posts/status/route.ts             PATCH → update post status in KV
    posts/promote/route.ts            POST → create post from idea
    ideas/route.ts                    GET / POST ideas
    ideas/[id]/route.ts               PATCH / DELETE idea
    ideas/generate/route.ts           POST → Anthropic script generation
  (dashboard)/
    layout.tsx                        Dashboard chrome + mobile tab bar
    calendar/                         Month grid + phase strip + per-day progress bars
    brainstorm/                       Capture box + idea stream + AI script generator
    list/                             Sticky-grouped agenda + progress filter chips
    types/                            Strategic mix + per-type completion bars
components/
  shell/                              Header, mobile tab bar, sign out, phase strip
  primitives/                         Custom card, badge, button, input, select
  posts/                              post-card, post-detail-sheet (with status selector),
                                      status-indicator, status-selector, progress-bar
  brainstorm/                         capture-box, idea-card, script-generator,
                                      generated-script-card, promote-sheet
  filters/                            filter-bar, progress-filter-chips
  icons/                              Squadron wing mark + custom platform glyphs
lib/
  posts.ts                            Reads seed.json + merges KV overrides + promoted posts
  storage.ts                          Upstash Redis CRUD (graceful fallback when not configured)
  anthropic.ts                        Claude client + Squadron voice system prompt
  types.ts                            Post, Idea, ProgressGroup, enums
  content-types.ts                    Five content types + accent colors
  format.ts                           Date formatters, relative time
  phases.ts                           Phase boundaries + active-phase detection
  auth.ts                             Cookie + password helpers
  utils.ts                            cn()
middleware.ts                         Cookie gate (allows /login + /api/auth)
data/
  seed.json                           The 90-day plan baseline — source of truth
scripts/
  generate-seed.ts                    Deterministic seed generator (pnpm seed:gen)
```
