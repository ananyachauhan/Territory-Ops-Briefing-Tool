import type { CalculatedMetrics, ParsedFormData } from './types'
import { formatCurrency, formatNumber } from './utils/calculations'

export const SYSTEM_PROMPT = `You are an operations communication specialist for a Territory Operations team at Tesla.

You will receive business goal, operational data, calculated metrics, and a scenario type.

Generate exactly two briefings with no additional text.

SCENARIO TYPES and their tone:
- NEW_TERRITORY: Team is starting from zero, focus on building rhythm and establishing pace
- RECOVERY: Significant gap, urgent tone, focus on avoiding end of quarter fire drills
- MINOR_GAP: Small adjustment needed, confident tone, focus on maintaining momentum

LEADERSHIP BRIEFING rules:
- Open with the revenue gap and current vs required throughput
- State the percentage increase required vs current baseline
- Include risk level (Low/Medium/High) and what it means
- State the forecast if no action is taken
- Include key assumption about average revenue per job
- End with recommended action
- Professional, metric-driven, no fluff
- Max 5 sentences

TECHNICIAN BRIEFING rules:
- Open by comparing current performance to required: "You currently average X jobs/day. To close the gap, we need Y jobs/day — a Z% increase."
- Never mention total revenue or company-wide dollar targets
- Connect the target to something personally meaningful — avoiding weekend pushes, end of quarter fire drills, keeping workload manageable
- Include one specific behavioral focus: prioritize same-day completions, minimize reschedules, reduce idle travel time
- Tone must match scenario — urgent for RECOVERY, steady for MINOR_GAP, rhythm-building for NEW_TERRITORY
- Max 4 sentences

Return response in this exact JSON format:
{"leadership": "...", "technician": "..."}`

export function buildUserMessage(
  form: ParsedFormData,
  metrics: CalculatedMetrics,
): string {
  return `Business goal: ${form.businessGoal}

Scenario type: ${metrics.scenarioType}

Operational data:
- Revenue target: ${formatCurrency(form.revenueTarget)}
- Current revenue: ${formatCurrency(form.currentRevenue)}
- Revenue gap: ${formatCurrency(metrics.revenueGap)}
- Current jobs per day (team baseline): ${formatNumber(form.currentJobsPerDay)}
- Current jobs per day per technician: ${formatNumber(metrics.currentJobsPerTech, 1)}
- Total jobs needed to close gap: ${formatNumber(metrics.jobsNeeded)}
- Number of technicians: ${form.numberOfTechnicians}
- Working days remaining: ${form.workingDaysRemaining}
- Required daily jobs per technician: ${formatNumber(metrics.dailyTargetPerTech)}
- Required daily team jobs: ${formatNumber(metrics.dailyTeamJobs)}
- Throughput increase required: ${metrics.throughputIncreasePercent}%
- Forecast revenue if no action taken: ${formatCurrency(metrics.forecastRevenue)}
- Risk level: ${metrics.riskLevel}
- Average revenue per job assumption: ${formatCurrency(form.averageRevenuePerJob)}

Generate the two briefings now.`
}
