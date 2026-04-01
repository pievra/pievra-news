import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("pievra_admin");

  if (adminCookie?.value !== process.env.ADMIN_SECRET) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-surface-2">
      {/* Admin nav bar */}
      <nav className="bg-ink text-white px-8 py-3 flex items-center gap-8">
        <span className="font-bold text-sm tracking-wide uppercase opacity-60 mr-4">
          Admin
        </span>
        <a
          href="/news/admin"
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          Dashboard
        </a>
        <a
          href="/news/admin/articles"
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          Articles
        </a>
        <a
          href="/news/admin/reports"
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          Reports
        </a>
        <div className="ml-auto">
          <a
            href="/news"
            className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
          >
            View Site &rarr;
          </a>
        </div>
      </nav>

      {/* Content area */}
      <div className="max-w-[1200px] mx-auto px-8 py-8">{children}</div>
    </div>
  );
}
