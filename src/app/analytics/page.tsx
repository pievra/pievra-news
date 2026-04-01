import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getLatestMetrics,
  getMetricsTrend,
  getDeployments,
  getCountryStats,
  getCategoryStats,
  getProtocolOverlap,
} from "@/lib/analytics-db";
import { ProtocolScorecards } from "@/components/analytics/protocol-scorecards";
import { AdoptionChart } from "@/components/analytics/adoption-chart";
import { GeoDistribution } from "@/components/analytics/geo-distribution";
import { CategoryBreakdown } from "@/components/analytics/category-breakdown";
import { ProtocolOverlap } from "@/components/analytics/protocol-overlap";
import { DeploymentTable } from "@/components/analytics/deployment-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Protocol Analytics - Pievra | Live Adoption Metrics",
  description:
    "Track real-time adoption of agentic advertising protocols. GitHub stars, npm downloads, geographic deployment, company directory.",
  openGraph: {
    title: "Protocol Analytics - Pievra",
    description:
      "Live adoption metrics for AdCP, MCP, A2A, ARTF, Agentic Audiences",
    url: "https://pievra.com/news/analytics",
  },
};

export default function AnalyticsPage() {
  const metrics = getLatestMetrics();
  const trend = getMetricsTrend(90);
  const countryStatsRaw = getCountryStats();
  const categoryStats = getCategoryStats();
  const overlaps = getProtocolOverlap();
  const { deployments, total } = getDeployments({ limit: 50 });

  // Convert Record<string, number> to Array<{country, count}> for GeoDistribution
  const countryStats = Object.entries(countryStatsRaw).map(([country, count]) => ({
    country,
    count,
  }));

  // Find date of latest metric for display
  const latestDate =
    metrics.length > 0
      ? metrics.reduce((latest, m) => (m.date > latest ? m.date : latest), metrics[0].date)
      : null;

  const formattedDate = latestDate
    ? new Date(latestDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      {/* Header */}
      <p className="section-tag">PROTOCOL INTELLIGENCE</p>
      <h1 className="font-display italic text-4xl mt-2">
        Live Protocol Adoption Metrics
      </h1>
      <p className="text-ink-muted mt-3">
        Real-time tracking across 5 agentic advertising protocols. Data from
        GitHub, npm, PyPI, and public registries.
      </p>
      {formattedDate && (
        <p className="text-xs text-ink-muted mt-1">Last updated: {formattedDate}</p>
      )}

      {/* Section 1: Rankings */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-6">Protocol Rankings</h2>
        <ProtocolScorecards metrics={metrics} trend={trend} />
      </section>

      {/* Section 2: Market Intelligence */}
      <section className="mt-16">
        <h2 className="text-xl font-bold mb-6">Adoption Trends</h2>
        <Suspense
          fallback={
            <div className="h-[460px] bg-surface-card border border-border rounded-lg flex items-center justify-center text-ink-muted text-sm">
              Loading chart...
            </div>
          }
        >
          <AdoptionChart data={trend} />
        </Suspense>
      </section>

      <div className="grid grid-cols-2 gap-8 mt-12">
        <section>
          <h2 className="text-lg font-bold mb-4">Geographic Distribution</h2>
          <GeoDistribution countryStats={countryStats} />
        </section>
        <section>
          <h2 className="text-lg font-bold mb-4">Category Breakdown</h2>
          <CategoryBreakdown categoryStats={categoryStats} />
        </section>
      </div>

      {overlaps.length > 0 && (
        <section className="mt-12">
          <ProtocolOverlap overlaps={overlaps} />
        </section>
      )}

      {/* Section 3: Directory */}
      <section className="mt-16">
        <h2 className="text-xl font-bold mb-2">Deployment Directory</h2>
        <p className="text-ink-muted mb-6">
          Known protocol deployments across companies worldwide.
        </p>
        <Suspense
          fallback={
            <div className="h-[400px] bg-surface-card border border-border rounded-lg flex items-center justify-center text-ink-muted text-sm">
              Loading deployments...
            </div>
          }
        >
          <DeploymentTable deployments={deployments} total={total} />
        </Suspense>
      </section>
    </div>
  );
}
