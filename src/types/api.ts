/**
 * API primitives.
 *
 * Every endpoint on the paired backend wraps its response in a standard
 * envelope. Keeping that envelope as a generic lets each feature declare
 * only its payload shape and still read `data` with full narrowing.
 */
export type ApiEnvelope<T> = {
  data: T
  status: boolean
  statusCode: number
  message: string
}

export type Paginated<T> = {
  total: number
  page: number
  per_page: number
  data: T[]
}

export type Money = string // decimal string, e.g. "123.45"

export type Currency = {
  code: string
  symbol: string
}
