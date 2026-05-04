import { Header } from "@/components/header";
import { CalendarView } from "./calendar-view";
import { getPosts } from "@/lib/posts";

export default function CalendarPage() {
  const posts = getPosts();
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
        </div>
        <CalendarView posts={posts} />
      </main>
    </div>
  );
}
