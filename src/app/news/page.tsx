import { Suspense } from "react";
import {
  getDb,
  runMigrations,
  getArticles,
  getPublishedReports,
  getTrending,
  getCategoryCounts,
} from "@/lib/db";
import type { SortOption } from "@/lib/db";
import { ReportsCarousel } from "@/components/reports-carousel";
import { FilterBar } from "@/components/filter-bar";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protocol Intelligence - Pievra News",
  description:
    "In-depth analysis of every AI agent protocol shaping programmatic advertising.",
  openGraph: {
    title: "Pievra News - Protocol Intelligence",
    description: "AI agent protocol analysis for programmatic advertising",
    url: "https://pievra.com/news",
  },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  category?: string;
  protocol?: string | string[];
  sort?: string;
  offset?: string;
}>;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const category = params.category ?? undefined;
  const rawProtocol = params.protocol;
  const protocols = rawProtocol
    ? Array.isArray(rawProtocol)
      ? rawProtocol
      : [rawProtocol]
    : undefined;
  const sort = (params.sort ?? "recent") as SortOption;
  const offset = Number(params.offset ?? 0);

  // Ensure schema is up to date on first load
  runMigrations(getDb());

  const reports = getPublishedReports();
  const { articles, total } = getArticles({
    category,
    protocols,
    sort,
    limit: 20,
    offset,
  });
  const trending = getTrending(5);
  const categoryCounts = getCategoryCounts();
  const totalAll = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  // Build pagination URLs
  function buildPageUrl(newOffset: number): string {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (protocols) {
      for (const proto of protocols) {
        p.append("protocol", proto);
      }
    }
    if (sort !== "recent") p.set("sort", sort);
    if (newOffset > 0) p.set("offset", String(newOffset));
    const qs = p.toString();
    return `/news${qs ? `?${qs}` : ""}`;
  }

  const hasPrev = offset > 0;
  const hasNext = offset + 20 < total;

  return (
    <>
      <ReportsCarousel reports={reports} />

      <Suspense fallback={<div className="h-[120px] border-b border-border" />}>
        <FilterBar categoryCounts={categoryCounts} totalCount={totalAll} />
      </Suspense>

      <div className="max-w-[1200px] mx-auto px-8 py-9 grid grid-cols-[1fr_300px] gap-10 items-start">
        {/* Left: article list + pagination */}
        <div>
          {articles.length === 0 ? (
            <div className="py-16 text-center text-ink-muted text-[15px]">
              No articles found matching your filters.
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {(hasPrev || hasNext) && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {hasPrev ? (
                <a
                  href={buildPageUrl(offset - 20)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
                >
                  &larr; Previous
                </a>
              ) : (
                <span />
              )}
              <span className="text-sm text-ink-muted">
                {offset + 1}&ndash;{Math.min(offset + 20, total)} of {total}
              </span>
              {hasNext ? (
                <a
                  href={buildPageUrl(offset + 20)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
                >
                  Next &rarr;
                </a>
              ) : (
                <span />
              )}
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <Sidebar trending={trending} />
      </div>
    </>
  );
}
