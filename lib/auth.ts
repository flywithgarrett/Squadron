import { cookies } from "next/headers";

export const AUTH_COOKIE = "squadron_auth";

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return c.get(AUTH_COOKIE)?.value === "1";
}

export function checkPassword(input: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;
  return input === expected;
}
