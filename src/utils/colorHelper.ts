const hex2rgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [255, 255, 255]
}

const componentToHex = (component: number): string => {
  const hex = component.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

const rgb2hex = (r: number, g: number, b: number): string => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export const lighten = (hex: string, amount = 80): string => {
  const rgb = hex2rgb(hex)
  const [r, g, b] = rgb
  const [r2, g2, b2] = [r, g, b].map(c => Math.min(255, c + amount))
  return rgb2hex(r2, g2, b2)
}

export const darken = (hex: string, amount: number): string => {
  const rgb = hex2rgb(hex)
  const [r, g, b] = rgb
  const [r2, g2, b2] = [r, g, b].map(c => Math.max(0, c - amount))
  return rgb2hex(r2, g2, b2)
}

/* https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex */
export function hsl2hex(h: number, s: number, l: number) {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function getPseudoRandomColor(index: number): string {
  const MAX_HSL_DEGREES = 360
  const DEGREE_STEP = 120
  const INITIAL_DEGREE = 250
  const SHIFT = 45

  const h = (INITIAL_DEGREE + index * DEGREE_STEP - index * SHIFT) % MAX_HSL_DEGREES
  const s = 70
  const l = 70

  return hsl2hex(h, s, l)
}
