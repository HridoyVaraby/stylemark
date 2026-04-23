import { describe, it, expect } from 'vitest'
import { generateMarkdown } from './generateMarkdown'
import type { ThemeState } from '@/store/useThemeStore'

const mockState = {
  meta: {
    projectName: 'Test Project',
    baseTheme: 'light' as const,
  },
  lightColors: {
    background: '#ffffff',
    foreground: '#020817',
    card: '#ffffff',
    cardForeground: '#020817',
    popover: '#ffffff',
    popoverForeground: '#020817',
    primary: '#0f172a',
    primaryForeground: '#f8fafc',
    secondary: '#f1f5f9',
    secondaryForeground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0f172a',
    success: '#22c55e',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff',
  },
  darkColors: {
    background: '#020817',
    foreground: '#f8fafc',
    card: '#020817',
    cardForeground: '#f8fafc',
    popover: '#020817',
    popoverForeground: '#f8fafc',
    primary: '#f8fafc',
    primaryForeground: '#0f172a',
    secondary: '#1e293b',
    secondaryForeground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    accent: '#1e293b',
    accentForeground: '#f8fafc',
    destructive: '#7f1d1d',
    destructiveForeground: '#f8fafc',
    border: '#1e293b',
    input: '#1e293b',
    ring: '#cbd5e1',
    success: '#15803d',
    successForeground: '#ffffff',
    warning: '#b45309',
    warningForeground: '#ffffff',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Roboto',
    baseSize: 1,
    letterSpacing: 0,
    lineHeight: 1.5,
  },
  geometry: {
    radius: '0.5rem',
    borderThickness: 1,
  },
  effects: {
    shadowDepth: 'elevated' as const,
    transitionEasing: 'ease-out' as const,
  },
} as ThemeState

describe('generateMarkdown', () => {
  it('should generate markdown string containing project name', () => {
    const result = generateMarkdown(mockState)
    expect(result).toContain('# Product Requirements & Design System: Test Project')
  })

  it('should generate css variables for light theme', () => {
    const result = generateMarkdown(mockState)
    // #ffffff -> 0 0% 100%
    expect(result).toContain('--background: 0 0% 100%;')
    // #0f172a -> 222 47.4% 11.2%
    expect(result).toContain('--primary: 222 47.4% 11.2%;')
  })

  it('should generate fonts url correctly', () => {
    const result = generateMarkdown(mockState)
    expect(result).toContain('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto:wght@400;500&display=swap')
  })

  it('should handle shadowDepth: flat', () => {
    const flatState = {
      ...mockState,
      effects: {
        ...mockState.effects,
        shadowDepth: 'flat' as const,
      }
    } as ThemeState
    const result = generateMarkdown(flatState)
    expect(result).toContain('Use minimal or no shadows.')
  })

  it('should handle shadowDepth: elevated', () => {
    const result = generateMarkdown(mockState)
    expect(result).toContain('Apply shadow-md to elevated components like cards and dropdowns.')
  })

  it('should handle shadowDepth: floating', () => {
    const floatingState = {
      ...mockState,
      effects: {
        ...mockState.effects,
        shadowDepth: 'floating' as const,
      }
    } as ThemeState
    const result = generateMarkdown(floatingState)
    expect(result).toContain('Apply shadow-xl to all interactive floating elements.')
  })

  it('should generate tailwind config mappings correctly', () => {
    const result = generateMarkdown(mockState)
    expect(result).toContain('"borderWidth": {\n        "DEFAULT": "1px"\n      }')
    expect(result).toContain('"borderRadius": {\n        "DEFAULT": "var(--radius)"\n      }')
  })
})
