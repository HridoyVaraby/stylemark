export function hexToHsl(hex: string): string {
  if (!hex) return '0 0% 0%'
  if (!/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i.test(hex)) return '0 0% 0%'
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }

  // Parse the r, g, b values
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0

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

export function getLuminance(hex: string): number {
  if (!hex) return 0
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }

  const rgb = [
    parseInt(hex.substring(0, 2), 16) / 255,
    parseInt(hex.substring(2, 4), 16) / 255,
    parseInt(hex.substring(4, 6), 16) / 255
  ].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

export function getContrastForeground(bgHex: string): string {
  const luminance = getLuminance(bgHex)
  // Threshold for switching from dark text to light text.
  // Using ~0.179 as a standard split, adjust if needed.
  return luminance > 0.179 ? '#020817' : '#f8fafc' // More aesthetically pleasing than pure black/white
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1)
  const lum2 = getLuminance(hex2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}
