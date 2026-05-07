"use client";

import { useEffect, useMemo, useState } from "react";
import { CONTENT_TYPES } from "@/lib/content-types";
import { formatLongDate } from "@/lib/format";
import type { Post, ProgressGroup, Status } from "@/lib/types";
import {
  EMPTY_FILTERS,
  FilterBar,
  type Filters,
} from "@/components/filters/filter-bar";
import {
  ProgressFilterChips,
  progressGroupOf,
} from "@/components/filters/progress-filter-chips";
import { PlatformGlyph } from "@/components/icons/platform-glyph";
import { PostDetailSheet } from "@/components/posts/post-detail-sheet";
import { StatusIndicator } from "@/components/posts/status-indicator";

interface Props {
  posts: Post[];
  storageReady: boolean;
}

export function ListView({ posts: initialPosts, storageReady }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [progressGroup, setProgressGroup] =
    useState<ProgressGroup>("in-progress");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => setPosts(initialPosts), [initialPosts]);

  const selected = useMemo(
    () => posts.find((p) => p.id === selectedId) ?? null,
    [posts, selectedId],
  );

  const counts = useMemo(() => {
    const c: Record<ProgressGroup, number> = {
      all: posts.length,
      "in-progress": 0,
      complete: 0,
      killed: 0,
    };
    for (const p of posts) c[progressGroupOf(p.status)]++;
    return c;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return posts
      .filter((p) => {
        if (progressGroup !== "all" && progressGroupOf(p.status) !== progressGroup) {
          return false;
        }
        if (filters.platform && !p.platforms.includes(filters.platform as any))
          return false;
        if (filters.contentType && p.contentType !== filters.contentType)
          return false;
        if (filters.phase && p.phase !== filters.phase) return false;
        if (filters.status && p.status !== filters.status) return false;
        if (q) {
          const hay = (p.title + " " + p.hook).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) =>
        a.date === b.date
          ? a.time.localeCompare(b.time)
          : a.date.localeCompare(b.date),
      );
  }, [posts, filters, progressGroup]);

  const grouped = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of filtered) {
      const arr = map.get(p.date) ?? [];
      arr.push(p);
      map.set(p.date, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function applyStatus(id: string, status: Status) {
    setPosts((cur) =>
      cur.map((p) => (p.id === id ? { ...p, status } : p)),
    );
  }

  return (
    <>
      <ProgressFilterChips
        value={progressGroup}
        onChange={setProgressGroup}
        counts={counts}
      />

      <div className="mt-10">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-8 mb-12 flex items-baseline justify-between">
        <p className="text-[12px] tracking-[0.06em] uppercase tabular text-[color:var(--color-ink-45)]">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        </p>
      </div>

      {grouped.length === 0 ? (
        <p className="text-[14px] text-[color:var(--color-ink-45)] py-20">
          No posts match these filters.
        </p>
      ) : (
        <ol className="space-y-20">
          {grouped.map(([date, items]) => (
            <li key={date}>
              <div className="sticky top-[88px] md:top-[96px] z-20 bg-[color:var(--color-canvas)]/85 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:bg-[color:var(--color-canvas)]/72 py-4 mb-3 border-b border-[color:var(--color-rule)]">
                <h2 className="text-[14px] font-medium tracking-[-0.005em] text-[color:var(--color-ink)] tabular">
                  {formatLongDate(date)}
                </h2>
              </div>
              <ul className="divide-y divide-[color:var(--color-rule)]">
                {items.map((p) => {
                  const accent = CONTENT_TYPES[p.contentType].accent;
                  const killed = p.status === "Killed";
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className={
                          "w-full text-left grid grid-cols-12 gap-4 md:gap-8 items-center py-7 px-3 -mx-3 hover:bg-[color:var(--color-rule)]/40 rounded-[var(--radius-sm)] " +
                          (killed ? "opacity-40" : "")
                        }
                      >
                        <div className="col-span-3 md:col-span-1 text-[12px] tracking-[0.04em] text-[color:var(--color-ink-45)] tabular">
                          {p.time}
                        </div>
                        <div className="col-span-3 md:col-span-2 flex items-center gap-2.5 text-[color:var(--color-ink-45)]">
                          {p.platforms.slice(0, 3).map((pl) => (
                            <PlatformGlyph key={pl} platform={pl} size={14} />
                          ))}
                          {p.platforms.length > 3 && (
                            <span className="text-[11px] tabular">
                              +{p.platforms.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="col-span-12 md:col-span-7">
                          <div className="flex items-start gap-3">
                            <span className="mt-1.5 shrink-0">
                              <StatusIndicator
                                status={p.status}
                                size={p.status === "Posted" ? 12 : 10}
                              />
                            </span>
                            <div
                              className="pl-4 -ml-1"
                              style={{ borderLeft: `2px solid ${accent}` }}
                            >
                              <h3
                                className={
                                  "text-[15px] font-medium leading-snug text-[color:var(--color-ink)] mb-1 " +
                                  (killed ? "line-through" : "")
                                }
                              >
                                {p.title}
                              </h3>
                              <p className="text-[12px] tracking-[0.02em] text-[color:var(--color-ink-45)]">
                                {p.contentType}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-2 flex md:justify-end items-center">
                          <span className="text-[11px] tracking-[0.06em] uppercase text-[color:var(--color-ink-60)]">
                            {p.status}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}

      <PostDetailSheet
        post={selected}
        storageReady={storageReady}
        onStatusChange={applyStatus}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
