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
- **Location**: Header actions slot (right side, before theme toggle), CV pages only
- **Behavior**: Triggers `window.print()`
- **Styling**:
  - Text-only (no icon)
  - Matches theme toggle styling (text link appearance)
  - Separator between print button and theme toggle (e.g., `|` or spacing)
- **Print visibility**: Hidden in print CSS (`@media print { display: none }`)
- **Accessibility**:
  - Standard button semantics (`<button>`)
  - Keyboard accessible

---

## Variant Navigation

- **Location**: Integrated into footer, CV pages only
- **Format**: Inline text with middle dot separators, matching tagline style
- **Pattern**: `CV variants: Main · Public Sector` (or similar)
- **Labels**: Short labels (not full context strings)
- **Current variant**: Not linked (plain text or omitted)
- **Styling**:
  - Same typography as footer text
  - Subtle, not competing with content
  - Appears above copyright line
- **Accessibility**:
  - Links are inline `<a>` elements
  - Clear, descriptive link text

---

## Header

- **Contents**:
  - Logo/name (left)
  - Actions slot (right) — optional, page-specific actions
  - Theme toggle (right, after actions slot)
- **Actions slot**:
  - Empty on front page
  - Contains "Print CV" button on CV pages (`/cv/` and `/cv/<variant>/`)
  - Separator between actions and theme toggle if both present
- **Layout**: Single row, space-between or flex with gap
- **Behavior**:
  - Not sticky (allows full content visibility)
  - Consistent structure across all pages (slot may be empty)
- **Print**: Show name only, hide actions slot and theme toggle

---

## Footer

- **Consistency**: Same footer on all pages (front page, CV, variants)
- **Contents**:
  - CV variants line (CV pages only): `CV variants: Main · Public Sector`
  - Copyright or minimal branding
  - Optional: external links (LinkedIn, GitHub)
- **Layout**:
  - Variants line above copyright (if present)
  - Single column, centered or left-aligned
- **Location**: Bottom of every page
- **Print**: Hide entirely (variants and copyright not needed in print)
