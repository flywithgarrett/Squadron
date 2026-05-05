import { CONTENT_TYPES } from "@/lib/content-types";
import { formatDayDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import { PlatformGlyph } from "@/components/icons/platform-glyph";

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
  return (
    <article
      className={
        "bg-[#FBFAF6] pl-5 pr-6 py-5 border border-[color:var(--color-hairline)] " +
        (className ?? "")
      }
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.02em] text-[color:var(--color-navy-mute)] tabular">
          {showDate && <time>{formatDayDate(post.date)}</time>}
          {showDate && <span aria-hidden>·</span>}
          <span>{post.time}</span>
        </div>
        <div className="flex items-center gap-2 text-[color:var(--color-navy-mute)]">
          {post.platforms.map((p) => (
            <PlatformGlyph key={p} platform={p} size={14} />
          ))}
        </div>
      </div>

      <h3 className="text-[14px] font-medium leading-snug text-[#0A2540] mb-3">
        {post.title}
      </h3>

      {post.hook && (
        <p className="text-[13px] leading-relaxed text-[color:var(--color-navy-soft)] mb-4 line-clamp-3">
          {post.hook}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.04em] text-[color:var(--color-navy-mute)]">
        <span>{post.contentType}</span>
        <span className="tabular">Wk {post.week}</span>
      </div>
    </article>
  );
}
