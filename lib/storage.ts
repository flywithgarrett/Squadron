import { Redis } from "@upstash/redis";
import type { Idea, Post, Status } from "./types";

const STATUS_HASH = "post:status";
const PROMOTED_HASH = "post:promoted";
const IDEA_INDEX = "idea:index";
const ideaKey = (id: string) => `idea:${id}`;

let client: Redis | null = null;

function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!client) client = new Redis({ url, token });
  return client;
}

export function isStorageReady(): boolean {
  return getRedis() !== null;
}

// ---------- Status overrides ----------

export async function getStatusOverrides(): Promise<
  Record<string, Status>
> {
  const r = getRedis();
  if (!r) return {};
  const raw = await r.hgetall<Record<string, Status>>(STATUS_HASH);
  return raw ?? {};
}

export async function setPostStatus(
  postId: string,
  status: Status,
): Promise<void> {
  const r = getRedis();
  if (!r) throw new Error("Storage not configured");
  await r.hset(STATUS_HASH, { [postId]: status });
}

// ---------- Promoted posts (created from ideas) ----------

export async function getPromotedPosts(): Promise<Post[]> {
  const r = getRedis();
  if (!r) return [];
  const raw = await r.hgetall<Record<string, Post>>(PROMOTED_HASH);
  if (!raw) return [];
  return Object.values(raw).map((p) => ({ ...p, promoted: true }));
}

export async function createPromotedPost(
  data: Omit<Post, "id" | "promoted">,
): Promise<Post> {
  const r = getRedis();
  if (!r) throw new Error("Storage not configured");
  const id = `promoted-${crypto.randomUUID()}`;
  const post: Post = { ...data, id, promoted: true };
  await r.hset(PROMOTED_HASH, { [id]: post });
  return post;
}

// ---------- Ideas ----------

export async function listIdeas(): Promise<Idea[]> {
  const r = getRedis();
  if (!r) return [];
  const ids = (await r.zrange<string[]>(IDEA_INDEX, 0, -1, {
    rev: true,
  })) as string[];
  if (!ids?.length) return [];
  const pipeline = r.pipeline();
  for (const id of ids) pipeline.get(ideaKey(id));
  const results = (await pipeline.exec()) as (Idea | null)[];
  return results.filter((x): x is Idea => x !== null);
}

export async function createIdea(
  data: Omit<Idea, "id" | "createdAt" | "status">,
): Promise<Idea> {
  const r = getRedis();
  if (!r) throw new Error("Storage not configured");
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const idea: Idea = { ...data, id, createdAt, status: "idea" };
  await r.set(ideaKey(id), idea);
  await r.zadd(IDEA_INDEX, { score: Date.parse(createdAt), member: id });
  return idea;
}

export async function updateIdea(
  id: string,
  patch: Partial<Idea>,
): Promise<Idea | null> {
  const r = getRedis();
  if (!r) throw new Error("Storage not configured");
  const existing = (await r.get<Idea>(ideaKey(id))) as Idea | null;
  if (!existing) return null;
  const next: Idea = { ...existing, ...patch, id };
  await r.set(ideaKey(id), next);
  return next;
}

export async function deleteIdea(id: string): Promise<void> {
  const r = getRedis();
  if (!r) throw new Error("Storage not configured");
  await r.del(ideaKey(id));
  await r.zrem(IDEA_INDEX, id);
}

export async function getIdea(id: string): Promise<Idea | null> {
  const r = getRedis();
  if (!r) return null;
  return ((await r.get<Idea>(ideaKey(id))) as Idea | null) ?? null;
}
