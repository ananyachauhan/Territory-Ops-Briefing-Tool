export function Header() {
  return (
    <header className="shrink-0 border-b border-tesla-border bg-tesla-bg shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      {/* Mobile header */}
      <div className="px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <a href="/" className="flex shrink-0 items-center">
            <img src="/tesla-logo.png" alt="Tesla" className="h-8 w-auto" />
          </a>
          <button
            type="button"
            aria-label="Profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tesla-border text-tesla-text"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium text-tesla-text">
            Territory Operations{' '}
            <span className="text-tesla-red">Briefing Tool</span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-tesla-muted">
            Translate business goals into briefings leadership and technicians actually
            understand.
          </p>
        </div>
      </div>

      {/* Desktop header — unchanged */}
      <div className="relative mx-auto hidden h-24 max-w-[1920px] items-center justify-between px-6 lg:flex">
        <a href="/" className="flex shrink-0 items-center">
          <img
            src="/tesla-logo.png"
            alt="Tesla"
            className="h-[42px] w-auto"
          />
        </a>

        <nav className="absolute left-1/2 max-w-xl -translate-x-1/2 text-center">
          <p className="text-base font-medium text-tesla-text">
            Territory Operations{' '}
            <span className="text-tesla-red">Briefing Tool</span>
          </p>
          <p className="mt-1 text-xs text-tesla-muted">
            Translate business goals into briefings leadership and technicians actually
            understand.
          </p>
        </nav>

        <button
          type="button"
          aria-label="Profile"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-tesla-border text-tesla-text transition-colors hover:border-tesla-text"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-tesla-red via-tesla-blue to-tesla-red" />
    </header>
  )
}
