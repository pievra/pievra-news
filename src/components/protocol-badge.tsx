const colorMap: Record<string, string> = {
  AdCP: "bg-protocol-adcp-bg text-protocol-adcp-text",
  MCP: "bg-protocol-mcp-bg text-protocol-mcp-text",
  "Agentic Audiences": "bg-protocol-ucp-bg text-protocol-ucp-text",
  ARTF: "bg-protocol-artf-bg text-protocol-artf-text",
  A2A: "bg-protocol-a2a-bg text-protocol-a2a-text",
};

interface ProtocolBadgeProps {
  protocol: string;
}

export function ProtocolBadge({ protocol }: ProtocolBadgeProps) {
  const classes = colorMap[protocol] ?? "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-block text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide ${classes}`}
    >
      {protocol}
    </span>
  );
}
