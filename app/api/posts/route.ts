import { NextResponse } from "next/server";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ posts: await getPosts() });
}
