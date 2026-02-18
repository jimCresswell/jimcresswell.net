# Cloud Sub-Plan 02: Tailwind Hygiene — Canonical Classes and Design Tokens

**Parent plan:** [component-audit.plan.md](../component-audit.plan.md) — Parts 1.1 and 1.2
**Dependencies:** None
**Enables:** Cleaner classes across all components; tokens used in subsequent refactors

## Goal

Replace arbitrary Tailwind values that have canonical equivalents, and define design tokens for repeated custom values. This establishes a single source of truth for the project's visual constants.

## Intended Impact

Eliminates 13+ scattered arbitrary values in favour of named tokens and canonical classes. Makes the design system explicit and consistent before new components are added.

## Context

The project uses Tailwind CSS 4 with `@theme inline` in `app/globals.css`. Several arbitrary values have exact canonical equivalents, and several repeated arbitrary values should be design tokens.

## Steps

### 1. Replace arbitrary values with canonical equivalents

These replacements are mechanical — the values are identical:

| Arbitrary        | Canonical  | Occurrences                                                                                                                                                                                                     |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gap-[0.875rem]` | `gap-3.5`  | `app/cv/page.tsx`, `app/page.tsx`                                                                                                                                                                               |
| `min-h-[44px]`   | `min-h-11` | `components/theme-toggle.tsx`, `components/site-header.tsx`, `components/site-footer.tsx`, `components/download-pdf-link.tsx`, `app/not-found.tsx` (x2), `app/page.tsx`, `app/cv/pdf/unavailable/not-found.tsx` |

Search for each arbitrary value across the codebase and replace. Verify no occurrences of `gap-[0.875rem]` or `min-h-[44px]` remain in `.tsx` files after replacement.

**Important:** `sm:min-h-[44px]` in `site-footer.tsx` should become `sm:min-h-11`.

### 2. Define design tokens in `app/globals.css`

Add tokens to the existing `@theme inline` block for repeated custom values that represent deliberate design decisions:

```css
@theme inline {
  /* … existing tokens … */

  /* Content width — replaces max-w-[760px] (7 occurrences) */
  --width-content: 760px;

  /* Typography — page title sizes (4 occurrences) */
  --font-size-page-title: 2rem;
  --font-size-page-title-md: 2.625rem;

  /* Typography — body prose line-height (6+ occurrences) */
  --leading-prose: 1.7;
}
```

**Tailwind 4 namespace conventions:**

- `--width-*` enables `max-w-content`, `w-content`, etc.
- `--font-size-*` enables `text-page-title`, `text-page-title-md`
- `--leading-*` enables `leading-prose`

### 3. Replace arbitrary values with token-based utilities

After defining the tokens, replace the scattered arbitrary values:

| Arbitrary            | Token utility           | Files                                                                                                                                                                                   |
| -------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max-w-[760px]`      | `max-w-content`         | `app/page.tsx`, `app/cv/page.tsx`, `app/cv/[variant]/page.tsx`, `app/not-found.tsx`, `app/cv/pdf/unavailable/not-found.tsx`, `components/site-header.tsx`, `components/site-footer.tsx` |
| `text-[2rem]`        | `text-page-title`       | `app/page.tsx`, `app/not-found.tsx`, `app/cv/pdf/unavailable/not-found.tsx`, `components/cv-layout.tsx`                                                                                 |
| `md:text-[2.625rem]` | `md:text-page-title-md` | Same files as above                                                                                                                                                                     |
| `leading-[1.7]`      | `leading-prose`         | `app/page.tsx` (x2), `app/not-found.tsx`, `app/cv/pdf/unavailable/not-found.tsx`, `app/cv/[variant]/page.tsx`, `components/cv-layout.tsx` (x3+)                                         |

Search for each arbitrary value and replace with the token utility. Verify no occurrences of these arbitrary values remain in `.tsx` files (except `min-h-[60vh]` which is an intentional one-off in error pages).

### 4. Verify visually

Start the dev server (`pnpm dev`) and visually confirm the home page, CV page, and not-found page look identical to before. The changes are CSS-equivalent — no visual difference should exist.

### 5. Run quality gates

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm test
```

All must pass. If E2E tests are available, run `pnpm test:e2e` as a regression check.

## Acceptance Criteria

- [ ] No occurrences of `gap-[0.875rem]` in `.tsx` files (replaced with `gap-3.5`)
- [ ] No occurrences of `min-h-[44px]` or `sm:min-h-[44px]` in `.tsx` files (replaced with `min-h-11` / `sm:min-h-11`)
- [ ] `@theme inline` block in `globals.css` contains `--width-content`, `--font-size-page-title`, `--font-size-page-title-md`, and `--leading-prose`
- [ ] No occurrences of `max-w-[760px]` in `.tsx` files (replaced with `max-w-content`)
- [ ] No occurrences of `text-[2rem]`, `md:text-[2.625rem]`, or `leading-[1.7]` in `.tsx` files
- [ ] `min-h-[60vh]` remains unchanged (intentional one-off)
- [ ] `pnpm check` passes
- [ ] Visual appearance is unchanged

## Remaining Arbitrary Values (intentional, do not change)

- `min-h-[60vh]` — centred error page layout (2 occurrences). Genuine one-off.
- `tracking-[0.08em]` — CV headline letter-spacing in `cv-layout.tsx`. One-off.

## Files Affected

| File                                   | Changes                                                      |
| -------------------------------------- | ------------------------------------------------------------ |
| `app/globals.css`                      | Add 4 theme tokens to `@theme inline`                        |
| `app/page.tsx`                         | Replace arbitrary values with canonical/token classes        |
| `app/cv/page.tsx`                      | Replace `max-w-[760px]`, `gap-[0.875rem]`                    |
| `app/cv/[variant]/page.tsx`            | Replace `max-w-[760px]`, `leading-[1.7]`                     |
| `app/not-found.tsx`                    | Replace arbitrary values                                     |
| `app/cv/pdf/unavailable/not-found.tsx` | Replace arbitrary values                                     |
| `components/cv-layout.tsx`             | Replace `text-[2rem]`, `md:text-[2.625rem]`, `leading-[1.7]` |
| `components/site-header.tsx`           | Replace `max-w-[760px]`, `min-h-[44px]`                      |
| `components/site-footer.tsx`           | Replace `max-w-[760px]`, `sm:min-h-[44px]`                   |
| `components/download-pdf-link.tsx`     | Replace `min-h-[44px]`                                       |
| `components/theme-toggle.tsx`          | Replace `min-h-[44px]`                                       |
