import { Client } from "@notionhq/client";
import { unstable_cache, revalidateTag } from "next/cache";
import seed from "@/data/seed.json";
import type { Phase, Pillar, Platform, Post, Status } from "./types";

const POSTS_TAG = "squadron-posts";

function getNotion(): Client | null {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  return new Client({ auth: token });
}

function readText(prop: any): string {
  if (!prop) return "";
  if (prop.type === "rich_text") {
    return (prop.rich_text ?? []).map((r: any) => r.plain_text).join("").trim();
  }
  if (prop.type === "title") {
    return (prop.title ?? []).map((r: any) => r.plain_text).join("").trim();
  }
  return "";
}

function readSelect(prop: any): string {
  return prop?.select?.name ?? "";
}

function readDate(prop: any): string {
  return prop?.date?.start ?? "";
}

function readNumber(prop: any): number {
  return typeof prop?.number === "number" ? prop.number : 0;
}

function mapNotionToPost(page: any): Post {
  const p = page.properties ?? {};
  return {
    id: page.id,
    title: readText(p.Title) || readText(p.Name),
    date: readDate(p.Date),
    time: readText(p.Time),
    week: readNumber(p.Week),
    phase: (readSelect(p.Phase) || "Phase 1 — Foundation") as Phase,
    platform: (readSelect(p.Platform) || "LinkedIn") as Platform,
    format: readText(p.Format),
    pillar: (readSelect(p.Pillar) || "1 — Cockpit Cinema") as Pillar,
    audience: readText(p.Audience),
    hook: readText(p.Hook),
    cta: readText(p.CTA),
    sourceNotes: readText(p["Source Notes"]),
    productionNotes: readText(p["Production Notes"]),
    status: (readSelect(p.Status) || "Planned") as Status,
    performanceNotes: readText(p["Performance Notes"]),
  };
}

async function fetchFromNotion(): Promise<Post[]> {
  const notion = getNotion();
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!notion || !databaseId) return [];

  const all: any[] = [];
  let cursor: string | undefined;

  do {
    const res = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      start_cursor: cursor,
      sorts: [{ property: "Date", direction: "ascending" }],
    });
    all.push(...res.results);
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined;
  } while (cursor);

  return all.map(mapNotionToPost).filter((p) => p.date);
}

function fallbackFromSeed(): Post[] {
  return (seed as Array<Omit<Post, "id"> & { id?: string }>).map((p, i) => ({
    id: p.id ?? `seed-${i}`,
    title: p.title,
    date: p.date,
    time: p.time,
    week: p.week,
    phase: p.phase,
    platform: p.platform,
    format: p.format,
    pillar: p.pillar,
    audience: p.audience,
    hook: p.hook,
    cta: p.cta,
    sourceNotes: p.sourceNotes,
    productionNotes: p.productionNotes,
    status: p.status,
    performanceNotes: p.performanceNotes,
  }));
}

export const getPosts = unstable_cache(
  async (): Promise<{ posts: Post[]; source: "notion" | "seed" }> => {
    try {
      const fromNotion = await fetchFromNotion();
      if (fromNotion.length > 0) {
        return { posts: fromNotion, source: "notion" };
      }
    } catch (err) {
      console.error("Notion fetch failed:", err);
    }
    return { posts: fallbackFromSeed(), source: "seed" };
  },
  ["squadron-posts"],
  { revalidate: 300, tags: [POSTS_TAG] },
);

export function invalidatePostsCache() {
  revalidateTag(POSTS_TAG);
}
