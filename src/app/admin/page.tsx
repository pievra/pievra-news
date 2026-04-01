import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const db = getDb();

  const totalArticles = (
    db
      .prepare("SELECT COUNT(*) as count FROM articles WHERE is_hidden = 0")
      .get() as { count: number }
  ).count;

  const totalReports = (
    db
      .prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'published'")
      .get() as { count: number }
  ).count;

  const totalViews = (
    db
      .prepare(
        "SELECT COALESCE(SUM(view_count), 0) as total FROM articles WHERE is_hidden = 0"
      )
      .get() as { total: number }
  ).total;

  const topArticles = db
    .prepare(
      "SELECT id, title, source, view_count FROM articles WHERE is_hidden = 0 ORDER BY view_count DESC LIMIT 5"
    )
    .all() as { id: string; title: string; source: string; view_count: number }[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-border p-6">
          <p className="text-sm text-ink-muted font-medium mb-1">
            Total Articles
          </p>
          <p className="text-4xl font-bold text-ink">
            {totalArticles.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border p-6">
          <p className="text-sm text-ink-muted font-medium mb-1">
            Published Reports
          </p>
          <p className="text-4xl font-bold text-ink">
            {totalReports.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border p-6">
          <p className="text-sm text-ink-muted font-medium mb-1">Total Views</p>
          <p className="text-4xl font-bold text-ink">
            {totalViews.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Top articles */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-ink">Top Articles by Views</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-surface-2 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3 text-right">Views</th>
            </tr>
          </thead>
          <tbody>
            {topArticles.map((article, i) => (
              <tr
                key={article.id}
                className={i % 2 === 0 ? "bg-white" : "bg-surface-2/50"}
              >
                <td className="px-6 py-3 text-sm text-ink max-w-xs truncate">
                  {article.title}
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted">
                  {article.source}
                </td>
                <td className="px-6 py-3 text-sm font-medium text-ink text-right">
                  {article.view_count.toLocaleString()}
                </td>
              </tr>
            ))}
            {topArticles.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-sm text-ink-muted"
                >
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
