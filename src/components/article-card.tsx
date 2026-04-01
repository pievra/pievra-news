import Link from "next/link";
import { Article } from "@/lib/db";
import { CategoryBadge } from "@/components/category-badge";
import { ProtocolBadge } from "@/components/protocol-badge";
import { SharePopover } from "@/components/share-popover";

interface ArticleCardProps {
  article: Article;
}

// --- Helpers ---

export function timeAgo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatViews(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(count);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// --- Component ---

export function ArticleCard({ article }: ArticleCardProps) {
  const slug = slugify(article.title);
  const href = `/news/${article.id}/${slug}`;
  const isPinned = article.is_pinned === 1;

  return (
    <article
      className={`border border-border rounded-lg bg-surface-card p-6 hover:border-accent-border hover:shadow transition-all${isPinned ? " ring-1 ring-accent/20" : ""}`}
    >
      {/* Pinned indicator */}
      {isPinned && (
        <div
          className="text-accent font-bold uppercase mb-2"
          style={{ fontSize: "10px" }}
        >
          Pinned
        </div>
      )}

      {/* Badge row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {article.category && <CategoryBadge category={article.category} />}
        {article.protocols.map((proto) => (
          <ProtocolBadge key={proto} protocol={proto} />
        ))}
        <span className="ml-auto text-[12px] text-ink-muted">
          {timeAgo(article.published)}
        </span>
      </div>

      {/* Title */}
      <h2 className="mb-1" style={{ fontSize: "18px", fontWeight: "700" }}>
        <Link
          href={href}
          className="text-ink hover:text-accent transition-colors"
        >
          {article.title}
        </Link>
      </h2>

      {/* Source */}
      <div
        className="mb-2 font-semibold"
        style={{
          fontSize: "12px",
          color: article.source_color ?? undefined,
        }}
      >
        {article.source}
      </div>

      {/* Excerpt */}
      {article.summary && (
        <p
          className="text-ink-soft line-clamp-2 mb-4"
          style={{ fontSize: "14px" }}
        >
          {article.summary}
        </p>
      )}

      {/* Action row */}
      <div className="flex items-center gap-3 mt-auto">
        {article.view_count > 0 && (
          <span className="text-[12px] text-ink-muted">
            {formatViews(article.view_count)} views
          </span>
        )}
        <button className="text-sm text-ink-muted hover:text-accent transition-colors">
          Save
        </button>
        <div className="ml-auto">
          <SharePopover url={href} title={article.title} />
        </div>
      </div>
    </article>
  );
}
