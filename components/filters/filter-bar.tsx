"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/primitives/input";
import { Select } from "@/components/primitives/select";
import { CONTENT_TYPE_NAMES, PHASES, PLATFORMS, STATUSES } from "@/lib/types";

export interface Filters {
  q: string;
  platform: string;
  contentType: string;
  phase: string;
  status: string;
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  platform: "",
  contentType: "",
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-6 items-end pb-8 border-b border-[color:var(--color-rule)]">
      <label className="md:col-span-4 relative block">
        <Search
          size={14}
          strokeWidth={1.5}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-[color:var(--color-ink-45)]"
          aria-hidden
        />
        <Input
          placeholder="Search title or hook"
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          className="pl-7"
        />
      </label>

      <Select
        className="md:col-span-2"
        value={filters.platform}
        onChange={(e) => set("platform", e.target.value)}
        aria-label="Platform"
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
        value={filters.contentType}
        onChange={(e) => set("contentType", e.target.value)}
        aria-label="Content type"
      >
        <option value="">All types</option>
        {CONTENT_TYPE_NAMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>

      <Select
        className="md:col-span-2"
        value={filters.phase}
        onChange={(e) => set("phase", e.target.value)}
        aria-label="Phase"
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
        aria-label="Status"
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
