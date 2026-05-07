import { CONTENT_TYPES } from "@/lib/content-types";
import { formatDayDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import { PlatformGlyph } from "@/components/icons/platform-glyph";
import { StatusIndicator } from "@/components/posts/status-indicator";

export function PostCard({
  post,
  showDate = true,
  className,
}: {
  post: Post;
  showDate?: boolean;
  className?: string;
}) {
  const accent = CONTENT_TYPES[post.contentType].accent;
  const killed = post.status === "Killed";
  return (
    <article
      className={
        "bg-[color:var(--color-paper)] pl-6 pr-7 py-6 border border-[color:var(--color-rule)] " +
        (killed ? "opacity-40 " : "") +
        (className ?? "")
      }
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.04em] text-[color:var(--color-ink-45)] tabular">
          {showDate && <time>{formatDayDate(post.date)}</time>}
          {showDate && <span aria-hidden>·</span>}
          <span>{post.time}</span>
        </div>
        <div className="flex items-center gap-2 text-[color:var(--color-ink-45)]">
          {post.platforms.map((p) => (
            <PlatformGlyph key={p} platform={p} size={14} />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2.5 mb-3">
        <span className="mt-1.5 shrink-0">
          <StatusIndicator status={post.status} size={post.status === "Posted" ? 12 : 10} />
        </span>
        <h3
          className={
            "text-[15px] font-medium leading-[1.35] text-[color:var(--color-ink)] tracking-[-0.005em] " +
            (killed ? "line-through" : "")
          }
        >
          {post.title}
        </h3>
      </div>

      {post.hook && (
        <p className="text-[13px] leading-relaxed text-[color:var(--color-ink-60)] mb-5 line-clamp-3 ml-[18px]">
          {post.hook}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.04em] text-[color:var(--color-ink-45)] ml-[18px]">
        <span>{post.contentType}</span>
        <span className="tabular">Wk {post.week}</span>
      </div>
    </article>
  );
}
