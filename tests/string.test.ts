import { describe, expect, it } from 'vitest'

import { displayNameWithCompany, formatMoney } from '@/utils/string'

describe('displayNameWithCompany', () => {
  it('joins both halves with an em dash', () => {
    expect(displayNameWithCompany('Alice', 'Acme')).toBe('Alice — Acme')
  })

  it('falls back to whichever half is present', () => {
    expect(displayNameWithCompany('Alice', '')).toBe('Alice')
    expect(displayNameWithCompany(null, 'Acme')).toBe('Acme')
  })

  it('returns an empty string when both are empty', () => {
    expect(displayNameWithCompany(null, null)).toBe('')
    expect(displayNameWithCompany('  ', '')).toBe('')
  })
})

describe('formatMoney', () => {
  it('prefixes the currency symbol when present', () => {
    expect(formatMoney('100.00', 'BRL')).toBe('BRL 100.00')
  })

  it('shows a dash for null / empty values', () => {
    expect(formatMoney(null)).toBe('—')
    expect(formatMoney('')).toBe('—')
  })
})
