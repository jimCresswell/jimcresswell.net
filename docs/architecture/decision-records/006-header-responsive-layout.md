# ADR-006: Header responsive layout

## Status

Accepted

## Date

2026-02-08

## Context

The site header contains two structural groups separated by
`justify-between`:

1. **Site identity** — logo, vertical separator, main navigation
   (`Home · CV`).
2. **Page controls** — conditional PDF download link, vertical
   separator, theme toggle (`Light · Dark · Auto`).

At wide viewports, whitespace between the groups provides a clear
visual boundary. As the viewport narrows, the groups compress toward
each other, eventually colliding. At the narrowest common viewport
(360px CSS width — iPhone 13 mini, small Android phones) the header
overflows the viewport entirely.

The original layout used fixed Tailwind `gap` values and a
`justify-between` flex container. Internal spacing was static — the
header looked good at 768px+ and broke below ~450px. The PDF link,
added to the header during the same session, made the right group
wider and brought the collision point up to ~500px.

### Design constraints

- No decorative UI elements (the site's editorial aesthetic rule).
- All spacing must be `rem`-based (scales with text size).
- 44×44px minimum touch targets (WCAG 2.2 AA).
- The header must never overflow the viewport.
- Graceful behaviour at 360px (narrowest common phone).

### Options considered

1. **Hard breakpoints** — hide or rearrange elements at specific
   widths. Simple but creates discrete jumps and requires knowing
   the exact collision width, which changes if content changes.

2. **Fluid gaps via `clamp()`** — internal gaps compress smoothly
   as the viewport narrows. Adaptive, no jumps, but alone cannot
   prevent overflow at very narrow widths.

3. **Container queries** — children adapt to the header's actual
   width. Most architecturally correct but adds complexity for a
   case where the header is always full-width (making container
   width ≈ viewport width).

4. **Flex-wrap with minimum gap** — `flex-wrap` on the outer
   container lets the page controls drop to a second line when
   space runs out. A `gap-x` value enforces minimum separation.
   Prevents overflow entirely but doesn't help the mid-range.

5. **Central dot separator** — a visible `·` character between the
   two groups, acting as a structural boundary signal. Explored in
   two variants:
   - _Flex-grow:_ `flex: 1 1 0` with `overflow: hidden`. The dot
     grows to fill space and clips as it compresses. **Rejected:**
     after wrapping, `flex-grow` causes the dot to reappear on
     line 1.

   - _Clamped max-width:_ `max-w: clamp(0px, 100vw - 24rem, 3rem)`.
     The dot vanishes at ~384px via the clamp. **Rejected:** this
     creates a ~25px dead zone (375–384px) where the header fits on
     one line but the dot is invisible — and 375px is the CSS width
     of iPhone SE and iPhone mini models. The complexity of managing
     the dot's visibility across viewport ranges outweighed its
     aesthetic contribution.

## Decision

**Use a two-layer responsive strategy: fluid internal gaps and
flex-wrap with a minimum gap.**

### Layer 1: Fluid internal gaps

All internal spacing uses `clamp()` so it compresses smoothly as
the viewport narrows, without breakpoints:

| Element               | Spacing                               | Range      |
| --------------------- | ------------------------------------- | ---------- |
| Left group (logo/nav) | `gap: clamp(0.375rem, 1.5vw, 1rem)`   | 6px → 16px |
| Nav dot separators    | `mx: clamp(0.25rem, 0.75vw, 0.5rem)`  | 4px → 8px  |
| Theme toggle          | `gap: clamp(0.125rem, 0.5vw, 0.5rem)` | 2px → 8px  |

These use viewport units (`vw`) rather than container queries
because the header is always full-width — the two are equivalent
here, and `vw` requires no extra markup.

The theme toggle uses a lower `vw` coefficient (`0.5vw` vs `0.75vw`)
because its buttons already have 44px minimum widths for WCAG touch
targets. The internal whitespace within each button contributes to
the perceived gap, so a smaller explicit gap balances the visual
density of the theme group against the left group at narrow widths.

### Layer 2: Flex-wrap with minimum gap

The outer container uses `flex-wrap` with `justify-between`:

```
[site identity]            [page controls]
        ← gap-x-6 (1.5rem minimum) →
```

- `gap-x-6` (1.5rem / 24px) enforces a minimum horizontal gap between
  the two groups. `justify-between` distributes any extra space
  beyond this minimum.
- `gap-y-2` (0.5rem / 8px) provides vertical spacing when the page
  controls wrap to a second line.
- When the viewport is too narrow for both groups plus the minimum
  gap, `flex-wrap` drops the page controls to a second line. This
  prevents overflow at any width.

The minimum gap is `rem`-based, so it scales with the user's text
size preference.

### Theme toggle touch targets

The theme buttons use `min-w-11 min-h-11` (44×44px) with
`justify-center` for WCAG touch targets. On wider viewports,
the centring within 44px naturally pulls the rightmost button's
text inward from the container edge — this is a structural
consequence of the accessibility requirement, not a manual
alignment hack.

### Typography inheritance

Typography is set once on the header container (`font-sans text-sm`)
and inherited by all children. This avoids class matching across
components and ensures consistent font weight, size, and line
height.

## Consequences

**Benefits:**

- The header never overflows, at any viewport width.
- Spacing compression is continuous, not stepped — no jarring
  layout shifts at breakpoint boundaries.
- Typography is set once and inherited — no class matching across
  components.
- All spacing is `rem`-based via Tailwind utilities, supporting
  the "scales with text size" claim.
- Simple: two flex children, `justify-between`, `flex-wrap`, one
  `gap-x` value. Easy to understand and maintain.

**Trade-offs:**

- The `clamp()` values use arbitrary Tailwind syntax
  (`gap-[clamp(...)]`) which is less readable than named utilities.
  This is a Tailwind limitation for fluid values.
- At narrow-but-not-wrapping widths (~380–450px), the groups are
  close together with no explicit visual separator. `justify-between`
  provides a gap, but there is no decorative boundary signal. This
  was deemed acceptable — the gap itself is sufficient, and the
  central dot separator added more complexity than it was worth
  (see options 5a and 5b above).

## Related

- `components/site-header.tsx` — header layout implementation
- `components/theme-toggle.tsx` — fluid internal gaps
- `components/download-pdf-link.tsx` — compact header PDF link
- [ADR-003](003-print-button-removed.md) — print button removal
  (related: the PDF download link is now in both the header and
  the CV body)
