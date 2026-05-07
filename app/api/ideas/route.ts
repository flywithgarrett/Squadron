import { NextResponse } from "next/server";
import { createIdea, isStorageReady, listIdeas } from "@/lib/storage";
import {
  CONTENT_TYPE_NAMES,
  PLATFORMS,
  type ContentType,
  type Platform,
} from "@/lib/types";

export async function GET() {
  if (!isStorageReady()) {
    return NextResponse.json({ ok: true, ideas: [], storageReady: false });
  }
  const ideas = await listIdeas();
  return NextResponse.json({ ok: true, ideas, storageReady: true });
}

export async function POST(req: Request) {
  if (!isStorageReady()) {
    return NextResponse.json(
      { ok: false, error: "Storage not configured." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json(
      { ok: false, error: "text is required." },
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

  const source: "manual" | "ai-generated" =
    body?.source === "ai-generated" ? "ai-generated" : "manual";

  const generatedScript =
    typeof body?.generatedScript === "string" ? body.generatedScript : undefined;

  const idea = await createIdea({
    text,
    contentType,
    platforms,
    source,
    generatedScript,
  });

  return NextResponse.json({ ok: true, idea });
}
