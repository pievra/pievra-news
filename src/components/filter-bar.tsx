"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, PROTOCOLS } from "@/lib/categories";

interface FilterBarProps {
  categoryCounts: Record<string, number>;
  totalCount: number;
}

export function FilterBar({ categoryCounts, totalCount }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeProtocols = searchParams.getAll("protocol");
  const activeSort = searchParams.get("sort") ?? "recent";

  function updateParams(updates: Record<string, string | string[] | null>) {
    const params = new URLSearchParams(searchParams.toString());

    // Reset offset on any filter change
    params.delete("offset");

    for (const [key, value] of Object.entries(updates)) {
      params.delete(key);
      if (value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) {
          params.append(key, v);
        }
      } else if (value !== "") {
        params.set(key, value);
      }
    }

    router.push(`?${params.toString()}`);
  }

  function handleCategory(cat: string) {
    updateParams({ category: cat === activeCategory ? null : cat });
  }

  function handleProtocol(proto: string) {
    const next = activeProtocols.includes(proto)
      ? activeProtocols.filter((p) => p !== proto)
      : [...activeProtocols, proto];
    updateParams({ protocol: next.length > 0 ? next : null });
  }

  function handleSort(sort: string) {
    updateParams({ sort });
  }

  const pillBase =
    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer select-none";
  const pillActive = "bg-accent text-white border-accent";
  const pillInactive =
    "bg-surface-card text-ink-soft border-border hover:border-accent-border hover:text-ink";

  return (
    <div className="sticky top-[52px] z-40 bg-surface border-b border-border py-4 px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-3">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => handleCategory("")}
            className={`${pillBase} ${activeCategory === "" ? pillActive : pillInactive}`}
          >
            All
            <span className="text-[11px] opacity-75">({totalCount})</span>
          </button>
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] ?? 0;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`${pillBase} ${isActive ? pillActive : pillInactive}`}
              >
                {cat}
                <span className="text-[11px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Protocols */}
        <div className="flex flex-wrap gap-2 items-center">
          {PROTOCOLS.map((proto) => {
            const isActive = activeProtocols.includes(proto);
            return (
              <button
                key={proto}
                onClick={() => handleProtocol(proto)}
                className={`${pillBase} text-[12px] font-semibold uppercase tracking-wide ${isActive ? pillActive : pillInactive}`}
              >
                {proto}
              </button>
            );
          })}
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between gap-4">
          <select
            value={activeSort}
            onChange={(e) => handleSort(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-surface-card text-ink focus:outline-none focus:border-accent"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest</option>
            <option value="most_read">Most Read</option>
          </select>
          <span className="text-sm text-ink-muted">
            {totalCount} article{totalCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
