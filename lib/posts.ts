import postsData from "@/data/posts.json";
import type { Phase, Pillar, Platform, Post, Status } from "./types";

const posts: Post[] = (postsData as Array<Omit<Post, "id"> & { id?: string }>)
  .map((p, i) => ({
    id: p.id ?? `post-${i}`,
    title: p.title,
    date: p.date,
    time: p.time,
    week: p.week,
    phase: p.phase as Phase,
    platform: p.platform as Platform,
    format: p.format,
    pillar: p.pillar as Pillar,
    audience: p.audience,
    hook: p.hook,
    cta: p.cta,
    sourceNotes: p.sourceNotes,
    productionNotes: p.productionNotes,
    status: p.status as Status,
    performanceNotes: p.performanceNotes,
  }))
  .sort((a, b) => a.date.localeCompare(b.date));

export function getPosts(): Post[] {
  return posts;
}
