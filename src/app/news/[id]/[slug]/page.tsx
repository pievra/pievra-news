import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleById, incrementViewCount, getArticles } from "@/lib/db";
import { ProtocolBadge } from "@/components/protocol-badge";
import { CategoryBadge } from "@/components/category-badge";
import { SharePopover } from "@/components/share-popover";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.summary ?? undefined,
    openGraph: {
      title: article.title,
      description: article.summary ?? undefined,
      url: `/news/${article.id}/${article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}`,
      images: article.image_url ? [{ url: article.image_url }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  incrementViewCount(id, "rss");

  const relatedArticles = article.category
    ? getArticles({ category: article.category, limit: 4 }).articles
        .filter((a) => a.id !== article.id)
        .slice(0, 3)
    : [];

  const publishedDate = new Date(article.published);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articlePath = `/news/${article.id}/${article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <div className="max-w-[760px] mx-auto px-8 py-12">
      {/* Back link */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:opacity-80 transition-opacity mb-8"
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
        Back to feed
      </Link>

      {/* Badge row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {article.category && <CategoryBadge category={article.category} />}
        {article.protocols.map((protocol) => (
          <ProtocolBadge key={protocol} protocol={protocol} />
        ))}
      </div>

      {/* Title */}
      <h1 className="font-display italic text-4xl leading-tight text-ink mb-5">
        {article.title}
      </h1>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap text-sm mb-8">
        {article.source_color ? (
          <span
            className="font-semibold"
            style={{ color: article.source_color }}
          >
            {article.source}
          </span>
        ) : (
          <span className="font-semibold text-ink">{article.source}</span>
        )}
        <span className="text-ink-muted">{formattedDate}</span>
        {article.view_count > 0 && (
          <span className="text-ink-muted">{article.view_count} views</span>
        )}
        <div className="ml-auto">
          <SharePopover url={articlePath} title={article.title} />
        </div>
      </div>

      {/* Article body */}
      {article.summary && (
        <p className="text-ink-soft leading-relaxed text-base mb-8">
          {article.summary}
        </p>
      )}

      {/* CTA */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent border border-accent rounded-lg px-4 py-2 hover:bg-accent hover:text-white transition-colors"
      >
        Read full article on {article.source} &rarr;
      </a>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-border mt-16 pt-8">
          <h2 className="text-base font-bold text-ink mb-5">
            Related Articles
          </h2>
          <div className="flex flex-col gap-4">
            {relatedArticles.map((related) => {
              const relatedSlug = related.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
              return (
                <Link
                  key={related.id}
                  href={`/news/${related.id}/${relatedSlug}`}
                  className="group flex flex-col gap-1 hover:opacity-80 transition-opacity"
                >
                  <span className="text-[14px] font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                    {related.title}
                  </span>
                  <span className="text-[12px] text-ink-muted">
                    {related.source}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
