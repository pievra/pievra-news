export const CATEGORIES = [
  "Media Trading",
  "Data & Identity",
  "Creative",
  "Infrastructure",
  "Measurement",
  "Retail Media",
] as const;

export const PROTOCOLS = [
  "AdCP",
  "MCP",
  "Agentic Audiences",
  "ARTF",
  "A2A",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Protocol = (typeof PROTOCOLS)[number];

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  "Media Trading": [
    "programmatic",
    "dsp",
    "ssp",
    "rtb",
    "real-time bidding",
    "media buying",
    "ad exchange",
    "header bidding",
    "prebid",
    "openrtb",
    "bid stream",
    "supply path",
    "demand path",
    "cpm",
    "cpc",
    "cpa",
    "ctv advertising",
    "video advertising",
    "display advertising",
    "ad server",
    "campaign manager",
    "impression",
    "ad spend",
    "media plan",
    "insertion order",
  ],
  "Data & Identity": [
    "first-party data",
    "third-party cookie",
    "identity resolution",
    "clean room",
    "data management",
    "cdp",
    "customer data",
    "audience segment",
    "hashed email",
    "uid2",
    "euid",
    "id5",
    "liveramp",
    "consent",
    "gdpr",
    "privacy",
    "contextual targeting",
    "cohort",
    "fingerprint",
    "identifier",
  ],
  Creative: [
    "creative optimization",
    "dco",
    "dynamic creative",
    "ad creative",
    "generative ai creative",
    "ai-generated ads",
    "creative automation",
    "ad format",
    "rich media",
    "interactive ad",
  ],
  Infrastructure: [
    "ad tech infrastructure",
    "cloud",
    "api",
    "sdk",
    "protocol",
    "standard",
    "iab tech lab",
    "open source",
    "developer",
    "integration",
    "pipeline",
    "architecture",
    "ai agent",
    "agentic",
    "llm",
    "model context",
  ],
  Measurement: [
    "attribution",
    "measurement",
    "incrementality",
    "lift study",
    "viewability",
    "brand lift",
    "conversion",
    "roi measurement",
    "media mix model",
    "cross-channel measurement",
    "attention metric",
    "outcome-based",
  ],
  "Retail Media": [
    "retail media",
    "commerce media",
    "shopper",
    "in-store",
    "amazon ads",
    "walmart connect",
    "sponsored product",
    "retail data",
    "commerce data",
    "purchase data",
  ],
};

const PROTOCOL_KEYWORDS: Record<Protocol, string[]> = {
  AdCP: ["adcp", "ad context protocol"],
  MCP: ["mcp", "model context protocol"],
  "Agentic Audiences": ["ucp", "agentic audience", "unified context"],
  ARTF: ["artf", "agentic rtb", "agentic real-time"],
  A2A: ["a2a", "agent-to-agent", "agent to agent"],
};

export function classifyArticle(
  title: string,
  summary: string
): { category: Category | null; protocols: Protocol[] } {
  const text = `${title} ${summary}`.toLowerCase();

  // Score each category by counting keyword matches
  let bestCategory: Category | null = null;
  let bestScore = 0;

  for (const category of CATEGORIES) {
    const keywords = CATEGORY_KEYWORDS[category];
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  // Tag protocols by checking PROTOCOL_KEYWORDS matches
  const protocols: Protocol[] = [];
  for (const protocol of PROTOCOLS) {
    const keywords = PROTOCOL_KEYWORDS[protocol];
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        protocols.push(protocol);
        break;
      }
    }
  }

  return {
    category: bestScore >= 1 ? bestCategory : null,
    protocols,
  };
}
