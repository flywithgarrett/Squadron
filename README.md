# Squadron Content OS

A read-only content calendar dashboard for The Squadron NYC. Reads a 90-day editorial plan from a Notion database and renders it as a polished, Squadron-branded interface — calendar grid, filterable list, and pillar-grouped views — for the leadership team to track without ever opening Notion.

The Notion database is the source of truth: Sam edits it directly; the dashboard syncs.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- shadcn-style UI primitives (zero Radix dependency, kept lean for read-only)
- `@notionhq/client` for live data
- `lucide-react` for icons
- Single-password cookie auth via middleware

## 1. Initial Notion setup

### 1a. Create the integration

1. Go to https://www.notion.so/my-integrations
2. Click **New integration**, name it "Squadron Content OS", choose the workspace
3. After creation, copy the **Internal Integration Token** — this is your `NOTION_TOKEN`

### 1b. Create the database

Create a new full-page database in Notion (any workspace location). Add the properties below exactly as named — the import script and live sync depend on these:

| Property name        | Type        | Options / Notes                                                                                        |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| Title                | Title       | (default — rename if needed)                                                                           |
| Date                 | Date        | Scheduled post date                                                                                    |
| Time                 | Rich text   | e.g., "7:30 AM"                                                                                        |
| Week                 | Number      | 1–13                                                                                                   |
| Phase                | Select      | `Phase 1 — Foundation`, `Phase 2 — Proof`, `Phase 3 — Convert`                                         |
| Platform             | Select      | `LinkedIn`, `Instagram`, `TikTok`, `YouTube`                                                           |
| Format               | Rich text   | e.g., "Document Carousel", "Reel (30s)"                                                                |
| Pillar               | Select      | `1 — Cockpit Cinema`, `2 — Mission Debrief`, `3 — Client Voice`, `4 — Methodology`, `5 — Booking the Mission` |
| Audience             | Rich text   | e.g., "Decision-makers (Tier 1)"                                                                       |
| Hook                 | Rich text   | First two lines / on-screen text                                                                       |
| CTA                  | Rich text   | Call to action                                                                                         |
| Source Notes         | Rich text   | Asset / archive notes                                                                                  |
| Production Notes     | Rich text   | Editing notes                                                                                          |
| Status               | Select      | `Planned`, `Shot`, `Edited`, `Scheduled`, `Posted`, `Killed`                                           |
| Performance Notes    | Rich text   | Post-publish metrics                                                                                   |

Tip: the Select option names need to match exactly (em-dashes included). The import script will create options on first use, but it is cleaner to pre-seed them.

### 1c. Connect the integration to the database

Open the database page → **...** menu → **Connections** → search for "Squadron Content OS" → **Confirm**. Without this step the API will 404.

### 1d. Copy the database ID

The URL of your database looks like:

```
https://www.notion.so/<workspace>/<DATABASE_ID>?v=...
```

The `<DATABASE_ID>` segment (32 hex chars) is your `NOTION_DATABASE_ID`.

### 1e. Populate with seed data (one-time)

```bash
cp .env.example .env.local
# Edit .env.local and paste your APP_PASSWORD, NOTION_TOKEN, NOTION_DATABASE_ID

pnpm install
pnpm import
```

This creates 55 pages — the full 90-day plan.

## 2. Local dev

```bash
pnpm install
cp .env.example .env.local
# fill in env vars
pnpm dev
```

Open `http://localhost:3000`. You'll be redirected to `/login`. Enter `APP_PASSWORD`. The dashboard lives at `/views/calendar`.

If `NOTION_TOKEN` is unset or the database is empty, the dashboard falls back to `data/seed.json` so you can preview the UI before connecting Notion.

## 3. Deploy to Vercel

1. Push this repo to GitHub
2. Import on Vercel → choose the repo → defaults are fine (Next.js detected)
3. **Environment Variables**: add `APP_PASSWORD`, `NOTION_TOKEN`, `NOTION_DATABASE_ID`
4. Deploy

The Notion fetch is wrapped in `unstable_cache` with a 5-minute revalidation tag. The **Sync from Notion** button in the header invalidates that cache server-side, forcing a fresh pull on the next request.

## 4. Roles

There is no per-user auth in the app. Roles are enforced at the Notion level:

- **Sam** — added as a **full-access editor** on the Notion database. Edits there flow into the dashboard.
- **Leadership / The Squadron team** — added as **viewers** on the Notion database (or simply use the dashboard).
- **Everyone with the dashboard** — uses the same `APP_PASSWORD` to enter. The dashboard is read-only by design.

This matches the Creator OS pattern Sam already runs on.

## 5. Roadmap (v2)

- Inline post editing in the dashboard (no Notion round-trip)
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
  actions.ts                Server actions (sync cache, logout)
  login/page.tsx            Single-password login
  api/auth/route.ts         POST password → set httpOnly cookie
  api/posts/route.ts        GET → JSON posts (used by SDKs / future tools)
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
  sync-button.tsx           Cache invalidation button
  logout-button.tsx
  ui/                       card, badge, button, input, select, tabs
lib/
  notion.ts                 Notion client + cached fetch + seed fallback
  types.ts                  Post, Pillar, Platform, Phase, Status
  pillars.ts                Pillar config (color, bg, description)
  format.ts                 Date helpers ("Tue, May 12")
  auth.ts                   Cookie + password helpers
  utils.ts                  cn()
middleware.ts               Cookie gate on every route except /login + /api/auth
data/
  seed.json                 55-post 90-day plan (source for import script)
scripts/
  import-to-notion.ts       One-time bulk import to the Notion database
```
