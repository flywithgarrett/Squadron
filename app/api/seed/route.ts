import { NextResponse } from "next/server";
import { importSeedToNotion, revalidatePosts } from "@/lib/notion";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const provided = url.searchParams.get("secret");
  const expected = process.env.SEED_SECRET;

  if (!expected) {
    return NextResponse.json(
      {
        ok: false,
        error: "SEED_SECRET is not set on the server.",
      },
      { status: 500 },
    );
  }

  if (!provided || provided !== expected) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing secret." },
      { status: 401 },
    );
  }

  try {
    const result = await importSeedToNotion();
    revalidatePosts();
    console.log(
      `[seed] created=${result.created} failed=${result.failed}`,
    );
    if (result.errors.length) {
      console.error("[seed] errors:", result.errors.slice(0, 10));
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}
