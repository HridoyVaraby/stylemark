import { describe, it, expect } from 'vitest'
import { generateMarkdown } from './generateMarkdown'
import type { ThemeState } from '@/store/useThemeStore'

const mockState: ThemeState = {
  meta: {
    projectName: 'Test Project',
    baseTheme: 'light',
  },
  lightColors: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#ffffff',
    cardForeground: '#000000',
    popover: '#ffffff',
    popoverForeground: '#000000',
    primary: '#ff0000',
    primaryForeground: '#ffffff',
    secondary: '#00ff00',
    secondaryForeground: '#000000',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#0000ff',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#000000',
    success: '#22c55e',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff',
  },
  darkColors: {
    background: '#000000',
    foreground: '#ffffff',
    card: '#000000',
    cardForeground: '#ffffff',
    popover: '#000000',
    popoverForeground: '#ffffff',
    primary: '#ffffff',
    primaryForeground: '#000000',
    secondary: '#1e293b',
    secondaryForeground: '#ffffff',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    accent: '#1e293b',
    accentForeground: '#ffffff',
    destructive: '#7f1d1d',
    destructiveForeground: '#ffffff',
    border: '#1e293b',
    input: '#1e293b',
    ring: '#cbd5e1',
    success: '#15803d',
    successForeground: '#ffffff',
    warning: '#b45309',
    warningForeground: '#ffffff',
  },
  typography: {
    headingFont: 'Open Sans',
    bodyFont: 'Roboto Mono',
    baseSize: 1,
    letterSpacing: 0.05,
    lineHeight: 1.6,
  },
  geometry: {
    radius: '0.75rem',
    borderThickness: 2,
  },
  effects: {
    shadowDepth: 'floating',
    transitionEasing: 'ease-in-out',
  },
  // Actions (not used in generateMarkdown but required by ThemeState type)
  setMeta: () => {},
  setLightColors: () => {},
  setDarkColors: () => {},
  setTypography: () => {},
  setGeometry: () => {},
  setEffects: () => {},
  applyPreset: () => {},
  loadState: () => {},
}

describe('generateMarkdown', () => {
  it('should include the project name and base theme in the header', () => {
    const markdown = generateMarkdown(mockState)
    expect(markdown).toContain('# Product Requirements & Design System: Test Project')
    expect(markdown).toContain('**Project Name:** Test Project')
    expect(markdown).toContain('**Base Theme:** light')
  })

  it('should correctly convert hex colors to HSL in CSS variables', () => {
    const markdown = generateMarkdown(mockState)
    // #ffffff -> 0 0% 100%
    // #000000 -> 0 0% 0%
    // #ff0000 -> 0 100% 50%
    expect(markdown).toContain('--background: 0 0% 100%')
    expect(markdown).toContain('--foreground: 0 0% 0%')
    expect(markdown).toContain('--primary: 0 100% 50%')

    // Dark mode
    expect(markdown).toContain('.dark {')
    expect(markdown).toContain('--background: 0 0% 0%')
    expect(markdown).toContain('--foreground: 0 0% 100%')
  })

  it('should correctly encode Google Fonts URL with + for spaces', () => {
    const markdown = generateMarkdown(mockState)
    expect(markdown).toContain('family=Open+Sans:wght@400;700')
    expect(markdown).toContain('family=Roboto+Mono:wght@400;500')
  })

  it('should correctly map Tailwind configuration values', () => {
    const markdown = generateMarkdown(mockState)
    expect(markdown).toContain('"borderWidth": {')
    expect(markdown).toContain('"DEFAULT": "2px"')
    expect(markdown).toContain('"borderRadius": {')
    expect(markdown).toContain('"DEFAULT": "var(--radius)"')
  })

  it('should render the correct shadow rule for "floating"', () => {
    const markdown = generateMarkdown(mockState)
    expect(markdown).toContain('Apply shadow-xl to all interactive floating elements.')
  })

  it('should render the correct shadow rule for "flat"', () => {
    const flatState = { ...mockState, effects: { ...mockState.effects, shadowDepth: 'flat' } }
    const markdown = generateMarkdown(flatState as ThemeState)
    expect(markdown).toContain('Use minimal or no shadows.')
  })

  it('should render the correct shadow rule for "elevated"', () => {
    const elevatedState = { ...mockState, effects: { ...mockState.effects, shadowDepth: 'elevated' } }
    const markdown = generateMarkdown(elevatedState as ThemeState)
    expect(markdown).toContain('Apply shadow-md to elevated components like cards and dropdowns.')
  })

  it('should include typography specifications', () => {
    const markdown = generateMarkdown(mockState)
    expect(markdown).toContain('**Heading Font:** Open Sans')
    expect(markdown).toContain('**Base Size:** 1rem')
    expect(markdown).toContain('**Letter Spacing:** 0.05em')
    expect(markdown).toContain('**Line Height:** 1.6')
  })

  it('should include effects and animation guidelines', () => {
    const markdown = generateMarkdown(mockState)
    expect(markdown).toContain('**Transitions:** Use `ease-in-out` for all state changes')
  })
})
