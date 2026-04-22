import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getContrastForeground } from '@/utils/color'

export type ThemeType = 'light' | 'dark' | 'system'
export type ShadowDepth = 'flat' | 'elevated' | 'floating'
export type TransitionEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring'

export interface ColorPalette {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
}

export interface ThemeState {
  meta: {
    projectName: string
    baseTheme: ThemeType
  }
  lightColors: ColorPalette
  darkColors: ColorPalette
  typography: {
    headingFont: string
    bodyFont: string
    baseSize: number // in rem
    letterSpacing: number // tracking, e.g. 0, -0.05, 0.1
    lineHeight: number // leading, e.g. 1.5
  }
  geometry: {
    radius: string // e.g. 0rem, 0.3rem, 0.5rem, 0.75rem, 1rem, 9999px
    borderThickness: number // in px
  }
  effects: {
    shadowDepth: ShadowDepth
    transitionEasing: TransitionEasing
  }
  
  // Actions
  setMeta: (meta: Partial<ThemeState['meta']>) => void
  setLightColors: (colors: Partial<ThemeState['lightColors']>) => void
  setDarkColors: (colors: Partial<ThemeState['darkColors']>) => void
  setTypography: (typography: Partial<ThemeState['typography']>) => void
  setGeometry: (geometry: Partial<ThemeState['geometry']>) => void
  setEffects: (effects: Partial<ThemeState['effects']>) => void
  applyPreset: (preset: Omit<ThemeState, 'setMeta' | 'setLightColors' | 'setDarkColors' | 'setTypography' | 'setGeometry' | 'setEffects' | 'applyPreset' | 'loadState'>) => void
  loadState: (state: Omit<ThemeState, 'setMeta' | 'setLightColors' | 'setDarkColors' | 'setTypography' | 'setGeometry' | 'setEffects' | 'applyPreset' | 'loadState'>) => void
}

const defaultLightColors: ColorPalette = {
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
}

const defaultDarkColors: ColorPalette = {
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
}

const defaultState: Omit<ThemeState, 'setMeta' | 'setLightColors' | 'setDarkColors' | 'setTypography' | 'setGeometry' | 'setEffects' | 'applyPreset' | 'loadState'> = {
  meta: {
    projectName: 'Untitled Project',
    baseTheme: 'light',
  },
  lightColors: defaultLightColors,
  darkColors: defaultDarkColors,
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 1,
    letterSpacing: 0,
    lineHeight: 1.5,
  },
  geometry: {
    radius: '0.5rem',
    borderThickness: 1,
  },
  effects: {
    shadowDepth: 'elevated',
    transitionEasing: 'ease-out',
  },
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...defaultState,
      setMeta: (meta) => set((state) => ({ meta: { ...state.meta, ...meta } })),
      setLightColors: (colors) => set((state) => {
        const newColors = { ...state.lightColors, ...colors }
        // Auto-generate foregrounds if a base color was updated
        for (const key in colors) {
          if (!key.endsWith('Foreground') && ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'card', 'popover'].includes(key)) {
            const fgKey = `${key}Foreground` as keyof ColorPalette
            newColors[fgKey] = getContrastForeground(newColors[key as keyof ColorPalette])
          } else if (key === 'background') {
            newColors.foreground = getContrastForeground(newColors.background)
          }
        }
        return { lightColors: newColors }
      }),
      setDarkColors: (colors) => set((state) => {
        const newColors = { ...state.darkColors, ...colors }
        for (const key in colors) {
          if (!key.endsWith('Foreground') && ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'card', 'popover'].includes(key)) {
            const fgKey = `${key}Foreground` as keyof ColorPalette
            newColors[fgKey] = getContrastForeground(newColors[key as keyof ColorPalette])
          } else if (key === 'background') {
            newColors.foreground = getContrastForeground(newColors.background)
          }
        }
        return { darkColors: newColors }
      }),
      setTypography: (typography) => set((state) => ({ typography: { ...state.typography, ...typography } })),
      setGeometry: (geometry) => set((state) => ({ geometry: { ...state.geometry, ...geometry } })),
      setEffects: (effects) => set((state) => ({ effects: { ...state.effects, ...effects } })),
      applyPreset: (preset) => set((state) => ({ ...state, ...preset, meta: { ...preset.meta, projectName: state.meta.projectName } })),
      loadState: (newState) => set(() => {
        // Migration logic for old state that only had 'colors'
        if (newState && typeof newState === 'object' && 'colors' in newState && !('lightColors' in newState)) {
          const oldColors = (newState as Record<string, unknown>).colors as Partial<ColorPalette>
          return {
            ...defaultState,
            ...(newState as Record<string, unknown>),
            lightColors: { ...defaultLightColors, ...oldColors },
            darkColors: defaultDarkColors,
          } as ThemeState
        }
        return { ...newState } as ThemeState
      }),
    }),
    {
      name: 'stylemark-storage',
    }
  )
)
