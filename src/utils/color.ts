export function hexToHsl(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '')

  // Parse the r, g, b values
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin
  let h = 0,
      s = 0,
      l = 0

  // Calculate hue
  if (delta === 0) h = 0
  else if (cmax === r) h = ((g - b) / delta) % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)
  if (h < 0) h += 360

  // Calculate lightness
  l = (cmax + cmin) / 2

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  // Multiply by 100 for percentage and round
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return `${h} ${s}% ${l}%`
}
