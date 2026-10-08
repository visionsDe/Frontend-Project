import axiosInstance from '@/utils/axiosInstance'
import { environment } from '@/environments/environment'
import type { ApiEnvelope } from '@/types/api'

import type { AiUsageDailyPoint, AiUsageRollupRow } from '@/views/ai-usage/types'

export async function fetchAiUsageDaily(opts: {
  from_date: string
  to_date: string
}): Promise<AiUsageDailyPoint[]> {
  const params = new URLSearchParams(opts)
  const res = await axiosInstance.get<ApiEnvelope<AiUsageDailyPoint[]>>(
    `${environment.aiUsageDaily}?${params.toString()}`,
  )
  return res.data.data
}

export async function fetchAiUsageByFeature(opts: {
  from_date: string
  to_date: string
}): Promise<AiUsageRollupRow[]> {
  const params = new URLSearchParams(opts)
  const res = await axiosInstance.get<ApiEnvelope<AiUsageRollupRow[]>>(
    `${environment.aiUsageByFeature}?${params.toString()}`,
  )
  return res.data.data
}
