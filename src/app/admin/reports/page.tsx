import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ReportRow {
  id: string;
  title: string;
  slug: string;
  view_count: number;
  status: string;
}

export default function AdminReports() {
  const db = getDb();
  const reports = db
    .prepare(
      `SELECT id, title, slug, view_count, status
       FROM reports
       ORDER BY published_at DESC`
    )
    .all() as ReportRow[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-ink">Reports</h1>
        <a
          href="/news/admin/reports/new"
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          New Report
        </a>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-2 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3 text-right">Views</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <tr
                key={report.id}
                className={i % 2 === 0 ? "bg-white" : "bg-surface-2/50"}
              >
                <td className="px-6 py-3 text-sm text-ink">
                  <a
                    href={`/news/reports/${report.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {report.title}
                  </a>
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted font-mono">
                  {report.slug}
                </td>
                <td className="px-6 py-3 text-sm font-medium text-ink text-right whitespace-nowrap">
                  {report.view_count.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-center">
                  {report.status === "published" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">
                      Draft
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-ink-muted"
                >
                  No reports yet.{" "}
                  <a
                    href="/news/admin/reports/new"
                    className="text-accent underline"
                  >
                    Create the first one.
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
