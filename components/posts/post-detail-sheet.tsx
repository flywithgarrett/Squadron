"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/content-types";
import { formatLongDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import { PlatformGlyph } from "@/components/icons/platform-glyph";
import { Badge } from "@/components/primitives/badge";

export function PostDetailSheet({
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
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  if (!post) return null;
  const accent = CONTENT_TYPES[post.contentType].accent;

  const Section = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <section className="pt-7 border-t border-[color:var(--color-hairline)]">
        <dt className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-navy-mute)] mb-2">
          {label}
        </dt>
        <dd className="text-[14px] leading-relaxed text-[#0A2540] whitespace-pre-wrap">
          {value}
        </dd>
      </section>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[#0A2540]/30"
      />
      <aside
        className="relative w-full max-w-[480px] bg-[#F4F1EA] overflow-y-auto"
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        <div className="sticky top-0 bg-[#F4F1EA]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F4F1EA]/80 px-8 py-6 flex items-center justify-between border-b border-[color:var(--color-hairline)]">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.04em] text-[color:var(--color-navy-mute)] tabular">
            <time>{formatLongDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.time}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[color:var(--color-navy-mute)] hover:text-[#0A2540]"
            aria-label="Close panel"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-8 py-10">
          <div className="flex items-center gap-2 mb-6 text-[color:var(--color-navy-mute)]">
            {post.platforms.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.02em]">
                <PlatformGlyph platform={p} size={14} />
                {p}
              </span>
            ))}
          </div>

          <h2 className="text-[26px] font-medium leading-[1.2] tracking-[-0.015em] text-[#0A2540] mb-6">
            {post.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 mb-10">
            <Badge>{post.contentType}</Badge>
            <Badge>Week {post.week}</Badge>
            <Badge>{post.phase}</Badge>
            <Badge>{post.status}</Badge>
          </div>

          <dl className="space-y-7">
            <Section label="Format" value={post.format} />
            <Section label="Audience" value={post.audience} />
            <Section label="Hook" value={post.hook} />
            <Section label="Call to action" value={post.cta} />
            <Section label="Asset source" value={post.assetSource} />
            <Section label="Production notes" value={post.productionNotes} />
            <Section label="Performance notes" value={post.performanceNotes} />
          </dl>
        </div>
      </aside>
    </div>
  );
}
