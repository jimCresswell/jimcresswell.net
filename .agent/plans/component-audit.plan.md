# Component Audit and Refactoring

Audit and refactor the component layer, design tokens, and page scaffolding before adding a third page. The site is a visible demonstration of engineering discipline — the patterns must scale with rigour and grace.

## Status: Planning

## Context

The site currently has two content pages (home, CV) plus error pages. A timeline page at `/cv/timeline` is next. The existing components were built for a two-page site and work, but adding a third page would compound several structural issues. This plan addresses them first.

The project uses Next.js 16, React 19, Tailwind CSS 4, and Vitest. There are no component-level tests — only pure function unit tests (Vitest) and E2E tests (Playwright). React Testing Library is not yet installed.

### Storybook: considered and deferred

Storybook 10.2 was evaluated as an alternative to standalone RTL for component testing. Its Vitest addon transforms stories into real Vitest tests running in a real browser (Chromium via Playwright), and its interaction testing API uses the same Testing Library queries as RTL. The visual catalogue and browser-mode testing are genuine advantages.

However, for this project's current scale (~12 components, mostly server components, narrow rendering contracts), the setup cost is disproportionate. The decision is documented in [ADR-004](../../docs/architecture/decision-records/004-storybook-deferred.md). RTL + Vitest (jsdom) is the chosen approach. If the component count grows significantly or a visual catalogue becomes valuable for the portfolio, the migration path from RTL to Storybook interaction tests is low-friction — the query API and assertions are identical.

---

## Part 1: Tailwind Hygiene — Canonical Classes and Design Tokens

### 1.1 Replace arbitrary values with canonical Tailwind classes

Arbitrary values should only be used when there is no equivalent in Tailwind's default scale. Several current uses have exact canonical equivalents.

| Arbitrary        | Canonical  | Occurrences | Files                                                                                               |
| ---------------- | ---------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `gap-[0.875rem]` | `gap-3.5`  | 2           | `app/cv/page.tsx`, `app/page.tsx`                                                                   |
| `min-h-[44px]`   | `min-h-11` | 11          | `theme-toggle`, `site-header`, `site-footer`, `download-pdf-link`, `not-found` (x2), `app/page.tsx` |

**Remaining arbitrary values that are intentional** (no canonical equivalent):

- `max-w-[760px]` — custom content width (7 occurrences). Should become a theme token (see 1.2).
- `text-[2rem]` / `md:text-[2.625rem]` — intentional page title size (4 occurrences). Should become a theme token (see 1.2).
- `leading-[1.7]` — intentional body prose line-height (6+ occurrences). Should become a theme token (see 1.2).
- `min-h-[60vh]` — centred error page layout (2 occurrences). Genuine one-off, fine as arbitrary.

### 1.2 Define design tokens in the Tailwind theme

Repeated arbitrary values that represent deliberate design decisions should be registered as custom theme values in `globals.css` under `@theme inline`. This replaces scattered arbitrary classes with named, semantic tokens — a single source of truth.

**Proposed tokens:**

```css
@theme inline {
  /* … existing tokens … */

  /* Content width */
  --container-content: 760px;

  /* Typography scale — page titles */
  --font-size-page-title: 2rem;
  --font-size-page-title-md: 2.625rem;

  /* Typography scale — body prose line-height */
  --leading-prose: 1.7;
}
```

This enables `max-w-content` (or similar), `text-page-title`, `md:text-page-title-md`, and `leading-prose` as first-class Tailwind utilities, replacing the 17+ scattered arbitrary values with named tokens.

**Open question:** Tailwind 4's `@theme` supports `--font-size-*`, `--leading-*`, and `--width-*` namespaces. Confirm the exact namespace conventions before implementing.

### 1.3 Tests

No unit tests needed for token changes — these are CSS. Visual correctness is verified by E2E tests (accessibility, content integrity, home-to-cv journey). Run the full E2E suite after changes.

---

## Part 2: Page Scaffolding — Eliminate Duplication

### 2.1 The problem

Five pages manually compose the same shell:

```tsx
<>
  <SkipLink />
  <SiteHeader actions={...} />
  <main id="main-content" className="mx-auto max-w-[760px] px-4 py-8 md:px-8 md:py-16">
    {/* page content */}
  </main>
  <SiteFooter links={footerLinks} />
</>
```

Duplicated in: `app/page.tsx`, `app/cv/page.tsx`, `app/cv/[variant]/page.tsx`, `app/not-found.tsx`, `app/cv/pdf/unavailable/not-found.tsx`.

Meanwhile `app/cv/layout.tsx` is a pass-through (`return children`) that does nothing.

### 2.2 Proposed solution

**Move the shared shell into `app/layout.tsx`** (root layout). All pages get SkipLink, SiteHeader, `<main>`, and SiteFooter automatically. Pages only provide their content.

This requires solving two things:

1. **The `actions` slot on `SiteHeader`** — only CV pages pass `<DownloadPdfLink />`. Options:
   - (a) `SiteHeader` reads the pathname and conditionally renders actions. Simple, but couples header to routes.
   - (b) Use a React context or layout-level slot. Clean but possibly over-engineered for one action.
   - (c) Keep `SiteHeader` in the root layout without actions, and have `app/cv/layout.tsx` add the download link as a fixed/sticky element or via a different mechanism.
   - **Recommended: (a)** — the header is already a client component that reads `usePathname()`. Adding `actions` logic there is idiomatic Next.js and avoids a context layer for a single boolean.

2. **The `<main>` wrapper** — some pages use additional classes (error pages add `flex flex-col items-center justify-center min-h-[60vh] text-center`). Options:
   - The root layout provides the base `<main>` with the standard classes. Error pages can nest a centring `<div>` inside.
   - Or: the root layout only provides `<main id="main-content">` with max-width/padding, and pages add their own layout within that.

3. **`SiteFooter` links** — currently passed as props from `footerLinks`. If the footer is in the root layout, it imports `footerLinks` once. Simpler.

### 2.3 Layout hierarchy after refactoring

```
app/layout.tsx          → SkipLink, SiteHeader, <main>, SiteFooter, ThemeProvider
  app/page.tsx          → Home content only
  app/not-found.tsx     → Error content only (centred within main)
  app/cv/layout.tsx     → Pass-through or CV-specific concerns (currently none)
    app/cv/page.tsx     → CV content only
    app/cv/[variant]/   → Variant CV content only
    app/cv/timeline/    → Timeline content only (future)
```

### 2.4 Tests

- **RTL integration tests** for the root layout: verify `SkipLink`, `SiteHeader`, `<main>`, and `SiteFooter` are rendered.
- Existing E2E tests already verify the full shell on real pages — they act as regression tests.

---

## Part 3: Extract Reusable Section Primitives

### 3.1 The problem

`CVLayout` is a 123-line monolith that renders every CV section inline. The same rendering patterns appear in the CV and would be needed for the timeline page:

- **Section with heading** — a `<section>` with `aria-labelledby`, an `<h2>`, and children. Used 5 times in `cv-layout.tsx`.
- **Article entry** — a heading (`<h3>`), metadata line (role, dates), and prose paragraphs with `RichText`. Used for experience and foundations, and would be used for timeline entries.
- **Prose paragraph** — `font-serif text-base leading-[1.7] text-foreground` with `RichText`. Appears 6+ times across the codebase.

### 3.2 Proposed components

**`PageSection`** — replaces the repeated section + heading pattern:

```tsx
interface PageSectionProps {
  id: string; // e.g. "experience" → creates aria-labelledby="experience-heading"
  heading: string; // visible heading text
  srOnly?: boolean; // screen-reader-only heading (e.g. "Positioning")
  children: ReactNode;
  className?: string;
}
```

**`Prose`** — the body text pattern, replacing 6+ identical className strings:

```tsx
interface ProseProps {
  children: string; // text content (passed to RichText)
  className?: string;
}
```

Renders `<p>` with the standard prose classes and `<RichText>`.

**`ArticleEntry`** — the experience/foundations/timeline entry pattern:

```tsx
interface ArticleEntryProps {
  heading: string;
  meta?: string; // e.g. "Exploratory Leadership · 2019–present"
  children: ReactNode; // prose paragraphs
}
```

**Note:** These are not a design system. They are thin wrappers over semantic HTML with consistent classes. They should remain simple and not accept extensive configuration. If a future page needs a different pattern, build a different component — do not make these generic.

### 3.3 Refactor `CVLayout`

After extracting the primitives, `CVLayout` becomes an assembly of `PageSection`, `ArticleEntry`, and `Prose` components. It should also stop importing `cvContent` directly and instead receive content as props — this makes it testable and decouples it from the data source.

### 3.4 Tests

Each extracted component gets an RTL integration test:

- **`PageSection`** — renders semantic `<section>` with correct `aria-labelledby`, heading text, children.
- **`Prose`** — renders `<p>` with expected text, handles markdown links via `RichText`.
- **`ArticleEntry`** — renders heading, metadata, children in correct order and semantic structure.
- **`CVLayout`** (after refactor) — renders all expected sections with correct headings and content. Test with injected props, not the real JSON.

---

## Part 4: SiteFooter — Reduce Internal Repetition

### 4.1 The problem

`SiteFooter` renders five nearly identical link blocks, each with the same className string:

```tsx
className =
  "underline opacity-70 hover:opacity-100 transition-opacity py-2 sm:py-0 sm:min-h-[44px] flex items-center";
```

This is not about reusability across components — it is about DRY within a single component.

### 4.2 Proposed solution

Extract a local `FooterLink` component (or simply a links array with `.map()`). The existing prop-by-prop conditional rendering (`links.email &&`, `links.linkedin &&`, etc.) can be replaced with a typed array of `{ label, href, isExternal }` entries, filtered by existence.

### 4.3 Tests

- **RTL test for `SiteFooter`** — renders expected links when provided, omits links when not provided, external links have `target="_blank"` and `rel="noopener noreferrer"`.

---

## Part 5: SiteHeader — Navigation Scalability

### 5.1 Current state

Navigation is hardcoded to Home and CV with inline active-state logic. This works but does not scale.

### 5.2 Proposed change

Replace the inline JSX with a data-driven nav:

```tsx
const navItems = [
  { label: "Home", href: "/", match: (path: string) => path === "/" },
  { label: "CV", href: "/cv/", match: (path: string) => path.startsWith("/cv") },
];
```

The nav renders from this array. Adding a link (or removing one) is a data change, not a JSX restructuring.

**Note:** `/cv/timeline` sitting under `/cv` means the "CV" nav item will be active for the timeline page. This is correct — the timeline is part of the CV section.

### 5.3 Tests

- **RTL test for `SiteHeader`** — renders nav links, marks the correct one as active based on pathname, renders actions slot when provided.
- Testing active state requires mocking `usePathname()` — this is one of the few cases where a mock is justified, since the component is a client component that reads from Next.js navigation.

---

## Part 6: React Testing Library Setup

### 6.1 Current state

- Vitest runs with `environment: "node"`.
- No `@testing-library/react` or `@testing-library/jest-dom` installed.
- Component tests do not exist.

### 6.2 Setup steps

1. Install dependencies:

   ```bash
   pnpm add -D @testing-library/react @testing-library/jest-dom jsdom
   ```

2. Update `vitest.config.ts`:
   - Add a separate project or workspace for component tests with `environment: "jsdom"`.
   - Or: use per-file `// @vitest-environment jsdom` pragmas. Simpler for a small codebase.
   - **Recommended:** per-file pragmas. Keeps the config simple and makes the environment requirement explicit in each test file.

3. Add a `vitest-setup.ts` that imports `@testing-library/jest-dom/vitest` for custom matchers.

4. Update `vitest.config.ts` to reference the setup file.

### 6.3 Test file locations

Component tests live next to their components:

```
components/
  page-section.tsx
  page-section.test.tsx
  prose.tsx
  prose.test.tsx
  article-entry.tsx
  article-entry.test.tsx
  site-header.test.tsx
  site-footer.test.tsx
  cv-layout.test.tsx
```

### 6.4 Test principles (from rules.md)

- Test behaviour, not implementation.
- No complex mocks. The only mock needed is `usePathname()` for `SiteHeader`.
- No snapshot tests — they test nothing useful here.
- Each test must prove something meaningful about the component's contract.

---

## Execution Order

| Step | What                                                      | Depends on    | Tests                            |
| ---- | --------------------------------------------------------- | ------------- | -------------------------------- |
| 1    | RTL setup (Part 6)                                        | Nothing       | Verify setup with a trivial test |
| 2    | Design tokens (Part 1.2)                                  | Nothing       | E2E regression                   |
| 3    | Canonical classes (Part 1.1)                              | Nothing       | E2E regression                   |
| 4    | Extract `PageSection`, `Prose`, `ArticleEntry` (Part 3.2) | RTL setup     | RTL tests for each               |
| 5    | Refactor `CVLayout` to use primitives (Part 3.3)          | Step 4        | RTL test for CVLayout            |
| 6    | Refactor `SiteFooter` (Part 4)                            | RTL setup     | RTL test                         |
| 7    | Refactor `SiteHeader` nav (Part 5)                        | RTL setup     | RTL test                         |
| 8    | Move shell to root layout (Part 2)                        | Steps 5, 6, 7 | RTL test + E2E regression        |
| 9    | Full quality gate                                         | All above     | `pnpm check` + `pnpm test:e2e`   |

Steps 2 and 3 are independent and can run in parallel with step 1. Steps 4–7 depend on RTL setup but are independent of each other. Step 8 depends on 5, 6, and 7 because the layout refactor moves the header and footer, so those components should be clean first.

---

## Files Affected

| File                                   | Changes                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `package.json`                         | Add `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`           |
| `vitest.config.ts`                     | Add setup file reference                                                     |
| `vitest-setup.ts`                      | New — RTL matcher setup                                                      |
| `app/globals.css`                      | Add theme tokens for content width, title size, prose leading                |
| `app/layout.tsx`                       | Add shared page shell (SkipLink, SiteHeader, main, SiteFooter)               |
| `app/cv/layout.tsx`                    | Potentially becomes meaningful (CV-section concerns) or remains pass-through |
| `app/page.tsx`                         | Remove scaffolding, keep content only                                        |
| `app/cv/page.tsx`                      | Remove scaffolding, keep content only                                        |
| `app/cv/[variant]/page.tsx`            | Remove scaffolding, keep content only                                        |
| `app/not-found.tsx`                    | Remove scaffolding, keep centred content                                     |
| `app/cv/pdf/unavailable/not-found.tsx` | Remove scaffolding, keep centred content                                     |
| `components/cv-layout.tsx`             | Refactor to use primitives, accept props                                     |
| `components/page-section.tsx`          | New — section heading primitive                                              |
| `components/page-section.test.tsx`     | New — RTL test                                                               |
| `components/prose.tsx`                 | New — body text primitive                                                    |
| `components/prose.test.tsx`            | New — RTL test                                                               |
| `components/article-entry.tsx`         | New — entry/article primitive                                                |
| `components/article-entry.test.tsx`    | New — RTL test                                                               |
| `components/cv-layout.test.tsx`        | New — RTL test                                                               |
| `components/site-header.tsx`           | Data-driven nav                                                              |
| `components/site-header.test.tsx`      | New — RTL test                                                               |
| `components/site-footer.tsx`           | DRY link rendering                                                           |
| `components/site-footer.test.tsx`      | New — RTL test                                                               |

---

## Out of Scope

| Item                           | Reason                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Timeline page implementation   | Separate plan (content-review.plan.md, Observation 9)                                                      |
| Content changes                | Separate plan (content-review.plan.md)                                                                     |
| Front page content             | Separate plan (front-page-content.plan.md)                                                                 |
| Visual regression testing      | No infrastructure; E2E + RTL are sufficient                                                                |
| Storybook                      | Evaluated and deferred — see [ADR-004](../../docs/architecture/decision-records/004-storybook-deferred.md) |
| CSS-in-JS or styled-components | Tailwind 4 is the styling system                                                                           |

---

## Principles

1. **Could it be simpler?** — Every extraction must reduce total complexity, not just move it. If a component would be used only once, do not extract it.
2. **Test behaviour** — RTL tests verify what the user sees and interacts with, not internal implementation.
3. **Design for three pages, not thirty** — The patterns should scale to a small site with grace, not anticipate a large application. Avoid premature abstraction.
4. **Single source of truth** — Design tokens in `@theme`, content in JSON, structure in components. No value should be defined in more than one place.
5. **Idiomatic Tailwind 4** — Use the theme system for repeated custom values. Use canonical utility classes. Arbitrary values are for genuine one-offs only.
6. **Idiomatic Next.js 16** — Layouts provide shared UI. Pages provide unique content. Server components by default. Client components only where interaction demands it.
