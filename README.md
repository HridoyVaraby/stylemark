# StyleMark

StyleMark is a purely client-side visual design system configurator. It bridges the gap between non-technical clients and developers by providing an interactive UI to define design tokens (colors, typography, geometry) and exporting a highly structured Markdown file which serves as a definitive "Source of Truth" for developers and AI agents.

## Features

- **Zero-Backend:** Fully client-side application.
- **Split-Pane Layout:**
  - **Control Center:** Define colors, typography, and geometry.
  - **Preview Dashboard:** Real-time preview of the theme.
- **Export Engine:** Transforms state into a deterministic Markdown file prompt for development use.

## Tech Stack

- **Framework:** React 19 powered by Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v3) combined with Shadcn UI (Radix UI primitives)
- **Icons:** Lucide-react
- **State Management:** Zustand (with localStorage persistence)
- **Package Manager:** pnpm

## Building and Running

Make sure Node.js v22 is installed. The project relies on `pnpm`.

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Development Server:**
   ```bash
   pnpm dev
   ```

3. **Production Build:**
   ```bash
   pnpm build
   ```

4. **Linting:**
   ```bash
   pnpm lint
   ```

5. **Preview Production Build:**
   ```bash
   pnpm preview
   ```

## Development Conventions

- **State Management:** All global design tokens reside in the `useThemeStore` Zustand store. Do not manage theme state via local component state.
- **Styling:** Use Tailwind CSS utility classes and `cn` utility for conditional classes. Follow Shadcn UI component structures.
- **Type Safety:** Strict TypeScript adherence is required. Avoid `any` types.
- **Code Quality:** All code should pass `pnpm lint` without errors before committing.
- **Component Placement:** Shared/reusable UI components belong in `src/components/ui`. Functional layout panes (like `ControlCenter.tsx` and `PreviewDashboard.tsx`) belong directly in `src/components`.
