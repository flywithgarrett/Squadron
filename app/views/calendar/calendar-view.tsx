"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PostDetailPanel } from "@/components/post-detail-panel";
import { PILLARS } from "@/lib/pillars";
import {
  formatMonthYear,
  getMonthMatrix,
  parseDate,
} from "@/lib/format";
import type { Post } from "@/lib/types";

const MONTHS: Array<{ key: string; year: number; monthIndex: number }> = [
  { key: "2026-05", year: 2026, monthIndex: 4 },
  { key: "2026-06", year: 2026, monthIndex: 5 },
  { key: "2026-07", year: 2026, monthIndex: 6 },
  { key: "2026-08", year: 2026, monthIndex: 7 },
];

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<string>(() => {
    const today = new Date();
    const found = MONTHS.find(
      (m) => m.year === today.getFullYear() && m.monthIndex === today.getMonth(),
    );
    return found?.key ?? MONTHS[0].key;
  });
  const [selected, setSelected] = useState<Post | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of posts) {
      const arr = map.get(p.date) ?? [];
      arr.push(p);
      map.set(p.date, arr);
    }
    return map;
  }, [posts]);

  return (
    <>
      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="mb-6">
          {MONTHS.map((m) => (
            <TabsTrigger key={m.key} value={m.key}>
              {formatMonthYear(m.year, m.monthIndex)}
            </TabsTrigger>
          ))}
        </TabsList>

        {MONTHS.map((m) => {
          const matrix = getMonthMatrix(m.year, m.monthIndex);
          return (
            <TabsContent key={m.key} value={m.key}>
              <div className="bg-white border border-stone-200">
                <div className="grid grid-cols-7 border-b border-stone-200">
                  {WEEKDAY.map((w) => (
                    <div
                      key={w}
                      className="px-3 py-2 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#5B6770] border-r last:border-r-0 border-stone-200"
                    >
                      {w}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-6">
                  {matrix.flat().map((cell) => {
                    const dt = parseDate(cell.date);
                    const cellPosts = byDate.get(cell.date) ?? [];
                    return (
                      <div
                        key={cell.date}
                        className={
                          "min-h-[110px] md:min-h-[130px] border-r border-b last:border-r-0 border-stone-200 p-2 flex flex-col gap-1.5 " +
                          (cell.inMonth ? "bg-white" : "bg-stone-50")
                        }
                      >
                        <div
                          className={
                            "text-xs " +
                            (cell.inMonth
                              ? "text-[#0A2540] font-medium"
                              : "text-stone-400")
                          }
                        >
                          {dt.getUTCDate()}
                        </div>
                        <div className="flex flex-col gap-1">
                          {cellPosts.map((p) => {
                            const pillar = PILLARS[p.pillar];
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => setSelected(p)}
                                className="text-left text-[11px] leading-tight px-1.5 py-1 border-l-2 hover:bg-stone-50 transition-colors duration-150 truncate"
                                style={{
                                  borderLeftColor: pillar.color,
                                  backgroundColor: pillar.bg,
                                  color: pillar.color,
                                }}
                                title={p.title}
                              >
                                <span className="font-semibold">
                                  {p.platform.slice(0, 2).toUpperCase()}
                                </span>
                                <span className="ml-1 text-[#0A2540]">
                                  {p.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Legend />
            </TabsContent>
          );
        })}
      </Tabs>

      <PostDetailPanel post={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function Legend() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {Object.entries(PILLARS).map(([name, cfg]) => (
        <div
          key={name}
          className="inline-flex items-center gap-2 text-xs text-[#5B6770]"
        >
          <span
            className="inline-block h-3 w-3"
            style={{ backgroundColor: cfg.color }}
          />
          {name}
        </div>
      ))}
    </div>
  );
}
