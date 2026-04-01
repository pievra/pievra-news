import { getArticles } from "@/lib/db";

export async function GET() {
  const { articles } = getArticles({ sort: "recent", limit: 50 });

  const items = articles.map((a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${a.url}</link>
      <description><![CDATA[${a.summary || ""}]]></description>
      <pubDate>${a.published ? new Date(a.published).toUTCString() : ""}</pubDate>
      <source url="${a.url}">${a.source}</source>
      <guid>${a.url}</guid>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pievra News - Protocol Intelligence</title>
    <link>https://pievra.com/news</link>
    <description>AI agent protocol analysis for programmatic advertising</description>
    <atom:link href="https://pievra.com/news/api/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
