export function Nav() {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-surface border-b border-border flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 w-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="font-display italic text-2xl text-ink leading-none hover:opacity-80 transition-opacity"
        >
          Pievra
        </a>

        {/* Center nav links */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-2 px-3 py-1.5 rounded-lg transition-colors"
          >
            Home
          </a>
          <a
            href="/news"
            className="text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-2 px-3 py-1.5 rounded-lg transition-colors"
          >
            News
          </a>
          <a
            href="/marketplace"
            className="text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-2 px-3 py-1.5 rounded-lg transition-colors"
          >
            Marketplace
          </a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a
            href="/sign-in"
            className="text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-2 px-4 py-2 rounded-lg border border-border transition-colors"
          >
            Sign In
          </a>
          <a
            href="/get-started"
            className="text-sm font-semibold text-white bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
