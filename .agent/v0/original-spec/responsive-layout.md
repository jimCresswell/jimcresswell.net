# Responsive Layout Specification

This document defines the responsive behavior of the site. The approach is **mobile-first**: base styles target mobile, with enhancements added at larger breakpoints.

---

## Design Philosophy

- **Single-column layout**: Content is always single-column. No multi-column grids that reflow.
- **Content-first**: The design adapts to the content, not the other way around.
- **Progressive enhancement**: Mobile gets the essential experience; desktop gets refinements (more whitespace, larger type).
- **No horizontal scroll**: All content must fit within the viewport at any size.

---

## Breakpoints

| Name     | Min-width | Use case                           |
| -------- | --------- | ---------------------------------- |
| **Base** | 0         | Mobile phones (portrait)           |
| **sm**   | 640px     | Large phones, small tablets        |
| **md**   | 768px     | Tablets (portrait)                 |
| **lg**   | 1024px    | Tablets (landscape), small laptops |
| **xl**   | 1280px    | Desktops                           |

These align with Tailwind defaults. Use sparingly — most layout is fluid.

---

## Layout Behavior

### Container

- **Max-width**: 760px (content), centered
- **Padding**:
  - Mobile: `1rem` (16px) horizontal
  - Desktop (md+): `2rem` (32px) horizontal
- **No fixed widths**: Container is fluid up to max-width

### Typography Scaling

| Element              | Mobile (base) | Desktop (md+)    |
| -------------------- | ------------- | ---------------- |
| Name (h1)            | 32px          | 42px             |
| Section headers (h2) | 16px          | 18px             |
| Body text            | 16px          | 16px (no change) |
| Metadata             | 14px          | 14px (no change) |

Body text does not scale — 16px is readable on all devices. Only headings increase.

### Spacing Scaling

| Element               | Mobile | Desktop (md+) |
| --------------------- | ------ | ------------- |
| Section gap           | 20px   | 24px          |
| Paragraph gap         | 12px   | 14px          |
| Page vertical padding | 2rem   | 4rem          |

### Line Length

- **Target**: 60-75 characters per line for prose
- **Achieved by**: max-width constraint (760px) + appropriate font size
- **No media queries needed**: Single-column layout naturally controls line length

---

## Touch Considerations

### Target Sizes

- **Minimum**: 44×44 CSS pixels for touch targets (Apple HIG recommendation)
- **WCAG 2.2 AA**: 24×24 CSS pixels minimum (already specified)
- **Recommendation**: Use 44×44 for primary actions, 24×24 acceptable for dense lists

### Link Spacing

- In prose: Sufficient line-height (1.7) provides vertical separation
- In lists: Minimum 8px vertical padding between items
- Navigation: Full-width tap targets on mobile

### Interactive Elements

- **Theme toggle**: Each option ("Light", "Dark", "Auto") must be individually tappable
- **Print button**: Minimum 44px height on mobile
- **Skip link**: When focused, must not be obscured by thumb position

---

## Responsive Patterns

### Header

- **Mobile**: Logo/name left, theme toggle right, single row
- **Desktop**: Same layout, more horizontal padding
- **No hamburger menu**: Navigation is minimal (just CV link)

### Hero (Front Page)

- **Mobile**:
  - Name at top, tagline below
  - Reduced vertical padding
  - Summary paragraphs full-width
- **Desktop**:
  - More vertical padding
  - Larger name size
  - Centered or left-aligned (consistent with editorial feel)

### CV Sections

- **All breakpoints**: Single column, no changes to structure
- **Mobile**: Slightly tighter spacing
- **Desktop**: More generous spacing, larger headings

### Variant Navigation

- **Mobile**: Stacked list, full-width tap targets
- **Desktop**: Same layout (no horizontal layout)

---

## Print Considerations

Print is a separate media query, not a breakpoint:

```css
@media print {
  /* See cv.presentation.json for print specs */
}
```

- Print layout is A4-optimized, separate from screen breakpoints
- Hide non-essential elements (theme toggle, print button, skip link)
- See `cv.presentation.json → media.print_a4` for detailed specs

---

## Implementation Notes

### CSS Strategy

```css
/* Mobile-first: base styles are mobile */
.container {
  padding: 1rem;
  max-width: 760px;
  margin: 0 auto;
}

/* Desktop enhancement */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
```

### Tailwind 4 Approach

```html
<!-- Mobile-first with responsive prefixes -->
<div class="px-4 md:px-8 max-w-[760px] mx-auto">
  <!-- content -->
</div>

<h1 class="text-[32px] md:text-[42px]">Name</h1>
```

### Testing Checklist

- [ ] iPhone SE (375px) — smallest common phone
- [ ] iPhone 14 (390px) — typical phone
- [ ] iPad (768px) — tablet portrait
- [ ] iPad landscape (1024px)
- [ ] Desktop (1280px+)
- [ ] Touch simulation on all interactive elements
- [ ] Print preview (separate from screen)

---

## Anti-Patterns

Do not:

- Use multi-column layouts that reflow to single column
- Hide content on mobile ("show more on desktop")
- Use hover-only interactions
- Create horizontal scrolling regions
- Use fixed positioning that obscures content
- Reduce font size below 16px on mobile
