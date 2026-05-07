import seed from "@/data/seed.json";
import type {
  Audience,
  ContentType,
  Phase,
  Platform,
  Post,
  Status,
} from "./types";
import { getPromotedPosts, getStatusOverrides } from "./storage";

const seedPosts: Post[] = (
  seed as Array<Omit<Post, "id"> & { id?: string }>
).map((p, i) => ({
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
}));

export function getStaticPosts(): Post[] {
  return seedPosts;
}

export async function getPosts(): Promise<Post[]> {
  const [overrides, promoted] = await Promise.all([
    getStatusOverrides(),
    getPromotedPosts(),
  ]);

  const merged = seedPosts.map((p) => {
    const override = overrides[p.id];
    return override ? { ...p, status: override } : p;
  });

  for (const p of promoted) {
    const override = overrides[p.id];
    merged.push(override ? { ...p, status: override } : p);
  }

  return merged.sort((a, b) =>
    a.date === b.date
      ? a.time.localeCompare(b.time)
      : a.date.localeCompare(b.date),
  );
}

export function findNextOpenDate(
  posts: Post[],
  startISO: string = new Date().toISOString().slice(0, 10),
): string {
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.date, (counts.get(p.date) ?? 0) + 1);

  const start = new Date(startISO);
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    if ((counts.get(iso) ?? 0) < 2) return iso;
  }
  return startISO;
}
