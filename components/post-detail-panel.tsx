"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { PILLARS } from "@/lib/pillars";
import { formatDayDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import { PillarBadge } from "@/components/pillar-badge";
import { PlatformIcon } from "@/components/platform-icon";

export function PostDetailPanel({
  post,
  onClose,
}: {
  post: Post | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [post, onClose]);

  if (!post) return null;
  const pillar = PILLARS[post.pillar];

  const Field = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <section className="border-t border-stone-200 pt-4">
        <dt className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#5B6770] mb-1">
          {label}
        </dt>
        <dd className="text-sm leading-relaxed text-[#0A2540] whitespace-pre-wrap">
          {value}
        </dd>
      </section>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[#0A2540]/30"
      />
      <aside
        className="relative w-full max-w-md bg-white shadow-xl border-l-4 overflow-y-auto"
        style={{ borderLeftColor: pillar.color }}
      >
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#5B6770]">
            <PlatformIcon platform={post.platform} className="h-4 w-4" />
            <span className="uppercase tracking-[0.08em] font-medium">
              {post.platform}
            </span>
            <span className="text-stone-300">·</span>
            <time>{formatDayDate(post.date)}</time>
            <span className="text-stone-300">·</span>
            <span>{post.time}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5B6770] hover:text-[#0A2540]"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <PillarBadge pillar={post.pillar} showFull />
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#5B6770]">
              Week {post.week} · {post.phase}
            </span>
          </div>

          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-[#0A2540]">
            {post.title}
          </h2>

          <Field label="Format" value={post.format} />
          <Field label="Audience" value={post.audience} />
          <Field label="Hook" value={post.hook} />
          <Field label="Call to action" value={post.cta} />
          <Field label="Source notes" value={post.sourceNotes} />
          <Field label="Production notes" value={post.productionNotes} />
          <Field label="Status" value={post.status} />
          <Field label="Performance notes" value={post.performanceNotes} />
        </div>
      </aside>
    </div>
  );
}
