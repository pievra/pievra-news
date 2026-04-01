export function Footer() {
  return (
    <footer className="bg-ink py-10">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <span className="font-display italic text-2xl leading-none" style={{ color: "rgba(255,255,255,0.8)" }}>
          Pievra
        </span>

        {/* Copyright */}
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
          &copy; {new Date().getFullYear()} Pievra. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
