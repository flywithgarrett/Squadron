"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FilterBar, EMPTY_FILTERS, type Filters } from "@/components/filter-bar";
import { PillarBadge } from "@/components/pillar-badge";
import { PlatformIcon } from "@/components/platform-icon";
import { PostDetailPanel } from "@/components/post-detail-panel";
import { Badge } from "@/components/ui/badge";
import { formatDayDate, formatDayShort } from "@/lib/format";
import type { Post } from "@/lib/types";

export function ListView({ posts }: { posts: Post[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortDesc, setSortDesc] = useState(false);
  const [selected, setSelected] = useState<Post | null>(null);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return posts
      .filter((p) => {
        if (filters.platform && p.platform !== filters.platform) return false;
        if (filters.pillar && p.pillar !== filters.pillar) return false;
        if (filters.phase && p.phase !== filters.phase) return false;
        if (filters.status && p.status !== filters.status) return false;
        if (q) {
          const hay = (p.title + " " + p.hook).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) =>
        sortDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
      );
  }, [posts, filters, sortDesc]);

  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.12em] text-[#5B6770]">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        </p>
      </div>

      <div className="mt-3 bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-[#5B6770]">
              <th
                className="px-4 py-3 font-semibold cursor-pointer select-none"
                onClick={() => setSortDesc((s) => !s)}
              >
                <span className="inline-flex items-center gap-1">
                  Date
                  {sortDesc ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronUp className="h-3 w-3" />
                  )}
                </span>
              </th>
              <th className="px-4 py-3 font-semibold">Day</th>
              <th className="px-4 py-3 font-semibold">Platform</th>
              <th className="px-4 py-3 font-semibold">Pillar</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold hidden lg:table-cell">
                Hook
              </th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelected(p)}
                className="border-b last:border-b-0 border-stone-100 hover:bg-stone-50 cursor-pointer"
              >
                <td className="px-4 py-3 text-[#0A2540] whitespace-nowrap">
                  {formatDayDate(p.date)}
                </td>
                <td className="px-4 py-3 text-[#5B6770] whitespace-nowrap">
                  {formatDayShort(p.date)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-[#0A2540]">
                    <PlatformIcon
                      platform={p.platform}
                      className="h-4 w-4 text-[#5B6770]"
                    />
                    {p.platform}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <PillarBadge pillar={p.pillar} />
                </td>
                <td className="px-4 py-3 text-[#0A2540] font-medium max-w-[28ch]">
                  {p.title}
                </td>
                <td className="px-4 py-3 text-[#5B6770] hidden lg:table-cell max-w-[40ch] truncate">
                  {p.hook}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{p.status}</Badge>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-[#5B6770]"
                >
                  No posts match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PostDetailPanel post={selected} onClose={() => setSelected(null)} />
    </>
  );
}
