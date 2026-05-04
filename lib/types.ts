export type Platform = "LinkedIn" | "Instagram" | "TikTok" | "YouTube";

export type Pillar =
  | "1 — Cockpit Cinema"
  | "2 — Mission Debrief"
  | "3 — Client Voice"
  | "4 — Methodology"
  | "5 — Booking the Mission";

export type Phase =
  | "Phase 1 — Foundation"
  | "Phase 2 — Proof"
  | "Phase 3 — Convert";

export type Status =
  | "Planned"
  | "Shot"
  | "Edited"
  | "Scheduled"
  | "Posted"
  | "Killed";

export interface Post {
  id: string;
  title: string;
  date: string;
  time: string;
  week: number;
  phase: Phase;
  platform: Platform;
  format: string;
  pillar: Pillar;
  audience: string;
  hook: string;
  cta: string;
  sourceNotes: string;
  productionNotes: string;
  status: Status;
  performanceNotes: string;
}

export const PLATFORMS: Platform[] = [
  "LinkedIn",
  "Instagram",
  "TikTok",
  "YouTube",
];

export const PHASES: Phase[] = [
  "Phase 1 — Foundation",
  "Phase 2 — Proof",
  "Phase 3 — Convert",
];

export const STATUSES: Status[] = [
  "Planned",
  "Shot",
  "Edited",
  "Scheduled",
  "Posted",
  "Killed",
];
