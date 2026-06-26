import type { CalculatedMetrics, RiskLevel, ScenarioType } from '../types'
import { formatCurrency, formatNumber } from '../utils/calculations'

interface MetricsPreviewProps {
  metrics: CalculatedMetrics
}

const scenarioStyles: Record<ScenarioType, string> = {
  NEW_TERRITORY: 'bg-tesla-blue/10 text-tesla-blue',
  RECOVERY: 'bg-tesla-red/10 text-tesla-red',
  MINOR_GAP: 'bg-emerald-50 text-emerald-700',
  AHEAD_OF_PACE: 'bg-emerald-50 text-emerald-700',
}

const riskStyles: Record<RiskLevel, string> = {
  Low: 'text-emerald-600',
  Medium: 'text-amber-600',
  High: 'text-tesla-red',
}

export function MetricsPreview({ metrics }: MetricsPreviewProps) {
  return (
    <div className="shrink-0 rounded-sm border border-tesla-border border-l-[3px] border-l-tesla-red bg-tesla-surface/60 px-3 py-3 lg:px-2.5 lg:py-2">
      <p className="mb-2 text-xs font-semibold tracking-wide text-tesla-blue uppercase lg:mb-1.5 lg:text-[11px]">
        Calculated Metrics
      </p>
      <dl className="grid grid-cols-1 gap-2 text-xs text-tesla-text lg:grid-cols-2 lg:gap-x-3 lg:gap-y-1 lg:text-[11px]">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-tesla-muted">Scenario</dt>
          <dd>
            <span
              className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${scenarioStyles[metrics.scenarioType]}`}
            >
              {metrics.scenarioType.replace(/_/g, ' ')}
            </span>
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-tesla-muted">Revenue gap</dt>
          <dd className="font-medium text-tesla-red">{formatCurrency(metrics.revenueGap)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-tesla-muted">Jobs needed</dt>
          <dd>{formatNumber(metrics.jobsNeeded)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-tesla-muted">Daily / tech</dt>
          <dd className="font-medium text-tesla-blue">
            {formatNumber(metrics.dailyTargetPerTech)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-tesla-muted">Daily / team</dt>
          <dd>{formatNumber(metrics.dailyTeamJobs)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-tesla-muted">
            {metrics.scenarioType === 'AHEAD_OF_PACE' ? 'Throughput' : 'Throughput ↑'}
          </dt>
          <dd
            className={`font-medium ${metrics.scenarioType === 'AHEAD_OF_PACE' ? 'text-emerald-600' : 'text-tesla-red'}`}
          >
            {metrics.scenarioType === 'AHEAD_OF_PACE'
              ? 'On pace'
              : `${metrics.throughputIncreasePercent}%`}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-tesla-muted">Forecast</dt>
          <dd>{formatCurrency(metrics.forecastRevenue)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-tesla-muted">Risk</dt>
          <dd className={`font-medium ${riskStyles[metrics.riskLevel]}`}>
            {metrics.riskLevel}
          </dd>
        </div>
      </dl>
    </div>
  )
}
