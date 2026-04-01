import { notFound } from "next/navigation";
import Link from "next/link";
import { getReportBySlug, incrementViewCount } from "@/lib/db";
import { ProtocolBadge } from "@/components/protocol-badge";
import { SharePopover } from "@/components/share-popover";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) {
    return { title: "Report Not Found - Pievra News" };
  }

  return {
    title: `${report.title} - Pievra Reports`,
    description: report.excerpt ?? undefined,
    openGraph: {
      title: report.title,
      description: report.excerpt ?? undefined,
      url: `https://pievra.com/news/reports/${report.slug}`,
      type: "article",
    },
  };
}

export default async function ReportPage({ params }: { params: Params }) {
  const { slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) {
    notFound();
  }

  incrementViewCount(report.id, "report");

  return (
    <div className="max-w-[760px] mx-auto px-8 py-12">
      {/* Back link */}
      <Link
        href="/reports"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent transition-colors mb-8"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        All Reports
      </Link>

      {/* Protocol badges */}
      {report.protocols.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {report.protocols.map((p) => (
            <ProtocolBadge key={p} protocol={p} />
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="font-display italic text-4xl text-ink leading-tight mb-6">
        {report.title}
      </h1>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-sm text-ink-muted mb-10 border-b border-border pb-6">
        {report.author && (
          <span className="font-bold text-ink">{report.author}</span>
        )}
        {report.published_at && (
          <>
            {report.author && <span>&middot;</span>}
            <span>
              {new Date(report.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </>
        )}
        {report.view_count > 0 && (
          <>
            <span>&middot;</span>
            <span>{report.view_count.toLocaleString()} views</span>
          </>
        )}
        <div className="ml-auto">
          <SharePopover
            url={`/news/reports/${report.slug}`}
            title={report.title}
          />
        </div>
      </div>

      {/* Body — content is admin-authored HTML stored in the database */}
      {report.body && (
        <div
          className="
            [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-ink-soft [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:ml-6
            [&_li]:text-ink-soft [&_li]:mb-1
            [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2
            [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
          "
          // Body is admin-authored HTML; not user-supplied input
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: report.body }}
        />
      )}
    </div>
  );
}
