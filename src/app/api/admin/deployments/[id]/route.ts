import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsDb } from "@/lib/analytics-db";

async function checkAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("pievra_admin");
  return adminCookie?.value === process.env.ADMIN_SECRET;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const db = getAnalyticsDb();
  db.prepare("DELETE FROM deployments WHERE id = ?").run(id);

  return NextResponse.json({ ok: true });
}
