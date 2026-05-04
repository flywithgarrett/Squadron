"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";

export async function logout() {
  const c = await cookies();
  c.delete(AUTH_COOKIE);
}
