import { NextRequest, NextResponse } from "next/server";
import { getDeployments } from "@/lib/analytics-db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const protocol = searchParams.get("protocol") ?? undefined;
  const country = searchParams.get("country") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 200);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const { deployments, total } = getDeployments({
    protocol,
    country,
    category,
    search,
    limit: isNaN(limit) ? 50 : limit,
    offset: isNaN(offset) ? 0 : offset,
  });

  return NextResponse.json({ deployments, total });
}
