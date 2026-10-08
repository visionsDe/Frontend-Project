export const ensurePrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str : `${prefix}${str}`)
export const withoutSuffix = (str: string, suffix: string) =>
  str.endsWith(suffix) ? str.slice(0, -suffix.length) : str
export const withoutPrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str.slice(prefix.length) : str)

/**
 * Admin display rule: "First Last — Company Name" when company_name is set,
 * otherwise just "First Last". Any of the inputs can be null/undefined.
 */
export const displayNameWithCompany = (
  name?: string | null,
  companyName?: string | null,
) => {
  const trimmedName = (name ?? '').trim()
  const trimmedCompany = (companyName ?? '').trim()
  if (trimmedName && trimmedCompany) return `${trimmedName} — ${trimmedCompany}`
  return trimmedName || trimmedCompany
}
