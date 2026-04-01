import Link from "next/link";
import { Report } from "@/lib/db";
import { ProtocolBadge } from "@/components/protocol-badge";

// --- Helpers ---

function estimateReadTime(body: string | null): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// --- Component ---

interface ReportsCarouselProps {
  reports: Report[];
}

export function ReportsCarousel({ reports }: ReportsCarouselProps) {
  if (reports.length === 0) return null;

  return (
    <section className="border-b border-border py-10 px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-1">
            <span
              className="text-[11px] font-bold tracking-[2px] text-accent uppercase"
            >
              PIEVRA REPORTS
            </span>
            <span className="text-[14px] text-ink-muted">
              Original analysis and deep dives
            </span>
          </div>
          <Link
            href="/news/reports"
            className="text-[14px] font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {/* Scroll container */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/news/reports/${report.slug}`}
              className="snap-start shrink-0 w-[340px] border border-border rounded-lg bg-surface-card hover:border-border-strong hover:shadow-sm transition-all group block"
            >
              {/* Image area */}
              <div
                className="h-40 rounded-t-lg"
                style={
                  report.image_url
                    ? {
                        backgroundImage: `url(${report.image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background:
                          "linear-gradient(135deg, #FFF7ED 0%, #FDBA74 100%)",
                      }
                }
              />

              {/* Content area */}
              <div className="p-5">
                {/* Protocol badges */}
                {report.protocols.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {report.protocols.map((protocol) => (
                      <ProtocolBadge key={protocol} protocol={protocol} />
                    ))}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-[16px] font-bold text-ink group-hover:text-accent transition-colors leading-snug mb-2">
                  {report.title}
                </h3>

                {/* Excerpt */}
                {report.excerpt && (
                  <p className="text-[14px] text-ink-muted line-clamp-2 mb-3">
                    {report.excerpt}
                  </p>
                )}

                {/* Date + read time */}
                <div className="flex items-center gap-2 text-[12px] text-ink-muted">
                  {report.published_at && (
                    <span>{formatDate(report.published_at)}</span>
                  )}
                  {report.published_at && (
                    <span className="text-border-strong">&bull;</span>
                  )}
                  <span>{estimateReadTime(report.body)} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
