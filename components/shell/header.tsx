import Link from "next/link";
import { SyncButton } from "@/components/shell/sync-button";
import { LogoutLink } from "@/components/shell/logout-link";

type Active = "calendar" | "list" | "types";

export function Header({ active }: { active: Active }) {
  const item = (href: string, label: string, key: Active) => (
    <Link
      key={key}
      href={href}
      className={
        "relative inline-block text-[13px] font-medium px-1 py-1 " +
        (active === key
          ? "text-[#0A2540]"
          : "text-[color:var(--color-navy-mute)] hover:text-[#0A2540]")
      }
    >
      {label}
      {active === key && (
        <span
          aria-hidden
          className="absolute -bottom-[7px] left-0 right-0 h-px bg-[#C8A24B]"
        />
      )}
    </Link>
  );

  return (
    <header className="bg-[#F4F1EA] border-b border-[color:var(--color-hairline)]">
      <div className="max-w-[1240px] mx-auto px-8 lg:px-14 py-6 flex items-center justify-between gap-8">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-[12px] font-semibold tracking-[0.18em] text-[#0A2540]">
            THE SQUADRON
          </span>
          <span className="text-[11px] tracking-[0.06em] font-normal text-[color:var(--color-navy-mute)]">
            Content Operations
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Views">
          {item("/calendar", "Calendar", "calendar")}
          {item("/list", "List", "list")}
          {item("/types", "Types", "types")}
        </nav>

        <div className="flex items-center gap-6">
          <SyncButton />
          <LogoutLink />
        </div>
      </div>
    </header>
  );
}
