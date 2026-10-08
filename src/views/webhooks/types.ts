export type WebhookOutcome =
  | 'received'
  | 'processed'
  | 'duplicate'
  | 'signature_fail'
  | 'handler_error'
  | 'unmatched'

export type WebhookEventRow = {
  id: number
  provider: 'apple' | 'google'
  event_id: string
  event_type: string | null
  event_subtype: string | null
  outcome: WebhookOutcome
  signature_valid: boolean
  original_transaction_id: string | null
  purchase_token: string | null
  error_message: string | null
  created_at: string
  processed_at: string | null
}

export type AppleOfferCodeRow = {
  id: number
  product_id: string
  plan_tier: string
  plan_period: string
  code: string
  total_codes: number
  served_count: number
  confirmed_count: number
  codes_left: number
  expiration_date: string | null
  active: boolean
  created_at: string | null
}

export type GenerateOfferCodeForm = {
  product_id: string
  reference_name: string
  total_codes: number
  expiration_date: string
}
