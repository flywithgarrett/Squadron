import { Header } from "@/components/header";
import { CalendarView } from "./calendar-view";
import { getPosts } from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const { posts, source } = await getPosts();
  return (
    <div className="min-h-screen bg-[#F4F1EA]">
      <Header active="calendar" />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#0A2540]">
            90-day calendar
          </h1>
          <p className="mt-2 text-sm text-[#5B6770] max-w-2xl">
            The Squadron content schedule — May through August 2026. Click any
            post chip to read its brief.
          </p>
          {source === "seed" && (
            <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-[#A14829]">
              Showing seed data — connect Notion to enable live sync.
            </p>
          )}
        </div>
        <CalendarView posts={posts} />
      </main>
    </div>
  );
}
