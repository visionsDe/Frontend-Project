/**
 * Formatters shared across the AI usage views.
 *
 * `spend_cents` is a DECIMAL from the API — individual calls are often
 * sub-cent, so we show 4 decimal places under $1 and the standard 2
 * elsewhere. A real cost should never round down to $0.00 in the UI.
 */
export function centsToDollars(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return '—'
  const dollars = cents / 100
  if (dollars === 0) return '$0.00'
  return dollars < 1 ? `$${dollars.toFixed(4)}` : `$${dollars.toFixed(2)}`
}

export function formatLatency(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return '—'
  return `${Math.round(ms)} ms`
}

export function errorRatePct(requestCount: number, errorCount: number): string {
  if (!requestCount) return '0%'
  return `${((errorCount / requestCount) * 100).toFixed(1)}%`
}

/**
 * The MUI date-picker emits local-date `YYYY-MM-DD`. The backend
 * interprets its date params as UTC. Translating here keeps "today" the
 * same thing on both sides for picker users whose timezone is not UTC.
 */
export function localDateToUtcDate(yyyymmdd: string): string {
  if (!yyyymmdd) return ''
  const d = new Date(`${yyyymmdd}T00:00:00`)
  if (Number.isNaN(d.getTime())) return yyyymmdd
  return d.toISOString().slice(0, 10)
}
