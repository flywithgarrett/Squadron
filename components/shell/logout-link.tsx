"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions";

export function LogoutLink() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await logout();
          router.push("/login");
          router.refresh();
        })
      }
      disabled={pending}
      className="text-[11px] tracking-[0.06em] uppercase font-medium text-[color:var(--color-ink-45)] hover:text-[color:var(--color-ink)] disabled:opacity-40"
    >
      Sign out
    </button>
  );
}
