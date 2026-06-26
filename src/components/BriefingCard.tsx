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
      className={`flex min-h-0 flex-1 flex-col rounded-sm border border-tesla-border border-l-[3px] bg-white ${accentBorder}`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-tesla-border px-3 py-2">
        <h2 className="text-xs font-semibold text-tesla-text">{label}</h2>
        <button
          type="button"
          onClick={onCopy}
          disabled={!text}
          className={`rounded-sm border border-tesla-border px-2.5 py-1 text-[10px] font-medium text-tesla-text transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${accentHover}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
        {text ? (
          <p className="text-xs leading-relaxed whitespace-pre-wrap text-tesla-text">{text}</p>
        ) : (
          <p className="text-xs text-tesla-muted">Generated briefing will appear here.</p>
        )}
      </div>
    </div>
  )
}
