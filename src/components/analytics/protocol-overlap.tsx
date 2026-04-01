import { ProtocolBadge } from "@/components/protocol-badge";

interface ProtocolOverlapProps {
  overlaps: Array<{ company: string; protocols: string }>;
}

export function ProtocolOverlap({ overlaps }: ProtocolOverlapProps) {
  return (
    <div className="border border-border rounded-lg bg-surface-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-ink">Companies Using Multiple Protocols</h3>
        <p className="text-sm text-ink-muted mt-0.5">
          {overlaps.length} {overlaps.length === 1 ? "company" : "companies"} adopted 2+ protocols
        </p>
      </div>

      {overlaps.length === 0 ? (
        <div className="px-5 py-8 text-center text-ink-muted text-sm">
          No multi-protocol companies found
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {overlaps.map((item) => {
            const protocolList = item.protocols
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean);

            return (
              <li key={item.company} className="px-5 py-3.5 flex items-center gap-3 flex-wrap">
                <span className="font-medium text-ink text-sm min-w-[140px]">
                  {item.company}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {protocolList.map((proto) => (
                    <ProtocolBadge key={proto} protocol={proto} />
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
