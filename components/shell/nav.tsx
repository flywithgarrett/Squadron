"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: Array<{ href: string; label: string }> = [
  { href: "/calendar", label: "Calendar" },
  { href: "/brainstorm", label: "Brainstorm" },
  { href: "/list", label: "List" },
  { href: "/types", label: "Types" },
];

export function MobileTabBar() {
  const pathname = usePathname() || "";
  return (
    <nav
      aria-label="Views"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[color:var(--color-canvas)]/90 supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:bg-[color:var(--color-canvas)]/72 border-t border-[color:var(--color-rule)]"
    >
      <div className="max-w-[560px] mx-auto grid grid-cols-4">
        {ITEMS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={
                "relative flex items-center justify-center py-4 text-[12px] font-medium tracking-[-0.005em] " +
                (active
                  ? "text-[color:var(--color-ink)]"
                  : "text-[color:var(--color-ink-45)]")
              }
            >
              {label}
              <span
                aria-hidden
                className={
                  "absolute top-0 left-1/2 -translate-x-1/2 h-px w-7 bg-[color:var(--color-gold)] transition-opacity duration-200 " +
                  (active ? "opacity-100" : "opacity-0")
                }
              />
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" aria-hidden />
    </nav>
  );
}
