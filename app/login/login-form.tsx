"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Incorrect password.");
      return;
    }
    const next = params.get("next") || "/views/calendar";
    router.push(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#F4F1EA]">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <div className="text-[#0A2540] font-semibold tracking-[0.18em] text-sm uppercase">
            The Squadron
          </div>
          <div className="text-[#C8A24B] tracking-[0.05em] text-sm mt-1">
            / Content OS
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white border border-stone-200 p-8 space-y-5"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#5B6770]"
            >
              Access password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-[#A14829]" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Verifying" : "Enter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.1em] text-[#5B6770]">
          Internal use only
        </p>
      </div>
    </main>
  );
}
