"use client";

import type { ProgressGroup } from "@/lib/types";

const ITEMS: Array<{ key: ProgressGroup; label: string }> = [
  { key: "all", label: "All" },
  { key: "in-progress", label: "In Progress" },
  { key: "complete", label: "Complete" },
  { key: "killed", label: "Killed" },
];

export function ProgressFilterChips({
  value,
  onChange,
  counts,
}: {
  value: ProgressGroup;
  onChange: (next: ProgressGroup) => void;
  counts?: Partial<Record<ProgressGroup, number>>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Progress filter"
      className="flex flex-wrap items-center gap-2"
    >
      {ITEMS.map((item) => {
        const active = value === item.key;
        const count = counts?.[item.key];
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={
              "inline-flex items-center gap-2 px-3.5 h-8 text-[12px] font-medium tracking-[-0.005em] rounded-full border transition-colors duration-200 " +
              (active
                ? "bg-[color:var(--color-ink)] text-[color:var(--color-canvas)] border-[color:var(--color-ink)]"
                : "bg-transparent text-[color:var(--color-ink-60)] border-[color:var(--color-rule-strong)] hover:text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]/40")
            }
          >
            <span>{item.label}</span>
            {typeof count === "number" && (
              <span
                className={
                  "text-[10px] tabular " +
                  (active
                    ? "text-[color:var(--color-canvas)]/60"
                    : "text-[color:var(--color-ink-45)]")
                }
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function progressGroupOf(status: string): ProgressGroup {
  if (status === "Posted") return "complete";
  if (status === "Killed") return "killed";
  return "in-progress";
}
