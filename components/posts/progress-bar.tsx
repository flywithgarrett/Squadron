import type { Post, Status } from "@/lib/types";
import { statusColor } from "./status-indicator";

export function DayProgressBar({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  if (posts.length === 0) return null;
  return (
    <div
      className={
        "h-[3px] flex border border-[color:var(--color-rule-strong)] gap-px " +
        (className ?? "")
      }
      aria-hidden
    >
      {posts.map((p) => (
        <span
          key={p.id}
          className="flex-1"
          style={{
            backgroundColor:
              p.status === "Planned"
                ? "transparent"
                : statusColor(p.status),
            opacity: p.status === "Killed" ? 0.4 : 1,
          }}
        />
      ))}
    </div>
  );
}

export function CompletionBar({
  total,
  posted,
  className,
}: {
  total: number;
  posted: number;
  className?: string;
}) {
  const pct = total ? Math.min(100, Math.round((posted / total) * 100)) : 0;
  return (
    <div className={"flex items-center gap-4 " + (className ?? "")}>
      <div
        className="flex-1 h-[3px] border border-[color:var(--color-rule-strong)] relative overflow-hidden"
        aria-label={`${posted} of ${total} posted`}
      >
        <span
          className="absolute inset-y-0 left-0 transition-[width] duration-200"
          style={{
            width: `${pct}%`,
            backgroundColor: "var(--color-gold)",
          }}
        />
      </div>
      <div className="text-[13px] tabular text-[color:var(--color-ink-60)] shrink-0">
        <span className="font-medium text-[color:var(--color-ink)]">
          {posted}
        </span>{" "}
        of {total} posted
      </div>
    </div>
  );
}

export function statusFor(p: Post): Status {
  return p.status;
}
