import { Client } from "@notionhq/client";
import { unstable_cache, revalidateTag } from "next/cache";
import seed from "@/data/seed.json";
import type {
  Audience,
  ContentType,
  Phase,
  Platform,
  Post,
  Status,
} from "./types";

const POSTS_TAG = "posts";

function notion(): Client | null {
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

function readMultiSelect(prop: any): string[] {
  return (prop?.multi_select ?? []).map((s: any) => s.name);
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
    phase: (readSelect(p.Phase) || "Phase 1 — Lock the Engine") as Phase,
    platforms: readMultiSelect(p.Platform) as Platform[],
    format: readText(p.Format),
    contentType: (readSelect(p["Content Type"]) ||
      "Cockpit Cinema") as ContentType,
    audience: (readSelect(p.Audience) || "Aviation Enthusiasts") as Audience,
    hook: readText(p.Hook),
    cta: readText(p.CTA),
    assetSource: readText(p["Asset Source"]),
    productionNotes: readText(p["Production Notes"]),
    status: (readSelect(p.Status) || "Planned") as Status,
    performanceNotes: readText(p["Performance Notes"]),
  };
}

async function fetchFromNotion(): Promise<Post[]> {
  const client = notion();
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!client || !databaseId) return [];

  const all: any[] = [];
  let cursor: string | undefined;
  do {
    const res = await client.databases.query({
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

function fromSeed(): Post[] {
  const data = seed as Array<Omit<Post, "id"> & { id?: string }>;
  return data
    .map((p, i) => ({
      id: p.id ?? `seed-${i}`,
      title: p.title,
      date: p.date,
      time: p.time,
      week: p.week,
      phase: p.phase as Phase,
      platforms: p.platforms as Platform[],
      format: p.format,
      contentType: p.contentType as ContentType,
      audience: p.audience as Audience,
      hook: p.hook,
      cta: p.cta,
      assetSource: p.assetSource,
      productionNotes: p.productionNotes,
      status: p.status as Status,
      performanceNotes: p.performanceNotes,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export const fetchPosts = unstable_cache(
  async (): Promise<{ posts: Post[]; source: "notion" | "seed" }> => {
    try {
      const live = await fetchFromNotion();
      if (live.length > 0) return { posts: live, source: "notion" };
    } catch (err) {
      console.error("Notion fetch failed:", err);
    }
    return { posts: fromSeed(), source: "seed" };
  },
  ["posts"],
  { revalidate: 300, tags: [POSTS_TAG] },
);

export function revalidatePosts() {
  revalidateTag(POSTS_TAG);
}

export async function importSeedToNotion(): Promise<{
  created: number;
  failed: number;
  errors: string[];
}> {
  const client = notion();
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!client || !databaseId) {
    throw new Error(
      "Missing NOTION_TOKEN or NOTION_DATABASE_ID environment variables.",
    );
  }

  const data = seed as Array<Omit<Post, "id">>;
  let created = 0;
  let failed = 0;
  const errors: string[] = [];

  const rt = (v: string) =>
    v ? { rich_text: [{ type: "text" as const, text: { content: v } }] } : { rich_text: [] };
  const sel = (v: string) => (v ? { select: { name: v } } : { select: null });
  const ms = (vs: string[]) => ({
    multi_select: vs.filter(Boolean).map((name) => ({ name })),
  });

  for (const post of data) {
    try {
      await client.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Title: { title: [{ type: "text", text: { content: post.title } }] },
          Date: { date: { start: post.date } },
          Time: rt(post.time),
          Week: { number: post.week },
          Phase: sel(post.phase),
          Platform: ms(post.platforms),
          Format: rt(post.format),
          "Content Type": sel(post.contentType),
          Audience: sel(post.audience),
          Hook: rt(post.hook),
          CTA: rt(post.cta),
          "Asset Source": rt(post.assetSource),
          "Production Notes": rt(post.productionNotes),
          Status: sel(post.status),
          "Performance Notes": rt(post.performanceNotes),
        },
      });
      created++;
    } catch (err: any) {
      failed++;
      errors.push(`${post.date} ${post.title}: ${err?.message ?? err}`);
    }
  }

  return { created, failed, errors };
}
