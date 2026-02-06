# jimcresswell.net — Recommended npm Dependencies

This document specifies the **approved npm dependencies** for jimcresswell.net.
The goal is to stay **modern, minimal, stable**, and aligned with **Next.js best practice**.
Avoid unnecessary libraries. Prefer platform primitives.

---

## Core Framework

### next@latest

- **Purpose**: React framework (App Router, SSR, RSC, routing, metadata)
- **Requirement**: Latest stable release at project creation time
- **Notes**:
  - Use App Router (`/app`) — do not use Pages Router or other legacy patterns
  - Use Server Components by default
  - Use built-in metadata API for SEO + Open Graph

### react / react-dom

- **Purpose**: UI rendering
- **Requirement**: Installed automatically with Next.js
- **Notes**:
  - No additional state libraries required for this project

---

## Styling & Typography

### tailwindcss@latest

- **Purpose**: Utility-first styling, consistent spacing & typography
- **Reason**: Fast iteration in v0, excellent dark-mode support, low runtime cost
- **Notes**:
  - Use CSS variables for theming
  - Keep class usage restrained and readable
  - **Tailwind 4** is specified intentionally. If v0 generates Tailwind 3.x, upgrade post-export or adapt configuration

### @tailwindcss/typography@latest

- **Purpose**: Prose defaults for CV and long-form text
- **Usage**: CV sections, positioning paragraphs

### next/font (built-in)

- **Purpose**: Font loading and optimisation
- **Fonts**:
  - Inter (headers, labels, metadata)
  - Literata (prose, positioning, experience narratives)
- **Notes**:
  - No external font loaders
  - No CSS `@import` fonts

---

## Accessibility & Theming

### next-themes@latest

- **Purpose**: Light/dark/system theme switching with no flash
- **Requirements**:
  - Support three modes: `system`, `light`, `dark`
  - No flash of wrong theme on page load (critical)
  - Persist user preference to localStorage
- **Tailwind 4 Integration**:
  - Use `attribute="class"` strategy (adds `dark` class to `<html>`)
  - Tailwind 4 uses `@custom-variant dark (&:where(.dark, .dark *))` — compatible with next-themes class strategy
  - Define theme colours as CSS variables in `:root` and `.dark` selectors
  - Use `suppressHydrationWarning` on `<html>` element
- **Example setup**:

  ```tsx
  // app/layout.tsx
  import { ThemeProvider } from "next-themes";

  export default function RootLayout({ children }) {
    return (
      <html suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }
  ```

---

## Utilities

### clsx@latest

- **Purpose**: Conditional class names
- **Reason**: Tiny, stable, ubiquitous

### tailwind-merge@latest

- **Purpose**: Merge Tailwind class strings safely
- **Reason**: Prevent class conflicts in composed components

---

## Linting & Quality

### eslint@latest

- **Purpose**: Code quality
- **Notes**:
  - Use Next.js recommended config

### prettier@latest

- **Purpose**: Formatting consistency
- **Notes**:
  - Required for long-term maintenance

---

## Dev Dependencies (Asset Generation)

### text-to-svg@latest (devDependency)

- **Purpose**: Generate static SVG logo/favicon assets from text
- **Usage**: One-time script to generate `favicon-light.svg`, `favicon-dark.svg`, etc.
- **Notes**:
  - Not bundled at runtime
  - Run via `npm run generate-assets` or similar
  - Requires a TTF font file (e.g., Roboto Condensed)

### sharp@latest (devDependency)

- **Purpose**: Convert SVG to PNG for OG image and apple touch icons
- **Usage**: Run as part of `npm run generate-assets`
- **Notes**:
  - Not bundled at runtime
  - Used by `logo/generate-icons.ts` to produce PNG variants

---

## What NOT to Install (Intentional Exclusions)

Do **not** include unless a future requirement clearly demands it:

- ❌ Redux, Zustand, Jotai (no complex state)
- ❌ Framer Motion (no heavy animation)
- ❌ Chakra, MUI, Ant Design (overkill)
- ❌ Styled-components / Emotion (runtime cost)
- ❌ Moment.js (deprecated, heavy)
- ❌ CMS SDKs
- ❌ Analytics SDKs (unless explicitly added later)

---

## Dependency Philosophy

- Prefer **platform defaults** over libraries
- Prefer **compile-time** solutions over runtime
- Every dependency must justify:
  - bundle size
  - cognitive load
  - maintenance risk

This site should feel like it could survive **five years with minimal intervention**.
