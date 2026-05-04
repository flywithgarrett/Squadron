"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions";

export function LogoutButton() {
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
      className="text-xs uppercase tracking-[0.08em] text-[#5B6770] hover:text-[#0A2540] transition-colors duration-150 disabled:opacity-50"
      disabled={pending}
    >
      Logout
    </button>
  );
}
