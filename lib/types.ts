export type Platform =
  | "Instagram Reel"
  | "Instagram Trial Reel"
  | "Instagram Story"
  | "TikTok"
  | "YouTube Short"
  | "LinkedIn";

export type ContentType =
  | "Cockpit Cinema"
  | "Instructor & BTS"
  | "Client Reactions"
  | "Hook-Driven Discovery"
  | "B2B Credibility";

export type Phase =
  | "Phase 1 — Lock the Engine"
  | "Phase 2 — Push the Winners"
  | "Phase 3 — Scale What Works";

export type Audience =
  | "Aviation Enthusiasts"
  | "Gift Buyers"
  | "NYC Experience Seekers"
  | "Corporate Decision Makers";

export type Status =
  | "Planned"
  | "Captured"
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
  platforms: Platform[];
  format: string;
  contentType: ContentType;
  audience: Audience;
  hook: string;
  cta: string;
  assetSource: string;
  productionNotes: string;
  status: Status;
  performanceNotes: string;
}

export const PLATFORMS: Platform[] = [
  "Instagram Reel",
  "Instagram Trial Reel",
  "Instagram Story",
  "TikTok",
  "YouTube Short",
  "LinkedIn",
];

export const CONTENT_TYPE_NAMES: ContentType[] = [
  "Cockpit Cinema",
  "Instructor & BTS",
  "Client Reactions",
  "Hook-Driven Discovery",
  "B2B Credibility",
];

export const PHASES: Phase[] = [
  "Phase 1 — Lock the Engine",
  "Phase 2 — Push the Winners",
  "Phase 3 — Scale What Works",
];

export const AUDIENCES: Audience[] = [
  "Aviation Enthusiasts",
  "Gift Buyers",
  "NYC Experience Seekers",
  "Corporate Decision Makers",
];

export const STATUSES: Status[] = [
  "Planned",
  "Captured",
  "Edited",
  "Scheduled",
  "Posted",
  "Killed",
];
