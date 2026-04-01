import Link from "next/link";
import { getPublishedReports } from "@/lib/db";
import { ProtocolBadge } from "@/components/protocol-badge";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reports - Pievra News",
  description: "Deep dives into AI agent protocols shaping programmatic advertising.",
  openGraph: {
    title: "Pievra Reports - Original Analysis",
    description: "Deep dives into AI agent protocols shaping programmatic advertising.",
    url: "https://pievra.com/news/reports",
    type: "website",
  },
};

export default async function ReportsPage() {
  const reports = getPublishedReports();

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      <p className="text-[11px] font-bold tracking-[2px] text-accent uppercase mb-3">
        PIEVRA REPORTS
      </p>
      <h1 className="font-display italic text-4xl text-ink mb-3">
        Original Analysis
      </h1>
      <p className="text-ink-muted mb-10">
        Deep dives into AI agent protocols shaping the future of programmatic advertising.
      </p>

      {reports.length === 0 ? (
        <div className="py-16 text-center text-ink-muted text-[15px]">
          No reports published yet.
        </div>
      ) : (
        <div className="space-y-5">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.slug}`}
              className="group block border border-border rounded-lg p-6 hover:border-accent-border hover:shadow transition-all"
            >
              {report.protocols.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {report.protocols.map((p) => (
                    <ProtocolBadge key={p} protocol={p} />
                  ))}
                </div>
              )}

              <h2 className="text-xl font-bold text-ink group-hover:text-accent transition-colors mb-2">
                {report.title}
              </h2>

              {report.excerpt && (
                <p className="text-[14px] text-ink-soft line-clamp-2 mb-4">
                  {report.excerpt}
                </p>
              )}

              <div className="flex items-center gap-3 text-[12px] text-ink-muted">
                {report.published_at && (
                  <span>
                    {new Date(report.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                {report.author && (
                  <>
                    <span>&middot;</span>
                    <span>{report.author}</span>
                  </>
                )}
                {report.view_count > 0 && (
                  <>
                    <span>&middot;</span>
                    <span>{report.view_count.toLocaleString()} views</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
