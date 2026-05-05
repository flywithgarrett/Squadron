"use client";

import { useMemo, useState } from "react";
import { CONTENT_TYPES } from "@/lib/content-types";
import { CONTENT_TYPE_NAMES, type ContentType, type Post } from "@/lib/types";
import { PostCard } from "@/components/posts/post-card";
import { PostDetailSheet } from "@/components/posts/post-detail-sheet";

export function TypesView({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<Post | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<ContentType, Post[]>();
    CONTENT_TYPE_NAMES.forEach((t) => map.set(t, []));
    for (const p of posts) {
      const arr = map.get(p.contentType);
      if (arr) arr.push(p);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.date.localeCompare(b.date));
    }
    return map;
  }, [posts]);

  const total = posts.length;

  return (
    <>
      <div className="space-y-32">
        {CONTENT_TYPE_NAMES.map((name) => {
          const cfg = CONTENT_TYPES[name];
          const items = grouped.get(name) ?? [];
          const pct = total ? Math.round((items.length / total) * 100) : 0;
          return (
            <section key={name}>
              <div
                className="pt-8 mb-12 grid grid-cols-12 gap-6 items-end"
                style={{ borderTop: `1px solid ${cfg.accent}` }}
              >
                <div className="col-span-12 md:col-span-7">
                  <p
                    className="eyebrow mb-3"
                    style={{ color: cfg.accent }}
                  >
                    Content type
                  </p>
                  <h2
                    className="display text-[28px] md:text-[36px] leading-tight"
                    style={{ color: cfg.accent }}
                  >
                    {name}
                  </h2>
                  <p className="mt-3 text-[14px] text-[color:var(--color-ink-60)] max-w-xl">
                    {cfg.description}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-5 md:text-right">
                  <div
                    className="display text-[64px] md:text-[80px] leading-[0.9] tabular text-[color:var(--color-ink)]"
                  >
                    {items.length}
                  </div>
                  <div className="mt-2 text-[12px] tracking-[0.06em] uppercase text-[color:var(--color-ink-45)] tabular">
                    {pct}% of plan
                  </div>
                </div>
              </div>

              {items.length === 0 ? (
                <p className="text-[14px] text-[color:var(--color-ink-45)]">
                  No posts assigned to this type.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.slice(0, 12).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(p)}
                      className="text-left transition-transform duration-200 hover:-translate-y-px"
                    >
                      <PostCard post={p} />
                    </button>
                  ))}
                  {items.length > 12 && (
                    <p className="md:col-span-2 text-[12px] tracking-[0.06em] uppercase text-[color:var(--color-ink-45)] mt-2">
                      Plus {items.length - 12} more in this type — see the list
                      view for the full set.
                    </p>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <PostDetailSheet post={selected} onClose={() => setSelected(null)} />
    </>
  );
}
