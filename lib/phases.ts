import type { Phase, Post } from "./types";
import { parseDate, toIso } from "./format";

export interface PhaseInfo {
  key: Phase;
  shortLabel: string;
  description: string;
  startDate: string;
  endDate: string;
  startWeek: number;
  endWeek: number;
  firstWeekStart: string;
}

const PLAN_START_ISO = "2026-05-11";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function addDays(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
}

export function getPhases(posts: Post[]): PhaseInfo[] {
  const start = posts[0]?.date ?? PLAN_START_ISO;
  const planStart = startOfWeekMonday(start);

  return [
    {
      key: "Phase 1 — Lock the Engine",
      shortLabel: "Lock the Engine",
      description: "Days 1–28",
      startDate: planStart,
      endDate: addDays(planStart, 27),
      startWeek: 1,
      endWeek: 4,
      firstWeekStart: planStart,
    },
    {
      key: "Phase 2 — Push the Winners",
      shortLabel: "Push the Winners",
      description: "Days 29–56",
      startDate: addDays(planStart, 28),
      endDate: addDays(planStart, 55),
      startWeek: 5,
      endWeek: 8,
      firstWeekStart: addDays(planStart, 28),
    },
    {
      key: "Phase 3 — Scale What Works",
      shortLabel: "Scale What Works",
      description: "Days 57–91",
      startDate: addDays(planStart, 56),
      endDate: addDays(planStart, 90),
      startWeek: 9,
      endWeek: 13,
      firstWeekStart: addDays(planStart, 56),
    },
  ];
}

function startOfWeekMonday(iso: string): string {
  const dt = parseDate(iso);
  const dow = dt.getUTCDay();
  const offsetToMonday = dow === 0 ? -6 : 1 - dow;
  dt.setUTCDate(dt.getUTCDate() + offsetToMonday);
  return toIso(dt);
}

export function activePhase(posts: Post[]): PhaseInfo | null {
  const phases = getPhases(posts);
  const today = new Date().toISOString().slice(0, 10);
  for (const p of phases) {
    if (today >= p.startDate && today <= p.endDate) return p;
  }
  // Outside the plan window — fall back to nearest by date
  if (today < phases[0].startDate) return phases[0];
  return phases[phases.length - 1];
}
