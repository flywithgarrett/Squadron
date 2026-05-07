"use client";

import { ACTIVE_STATUSES, type Status } from "@/lib/types";
import { StatusIndicator } from "./status-indicator";

interface Props {
  value: Status;
  onChange: (next: Status) => void;
  disabled?: boolean;
}

export function StatusSelector({ value, onChange, disabled }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Status"
      className="grid grid-cols-5 gap-2 md:gap-3"
    >
      {ACTIVE_STATUSES.map((status) => {
        const active = value === status;
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(status)}
            className={
              "flex flex-col items-center gap-2 py-3 px-2 group focus-visible:outline-none disabled:opacity-40 " +
              (active ? "" : "hover:bg-[color:var(--color-rule)]/40 rounded-[var(--radius-sm)]")
            }
          >
            <span className="relative flex items-center justify-center">
              <StatusIndicator status={status} size={status === "Posted" ? 14 : 12} />
            </span>
            <span
              className={
                "text-[11px] tracking-[0.04em] " +
                (active
                  ? "text-[color:var(--color-ink)] font-medium"
                  : "text-[color:var(--color-ink-45)] group-hover:text-[color:var(--color-ink-60)]")
              }
            >
              {status}
            </span>
            <span
              aria-hidden
              className={
                "h-px w-6 -mt-1 transition-opacity duration-200 " +
                (active
                  ? "bg-[color:var(--color-gold)] opacity-100"
                  : "bg-[color:var(--color-gold)] opacity-0")
              }
            />
          </button>
        );
      })}
    </div>
  );
}
