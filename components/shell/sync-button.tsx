"use client";

import { useState, useTransition } from "react";

export function SyncButton() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/revalidate", { method: "POST" });
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        })
      }
      disabled={pending}
      className="text-[12px] tracking-[0.04em] text-[color:var(--color-navy-mute)] hover:text-[#0A2540] disabled:opacity-40"
    >
      {done ? "Synced" : pending ? "Syncing" : "Sync"}
    </button>
  );
}
