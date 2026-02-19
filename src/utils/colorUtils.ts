const parseHexComponent = (hex: string): number => {
  if (hex.length === 1) {
    const doubled = hex + hex
    return parseInt(doubled, 16)
  }
  return parseInt(hex, 16)
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const normalized = hex.trim().replace('#', '')

  if (normalized.length === 3) {
    const r = parseHexComponent(normalized[0])
    const g = parseHexComponent(normalized[1])
    const b = parseHexComponent(normalized[2])
    return { r, g, b }
  }

  if (normalized.length === 6) {
    const r = parseHexComponent(normalized.slice(0, 2))
    const g = parseHexComponent(normalized.slice(2, 4))
    const b = parseHexComponent(normalized.slice(4, 6))
    return { r, g, b }
  }

  return null
}

const channelToLinear = (channel: number): number => {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export const getContrastingTextColor = (backgroundHex: string): string => {
  const rgb = hexToRgb(backgroundHex)
  if (!rgb) {
    return '#f9fafb'
  }

  const r = channelToLinear(rgb.r)
  const g = channelToLinear(rgb.g)
  const b = channelToLinear(rgb.b)

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance > 0.5 ? '#020617' : '#f9fafb'
}

