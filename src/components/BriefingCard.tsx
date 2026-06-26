interface BriefingCardProps {
  label: string
  text: string
  onCopy: () => void
  copied: boolean
  accent: 'blue' | 'red'
}

export function BriefingCard({ label, text, onCopy, copied, accent }: BriefingCardProps) {
  const accentBorder = accent === 'blue' ? 'border-l-tesla-blue' : 'border-l-tesla-red'
  const accentHover = accent === 'blue' ? 'hover:border-tesla-blue hover:text-tesla-blue' : 'hover:border-tesla-red hover:text-tesla-red'

  return (
    <div
      className={`flex flex-col rounded-sm border border-tesla-border border-l-[3px] bg-white min-h-[12rem] lg:min-h-0 lg:flex-1 ${accentBorder}`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-tesla-border px-4 py-3 lg:px-3 lg:py-2">
        <h2 className="text-sm font-semibold text-tesla-text lg:text-xs">{label}</h2>
        <button
          type="button"
          onClick={onCopy}
          disabled={!text}
          className={`rounded-sm border border-tesla-border px-3 py-1.5 text-xs font-medium text-tesla-text transition-colors disabled:cursor-not-allowed disabled:opacity-30 lg:px-2.5 lg:py-1 lg:text-[10px] ${accentHover}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="px-4 py-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:py-2.5">
        {text ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-tesla-text lg:text-xs">{text}</p>
        ) : (
          <p className="text-sm text-tesla-muted lg:text-xs">Generated briefing will appear here.</p>
        )}
      </div>
    </div>
  )
}
