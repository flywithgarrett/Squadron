"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/primitives/input";
import { Button } from "@/components/primitives/button";

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
      setError("Incorrect access code.");
      return;
    }
    const next = params.get("next") || "/calendar";
    router.push(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] grid place-items-center px-6">
      <div className="w-full max-w-[320px]">
        <div className="text-center mb-20">
          <div className="text-[12px] font-semibold tracking-[0.18em] text-[#0A2540]">
            THE SQUADRON
          </div>
          <div className="text-[11px] tracking-[0.06em] text-[color:var(--color-navy-mute)] mt-1">
            Content Operations
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <Input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Access code"
            aria-label="Access code"
            required
          />

          {error && (
            <p className="text-[12px] text-[#A14829]" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Verifying" : "Enter"}
          </Button>
        </form>
      </div>
    </main>
  );
}
