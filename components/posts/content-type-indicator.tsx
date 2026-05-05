import { CONTENT_TYPES } from "@/lib/content-types";
import type { ContentType } from "@/lib/types";

export function ContentTypeIndicator({
  contentType,
  className,
}: {
  contentType: ContentType;
  className?: string;
}) {
  const cfg = CONTENT_TYPES[contentType];
  return (
    <span
      className={
        "inline-flex items-center gap-2 text-[11px] tracking-[0.04em] text-[color:var(--color-navy-soft)] " +
        (className ?? "")
      }
    >
      <span
        aria-hidden
        className="inline-block w-[3px] h-3"
        style={{ backgroundColor: cfg.accent }}
      />
      {contentType}
    </span>
  );
}
