import { MobileTabBar } from "@/components/shell/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col">
      <div className="flex-1 pb-24 md:pb-32">{children}</div>
      <MobileTabBar />
    </div>
  );
}
