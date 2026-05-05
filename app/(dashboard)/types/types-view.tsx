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
      <div className="space-y-24">
        {CONTENT_TYPE_NAMES.map((name) => {
          const cfg = CONTENT_TYPES[name];
          const items = grouped.get(name) ?? [];
          const pct = total ? Math.round((items.length / total) * 100) : 0;
          return (
            <section key={name}>
              <div
                className="pt-7 mb-10"
                style={{ borderTop: `1px solid ${cfg.accent}` }}
              >
                <div className="flex items-baseline justify-between gap-6 flex-wrap">
                  <div>
                    <h2
                      className="text-[24px] font-medium tracking-[-0.015em]"
                      style={{ color: cfg.accent }}
                    >
                      {name}
                    </h2>
                    <p className="mt-2 text-[14px] text-[color:var(--color-navy-soft)] max-w-2xl">
                      {cfg.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[34px] font-medium tabular leading-none text-[#0A2540]">
                      {items.length}
                    </div>
                    <div className="text-[11px] tracking-[0.04em] text-[color:var(--color-navy-mute)] tabular mt-1">
                      {pct}% of plan
                    </div>
                  </div>
                </div>
              </div>

              {items.length === 0 ? (
                <p className="text-[14px] text-[color:var(--color-navy-mute)]">
                  No posts assigned to this type.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(p)}
                      className="text-left"
                    >
                      <PostCard post={p} />
                    </button>
                  ))}
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
