export function Header() {
  return (
    <header className="shrink-0 border-b border-tesla-border bg-tesla-bg shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex h-24 max-w-[1920px] items-center justify-between px-6">
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

        <p className="text-xs text-tesla-muted">
          Powered by <span className="font-medium text-tesla-blue">Groq</span>
        </p>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-tesla-red via-tesla-blue to-tesla-red" />
    </header>
  )
}
