# StyleMark Improvement Plan

This document outlines a strategic, step-by-step roadmap to elevate StyleMark from a functional prototype to a robust, production-ready design system configurator.

## Phase 1: Architecture & Correctness Fixes
*Current limitation: The application injects inline CSS variables that overwrite Shadcn UI's native dark mode behavior, and lacks the full spectrum of Shadcn utility colors.*

1.  **Dual-Theme State Management (Light & Dark):** 
    *   Refactor `useThemeStore` to hold separate palettes for Light and Dark modes.
    *   Update the `PreviewDashboard` to inject the correct palette based on the active mode toggle, ensuring native Shadcn UI components render correctly in both modes.
2.  **Complete Shadcn Color Palette:**
    *   Expand the color configuration to include all necessary Shadcn variables: `card`, `popover`, `muted`, `border`, `input`, and `ring`.
    *   Implement smart auto-generation for foreground colors (e.g., `primary-foreground`, `destructive-foreground`) based on background luminance to ensure text readability without manual user configuration.

## Phase 2: Enhanced Preview Capabilities
*Current limitation: The preview dashboard only shows a limited subset of components and typography.*

1.  **Component Kitchen Sink Expansion:**
    *   Add a comprehensive set of Shadcn components to the "Components" tab, including: Accordions, Dialogs/Modals, Badges, Alerts, Dropdown Menus, and Form validation states.
2.  **Typography Hierarchy Preview:**
    *   Create a dedicated "Typography" tab in the preview pane demonstrating the full typographic scale (H1, H2, H3, H4, p, blockquote, inline-code, list).
3.  **Real Layout Contexts:**
    *   Add varied layout examples (e.g., an Authentication form layout, a Settings page layout) to test spacing and geometry tokens in different contexts.

## Phase 3: Advanced Configuration & UX Features
*Current limitation: Basic native color pickers and lack of accessibility constraints.*

1.  **Professional Color Picker:**
    *   Replace the native HTML `<input type="color">` with a sophisticated color picker library (e.g., `react-colorful`).
    *   Support multiple color formats (HEX, HSL, RGB) natively in the UI.
2.  **Accessibility (a11y) Contrast Checker:**
    *   Implement real-time contrast ratio calculations (WCAG AA/AAA standards).
    *   Display visual warnings in the Control Center if paired colors (e.g., `primary` and `primary-foreground`) lack sufficient contrast.
3.  **Advanced Typography Controls:**
    *   Add sliders for `letter-spacing` (tracking) and `line-height` (leading) to give finer control over the typographic aesthetic.
4.  **Control Center UX:**
    *   Implement an Accordion-based layout for the Control Center to group settings logically and reduce vertical scrolling fatigue.

## Phase 4: Export Engine Upgrades
*Current limitation: Exports only a Markdown prompt.*

1.  **Direct File Exports:**
    *   Allow users to download a ready-to-use `globals.css` (or `index.css`) containing the exact `:root` and `.dark` variable blocks.
    *   Allow users to download the corresponding `tailwind.config.js` theme extend block.
2.  **Tailwind v4 Compatibility:**
    *   Include an export option specifically formatted for Tailwind CSS v4's new CSS-first configuration approach.
3.  **W3C Design Tokens Format:**
    *   Export the configuration as a strict JSON file adhering to the W3C Design Tokens Community Group format, enabling direct import into Figma (via plugins like Tokens Studio) and other design tools.

## Implementation Strategy
Each phase should be tackled sequentially. Phase 1 is critical for the visual accuracy of the generated system. Phase 2 and 3 improve the user experience and testing capabilities, while Phase 4 maximizes the utility of the exported artifacts for developers and designers.
