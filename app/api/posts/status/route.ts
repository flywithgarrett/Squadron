import { NextResponse } from "next/server";
import { isStorageReady, setPostStatus } from "@/lib/storage";
import { STATUSES, type Status } from "@/lib/types";

export async function PATCH(req: Request) {
  if (!isStorageReady()) {
    return NextResponse.json(
      { ok: false, error: "Storage not configured." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const id = typeof body?.id === "string" ? body.id : "";
  const status = typeof body?.status === "string" ? body.status : "";

  if (!id || !STATUSES.includes(status as Status)) {
    return NextResponse.json(
      { ok: false, error: "id and valid status required." },
      { status: 400 },
    );
  }

  await setPostStatus(id, status as Status);
  return NextResponse.json({ ok: true });
}
