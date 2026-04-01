import type { Article } from "@/lib/db";

interface SidebarProps {
  trending: Article[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const protocols = [
  { name: "AdCP", version: "3.0-beta", status: "Beta", statusClass: "text-amber-600" },
  { name: "MCP", version: "2025-11-25", status: "Stable", statusClass: "text-green-600" },
  { name: "Agentic Audiences", version: "Phase 1", status: "Draft", statusClass: "text-amber-600" },
  { name: "ARTF", version: "1.0", status: "Final", statusClass: "text-green-600" },
  { name: "A2A", version: "0.3", status: "Stable", statusClass: "text-green-600" },
];

export function Sidebar({ trending }: SidebarProps) {
  return (
    <aside className="sticky top-[180px] space-y-5">
      {/* Protocol Status Card */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-surface-2 border-b border-border px-4 py-3">
          <span className="text-[14px] font-bold text-ink">Protocol Status</span>
        </div>
        <div className="px-4">
          {protocols.map((p, i) => (
            <div
              key={p.name}
              className={`flex items-center justify-between py-2.5 ${i < protocols.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">{p.name}</span>
                <span className="text-xs text-ink-muted">{p.version}</span>
              </div>
              <span className={`text-xs font-semibold ${p.statusClass}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Card */}
      <div className="bg-accent-light border border-accent-border rounded-lg p-5">
        <p className="text-[15px] font-bold text-ink mb-1">Weekly Intelligence</p>
        <p className="text-[12px] text-ink-soft mb-3">
          Protocol updates, market analysis, and industry news every Monday.
        </p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full border-0 bg-white rounded-lg px-3 py-2 text-[13px] text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button className="w-full bg-accent hover:bg-accent-hover text-white font-bold text-[13px] rounded-lg px-3 py-2 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      {/* Trending Card */}
      {trending.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-surface-2 border-b border-border px-4 py-3">
            <span className="text-[14px] font-bold text-ink">Trending</span>
          </div>
          <div className="px-4">
            {trending.slice(0, 5).map((article, i) => (
              <div
                key={article.id}
                className={`flex gap-3 py-2.5 ${i < Math.min(trending.length, 5) - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-lg font-bold text-accent/40 leading-tight min-w-[1.25rem]">
                  {i + 1}
                </span>
                <a
                  href={`/news/${article.id}/${slugify(article.title)}`}
                  className="text-xs font-semibold text-ink hover:text-accent leading-snug transition-colors"
                >
                  {article.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
