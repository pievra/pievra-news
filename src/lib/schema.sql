-- Extend existing articles table with new columns
ALTER TABLE articles ADD COLUMN category TEXT;
ALTER TABLE articles ADD COLUMN protocols TEXT DEFAULT '[]';
ALTER TABLE articles ADD COLUMN image_url TEXT;
ALTER TABLE articles ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN is_pinned INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN is_hidden INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN article_type TEXT DEFAULT 'rss';

-- Pievra original reports
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    body TEXT,
    category TEXT,
    protocols TEXT DEFAULT '[]',
    author TEXT,
    published_at TEXT,
    updated_at TEXT,
    image_url TEXT,
    view_count INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft'
);

-- Users (lightweight auth)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'reader',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id),
    article_id TEXT NOT NULL,
    article_type TEXT NOT NULL DEFAULT 'rss',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, article_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id TEXT NOT NULL,
    article_type TEXT NOT NULL DEFAULT 'rss',
    user_id TEXT NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    is_deleted INTEGER DEFAULT 0
);

-- Read history
CREATE TABLE IF NOT EXISTS read_history (
    user_id TEXT NOT NULL,
    article_id TEXT NOT NULL,
    article_type TEXT NOT NULL DEFAULT 'rss',
    read_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, article_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published DESC);
CREATE INDEX IF NOT EXISTS idx_articles_view_count ON articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_articles_pinned ON articles(is_pinned);
CREATE INDEX IF NOT EXISTS idx_reports_slug ON reports(slug);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
