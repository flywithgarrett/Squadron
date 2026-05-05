import type { ContentType } from "./types";

export const CONTENT_TYPES = {
  "Cockpit Cinema": {
    accent: "#1E3A5F",
    description: "Cinematic, visual-first cockpit content.",
  },
  "Instructor & BTS": {
    accent: "#8B6F1F",
    description: "Behind the scenes, instructor talking head.",
  },
  "Client Reactions": {
    accent: "#2F5D34",
    description: "Real moments from real bookings.",
  },
  "Hook-Driven Discovery": {
    accent: "#6B3F66",
    description: "Built for non-follower reach.",
  },
  "B2B Credibility": {
    accent: "#A14829",
    description: "LinkedIn and corporate-facing posts.",
  },
} as const satisfies Record<
  ContentType,
  { accent: string; description: string }
>;
