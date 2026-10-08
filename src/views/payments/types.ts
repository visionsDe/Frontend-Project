export type TransferStatus =
  | 'pending'
  | 'held'
  | 'released'
  | 'blocked'
  | 'refunded'
  | 'failed'

export type HeldFundRow = {
  booking_id: number
  order_number: string | null
  customer_name: string | null
  customer_company_name?: string | null
  supplier_name: string | null
  supplier_company_name?: string | null
  amount: number
  refunded_amount: number
  currency_code: string | null
  transfer_status: TransferStatus
  review_window_ends_at: string | null
  captured_at: string | null
  booking_status: string | null
}

export type CurrencyRollup = {
  currency_code: string
  currency_symbol: string | null
  transactions_count: number
  gross_payments: string | null
  stripe_fees: string | null
  participation_fees: string | null
  refunded_amount: string | null
  net_to_suppliers: string | null
}
