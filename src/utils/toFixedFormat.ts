export function toFixedFormat<T>(number: T, digits = 4): T | string {
  if (typeof number !== 'number') return number

  return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: digits }).format(number)
}
