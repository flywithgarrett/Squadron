import { PillarBadge } from "@/components/pillar-badge";
import { PlatformIcon } from "@/components/platform-icon";
import { Badge } from "@/components/ui/badge";
import { PILLARS } from "@/lib/pillars";
import { formatDayDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PostCard({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  const pillar = PILLARS[post.pillar];
  return (
    <article
      className={cn(
        "bg-white border border-stone-200 border-l-4 p-6",
        className,
      )}
      style={{ borderLeftColor: pillar.color }}
    >
      <header className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 text-xs text-[#5B6770]">
          <PlatformIcon platform={post.platform} className="h-4 w-4" />
          <span className="uppercase tracking-[0.08em] font-medium">
            {post.platform}
          </span>
          <span className="text-stone-300">·</span>
          <time>{formatDayDate(post.date)}</time>
          <span className="text-stone-300">·</span>
          <span>{post.time}</span>
        </div>
        <PillarBadge pillar={post.pillar} />
      </header>

      <h3 className="text-base font-semibold leading-snug text-[#0A2540] tracking-tight mb-2">
        {post.title}
      </h3>

      {post.hook && (
        <p className="text-sm leading-relaxed text-[#5B6770] mb-4">
          {post.hook}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5B6770]">
        <Badge variant="muted">{post.format}</Badge>
        <Badge variant="outline">Week {post.week}</Badge>
        <Badge variant="outline">{post.status}</Badge>
      </div>
    </article>
  );
}
