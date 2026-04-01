import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import os from "os";

// --- Types ---

export interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  source_color: string | null;
  published: string;
  summary: string | null;
  relevance_score: number | null;
  fetched_at: string | null;
  displayed: number | null;
  category: string | null;
  protocols: string[];
  image_url: string | null;
  view_count: number;
  is_pinned: number;
  is_hidden: number;
  article_type: string;
}

export interface Report {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  protocols: string[];
  author: string | null;
  published_at: string | null;
  updated_at: string | null;
  image_url: string | null;
  view_count: number;
  is_featured: number;
  status: string;
}

export type SortOption = "recent" | "oldest" | "most_read";

export interface GetArticlesOpts {
  category?: string;
  protocols?: string[];
  sort?: SortOption;
  limit?: number;
  offset?: number;
}

export interface GetArticlesResult {
  articles: Article[];
  total: number;
}

// --- Singleton DB connection ---

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const dbPath =
    process.env.DB_PATH ||
    path.join(os.homedir(), ".pievra-news", "news.db");

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

export function runMigrations(db: Database.Database): void {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  // Strip comment lines, then split on semicolons and filter empty statements
  const stripped = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  const statements = stripped
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      db.exec(statement + ";");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // Ignore "duplicate column" and "already exists" errors (idempotent)
      if (
        msg.includes("duplicate column name") ||
        msg.includes("already exists")
      ) {
        continue;
      }
      throw err;
    }
  }
}

// --- Helpers ---

function parseProtocols(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rowToArticle(row: Record<string, unknown>): Article {
  return {
    ...(row as Omit<Article, "protocols">),
    protocols: parseProtocols(row.protocols as string | null),
  };
}

function rowToReport(row: Record<string, unknown>): Report {
  return {
    ...(row as Omit<Report, "protocols">),
    protocols: parseProtocols(row.protocols as string | null),
  };
}

// --- Query functions ---

export function getArticles(opts: GetArticlesOpts = {}): GetArticlesResult {
  const db = getDb();
  const {
    category,
    protocols,
    sort = "recent",
    limit = 20,
    offset = 0,
  } = opts;

  const conditions: string[] = ["is_hidden = 0"];
  const params: unknown[] = [];

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (protocols && protocols.length > 0) {
    const protocolClauses = protocols.map(() => "protocols LIKE ?");
    conditions.push("(" + protocolClauses.join(" OR ") + ")");
    for (const p of protocols) {
      params.push(`%${p}%`);
    }
  }

  const where = "WHERE " + conditions.join(" AND ");

  let orderBy: string;
  switch (sort) {
    case "oldest":
      orderBy = "is_pinned DESC, published ASC";
      break;
    case "most_read":
      orderBy = "is_pinned DESC, view_count DESC";
      break;
    case "recent":
    default:
      orderBy = "is_pinned DESC, published DESC";
      break;
  }

  const countRow = db
    .prepare(`SELECT COUNT(*) as total FROM articles ${where}`)
    .get(...params) as { total: number };

  const rows = db
    .prepare(
      `SELECT * FROM articles ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset) as Record<string, unknown>[];

  return {
    articles: rows.map(rowToArticle),
    total: countRow.total,
  };
}

export function getArticleById(id: string): Article | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM articles WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToArticle(row) : null;
}

export function incrementViewCount(
  id: string,
  type: "rss" | "report"
): void {
  const db = getDb();
  const table = type === "report" ? "reports" : "articles";
  db.prepare(`UPDATE ${table} SET view_count = view_count + 1 WHERE id = ?`).run(
    id
  );
}

export function getPublishedReports(): Report[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM reports WHERE status = 'published' ORDER BY published_at DESC"
    )
    .all() as Record<string, unknown>[];
  return rows.map(rowToReport);
}

export function getReportBySlug(slug: string): Report | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM reports WHERE slug = ?")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? rowToReport(row) : null;
}

export function getTrending(limit = 10): Article[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM articles WHERE is_hidden = 0 ORDER BY view_count DESC LIMIT ?"
    )
    .all(limit) as Record<string, unknown>[];
  return rows.map(rowToArticle);
}

export function getCategoryCounts(): Record<string, number> {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT category, COUNT(*) as count FROM articles WHERE is_hidden = 0 AND category IS NOT NULL GROUP BY category"
    )
    .all() as { category: string; count: number }[];

  const result: Record<string, number> = {};
  for (const row of rows) {
    result[row.category] = row.count;
  }
  return result;
}

// Reset singleton for testing
export function _resetDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
