import axiosInstance from '@/utils/axiosInstance'
import { environment } from '@/environments/environment'
import type { ApiEnvelope, Paginated } from '@/types/api'

import type {
  AppleOfferCodeRow,
  GenerateOfferCodeForm,
  WebhookEventRow,
} from '@/views/webhooks/types'

export async function fetchWebhookEvents(opts: {
  page: number
  limit: number
  provider?: 'apple' | 'google'
  outcome?: string
}): Promise<Paginated<WebhookEventRow>> {
  const params = new URLSearchParams({
    page: String(opts.page),
    limit: String(opts.limit),
  })
  if (opts.provider) params.set('provider', opts.provider)
  if (opts.outcome) params.set('outcome', opts.outcome)
  const res = await axiosInstance.get<ApiEnvelope<Paginated<WebhookEventRow>>>(
    `${environment.webhookEvents}?${params.toString()}`,
  )
  return res.data.data
}

export async function fetchAppleOfferCodes(opts: {
  activeOnly?: boolean
  search?: string
}): Promise<AppleOfferCodeRow[]> {
  const params = new URLSearchParams()
  if (opts.activeOnly) params.set('active_only', 'true')
  if (opts.search) params.set('search', opts.search)
  const url = params.toString()
    ? `${environment.appleOfferCodes}?${params.toString()}`
    : environment.appleOfferCodes
  const res = await axiosInstance.get<ApiEnvelope<{ data: AppleOfferCodeRow[] }>>(url)
  return res.data.data.data ?? []
}

export async function generateAppleOfferCode(form: GenerateOfferCodeForm): Promise<AppleOfferCodeRow> {
  const res = await axiosInstance.post<ApiEnvelope<AppleOfferCodeRow>>(
    environment.generateAppleOfferCode,
    form,
  )
  return res.data.data
}
