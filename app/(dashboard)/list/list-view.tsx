"use client";

import { useMemo, useState } from "react";
import { CONTENT_TYPES } from "@/lib/content-types";
import { formatLongDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import {
  EMPTY_FILTERS,
  FilterBar,
  type Filters,
} from "@/components/filters/filter-bar";
import { PlatformGlyph } from "@/components/icons/platform-glyph";
import { PostDetailSheet } from "@/components/posts/post-detail-sheet";
import { Badge } from "@/components/primitives/badge";

export function ListView({ posts }: { posts: Post[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selected, setSelected] = useState<Post | null>(null);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return posts
      .filter((p) => {
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
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [posts, filters]);

  const grouped = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of filtered) {
      const arr = map.get(p.date) ?? [];
      arr.push(p);
      map.set(p.date, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="mt-8 mb-10 text-[11px] tracking-[0.04em] tabular text-[color:var(--color-navy-mute)]">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
      </div>

      {grouped.length === 0 ? (
        <p className="text-[14px] text-[color:var(--color-navy-mute)] py-16">
          No posts match these filters.
        </p>
      ) : (
        <ol className="space-y-16">
          {grouped.map(([date, items]) => (
            <li key={date}>
              <div className="sticky top-0 z-10 bg-[#F4F1EA]/95 supports-[backdrop-filter]:bg-[#F4F1EA]/80 backdrop-blur py-3 mb-2">
                <h2 className="text-[13px] font-medium tracking-[-0.005em] text-[#0A2540] tabular">
                  {formatLongDate(date)}
                </h2>
              </div>
              <ul className="divide-y divide-[color:var(--color-hairline)] border-t border-b border-[color:var(--color-hairline)]">
                {items.map((p) => {
                  const accent = CONTENT_TYPES[p.contentType].accent;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(p)}
                        className="w-full text-left grid grid-cols-12 gap-6 items-baseline py-6 hover:bg-[color:var(--color-hairline)]/40 px-2 -mx-2"
                      >
                        <div className="col-span-12 md:col-span-1 text-[11px] tracking-[0.04em] text-[color:var(--color-navy-mute)] tabular">
                          {p.time}
                        </div>
                        <div className="col-span-3 md:col-span-2 flex items-center gap-2 text-[color:var(--color-navy-mute)]">
                          {p.platforms.slice(0, 3).map((pl) => (
                            <PlatformGlyph key={pl} platform={pl} size={14} />
                          ))}
                          {p.platforms.length > 3 && (
                            <span className="text-[11px] tabular">
                              +{p.platforms.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="col-span-9 md:col-span-6">
                          <div
                            className="pl-3 -ml-3"
                            style={{ borderLeft: `3px solid ${accent}` }}
                          >
                            <h3 className="text-[14px] font-medium text-[#0A2540] mb-1">
                              {p.title}
                            </h3>
                            <p className="text-[12px] text-[color:var(--color-navy-mute)] tracking-[0.04em]">
                              {p.contentType}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-3 flex md:justify-end">
                          <Badge>{p.status}</Badge>
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

      <PostDetailSheet post={selected} onClose={() => setSelected(null)} />
    </>
  );
}
