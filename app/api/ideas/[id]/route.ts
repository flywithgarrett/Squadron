import { NextResponse } from "next/server";
import { deleteIdea, isStorageReady, updateIdea } from "@/lib/storage";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isStorageReady()) {
    return NextResponse.json(
      { ok: false, error: "Storage not configured." },
      { status: 503 },
    );
  }
  const { id } = await ctx.params;
  const patch = await req.json().catch(() => ({}));
  const updated = await updateIdea(id, patch);
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Not found." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true, idea: updated });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isStorageReady()) {
    return NextResponse.json(
      { ok: false, error: "Storage not configured." },
      { status: 503 },
    );
  }
  const { id } = await ctx.params;
  await deleteIdea(id);
  return NextResponse.json({ ok: true });
}
