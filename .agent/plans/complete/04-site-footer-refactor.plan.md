# Cloud Sub-Plan 04: SiteFooter — Reduce Internal Repetition

**Parent plan:** [component-audit.plan.md](../component-audit.plan.md) — Part 4
**Dependencies:** [01-rtl-setup](01-rtl-setup.plan.md) must be complete (RTL available for tests)
**Enables:** [07-root-layout-shell](07-root-layout-shell.plan.md) (footer should be clean before moving to root layout)

## Goal

Refactor `SiteFooter` to eliminate the repeated link className string and the verbose conditional rendering. Add an RTL integration test.

## Intended Impact

DRY within a single component — five near-identical link blocks become a data-driven loop. The component becomes easier to maintain and extend.

## Context

### Current state of `components/site-footer.tsx`

The component renders five links with nearly identical markup. Each external link repeats:

```tsx
className =
  "underline opacity-70 hover:opacity-100 transition-opacity py-2 sm:py-0 sm:min-h-11 flex items-center";
```

Note: after [02-tailwind-hygiene](02-tailwind-hygiene.plan.md), `sm:min-h-[44px]` will be `sm:min-h-11`. If that plan has not yet been applied, the arbitrary value may still be present — normalise it either way.

Each link is rendered with a separate conditional block (`links.email &&`, `links.linkedin &&`, etc.). This is verbose but not wrong — the problem is purely DRY.

### Current props interface

```tsx
interface SiteFooterProps {
  links?: {
    email?: string;
    linkedin?: string;
    github?: string;
    google_scholar?: string;
    shiv?: string;
  };
}
```

## Steps

### 1. Refactor link rendering to data-driven

Replace the five conditional blocks with a typed array and `.map()`:

```tsx
const externalLinks = [
  links.linkedin && { label: "LinkedIn", href: links.linkedin },
  links.github && { label: "GitHub", href: links.github },
  links.google_scholar && { label: "Google Scholar", href: links.google_scholar },
  links.shiv && { label: "Shiv", href: links.shiv },
].filter(Boolean);
```

Email is not an external link (no `<Link>`, no `target="_blank"`), so keep it separate — but extract the shared className into a const.

The rendering loop should produce the same HTML output as the current implementation. External links must retain `target="_blank"` and `rel="noopener noreferrer"`.

### 2. Preserve the component's public interface

The `SiteFooterProps` interface and the component's behaviour must not change. The refactor is internal only.

### 3. Write RTL integration test

Create `components/site-footer.integration.test.tsx` with `// @vitest-environment jsdom`:

**Test cases:**

- Renders copyright text with the current year and "Jim Cresswell"
- Renders all provided link labels (LinkedIn, GitHub, Google Scholar, Shiv)
- Renders email text (not as a link) when provided
- External links have `target="_blank"` and `rel="noopener noreferrer"`
- Omits links that are not provided (pass partial `links` object)
- Renders no nav element when `links` is undefined

**Mocking note:** The footer imports `frontpageContent` for the copyright name. This is a static JSON import — no mock needed. RTL will render the actual component.

### 4. Run quality gates

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm test
```

## Acceptance Criteria

- [ ] `SiteFooter` renders identical HTML output to before (same links, same attributes, same classes)
- [ ] No repeated className strings — shared styles are defined once
- [ ] Conditional link rendering uses a data-driven pattern (array + filter + map)
- [ ] `components/site-footer.integration.test.tsx` exists and passes
- [ ] Tests verify: link rendering, external link attributes, omission of missing links, copyright text
- [ ] Public interface (`SiteFooterProps`) is unchanged
- [ ] `pnpm check` passes

## Files Affected

| File                                          | Changes                                    |
| --------------------------------------------- | ------------------------------------------ |
| `components/site-footer.tsx`                  | Refactor internal rendering to data-driven |
| `components/site-footer.integration.test.tsx` | New — RTL test                             |
