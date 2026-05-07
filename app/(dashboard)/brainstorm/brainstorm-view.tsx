"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Idea, Post } from "@/lib/types";
import { CaptureBox } from "@/components/brainstorm/capture-box";
import { IdeaCard } from "@/components/brainstorm/idea-card";
import { ScriptGenerator } from "@/components/brainstorm/script-generator";
import { PromoteSheet } from "@/components/brainstorm/promote-sheet";

interface Props {
  initialIdeas: Idea[];
  posts: Post[];
  storageReady: boolean;
  apiReady: boolean;
}

export function BrainstormView({
  initialIdeas,
  posts,
  storageReady,
  apiReady,
}: Props) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [promoting, setPromoting] = useState<Idea | null>(null);
  const [generatingFor, setGeneratingFor] = useState<Idea | null>(null);

  function handleCapture(idea: Idea) {
    setIdeas((cur) => [idea, ...cur]);
  }

  async function handleDelete(idea: Idea) {
    setIdeas((cur) => cur.filter((i) => i.id !== idea.id));
    try {
      await fetch(`/api/ideas/${idea.id}`, { method: "DELETE" });
    } catch {
      setIdeas((cur) => [idea, ...cur]);
    }
  }

  async function handleGenerate(idea: Idea) {
    setGeneratingFor(idea);
  }

  function handlePromote(idea: Idea) {
    setPromoting(idea);
  }

  async function handlePromoted(_post: Post, ideaId: string) {
    setIdeas((cur) =>
      cur.map((i) =>
        i.id === ideaId ? { ...i, status: "promoted" as const } : i,
      ),
    );
    setPromoting(null);
    router.refresh();
  }

  return (
    <div className="space-y-20 md:space-y-24">
      {!storageReady && (
        <div className="border-l-2 border-[color:var(--color-warn)] pl-5 py-2">
          <p className="text-[12px] tracking-[0.04em] uppercase text-[color:var(--color-warn)] mb-1.5">
            Storage not connected
          </p>
          <p className="text-[14px] leading-relaxed text-[color:var(--color-ink-80)]">
            Connect Upstash Redis in Vercel to enable capturing, editing, and
            promoting ideas. Until then, the workspace is read-only.
          </p>
        </div>
      )}

      <section>
        <CaptureBox onCapture={handleCapture} storageReady={storageReady} />
      </section>

      <section>
        {ideas.length === 0 ? (
          <p className="text-[14px] text-[color:var(--color-ink-45)] py-12 text-center border-t border-b border-[color:var(--color-rule)]">
            Captured ideas appear here.
          </p>
        ) : (
          <ol className="flex flex-col gap-4">
            {ideas.map((idea) => (
              <li key={idea.id}>
                <IdeaCard
                  idea={idea}
                  onPromote={handlePromote}
                  onGenerate={handleGenerate}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <ScriptGenerator
          contentType={generatingFor?.contentType ?? null}
          platforms={generatingFor?.platforms ?? []}
          onSaved={(idea) => {
            setIdeas((cur) => [idea, ...cur]);
            setGeneratingFor(null);
          }}
          storageReady={storageReady}
          apiReady={apiReady}
        />
      </section>

      <PromoteSheet
        idea={promoting}
        posts={posts}
        onClose={() => setPromoting(null)}
        onPromoted={handlePromoted}
      />
    </div>
  );
}
