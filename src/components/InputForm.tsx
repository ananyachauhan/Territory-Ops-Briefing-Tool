import type { CalculatedMetrics, FormData } from '../types'
import { sanitizeCurrencyInput, sanitizeIntegerInput } from '../utils/calculations'
import { MetricsPreview } from './MetricsPreview'

interface InputFormProps {
  form: FormData
  metrics: CalculatedMetrics | null
  onChange: (field: keyof FormData, value: string) => void
  onSubmit: () => void
  loading: boolean
}

const inputClass =
  'w-full rounded-sm border border-tesla-border bg-white px-2.5 py-1.5 text-xs text-tesla-text placeholder:text-tesla-muted focus:border-tesla-blue focus:outline-none focus:ring-1 focus:ring-tesla-blue/30'

const labelClass = 'mb-1 block text-[11px] font-medium text-tesla-text'

export function InputForm({ form, metrics, onChange, onSubmit, loading }: InputFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col gap-2.5">
      <div className="shrink-0">
        <label htmlFor="businessGoal" className={labelClass}>
          Business goal
        </label>
        <textarea
          id="businessGoal"
          rows={2}
          value={form.businessGoal}
          onChange={(e) => onChange('businessGoal', e.target.value)}
          placeholder="e.g. Improve Mobile Tire routing efficiency to support Robotaxi repair segments"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2.5">
        <div>
          <label htmlFor="revenueTarget" className={labelClass}>
            Revenue target ($)
          </label>
          <input
            id="revenueTarget"
            type="text"
            inputMode="decimal"
            value={form.revenueTarget}
            onChange={(e) => onChange('revenueTarget', sanitizeCurrencyInput(e.target.value))}
            placeholder="e.g. 2400000"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="currentRevenue" className={labelClass}>
            Current revenue ($)
          </label>
          <input
            id="currentRevenue"
            type="text"
            inputMode="decimal"
            value={form.currentRevenue}
            onChange={(e) => onChange('currentRevenue', sanitizeCurrencyInput(e.target.value))}
            placeholder="e.g. 1950000"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="currentJobsPerDay" className={labelClass}>
            Current jobs per day (team baseline)
          </label>
          <input
            id="currentJobsPerDay"
            type="text"
            inputMode="numeric"
            value={form.currentJobsPerDay}
            onChange={(e) => onChange('currentJobsPerDay', sanitizeIntegerInput(e.target.value))}
            placeholder="e.g. 85"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="numberOfTechnicians" className={labelClass}>
            Number of technicians
          </label>
          <input
            id="numberOfTechnicians"
            type="text"
            inputMode="numeric"
            value={form.numberOfTechnicians}
            onChange={(e) => onChange('numberOfTechnicians', sanitizeIntegerInput(e.target.value))}
            placeholder="e.g. 25"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="averageRevenuePerJob" className={labelClass}>
            Average revenue per job ($)
          </label>
          <input
            id="averageRevenuePerJob"
            type="text"
            inputMode="decimal"
            value={form.averageRevenuePerJob}
            onChange={(e) => onChange('averageRevenuePerJob', sanitizeCurrencyInput(e.target.value))}
            placeholder="e.g. 220"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="workingDaysRemaining" className={labelClass}>
            Working days remaining
          </label>
          <input
            id="workingDaysRemaining"
            type="text"
            inputMode="numeric"
            value={form.workingDaysRemaining}
            onChange={(e) => onChange('workingDaysRemaining', sanitizeIntegerInput(e.target.value))}
            placeholder="e.g. 30"
            className={inputClass}
          />
        </div>
      </div>

      {metrics && <MetricsPreview metrics={metrics} />}

      <button
        type="submit"
        disabled={loading}
        className="mt-auto shrink-0 rounded-sm bg-tesla-blue py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-[#3457b1] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Generating…' : 'Generate Briefings'}
      </button>
    </form>
  )
}
