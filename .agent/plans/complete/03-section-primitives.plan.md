# Cloud Sub-Plan 03: Extract Reusable Section Primitives

**Parent plan:** [component-audit.plan.md](../component-audit.plan.md) — Part 3.2
**Dependencies:** [01-rtl-setup](01-rtl-setup.plan.md) must be complete (RTL available for tests)
**Enables:** [06-cv-layout-refactor](06-cv-layout-refactor.plan.md)

## Goal

Extract three thin, reusable components from repeated patterns in the codebase: `PageSection`, `Prose`, and `ArticleEntry`. Each gets an RTL integration test. These are not a design system — they are simple wrappers over semantic HTML with consistent Tailwind classes.

## Intended Impact

Eliminates repeated section/heading/prose patterns across the CV and future pages. Reduces the complexity of `CVLayout` (currently 123 lines of inline rendering) and provides tested building blocks for the timeline page.

## Context

### Repeated patterns in the current codebase

**Section with heading** — used 5 times in `components/cv-layout.tsx`:

```tsx
<section aria-labelledby="experience-heading" className="mb-6">
  <h2
    id="experience-heading"
    className="font-sans text-base md:text-lg font-medium text-foreground mb-4"
  >
    Experience
  </h2>
  {/* children */}
</section>
```

**Prose paragraph** — used 6+ times across `cv-layout.tsx`, `app/page.tsx`, `app/cv/[variant]/page.tsx`:

```tsx
<p className="font-serif text-base leading-prose text-foreground">
  <RichText>{paragraph}</RichText>
</p>
```

Note: after [02-tailwind-hygiene](02-tailwind-hygiene.plan.md), `leading-[1.7]` will be `leading-prose`. If that plan has not yet been applied, use `leading-[1.7]` instead.

**Article entry** — used for experience (4 entries) and foundations (3 entries) in `cv-layout.tsx`:

```tsx
<article className="flex flex-col">
  <h3 className="font-sans text-base font-medium text-foreground mb-1">{exp.organisation}</h3>
  <p className="font-sans text-sm text-foreground/70 mb-3">
    {exp.role} · {exp.start_year}–{exp.end_year}
  </p>
  <div className="flex flex-col gap-3">
    {exp.summary.map((paragraph, pIndex) => (
      <p key={pIndex} className="font-serif text-base leading-prose text-foreground">
        <RichText>{paragraph}</RichText>
      </p>
    ))}
  </div>
</article>
```

## Steps

### 1. Create `components/page-section.tsx`

```tsx
import type { ReactNode } from "react";

interface PageSectionProps {
  /** Section identifier — creates aria-labelledby="{id}-heading" */
  id: string;
  /** Visible heading text */
  heading: string;
  /** When true, heading is screen-reader-only */
  srOnly?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Semantic section with an accessible heading.
 * Renders a `<section>` with `aria-labelledby` linked to an `<h2>`.
 */
export function PageSection({
  id,
  heading,
  srOnly = false,
  children,
  className,
}: PageSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className={className}>
      <h2
        id={headingId}
        className={
          srOnly ? "sr-only" : "font-sans text-base md:text-lg font-medium text-foreground mb-4"
        }
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}
```

### 2. Create `components/prose.tsx`

```tsx
import { RichText } from "@/components/rich-text";

interface ProseProps {
  /** Text content (may contain markdown links) */
  children: string;
  className?: string;
}

/**
 * Body text paragraph with standard prose styling and rich text support.
 */
export function Prose({ children, className }: ProseProps) {
  return (
    <p className={`font-serif text-base leading-prose text-foreground ${className ?? ""}`.trim()}>
      <RichText>{children}</RichText>
    </p>
  );
}
```

Note: if `leading-prose` token is not yet defined (02-tailwind-hygiene not applied), use `leading-[1.7]`.

### 3. Create `components/article-entry.tsx`

```tsx
import type { ReactNode } from "react";

interface ArticleEntryProps {
  /** Entry heading (organisation name, foundation title, etc.) */
  heading: string;
  /** Metadata line (e.g. "Engineering Lead · 2019–present") */
  meta?: string;
  children: ReactNode;
}

/**
 * An article entry with heading, optional metadata, and body content.
 * Used for CV experience entries, foundation entries, and timeline items.
 */
export function ArticleEntry({ heading, meta, children }: ArticleEntryProps) {
  return (
    <article className="flex flex-col">
      <h3 className="font-sans text-base font-medium text-foreground mb-1">{heading}</h3>
      {meta && <p className="font-sans text-sm text-foreground/70 mb-3">{meta}</p>}
      {children}
    </article>
  );
}
```

### 4. Write RTL tests

All test files use the `// @vitest-environment jsdom` pragma.

**`components/page-section.integration.test.tsx`** — verify:

- Renders a `<section>` element
- Section has `aria-labelledby` matching the heading's `id`
- Heading text is visible when `srOnly` is false
- Heading has `sr-only` class when `srOnly` is true
- Children are rendered inside the section

**`components/prose.integration.test.tsx`** — verify:

- Renders a `<p>` element with the given text
- Handles markdown-style links via `RichText` (e.g. `[link text](url)` renders as `<a>`)

**`components/article-entry.integration.test.tsx`** — verify:

- Renders heading as `<h3>`
- Renders metadata when provided
- Does not render metadata `<p>` when `meta` is undefined
- Renders children

### 5. Run quality gates

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm test
```

All must pass, including the new RTL tests.

## Important Notes

- **TSDoc on all exported functions** — every component and its props interface must have TSDoc comments.
- **Type imports must be labelled** — use `import type { ReactNode } from "react"`.
- **Test naming convention** — `*.integration.test.tsx` (component tests are integration tests per the testing strategy).
- **Do not refactor CVLayout yet** — that is [sub-plan 06](06-cv-layout-refactor.plan.md). These components are created and tested in isolation first.
- **Do not extract more than these three** — resist the urge to extract further. These three cover the repeated patterns. If a component would be used only once, do not extract it.

## Acceptance Criteria

- [ ] `components/page-section.tsx` exists with TSDoc and correct props interface
- [ ] `components/prose.tsx` exists with TSDoc and uses `RichText`
- [ ] `components/article-entry.tsx` exists with TSDoc and correct props interface
- [ ] `components/page-section.integration.test.tsx` passes — tests semantic structure, aria, sr-only
- [ ] `components/prose.integration.test.tsx` passes — tests text rendering and markdown links
- [ ] `components/article-entry.integration.test.tsx` passes — tests heading, meta, children
- [ ] All tests use `// @vitest-environment jsdom` pragma
- [ ] `pnpm check` passes
- [ ] No existing files were modified (components are new; CVLayout refactor is separate)

## Files Affected

| File                                            | Changes |
| ----------------------------------------------- | ------- |
| `components/page-section.tsx`                   | New     |
| `components/page-section.integration.test.tsx`  | New     |
| `components/prose.tsx`                          | New     |
| `components/prose.integration.test.tsx`         | New     |
| `components/article-entry.tsx`                  | New     |
| `components/article-entry.integration.test.tsx` | New     |
