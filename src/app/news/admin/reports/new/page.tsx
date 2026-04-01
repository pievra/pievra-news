"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, PROTOCOLS } from "@/lib/categories";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const [author, setAuthor] = useState("Pievra Research");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    setSlug(slugify(val));
  }

  function toggleProtocol(protocol: string) {
    setSelectedProtocols((prev) =>
      prev.includes(protocol)
        ? prev.filter((p) => p !== protocol)
        : [...prev, protocol]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/news/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          body,
          category,
          protocols: selectedProtocols,
          author,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      router.push("/news/admin/reports");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  const labelClass = "block text-sm font-medium text-ink mb-1";
  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-8">New Report</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Title */}
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            className={inputClass}
            placeholder="Enter report title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelClass}>Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            placeholder="url-friendly-slug"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Short description shown in listings"
          />
        </div>

        {/* Body */}
        <div>
          <label className={labelClass}>Body (HTML)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={16}
            className={`${inputClass} font-mono text-xs`}
            placeholder="<p>Report content as HTML...</p>"
          />
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Protocols */}
        <div>
          <label className={labelClass}>Protocols</label>
          <div className="flex flex-wrap gap-2">
            {PROTOCOLS.map((protocol) => {
              const active = selectedProtocols.includes(protocol);
              return (
                <button
                  key={protocol}
                  type="button"
                  onClick={() => toggleProtocol(protocol)}
                  className={[
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                    active
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-ink-muted border-border hover:border-accent hover:text-accent",
                  ].join(" ")}
                >
                  {protocol}
                </button>
              );
            })}
          </div>
        </div>

        {/* Author */}
        <div>
          <label className={labelClass}>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <div className="flex gap-3">
            {(["draft", "published"] as const).map((s) => (
              <label
                key={s}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="accent-accent"
                />
                <span className="text-sm capitalize text-ink">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Report"}
          </button>
          <a
            href="/news/admin/reports"
            className="px-6 py-2.5 rounded-lg border border-border text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
