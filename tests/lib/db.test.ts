import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { runMigrations } from "@/lib/db";

// Helper: create in-memory DB with the base articles table
// (as the Python agent creates it)
function createBaseDb(): Database.Database {
  const db = new Database(":memory:");
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT UNIQUE NOT NULL,
      source TEXT,
      source_color TEXT,
      published TEXT,
      summary TEXT,
      relevance_score REAL,
      fetched_at TEXT,
      displayed INTEGER DEFAULT 0
    )
  `);
  return db;
}

// Helper: get column names for a table
function getColumns(db: Database.Database, table: string): string[] {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  return rows.map((r) => r.name);
}

// Helper: check if a table exists
function tableExists(db: Database.Database, table: string): boolean {
  const row = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
    )
    .get(table) as { name: string } | undefined;
  return !!row;
}

describe("runMigrations", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createBaseDb();
  });

  it("adds new columns to existing articles table", () => {
    runMigrations(db);
    const columns = getColumns(db, "articles");
    expect(columns).toContain("category");
    expect(columns).toContain("protocols");
    expect(columns).toContain("image_url");
    expect(columns).toContain("view_count");
    expect(columns).toContain("is_pinned");
    expect(columns).toContain("is_hidden");
    expect(columns).toContain("article_type");
  });

  it("creates the reports table", () => {
    runMigrations(db);
    expect(tableExists(db, "reports")).toBe(true);
    const columns = getColumns(db, "reports");
    expect(columns).toContain("id");
    expect(columns).toContain("title");
    expect(columns).toContain("slug");
    expect(columns).toContain("status");
    expect(columns).toContain("protocols");
    expect(columns).toContain("view_count");
    expect(columns).toContain("is_featured");
  });

  it("creates users, bookmarks, comments, read_history tables", () => {
    runMigrations(db);
    expect(tableExists(db, "users")).toBe(true);
    expect(tableExists(db, "bookmarks")).toBe(true);
    expect(tableExists(db, "comments")).toBe(true);
    expect(tableExists(db, "read_history")).toBe(true);
  });

  it("is idempotent — running migrations twice does not throw", () => {
    expect(() => {
      runMigrations(db);
      runMigrations(db);
    }).not.toThrow();
  });
});
