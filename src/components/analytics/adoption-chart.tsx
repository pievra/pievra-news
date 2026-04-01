"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ProtocolMetrics } from "@/lib/analytics-db";

interface AdoptionChartProps {
  data: ProtocolMetrics[];
}

type Metric = "stars" | "downloads" | "contributors";
type Range = "30d" | "90d" | "6m" | "1y" | "all";

const PROTOCOL_COLORS: Record<string, string> = {
  MCP: "#065f46",
  AdCP: "#1d4ed8",
  A2A: "#5b21b6",
  ARTF: "#9d174d",
  "Agentic Audiences": "#92400e",
};

const METRICS: { key: Metric; label: string }[] = [
  { key: "stars", label: "Stars" },
  { key: "downloads", label: "Downloads" },
  { key: "contributors", label: "Contributors" },
];

const RANGES: { key: Range; label: string; days: number | null }[] = [
  { key: "30d", label: "30d", days: 30 },
  { key: "90d", label: "90d", days: 90 },
  { key: "6m", label: "6m", days: 183 },
  { key: "1y", label: "1y", days: 365 },
  { key: "all", label: "All", days: null },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getMetricValue(m: ProtocolMetrics, metric: Metric): number | null {
  switch (metric) {
    case "stars":
      return m.github_stars;
    case "downloads":
      return (m.npm_weekly_downloads ?? 0) + (m.pypi_weekly_downloads ?? 0) || null;
    case "contributors":
      return m.github_contributors;
  }
}

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(0) + "K";
  return String(value);
}

export function AdoptionChart({ data }: AdoptionChartProps) {
  const [metric, setMetric] = useState<Metric>("stars");
  const [range, setRange] = useState<Range>("90d");

  const protocols = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.protocol)));
  }, [data]);

  const chartData = useMemo(() => {
    // Filter by date range
    const rangeDef = RANGES.find((r) => r.key === range)!;
    const cutoff = rangeDef.days
      ? new Date(Date.now() - rangeDef.days * 86400 * 1000).toISOString().split("T")[0]
      : null;

    const filtered = cutoff ? data.filter((d) => d.date >= cutoff) : data;

    // Group by date
    const byDate: Record<string, Record<string, number | null>> = {};
    for (const row of filtered) {
      if (!byDate[row.date]) byDate[row.date] = {};
      byDate[row.date][row.protocol] = getMetricValue(row, metric);
    }

    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({
        date,
        label: formatDate(date),
        ...values,
      }));
  }, [data, metric, range]);

  return (
    <div className="bg-surface-card border border-border rounded-lg p-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-5 items-center justify-between">
        {/* Metric toggle */}
        <div className="flex gap-1 bg-surface-2 rounded-lg p-1">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                metric === m.key
                  ? "bg-surface-card text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Range toggle */}
        <div className="flex gap-1 bg-surface-2 rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                range === r.key
                  ? "bg-surface-card text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="h-[400px] flex items-center justify-center text-ink-muted text-sm">
          No data available for the selected range
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#71717a" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: "#71717a" }}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <Tooltip
              formatter={(value, name) => [
                formatYAxis(Number(value ?? 0)),
                String(name ?? ""),
              ]}
              labelFormatter={(label) => label}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                fontSize: "13px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
            />
            {protocols.map((proto) => (
              <Line
                key={proto}
                type="monotone"
                dataKey={proto}
                stroke={PROTOCOL_COLORS[proto] ?? "#71717a"}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
