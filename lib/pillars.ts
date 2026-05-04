import type { Pillar } from "./types";

export const PILLARS = {
  "1 — Cockpit Cinema": {
    color: "#1E3A5F",
    bg: "#E8F1F8",
    desc: "Stop the scroll. Capture awe.",
  },
  "2 — Mission Debrief": {
    color: "#8B6F1F",
    bg: "#F4ECDB",
    desc: "Establish credibility.",
  },
  "3 — Client Voice": {
    color: "#2F5D34",
    bg: "#EAF3EA",
    desc: "Social proof.",
  },
  "4 — Methodology": {
    color: "#6B3F66",
    bg: "#F2E8F0",
    desc: "Thought leadership.",
  },
  "5 — Booking the Mission": {
    color: "#A14829",
    bg: "#F9E4DD",
    desc: "Direct conversion.",
  },
} as const satisfies Record<Pillar, { color: string; bg: string; desc: string }>;

export const PILLAR_NAMES = Object.keys(PILLARS) as Pillar[];
