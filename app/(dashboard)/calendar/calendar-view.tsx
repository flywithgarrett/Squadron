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
      <p className="text-[14px] text-[color:var(--color-ink-45)]">
        No posts scheduled yet.
      </p>
    );
  }

  const active = months[Math.min(activeIndex, months.length - 1)];
  const matrix = getMonthMatrix(active.year, active.monthIndex);
  const monthCount = posts.filter((p) => {
    const dt = parseDate(p.date);
    return (
      dt.getUTCFullYear() === active.year &&
      dt.getUTCMonth() === active.monthIndex
    );
  }).length;

  return (
    <>
      <div className="flex items-end justify-between mb-12 pb-6 border-b border-[color:var(--color-rule)]">
        <div className="flex items-baseline gap-6">
          <h2 className="display text-[34px] md:text-[40px] leading-none text-[color:var(--color-ink)] tabular">
            {formatMonthYear(active.year, active.monthIndex)}
          </h2>
          <span className="text-[12px] tracking-[0.06em] uppercase text-[color:var(--color-ink-45)] tabular hidden md:inline">
            {monthCount} posts
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="w-9 h-9 inline-flex items-center justify-center text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-rule)] disabled:opacity-25 disabled:hover:bg-transparent rounded-[var(--radius-sm)]"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((i) => Math.min(months.length - 1, i + 1))
            }
            disabled={activeIndex >= months.length - 1}
            className="w-9 h-9 inline-flex items-center justify-center text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-rule)] disabled:opacity-25 disabled:hover:bg-transparent rounded-[var(--radius-sm)]"
            aria-label="Next month"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Desktop month grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 mb-3">
          {WEEKDAY.map((w, i) => (
            <div
              key={w}
              className={
                "px-3 pb-3 text-[10px] uppercase tracking-[0.18em] font-medium " +
                (i === 0 || i === 6
                  ? "text-[color:var(--color-ink-30)]"
                  : "text-[color:var(--color-ink-45)]")
              }
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-l border-[color:var(--color-rule)]">
          {matrix.flat().map((cell) => {
            const dt = parseDate(cell.date);
            const cellPosts = byDate.get(cell.date) ?? [];
            const isWeekend = dt.getUTCDay() === 0 || dt.getUTCDay() === 6;
            return (
              <div
                key={cell.date}
                className={
                  "min-h-[148px] border-r border-b border-[color:var(--color-rule)] p-3 flex flex-col gap-2 " +
                  (cell.inMonth
                    ? isWeekend
                      ? "bg-[color:var(--color-paper-soft)]"
                      : "bg-[color:var(--color-paper)]"
                    : "bg-transparent")
                }
              >
                <div
                  className={
                    "text-[12px] tabular font-medium " +
                    (cell.inMonth
                      ? "text-[color:var(--color-ink)]"
                      : "text-[color:var(--color-ink-30)]")
                  }
                >
                  {dt.getUTCDate()}
                </div>
                <div className="flex flex-col gap-1.5">
                  {cellPosts.slice(0, 4).map((p) => {
                    const accent = CONTENT_TYPES[p.contentType].accent;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelected(p)}
                        className="text-left text-[11px] leading-tight pl-2.5 pr-2 py-1.5 hover:bg-[color:var(--color-rule)] rounded-[2px]"
                        style={{ borderLeft: `2px solid ${accent}` }}
                        title={p.title}
                      >
                        <span className="block text-[color:var(--color-ink)] font-medium truncate">
                          {p.title}
                        </span>
                      </button>
                    );
                  })}
                  {cellPosts.length > 4 && (
                    <span className="text-[10px] pl-2.5 text-[color:var(--color-ink-45)] tabular">
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
        <ul className="divide-y divide-[color:var(--color-rule)] border-t border-b border-[color:var(--color-rule)]">
          {matrix
            .flat()
            .filter((c) => c.inMonth && (byDate.get(c.date)?.length ?? 0) > 0)
            .map((cell) => {
              const cellPosts = byDate.get(cell.date) ?? [];
              return (
                <li key={cell.date} className="py-7">
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="text-[13px] font-medium tabular text-[color:var(--color-ink)]">
                      {formatLongDate(cell.date)}
                    </h3>
                    <span className="text-[11px] tabular text-[color:var(--color-ink-45)]">
                      {cellPosts.length}
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
                            className="w-full text-left pl-3 pr-3 py-3 bg-[color:var(--color-paper)] border border-[color:var(--color-rule)]"
                            style={{ borderLeft: `3px solid ${accent}` }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[13px] font-medium text-[color:var(--color-ink)] line-clamp-1">
                                {p.title}
                              </span>
                              <div className="flex items-center gap-1.5 text-[color:var(--color-ink-45)] shrink-0">
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
    <div className="mt-16 pt-8 border-t border-[color:var(--color-rule)] flex flex-wrap items-center gap-x-8 gap-y-3">
      <span className="eyebrow text-[color:var(--color-ink-45)]">Legend</span>
      {Object.entries(CONTENT_TYPES).map(([name, cfg]) => (
        <div
          key={name}
          className="inline-flex items-center gap-2.5 text-[12px] text-[color:var(--color-ink-60)]"
        >
          <span
            aria-hidden
            className="inline-block w-[3px] h-3.5"
            style={{ backgroundColor: cfg.accent }}
          />
          {name}
        </div>
      ))}
    </div>
  );
}
