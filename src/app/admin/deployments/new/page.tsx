"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

const PROTOCOLS = ["AdCP", "MCP", "A2A", "ARTF", "Agentic Audiences"] as const;
const SOURCE_TYPES = ["registry", "news", "github", "manual"] as const;

const COUNTRY_REGION: Record<string, string> = {
  US: "North America",
  CA: "North America",
  MX: "Latin America",
  BR: "Latin America",
  AR: "Latin America",
  CL: "Latin America",
  CO: "Latin America",
  GB: "Europe",
  DE: "Europe",
  FR: "Europe",
  NL: "Europe",
  SE: "Europe",
  NO: "Europe",
  DK: "Europe",
  FI: "Europe",
  ES: "Europe",
  IT: "Europe",
  PL: "Europe",
  CH: "Europe",
  AT: "Europe",
  BE: "Europe",
  PT: "Europe",
  IE: "Europe",
  AU: "Asia Pacific",
  NZ: "Asia Pacific",
  JP: "Asia Pacific",
  KR: "Asia Pacific",
  CN: "Asia Pacific",
  IN: "Asia Pacific",
  SG: "Asia Pacific",
  ID: "Asia Pacific",
  TH: "Asia Pacific",
  MY: "Asia Pacific",
  PH: "Asia Pacific",
  VN: "Asia Pacific",
  HK: "Asia Pacific",
  TW: "Asia Pacific",
  AE: "Middle East & Africa",
  SA: "Middle East & Africa",
  IL: "Middle East & Africa",
  ZA: "Middle East & Africa",
  NG: "Middle East & Africa",
  KE: "Middle East & Africa",
  EG: "Middle East & Africa",
};

function inferRegion(country: string): string {
  return COUNTRY_REGION[country.toUpperCase()] ?? "";
}

export default function NewDeploymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [protocol, setProtocol] = useState<string>(PROTOCOLS[0]);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [useCase, setUseCase] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceType, setSourceType] = useState<string>(SOURCE_TYPES[0]);
  const [announcedDate, setAnnouncedDate] = useState("");

  function handleCountryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toUpperCase();
    setCountry(val);
    if (val.length === 2) {
      const inferred = inferRegion(val);
      if (inferred) setRegion(inferred);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/news/api/admin/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          protocol,
          country: country || null,
          region: region || null,
          category: category || null,
          use_case: useCase || null,
          source_url: sourceUrl || null,
          source_type: sourceType || null,
          announced_date: announcedDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      router.push("/news/admin/deployments");
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
      <h1 className="text-2xl font-bold text-ink mb-8">Add Deployment</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Company */}
        <div>
          <label className={labelClass}>Company *</label>
          <input
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
            placeholder="e.g. Acme Corp"
          />
        </div>

        {/* Protocol */}
        <div>
          <label className={labelClass}>Protocol *</label>
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            className={inputClass}
          >
            {PROTOCOLS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div>
          <label className={labelClass}>Country (ISO code)</label>
          <input
            type="text"
            value={country}
            onChange={handleCountryChange}
            maxLength={2}
            className={inputClass}
            placeholder="e.g. US, FR, DE"
          />
        </div>

        {/* Region */}
        <div>
          <label className={labelClass}>Region</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={inputClass}
            placeholder="Auto-filled from country, or enter manually"
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

        {/* Use Case */}
        <div>
          <label className={labelClass}>Use Case</label>
          <textarea
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Describe how the protocol is being used"
          />
        </div>

        {/* Source URL */}
        <div>
          <label className={labelClass}>Source URL</label>
          <input
            type="text"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        {/* Source Type */}
        <div>
          <label className={labelClass}>Source Type</label>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className={inputClass}
          >
            {SOURCE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Announced Date */}
        <div>
          <label className={labelClass}>Announced Date</label>
          <input
            type="date"
            value={announcedDate}
            onChange={(e) => setAnnouncedDate(e.target.value)}
            className={inputClass}
          />
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
            {loading ? "Saving..." : "Save Deployment"}
          </button>
          <a
            href="/news/admin/deployments"
            className="px-6 py-2.5 rounded-lg border border-border text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
