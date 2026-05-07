"use client";

import { activePhase, getPhases } from "@/lib/phases";
import type { Post } from "@/lib/types";

interface Props {
  posts: Post[];
  onJump: (firstWeekStart: string) => void;
}

export function PhaseStrip({ posts, onJump }: Props) {
  const phases = getPhases(posts);
  const current = activePhase(posts);

  return (
    <div
      role="navigation"
      aria-label="Plan phases"
      className="grid grid-cols-3 border-y border-[color:var(--color-rule)]"
    >
      {phases.map((phase, i) => {
        const isActive = current?.key === phase.key;
        return (
          <button
            key={phase.key}
            type="button"
            onClick={() => onJump(phase.firstWeekStart)}
            className={
              "relative text-left px-5 py-5 transition-colors duration-200 hover:bg-[color:var(--color-rule)]/40 " +
              (i > 0 ? "border-l border-[color:var(--color-rule)]" : "")
            }
          >
            <span
              aria-hidden
              className={
                "absolute -top-px left-0 right-0 h-0.5 transition-opacity duration-200 " +
                (isActive
                  ? "bg-[color:var(--color-gold)] opacity-100"
                  : "bg-[color:var(--color-gold)] opacity-0")
              }
            />
            <div className="flex items-baseline justify-between gap-3">
              <p
                className={
                  "text-[11px] tracking-[0.16em] uppercase font-medium " +
                  (isActive
                    ? "text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-60)]")
                }
              >
                {phase.shortLabel}
              </p>
              {isActive && (
                <span className="text-[10px] tracking-[0.14em] uppercase text-[color:var(--color-gold)]">
                  Now
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[10px] tracking-[0.04em] text-[color:var(--color-ink-45)] tabular">
              {phase.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
