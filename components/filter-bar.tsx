"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PILLAR_NAMES } from "@/lib/pillars";
import { PHASES, PLATFORMS, STATUSES } from "@/lib/types";

export interface Filters {
  q: string;
  platform: string;
  pillar: string;
  phase: string;
  status: string;
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  platform: "",
  pillar: "",
  phase: "",
  status: "",
};

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="bg-white border border-stone-200 p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
      <label className="md:col-span-4 relative block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5B6770]" />
        <Input
          placeholder="Search title or hook"
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          className="pl-9"
        />
      </label>

      <Select
        className="md:col-span-2"
        value={filters.platform}
        onChange={(e) => set("platform", e.target.value)}
      >
        <option value="">All platforms</option>
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </Select>

      <Select
        className="md:col-span-2"
        value={filters.pillar}
        onChange={(e) => set("pillar", e.target.value)}
      >
        <option value="">All pillars</option>
        {PILLAR_NAMES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </Select>

      <Select
        className="md:col-span-2"
        value={filters.phase}
        onChange={(e) => set("phase", e.target.value)}
      >
        <option value="">All phases</option>
        {PHASES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </Select>

      <Select
        className="md:col-span-2"
        value={filters.status}
        onChange={(e) => set("status", e.target.value)}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
    </div>
  );
}
