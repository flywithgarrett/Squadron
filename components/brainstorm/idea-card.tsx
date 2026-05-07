"use client";

import { Check, Sparkles, Trash2, Send } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/content-types";
import type { Idea } from "@/lib/types";
import { relativeTime } from "@/lib/format";
import { PlatformGlyph } from "@/components/icons/platform-glyph";

interface Props {
  idea: Idea;
  onPromote: (idea: Idea) => void;
  onGenerate: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
}

export function IdeaCard({ idea, onPromote, onGenerate, onDelete }: Props) {
  const accent = idea.contentType
    ? CONTENT_TYPES[idea.contentType].accent
    : null;
  const promoted = idea.status === "promoted";

  return (
    <article
      className={
        "relative group bg-[color:var(--color-paper)] border border-[color:var(--color-rule)] pl-6 pr-7 py-7 transition-opacity duration-200 " +
        (promoted ? "opacity-60" : "")
      }
      style={{
        borderLeft: accent
          ? `3px solid ${accent}`
          : "3px solid var(--color-rule-strong)",
      }}
    >
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.04em] text-[color:var(--color-ink-45)]">
          <time>captured {relativeTime(idea.createdAt)}</time>
          {idea.source === "ai-generated" && (
            <span className="inline-flex items-center gap-1 text-[color:var(--color-ink-60)]">
              <Sparkles size={12} strokeWidth={1.5} />
              generated
            </span>
          )}
        </div>
        {promoted && (
          <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.04em] text-[color:var(--color-ink-60)]">
            <Check size={12} strokeWidth={2} />
            Promoted
          </span>
        )}
      </div>

      <p className="text-[15px] leading-[1.55] text-[color:var(--color-ink)] whitespace-pre-wrap">
        {idea.text}
      </p>

      {idea.generatedScript && (
        <div className="mt-5 pt-5 border-t border-[color:var(--color-rule)]">
          <p className="eyebrow text-[color:var(--color-ink-45)] mb-2.5">
            Generated script
          </p>
          <p className="text-[14px] leading-[1.6] text-[color:var(--color-ink-80)] whitespace-pre-wrap">
            {idea.generatedScript}
          </p>
        </div>
      )}

      {(idea.contentType || idea.platforms.length > 0) && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {idea.contentType && accent && (
            <span
              className="inline-flex items-center px-2.5 h-6 text-[11px] tracking-[-0.005em] border-l-[3px] border-y border-r border-y-[color:var(--color-rule)] border-r-[color:var(--color-rule)] text-[color:var(--color-ink-60)]"
              style={{ borderLeftColor: accent }}
            >
              {idea.contentType}
            </span>
          )}
          {idea.platforms.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1.5 px-2.5 h-6 text-[11px] tracking-[-0.005em] border border-[color:var(--color-rule)] text-[color:var(--color-ink-60)]"
            >
              <PlatformGlyph platform={p} size={11} />
              {p}
            </span>
          ))}
        </div>
      )}

      {!promoted && (
        <div className="mt-5 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => onGenerate(idea)}
            className="inline-flex items-center gap-1.5 px-2.5 h-7 text-[11px] tracking-[-0.005em] text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-rule)]/40 rounded-[var(--radius-sm)]"
          >
            <Sparkles size={12} strokeWidth={1.5} />
            Generate script
          </button>
          <button
            type="button"
            onClick={() => onPromote(idea)}
            className="inline-flex items-center gap-1.5 px-2.5 h-7 text-[11px] tracking-[-0.005em] text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-rule)]/40 rounded-[var(--radius-sm)]"
          >
            <Send size={12} strokeWidth={1.5} />
            Promote to post
          </button>
          <button
            type="button"
            onClick={() => onDelete(idea)}
            aria-label="Delete idea"
            className="inline-flex items-center justify-center w-7 h-7 text-[color:var(--color-ink-45)] hover:text-[color:var(--color-warn)] hover:bg-[color:var(--color-rule)]/40 rounded-[var(--radius-sm)]"
          >
            <Trash2 size={12} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </article>
  );
}
