# StyleMark Implementation Plan

Based on the provided Product Requirements Document (PRD), here is a detailed, actionable implementation plan to build StyleMark. The plan is broken down into sequential phases, ready for a developer or autonomous agent to execute.

## Phase 1: Foundation & State Architecture

**Goal:** Set up the project skeleton, tooling, and the core data model.

1.  **Project Initialization:**
    *   Ensure Node.js v22 is active.
    *   Initialize a new React project using Vite and TypeScript: `pnpm create vite stylemark --template react-ts`.
    *   Initialize Git repository.

2.  **Core Dependencies Setup:**
    *   Install Tailwind CSS, PostCSS, and Autoprefixer. Configure `tailwind.config.js` and `index.css`.
    *   Install `lucide-react` for iconography.
    *   Install `zustand` for state management.
    *   Set up path aliases (e.g., `@/` pointing to `src/`) in `vite.config.ts` and `tsconfig.json`.

3.  **Shadcn UI Integration:**
    *   Initialize Shadcn UI: `pnpm dlx shadcn-ui@latest init`.
    *   Install baseline components required for the UI (e.g., Button, Input, Slider, Select, Tabs, Card, Table).

4.  **Zustand Store Design (`src/store/useThemeStore.ts`):**
    *   Define the TypeScript interfaces for the design tokens:
        *   `Meta`: Project Name, Base Theme (Light/Dark).
        *   `Colors`: Primary, Secondary, Accent, Background, Foreground, Semantic (Success, Warning, Destructive).
        *   `Typography`: Heading Font, Body Font, Base Size (rem).
        *   `Geometry`: Border Radius (enum/value), Border Thickness.
        *   `Effects`: Shadow Depth, Transition Easing.
    *   Implement the Zustand store with `persist` middleware to automatically sync state with `localStorage`.
    *   Create actions to update individual properties and apply presets.

## Phase 2: Split-Pane UI Construction

**Goal:** Build the structural layout and the interactive components for both the control center and the live preview.

1.  **Main Layout (`src/App.tsx`):**
    *   Implement a responsive split-pane layout.
    *   Left pane: Fixed width or resizable sidebar.
    *   Right pane: Main content area taking up remaining space.

2.  **Left Pane: The Control Center (`src/components/ControlCenter`):**
    *   **Global Settings:** Input for Project Name, toggle for Light/Dark base theme.
    *   **Vibe Presets:** Buttons to quickly load predefined state configurations (Elegant Luxury, Minimalist SaaS, Playful).
    *   **Color System:** Integrate a color picker component (or use native `<input type="color">`) bound to Zustand store actions. Add logic to auto-generate shade scales (50-900) based on base hex values using a library like `chroma-js` or `colord`.
    *   **Typography:** Dropdowns populated with popular Google Fonts. Slider for base `rem` size.
    *   **Geometry & Effects:** Sliders for border-radius and thickness. Dropdowns/toggles for shadows and transitions.

3.  **Right Pane: Live Preview Dashboard (`src/components/PreviewDashboard`):**
    *   **Viewport Controls:** Buttons at the top to constrain the preview container width (Mobile: 375px, Tablet: 768px, Desktop: 100% / max-width).
    *   **Dashboard Shell:** Create a mock sidebar, top navigation bar, and main content area.
    *   **Content Modules:**
        *   Mock analytics cards (using basic shapes or simple charting libraries if needed).
        *   A mock Data Table to visualize borders and typography density.
    *   **Component Kitchen Sink:** A dedicated tab or section rendering isolated Shadcn UI components (Buttons, Inputs, Badges) in various states (default, hover, disabled) to preview token application.
    *   **Quick Mode Flip:** A floating action button (FAB) in the preview area to toggle the preview's local `dark` class.

## Phase 3: The Reactivity Engine & Portability

**Goal:** Connect the UI to the state and make the preview actually reflect the selected design tokens in real-time.

1.  **Dynamic CSS Variable Injection:**
    *   Create a component (e.g., `ThemeInjector`) or a hook that listens to the Zustand store.
    *   Map the Zustand state values to a string of CSS variables (e.g., `--primary: 222.2 47.4% 11.2%;`, `--radius: 0.5rem;`).
    *   Inject these variables into a `<style>` tag within the Right Pane container or apply them directly as inline styles to a wrapper `div` encapsulating the preview dashboard. This ensures the preview updates instantly without affecting the Left Pane's UI if desired, or apply to `:root` if the whole app should theme itself. *Given the PRD, applying to a localized provider/wrapper in the right pane is safer for split-pane isolation.*

2.  **Typography Injection:**
    *   Dynamically construct Google Fonts URL based on selected fonts in the Zustand store.
    *   Inject a `<link>` tag into the document `<head>` to load the required fonts.
    *   Apply the `font-family` CSS variables to the preview wrapper.

3.  **Session Portability (Import/Export JSON):**
    *   **Export:** Create a function to serialize the Zustand store state to JSON, create a Blob, and trigger a download (`stylemark-session.json`).
    *   **Import:** Create a file input to accept a JSON file, parse it, validate the schema, and update the Zustand store with the loaded values.

## Phase 4: The Export Engine (Markdown Generation)

**Goal:** Translate the configured design tokens into the final, standardized Markdown prompt document.

1.  **Markdown Template Generator (`src/utils/generateMarkdown.ts`):**
    *   Write a pure function that takes the current Zustand state as input and returns a formatted Markdown string.
    *   **Block 1 (Meta):** Inject Project Name and static setup instructions.
    *   **Block 2 (Design Tokens):** Format the CSS variables into a standard `:root` and `.dark` CSS code block.
    *   **Block 3 (Tailwind Config):** Generate a valid JSON representation of the `tailwind.config.js` `theme.extend` object, mapping Tailwind utility classes (like `colors.primary`) to the generated CSS variables (like `var(--primary)`).
    *   **Block 4 (Typography):** Output the generated Google Fonts `<link>` tags and explicit hierarchical instructions (e.g., "H1 should be 4rem, font-weight 700, using font var(--font-heading)").
    *   **Block 5 (Guidelines):** Generate semantic rules based on state (e.g., if shadow is 'Elevated', output rule: "Cards must use shadow-md").

2.  **Export Trigger:**
    *   Add a prominent "Generate StyleMark" button in the UI (likely top-right or bottom of the left pane).
    *   Wire the button to call the Markdown generator, create a `Blob` of type `text/markdown`, and trigger a download of `[ProjectName]-StyleMark.md`.

## Recommended Tech Stack Validation
- **Node.js:** v22
- **Package Manager:** pnpm
- **Frontend:** React 18+, Vite
- **Styling:** Tailwind CSS, PostCSS
- **Components:** Shadcn UI, Radix UI (under the hood of Shadcn), Lucide React
- **State Management:** Zustand
- **Color Manipulation:** `colord` or `chroma-js` (recommended for shade generation)