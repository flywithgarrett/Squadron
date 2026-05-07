"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/content-types";
import { formatLongDate } from "@/lib/format";
import type { Post, Status } from "@/lib/types";
import { PlatformGlyph } from "@/components/icons/platform-glyph";
import { Badge } from "@/components/primitives/badge";
import { StatusSelector } from "@/components/posts/status-selector";

interface Props {
  post: Post | null;
  onClose: () => void;
  onStatusChange?: (id: string, status: Status) => void;
  storageReady?: boolean;
}

export function PostDetailSheet({
  post,
  onClose,
  onStatusChange,
  storageReady = false,
}: Props) {
  const [statusBusy, setStatusBusy] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

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

  useEffect(() => {
    setStatusError(null);
  }, [post?.id]);

  if (!post) return null;
  const accent = CONTENT_TYPES[post.contentType].accent;
  const killed = post.status === "Killed";

  async function commitStatus(next: Status) {
    if (!post || !onStatusChange) return;
    if (next === post.status) return;
    if (!storageReady) {
      setStatusError("Connect storage to save status updates.");
      return;
    }
    setStatusBusy(true);
    setStatusError(null);
    onStatusChange(post.id, next);
    try {
      const res = await fetch("/api/posts/status", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: post.id, status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Could not update status.");
      }
    } catch (err: any) {
      setStatusError(err?.message ?? "Could not update status.");
      onStatusChange(post.id, post.status);
    } finally {
      setStatusBusy(false);
    }
  }

  const Section = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <section className="pt-7 border-t border-[color:var(--color-rule)]">
        <dt className="eyebrow text-[color:var(--color-ink-45)] mb-2.5">
          {label}
        </dt>
        <dd className="text-[15px] leading-[1.55] text-[color:var(--color-ink)] whitespace-pre-wrap">
          {value}
        </dd>
      </section>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="scrim-in absolute inset-0 bg-[#0A2540]/40 supports-[backdrop-filter]:backdrop-blur-[2px]"
      />
      <aside
        className="sheet-in relative w-full md:max-w-[560px] bg-[color:var(--color-canvas)] overflow-y-auto"
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        <div className="sticky top-0 z-10 bg-[color:var(--color-canvas)]/85 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:bg-[color:var(--color-canvas)]/72 px-9 py-6 flex items-center justify-between border-b border-[color:var(--color-rule)]">
          <div className="flex items-center gap-3 text-[12px] tracking-[0.04em] text-[color:var(--color-ink-60)] tabular">
            <time>{formatLongDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.time}</span>
          </div>
          <div className="flex items-center gap-4">
            {onStatusChange && (
              <button
                type="button"
                onClick={() => commitStatus(killed ? "Planned" : "Killed")}
                className={
                  "text-[11px] tracking-[0.04em] uppercase " +
                  (killed
                    ? "text-[color:var(--color-warn)] hover:text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-45)] hover:text-[color:var(--color-warn)]")
                }
              >
                {killed ? "Restore" : "Killed"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[color:var(--color-ink-45)] hover:text-[color:var(--color-ink)] -mr-1.5 w-8 h-8 inline-flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[color:var(--color-rule)]"
              aria-label="Close panel"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="px-9 py-12">
          {onStatusChange && !killed && (
            <div className="mb-12">
              <StatusSelector
                value={post.status}
                onChange={commitStatus}
                disabled={statusBusy}
              />
              {statusError && (
                <p className="mt-3 text-center text-[11px] text-[color:var(--color-warn)]">
                  {statusError}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mb-7 text-[color:var(--color-ink-60)]">
            {post.platforms.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.04em]"
              >
                <PlatformGlyph platform={p} size={14} />
                {p}
              </span>
            ))}
          </div>

          <h2
            className={
              "display text-[30px] md:text-[34px] leading-[1.15] text-[color:var(--color-ink)] mb-8 " +
              (killed ? "line-through opacity-60" : "")
            }
          >
            {post.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 mb-12">
            <Badge>{post.contentType}</Badge>
            <Badge>Week {post.week}</Badge>
            <Badge>{post.phase}</Badge>
            {post.promoted && <Badge>Promoted</Badge>}
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
