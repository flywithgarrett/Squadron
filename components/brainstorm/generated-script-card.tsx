"use client";

import { useState } from "react";
import { CONTENT_TYPES } from "@/lib/content-types";
import type { ContentType, Platform } from "@/lib/types";

interface Props {
  text: string;
  contentType?: ContentType;
  platforms: Platform[];
  onSave: () => Promise<void>;
  onDiscard: () => void;
}

export function GeneratedScriptCard({
  text,
  contentType,
  platforms,
  onSave,
  onDiscard,
}: Props) {
  const [pending, setPending] = useState(false);
  const accent = contentType ? CONTENT_TYPES[contentType].accent : null;

  return (
    <article
      className="bg-[color:var(--color-paper)] border border-[color:var(--color-rule)] pl-6 pr-7 py-7"
      style={{
        borderLeft: accent
          ? `3px solid ${accent}`
          : "3px solid var(--color-rule-strong)",
      }}
    >
      <p className="text-[14px] leading-[1.6] text-[color:var(--color-ink)] whitespace-pre-wrap">
        {text}
      </p>

      {(contentType || platforms.length > 0) && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.04em] text-[color:var(--color-ink-45)]">
          {contentType && <span>{contentType}</span>}
          {contentType && platforms.length > 0 && <span aria-hidden>·</span>}
          {platforms.length > 0 && <span>{platforms.join(" · ")}</span>}
        </div>
      )}

      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onDiscard}
          className="text-[11px] tracking-[0.04em] uppercase text-[color:var(--color-ink-45)] hover:text-[color:var(--color-ink)]"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={async () => {
            setPending(true);
            try {
              await onSave();
            } finally {
              setPending(false);
            }
          }}
          disabled={pending}
          className="inline-flex items-center px-4 h-8 text-[12px] font-medium tracking-[-0.005em] bg-[color:var(--color-ink)] text-[color:var(--color-canvas)] rounded-[var(--radius-sm)] hover:bg-[#11305B] disabled:opacity-40"
        >
          {pending ? "Saving" : "Save to ideas"}
        </button>
      </div>
    </article>
  );
}
