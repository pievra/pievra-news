"use client";

import { useState, useMemo } from "react";
import type { Deployment } from "@/lib/analytics-db";
import { ProtocolBadge } from "@/components/protocol-badge";

interface DeploymentTableProps {
  deployments: Deployment[];
  total: number;
}

type SortKey = "recent" | "company";

const PROTOCOLS = ["MCP", "AdCP", "A2A", "ARTF", "Agentic Audiences"];
const CATEGORIES = [
  "Media Trading",
  "Data & Identity",
  "Creative",
  "Infrastructure",
  "Measurement",
  "Retail Media",
];

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function DeploymentTable({ deployments, total }: DeploymentTableProps) {
  const [search, setSearch] = useState("");
  const [filterProtocol, setFilterProtocol] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    let result = deployments;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.company.toLowerCase().includes(q));
    }

    if (filterProtocol !== "all") {
      result = result.filter((d) => d.protocol === filterProtocol);
    }

    if (filterCategory !== "all") {
      result = result.filter((d) => d.category === filterCategory);
    }

    if (sort === "company") {
      result = [...result].sort((a, b) => a.company.localeCompare(b.company));
    } else {
      // Most recent: sort by announced_date desc, then id desc
      result = [...result].sort((a, b) => {
        const da = a.announced_date ?? "";
        const db = b.announced_date ?? "";
        if (da !== db) return db.localeCompare(da);
        return b.id - a.id;
      });
    }

    return result;
  }, [deployments, search, filterProtocol, filterCategory, sort]);

  const uniqueCountries = useMemo(() => {
    const s = new Set(deployments.map((d) => d.country).filter(Boolean));
    return s.size;
  }, [deployments]);

  return (
    <div className="bg-surface-card border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-border flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-2 border border-border rounded-lg text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
          />
        </div>

        {/* Protocol filter */}
        <select
          value={filterProtocol}
          onChange={(e) => setFilterProtocol(e.target.value)}
          className="text-sm bg-surface-2 border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-accent"
        >
          <option value="all">All Protocols</option>
          {PROTOCOLS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm bg-surface-2 border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-accent"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="text-sm bg-surface-2 border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-accent"
        >
          <option value="recent">Most Recent</option>
          <option value="company">Company A-Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              <th className="px-4 py-3 text-left font-semibold text-ink-soft">Company</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-soft">Protocol</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-soft">Country</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-soft">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-soft">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-soft">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  No deployments match your filters
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{d.company}</td>
                  <td className="px-4 py-3">
                    <ProtocolBadge protocol={d.protocol} />
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {d.country ? (
                      <span className="flex items-center gap-1.5">
                        <span>{countryFlag(d.country)}</span>
                        <span>{d.country}</span>
                      </span>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{d.category ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                    {formatDate(d.announced_date)}
                  </td>
                  <td className="px-4 py-3">
                    {d.source_url ? (
                      <a
                        href={d.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-hover inline-flex items-center"
                        title="View source"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border bg-surface-2 text-sm text-ink-muted">
        <span className="font-semibold text-ink">{total}</span> known deployments across{" "}
        <span className="font-semibold text-ink">{uniqueCountries}</span>{" "}
        {uniqueCountries === 1 ? "country" : "countries"}
        {filtered.length !== deployments.length && (
          <span className="ml-2 text-ink-soft">
            ({filtered.length} shown after filters)
          </span>
        )}
      </div>
    </div>
  );
}
