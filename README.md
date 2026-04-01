# Pievra News + Analytics

Next.js app powering the news feed, protocol analytics dashboard, and reports for [pievra.com/news](https://pievra.com/news).

## Features

### News Feed (`/news`)
- RSS aggregation from 8 adtech publications (AdExchanger, Digiday, ExchangeWire, etc.)
- Auto-categorization: Media Trading, Data & Identity, Creative, Infrastructure, Measurement, Retail Media
- Protocol tagging: AdCP, MCP, Agentic Audiences, ARTF, A2A
- Dual filtering (categories + protocols), sorting (recent/oldest/most read)
- Social sharing (LinkedIn, X, Facebook, email)
- Pievra Reports carousel (6 original deep-dives)

### Protocol Analytics (`/news/analytics`)
- Live adoption metrics: GitHub stars, npm downloads, contributors, momentum
- Protocol scorecards ranked by composite score
- Adoption trend charts (Recharts)
- Geographic deployment map (73+ deployments across 9 countries)
- Category breakdown per protocol
- Searchable deployment directory

### Admin Panel (`/news/admin`)
- Article management (pin, hide, categorize)
- Report editor (create/publish original content)
- Deployment directory management

### API
- `GET /news/api/feed.xml` - RSS feed output
- `GET /news/api/analytics/metrics` - Real-time protocol metrics (1h cache)
- `GET /news/api/analytics/deployments` - Filtered deployment data

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- SQLite (better-sqlite3)
- Recharts (charts)
- PM2 (deployment)

## Data Pipeline

- **News Agent** (`/opt/pievra-news/news_agent.py`) - Daily RSS fetch + auto-categorization
- **Analytics Collector** (`/opt/pievra-analytics/collector.py`) - Daily GitHub/npm/PyPI metrics
- Databases: `~/.pievra-news/news.db`, `~/.pievra-analytics/analytics.db`

## Development

```bash
npm install
npm run dev     # http://localhost:3000/news
npm run test    # vitest
npm run build   # production build
```

## Deployment

```bash
npm run build
pm2 start ecosystem.config.cjs
# nginx proxies /news/* to port 3003
```
