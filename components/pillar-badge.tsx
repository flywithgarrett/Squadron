import { PILLARS } from "@/lib/pillars";
import type { Pillar } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PillarBadge({
  pillar,
  className,
  showFull = false,
}: {
  pillar: Pillar;
  className?: string;
  showFull?: boolean;
}) {
  const config = PILLARS[pillar];
  const label = showFull ? pillar : pillar.split(" — ")[0];
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] uppercase tracking-[0.1em] font-semibold px-2 py-0.5 border",
        className,
      )}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.color,
      }}
    >
      {showFull ? label : `Pillar ${label}`}
    </span>
  );
}
