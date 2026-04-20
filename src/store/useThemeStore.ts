import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeType = 'light' | 'dark' | 'system'
export type ShadowDepth = 'flat' | 'elevated' | 'floating'
export type TransitionEasing = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring'

export interface ThemeState {
  meta: {
    projectName: string
    baseTheme: ThemeType
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    success: string
    warning: string
    destructive: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    baseSize: number // in rem
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
  setColors: (colors: Partial<ThemeState['colors']>) => void
  setTypography: (typography: Partial<ThemeState['typography']>) => void
  setGeometry: (geometry: Partial<ThemeState['geometry']>) => void
  setEffects: (effects: Partial<ThemeState['effects']>) => void
  applyPreset: (preset: Omit<ThemeState, 'setMeta' | 'setColors' | 'setTypography' | 'setGeometry' | 'setEffects' | 'applyPreset' | 'loadState'>) => void
  loadState: (state: Omit<ThemeState, 'setMeta' | 'setColors' | 'setTypography' | 'setGeometry' | 'setEffects' | 'applyPreset' | 'loadState'>) => void
}

const defaultState: Omit<ThemeState, 'setMeta' | 'setColors' | 'setTypography' | 'setGeometry' | 'setEffects' | 'applyPreset' | 'loadState'> = {
  meta: {
    projectName: 'Untitled Project',
    baseTheme: 'light',
  },
  colors: {
    primary: '#0f172a',
    secondary: '#f1f5f9',
    accent: '#3b82f6',
    background: '#ffffff',
    foreground: '#020817',
    success: '#22c55e',
    warning: '#f59e0b',
    destructive: '#ef4444',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 1,
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
      setColors: (colors) => set((state) => ({ colors: { ...state.colors, ...colors } })),
      setTypography: (typography) => set((state) => ({ typography: { ...state.typography, ...typography } })),
      setGeometry: (geometry) => set((state) => ({ geometry: { ...state.geometry, ...geometry } })),
      setEffects: (effects) => set((state) => ({ effects: { ...state.effects, ...effects } })),
      applyPreset: (preset) => set((state) => ({ ...state, ...preset, meta: { ...preset.meta, projectName: state.meta.projectName } })),
      loadState: (newState) => set(() => ({ ...newState })),
    }),
    {
      name: 'stylemark-storage',
    }
  )
)
