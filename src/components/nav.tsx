// Nav component matching the static site marketplace nav exactly
// Uses inline styles to guarantee pixel-perfect consistency

const navStyle: React.CSSProperties = {
  background: "var(--color-surface)",
  height: 52,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 32px",
  position: "sticky",
  top: 0,
  zIndex: 100,
  borderBottom: "1px solid var(--color-border)",
};

const navRightStyle: React.CSSProperties = {
  display: "flex",
  gap: 4,
  alignItems: "center",
};

const linkStyle: React.CSSProperties = {
  color: "var(--color-ink-muted)",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  padding: "8px 14px",
  borderRadius: 8,
  transition: "all .2s",
};

const signInStyle: React.CSSProperties = {
  color: "var(--color-ink-muted)",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 500,
  padding: "8px 14px",
  borderRadius: 8,
  transition: "all .2s",
};

const ctaStyle: React.CSSProperties = {
  background: "var(--color-accent)",
  color: "white",
  fontWeight: 700,
  fontSize: 13,
  padding: "8px 16px",
  borderRadius: 8,
  textDecoration: "none",
  transition: "all .2s",
};

const logoTextStyle: React.CSSProperties = {
  fontFamily: "'Instrument Serif', serif",
  fontStyle: "italic",
  fontSize: 24,
  color: "#18181B",
};

export function Nav() {
  return (
    <nav style={navStyle}>
      <a href="/" style={{ textDecoration: "none", display: "inline-block" }}>
        <span style={logoTextStyle}>
          pievra<span style={{ color: "#F97316" }}>.</span>
        </span>
      </a>
      <div style={navRightStyle}>
        <a href="/marketplace" style={linkStyle}>Marketplace</a>
        <a href="/partners" style={linkStyle}>Partners</a>
        <a href="/news" style={linkStyle}>News</a>
        <a href="/careers" style={linkStyle}>Careers</a>
        <a href="/signin" style={signInStyle}>Sign In</a>
        <a href="/signup" style={ctaStyle}>Sign Up Free</a>
      </div>
    </nav>
  );
}
