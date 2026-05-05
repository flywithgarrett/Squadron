import { NextResponse } from "next/server";
import { revalidatePosts } from "@/lib/notion";

export async function POST() {
  revalidatePosts();
  return NextResponse.json({ ok: true });
}
