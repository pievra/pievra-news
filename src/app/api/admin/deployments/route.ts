import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsDb } from "@/lib/analytics-db";

async function checkAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("pievra_admin");
  return adminCookie?.value === process.env.ADMIN_SECRET;
}

export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    company,
    protocol,
    country = null,
    region = null,
    category = null,
    use_case = null,
    source_url = null,
    source_type = null,
    announced_date = null,
  } = body;

  if (!company || !protocol) {
    return NextResponse.json(
      { error: "company and protocol are required" },
      { status: 400 }
    );
  }

  const db = getAnalyticsDb();
  const result = db
    .prepare(
      `INSERT INTO deployments
         (company, protocol, country, region, category, use_case, source_url, source_type, announced_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      company,
      protocol,
      country,
      region,
      category,
      use_case,
      source_url,
      source_type,
      announced_date
    );

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
