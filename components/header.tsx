import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export function Header({
  active,
}: {
  active?: "calendar" | "list" | "pillars";
}) {
  const navItem = (
    href: string,
    label: string,
    key: "calendar" | "list" | "pillars",
  ) => (
    <Link
      key={key}
      href={href}
      className={
        "px-3 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 " +
        (active === key
          ? "text-[#0A2540] border-[#C8A24B]"
          : "text-[#5B6770] border-transparent hover:text-[#0A2540]")
      }
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="text-[#0A2540] font-semibold tracking-[0.15em] text-sm uppercase">
            The Squadron
          </span>
          <span className="text-[#C8A24B] tracking-[0.05em] text-sm">
            / Content OS
          </span>
        </Link>

        <nav className="hidden md:flex items-end h-16 gap-1">
          {navItem("/views/calendar", "Calendar", "calendar")}
          {navItem("/views/list", "List", "list")}
          {navItem("/views/pillars", "Pillars", "pillars")}
        </nav>

        <div className="flex items-center gap-3">
          <LogoutButton />
        </div>
      </div>

      <nav className="md:hidden flex items-end px-6 border-t border-stone-200">
        {navItem("/views/calendar", "Calendar", "calendar")}
        {navItem("/views/list", "List", "list")}
        {navItem("/views/pillars", "Pillars", "pillars")}
      </nav>
    </header>
  );
}
