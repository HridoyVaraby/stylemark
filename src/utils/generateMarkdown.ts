import type { ThemeState } from '@/store/useThemeStore'

export function generateMarkdown(state: ThemeState): string {
  const { meta, colors, typography, geometry, effects } = state

  const rootVars = `  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --background: ${colors.background};
  --foreground: ${colors.foreground};
  --success: ${colors.success};
  --warning: ${colors.warning};
  --destructive: ${colors.destructive};
  --radius: ${geometry.radius};`

  const fontsUrl = `https://fonts.googleapis.com/css2?family=${typography.headingFont.replace(/ /g, '+')}:wght@400;700&family=${typography.bodyFont.replace(/ /g, '+')}:wght@400;500&display=swap`

  let shadowRule = ''
  if (effects.shadowDepth === 'flat') {
    shadowRule = 'Use minimal or no shadows.'
  } else if (effects.shadowDepth === 'elevated') {
    shadowRule = 'Apply shadow-md to elevated components like cards and dropdowns.'
  } else {
    shadowRule = 'Apply shadow-xl to all interactive floating elements.'
  }

  return `# Product Requirements & Design System: ${meta.projectName}

## 1. Project Meta & Agent Directives
**Project Name:** ${meta.projectName}
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
\`\`\`

## 3. Tailwind Configuration Map
Ensure your \`tailwind.config.js\` maps these variables properly. Example:

\`\`\`json
{
  "theme": {
    "extend": {
      "colors": {
        "primary": "var(--primary)",
        "secondary": "var(--secondary)",
        "accent": "var(--accent)",
        "background": "var(--background)",
        "foreground": "var(--foreground)",
        "success": "var(--success)",
        "warning": "var(--warning)",
        "destructive": "var(--destructive)"
      },
      "borderRadius": {
        "DEFAULT": "var(--radius)"
      },
      "borderWidth": {
        "DEFAULT": "${geometry.borderThickness}px"
      }
    }
  }
}
\`\`\`

## 4. Typography Specifications
**Heading Font:** ${typography.headingFont}
**Body Font:** ${typography.bodyFont}
**Base Size:** ${typography.baseSize}rem

**Include the following Google Fonts link in your \`index.html\`:**
\`\`\`html
<link href="${fontsUrl}" rel="stylesheet">
\`\`\`

**Hierarchical Instructions:**
- Body text should use \`${typography.bodyFont}\` at \`${typography.baseSize}rem\`.
- Headings (h1-h6) should use \`${typography.headingFont}\` with appropriate scaling.

## 5. Component Guidelines
**Geometry:**
- Use \`${geometry.radius}\` border-radius for all primary UI elements (buttons, cards, inputs).
- Border thickness is set globally to \`${geometry.borderThickness}px\`.

**Effects & Animation:**
- **Shadows:** ${shadowRule}
- **Transitions:** Use \`${effects.transitionEasing}\` for all state changes (hover, focus, active).
`
}