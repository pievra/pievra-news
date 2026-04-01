import Link from "next/link";
import { getLatestMetrics, getDeployments } from "@/lib/analytics-db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pievra MCP Server - Protocol Intelligence for AI Agents",
  description:
    "Connect your AI agents to agentic advertising intelligence. 7 tools covering agent discovery, protocol metrics, deployments, compatibility, and market news.",
};

const TOOLS = [
  {
    name: "discover_agents",
    desc: "Find AI agents by protocol, category, or status",
    example: `{ "protocol": "MCP", "category": "media" }`,
  },
  {
    name: "check_protocol_support",
    desc: "Look up which protocols a company supports",
    example: `{ "company": "PubMatic" }`,
  },
  {
    name: "get_protocol_metrics",
    desc: "Get adoption metrics (GitHub stars, npm downloads)",
    example: `{ "protocol": "AdCP" }`,
  },
  {
    name: "find_deployments",
    desc: "Search deployment directory by country, protocol",
    example: `{ "country": "FR", "protocol": "AdCP" }`,
  },
  {
    name: "get_compatibility",
    desc: "Check protocol interoperability",
    example: `{ "protocol_a": "AdCP", "protocol_b": "ARTF" }`,
  },
  {
    name: "recommend_stack",
    desc: "Get recommended agents for a campaign goal",
    example: `{ "goal": "CTV campaign", "market": "France" }`,
  },
  {
    name: "get_market_news",
    desc: "Latest agentic advertising news",
    example: `{ "protocol": "MCP", "days": 7 }`,
  },
];

export default function McpPage() {
  const metrics = getLatestMetrics();
  const { total: deploymentsTotal } = getDeployments({ limit: 1 });

  const agentsTracked = 26;
  const protocolsCount = metrics.length > 0 ? metrics.length : 5;

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      {/* Header */}
      <p className="text-[11px] font-bold tracking-[2px] text-accent uppercase mb-3">
        DEVELOPER
      </p>
      <h1 className="font-display italic text-4xl text-ink mt-2">
        Pievra MCP Server
      </h1>
      <p className="text-ink-muted mt-3 max-w-2xl">
        Cross-protocol intelligence for agentic advertising. Connect your AI
        agents to the only source that tracks all 5 protocols.
      </p>
      <div className="flex gap-3 mt-6">
        <a
          href="#connect"
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Connect via SSE
        </a>
        <a
          href="https://github.com/pievra/pievra-mcp"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-lg text-sm font-semibold text-ink hover:border-border-strong transition-colors"
        >
          View on GitHub
        </a>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-4 gap-4 mt-12">
        {[
          { value: "7", label: "Tools" },
          { value: String(agentsTracked), label: "Agents Tracked" },
          { value: String(deploymentsTotal || 73), label: "Deployments" },
          { value: String(protocolsCount), label: "Protocols" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-border rounded-lg p-5 bg-surface-card"
          >
            <p className="text-3xl font-bold text-ink">{stat.value}</p>
            <p className="text-sm text-ink-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tools Section */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-ink mb-2">Available Tools</h2>
        <p className="text-ink-muted mb-6">
          7 tools covering the full stack of agentic advertising intelligence.
        </p>
        <div className="space-y-4">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="border border-border rounded-lg p-5 bg-surface-card"
            >
              <p className="font-mono font-bold text-ink">{tool.name}</p>
              <p className="text-ink-soft text-sm mt-1">{tool.desc}</p>
              <div className="mt-3 bg-surface-2 rounded-md p-3 font-mono text-sm text-ink-soft">
                {tool.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="mt-16">
        <h2 className="text-xl font-bold text-ink mb-2">Connect</h2>
        <p className="text-ink-muted mb-8">
          Add Pievra to your MCP client in under a minute.
        </p>

        <div className="space-y-8">
          {/* Remote SSE */}
          <div>
            <p className="text-sm font-semibold text-ink mb-1">
              Remote SSE{" "}
              <span className="text-xs font-normal text-ink-muted">
                (recommended for production)
              </span>
            </p>
            <p className="text-xs text-ink-muted mb-2">
              Claude Desktop / Cursor config
            </p>
            <pre className="bg-ink text-white/90 p-5 rounded-lg font-mono text-sm overflow-x-auto">
              {`{
  "mcpServers": {
    "pievra": {
      "url": "https://pievra.com/mcp/"
    }
  }
}`}
            </pre>
          </div>

          {/* Local stdio */}
          <div>
            <p className="text-sm font-semibold text-ink mb-1">
              Local stdio{" "}
              <span className="text-xs font-normal text-ink-muted">
                (coming soon via npm)
              </span>
            </p>
            <p className="text-xs text-ink-muted mb-2">Terminal</p>
            <pre className="bg-ink text-white/90 p-5 rounded-lg font-mono text-sm overflow-x-auto">
              npx @pievra/mcp-server
            </pre>
          </div>
        </div>
      </section>

      {/* Data Freshness */}
      <section className="mt-16 border border-border rounded-lg p-6 bg-surface-card">
        <h2 className="text-base font-bold text-ink mb-2">Data Freshness</h2>
        <p className="text-sm text-ink-muted">
          Protocol metrics are updated daily at 04:00 UTC. Every response
          includes a{" "}
          <span className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded">
            data_as_of
          </span>{" "}
          timestamp so your agent always knows how fresh the data is. No live
          API fetching at query time: fast, predictable, and rate-limit free.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-12 flex gap-4">
        <Link
          href="/analytics"
          className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          Explore the data &rarr;
        </Link>
        <span className="text-border">|</span>
        <a
          href="https://pievra.com/marketplace.html"
          className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          Browse agents &rarr;
        </a>
      </section>
    </div>
  );
}
