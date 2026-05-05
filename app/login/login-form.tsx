"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/primitives/input";
import { Button } from "@/components/primitives/button";
import { SquadronLogo } from "@/components/icons/squadron-logo";

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
    <main className="paper-in min-h-screen bg-[color:var(--color-canvas)] grid place-items-center px-6 relative">
      {/* Subtle hairline frame for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--color-rule-strong)]"
      />

      <div className="w-full max-w-[340px]">
        <div className="text-center mb-24 text-[color:var(--color-ink)]">
          <SquadronLogo size="lg" />
          <p className="mt-5 text-[12px] tracking-[0.18em] uppercase font-medium text-[color:var(--color-ink-45)]">
            Content Operations
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-10">
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
            <p className="text-[12px] text-[color:var(--color-warn)]" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Verifying" : "Enter"}
          </Button>
        </form>

        <p className="mt-16 text-center text-[10px] tracking-[0.16em] uppercase text-[color:var(--color-ink-30)]">
          Internal access only
        </p>
      </div>
    </main>
  );
}
