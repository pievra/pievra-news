import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

async function checkAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("pievra_admin");
  return adminCookie?.value === process.env.ADMIN_SECRET;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const allowed = ["is_pinned", "is_hidden", "category", "protocols"] as const;
  type AllowedKey = (typeof allowed)[number];

  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      if (key === "protocols") {
        updates[key] = JSON.stringify(body[key]);
      } else {
        updates[key] = body[key as AllowedKey];
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
  }

  const setClauses = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(updates);

  const db = getDb();
  db.prepare(`UPDATE articles SET ${setClauses} WHERE id = ?`).run(
    ...values,
    id
  );

  return NextResponse.json({ ok: true });
}
