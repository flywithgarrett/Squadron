import { Header } from "@/components/shell/header";
import { ListView } from "./list-view";
import { getPosts } from "@/lib/posts";

export default function ListPage() {
  const posts = getPosts();
  return (
    <>
      <Header active="list" />
      <main className="paper-in max-w-[1240px] mx-auto px-6 md:px-12 lg:px-16 pt-16 md:pt-28 pb-24">
        <header className="mb-20 md:mb-28">
          <p className="eyebrow text-[color:var(--color-ink-45)] mb-5">
            Schedule index
          </p>
          <h1 className="display text-[48px] md:text-[72px] leading-[0.98] text-[color:var(--color-ink)] tabular">
            List
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-60)]">
            Filter by platform, content type, phase, or status. Sticky date
            headers keep your place as you scroll.
          </p>
        </header>
        <ListView posts={posts} />
      </main>
    </>
  );
}
