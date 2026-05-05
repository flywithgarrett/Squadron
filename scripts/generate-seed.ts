/**
 * Generates data/seed.json — ~90 days of planned posts following the cadence
 * defined in the playbook. Idempotent and deterministic. Run with:
 *
 *   pnpm seed:gen
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Platform =
  | "Instagram Reel"
  | "Instagram Trial Reel"
  | "Instagram Story"
  | "TikTok"
  | "YouTube Short"
  | "LinkedIn";
type ContentType =
  | "Cockpit Cinema"
  | "Instructor & BTS"
  | "Client Reactions"
  | "Hook-Driven Discovery"
  | "B2B Credibility";
type Phase =
  | "Phase 1 — Lock the Engine"
  | "Phase 2 — Push the Winners"
  | "Phase 3 — Scale What Works";
type Audience =
  | "Aviation Enthusiasts"
  | "Gift Buyers"
  | "NYC Experience Seekers"
  | "Corporate Decision Makers";
type Status =
  | "Planned"
  | "Captured"
  | "Edited"
  | "Scheduled"
  | "Posted"
  | "Killed";

interface SeedPost {
  date: string;
  time: string;
  week: number;
  phase: Phase;
  platforms: Platform[];
  format: string;
  contentType: ContentType;
  audience: Audience;
  title: string;
  hook: string;
  cta: string;
  assetSource: string;
  productionNotes: string;
  status: Status;
  performanceNotes: string;
}

const START_ISO = "2026-05-11"; // First Monday of the 90-day plan

// ---------------------------------------------------------------------------
// Hook + title library — deliberately written in playbook voice
// "cinematic but human, no marketing-speak". Words like "mission," "brief,"
// "cockpit" are encouraged. Forbidden: "fun," "awesome," "amazing," "cool".
// ---------------------------------------------------------------------------

const REEL_BEATS: Array<{
  contentType: ContentType;
  audience: Audience;
  title: string;
  hook: string;
  cta: string;
  productionNotes: string;
  assetSource: string;
}> = [
  {
    contentType: "Cockpit Cinema",
    audience: "Aviation Enthusiasts",
    title: "Sunrise climb out of the Hudson corridor",
    hook: "Most New Yorkers have never seen the city like this.",
    cta: "Save for your next mission.",
    productionNotes: "Cockpit window, slow climb, ambient engine. No music drop until 0:14.",
    assetSource: "Monthly shoot — reel A1.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "POV: your Tuesday at 3,000 feet",
    hook: "Your office called. It's been replaced.",
    cta: "Follow if you want the brief.",
    productionNotes: "Helmet POV, hard cut from cockpit to skyline. Burn-in caption.",
    assetSource: "Daily capture rig — Monday block.",
  },
  {
    contentType: "Instructor & BTS",
    audience: "Aviation Enthusiasts",
    title: "What the briefing actually sounds like",
    hook: "Eight minutes before the cockpit opens.",
    cta: "Save the checklist — link in bio.",
    productionNotes: "Talking head, instructor mic only. Subtitle every line.",
    assetSource: "Monthly shoot — interview block.",
  },
  {
    contentType: "Client Reactions",
    audience: "Gift Buyers",
    title: "She didn't know it was a flight until 6 minutes in",
    hook: "Watch the moment she figures it out.",
    cta: "Send the brief to someone who deserves it.",
    productionNotes: "Two-camera, prioritize her face. Hold on the realization beat.",
    assetSource: "Booking — gift recipient (cleared).",
  },
  {
    contentType: "Cockpit Cinema",
    audience: "NYC Experience Seekers",
    title: "Forty-six switches before takeoff",
    hook: "Every one of them matters.",
    cta: "Save for your next mission.",
    productionNotes: "Macro hands, no faces. Mechanical precision aesthetic.",
    assetSource: "Monthly shoot — detail B-roll.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "Three things New Yorkers don't expect at 7 World Trade",
    hook: "Number two is the one nobody believes.",
    cta: "Comment your guess.",
    productionNotes: "Listicle pacing. Quick cuts on each beat. End on cockpit reveal.",
    assetSource: "Composite from monthly + daily reels.",
  },
  {
    contentType: "Instructor & BTS",
    audience: "Aviation Enthusiasts",
    title: "How an instructor reads the wind on a 6 AM mission",
    hook: "The first thing he does is look up.",
    cta: "Follow for the rest of the routine.",
    productionNotes: "Slow zoom on instructor outdoors. Whisper-quiet ambient.",
    assetSource: "Monthly shoot — exterior.",
  },
  {
    contentType: "Client Reactions",
    audience: "NYC Experience Seekers",
    title: "He flew in skeptical from Chicago",
    hook: "Forty minutes later he booked a return.",
    cta: "DM 'mission' to hold a slot.",
    productionNotes: "Quick interview cut + skyline footage. End on his quote.",
    assetSource: "Booking — March cohort.",
  },
  {
    contentType: "Cockpit Cinema",
    audience: "Aviation Enthusiasts",
    title: "Cockpit cold-start, no narration",
    hook: "Watch the panel come alive.",
    cta: "—",
    productionNotes: "Single continuous shot. No cuts. No score.",
    assetSource: "Monthly shoot — cold start sequence.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Gift Buyers",
    title: "What to gift the person who has every restaurant reservation",
    hook: "She's been to every rooftop.",
    cta: "Brief is in the bio.",
    productionNotes: "Quick reaction montage. End on the booking screen recording.",
    assetSource: "Composite from client clips.",
  },
  {
    contentType: "Instructor & BTS",
    audience: "Aviation Enthusiasts",
    title: "How we debrief a mission in nine minutes",
    hook: "Most teams think a debrief is a status update.",
    cta: "Save the framework.",
    productionNotes: "Whiteboard close-up + instructor v.o. Subtitled.",
    assetSource: "Monthly shoot — debrief room.",
  },
  {
    contentType: "Cockpit Cinema",
    audience: "NYC Experience Seekers",
    title: "Skyline reveal, no caption",
    hook: "Hold for the second one.",
    cta: "Save for inspiration.",
    productionNotes: "Two-shot fade. Restrained piano.",
    assetSource: "Monthly shoot — skyline plates.",
  },
  {
    contentType: "Client Reactions",
    audience: "Gift Buyers",
    title: "She thought it was a helicopter tour",
    hook: "Then the door closed.",
    cta: "Brief in the bio.",
    productionNotes: "POV her face. Hold on the cockpit door beat.",
    assetSource: "Booking — gift recipient (cleared).",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "If the briefing room makes you nervous, you're paying attention",
    hook: "Most people apologize for it.",
    cta: "Follow for what's actually in the brief.",
    productionNotes: "Tight on briefing card. Subtle dolly.",
    assetSource: "Monthly shoot — brief room.",
  },
  {
    contentType: "Instructor & BTS",
    audience: "Corporate Decision Makers",
    title: "What we look for before we let anyone fly",
    hook: "Three readiness signals. None of them are obvious.",
    cta: "Send to your L&D lead.",
    productionNotes: "Talking head + B-roll inserts. Restrained.",
    assetSource: "Monthly shoot — instructor block.",
  },
  {
    contentType: "Cockpit Cinema",
    audience: "Aviation Enthusiasts",
    title: "Forty seconds, no music, just the engine",
    hook: "Headphones on.",
    cta: "—",
    productionNotes: "Single shot. Native audio only. End on logo card.",
    assetSource: "Monthly shoot — engine plate.",
  },
  {
    contentType: "Client Reactions",
    audience: "Corporate Decision Makers",
    title: "A managing partner on what changed when she stopped explaining herself",
    hook: "Eight years in the chair. She'd never been asked the question this way.",
    cta: "DM 'brief' if your team is the bottleneck.",
    productionNotes: "Tight portrait. One uninterrupted answer.",
    assetSource: "Booking — Apr cohort interview.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "Things our first-time guests notice in the first ten minutes",
    hook: "Number three is the one nobody talks about.",
    cta: "Follow for the rest of the brief.",
    productionNotes: "Listicle. Burn-in captions. End on cockpit wide.",
    assetSource: "Composite from cleared cohort footage.",
  },
  {
    contentType: "Instructor & BTS",
    audience: "Aviation Enthusiasts",
    title: "Pre-flight checklist, hands only",
    hook: "Eighty-seven items. None optional.",
    cta: "Save the list.",
    productionNotes: "Top-down macro. Mechanical pacing.",
    assetSource: "Monthly shoot — checklist sequence.",
  },
  {
    contentType: "Cockpit Cinema",
    audience: "NYC Experience Seekers",
    title: "What our cohorts see at 5:47 AM",
    hook: "The city is still asleep.",
    cta: "Save for your next mission.",
    productionNotes: "Slow dolly across cockpit instruments. End on Hudson.",
    assetSource: "Monthly shoot — sunrise block.",
  },
  {
    contentType: "Client Reactions",
    audience: "Gift Buyers",
    title: "He got a brief instead of a tie this year",
    hook: "His face when the cockpit door opened.",
    cta: "Send the brief.",
    productionNotes: "Reaction-first. Hold the moment. Caption second.",
    assetSource: "Booking — gift recipient (cleared).",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Gift Buyers",
    title: "If you're stuck on a gift, watch this",
    hook: "It's not a gift card.",
    cta: "Brief in the bio.",
    productionNotes: "Direct address open. Then montage. End on booking page.",
    assetSource: "Composite reels.",
  },
  {
    contentType: "Instructor & BTS",
    audience: "Aviation Enthusiasts",
    title: "What instructors do in the silence",
    hook: "The room is loud until it isn't.",
    cta: "Follow for the rest.",
    productionNotes: "Slow zoom on hands. Native ambient.",
    assetSource: "Monthly shoot — silent block.",
  },
  {
    contentType: "Cockpit Cinema",
    audience: "Aviation Enthusiasts",
    title: "Engine spool to cleared for takeoff",
    hook: "Twelve seconds of held breath.",
    cta: "—",
    productionNotes: "Single take. Native audio. No score.",
    assetSource: "Monthly shoot — engine sequence.",
  },
  {
    contentType: "Client Reactions",
    audience: "NYC Experience Seekers",
    title: "She brought her dad. He hadn't smiled like that in a year.",
    hook: "Watch the moment he got it back.",
    cta: "DM 'brief' to plan a mission.",
    productionNotes: "Two-camera. Prioritize the dad. Subtle score.",
    assetSource: "Booking — Feb cohort.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "Three minutes from your desk to the cockpit",
    hook: "We timed it.",
    cta: "Brief in bio.",
    productionNotes: "Real-time clock overlay. Walk-and-talk.",
    assetSource: "Daily capture — commute block.",
  },
  {
    contentType: "Instructor & BTS",
    audience: "Corporate Decision Makers",
    title: "Why we time every decision in milliseconds",
    hook: "Hesitation is data. Most teams throw it away.",
    cta: "Save for your next 1:1.",
    productionNotes: "Instructor v.o. + timing instrument B-roll.",
    assetSource: "Monthly shoot — instructor block.",
  },
  {
    contentType: "Cockpit Cinema",
    audience: "Aviation Enthusiasts",
    title: "Hudson at golden hour, from seat 1A",
    hook: "The most expensive office in Manhattan — for the next ninety minutes.",
    cta: "Save.",
    productionNotes: "Continuous window shot. Restrained piano.",
    assetSource: "Monthly shoot — sunset block.",
  },
  {
    contentType: "Client Reactions",
    audience: "Corporate Decision Makers",
    title: "What a CFO said after she stopped speaking for fourteen seconds",
    hook: "She paused. Then she changed the call.",
    cta: "DM 'mission' if your team needs the same reset.",
    productionNotes: "Hold the silence. No music in the pause.",
    assetSource: "Booking — Mar cohort debrief.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Gift Buyers",
    title: "What CEOs say in their first cockpit minute",
    hook: "Ninety percent say the same three words.",
    cta: "Guess in the comments.",
    productionNotes: "Anonymous voice snippets over wide cockpit footage.",
    assetSource: "Cleared cohort recordings.",
  },
];

const TRIAL_REEL_BEATS: Array<{
  contentType: ContentType;
  audience: Audience;
  title: string;
  hook: string;
  cta: string;
  productionNotes: string;
}> = [
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "Three things you'd never get to do in your office",
    hook: "Number two is what everyone screenshots.",
    cta: "Follow for the brief.",
    productionNotes: "Hard hook. Burn-in captions. 9-second beat.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Gift Buyers",
    title: "If you're a partner who keeps getting flowers",
    hook: "Try this instead.",
    cta: "Brief in the bio.",
    productionNotes: "Direct-to-camera open. Then cockpit reveal.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "POV: your Tuesday afternoon",
    hook: "Most people are in a meeting right now.",
    cta: "Follow for the schedule.",
    productionNotes: "Helmet POV. End on skyline.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "What '7 World Trade Center' actually means now",
    hook: "It's not a building anymore.",
    cta: "Save for context.",
    productionNotes: "Quick architectural cuts. Then cockpit door.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Gift Buyers",
    title: "He's the hardest person to shop for",
    hook: "Until you watch this.",
    cta: "Brief in bio.",
    productionNotes: "Direct address. Then reaction footage.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "Three rooms in Manhattan worth seeing once",
    hook: "Save this for next month.",
    cta: "Follow for the rest.",
    productionNotes: "Curated montage. Cockpit is the third reveal.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Aviation Enthusiasts",
    title: "What it looks like to actually take the controls",
    hook: "Not a simulator. Not a tour.",
    cta: "DM 'brief'.",
    productionNotes: "Hand on yoke + instructor wide.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "If your weekend plans need a reset",
    hook: "Three Sundays from now you'll be glad.",
    cta: "Brief in the bio.",
    productionNotes: "Hard hook + cockpit door close-up.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Corporate Decision Makers",
    title: "If your last off-site felt like a hotel ballroom",
    hook: "There's a different version of this.",
    cta: "DM 'mission'.",
    productionNotes: "Direct address. Cut to cohort footage.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Gift Buyers",
    title: "She's been to every restaurant on the Times list",
    hook: "Try this for her birthday.",
    cta: "Brief in bio.",
    productionNotes: "Restaurant clips → cockpit reveal.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "NYC Experience Seekers",
    title: "What you can do in 90 minutes downtown",
    hook: "It's not what you think.",
    cta: "Follow for the brief.",
    productionNotes: "Map overlay → cockpit reveal.",
  },
  {
    contentType: "Hook-Driven Discovery",
    audience: "Aviation Enthusiasts",
    title: "If you've ever asked what's actually in the cockpit",
    hook: "Forty-six switches. Three displays.",
    cta: "Save for next time.",
    productionNotes: "Tight macro inserts. Numbered overlay.",
  },
];

const LINKEDIN_POSTS: Array<{
  title: string;
  hook: string;
  cta: string;
  contentType: ContentType;
  audience: Audience;
  productionNotes: string;
  assetSource: string;
}> = [
  {
    title: "Why off-sites stop working in week three",
    hook: "Ninety percent of leadership programs see retention collapse by day twenty-one. The fix isn't more content — it's a different room.",
    cta: "Reply if you're rebuilding your L&D stack.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "Long-form text post, ~1,200 chars. Open with the stat. Close with one declarative line.",
    assetSource: "Reference ATD 2024 retention benchmark.",
  },
  {
    title: "The four-question debrief every operator should run weekly",
    hook: "Most teams confuse a status update with a debrief. They are not the same thing.",
    cta: "Comment 'four' for the printable card.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "Document carousel, six slides. One question per slide.",
    assetSource: "Internal — debrief card v3.",
  },
  {
    title: "What we learned running 47 cockpit briefs with C-suite operators",
    hook: "After 47 briefs, one pattern keeps showing up: senior leaders don't lack frameworks. They lack a mirror.",
    cta: "Reply with the framework you're tired of teaching.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "Text-only. Single sentence per paragraph.",
    assetSource: "Anonymized themes from 2025 cohort notes.",
  },
  {
    title: "A two-quarter follow-up: what changed for the leaders who came through",
    hook: "Six months out, the question we ask isn't 'what did you learn?' It's 'what did you stop doing?'",
    cta: "Comment 'follow-up' for the longitudinal data.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "10-slide carousel. Restrained chart styling, one accent color.",
    assetSource: "Anonymized 6-month post-program data.",
  },
  {
    title: "Why we time every decision in milliseconds",
    hook: "Hesitation is data. Most organizations throw it away.",
    cta: "Save the framework.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "8-slide carousel. Show the timing instrument on slide 2.",
    assetSource: "Internal decision-latency methodology.",
  },
  {
    title: "We tracked one team's decision quality for ninety days",
    hook: "Day one: fifteen decisions an hour. Day ninety: four — and they shipped twice as much.",
    cta: "Reply 'ninety' for the full report.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "Long-form text, 1,500 chars. Lean on the numbers.",
    assetSource: "Composite of three client cohorts.",
  },
  {
    title: "Inside our last cohort: three decisions, three outcomes",
    hook: "We don't run case studies. We run missions, and then we report the data.",
    cta: "DM 'cohort' for the full debrief.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "9-slide carousel. Decision → constraint → outcome.",
    assetSource: "Anonymized cohort data.",
  },
  {
    title: "What our last six clients told us they'd cut from the leadership budget",
    hook: "The pattern surprised us. They didn't cut what was failing. They cut what felt safe.",
    cta: "DM if you're rebuilding L&D.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "Editorial photo + caption. No carousel.",
    assetSource: "Aggregated client interviews.",
  },
  {
    title: "What three CEOs told us about why they finally pulled the trigger",
    hook: "It wasn't the price. It wasn't the curriculum. It was something simpler.",
    cta: "Reply 'trigger' for the full transcript.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "Long-form, 1,400 chars. Real quotes.",
    assetSource: "Three composite client interviews.",
  },
  {
    title: "How to evaluate whether your team is ready for The Squadron",
    hook: "We turn down forty percent of inbound. Here's the readiness signal we look for.",
    cta: "DM 'ready' for the diagnostic.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "8-slide carousel framed as a self-assessment.",
    assetSource: "Internal qualification framework.",
  },
  {
    title: "What's included — line by line, no marketing language",
    hook: "We've never written a brochure. This is the closest thing.",
    cta: "DM 'brief' for the executive packet.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "10-slide carousel. Plain typography. Reads like a memo.",
    assetSource: "Audit current packet.",
  },
  {
    title: "A note from the L&D lead at a Fortune 200 industrial",
    hook: "She sent it the day she got back. We're sharing it with permission.",
    cta: "Reply if your team needs the same kind of reset.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "Reproduce the letter as text. Don't paraphrase.",
    assetSource: "Letter — written permission on file.",
  },
  {
    title: "The Squadron debrief, applied in your boardroom",
    hook: "You don't need a cockpit to run a real debrief. You need four questions and a clock.",
    cta: "Comment 'portable' for the printable card.",
    contentType: "B2B Credibility",
    audience: "Corporate Decision Makers",
    productionNotes: "8-slide carousel. Show the card in use.",
    assetSource: "Internal methodology card.",
  },
];

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

function isoAddDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function phaseFor(week: number): Phase {
  if (week <= 4) return "Phase 1 — Lock the Engine";
  if (week <= 8) return "Phase 2 — Push the Winners";
  return "Phase 3 — Scale What Works";
}

function tikToksPerWeek(week: number): number {
  if (week <= 4) return 3;
  if (week <= 8) return 4;
  if (week <= 11) return 5;
  return 6;
}

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function reelFormatLabel(): string {
  const choices = ["Reel (30s)", "Reel (45s)", "Reel (20s)"];
  return choices[Math.floor(Math.random() * choices.length)];
}

function generate(): SeedPost[] {
  const posts: SeedPost[] = [];
  const TOTAL_WEEKS = 13;

  let reelIdx = 0;
  let trialIdx = 0;
  let liIdx = 0;

  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    const monday = isoAddDays(START_ISO, (week - 1) * 7);
    const phase = phaseFor(week);

    // ---- Daily Stories (single weekly recurring entry) ----
    posts.push({
      date: monday,
      time: "All day",
      week,
      phase,
      platforms: ["Instagram Story"],
      format: "Daily Stories — recurring",
      contentType: "Instructor & BTS",
      audience: "Aviation Enthusiasts",
      title: `Stories rotation — week ${week}`,
      hook: "Captured throughout the week from cockpit prep, briefings, and skyline footage.",
      cta: "Swipe up for the brief.",
      assetSource: "Daily capture rig + monthly shoot pulls.",
      productionNotes:
        "Post 3-5 stories per day. Rotate cockpit B-roll, instructor moments, and behind-the-glass shots. End each day on a CTA frame.",
      status: "Planned",
      performanceNotes: "",
    });

    // ---- LinkedIn (1/week, Tue or Thu morning) ----
    {
      const onThursday = week % 2 === 0;
      const day = onThursday ? 3 : 1; // 0=Mon, 1=Tue, 3=Thu
      const beat = pick(LINKEDIN_POSTS, liIdx++);
      posts.push({
        date: isoAddDays(monday, day),
        time: "7:30 AM",
        week,
        phase,
        platforms: ["LinkedIn"],
        format: "LinkedIn — long-form post",
        contentType: beat.contentType,
        audience: beat.audience,
        title: beat.title,
        hook: beat.hook,
        cta: beat.cta,
        assetSource: beat.assetSource,
        productionNotes: beat.productionNotes,
        status: "Planned",
        performanceNotes: "",
      });
    }

    // ---- Reels (2-3/week) — vary by week ----
    const reelsThisWeek = week % 3 === 0 ? 3 : 2;
    const reelDays = reelsThisWeek === 3 ? [1, 3, 5] : [2, 4]; // Tue/Thu/Sat or Wed/Fri
    const reelTime = "12:30 PM";
    const generatedReels: Array<{
      date: string;
      title: string;
      contentType: ContentType;
      audience: Audience;
    }> = [];
    for (const d of reelDays) {
      const beat = pick(REEL_BEATS, reelIdx++);
      const date = isoAddDays(monday, d);
      posts.push({
        date,
        time: reelTime,
        week,
        phase,
        platforms: ["Instagram Reel"],
        format: reelFormatLabel(),
        contentType: beat.contentType,
        audience: beat.audience,
        title: beat.title,
        hook: beat.hook,
        cta: beat.cta,
        assetSource: beat.assetSource,
        productionNotes: beat.productionNotes,
        status: "Planned",
        performanceNotes: "",
      });
      generatedReels.push({
        date,
        title: beat.title,
        contentType: beat.contentType,
        audience: beat.audience,
      });
    }

    // ---- Trial Reels (3-4/week) — non-follower hook tests ----
    const trialThisWeek = week % 2 === 0 ? 4 : 3;
    const trialDays =
      trialThisWeek === 4 ? [0, 2, 4, 6] : [0, 3, 5]; // Mon/Wed/Fri/Sun or Mon/Thu/Sat
    for (const d of trialDays) {
      const beat = pick(TRIAL_REEL_BEATS, trialIdx++);
      posts.push({
        date: isoAddDays(monday, d),
        time: "5:00 PM",
        week,
        phase,
        platforms: ["Instagram Trial Reel"],
        format: "Trial Reel (15-25s) — hook test",
        contentType: beat.contentType,
        audience: beat.audience,
        title: beat.title,
        hook: beat.hook,
        cta: beat.cta,
        assetSource: "Recut from prior Reel + new hook overlay.",
        productionNotes: beat.productionNotes,
        status: "Planned",
        performanceNotes: "",
      });
    }

    // ---- TikTok (3-7/week, ramping) — recut from Reels ----
    const tikToks = tikToksPerWeek(week);
    const tiktokSpacing = Math.max(1, Math.floor(7 / tikToks));
    for (let i = 0; i < tikToks; i++) {
      const day = Math.min(6, i * tiktokSpacing);
      const parent = generatedReels[i % generatedReels.length] ?? {
        title: "Cockpit recut",
        contentType: "Cockpit Cinema" as ContentType,
        audience: "NYC Experience Seekers" as Audience,
      };
      posts.push({
        date: isoAddDays(monday, day),
        time: "11:00 AM",
        week,
        phase,
        platforms: ["TikTok"],
        format: "TikTok recut (45-60s)",
        contentType: parent.contentType,
        audience: parent.audience,
        title: `TikTok recut — ${parent.title}`,
        hook: "Native TikTok pacing. New hook in the first 1.2s.",
        cta: "Follow for the rest of the brief.",
        assetSource: `Source: Reel — ${parent.title}.`,
        productionNotes:
          "Reframe to 9:16 native crop. Quick cuts. Rewrite the on-screen hook for TikTok native.",
        status: "Planned",
        performanceNotes: "",
      });
    }

    // ---- YouTube Shorts (daily, 7/week) — same-day repurpose of Reels in Phase 2+ ----
    for (let d = 0; d < 7; d++) {
      const date = isoAddDays(monday, d);
      const reelOnSameDay = generatedReels.find((r) => r.date === date);
      const parent =
        reelOnSameDay ?? generatedReels[d % Math.max(1, generatedReels.length)] ?? {
          title: "Cockpit cold-start",
          contentType: "Cockpit Cinema" as ContentType,
          audience: "Aviation Enthusiasts" as Audience,
        };

      const sourceNote =
        week <= 4
          ? "Phase 1 — back catalog seeding from prior cockpit footage."
          : `Same-day repurpose: ${parent.title}.`;

      posts.push({
        date,
        time: "8:00 AM",
        week,
        phase,
        platforms: ["YouTube Short"],
        format: "YouTube Short (≤60s)",
        contentType: parent.contentType,
        audience: parent.audience,
        title: `Short — ${parent.title}`,
        hook: "Native Shorts hook in the first second.",
        cta: "Subscribe for the rest of the brief.",
        assetSource: sourceNote,
        productionNotes:
          "Reframe to 9:16. Trim to under 60s. Rewrite caption for Shorts. End on a held logo card.",
        status: "Planned",
        performanceNotes: "",
      });
    }
  }

  // Sort chronologically
  posts.sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
  );

  return posts;
}

const out = generate();
const outPath = resolve(process.cwd(), "data", "seed.json");
writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");

const counts: Record<string, number> = {};
out.forEach((p) => {
  for (const pl of p.platforms) counts[pl] = (counts[pl] ?? 0) + 1;
});
console.log(`Wrote ${out.length} posts to ${outPath}`);
console.log("Platform counts:", counts);
const phases: Record<string, number> = {};
out.forEach((p) => (phases[p.phase] = (phases[p.phase] ?? 0) + 1));
console.log("Phase counts:", phases);
