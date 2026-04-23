import type { ThemeState } from '../store/useThemeStore'

export type VibeType = 'luxury' | 'saas' | 'playful';

export const getVibePreset = (
  vibe: VibeType,
  projectName: string,
  currentLightColors: ThemeState['lightColors'],
  currentDarkColors: ThemeState['darkColors']
): Parameters<ThemeState['applyPreset']>[0] => {
  switch (vibe) {
    case 'luxury':
      return {
        meta: { baseTheme: 'dark', projectName },
        lightColors: { ...currentLightColors, primary: '#d4af37', secondary: '#1f1f1f', accent: '#a67c00', background: '#0a0a0a', foreground: '#f5f5f5', destructive: '#8b0000' },
        darkColors: { ...currentDarkColors, primary: '#d4af37', secondary: '#1f1f1f', accent: '#a67c00', background: '#0a0a0a', foreground: '#f5f5f5', destructive: '#8b0000' },
        typography: { headingFont: 'Playfair Display', bodyFont: 'Lato', baseSize: 1, letterSpacing: 0, lineHeight: 1.5 },
        geometry: { radius: '0rem', borderThickness: 1 },
        effects: { shadowDepth: 'flat', transitionEasing: 'ease-in-out' }
      };
    case 'saas':
      return {
        meta: { baseTheme: 'light', projectName },
        lightColors: { ...currentLightColors, primary: '#2563eb', secondary: '#f1f5f9', accent: '#3b82f6', background: '#ffffff', foreground: '#0f172a', destructive: '#ef4444' },
        darkColors: { ...currentDarkColors, primary: '#3b82f6', secondary: '#1e293b', accent: '#2563eb', background: '#020817', foreground: '#f8fafc', destructive: '#ef4444' },
        typography: { headingFont: 'Inter', bodyFont: 'Inter', baseSize: 1, letterSpacing: 0, lineHeight: 1.5 },
        geometry: { radius: '0.375rem', borderThickness: 1 },
        effects: { shadowDepth: 'elevated', transitionEasing: 'ease-out' }
      };
    case 'playful':
      return {
        meta: { baseTheme: 'light', projectName },
        lightColors: { ...currentLightColors, primary: '#ec4899', secondary: '#fdf2f8', accent: '#8b5cf6', background: '#ffffff', foreground: '#111827', destructive: '#ef4444' },
        darkColors: { ...currentDarkColors, primary: '#f472b6', secondary: '#4c1d95', accent: '#a78bfa', background: '#030712', foreground: '#f9fafb', destructive: '#ef4444' },
        typography: { headingFont: 'Poppins', bodyFont: 'Poppins', baseSize: 1.125, letterSpacing: 0, lineHeight: 1.5 },
        geometry: { radius: '9999px', borderThickness: 2 },
        effects: { shadowDepth: 'floating', transitionEasing: 'spring' }
      };
  }
};
