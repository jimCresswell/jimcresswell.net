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
  - Use App Router (`/app`)
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


### @tailwindcss/typography@latest

- **Purpose**: Prose defaults for CV and long-form text
- **Usage**: CV sections, positioning paragraphs

### next/font (built-in)

- **Purpose**: Font loading and optimisation
- **Fonts**:
  - Inter (primary)
  - Literata (optional serif)
- **Notes**:
  - No external font loaders
  - No CSS `@import` fonts

---

## Accessibility

### @radix-ui/react-slot (optional)

- **Purpose**: Clean composition for buttons/links without div soup
- **Use sparingly**
- **Optional** — only if composition becomes awkward

> Do **not** add full Radix component sets unless strictly necessary.

### @savirufr/better-themes@latest

- **Purpose**: Light and dark mode support for Tailwind CSS


---

## Icons (Optional / Discouraged)

### lucide-react@latest (optional)

- **Purpose**: Minimal, accessible icons
- **Usage**: Only if an icon is unavoidable (e.g. print button)
- **Default stance**: Prefer text

---

## SEO & Structured Data

### schema-dts@latest (optional)

- **Purpose**: Type-safe JSON-LD authoring
- **Notes**:
  - Optional; raw JSON-LD is acceptable
  - Helpful for validation and refactoring safety

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

### prettier@latest (optional)

- **Purpose**: Formatting consistency
- **Notes**:
  - Optional but recommended for long-term maintenance

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
