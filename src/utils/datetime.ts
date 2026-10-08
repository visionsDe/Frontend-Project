import { format as fnsFormat } from 'date-fns'

export const parseServerDate = (raw?: string | null): Date | null => {
  if (!raw) return null

  const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(raw)
  const d = new Date(hasTz ? raw : `${raw}Z`)

  return Number.isNaN(d.getTime()) ? null : d
}

export const formatServerDate = (raw?: string | null, pattern = 'MMM dd, yyyy, hh:mm a'): string => {
  const d = parseServerDate(raw)

  return d ? fnsFormat(d, pattern) : ''
}
