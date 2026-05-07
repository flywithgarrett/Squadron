import { Header } from "@/components/shell/header";
import { CalendarView } from "./calendar-view";
import { getPosts } from "@/lib/posts";
import { isStorageReady } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const posts = await getPosts();
  const storageReady = isStorageReady();
  return (
    <>
      <Header active="calendar" />
      <main className="paper-in max-w-[1240px] mx-auto px-6 md:px-12 lg:px-16 pt-16 md:pt-28 pb-24">
        <header className="mb-20 md:mb-28">
          <p className="eyebrow text-[color:var(--color-ink-45)] mb-5">
            90-day plan
          </p>
          <h1 className="display text-[48px] md:text-[72px] leading-[0.98] text-[color:var(--color-ink)] tabular">
            Calendar
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-60)]">
            The full content schedule, organized by day. Tap any post to read
            its brief and update its status.
          </p>
        </header>
        <CalendarView posts={posts} storageReady={storageReady} />
      </main>
    </>
  );
}
