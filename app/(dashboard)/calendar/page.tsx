import { Header } from "@/components/shell/header";
import { CalendarView } from "./calendar-view";
import { fetchPosts } from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const { posts, source } = await fetchPosts();
  return (
    <>
      <Header active="calendar" />
      <main className="max-w-[1240px] mx-auto px-6 md:px-10 lg:px-14 pt-14 md:pt-24 pb-20">
        <header className="mb-16 md:mb-24">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[color:var(--color-navy-mute)] mb-3">
            {source === "notion" ? "Live from Notion" : "Seed preview"}
          </p>
          <h1 className="display text-[40px] md:text-[56px] font-medium leading-[1.05] text-[#0A2540] tabular">
            Calendar
          </h1>
        </header>
        <CalendarView posts={posts} />
      </main>
    </>
  );
}
