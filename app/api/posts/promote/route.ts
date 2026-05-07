import { NextResponse } from "next/server";
import {
  createPromotedPost,
  isStorageReady,
  updateIdea,
} from "@/lib/storage";
import { getPosts } from "@/lib/posts";
import {
  CONTENT_TYPE_NAMES,
  PHASES,
  PLATFORMS,
  type Audience,
  type ContentType,
  type Phase,
  type Platform,
  type Post,
} from "@/lib/types";
import { parseDate } from "@/lib/format";

function inferPhase(iso: string, fallback: Phase): Phase {
  if (!iso) return fallback;
  const d = parseDate(iso);
  const start = parseDate("2026-05-11");
  const days = Math.floor((d.getTime() - start.getTime()) / 86400000);
  if (days < 28) return PHASES[0];
  if (days < 56) return PHASES[1];
  return PHASES[2];
}

export async function POST(req: Request) {
  if (!isStorageReady()) {
    return NextResponse.json(
      { ok: false, error: "Storage not configured." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const ideaId = typeof body?.ideaId === "string" ? body.ideaId : null;
  const date = typeof body?.date === "string" ? body.date : "";

  if (!date) {
    return NextResponse.json(
      { ok: false, error: "date is required." },
      { status: 400 },
    );
  }

  const platforms: Platform[] = Array.isArray(body?.platforms)
    ? body.platforms.filter((p: string) => PLATFORMS.includes(p as Platform))
    : [];

  const contentType: ContentType = CONTENT_TYPE_NAMES.includes(body?.contentType)
    ? body.contentType
    : "Cockpit Cinema";

  const data: Omit<Post, "id" | "promoted"> = {
    title: typeof body?.title === "string" ? body.title : "Untitled idea",
    date,
    time: typeof body?.time === "string" && body.time ? body.time : "12:30 PM",
    week: typeof body?.week === "number" ? body.week : 0,
    phase: inferPhase(date, PHASES[0]),
    platforms,
    format:
      typeof body?.format === "string" ? body.format : "Reel — to be defined",
    contentType,
    audience: (typeof body?.audience === "string"
      ? body.audience
      : "Aviation Enthusiasts") as Audience,
    hook: typeof body?.hook === "string" ? body.hook : "",
    cta: typeof body?.cta === "string" ? body.cta : "",
    assetSource:
      typeof body?.assetSource === "string" ? body.assetSource : "",
    productionNotes:
      typeof body?.productionNotes === "string"
        ? body.productionNotes
        : "",
    status: "Planned",
    performanceNotes: "",
  };

  // Compute week from existing plan if not given
  if (!data.week) {
    const allPosts = await getPosts();
    const sameWeek = allPosts.find((p) => {
      const a = parseDate(date).getTime();
      const b = parseDate(p.date).getTime();
      return Math.abs(a - b) < 7 * 86400000;
    });
    if (sameWeek) data.week = sameWeek.week;
  }

  const created = await createPromotedPost(data);

  if (ideaId) {
    await updateIdea(ideaId, {
      status: "promoted",
      promotedPostId: created.id,
    });
  }

  return NextResponse.json({ ok: true, post: created });
}
