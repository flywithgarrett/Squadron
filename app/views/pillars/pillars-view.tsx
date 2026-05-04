"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { PostDetailPanel } from "@/components/post-detail-panel";
import { PILLARS, PILLAR_NAMES } from "@/lib/pillars";
import type { Pillar, Post } from "@/lib/types";

export function PillarsView({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState<Record<Pillar, boolean>>(() =>
    Object.fromEntries(PILLAR_NAMES.map((p) => [p, true])) as Record<
      Pillar,
      boolean
    >,
  );
  const [selected, setSelected] = useState<Post | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<Pillar, Post[]>();
    PILLAR_NAMES.forEach((p) => map.set(p, []));
    for (const post of posts) {
      const arr = map.get(post.pillar);
      if (arr) arr.push(post);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.date.localeCompare(b.date));
    }
    return map;
  }, [posts]);

  const total = posts.length;

  return (
    <>
      <div className="space-y-6">
        {PILLAR_NAMES.map((name) => {
          const cfg = PILLARS[name];
          const items = grouped.get(name) ?? [];
          const pct = total ? Math.round((items.length / total) * 100) : 0;
          const isOpen = open[name];
          return (
            <section
              key={name}
              className="bg-white border border-stone-200 border-l-4"
              style={{ borderLeftColor: cfg.color }}
            >
              <button
                type="button"
                onClick={() => setOpen({ ...open, [name]: !isOpen })}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-6"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
                  <h2
                    className="text-lg font-semibold tracking-tight"
                    style={{ color: cfg.color }}
                  >
                    {name}
                  </h2>
                  <p className="text-sm text-[#5B6770]">{cfg.desc}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-[#5B6770]">
                      Posts
                    </div>
                    <div className="text-xl font-semibold text-[#0A2540]">
                      {items.length}
                      <span className="text-xs text-[#5B6770] font-normal ml-1.5">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={
                      "h-4 w-4 text-[#5B6770] transition-transform duration-150 " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(p)}
                      className="text-left"
                    >
                      <PostCard post={p} className="hover:bg-stone-50" />
                    </button>
                  ))}
                  {items.length === 0 && (
                    <p className="text-sm text-[#5B6770] col-span-full">
                      No posts planned for this pillar.
                    </p>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <PostDetailPanel post={selected} onClose={() => setSelected(null)} />
    </>
  );
}
