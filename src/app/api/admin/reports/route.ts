import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

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
    title,
    slug,
    excerpt = null,
    body: reportBody = null,
    category = null,
    protocols = [],
    author = "Pievra Research",
    status = "draft",
  } = body;

  if (!title || !slug) {
    return NextResponse.json(
      { error: "title and slug are required" },
      { status: 400 }
    );
  }

  const id = randomUUID();
  const now = new Date().toISOString();

  const db = getDb();
  db.prepare(
    `INSERT INTO reports (id, title, slug, excerpt, body, category, protocols, author, status, published_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    title,
    slug,
    excerpt,
    reportBody,
    category,
    JSON.stringify(protocols),
    author,
    status,
    status === "published" ? now : null,
    now
  );

  return NextResponse.json({ id }, { status: 201 });
}
