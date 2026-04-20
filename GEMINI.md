# StyleMark

## Project Overview
StyleMark is a purely client-side visual design system configurator. It bridges the gap between non-technical clients and developers by providing an interactive UI to define design tokens (colors, typography, geometry) and exporting a highly structured Markdown file which serves as a definitive "Source of Truth" for developers and AI agents.

### Tech Stack
- **Framework:** React 19 powered by Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v3) combined with Shadcn UI (Radix UI primitives)
- **Icons:** Lucide-react
- **State Management:** Zustand (with localStorage persistence)
- **Package Manager:** pnpm

### Architecture
- **Zero-Backend:** Fully client-side application.
- **Split-Pane Layout:**
  - **Left Pane (Control Center):** Zustand state mutation, defining colors, typography, and geometry.
  - **Right Pane (Live Preview Dashboard):** Reactively reads the store, dynamically injects CSS variables to a localized wrapper to preview the theme in real-time.
- **Export Engine:** Transforms Zustand state into a deterministic Markdown file prompt for development use.

## Building and Running
The project relies on `pnpm`. Make sure Node.js v22 is installed.

- **Install Dependencies:** `pnpm install`
- **Development Server:** `pnpm dev`
- **Production Build:** `pnpm build` (Runs `tsc -b` for type-checking and then Vite build)
- **Linting:** `pnpm lint` (Runs ESLint)
- **Preview Production Build:** `pnpm preview`

## Development Conventions
- **State Management:** All global design tokens reside in the `useThemeStore` Zustand store. Do not manage theme state via local component state.
- **Styling:** Use Tailwind CSS utility classes and `cn` utility for conditional classes. Follow Shadcn UI component structures.
- **Type Safety:** Strict TypeScript adherence is required. Avoid `any` types.
- **Code Quality:** All code should pass `pnpm lint` without errors before committing.
- **Component Placement:** Shared/reusable UI components belong in `src/components/ui`. Functional layout panes (like `ControlCenter.tsx` and `PreviewDashboard.tsx`) belong directly in `src/components`.