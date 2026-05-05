"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/content-types";
import {
  formatLongDate,
  formatMonthYear,
  getMonthMatrix,
  parseDate,
  uniqueMonths,
} from "@/lib/format";
import type { Post } from "@/lib/types";
import { PlatformGlyph } from "@/components/icons/platform-glyph";
import { PostDetailSheet } from "@/components/posts/post-detail-sheet";

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ posts }: { posts: Post[] }) {
  const months = useMemo(() => uniqueMonths(posts), [posts]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Post | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of posts) {
      const arr = map.get(p.date) ?? [];
      arr.push(p);
      map.set(p.date, arr);
    }
    return map;
  }, [posts]);

  if (months.length === 0) {
    return (
      <p className="text-[14px] text-[color:var(--color-navy-mute)]">
        No posts yet. Add entries in your Notion database — they will appear
        here.
      </p>
    );
  }

  const active = months[Math.min(activeIndex, months.length - 1)];
  const matrix = getMonthMatrix(active.year, active.monthIndex);

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-baseline gap-4">
          <h2 className="display text-[28px] font-medium tracking-[-0.015em] text-[#0A2540] tabular">
            {formatMonthYear(active.year, active.monthIndex)}
          </h2>
          <span className="text-[12px] tracking-[0.04em] text-[color:var(--color-navy-mute)] tabular">
            {posts.filter((p) => {
              const dt = parseDate(p.date);
              return (
                dt.getUTCFullYear() === active.year &&
                dt.getUTCMonth() === active.monthIndex
              );
            }).length}{" "}
            posts
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="w-8 h-8 inline-flex items-center justify-center text-[color:var(--color-navy-mute)] hover:text-[#0A2540] disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((i) => Math.min(months.length - 1, i + 1))
            }
            disabled={activeIndex >= months.length - 1}
            className="w-8 h-8 inline-flex items-center justify-center text-[color:var(--color-navy-mute)] hover:text-[#0A2540] disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Month grid (md+) */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 mb-3">
          {WEEKDAY.map((w) => (
            <div
              key={w}
              className="px-2 pb-2 text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-navy-mute)]"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-l border-[color:var(--color-hairline)]">
          {matrix.flat().map((cell) => {
            const dt = parseDate(cell.date);
            const cellPosts = byDate.get(cell.date) ?? [];
            return (
              <div
                key={cell.date}
                className={
                  "min-h-[148px] border-r border-b border-[color:var(--color-hairline)] p-3 flex flex-col gap-1.5 " +
                  (cell.inMonth ? "bg-[#FBFAF6]" : "bg-transparent")
                }
              >
                <div
                  className={
                    "text-[11px] tabular " +
                    (cell.inMonth
                      ? "text-[#0A2540]"
                      : "text-[color:var(--color-navy-faint)]")
                  }
                >
                  {dt.getUTCDate()}
                </div>
                <div className="flex flex-col gap-1">
                  {cellPosts.slice(0, 4).map((p) => {
                    const accent = CONTENT_TYPES[p.contentType].accent;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelected(p)}
                        className="text-left text-[11px] leading-tight pl-2 pr-1.5 py-1.5 hover:bg-[color:var(--color-hairline)] transition-colors duration-150"
                        style={{ borderLeft: `3px solid ${accent}` }}
                        title={p.title}
                      >
                        <span className="block text-[#0A2540] font-medium truncate">
                          {p.title}
                        </span>
                      </button>
                    );
                  })}
                  {cellPosts.length > 4 && (
                    <span className="text-[10px] pl-2 text-[color:var(--color-navy-mute)] tabular">
                      +{cellPosts.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile agenda view */}
      <div className="md:hidden">
        <ul className="divide-y divide-[color:var(--color-hairline)] border-t border-b border-[color:var(--color-hairline)]">
          {matrix
            .flat()
            .filter((c) => c.inMonth && (byDate.get(c.date)?.length ?? 0) > 0)
            .map((cell) => {
              const cellPosts = byDate.get(cell.date) ?? [];
              return (
                <li key={cell.date} className="py-6">
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="text-[13px] font-medium tabular text-[#0A2540]">
                      {formatLongDate(cell.date)}
                    </h3>
                    <span className="text-[11px] tabular text-[color:var(--color-navy-mute)]">
                      {cellPosts.length}{" "}
                      {cellPosts.length === 1 ? "post" : "posts"}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {cellPosts.map((p) => {
                      const accent = CONTENT_TYPES[p.contentType].accent;
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => setSelected(p)}
                            className="w-full text-left pl-3 pr-3 py-2.5 bg-[#FBFAF6] border border-[color:var(--color-hairline)]"
                            style={{ borderLeft: `3px solid ${accent}` }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[13px] font-medium text-[#0A2540] line-clamp-1">
                                {p.title}
                              </span>
                              <div className="flex items-center gap-1.5 text-[color:var(--color-navy-mute)]">
                                {p.platforms.slice(0, 2).map((pl) => (
                                  <PlatformGlyph
                                    key={pl}
                                    platform={pl}
                                    size={12}
                                  />
                                ))}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
        </ul>
      </div>

      <Legend />
      <PostDetailSheet post={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function Legend() {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-6">
      {Object.entries(CONTENT_TYPES).map(([name, cfg]) => (
        <div
          key={name}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.04em] text-[color:var(--color-navy-soft)]"
        >
          <span
            aria-hidden
            className="inline-block w-[3px] h-3"
            style={{ backgroundColor: cfg.accent }}
          />
          {name}
        </div>
      ))}
    </div>
  );
}
