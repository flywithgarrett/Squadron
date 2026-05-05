"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: Array<{ href: string; label: string }> = [
  { href: "/calendar", label: "Calendar" },
  { href: "/list", label: "List" },
  { href: "/types", label: "Types" },
];

export function MobileTabBar() {
  const pathname = usePathname() || "";
  return (
    <nav
      aria-label="Views"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#F4F1EA]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F4F1EA]/80 border-t border-[color:var(--color-hairline)]"
    >
      <div className="max-w-[480px] mx-auto grid grid-cols-3">
        {ITEMS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={
                "relative flex items-center justify-center py-3 text-[12px] font-medium tracking-[0.02em] " +
                (active
                  ? "text-[#0A2540]"
                  : "text-[color:var(--color-navy-mute)]")
              }
            >
              {label}
              {active && (
                <span
                  aria-hidden
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-8 bg-[#C8A24B]"
                />
              )}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" aria-hidden />
    </nav>
  );
}
