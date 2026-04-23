import type { ThemeState } from '@/store/useThemeStore'
import { hexToHsl } from './color'
import { sanitizeInput } from './sanitize'

export function generateCss(state: ThemeState): string {
  const { lightColors, darkColors, geometry } = state

  const rootVars = `  --background: ${hexToHsl(lightColors.background)};
  --foreground: ${hexToHsl(lightColors.foreground)};
  --card: ${hexToHsl(lightColors.card)};
  --card-foreground: ${hexToHsl(lightColors.cardForeground)};
  --popover: ${hexToHsl(lightColors.popover)};
  --popover-foreground: ${hexToHsl(lightColors.popoverForeground)};
  --primary: ${hexToHsl(lightColors.primary)};
  --primary-foreground: ${hexToHsl(lightColors.primaryForeground)};
  --secondary: ${hexToHsl(lightColors.secondary)};
  --secondary-foreground: ${hexToHsl(lightColors.secondaryForeground)};
  --muted: ${hexToHsl(lightColors.muted)};
  --muted-foreground: ${hexToHsl(lightColors.mutedForeground)};
  --accent: ${hexToHsl(lightColors.accent)};
  --accent-foreground: ${hexToHsl(lightColors.accentForeground)};
  --destructive: ${hexToHsl(lightColors.destructive)};
  --destructive-foreground: ${hexToHsl(lightColors.destructiveForeground)};
  --border: ${hexToHsl(lightColors.border)};
  --input: ${hexToHsl(lightColors.input)};
  --ring: ${hexToHsl(lightColors.ring)};
  --radius: ${sanitizeInput(geometry.radius)};`

  const darkVars = `  --background: ${hexToHsl(darkColors.background)};
  --foreground: ${hexToHsl(darkColors.foreground)};
  --card: ${hexToHsl(darkColors.card)};
  --card-foreground: ${hexToHsl(darkColors.cardForeground)};
  --popover: ${hexToHsl(darkColors.popover)};
  --popover-foreground: ${hexToHsl(darkColors.popoverForeground)};
  --primary: ${hexToHsl(darkColors.primary)};
  --primary-foreground: ${hexToHsl(darkColors.primaryForeground)};
  --secondary: ${hexToHsl(darkColors.secondary)};
  --secondary-foreground: ${hexToHsl(darkColors.secondaryForeground)};
  --muted: ${hexToHsl(darkColors.muted)};
  --muted-foreground: ${hexToHsl(darkColors.mutedForeground)};
  --accent: ${hexToHsl(darkColors.accent)};
  --accent-foreground: ${hexToHsl(darkColors.accentForeground)};
  --destructive: ${hexToHsl(darkColors.destructive)};
  --destructive-foreground: ${hexToHsl(darkColors.destructiveForeground)};
  --border: ${hexToHsl(darkColors.border)};
  --input: ${hexToHsl(darkColors.input)};
  --ring: ${hexToHsl(darkColors.ring)};`

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
${rootVars}
  }

  .dark {
${darkVars}
  }
}
`
}
