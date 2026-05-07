"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import type { ContentType, Idea, Platform } from "@/lib/types";
import { GeneratedScriptCard } from "./generated-script-card";
import { Button } from "@/components/primitives/button";

const PRESETS: Array<{ label: string; prompt: string }> = [
  {
    label: "Reel script (30 seconds)",
    prompt:
      "Write a 30-second Instagram Reel script for The Squadron. Open with a one-second hook. Keep it to about 70 spoken words. End with a quiet CTA.",
  },
  {
    label: "TikTok hook ideas (5 variations)",
    prompt:
      "Give me 5 distinct TikTok opening hooks for The Squadron, each under 12 words. Designed for non-followers. Each on its own line, numbered.",
  },
  {
    label: "Instagram caption (with CTA)",
    prompt:
      "Write a 100-word Instagram caption for a Reel about a first-time guest's reaction in the cockpit. Close with a soft CTA to book a brief.",
  },
  {
    label: "LinkedIn post (B2B credibility)",
    prompt:
      "Write a 1,200-character LinkedIn post for L&D leaders about why our debrief beats a hotel-ballroom off-site. One stat, one human moment, one declarative close.",
  },
];

interface Props {
  contentType?: ContentType | null;
  platforms?: Platform[];
  onSaved: (idea: Idea) => void;
  storageReady: boolean;
  apiReady: boolean;
}

export function ScriptGenerator({
  contentType,
  platforms,
  onSaved,
  storageReady,
  apiReady,
}: Props) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<string[]>([]);

  async function generate() {
    if (!prompt.trim()) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt,
          contentType: contentType ?? undefined,
          platforms: platforms ?? [],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Generation failed.");
      }
      setDrafts((cur) => [data.text as string, ...cur]);
    } catch (err: any) {
      setError(err?.message ?? "Generation failed.");
    } finally {
      setPending(false);
    }
  }

  async function save(text: string) {
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: text.slice(0, 200),
        generatedScript: text,
        contentType: contentType ?? undefined,
        platforms: platforms ?? [],
        source: "ai-generated",
      }),
    });
    const data = await res.json();
    if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Save failed.");
    onSaved(data.idea as Idea);
    setDrafts((cur) => cur.filter((d) => d !== text));
  }

  return (
    <div>
      {drafts.length > 0 && (
        <div className="mb-8 space-y-3">
          {drafts.map((d, i) => (
            <GeneratedScriptCard
              key={i}
              text={d}
              contentType={contentType ?? undefined}
              platforms={platforms ?? []}
              onSave={() => save(d)}
              onDiscard={() =>
                setDrafts((cur) => cur.filter((x) => x !== d))
              }
            />
          ))}
        </div>
      )}

      <div className="border border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
          aria-expanded={open}
        >
          <span className="inline-flex items-center gap-3 text-[color:var(--color-ink)]">
            <Sparkles size={16} strokeWidth={1.5} />
            <span className="text-[14px] font-medium tracking-[-0.005em]">
              Generate a script from a prompt
            </span>
          </span>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className={
              "text-[color:var(--color-ink-45)] transition-transform duration-200 " +
              (open ? "rotate-180" : "")
            }
          />
        </button>

        {open && (
          <div className="px-6 pb-7 pt-1">
            {!apiReady && (
              <p className="mb-5 text-[12px] tracking-[0.04em] text-[color:var(--color-warn)]">
                Connect ANTHROPIC_API_KEY to enable generation.
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPrompt(p.prompt)}
                  className="inline-flex items-center px-3 h-8 text-[11px] tracking-[-0.005em] border border-[color:var(--color-rule-strong)] text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]/40 rounded-full"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="What should the script do?"
              className="w-full bg-transparent border-b border-[color:var(--color-rule-strong)] focus:border-[color:var(--color-gold)] focus:outline-none py-3 text-[14px] leading-[1.55] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-30)] resize-y"
              disabled={!apiReady || pending}
            />

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="text-[11px] tracking-[0.04em] text-[color:var(--color-ink-45)]">
                {error ? (
                  <span className="text-[color:var(--color-warn)]">{error}</span>
                ) : !storageReady ? (
                  <span>Connect storage to save generated drafts</span>
                ) : (
                  <span>Drafts appear above. Save the ones you want.</span>
                )}
              </div>
              <Button
                type="button"
                onClick={generate}
                disabled={pending || !apiReady || !prompt.trim()}
                size="sm"
              >
                {pending ? "Generating" : "Generate"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
