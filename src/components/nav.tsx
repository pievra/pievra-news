const linkStyle: React.CSSProperties = {
  color: "var(--color-ink-muted)",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  padding: "8px 14px",
  borderRadius: 8,
  transition: "all .2s",
};

export function Nav() {
  return (
    <nav style={{
      background: "var(--color-surface)",
      height: 64,
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "0 40px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid var(--color-border)",
    }}>
      {/* Logo - left aligned */}
      <div style={{ justifySelf: "start" }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-block" }}>
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 24,
            color: "#18181B",
          }}>
            pievra<span style={{ color: "#F97316" }}>.</span>
          </span>
        </a>
      </div>

      {/* Nav links - true center */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <a href="/marketplace" style={linkStyle}>Marketplace</a>
        <a href="/partners" style={linkStyle}>Partners</a>
        <a href="/news" style={linkStyle}>News</a>
        <a href="/news/analytics" style={linkStyle}>Analytics</a>
        <a href="/careers" style={linkStyle}>Careers</a>
      </div>

      {/* Auth - right aligned */}
      <div style={{ display: "flex", gap: 4, alignItems: "center", justifySelf: "end" }}>
        <a href="/signin" style={linkStyle}>Sign In</a>
        <a href="/signup" style={{ ...linkStyle, background: "#F97316", color: "white" }}>Sign Up Free</a>
      </div>
    </nav>
  );
}
