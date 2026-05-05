# Squadron Content OS

A self-contained content operations dashboard for The Squadron NYC. The 90-day plan ships with the deploy — the dashboard reads from `data/seed.json`, no external services. Three views (Calendar, List, Types) under single-password access.

## Stack

- Next.js 15 (App Router) + TypeScript, RSC by default
- Tailwind CSS v4 with a custom design system (no shadcn)
- `lucide-react` for utility icons; custom SVG glyphs for platforms and the Squadron mark
- Single-password cookie auth via middleware
- Vercel deployment

## Design notes

The interface is built to a deliberate bar — Apple Music / iOS Health / Linear, not a typical SaaS dashboard. Hairline borders only, tabular numerals on every numeric output, 200ms `cubic-bezier(0.32, 0.72, 0, 1)` easing, no gradients, no emoji, no shadows beyond a single 1px offset for the most subtle elevation. Content-type accents render as 2-3px left borders, never as fills. The Squadron wing mark sits in the top-right corner of every dashboard route. The 1px gold underline on the active nav item is the only color flourish in the chrome.

## Local dev

```bash
pnpm install
cp .env.example .env.local
# set APP_PASSWORD
pnpm dev
```

Open `http://localhost:3000`. You'll be redirected to `/login`. Enter `APP_PASSWORD`. The dashboard lives at `/calendar`.

## Editing the calendar

Posts are stored in `data/seed.json`. Two ways to update:

1. **Direct JSON edit** — open `data/seed.json`, edit the entries, commit and push. Vercel redeploys.
2. **Regenerate from the script** — edit the beat libraries in `scripts/generate-seed.ts`, then:
   ```bash
   pnpm seed:gen
   ```
   This rewrites `data/seed.json` deterministically using the cadence rules:
   - Daily Stories tracked as one weekly recurring entry
   - 2-3 Reels per week (alternating)
   - 3-4 Trial Reels per week (hook tests for non-followers)
   - TikTok ramps 3 → 4 → 5 → 6 per week across the phases
   - Daily YouTube Shorts (Phase 1 = back catalog, Phase 2+ = same-day Reel repurposes)
   - 1 LinkedIn post per week (alternating Tue / Thu morning)

## Deploy to Vercel

1. Push this repo to GitHub
2. Import on Vercel — defaults are fine (Next.js detected)
3. **Environment Variables**: add `APP_PASSWORD`
4. Deploy

That's the only env var. The whole 90-day plan ships in the bundle.

## Roles

There is no per-user auth. Everyone with the dashboard URL uses the same `APP_PASSWORD`. The dashboard is read-only by design — to update posts, edit `data/seed.json` and redeploy.

## Roadmap (v2)

- Inline post editing with a backing database
- Native analytics integrations (IG / TikTok / YouTube / LinkedIn)
- Automated repurposing checklist (Reel → TikTok → Short)
- Slack notification when status flips to **Posted**
- Per-user roles and audit trail in app code

## File map

```
app/
  layout.tsx                    Root layout, Inter font
  page.tsx                      Redirects to /calendar
  globals.css                   Design tokens — canvas, ink, hairlines, Apple easing
  actions.ts                    Server actions (logout)
  login/                        Single-password access — Squadron lockup centered
  api/auth/route.ts             POST password → set httpOnly cookie
  api/posts/route.ts            GET → JSON posts (data feed for future tools)
  (dashboard)/
    layout.tsx                  Dashboard chrome + mobile tab bar
    calendar/                   Month grid (md+) / iOS-style agenda (mobile)
    list/                       Sticky-grouped agenda with filters
    types/                      Strategic mix by content type
components/
  shell/                        Header, sign out, mobile bottom tab bar
  primitives/                   Custom card, badge, button, input, select
  posts/                        post-card, post-detail-sheet, content-type-indicator
  filters/                      filter-bar
  icons/                        Squadron wing mark + custom platform glyphs
lib/
  posts.ts                      Reads data/seed.json (the source of truth)
  types.ts                      Post + enum types
  content-types.ts              Five content types + accent colors
  format.ts                     Date formatters (tabular)
  auth.ts                       Cookie + password helpers
  utils.ts                      cn()
middleware.ts                   Cookie gate (allows /login + /api/auth)
data/
  seed.json                     The 90-day plan — source of truth, committed
scripts/
  generate-seed.ts              Deterministic seed generator (pnpm seed:gen)
```
