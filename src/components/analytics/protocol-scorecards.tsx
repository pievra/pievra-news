import type { ProtocolMetrics } from "@/lib/analytics-db";

interface ProtocolScorecardsProps {
  metrics: ProtocolMetrics[];
  trend: ProtocolMetrics[];
}

const PROTOCOL_COLORS: Record<string, string> = {
  MCP: "#065f46",
  AdCP: "#1d4ed8",
  A2A: "#5b21b6",
  ARTF: "#9d174d",
  "Agentic Audiences": "#92400e",
};

const MATURITY: Record<string, { label: string; bg: string; text: string }> = {
  MCP: { label: "Stable", bg: "#f0fdf4", text: "#15803d" },
  AdCP: { label: "Beta", bg: "#fffbeb", text: "#b45309" },
  A2A: { label: "Beta", bg: "#fffbeb", text: "#b45309" },
  ARTF: { label: "Draft", bg: "#f4f4f5", text: "#52525b" },
  "Agentic Audiences": { label: "Final", bg: "#f0fdf4", text: "#15803d" },
};

function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function compositeScore(m: ProtocolMetrics): number {
  const stars = m.github_stars ?? 0;
  const downloads = (m.npm_weekly_downloads ?? 0) + (m.pypi_weekly_downloads ?? 0);
  const contributors = m.github_contributors ?? 0;
  return stars * 0.3 + downloads * 0.4 + contributors * 0.3;
}

export function ProtocolScorecards({ metrics, trend }: ProtocolScorecardsProps) {
  // Compute composite scores and sort
  const scored = metrics
    .map((m) => ({ m, score: compositeScore(m) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Normalize to 0-100
  const maxScore = scored[0]?.score ?? 1;
  const normalized = scored.map(({ m, score }) => ({
    m,
    normScore: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
  }));

  // Build lookup: protocol -> oldest record in trend (30d ago)
  const trend30: Record<string, ProtocolMetrics> = {};
  for (const t of trend) {
    if (!trend30[t.protocol] || t.date < trend30[t.protocol].date) {
      trend30[t.protocol] = t;
    }
  }

  return (
    <div className="flex gap-5 overflow-x-auto pb-2">
      {normalized.map(({ m }, idx) => {
        const color = PROTOCOL_COLORS[m.protocol] ?? "#18181b";
        const maturity = MATURITY[m.protocol] ?? { label: "Unknown", bg: "#f4f4f5", text: "#52525b" };
        const downloads = (m.npm_weekly_downloads ?? 0) + (m.pypi_weekly_downloads ?? 0);

        // 30-day momentum
        const old = trend30[m.protocol];
        let momentum: number | null = null;
        if (old && old.github_stars && m.github_stars && old.github_stars > 0) {
          momentum = ((m.github_stars - old.github_stars) / old.github_stars) * 100;
        }

        return (
          <div
            key={m.protocol}
            className="border border-border rounded-lg bg-surface-card p-5 min-w-[220px] flex-shrink-0"
          >
            {/* Rank badge */}
            <div
              className="text-xs font-bold mb-2 inline-block"
              style={{ color }}
            >
              #{idx + 1}
            </div>

            {/* Protocol name + maturity */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-bold text-lg text-ink leading-tight">{m.protocol}</span>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: maturity.bg, color: maturity.text }}
              >
                {maturity.label}
              </span>
            </div>

            {/* Stats grid */}
            <div className="space-y-2 text-sm">
              {/* Stars */}
              <div className="flex items-center justify-between">
                <span className="text-ink-muted flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Stars
                </span>
                <span className="font-semibold text-ink">{formatNumber(m.github_stars)}</span>
              </div>

              {/* Downloads */}
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Downloads/wk</span>
                <span className="font-semibold text-ink">{formatNumber(downloads || null)}</span>
              </div>

              {/* Contributors */}
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Contributors</span>
                <span className="font-semibold text-ink">{formatNumber(m.github_contributors)}</span>
              </div>

              {/* 30-day momentum */}
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-ink-muted">30d momentum</span>
                {momentum !== null ? (
                  <span
                    className="font-semibold text-xs"
                    style={{ color: momentum >= 0 ? "#16a34a" : "#dc2626" }}
                  >
                    {momentum >= 0 ? "+" : ""}
                    {momentum.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-ink-muted text-xs">—</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
