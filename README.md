# Squadron Content OS

A read-only content operations dashboard for The Squadron NYC. Reads the 90-day editorial plan from a Notion database and renders it as three views — calendar grid, filterable list, and content-type breakdown — under single-password access. The Content Lead and leadership edit posts inside Notion directly. The web app reads, never writes; multi-user access is enforced at the Notion permission level.

## Stack

- Next.js 15 (App Router) + TypeScript, RSC by default
- Tailwind CSS v4 with a custom design system (no shadcn)
- `@notionhq/client` with `unstable_cache` (5-min revalidation, tag-based invalidation)
- `lucide-react` for utility icons; custom SVG glyphs for platforms
- Single-password cookie auth via middleware
- Vercel deployment

## Design notes

The interface is built to a deliberate bar — Apple Music / iOS Health / Linear, not Notion or Vercel marketing. Hairline borders only (`rgba(10, 37, 64, 0.08)`), tabular numerals, 200ms `cubic-bezier(0.32, 0.72, 0, 1)` easing, no gradients, no emoji, no shadows beyond the most subtle elevation. Content-type accents render as 3px left borders on cards, never as fills. The 1px gold underline on active nav items is the only color flourish.

## 1 — Notion setup

### 1a. Create the integration

1. Visit https://www.notion.so/my-integrations
2. **New integration** → name "Squadron Content OS", choose workspace
3. Copy the **Internal Integration Token** — this is your `NOTION_TOKEN`

### 1b. Create the database

Create a full-page database in Notion with the properties below. Names and select-option values must match exactly (em-dashes included):

| Property            | Type         | Options / Notes                                                                                                                |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Title               | Title        | Working title of the post                                                                                                      |
| Date                | Date         | Scheduled post date                                                                                                            |
| Time                | Rich text    | e.g., "7:30 AM"                                                                                                                |
| Week                | Number       | 1–13                                                                                                                           |
| Phase               | Select       | `Phase 1 — Lock the Engine`, `Phase 2 — Push the Winners`, `Phase 3 — Scale What Works`                                        |
| Platform            | Multi-select | `Instagram Reel`, `Instagram Trial Reel`, `Instagram Story`, `TikTok`, `YouTube Short`, `LinkedIn`                             |
| Format              | Rich text    | Free-form (e.g., "Reel (30s)", "Document Carousel")                                                                            |
| Content Type        | Select       | `Cockpit Cinema`, `Instructor & BTS`, `Client Reactions`, `Hook-Driven Discovery`, `B2B Credibility`                           |
| Audience            | Select       | `Aviation Enthusiasts`, `Gift Buyers`, `NYC Experience Seekers`, `Corporate Decision Makers`                                   |
| Hook                | Rich text    | First two lines / on-screen text                                                                                               |
| CTA                 | Rich text    | Call to action                                                                                                                 |
| Asset Source        | Rich text    | Where footage comes from                                                                                                       |
| Production Notes    | Rich text    | Editing notes                                                                                                                  |
| Status              | Select       | `Planned`, `Captured`, `Edited`, `Scheduled`, `Posted`, `Killed`                                                               |
| Performance Notes   | Rich text    | Post-publish metrics                                                                                                           |

### 1c. Connect the integration

Open the database → `…` menu → **Connections** → search "Squadron Content OS" → **Confirm**. Without this step the API will 404.

### 1d. Copy the database ID

The URL looks like `https://www.notion.so/<workspace>/<DATABASE_ID>?v=...`. The 32-char hex segment is your `NOTION_DATABASE_ID`.

## 2 — Local dev

```bash
pnpm install
cp .env.example .env.local
# fill in APP_PASSWORD, NOTION_TOKEN, NOTION_DATABASE_ID, SEED_SECRET
pnpm dev
```

If `NOTION_TOKEN` is unset or the database is empty, the dashboard renders from `data/seed.json` so you can preview the UI before connecting Notion.

## 3 — Deploy to Vercel

1. Push this repo to GitHub
2. Import on Vercel — Next.js detected, defaults are fine
3. **Environment Variables**: set `APP_PASSWORD`, `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `SEED_SECRET`
4. Deploy

## 4 — One-time seed import

After deploying with the four env vars set, hit this URL in a browser to populate Notion from `data/seed.json`:

```
https://YOUR-DOMAIN/api/seed?secret=YOUR_SEED_SECRET
```

The route returns `{ ok: true, created, failed }`. It logs detailed errors server-side. Run once — re-running creates duplicates.

After it succeeds, click the **Sync** button in the header to invalidate the cache and pull the live Notion data.

## 5 — Roles (Notion permissions)

There is no per-user auth in the app. Roles are enforced at the Notion level:

- **Content Lead** — added as **full-access editor** on the Notion database. Edits flow into the dashboard within ~5 minutes (or instantly via Sync).
- **Squadron leadership** — added as **viewers** (or simply use the dashboard).
- **Everyone with the dashboard URL** — uses the shared `APP_PASSWORD`. Read-only by design.

## 6 — Regenerating seed data

```bash
pnpm seed:gen
```

This rewrites `data/seed.json` deterministically using the cadence and voice rules in `scripts/generate-seed.ts`. Edit the script, regenerate, commit. The script:

- Starts from the first Monday of the plan (`2026-05-11`)
- 13 weeks, three phases
- Daily Stories tracked as one weekly recurring entry
- 2-3 Reels/week (alternating)
- 3-4 Trial Reels/week (hook tests for non-followers)
- TikTok ramps 3 → 4 → 5 → 6 per week across the phases
- Daily YouTube Shorts (Phase 1 = back catalog, Phase 2+ = same-day Reel repurposes)
- 1 LinkedIn post per week (alternating Tue / Thu morning)

## 7 — Roadmap (v2)

- Inline post editing (no Notion round-trip)
- Native analytics integrations (IG / TikTok / YouTube / LinkedIn)
- Automated repurposing checklist (Reel → TikTok → Short)
- Slack notification when status flips to **Posted**
- Per-user roles and audit trail in app code

## File map

```
app/
  layout.tsx                    Root layout, Inter font
  page.tsx                      Redirects to /calendar
  globals.css                   Tailwind v4 + design tokens
  actions.ts                    Server actions (logout)
  login/                        Single-password access
  api/auth/route.ts             POST password → set httpOnly cookie
  api/revalidate/route.ts       Cache bust for posts tag
  api/seed/route.ts             One-time bulk import from seed.json
  (dashboard)/
    layout.tsx                  Dashboard chrome + mobile tab bar
    calendar/                   Month-grid view (default)
    list/                       Sticky-grouped agenda with filters
    types/                      Strategic mix by content type
components/
  shell/                        Header, sync button, sign out, mobile nav
  primitives/                   Custom card, badge, button, input, select
  posts/                        post-card, post-detail-sheet, content-type-indicator
  filters/                      filter-bar
  icons/                        Custom SVG platform glyphs
lib/
  notion.ts                     Notion client + cached fetch + seed import
  types.ts                      Post + enum types
  content-types.ts              Five content types + accent colors
  format.ts                     Date formatters (tabular)
  auth.ts                       Cookie + password helpers
  utils.ts                      cn()
middleware.ts                   Cookie gate (allows /login, /api/auth, /api/seed)
data/
  seed.json                     Generated 90-day plan (~247 posts)
scripts/
  generate-seed.ts              Deterministic seed generator
```
