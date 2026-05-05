import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "md" | "lg";
  withWordmark?: boolean;
  className?: string;
}

const SIZES = {
  sm: { mark: 26, gap: "gap-1.5", text: "text-[9px] tracking-[0.22em]" },
  md: { mark: 36, gap: "gap-2", text: "text-[10px] tracking-[0.24em]" },
  lg: { mark: 56, gap: "gap-3", text: "text-[12px] tracking-[0.28em]" },
} as const;

export function SquadronLogo({
  size = "md",
  withWordmark = true,
  className,
}: Props) {
  const cfg = SIZES[size];
  const mark = cfg.mark;

  return (
    <div
      aria-label="The Squadron"
      className={cn("flex flex-col items-center", cfg.gap, className)}
    >
      <svg
        width={mark}
        height={mark * 0.55}
        viewBox="0 0 64 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Outer wing — single bold chevron */}
        <path
          d="M 2 30 L 32 4 L 62 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Inner wing — tighter chevron, mirrors the outer */}
        <path
          d="M 14 30 L 32 14 L 50 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Center punch — short vertical anchor */}
        <path
          d="M 32 22 L 32 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
        />
      </svg>
      {withWordmark && (
        <span className={cn("font-semibold uppercase leading-none", cfg.text)}>
          The Squadron
        </span>
      )}
    </div>
  );
}
