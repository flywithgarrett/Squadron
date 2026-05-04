import { Header } from "@/components/header";
import { ListView } from "./list-view";
import { getPosts } from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function ListPage() {
  const { posts } = await getPosts();
  return (
    <div className="min-h-screen bg-[#F4F1EA]">
      <Header active="list" />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#0A2540]">
            All posts
          </h1>
          <p className="mt-2 text-sm text-[#5B6770] max-w-2xl">
            Filter by platform, pillar, phase, or status. Click any row to read
            the full brief.
          </p>
        </div>
        <ListView posts={posts} />
      </main>
    </div>
  );
}
