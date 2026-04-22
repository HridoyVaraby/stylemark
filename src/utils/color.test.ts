import { describe, it, expect } from 'vitest'
import { hexToHsl } from './color'

describe('hexToHsl', () => {
  it('converts black correctly', () => {
    expect(hexToHsl('#000000')).toBe('0 0% 0%')
  })

  it('converts white correctly', () => {
    expect(hexToHsl('#ffffff')).toBe('0 0% 100%')
  })

  it('converts red correctly', () => {
    expect(hexToHsl('#ff0000')).toBe('0 100% 50%')
  })

  it('converts green correctly', () => {
    expect(hexToHsl('#00ff00')).toBe('120 100% 50%')
  })

  it('converts blue correctly', () => {
    expect(hexToHsl('#0000ff')).toBe('240 100% 50%')
  })

  it('handles hex without hash', () => {
    expect(hexToHsl('ff0000')).toBe('0 100% 50%')
  })

  it('handles arbitrary colors', () => {
    expect(hexToHsl('#ff0080')).toBe('330 100% 50%')
    expect(hexToHsl('#808080')).toBe('0 0% 50.2%')
  })

  it('handles empty string', () => {
    expect(hexToHsl('')).toBe('0 0% 0%')
  })
})
