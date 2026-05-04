import { NextResponse } from "next/server";
import { getPosts } from "@/lib/notion";

export async function GET() {
  const data = await getPosts();
  return NextResponse.json(data);
}
