export function humanReadable(number: number | string): string {
  number = Number(number)

  if (number > 1e6) {
    return (number / 1e6).toFixed(1) + 'M'
  }
  const [integer, fractional] = String(number).split('.')
  const thousands = integer.length > 3 ? integer.slice(0, integer.length - 3) : null
  const smallValue = String(number - Number(thousands) * 1e3).padStart(3, '0')
  return `${thousands ? thousands + ',' : ''}${smallValue}${fractional ? '.' + fractional : ''}`
}
