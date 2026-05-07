import { NextResponse } from "next/server";
import { generateScript, isAnthropicReady } from "@/lib/anthropic";
import {
  CONTENT_TYPE_NAMES,
  PLATFORMS,
  type ContentType,
  type Platform,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!isAnthropicReady()) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY not configured." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json(
      { ok: false, error: "prompt is required." },
      { status: 400 },
    );
  }

  const contentType: ContentType | undefined = CONTENT_TYPE_NAMES.includes(
    body?.contentType,
  )
    ? body.contentType
    : undefined;

  const platforms: Platform[] = Array.isArray(body?.platforms)
    ? body.platforms.filter((p: string) => PLATFORMS.includes(p as Platform))
    : [];

  try {
    const text = await generateScript({ prompt, contentType, platforms });
    return NextResponse.json({ ok: true, text });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}
