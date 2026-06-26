export interface FormData {
  businessGoal: string
  revenueTarget: string
  currentRevenue: string
  currentJobsPerDay: string
  numberOfTechnicians: string
  averageRevenuePerJob: string
  workingDaysRemaining: string
}

export interface ParsedFormData {
  businessGoal: string
  revenueTarget: number
  currentRevenue: number
  currentJobsPerDay: number
  numberOfTechnicians: number
  averageRevenuePerJob: number
  workingDaysRemaining: number
}

export type ScenarioType =
  | 'NEW_TERRITORY'
  | 'RECOVERY'
  | 'MINOR_GAP'
  | 'AHEAD_OF_PACE'
export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface CalculatedMetrics {
  revenueGap: number
  jobsNeeded: number
  dailyTargetPerTech: number
  dailyTeamJobs: number
  currentJobsPerTech: number
  throughputIncreasePercent: number
  forecastRevenue: number
  riskLevel: RiskLevel
  scenarioType: ScenarioType
}

export interface BriefingResponse {
  leadership: string
  technician: string
}
