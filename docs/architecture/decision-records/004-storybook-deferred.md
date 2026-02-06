# ADR-004: Storybook deferred in favour of RTL + Vitest

## Status

Accepted

## Date

2026-02-06

## Context

The site is about to grow from two content pages to three (home, CV, timeline). Before adding the third page, the component layer needs an audit and refactoring — extracting shared primitives, consolidating design tokens, and adding component-level tests where none currently exist.

The project has unit tests (Vitest, node environment) and E2E tests (Playwright), but no component integration tests. Two options were evaluated for filling this gap:

### Option A: Storybook 10.2 with Vitest addon

[Storybook 10.2](https://storybook.js.org/docs) offers a Vitest addon that transforms stories into real Vitest tests, running in a real browser (Chromium via Playwright's browser mode). The interaction testing API uses Testing Library queries (`canvas.getByRole()`, `userEvent.click()`, `expect(...).toBeInTheDocument()`) — the same API as standalone React Testing Library. Stories double as visual documentation and tests.

The Next.js integration is mature (`@storybook/nextjs-vite`), with support for `next/navigation` mocking, font optimisation, Tailwind via PostCSS, and module aliases. RSC support is experimental but functional for simple rendering.

**Advantages:**

- Real browser rendering (more accurate than jsdom for CSS and browser APIs).
- Visual catalogue documenting component states.
- Stories ARE the tests — no duplication between documentation and test files.
- IDE integration via Vitest extension shows pass/fail inline.

**Costs:**

- `.storybook/` config directory (main.ts, preview.ts, vitest.setup.ts).
- `@storybook/nextjs-vite` framework package plus dependencies.
- Vitest workspace configuration to separate story tests from unit tests.
- A second dev server process during development.
- Font mocking configuration (Google Fonts can fail in Storybook builds).
- Additional build artefact to maintain.

### Option B: React Testing Library + Vitest (jsdom)

Standard RTL with `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`. Component tests live next to their components as `.test.tsx` files, using per-file `// @vitest-environment jsdom` pragmas.

**Advantages:**

- Minimal setup (three dev dependencies, one setup file, one line in vitest.config.ts).
- No additional processes or config directories.
- Same Testing Library query API as Storybook's interaction tests.
- Proportionate to the component count (~12 components).

**Costs:**

- No visual catalogue.
- jsdom is a browser simulation, not a real browser (less accurate for CSS and some browser APIs).
- Test files are separate from any visual documentation.

## Decision

**Option B: RTL + Vitest (jsdom).**

The primary driver is proportionality. The site has approximately 12 components after the planned refactoring. Of those, only 2 are client components (`ThemeToggle`, `SiteHeader`). The rest are server components rendering semantic HTML with Tailwind classes. Their contracts are narrow: correct HTML structure, correct aria attributes, correct content rendering from props.

For these components, jsdom is sufficient. The tests verify semantic structure and content, not CSS rendering, animations, or browser-specific behaviour. Visual correctness is already covered by the existing Playwright E2E suite, which tests the full pages in a real browser.

Storybook's setup cost — config directory, framework package, workspace configuration, font mocking, second dev server — is not justified by the incremental benefit over RTL for a component set of this size and complexity.

### Revisit triggers

Adopt Storybook when either of these becomes true:

1. **Component count grows significantly** (20+ components with multiple visual states each) — the catalogue and documentation value justifies the setup overhead.
2. **Visual catalogue becomes a portfolio artefact** — if the Storybook instance itself is published and serves as a demonstration of craft.

### Migration path

The migration from RTL to Storybook interaction tests is low-friction. The Testing Library query API (`getByRole`, `getByText`, `findByRole`) and assertion matchers (`toBeInTheDocument`, `toBeVisible`, `toHaveBeenCalled`) are identical in both environments. Converting an RTL test into a Storybook interaction test is mechanical:

- The `render(<Component {...props} />)` call becomes a story definition with `args`.
- The assertions move into a `play` function.
- `screen.getByRole(...)` becomes `canvas.getByRole(...)`.
- The test logic does not change.

## Consequences

**Benefits:**

- Lighter setup — three dev dependencies and one config change, versus a full Storybook installation.
- No additional processes or build artefacts.
- Component tests run as part of the existing `pnpm test` command with no separate configuration.
- Proportionate to the site's current scale.

**Trade-offs:**

- No visual component catalogue. Component states are documented only in test assertions and the live site.
- jsdom does not perfectly replicate browser rendering. Edge cases involving CSS, focus management, or browser APIs may not be caught by component tests (though E2E tests cover these).
- If the component count grows, the lack of visual documentation may become a pain point, requiring the Storybook setup work to be done later.

## Related

- [Component audit plan](../../../.agent/plans/component-audit.plan.md) — the refactoring plan that prompted this decision
- [Storybook 10.2 docs](https://storybook.js.org/docs) — the evaluated version
- [Storybook Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) — the specific testing integration evaluated
- [Storybook Next.js Vite framework](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite) — the Next.js integration
