import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ArticleRow {
  id: string;
  title: string;
  source: string;
  category: string | null;
  view_count: number;
  is_pinned: number;
  is_hidden: number;
}

export default function AdminArticles() {
  const db = getDb();
  const articles = db
    .prepare(
      `SELECT id, title, source, category, view_count, is_pinned, is_hidden
       FROM articles
       ORDER BY published DESC
       LIMIT 100`
    )
    .all() as ArticleRow[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-8">Articles</h1>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-2 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Views</th>
              <th className="px-6 py-3 text-center">Pinned</th>
              <th className="px-6 py-3 text-center">Hidden</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, i) => (
              <tr
                key={article.id}
                className={[
                  i % 2 === 0 ? "bg-white" : "bg-surface-2/50",
                  article.is_hidden ? "opacity-40" : "",
                ].join(" ")}
              >
                <td className="px-6 py-3 text-sm text-ink max-w-xs">
                  <span className="block truncate max-w-[360px]">
                    {article.title}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted whitespace-nowrap">
                  {article.source}
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted whitespace-nowrap">
                  {article.category ?? (
                    <span className="opacity-40">—</span>
                  )}
                </td>
                <td className="px-6 py-3 text-sm font-medium text-ink text-right whitespace-nowrap">
                  {article.view_count.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-center">
                  {article.is_pinned ? (
                    <span className="inline-block w-2 h-2 rounded-full bg-accent" />
                  ) : (
                    <span className="inline-block w-2 h-2 rounded-full bg-border" />
                  )}
                </td>
                <td className="px-6 py-3 text-center">
                  {article.is_hidden ? (
                    <span className="text-xs font-semibold text-red-500">
                      Hidden
                    </span>
                  ) : (
                    <span className="text-xs text-ink-muted">Visible</span>
                  )}
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td
                  colSpan={6}
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
