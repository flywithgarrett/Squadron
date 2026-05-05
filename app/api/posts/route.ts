import { NextResponse } from "next/server";
import { fetchPosts } from "@/lib/notion";

export async function GET() {
  const data = await fetchPosts();
  return NextResponse.json(data);
}
