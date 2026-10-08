import { describe, expect, it } from 'vitest'

import { centsToDollars, errorRatePct, formatLatency, localDateToUtcDate } from '@/utils/formatters'

describe('centsToDollars', () => {
  it('shows four decimals under $1 so sub-cent costs do not round to $0.00', () => {
    expect(centsToDollars(0.3)).toBe('$0.0030')
  })

  it('shows two decimals at or above $1', () => {
    expect(centsToDollars(1500)).toBe('$15.00')
  })

  it('returns dash for null / undefined', () => {
    expect(centsToDollars(null)).toBe('—')
    expect(centsToDollars(undefined)).toBe('—')
  })

  it('shows $0.00 exactly when the input is 0', () => {
    expect(centsToDollars(0)).toBe('$0.00')
  })
})

describe('formatLatency', () => {
  it('rounds and appends ms', () => {
    expect(formatLatency(42.6)).toBe('43 ms')
  })

  it('returns a dash for null / undefined', () => {
    expect(formatLatency(null)).toBe('—')
    expect(formatLatency(undefined)).toBe('—')
  })
})

describe('errorRatePct', () => {
  it('returns 0% when there are no requests, not NaN', () => {
    expect(errorRatePct(0, 0)).toBe('0%')
  })

  it('computes a percentage with one decimal place', () => {
    expect(errorRatePct(1000, 7)).toBe('0.7%')
  })
})

describe('localDateToUtcDate', () => {
  it('returns the input when it cannot be parsed', () => {
    expect(localDateToUtcDate('not-a-date')).toBe('not-a-date')
  })

  it('returns an empty string for empty input', () => {
    expect(localDateToUtcDate('')).toBe('')
  })
})
