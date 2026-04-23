🔒 Fix CSS Injection Vulnerability in Template Generators

🎯 **What:** This PR fixes a security vulnerability where user-provided design tokens (colors, geometry, typography) were injected directly into CSS and Markdown templates without proper sanitization.

⚠️ **Risk:** An attacker could provide malicious input (e.g., in a color code or font name) containing CSS control characters like `;`, `{`, `}`, `"`, or `'`. This could lead to CSS injection attacks, allowing attackers to inject arbitrary styles, override theme behavior, or potentially extract sensitive data through advanced CSS injection techniques.

🛡️ **Solution:**
1. Created `src/utils/sanitize.ts` with two utility functions:
   - `sanitizeInput`: Strips out dangerous characters (`:`, `;`, `{`, `}`, `"`, `'`, `<`, `>`) from string inputs to prevent CSS/HTML injection.
   - `sanitizeHex`: Validates hex color inputs to ensure they strictly conform to a valid hex format (e.g., `#RRGGBB`).
2. Updated `src/utils/color.ts` to apply `sanitizeHex` to all hex inputs before processing them.
3. Updated `generateMarkdown.ts`, `generateCss.ts`, and `generateTailwindConfig.ts` to wrap all user-provided variables (fonts, geometry, etc.) with `sanitizeInput` before concatenating them into the final output strings.
