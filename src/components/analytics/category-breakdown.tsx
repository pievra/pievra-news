"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CategoryBreakdownProps {
  categoryStats: Array<{ protocol: string; category: string; count: number }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Media Trading": "#F97316",
  "Data & Identity": "#0EA5E9",
  Creative: "#7C3AED",
  Infrastructure: "#18181B",
  Measurement: "#16A34A",
  "Retail Media": "#DC2626",
};

const FALLBACK_COLORS = [
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#84cc16",
  "#0891b2",
];

function getCategoryColor(category: string, index: number): string {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export function CategoryBreakdown({ categoryStats }: CategoryBreakdownProps) {
  // Collect all unique protocols and categories
  const protocols = Array.from(new Set(categoryStats.map((s) => s.protocol)));
  const categories = Array.from(new Set(categoryStats.map((s) => s.category)));

  // Build chart data: one row per protocol, columns = categories
  const chartData = protocols.map((protocol) => {
    const row: Record<string, string | number> = { protocol };
    for (const category of categories) {
      const entry = categoryStats.find(
        (s) => s.protocol === protocol && s.category === category
      );
      row[category] = entry?.count ?? 0;
    }
    return row;
  });

  return (
    <div className="bg-surface-card border border-border rounded-lg p-5">
      {chartData.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-ink-muted text-sm">
          No category data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={true} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#71717a" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="protocol"
              tick={{ fontSize: 12, fill: "#52525b" }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                fontSize: "13px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            />
            {categories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={getCategoryColor(category, index)}
                radius={
                  index === categories.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
