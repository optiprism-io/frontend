export function humanReadable(number: number | string): string {
  return new Intl.NumberFormat('en').format(Number(number))
}
