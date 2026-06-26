import type {
  CalculatedMetrics,
  FormData,
  ParsedFormData,
  RiskLevel,
  ScenarioType,
} from '../types'

function asString(value: unknown): string {
  return String(value ?? '').trim()
}

/** Strip currency/grouping chars; keep digits and at most one decimal point. */
export function parseNumericInput(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN
  }

  const raw = asString(value)
  if (raw === '') return NaN

  const firstLine = raw.split(/[\r\n]/)[0]

  const cleaned = firstLine
    .replace(/[\s\u00a0\u202f\u2007]/g, '')
    .replace(/[$£€¥₹']/g, '')
    .replace(/,/g, '')

  if (cleaned === '' || cleaned === '.' || cleaned === '-') return NaN
  if (!/^-?\d*\.?\d+$/.test(cleaned)) return NaN

  const result = Number(cleaned)
  return Number.isFinite(result) ? result : NaN
}

/** Whole numbers only — for technician count, working days, and job counts. */
export function parseIntegerInput(value: unknown): number {
  const parsed = parseNumericInput(value)
  if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return NaN
  return parsed
}

export function parseFormData(form: FormData): ParsedFormData | null {
  const revenueTarget = parseNumericInput(form.revenueTarget)
  const currentRevenue = parseNumericInput(form.currentRevenue)
  const currentJobsPerDay = parseIntegerInput(form.currentJobsPerDay)
  const numberOfTechnicians = parseIntegerInput(form.numberOfTechnicians)
  const averageRevenuePerJob = parseNumericInput(form.averageRevenuePerJob)
  const workingDaysRemaining = parseIntegerInput(form.workingDaysRemaining)

  if (
    !asString(form.businessGoal) ||
    !asString(form.revenueTarget) ||
    !asString(form.currentRevenue) ||
    !asString(form.currentJobsPerDay) ||
    !asString(form.numberOfTechnicians) ||
    !asString(form.averageRevenuePerJob) ||
    !asString(form.workingDaysRemaining) ||
    [
      revenueTarget,
      currentRevenue,
      currentJobsPerDay,
      numberOfTechnicians,
      averageRevenuePerJob,
      workingDaysRemaining,
    ].some((n) => Number.isNaN(n)) ||
    revenueTarget <= 0 ||
    currentRevenue < 0 ||
    currentJobsPerDay < 0 ||
    numberOfTechnicians <= 0 ||
    averageRevenuePerJob <= 0 ||
    workingDaysRemaining <= 0
  ) {
    return null
  }

  return {
    businessGoal: asString(form.businessGoal),
    revenueTarget,
    currentRevenue,
    currentJobsPerDay,
    numberOfTechnicians,
    averageRevenuePerJob,
    workingDaysRemaining,
  }
}

export function calculateMetrics(form: ParsedFormData): CalculatedMetrics {
  const revenueGap = form.revenueTarget - form.currentRevenue
  const jobsNeeded = Math.ceil(revenueGap / form.averageRevenuePerJob)
  const dailyTargetPerTech = Math.ceil(
    jobsNeeded / form.numberOfTechnicians / form.workingDaysRemaining,
  )
  const dailyTeamJobs = dailyTargetPerTech * form.numberOfTechnicians
  const currentJobsPerTech = form.currentJobsPerDay / form.numberOfTechnicians
  const forecastRevenue = Math.round(
    form.currentRevenue +
      form.currentJobsPerDay * form.workingDaysRemaining * form.averageRevenuePerJob,
  )

  const aheadOfPace = dailyTeamJobs <= form.currentJobsPerDay

  let throughputIncreasePercent =
    form.currentJobsPerDay === 0
      ? 100
      : Math.round(
          ((dailyTeamJobs - form.currentJobsPerDay) / form.currentJobsPerDay) * 100,
        )

  let riskLevel: RiskLevel = 'Low'
  let scenarioType: ScenarioType = 'MINOR_GAP'

  if (aheadOfPace) {
    throughputIncreasePercent = 0
    riskLevel = 'Low'
    scenarioType = 'AHEAD_OF_PACE'
  } else if (form.currentRevenue === 0) {
    scenarioType = 'NEW_TERRITORY'
    if (throughputIncreasePercent > 30) {
      riskLevel = 'High'
    } else if (throughputIncreasePercent > 15) {
      riskLevel = 'Medium'
    }
  } else if (throughputIncreasePercent > 30) {
    scenarioType = 'RECOVERY'
    riskLevel = 'High'
  } else if (throughputIncreasePercent > 15) {
    riskLevel = 'Medium'
  }

  return {
    revenueGap,
    jobsNeeded,
    dailyTargetPerTech,
    dailyTeamJobs,
    currentJobsPerTech,
    throughputIncreasePercent,
    forecastRevenue,
    riskLevel,
    scenarioType,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** Restrict typed input to valid currency characters. */
export function sanitizeCurrencyInput(value: string): string {
  return value.split(/[\r\n]/)[0].replace(/[^\d.,$]/g, '')
}

/** Restrict typed input to digits only. */
export function sanitizeIntegerInput(value: string): string {
  return value.split(/[\r\n]/)[0].replace(/\D/g, '')
}
