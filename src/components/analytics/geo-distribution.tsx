"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface GeoDistributionProps {
  countryStats: Array<{ country: string; count: number }>;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  CA: "Canada",
  IN: "India",
  AU: "Australia",
  JP: "Japan",
  IL: "Israel",
  NL: "Netherlands",
  SE: "Sweden",
  SG: "Singapore",
  CH: "Switzerland",
  BR: "Brazil",
  ES: "Spain",
  IT: "Italy",
  KR: "South Korea",
  CN: "China",
  NO: "Norway",
  FI: "Finland",
  DK: "Denmark",
  AT: "Austria",
  BE: "Belgium",
  PT: "Portugal",
  PL: "Poland",
  CZ: "Czech Republic",
  NZ: "New Zealand",
  ZA: "South Africa",
  MX: "Mexico",
  AR: "Argentina",
};

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

export function GeoDistribution({ countryStats }: GeoDistributionProps) {
  const top10 = countryStats.slice(0, 10);
  const totalCountries = countryStats.length;
  const totalDeployments = countryStats.reduce((sum, c) => sum + c.count, 0);

  const chartData = top10.map((c) => ({
    name: `${countryFlag(c.country)} ${countryName(c.country)}`,
    count: c.count,
    code: c.country,
  }));

  return (
    <div className="bg-surface-card border border-border rounded-lg p-5">
      {chartData.length === 0 ? (
        <div className="h-[340px] flex items-center justify-center text-ink-muted text-sm">
          No geographic data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            layout="horizontal"
            data={chartData}
            margin={{ top: 5, right: 60, left: 10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#52525b" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#71717a" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value) => [Number(value ?? 0), "Deployments"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.code}
                  fill={index === 0 ? "#f97316" : "#fdba74"}
                />
              ))}
              <LabelList dataKey="count" position="top" style={{ fontSize: 11, fill: "#52525b" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Summary */}
      <p className="text-sm text-ink-muted mt-3 text-center">
        <span className="font-semibold text-ink">{totalDeployments}</span> total deployments across{" "}
        <span className="font-semibold text-ink">{totalCountries}</span>{" "}
        {totalCountries === 1 ? "country" : "countries"}
      </p>
    </div>
  );
}
