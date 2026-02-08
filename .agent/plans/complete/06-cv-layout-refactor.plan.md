# Cloud Sub-Plan 06: CVLayout Refactor — Use Section Primitives

**Parent plan:** [component-audit.plan.md](../component-audit.plan.md) — Part 3.3
**Dependencies:** [03-section-primitives](03-section-primitives.plan.md) must be complete (PageSection, Prose, ArticleEntry exist)
**Enables:** [07-root-layout-shell](07-root-layout-shell.plan.md)

## Goal

Refactor `CVLayout` from a 123-line monolith with repeated inline patterns into a clean assembly of `PageSection`, `ArticleEntry`, and `Prose` components. Also decouple it from the direct `cvContent` import by receiving content as props.

## Intended Impact

`CVLayout` becomes a declarative composition of tested primitives. It is testable with injected props and no longer coupled to a specific JSON file. This pattern supports the timeline page and CV variants.

## Context

### Current state of `components/cv-layout.tsx`

- 123 lines, rendering 5 sections inline (header, positioning, experience, foundations, capabilities, education)
- Imports `cvContent` directly from `@/lib/cv-content` — hard coupling to data source
- Repeats `<section aria-labelledby>` + `<h2>` pattern 5 times
- Repeats `<article>` + `<h3>` + metadata + prose pattern for experience and foundations
- Repeats `font-serif text-base leading-[1.7] text-foreground` class string 6+ times (or `leading-prose` after tailwind hygiene)
- Accepts a single `positioning: ReactNode` prop

### After this refactor

- `CVLayout` receives all content as props (typed interface)
- Uses `PageSection` for each section
- Uses `ArticleEntry` for experience and foundation entries
- Uses `Prose` for body paragraphs
- Header section remains inline (it has unique structure — name, email, headline)
- Significantly shorter, with each section as a clear compositional block

## Steps

### 1. Define a content props interface

Create a typed interface for the content that `CVLayout` needs. This should match the shape of the current `cvContent` usage:

```tsx
interface CVContentProps {
  meta: {
    name: string;
    headline: string;
  };
  links: {
    email: string;
  };
  experience: Array<{
    organisation: string;
    role: string;
    start_year: string;
    end_year: string;
    summary: string[];
  }>;
  foundations: Array<{
    title: string;
    description: string[];
  }>;
  capabilities: string[];
  education: Array<{
    degree: string;
    field: string;
    institution: string;
  }>;
}

interface CVLayoutProps {
  content: CVContentProps;
  positioning: ReactNode;
}
```

### 2. Refactor the component body

Replace inline patterns with the extracted primitives:

**Positioning:**

```tsx
<PageSection id="positioning" heading="Positioning" srOnly>
  {positioning}
</PageSection>
```

**Experience:**

```tsx
<PageSection id="experience" heading="Experience" className="mb-6">
  <div className="flex flex-col gap-6">
    {content.experience.map((exp, index) => (
      <ArticleEntry
        key={index}
        heading={exp.organisation}
        meta={`${exp.role} · ${exp.start_year}–${exp.end_year}`}
      >
        <div className="flex flex-col gap-3">
          {exp.summary.map((paragraph, pIndex) => (
            <Prose key={pIndex}>{paragraph}</Prose>
          ))}
        </div>
      </ArticleEntry>
    ))}
  </div>
</PageSection>
```

**Foundations:** Same pattern as experience but with `foundation.title` as heading and `foundation.description` as prose.

**Capabilities and Education:** These have unique list structures. Use `PageSection` for the wrapper but keep the list rendering inline — `Prose` and `ArticleEntry` don't fit here.

### 3. Update call sites

The two files that render `CVLayout` must now pass `content`:

**`app/cv/page.tsx`:**

```tsx
<CVLayout content={cvContent} positioning={<BasePositioning />} />
```

**`app/cv/[variant]/page.tsx`:**

```tsx
<CVLayout content={cvContent} positioning={variantPositioning} />
```

Both already import `cvContent` from `@/lib/cv-content`, so the change is small.

### 4. Write RTL integration test

Create `components/cv-layout.integration.test.tsx` with `// @vitest-environment jsdom`.

**Test with injected fake content** — do not import the real JSON:

```tsx
const fakeContent = {
  meta: { name: "Test Person", headline: "Test Headline" },
  links: { email: "test@example.com" },
  experience: [
    {
      organisation: "Acme",
      role: "Lead",
      start_year: "2020",
      end_year: "2024",
      summary: ["Did things."],
    },
  ],
  foundations: [{ title: "Foundation A", description: ["Description paragraph."] }],
  capabilities: ["Capability one", "Capability two"],
  education: [{ degree: "BSc", field: "Computer Science", institution: "University of Test" }],
};
```

**Test cases:**

- Renders the person's name as `<h1>`
- Renders email
- Renders headline
- Renders positioning content (passed as ReactNode)
- Renders experience section with heading, entry heading, metadata, and prose
- Renders foundations section with heading and prose
- Renders capabilities as a list
- Renders education with degree, field, and institution
- All sections have correct `aria-labelledby` attributes

### 5. Run quality gates

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm test
```

If E2E tests are available, run `pnpm test:e2e` — the CV page should look and behave identically.

## Important Notes

- **Do not change the HTML output** — the refactor should produce semantically equivalent markup. Print styles and E2E tests depend on the existing structure (e.g. `section[aria-labelledby="experience-heading"]`).
- **Do not over-extract** — the header (name, email, headline) is unique to the CV. Keep it inline.
- **Do not change `CVLayoutProps` beyond adding `content`** — the `positioning` prop pattern is intentional.
- **TSDoc on the new interface and updated component.**

## Acceptance Criteria

- [ ] `CVLayout` accepts a `content` prop with a typed interface
- [ ] `CVLayout` no longer imports `cvContent` directly
- [ ] `PageSection` is used for positioning, experience, foundations, capabilities, and education sections
- [ ] `ArticleEntry` is used for experience and foundation entries
- [ ] `Prose` is used for body paragraphs in experience and foundations
- [ ] Call sites (`app/cv/page.tsx`, `app/cv/[variant]/page.tsx`) pass `content={cvContent}`
- [ ] `components/cv-layout.integration.test.tsx` exists and passes with injected fake content
- [ ] HTML output is semantically equivalent (same section IDs, same heading structure)
- [ ] `pnpm check` passes
- [ ] E2E tests pass (if available to run)

## Files Affected

| File                                        | Changes                                              |
| ------------------------------------------- | ---------------------------------------------------- |
| `components/cv-layout.tsx`                  | Major refactor — use primitives, accept content prop |
| `components/cv-layout.integration.test.tsx` | New — RTL test                                       |
| `app/cv/page.tsx`                           | Pass `content={cvContent}` to `CVLayout`             |
| `app/cv/[variant]/page.tsx`                 | Pass `content={cvContent}` to `CVLayout`             |
