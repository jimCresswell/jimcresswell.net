# UI Component Placement Specification

This document specifies the placement and behavior of key UI components.

---

## Theme Toggle

- **Location**: Site header, right side
- **Format**: "Light · Dark · Auto" with middle dot (·) separators
- **Behavior**:
  - Current mode visually distinct (e.g., bold or underlined)
  - Clicking a mode switches immediately
  - Persists preference to localStorage
  - Respects system preference when "Auto" is selected
- **Accessibility**:
  - Keyboard navigable (Tab between options)
  - State change announced via ARIA live region
  - Visible focus indicator on each option

---

## Skip Link

- **Text**: "Skip to main content"
- **Location**: First focusable element in the DOM (before header)
- **Visibility**: Hidden until focused (CSS `sr-only` with focus override)
- **Target**: `#main-content` (id on `<main>` element)
- **Styling when focused**:
  - High contrast background
  - 2px focus ring
  - Fixed position or absolute at top-left
- **Accessibility**:
  - Must be the first Tab stop
  - Must be visible when focused

---

## Print Button (CV only)

- **Text**: "Print CV"
- **Location**: CV page only, below the headline, aligned left
- **Behavior**: Triggers `window.print()`
- **Styling**:
  - Text-only (no icon)
  - Matches body text styling with underline or distinct color
- **Print visibility**: Hidden in print CSS (`@media print { display: none }`)
- **Accessibility**:
  - Standard button semantics (`<button>`)
  - Keyboard accessible

---

## Variant Navigation (Strategy A)

- **Location**: CV page only, at the bottom of the page (before footer)
- **Heading**: "Other versions" or "CV Variants"
- **Format**: Simple unordered list of links
- **Labels**: Use tilt context labels from `cv.content.json -> tilts.<key>.context`
- **Current variant**: Do not link to current page (show as plain text or omit)
- **Accessibility**:
  - Semantic list markup (`<ul>`, `<li>`)
  - Clear link text (context label is sufficient)

---

## Header

- **Contents**:
  - Logo/name (left)
  - Theme toggle (right)
- **Behavior**:
  - Not sticky (allows full content visibility)
  - Consistent across all pages
- **Print**: Show name only, hide theme toggle

---

## Footer

- **Contents**:
  - Copyright or minimal branding
  - Optional: external links (LinkedIn, GitHub)
- **Location**: Bottom of every page
- **Print**: Hide or simplify
