"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { syncPosts } from "@/app/actions";

export function SyncButton() {
  const [pending, startTransition] = useTransition();
  const [synced, setSynced] = useState(false);

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await syncPosts();
          setSynced(true);
          setTimeout(() => setSynced(false), 1500);
        })
      }
      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.08em] text-[#5B6770] hover:text-[#0A2540] transition-colors duration-150 disabled:opacity-50"
      disabled={pending}
    >
      <RefreshCw className={"h-3.5 w-3.5 " + (pending ? "animate-spin" : "")} />
      {synced ? "Synced" : pending ? "Syncing" : "Sync from Notion"}
    </button>
  );
}
