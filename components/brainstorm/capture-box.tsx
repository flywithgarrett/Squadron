"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENT_TYPES } from "@/lib/content-types";
import {
  CONTENT_TYPE_NAMES,
  PLATFORMS,
  type ContentType,
  type Idea,
  type Platform,
} from "@/lib/types";
import { Button } from "@/components/primitives/button";
import { PlatformGlyph } from "@/components/icons/platform-glyph";

interface Props {
  onCapture: (idea: Idea) => void;
  storageReady: boolean;
}

export function CaptureBox({ onCapture, storageReady }: Props) {
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [text]);

  function togglePlatform(p: Platform) {
    setPlatforms((cur) =>
      cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p],
    );
  }

  async function capture() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          contentType: contentType ?? undefined,
          platforms,
          source: "manual",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Could not save idea.");
      }
      onCapture(data.idea as Idea);
      setText("");
      setContentType(null);
      setPlatforms([]);
    } catch (err: any) {
      setError(err?.message ?? "Could not save.");
    } finally {
      setPending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      capture();
    }
  }

  return (
    <div>
      <div className="border-b border-[color:var(--color-rule-strong)] focus-within:border-[color:var(--color-gold)] transition-colors duration-200">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="What's the idea?"
          className="w-full bg-transparent resize-none text-[18px] leading-[1.45] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-30)] py-4 focus:outline-none"
          disabled={!storageReady}
        />
      </div>

      {/* Chip rows */}
      <div className="mt-7 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-[0.16em] uppercase text-[color:var(--color-ink-45)] mr-2">
            Type
          </span>
          {CONTENT_TYPE_NAMES.map((t) => {
            const cfg = CONTENT_TYPES[t];
            const active = contentType === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setContentType(active ? null : t)}
                disabled={!storageReady}
                className={
                  "inline-flex items-center px-3 h-8 text-[12px] tracking-[-0.005em] border-l-[3px] border-y border-r " +
                  (active
                    ? "border-y-[color:var(--color-rule-strong)] border-r-[color:var(--color-rule-strong)] text-[color:var(--color-ink)]"
                    : "border-y-[color:var(--color-rule)] border-r-[color:var(--color-rule)] text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)]")
                }
                style={{
                  borderLeftColor: cfg.accent,
                  backgroundColor: active ? `${cfg.accent}14` : "transparent",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-[0.16em] uppercase text-[color:var(--color-ink-45)] mr-2">
            Platforms
          </span>
          {PLATFORMS.map((p) => {
            const active = platforms.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                disabled={!storageReady}
                className={
                  "inline-flex items-center gap-2 px-3 h-8 text-[12px] tracking-[-0.005em] border " +
                  (active
                    ? "bg-[color:var(--color-ink)]/[0.06] border-[color:var(--color-ink)]/35 text-[color:var(--color-ink)]"
                    : "border-[color:var(--color-rule)] text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)]")
                }
              >
                <PlatformGlyph platform={p} size={12} />
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <div className="text-[11px] tracking-[0.04em] text-[color:var(--color-ink-45)]">
          {error ? (
            <span className="text-[color:var(--color-warn)]">{error}</span>
          ) : storageReady ? (
            <span>Press ⌘ + Enter to capture</span>
          ) : (
            <span>Connect storage to enable capture</span>
          )}
        </div>
        <Button
          type="button"
          onClick={capture}
          disabled={pending || !text.trim() || !storageReady}
          size="sm"
        >
          {pending ? "Saving" : "Capture"}
        </Button>
      </div>
    </div>
  );
}
