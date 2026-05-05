import { Header } from "@/components/shell/header";
import { TypesView } from "./types-view";
import { getPosts } from "@/lib/posts";

export default function TypesPage() {
  const posts = getPosts();
  return (
    <>
      <Header active="types" />
      <main className="paper-in max-w-[1240px] mx-auto px-6 md:px-12 lg:px-16 pt-16 md:pt-28 pb-24">
        <header className="mb-20 md:mb-28">
          <p className="eyebrow text-[color:var(--color-ink-45)] mb-5">
            Strategic mix
          </p>
          <h1 className="display text-[48px] md:text-[72px] leading-[0.98] text-[color:var(--color-ink)] tabular">
            Types
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-60)]">
            How the plan distributes across the five content types. The shape
            of the mix is the strategy.
          </p>
        </header>
        <TypesView posts={posts} />
      </main>
    </>
  );
}
