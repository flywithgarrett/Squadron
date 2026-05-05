import Link from "next/link";
import { LogoutLink } from "@/components/shell/logout-link";
import { SquadronLogo } from "@/components/icons/squadron-logo";

type Active = "calendar" | "list" | "types";

export function Header({ active }: { active: Active }) {
  const item = (href: string, label: string, key: Active) => (
    <Link
      key={key}
      href={href}
      className={
        "relative inline-flex items-center text-[13px] font-medium tracking-[-0.005em] " +
        (active === key
          ? "text-[color:var(--color-ink)]"
          : "text-[color:var(--color-ink-60)] hover:text-[color:var(--color-ink)]")
      }
    >
      {label}
      <span
        aria-hidden
        className={
          "absolute -bottom-2 left-0 right-0 h-px transition-opacity duration-200 " +
          (active === key
            ? "bg-[color:var(--color-gold)] opacity-100"
            : "bg-[color:var(--color-gold)] opacity-0")
        }
      />
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 bg-[color:var(--color-canvas)]/85 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:bg-[color:var(--color-canvas)]/70 border-b border-[color:var(--color-rule)]">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-16 h-[88px] md:h-[96px] flex items-center justify-between gap-8">
        <nav
          className="hidden md:flex items-center gap-10"
          aria-label="Views"
        >
          {item("/calendar", "Calendar", "calendar")}
          {item("/list", "List", "list")}
          {item("/types", "Types", "types")}
        </nav>

        {/* Mobile: show "Content Operations" eyebrow on the left when nav is in tab bar */}
        <div className="md:hidden text-[10px] tracking-[0.18em] uppercase font-medium text-[color:var(--color-ink-45)]">
          Content OS
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <LogoutLink />
          <Link
            href="/calendar"
            aria-label="The Squadron — Content Operations"
            className="text-[color:var(--color-ink)] hover:opacity-80"
          >
            <SquadronLogo size="md" />
          </Link>
        </div>
      </div>
    </header>
  );
}
