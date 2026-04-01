import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import os from "os";

// --- Types ---

export interface ProtocolMetrics {
  id: number;
  protocol: string;
  date: string;
  github_stars: number | null;
  github_forks: number | null;
  github_contributors: number | null;
  github_open_issues: number | null;
  github_commits_30d: number | null;
  npm_weekly_downloads: number | null;
  pypi_weekly_downloads: number | null;
  registered_agents: number | null;
}

export interface Deployment {
  id: number;
  company: string;
  protocol: string;
  country: string | null;
  region: string | null;
  category: string | null;
  use_case: string | null;
  source_url: string | null;
  source_type: string | null;
  announced_date: string | null;
  created_at: string;
}

export interface GetDeploymentsOpts {
  protocol?: string;
  country?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetDeploymentsResult {
  deployments: Deployment[];
  total: number;
}

// --- Singleton DB connection ---

let _db: Database.Database | null = null;

export function getAnalyticsDb(): Database.Database {
  if (_db) return _db;

  const dbPath =
    process.env.ANALYTICS_DB_PATH ||
    path.join(os.homedir(), ".pievra-analytics", "analytics.db");

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  _db = new Database(dbPath);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  return _db;
}

// --- Migrations ---

const MIGRATION_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS protocol_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    protocol TEXT NOT NULL,
    date TEXT NOT NULL,
    github_stars INTEGER,
    github_forks INTEGER,
    github_contributors INTEGER,
    github_open_issues INTEGER,
    github_commits_30d INTEGER,
    npm_weekly_downloads INTEGER,
    pypi_weekly_downloads INTEGER,
    registered_agents INTEGER,
    UNIQUE(protocol, date)
  )`,
  `CREATE TABLE IF NOT EXISTS deployments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    protocol TEXT NOT NULL,
    country TEXT,
    region TEXT,
    category TEXT,
    use_case TEXT,
    source_url TEXT,
    source_type TEXT,
    announced_date TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS contributor_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    protocol TEXT NOT NULL,
    github_username TEXT NOT NULL,
    location_raw TEXT,
    country TEXT,
    fetched_at TEXT DEFAULT (datetime('now')),
    UNIQUE(protocol, github_username)
  )`,
  `CREATE TABLE IF NOT EXISTS metrics_cache (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    cached_at TEXT DEFAULT (datetime('now'))
  )`,
  "CREATE INDEX IF NOT EXISTS idx_protocol_metrics_protocol_date ON protocol_metrics(protocol, date)",
  "CREATE INDEX IF NOT EXISTS idx_deployments_protocol ON deployments(protocol)",
  "CREATE INDEX IF NOT EXISTS idx_deployments_country ON deployments(country)",
  "CREATE INDEX IF NOT EXISTS idx_contributor_locations_country ON contributor_locations(country)",
];

export function runAnalyticsMigrations(db: Database.Database): void {
  for (const stmt of MIGRATION_STATEMENTS) {
    try {
      db.exec(stmt + ";");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate column name") || msg.includes("already exists")) continue;
      throw err;
    }
  }
}

// --- Query functions ---

export function getLatestMetrics(): ProtocolMetrics[] {
  const db = getAnalyticsDb();
  runAnalyticsMigrations(db);

  const rows = db
    .prepare(
      `SELECT pm.*
       FROM protocol_metrics pm
       INNER JOIN (
         SELECT protocol, MAX(date) AS max_date
         FROM protocol_metrics
         GROUP BY protocol
       ) latest ON pm.protocol = latest.protocol AND pm.date = latest.max_date
       ORDER BY pm.github_stars DESC`
    )
    .all() as ProtocolMetrics[];

  return rows;
}

export function getMetricsTrend(days: number): ProtocolMetrics[] {
  const db = getAnalyticsDb();
  runAnalyticsMigrations(db);

  const rows = db
    .prepare(
      `SELECT * FROM protocol_metrics
       WHERE date >= date('now', ?)
       ORDER BY protocol ASC, date ASC`
    )
    .all(`-${days} days`) as ProtocolMetrics[];

  return rows;
}

export function getDeployments(opts: GetDeploymentsOpts = {}): GetDeploymentsResult {
  const db = getAnalyticsDb();
  runAnalyticsMigrations(db);

  const { protocol, country, category, search, limit = 20, offset = 0 } = opts;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (protocol) {
    conditions.push("protocol = ?");
    params.push(protocol);
  }

  if (country) {
    conditions.push("country = ?");
    params.push(country);
  }

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (search) {
    conditions.push("(company LIKE ? OR use_case LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const countRow = db
    .prepare(`SELECT COUNT(*) as total FROM deployments ${where}`)
    .get(...params) as { total: number };

  const rows = db
    .prepare(
      `SELECT * FROM deployments ${where} ORDER BY announced_date DESC, id DESC LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset) as Deployment[];

  return {
    deployments: rows,
    total: countRow.total,
  };
}

export function getCountryStats(protocol?: string): Record<string, number> {
  const db = getAnalyticsDb();
  runAnalyticsMigrations(db);

  let rows: { country: string; count: number }[];

  if (protocol) {
    rows = db
      .prepare(
        `SELECT country, COUNT(*) as count
         FROM deployments
         WHERE country IS NOT NULL AND protocol = ?
         GROUP BY country
         ORDER BY count DESC`
      )
      .all(protocol) as { country: string; count: number }[];
  } else {
    rows = db
      .prepare(
        `SELECT country, COUNT(*) as count
         FROM deployments
         WHERE country IS NOT NULL
         GROUP BY country
         ORDER BY count DESC`
      )
      .all() as { country: string; count: number }[];
  }

  const result: Record<string, number> = {};
  for (const row of rows) {
    result[row.country] = row.count;
  }
  return result;
}

export function getCategoryStats(): { protocol: string; category: string; count: number }[] {
  const db = getAnalyticsDb();
  runAnalyticsMigrations(db);

  const rows = db
    .prepare(
      `SELECT protocol, category, COUNT(*) as count
       FROM deployments
       WHERE category IS NOT NULL
       GROUP BY protocol, category
       ORDER BY protocol ASC, count DESC`
    )
    .all() as { protocol: string; category: string; count: number }[];

  return rows;
}

export function getProtocolOverlap(): { company: string; protocols: string; count: number }[] {
  const db = getAnalyticsDb();
  runAnalyticsMigrations(db);

  const rows = db
    .prepare(
      `SELECT company,
              GROUP_CONCAT(DISTINCT protocol) AS protocols,
              COUNT(DISTINCT protocol) AS count
       FROM deployments
       GROUP BY company
       HAVING count >= 2
       ORDER BY count DESC, company ASC`
    )
    .all() as { company: string; protocols: string; count: number }[];

  return rows;
}

export function getCachedMetric(key: string): { value: string; fresh: boolean } | null {
  const db = getAnalyticsDb();
  runAnalyticsMigrations(db);

  const row = db
    .prepare(
      `SELECT value, cached_at,
              (julianday('now') - julianday(cached_at)) * 24 < 1 AS is_fresh
       FROM metrics_cache
       WHERE key = ?`
    )
    .get(key) as { value: string; cached_at: string; is_fresh: number } | undefined;

  if (!row) return null;

  return {
    value: row.value,
    fresh: Boolean(row.is_fresh),
  };
}

export function setCachedMetric(key: string, value: string): void {
  const db = getAnalyticsDb();
  runAnalyticsMigrations(db);

  db.prepare(
    `INSERT INTO metrics_cache (key, value, cached_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, cached_at = excluded.cached_at`
  ).run(key, value);
}

// Reset singleton for testing
export function _resetAnalyticsDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
