"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { invalidatePostsCache } from "@/lib/notion";
import { AUTH_COOKIE } from "@/lib/auth";

export async function syncPosts() {
  invalidatePostsCache();
  revalidatePath("/", "layout");
}

export async function logout() {
  const c = await cookies();
  c.delete(AUTH_COOKIE);
}
