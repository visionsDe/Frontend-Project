export const AI_USAGE_FEATURES = ['moderation', 'other'] as const

export type AiUsageFeature = (typeof AI_USAGE_FEATURES)[number]

export type AiUsageRollupRow = {
  feature: AiUsageFeature
  model: string
  request_count: number
  error_count: number
  spend_cents: number
  avg_latency_ms: number | null
}

export type AiUsageDailyPoint = {
  day: string // YYYY-MM-DD
  spend_cents: number
  request_count: number
}
