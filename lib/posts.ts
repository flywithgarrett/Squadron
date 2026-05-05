import seed from "@/data/seed.json";
import type {
  Audience,
  ContentType,
  Phase,
  Platform,
  Post,
  Status,
} from "./types";

const posts: Post[] = (seed as Array<Omit<Post, "id"> & { id?: string }>)
  .map((p, i) => ({
    id: p.id ?? `post-${i}`,
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
  .sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
  );

export function getPosts(): Post[] {
  return posts;
}
