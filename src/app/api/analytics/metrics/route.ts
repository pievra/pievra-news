import { NextResponse } from "next/server";
import { getCachedMetric, setCachedMetric } from "@/lib/analytics-db";

// Protocol -> GitHub repo + npm package mapping
const PROTOCOL_CONFIG: Record<
  string,
  { owner: string; repo: string; npm?: string }
> = {
  MCP: {
    owner: "modelcontextprotocol",
    repo: "modelcontextprotocol",
    npm: "@modelcontextprotocol/sdk",
  },
  AdCP: {
    owner: "adcontextprotocol",
    repo: "adcp",
    npm: "@adcp/client",
  },
  A2A: {
    owner: "a2aproject",
    repo: "A2A",
  },
  ARTF: {
    owner: "IABTechLab",
    repo: "agentic-rtb-framework",
  },
  "Agentic Audiences": {
    owner: "IABTechLab",
    repo: "agentic-audiences",
  },
};

async function fetchGitHubStars(owner: string, repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "pievra-analytics/1.0",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

async function fetchNpmDownloads(pkg: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.downloads === "number" ? data.downloads : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const results = await Promise.all(
    Object.entries(PROTOCOL_CONFIG).map(async ([protocol, config]) => {
      const starsKey = `github_stars:${protocol}`;
      const npmKey = `npm_downloads:${protocol}`;

      // Check cache for stars
      let github_stars: number | null = null;
      const cachedStars = getCachedMetric(starsKey);
      if (cachedStars && cachedStars.fresh) {
        github_stars = Number(cachedStars.value);
      } else {
        github_stars = await fetchGitHubStars(config.owner, config.repo);
        if (github_stars !== null) {
          setCachedMetric(starsKey, String(github_stars));
        }
      }

      // Check cache for npm downloads
      let npm_weekly_downloads: number | null = null;
      if (config.npm) {
        const cachedNpm = getCachedMetric(npmKey);
        if (cachedNpm && cachedNpm.fresh) {
          npm_weekly_downloads = Number(cachedNpm.value);
        } else {
          npm_weekly_downloads = await fetchNpmDownloads(config.npm);
          if (npm_weekly_downloads !== null) {
            setCachedMetric(npmKey, String(npm_weekly_downloads));
          }
        }
      }

      // Determine cached_at from the stars cache entry (most representative)
      const cacheEntry = getCachedMetric(starsKey);
      const cached_at = cacheEntry ? new Date().toISOString() : null;

      return {
        protocol,
        github_stars,
        npm_weekly_downloads,
        cached_at,
      };
    })
  );

  return NextResponse.json({ metrics: results });
}
