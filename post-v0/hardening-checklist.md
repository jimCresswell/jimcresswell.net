# Post-v0 Hardening Checklist

After exporting from v0 to local code, work through this checklist before deploying to production.

## Suggested Order of Work

1. Build/typecheck/lint → fix hard failures
2. SSR/theme/hydration correctness
3. Accessibility pass + contrast states
4. Content integrity + schema validation
5. Metadata + JSON-LD embedding validation
6. Performance cleanup
7. Security headers + external link hygiene
8. Minimal tests + screenshots
9. Final copy/tone polish

---

## 1. Freeze the Baseline

Before touching anything:

- [ ] **Commit the raw v0 export as-is** — tag it `v0-export/<date>`
- [ ] **Record toolchain versions**: Node, pnpm, Next.js
  - Add to README or `.tool-versions`
  - Makes CI reproducible, avoids "works on my machine" drift

---

## 2. Build Integrity

Make it compile, typecheck, lint:

- [ ] Run `next build` — fix all errors and warnings
  - v0 output can be "dev-ok" but prod-fragile
- [ ] Enable TypeScript strictness (`strict: true` in tsconfig)
  - Consider `noUncheckedIndexedAccess` if tolerable
- [ ] ESLint: use `next/core-web-vitals`, remove broad disables
- [ ] Treat warnings as errors during initial hardening

---

## 3. App Router Correctness (SSR/RSC Hygiene)

- [ ] **Eliminate hydration warnings** and React key warnings
  - These often signal real SSR/client boundary issues
- [ ] **Audit `"use client"` placement**
  - Move client-only state/handlers into leaf components
  - Keeps RSC benefits and reduces client bundle size
- [ ] **Check dynamic usage** (`cookies()`, `headers()`, `useSearchParams`)
  - Ensure these don't unintentionally force dynamic rendering

---

## 4. Content Integrity

Stop drift between JSON and pages:

- [ ] **Create a single content loading layer** (e.g. `src/content/*`) with schema validation (Zod)
- [ ] **Search for hard-coded strings** introduced by v0
  - Replace with canonical content fields from `content/*.json`
- [ ] **Enforce "no invention" rule** in code review
  - No new claims, no new metrics, no paraphrasing of factual statements
  - CV correctness > polish

---

## 5. Accessibility (WCAG 2.2 AA)

Make it provable:

- [ ] **Landmarks + headings audit**
  - One `h1` per page, correct nesting (h1 → h2 → h3)
- [ ] **Keyboard-only pass**
  - Tab order, focus visibility, skip link, no focus traps
- [ ] **Reduced motion** (`prefers-reduced-motion`) for any animations
  - v0 often adds motion as decoration
- [ ] **Contrast checks across states** (hover/active/disabled) in both themes
  - Base palette may pass, component states may fail
- [ ] **Icon and decorative SVG audit**
  - Decorative = `aria-hidden="true"`
  - Meaningful = properly labelled

---

## 6. Theming Robustness (Light/Dark)

- [ ] **Theme toggle is SSR-safe**
  - No flash of wrong theme, no hydration mismatch
  - Common v0 issue
- [ ] **Audit "accent as fill" usage**
  - If accent is used as background, ensure text color meets contrast
  - Use page background color for text, not foreground (per theme.json constraint)

---

## 7. SEO + Metadata + Structured Data

- [ ] **Per-route metadata**: unique titles, descriptions, canonical URLs
- [ ] **Validate JSON-LD on rendered pages** (not just the JSON file)
  - The embed is what search engines see
  - Use Google Rich Results Test
- [ ] **Add `robots.txt` + `sitemap.xml`** (or Next.js metadata routes)
- [ ] **OpenGraph verification**
  - Correct image paths and dimensions
  - Per-route values (especially for CV variants)
  - Test with social preview tools

---

## 8. Performance Hardening

- [ ] **Fonts**: Confirm `next/font` (Inter/Literata), no remote CSS font loading
- [ ] **Images**: `next/image` with explicit dimensions (prevents layout shift)
- [ ] **Bundle analysis**: Check for accidental heavy deps and client-side bloat
  - v0 sometimes introduces UI libs you don't need
- [ ] **Kill gratuitous animation/visual effects** if they impact LCP/INP
  - "Pretty" is not worth sluggish
- [ ] **Lighthouse targets**: 95+ across categories (mobile + desktop)

---

## 9. Security + Privacy Hygiene

- [ ] **No PII regression**: Confirm only `contact@jimcresswell.net` is present
  - Easy to leak via boilerplate contact sections
- [ ] **External links**: `rel="noopener noreferrer"` when `target="_blank"`
- [ ] **Security headers** (see `deployment-notes.md` for implementation):
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (minimal)
  - CSP: start in report-only if unsure

---

## 10. Testing

Minimal, high-ROI regression net:

- [ ] **Playwright smoke tests**:
  - Home loads
  - CV route loads
  - Theme toggle works
  - Keyboard navigation basic path
- [ ] **Screenshot regression** (light/dark, mobile/desktop) for key pages
  - Protects design intent and typography
- [ ] **axe-core accessibility scan** in dev mode

See `testing-strategy.md` for detailed implementation.

---

## 11. Codebase Cleanup

Reduce maintenance tax:

- [ ] **Remove unused components, pages, and dependencies** introduced by v0
  - Avoid dead code accumulation from day 1
- [ ] **Normalize file structure** to your preferred conventions
  - Makes the repo feel "owned" rather than "generated"
- [ ] **Add README.md**: dev commands, deployment, content editing workflow

---

## 12. Release Checklist

Before public deploy:

- [ ] Lighthouse pass (mobile + desktop), address obvious warnings
- [ ] 404/500 handling works, no console errors in prod build
- [ ] Analytics (if any) is privacy-respecting and not harming performance
- [ ] OpenGraph previews verified for `/` and `/cv`
- [ ] Final editorial pass: remove any v0 "portfolio marketing" phrasing
- [ ] Tag release: `v1.0.0` or similar
