import { getDeployments } from "@/lib/analytics-db";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default function AdminDeployments() {
  const { deployments, total } = getDeployments({ limit: 200 });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-ink">
          Deployments ({total})
        </h1>
        <a
          href="/news/admin/deployments/new"
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          Add Deployment
        </a>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-2 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Protocol</th>
              <th className="px-6 py-3">Country</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Source Type</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((d, i) => (
              <tr
                key={d.id}
                className={i % 2 === 0 ? "bg-white" : "bg-surface-2/50"}
              >
                <td className="px-6 py-3 text-sm text-ink font-medium">
                  {d.company}
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted whitespace-nowrap">
                  {d.protocol}
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted whitespace-nowrap">
                  {d.country ?? <span className="opacity-40">—</span>}
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted whitespace-nowrap">
                  {d.category ?? <span className="opacity-40">—</span>}
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted whitespace-nowrap">
                  {d.announced_date ?? <span className="opacity-40">—</span>}
                </td>
                <td className="px-6 py-3 text-sm text-ink-muted whitespace-nowrap">
                  {d.source_type ?? <span className="opacity-40">—</span>}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <DeleteButton id={d.id} />
                </td>
              </tr>
            ))}
            {deployments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-sm text-ink-muted"
                >
                  No deployments yet.{" "}
                  <a
                    href="/news/admin/deployments/new"
                    className="text-accent underline"
                  >
                    Add the first one.
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
