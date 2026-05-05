import { MobileTabBar } from "@/components/shell/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--color-canvas)] flex flex-col">
      <div className="flex-1 pb-28 md:pb-32">{children}</div>
      <MobileTabBar />
    </div>
  );
}
