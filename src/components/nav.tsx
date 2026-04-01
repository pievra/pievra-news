const linkStyle = {
  color: "var(--color-ink-muted)",
  textDecoration: "none" as const,
  fontSize: 14,
  fontWeight: 500,
  padding: "8px 14px",
  borderRadius: 8,
  transition: "all .2s",
};

export function Nav() {
  return (
    <nav
      style={{
        background: "var(--color-surface)",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", display: "inline-block" }}>
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 24,
            color: "var(--color-ink)",
            letterSpacing: "-0.5px",
          }}
        >
          pievra<span style={{ color: "var(--color-accent)" }}>.</span>
        </span>
      </a>

      {/* Right side: nav links + auth together */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <a href="/marketplace" style={linkStyle}>Marketplace</a>
        <a href="/partners" style={linkStyle}>Partners</a>
        <a href="/news" style={linkStyle}>News</a>
        <a href="/careers" style={linkStyle}>Careers</a>

        {/* Auth with extra left margin */}
        <a
          href="/signin"
          style={{ ...linkStyle, marginLeft: 16, padding: "8px 16px" }}
        >
          Sign In
        </a>
        <a
          href="/signup"
          style={{
            background: "var(--color-accent)",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            padding: "10px 20px",
            borderRadius: 10,
            textDecoration: "none",
            border: "none",
            transition: "all .2s",
          }}
        >
          Sign Up Free
        </a>
      </div>
    </nav>
  );
}
