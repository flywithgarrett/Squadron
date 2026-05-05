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
      className="text-[12px] tracking-[0.04em] text-[color:var(--color-navy-mute)] hover:text-[#0A2540] disabled:opacity-40"
    >
      Sign out
    </button>
  );
}
