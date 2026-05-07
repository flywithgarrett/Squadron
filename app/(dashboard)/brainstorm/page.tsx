import { Header } from "@/components/shell/header";
import { BrainstormView } from "./brainstorm-view";
import { listIdeas, isStorageReady } from "@/lib/storage";
import { isAnthropicReady } from "@/lib/anthropic";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function BrainstormPage() {
  const storageReady = isStorageReady();
  const apiReady = isAnthropicReady();
  const [ideas, posts] = await Promise.all([
    storageReady ? listIdeas() : Promise.resolve([]),
    getPosts(),
  ]);

  return (
    <>
      <Header active="brainstorm" />
      <main className="paper-in">
        <div className="max-w-[720px] mx-auto px-6 md:px-10 pt-16 md:pt-28 pb-24">
          <header className="mb-20 md:mb-28">
            <p className="eyebrow text-[color:var(--color-ink-45)] mb-5">
              Workspace
            </p>
            <h1 className="display text-[48px] md:text-[72px] leading-[0.98] text-[color:var(--color-ink)] tabular">
              Brainstorm
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-60)]">
              Capture rough ideas. Generate scripts. Promote anything to a
              scheduled post on the calendar.
            </p>
          </header>

          <BrainstormView
            initialIdeas={ideas}
            posts={posts}
            storageReady={storageReady}
            apiReady={apiReady}
          />
        </div>
      </main>
    </>
  );
}
