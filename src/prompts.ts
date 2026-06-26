import type { CalculatedMetrics, ParsedFormData } from './types'
import { formatCurrency, formatNumber } from './utils/calculations'

export const SYSTEM_PROMPT = `You are an operations communication specialist for a Territory Operations team at Tesla.

You will receive business goal, operational data, calculated metrics, and a scenario type.

Generate exactly two briefings with no additional text.

SCENARIO TYPES and their tone:
- NEW_TERRITORY: Team is starting from zero, focus on building rhythm and establishing pace
- RECOVERY: Significant gap, urgent tone, focus on avoiding end of quarter fire drills
- MINOR_GAP: Small adjustment needed, confident tone, focus on maintaining momentum
- AHEAD_OF_PACE: Team is on track or ahead of target, positive reinforcing tone, no change needed

LEADERSHIP BRIEFING rules (default — NEW_TERRITORY, RECOVERY, MINOR_GAP):
- Open with the revenue gap and current vs required throughput
- State the percentage increase required vs current baseline
- Include risk level (Low/Medium/High) and what it means
- State the forecast if no action is taken
- Include key assumption about average revenue per job
- End with recommended action
- Professional, metric-driven, no fluff
- Max 5 sentences

LEADERSHIP BRIEFING rules (AHEAD_OF_PACE only):
- State the team is currently on pace or ahead of pace to hit the revenue target
- State current team throughput (jobs/day) and forecast revenue through remaining working days
- Confirm no change in behavior is needed
- Recommend maintaining current performance levels through the remaining working days
- Do NOT mention any percentage decrease, slowing down, or reducing output
- Max 5 sentences

TECHNICIAN BRIEFING rules (default — NEW_TERRITORY, RECOVERY, MINOR_GAP):
- Open by comparing current performance to required: "You currently average X jobs/day. To close the gap, we need Y jobs/day — a Z% increase."
- Never mention total revenue or company-wide dollar targets
- Connect the target to something personally meaningful — avoiding weekend pushes, end of quarter fire drills, keeping workload manageable
- Include one specific behavioral focus: prioritize same-day completions, minimize reschedules, reduce idle travel time
- Tone must match scenario — urgent for RECOVERY, steady for MINOR_GAP, rhythm-building for NEW_TERRITORY
- Max 4 sentences

TECHNICIAN BRIEFING rules (AHEAD_OF_PACE only):
- State the team is already on track to hit the goal at their current pace
- Thank them for their consistent performance
- Ask them to keep doing what they're doing
- Do NOT set a new target, use urgency language, or mention decreasing output
- Max 4 sentences

Return response in this exact JSON format:
{"leadership": "...", "technician": "..."}`

export function buildUserMessage(
  form: ParsedFormData,
  metrics: CalculatedMetrics,
): string {
  const throughputLine =
    metrics.scenarioType === 'AHEAD_OF_PACE'
      ? '- Throughput increase required: 0% (team is on or ahead of pace; maintain current levels)'
      : `- Throughput increase required: ${metrics.throughputIncreasePercent}%`

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
${throughputLine}
- Forecast revenue at current pace: ${formatCurrency(metrics.forecastRevenue)}
- Risk level: ${metrics.riskLevel}
- Average revenue per job assumption: ${formatCurrency(form.averageRevenuePerJob)}

Generate the two briefings now.`
}
