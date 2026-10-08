import axiosInstance from '@/utils/axiosInstance'
import { environment } from '@/environments/environment'
import type { ApiEnvelope, Paginated } from '@/types/api'

import type { CurrencyRollup, HeldFundRow } from '@/views/payments/types'

/**
 * Thin data-layer wrappers for the payments admin endpoints.
 *
 * The services module is the one place where axios URLs show up — views
 * import these functions by name and get a typed Promise back. Keeps
 * endpoint changes isolated to the environment catalogue + this file.
 */

export type HeldFundsQuery = {
  page: number
  limit: number
  includeBlocked: boolean
  search?: string
}

export async function fetchHeldFunds(query: HeldFundsQuery): Promise<Paginated<HeldFundRow>> {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
    include_blocked: String(query.includeBlocked),
  })
  if (query.search) params.set('search', query.search)
  const res = await axiosInstance.get<ApiEnvelope<Paginated<HeldFundRow>>>(
    `${environment.heldFunds}?${params.toString()}`,
  )
  return res.data.data
}

export async function fetchTransactionsSummary(filter?: {
  from_date?: string
  to_date?: string
  country_id?: number
}): Promise<CurrencyRollup[]> {
  const params = new URLSearchParams()
  if (filter?.from_date) params.set('from_date', filter.from_date)
  if (filter?.to_date) params.set('to_date', filter.to_date)
  if (filter?.country_id) params.set('country_id', String(filter.country_id))
  const url = params.toString()
    ? `${environment.transactionsSummary}?${params.toString()}`
    : environment.transactionsSummary
  const res = await axiosInstance.get<ApiEnvelope<{ by_currency: CurrencyRollup[] }>>(url)
  return res.data.data.by_currency
}
