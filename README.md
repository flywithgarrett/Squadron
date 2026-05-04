# Squadron Content OS

A read-only content calendar dashboard for The Squadron NYC. Renders the 90-day editorial plan as a polished, Squadron-branded interface — calendar grid, filterable list, and pillar-grouped views — for the leadership team.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- shadcn-style UI primitives (zero Radix dependency, kept lean for read-only)
- `lucide-react` for icons
- Single-password cookie auth via middleware
- Posts live in `data/posts.json` — the source of truth, bundled with each deploy

## Local dev

```bash
pnpm install
cp .env.example .env.local
# set APP_PASSWORD
pnpm dev
```

Open `http://localhost:3000`. You'll be redirected to `/login`. Enter `APP_PASSWORD`.

## Editing posts

Posts are stored in `data/posts.json`. To change the calendar:

1. Edit `data/posts.json`
2. Commit and push
3. Vercel auto-deploys

Each post has these fields (see `lib/types.ts` for the type):

| Field             | Notes                                                        |
| ----------------- | ------------------------------------------------------------ |
| date              | ISO `YYYY-MM-DD`                                             |
| time              | e.g., "7:30 AM"                                              |
| week              | 1–13                                                         |
| phase             | `Phase 1 — Foundation` / `Phase 2 — Proof` / `Phase 3 — Convert` |
| platform          | `LinkedIn` / `Instagram` / `TikTok` / `YouTube`              |
| format            | e.g., "Document Carousel", "Reel (30s)"                      |
| pillar            | One of the five pillars (see `lib/pillars.ts`)               |
| audience          | e.g., "Decision-makers (Tier 1)"                             |
| title             | Working title                                                |
| hook              | First two lines / on-screen text                             |
| cta               | Call to action                                               |
| sourceNotes       | Asset / archive notes                                        |
| productionNotes   | Editing notes                                                |
| status            | `Planned` / `Shot` / `Edited` / `Scheduled` / `Posted` / `Killed` |
| performanceNotes  | Post-publish metrics                                         |

## Deploy to Vercel

1. Push this repo to GitHub
2. Import on Vercel → defaults are fine (Next.js detected)
3. **Environment Variables**: add `APP_PASSWORD`
4. Deploy

## Roles

There is no per-user auth in the app. Everyone with the dashboard URL uses the same `APP_PASSWORD`. The dashboard is read-only by design.

## Roadmap (v2)

- Inline post editing with a backing database (Postgres / Supabase)
- Native analytics integrations (IG / LinkedIn / TikTok / YouTube)
- Automated repurposing checklist (TikTok → Reel → Short)
- Slack notification when status flips to **Posted**
- Per-user roles and audit trail

## File map

```
app/
  layout.tsx                Root layout, Inter font, brand chrome
  page.tsx                  Redirects to /views/calendar
  globals.css               Tailwind v4 + brand tokens
  actions.ts                Server actions (logout)
  login/                    Single-password login
  api/auth/route.ts         POST password → set httpOnly cookie
  api/posts/route.ts        GET → JSON posts
  views/
    calendar/               Month-grid view (default)
    list/                   Filterable, sortable table
    pillars/                Accordion grouped by pillar
components/
  header.tsx                Squadron-branded top nav
  post-card.tsx             Reusable card with pillar accent stripe
  filter-bar.tsx            Multi-select platform / pillar / phase / status
  pillar-badge.tsx          Color-coded pillar pill
  platform-icon.tsx         IG / LI / TT / YT icons
  post-detail-panel.tsx     Side-panel with full post brief
  logout-button.tsx
  ui/                       card, badge, button, input, select, tabs
lib/
  posts.ts                  Reads data/posts.json
  types.ts                  Post, Pillar, Platform, Phase, Status
  pillars.ts                Pillar config (color, bg, description)
  format.ts                 Date helpers ("Tue, May 12")
  auth.ts                   Cookie + password helpers
  utils.ts                  cn()
middleware.ts               Cookie gate on every route except /login + /api/auth
data/
  posts.json                The 55-post 90-day plan — edit to change the calendar
```
