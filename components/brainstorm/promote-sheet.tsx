"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/content-types";
import {
  AUDIENCES,
  CONTENT_TYPE_NAMES,
  PLATFORMS,
  type Audience,
  type ContentType,
  type Idea,
  type Platform,
  type Post,
} from "@/lib/types";
import { findNextOpenDate } from "@/lib/posts";
import { formatLongDate, parseDate } from "@/lib/format";
import { PlatformGlyph } from "@/components/icons/platform-glyph";

interface Props {
  idea: Idea | null;
  posts: Post[];
  onClose: () => void;
  onPromoted: (post: Post, ideaId: string) => void;
}

export function PromoteSheet({ idea, posts, onClose, onPromoted }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:30 PM");
  const [contentType, setContentType] = useState<ContentType>("Cockpit Cinema");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [audience, setAudience] = useState<Audience>("Aviation Enthusiasts");
  const [hook, setHook] = useState("");
  const [cta, setCta] = useState("");
  const [format, setFormat] = useState("Reel — to be defined");
  const [productionNotes, setProductionNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultDate = useMemo(
    () => findNextOpenDate(posts, new Date().toISOString().slice(0, 10)),
    [posts],
  );

  useEffect(() => {
    if (!idea) return;
    setTitle(idea.text.length > 80 ? idea.text.slice(0, 80).trim() : idea.text);
    setDate(defaultDate);
    setTime("12:30 PM");
    setContentType(idea.contentType ?? "Cockpit Cinema");
    setPlatforms(idea.platforms);
    setAudience("Aviation Enthusiasts");
    setHook(idea.generatedScript ?? idea.text);
    setCta("");
    setFormat("Reel — to be defined");
    setProductionNotes("");
    setError(null);
  }, [idea, defaultDate]);

  useEffect(() => {
    if (!idea) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idea, onClose]);

  if (!idea) return null;
  const accent = CONTENT_TYPES[contentType].accent;

  function togglePlatform(p: Platform) {
    setPlatforms((cur) =>
      cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p],
    );
  }

  async function schedule() {
    if (!idea) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/posts/promote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ideaId: idea.id,
          title,
          date,
          time,
          contentType,
          platforms,
          audience,
          hook,
          cta,
          format,
          productionNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Could not promote.");
      }
      onPromoted(data.post as Post, idea.id);
    } catch (err: any) {
      setError(err?.message ?? "Could not promote.");
    } finally {
      setPending(false);
    }
  }

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <section className="pt-7 border-t border-[color:var(--color-rule)]">
      <p className="eyebrow text-[color:var(--color-ink-45)] mb-3">{label}</p>
      {children}
    </section>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Schedule post"
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
          <p className="eyebrow text-[color:var(--color-ink-45)]">
            Promote idea
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-[color:var(--color-ink-45)] hover:text-[color:var(--color-ink)] -mr-1.5 w-8 h-8 inline-flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[color:var(--color-rule)]"
            aria-label="Close panel"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-9 py-12">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="display w-full text-[26px] md:text-[30px] leading-[1.15] text-[color:var(--color-ink)] bg-transparent border-b border-[color:var(--color-rule)] focus:border-[color:var(--color-ink)] focus:outline-none py-3 mb-10"
            placeholder="Working title"
          />

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div>
              <p className="eyebrow text-[color:var(--color-ink-45)] mb-2.5">
                Date
              </p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent border-b border-[color:var(--color-rule-strong)] focus:border-[color:var(--color-ink)] focus:outline-none text-[14px] tabular text-[color:var(--color-ink)] py-2"
              />
              {date && (
                <p className="mt-2 text-[11px] text-[color:var(--color-ink-45)] tabular">
                  {formatLongDate(date)}
                </p>
              )}
            </div>
            <div>
              <p className="eyebrow text-[color:var(--color-ink-45)] mb-2.5">
                Time
              </p>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="7:30 AM"
                className="w-full bg-transparent border-b border-[color:var(--color-rule-strong)] focus:border-[color:var(--color-ink)] focus:outline-none text-[14px] tabular text-[color:var(--color-ink)] py-2"
              />
            </div>
          </div>

          <Field label="Content type">
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPE_NAMES.map((t) => {
                const cfg = CONTENT_TYPES[t];
                const active = contentType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setContentType(t)}
                    className={
                      "inline-flex items-center px-3 h-8 text-[12px] tracking-[-0.005em] border-l-[3px] border-y border-r " +
                      (active
                        ? "border-y-[color:var(--color-rule-strong)] border-r-[color:var(--color-rule-strong)] text-[color:var(--color-ink)]"
                        : "border-y-[color:var(--color-rule)] border-r-[color:var(--color-rule)] text-[color:var(--color-ink-60)]")
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
          </Field>

          <Field label="Platforms">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = platforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={
                      "inline-flex items-center gap-2 px-3 h-8 text-[12px] tracking-[-0.005em] border " +
                      (active
                        ? "bg-[color:var(--color-ink)]/[0.06] border-[color:var(--color-ink)]/35 text-[color:var(--color-ink)]"
                        : "border-[color:var(--color-rule)] text-[color:var(--color-ink-60)]")
                    }
                  >
                    <PlatformGlyph platform={p} size={12} />
                    {p}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Audience">
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as Audience)}
              className="w-full bg-transparent border-b border-[color:var(--color-rule-strong)] focus:border-[color:var(--color-ink)] focus:outline-none text-[14px] text-[color:var(--color-ink)] py-2 appearance-none"
            >
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Hook">
            <textarea
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              rows={3}
              className="w-full bg-transparent border-b border-[color:var(--color-rule-strong)] focus:border-[color:var(--color-ink)] focus:outline-none text-[14px] leading-[1.55] text-[color:var(--color-ink)] py-2 resize-y"
              placeholder="First two lines / on-screen text"
            />
          </Field>

          <Field label="Call to action">
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="w-full bg-transparent border-b border-[color:var(--color-rule-strong)] focus:border-[color:var(--color-ink)] focus:outline-none text-[14px] text-[color:var(--color-ink)] py-2"
              placeholder="What do you want them to do?"
            />
          </Field>

          <Field label="Format">
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-transparent border-b border-[color:var(--color-rule-strong)] focus:border-[color:var(--color-ink)] focus:outline-none text-[14px] text-[color:var(--color-ink)] py-2"
              placeholder='e.g., "Reel (30s)"'
            />
          </Field>

          <Field label="Production notes">
            <textarea
              value={productionNotes}
              onChange={(e) => setProductionNotes(e.target.value)}
              rows={3}
              className="w-full bg-transparent border-b border-[color:var(--color-rule-strong)] focus:border-[color:var(--color-ink)] focus:outline-none text-[14px] leading-[1.55] text-[color:var(--color-ink)] py-2 resize-y"
              placeholder="Editing notes, references, constraints"
            />
          </Field>

          {error && (
            <p className="mt-6 text-[12px] text-[color:var(--color-warn)]">
              {error}
            </p>
          )}

          <div className="mt-12 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-[12px] tracking-[0.04em] uppercase text-[color:var(--color-ink-45)] hover:text-[color:var(--color-ink)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={schedule}
              disabled={pending || !title.trim() || !date}
              className="inline-flex items-center px-6 h-10 text-[13px] font-medium tracking-[-0.005em] bg-[color:var(--color-ink)] text-[color:var(--color-canvas)] rounded-[var(--radius-sm)] hover:bg-[#11305B] disabled:opacity-40"
            >
              {pending ? "Scheduling" : "Schedule post"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
