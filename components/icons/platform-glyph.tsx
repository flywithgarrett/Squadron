import type { Platform } from "@/lib/types";

interface Props {
  platform: Platform;
  className?: string;
  size?: number;
}

export function PlatformGlyph({ platform, className, size = 14 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (platform) {
    case "Instagram Reel":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M9 8.5v7l6-3.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Instagram Trial Reel":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <circle cx="12" cy="12" r="3" />
          <line x1="3.5" y1="8" x2="20.5" y2="8" strokeDasharray="2 2" />
        </svg>
      );
    case "Instagram Story":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="8" strokeDasharray="2 2.5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...common}>
          <path d="M10 4v11.5a3 3 0 1 1-3-3" />
          <path d="M10 4c0 3.5 2.5 5.5 5.5 5.5" />
        </svg>
      );
    case "YouTube Short":
      return (
        <svg {...common}>
          <rect x="6" y="3" width="12" height="18" rx="2" />
          <path d="M11 9.5v5l4-2.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="7.5" y1="10" x2="7.5" y2="17" />
          <circle cx="7.5" cy="7" r="0.6" fill="currentColor" stroke="none" />
          <path d="M11 17v-5a2.5 2.5 0 1 1 5 0v5" />
        </svg>
      );
  }
}
