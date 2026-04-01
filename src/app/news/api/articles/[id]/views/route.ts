import { NextRequest, NextResponse } from "next/server";
import { incrementViewCount } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const type = body.type === "report" ? "report" : "rss";
  incrementViewCount(id, type as "rss" | "report");
  return NextResponse.json({ ok: true });
}
