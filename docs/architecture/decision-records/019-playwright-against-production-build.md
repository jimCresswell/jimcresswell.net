# ADR-019: Playwright runs against a production build

## Status

Accepted

## Date

2026-04-18

## Context

The E2E suite previously ran against `pnpm dev` (Next.js dev server with
Turbopack). Two recurring categories of dev-server flake bit the suite from
late 2026-03 onwards:

1. **Turbopack `Runtime ChunkLoadError` overlay.** On first navigation to
   non-root routes (e.g. `/cv/public_sector`, `/cv/pdf/unavailable`,
   `/non-existent-route`), the dev server intermittently rendered an error
   overlay instead of the route content. The failing chunk was always a
   `*.development.js` bundle, confirming the failure mode was dev-only.
2. **Next.js dev-tools issue badge.** After upgrading to 16.2.4, axe checks
   on `/cv/pdf/unavailable` failed because the dev-tools "Issues (1)" badge
   appeared in the DOM and triggered accessibility violations on a
   dev-mode-only UI element.

The repo carried narrow, per-route stabilising helpers in `e2e/support/`
that reloaded once when the overlay appeared. Each affected route needed
its own helper. Each new route would have needed another. The pattern was
spreading and treating the symptom rather than the cause.

The PDF E2E tests already ran against a separate Playwright project named
`with-build` on port 3001, because the PDF only exists after `pnpm build`
(its `postbuild` script generates the file). Running them required a
manual production server.

### Options evaluated

1. **Spread the stabilising-helper pattern.** Add overlay-reload helpers
   for `/`, `/cv`, link navigation, and any future routes. Treats the
   symptom; pays a per-test tax forever; the dev-tools badge problem
   would still need a separate workaround.
2. **Upgrade Next.js and re-evaluate.** The dev overlay flagged the
   16.1.6 → 16.2.4 staleness. Upgrading alone did not stop the
   chunk-load flake and surfaced the dev-tools badge problem. Useful as a
   first step but not sufficient.
3. **Run E2E against a production build.** Use `pnpm build && pnpm start`
   as the Playwright web server. Removes both dev-only failure modes at
   the source. Build adds ~15 s on cold start; subsequent runs reuse the
   server locally. The PDF is part of the build, so the `with-build`
   project collapses into the default project.

## Decision

**Run the Playwright suite against a production build.**

`playwright.config.ts` now defines a single `default` project whose web
server runs `pnpm build && pnpm start --port 3000` with a 120-second
timeout. `reuseExistingServer: true` outside CI keeps local re-runs fast.

The previous `with-build` project is removed; `*.with-build.*` test files
are renamed to standard names. PDF tests run alongside everything else
because `pnpm build` generates the PDF as part of its postbuild script.

The dev-overlay reload-once branches in `e2e/support/cv-variant.ts`,
`e2e/support/not-found.ts`, and `e2e/support/pdf-unavailable.ts` are
removed as no longer needed.

### Why this is the right layer

The behaviour we want to prove is **what users see in production**.
Dev-server transient overlays and dev-tools UI are not part of that
contract; they should never appear in our test evidence. Eliminating them
at the source — by running against the production artefact — is more
honest than papering over them in test code.

### Why we still keep `pnpm dev` for local development

Developer iteration speed still benefits from `pnpm dev` (HMR, fast
recompiles, dev-tools). The rule is not that dev mode is forbidden, only
that **E2E behavioural proof runs against the production build**. Unit
and integration tests under Vitest are unaffected.

## Consequences

**Benefits:**

- No more Turbopack chunk-load overlay flakes in E2E.
- No more dev-tools issue badge contaminating axe results.
- One Playwright project instead of two; PDF tests no longer need a
  manual production server.
- Test artefacts reflect what visitors actually see.

**Trade-offs:**

- Initial cold start adds ~15 s for the build. Local re-runs reuse the
  built artefact and start the existing server, so the cost is paid once
  per worktree change.
- A bug that only manifests in dev mode would not be caught by this
  suite. That is acceptable — dev-mode-only bugs do not affect users.

## Related

- `.agent/directives/principles.md` — Quality gates section
- `playwright.config.ts` — Single default project, web server runs the
  production build
- `e2e/README.md` — Updated test map and running instructions
- ADR-001 — Build-time PDF generation (the postbuild script that makes
  PDF tests work in any production build)
