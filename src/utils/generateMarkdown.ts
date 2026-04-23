import type { ThemeState } from '@/store/useThemeStore'
import { hexToHsl } from './color'
import { sanitizeInput } from './sanitize'

export function generateMarkdown(state: ThemeState): string {
  const { meta, lightColors, darkColors, typography, geometry, effects } = state

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

  const fontsUrl = `https://fonts.googleapis.com/css2?family=${sanitizeInput(typography.headingFont).replace(/ /g, '+')}:wght@400;700&family=${sanitizeInput(typography.bodyFont).replace(/ /g, '+')}:wght@400;500&display=swap`

  let shadowRule = ''
  if (effects.shadowDepth === 'flat') {
    shadowRule = 'Use minimal or no shadows.'
  } else if (effects.shadowDepth === 'elevated') {
    shadowRule = 'Apply shadow-md to elevated components like cards and dropdowns.'
  } else {
    shadowRule = 'Apply shadow-xl to all interactive floating elements.'
  }

  return `# Product Requirements & Design System: ${sanitizeInput(meta.projectName)}

## 1. Project Meta & Agent Directives
**Project Name:** ${sanitizeInput(meta.projectName)}
**Base Theme:** ${meta.baseTheme}

**Strict Instruction Set:**
Initialize project using React, Vite, Tailwind CSS, Shadcn UI, and pnpm.
Do not deviate from the design tokens defined below.

## 2. Design Tokens (CSS Variables)
Apply these variables to your global \`:root\` (and optionally adjust for \`.dark\`):

\`\`\`css
:root {
${rootVars}
}

.dark {
${darkVars}
}
\`\`\`

## 3. Tailwind Configuration Map
Ensure your \`tailwind.config.js\` maps these variables properly. Example:

\`\`\`json
{
  "theme": {
    "extend": {
      "colors": {
        "primary": { "DEFAULT": "hsl(var(--primary))", "foreground": "hsl(var(--primary-foreground))" },
        "secondary": { "DEFAULT": "hsl(var(--secondary))", "foreground": "hsl(var(--secondary-foreground))" },
        "accent": { "DEFAULT": "hsl(var(--accent))", "foreground": "hsl(var(--accent-foreground))" },
        "background": "hsl(var(--background))",
        "foreground": "hsl(var(--foreground))",
        "card": { "DEFAULT": "hsl(var(--card))", "foreground": "hsl(var(--card-foreground))" },
        "popover": { "DEFAULT": "hsl(var(--popover))", "foreground": "hsl(var(--popover-foreground))" },
        "muted": { "DEFAULT": "hsl(var(--muted))", "foreground": "hsl(var(--muted-foreground))" },
        "destructive": { "DEFAULT": "hsl(var(--destructive))", "foreground": "hsl(var(--destructive-foreground))" },
        "border": "hsl(var(--border))",
        "input": "hsl(var(--input))",
        "ring": "hsl(var(--ring))"
      },
      "borderRadius": {
        "DEFAULT": "var(--radius)"
      },
      "borderWidth": {
        "DEFAULT": "${sanitizeInput(geometry.borderThickness)}px"
      }
    }
  }
}
\`\`\`

## 4. Typography Specifications
**Heading Font:** ${sanitizeInput(typography.headingFont)}
**Body Font:** ${sanitizeInput(typography.bodyFont)}
**Base Size:** ${sanitizeInput(typography.baseSize)}rem
**Letter Spacing:** ${sanitizeInput(typography.letterSpacing)}em
**Line Height:** ${sanitizeInput(typography.lineHeight)}

**Include the following Google Fonts link in your \`index.html\`:**
\`\`\`html
<link href="${fontsUrl}" rel="stylesheet">
\`\`\`

**Hierarchical Instructions:**
- Apply tracking of \`${sanitizeInput(typography.letterSpacing)}em\` and leading of \`${sanitizeInput(typography.lineHeight)}\` globally.
- Body text should use \`${sanitizeInput(typography.bodyFont)}\` at \`${sanitizeInput(typography.baseSize)}rem\`.
- Headings (h1-h6) should use \`${sanitizeInput(typography.headingFont)}\` with appropriate scaling.

## 5. Component Guidelines
**Geometry:**
- Use \`${sanitizeInput(geometry.radius)}\` border-radius for all primary UI elements (buttons, cards, inputs).
- Border thickness is set globally to \`${sanitizeInput(geometry.borderThickness)}px\`.

**Effects & Animation:**
- **Shadows:** ${shadowRule}
- **Transitions:** Use \`${effects.transitionEasing}\` for all state changes (hover, focus, active).
`
}
