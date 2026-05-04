import { Header } from "@/components/header";
import { PillarsView } from "./pillars-view";
import { getPosts } from "@/lib/posts";

export default function PillarsPage() {
  const posts = getPosts();
  return (
    <div className="min-h-screen bg-[#F4F1EA]">
      <Header active="pillars" />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#0A2540]">
            Strategic mix by pillar
          </h1>
          <p className="mt-2 text-sm text-[#5B6770] max-w-2xl">
            How the 90-day plan distributes across the five content pillars.
            Click any pillar to expand its posts.
          </p>
        </div>
        <PillarsView posts={posts} />
      </main>
    </div>
  );
}
