---
name: Tilt Retirement
overview: Retire the live `/cv/[variant]` tilt routes, the `HeadlineToggle`, and tilt-specific content fields. Preserve the tilt content and the canonical-alias rationale as a discoverable reference document so future re-introduction has a real starting point. Supersede ADR-017.
todos:
  - id: capture-current-tilt-surface
    content: Inventory every tilt-related surface in code, content, tests, ADRs, EDRs, and docs.
    status: pending
  - id: write-reference-doc
    content: Populate docs/architecture/reference/cv-tilt-content-and-rationale.md with the preserved tilt content and rationale.
    status: pending
  - id: retire-routes-and-components
    content: Remove the variant route, the HeadlineToggle component, the variant-related lib code, and the tilt fields in cv.content.json.
    status: pending
  - id: retire-tests-and-fixtures
    content: Remove tilt-targeted tests and fixtures; rewrite assertions that incidentally exercised tilt routes.
    status: pending
  - id: supersede-adr-017
    content: Mark ADR-017 as superseded and write the new ADR that records canonical-only CV identity.
    status: pending
  - id: reconcile-docs
    content: Update content-model.md, README, EDRs that reference tilts, and other docs in the same pass.
    status: pending
isProject: true
---

# Tilt Retirement

## Status

Adopted on 2026-04-18 as the code-work counterpart to the Track B scope decision
in
[`../active/personal-knowledge-graph-source-of-truth-design.plan.md`](../active/personal-knowledge-graph-source-of-truth-design.plan.md).

The Track B design now scopes to a single canonical CV view. This plan removes
the live tilt surface so that scope reflects reality, and preserves the tilt
content and canonical-alias rationale as a discoverable reference doc so the
door is genuinely open if tilts return.

## Outcome, impact, and value mechanism

**Outcome:** the site exposes one canonical CV at `/cv/`, with no live tilt
routes, no `HeadlineToggle`, and no variant-specific content fields. The tilt
content and the ADR-017 canonical-alias rationale are preserved as a
discoverable architecture reference document.

**Impact:** Track B can credibly close around a single canonical view; the
codebase stops carrying primitives for a feature that has no committed product
requirement; future tilt re-introduction starts from real preserved material
rather than archaeology.

**Value mechanism:** removing live tilt surface area cuts maintenance cost
(tests, snapshots, harness diffs, content schema) and removes the largest
source of design ambiguity from Track B. Preserving the content as reference
keeps optionality without keeping cost.

## Boundaries

- This is code-and-content work. It is not editorial work — the canonical
  positioning paragraphs, headline, and capabilities are unchanged.
- This plan does not touch the LinkedIn plan, the dev-tooling-hygiene plan, or
  Track B design. They run in parallel.
- This plan does not introduce graph-backed rendering. Visible HTML for `/cv/`
  remains file-driven from `content/cv.content.json` until later Track B
  adoption work.
- The new reference doc lives under `docs/architecture/reference/`. It is a
  permanent doc, not a plan; once written, only update it if rationale changes.

## Phases

### Phase 1 — Inventory and preservation

**Goal:** capture the full current tilt surface, then write the reference
document so nothing is lost when the code is removed.

**Impact:** subsequent retirement slices have a complete deletion checklist
and a real preservation target.

**Value mechanism:** doing the inventory and reference-doc capture first means
the deletion phase cannot accidentally lose content or rationale.

**Acceptance criteria:**

- a written inventory exists in this plan covering: routes, components,
  library code, content fields, tests, fixtures, ADRs, EDRs, and docs that
  reference tilts
- `docs/architecture/reference/cv-tilt-content-and-rationale.md` exists with:
  the preserved tilt content (alt headline, all three tilt positioning
  paragraphs, the `tilts._meta` structure), the canonical-alias rules from
  ADR-017, the rationale for each rule, and a "If tilts return" section
  pointing at the B1 layer map's tilt-implications section
- the reference doc is linked from `docs/architecture/README.md` and from the
  ADR that supersedes ADR-017

#### Tasks

##### Task 1.1 — Inventory tilt surface

**Outcome:** a deletion checklist embedded in this plan.

**Acceptance criteria:**

- code surfaces named: `app/cv/[variant]/page.tsx`,
  `components/headline-toggle.tsx`, the variant logic in
  `lib/cv-content.ts` (`activeTiltKeys`, `getTilt`, `isActiveTiltKey`),
  `lib/page-document-contract.ts` variant entries, sitemap entries
- content surfaces named: `meta.headline_alt`, the `tilts` block (and
  `tilts._meta`) in `content/cv.content.json`, the snapshot
  `__snapshots__/cv-content-pre-migration.json`
- test surfaces named: `e2e/journeys/cv-variant.e2e-ui.test.ts`,
  `e2e/support/cv-variant.ts`, plus assertions inside accessibility,
  content-integrity, and SEO E2E tests that target `/cv/public_sector`
- doc surfaces named: ADR-017 (to be superseded), any EDR referencing tilts,
  `docs/architecture/content-model.md`, `README.md`, the napkin/distilled
  references that should remain historical

##### Task 1.2 — Write the tilt reference doc

**Outcome:** `docs/architecture/reference/cv-tilt-content-and-rationale.md` is
populated and linked.

**Acceptance criteria:**

- the doc captures every tilt content field verbatim from
  `content/cv.content.json` at the time of writing (alt headline, all tilt
  positioning prose, `tilts._meta.order` and `tilts._meta.web_routes`)
- the doc captures the canonical-alias rules from ADR-017 with rationale
- the doc names the re-entry conditions (real product requirement; start
  from this doc + B1 layer map)
- `docs/architecture/README.md` links the new reference doc
- the document is linked from the new superseding ADR (Phase 3)

### Phase 2 — Remove the live tilt surface

**Goal:** delete tilt routes, components, library code, content fields, tests,
and fixtures, restart-on-fix through the gate sequence, and verify the site
still renders correctly.

**Impact:** the live surface no longer claims to support tilts.

**Value mechanism:** removing the surface in one coherent slice keeps the
gates honest and prevents a half-retired state where some surfaces still
expect tilts.

**Acceptance criteria:**

- `app/cv/[variant]/page.tsx` is deleted
- `components/headline-toggle.tsx` is deleted (or refactored to a static
  headline if the canonical headline is preserved without toggle)
- variant-only exports in `lib/cv-content.ts` are removed
- variant entries in `lib/page-document-contract.ts` and the sitemap are
  removed
- tilt fields are removed from `content/cv.content.json` after the reference
  doc captures them
- tilt-targeted tests and fixtures are deleted, not skipped
- assertions in shared E2E suites that incidentally exercised
  `/cv/public_sector` are rewritten to target `/cv/`
- `pnpm check` and `pnpm test:e2e` pass cleanly
- the visual regression harness is run during this phase because rendering
  output changes; differences are reviewed and approved
- no commented-out tilt code remains
- no `as`, `any`, or `!` introduced

#### Tasks

##### Task 2.1 — Remove routes and components

**Outcome:** route and component code deleted; build still passes.

**Acceptance criteria:**

- next build passes
- typecheck passes
- 404 behaviour for `/cv/anything` is verified

##### Task 2.2 — Remove content fields

**Outcome:** tilt content removed from `cv.content.json` and pre-migration
snapshot, after preservation in the reference doc.

**Acceptance criteria:**

- `meta.headline_alt` and the `tilts` block are removed
- if the snapshot is regenerated, the regeneration is committed in the same
  slice
- `pnpm test` passes

##### Task 2.3 — Remove tests and fixtures

**Outcome:** tilt-specific tests deleted; shared tests cleaned of tilt
references.

**Acceptance criteria:**

- `e2e/journeys/cv-variant.e2e-ui.test.ts` deleted
- `e2e/support/cv-variant.ts` deleted
- accessibility / content-integrity / SEO E2E suites no longer reference
  `public_sector` or any other variant key
- no `.skip` or commented-out tests left behind
- `pnpm test:e2e` passes

### Phase 3 — Supersede ADR-017 and reconcile docs

**Goal:** record the architectural change in an ADR and reconcile every
authored doc that references tilts.

**Impact:** the ADR record reflects current architecture; future readers do
not chase superseded rules.

**Value mechanism:** without explicit supersession, a future agent will find
ADR-017 marked Accepted and design against rules that no longer apply.

**Acceptance criteria:**

- ADR-017 status changes from `Accepted` to `Superseded by ADR-NNN`
- a new ADR is written stating: `/cv/` is the only canonical CV route; there
  are no canonical aliases; the page document contract has no variant entries;
  re-introduction of tilts requires a new ADR that explicitly references the
  reference doc
- `docs/architecture/content-model.md` no longer describes tilt routes
- `docs/architecture/README.md` ADR list reflects the supersession and links
  the reference doc
- `README.md` (repo root) is checked for tilt references and updated
- EDRs are scanned; any that asserted facts contingent on tilt behaviour are
  updated or annotated
- `pnpm check` and `pnpm practice:fitness:informational` pass

#### Tasks

##### Task 3.1 — Write the superseding ADR

**Outcome:** new ADR exists; ADR-017 marked superseded.

**Acceptance criteria:**

- the new ADR follows the existing ADR template
- it explicitly references the tilt reference doc as the future re-entry
  starting point
- ADR-017 has a `Superseded by` line pointing at the new ADR

##### Task 3.2 — Reconcile content-model and README docs

**Outcome:** authored docs match the new reality.

**Acceptance criteria:**

- no live doc claims tilt routes exist
- no live doc points readers at ADR-017 without flagging supersession
- the reference doc is discoverable from at least the architecture README and
  the new ADR

##### Task 3.3 — Reconcile plan stack and napkin entry

**Outcome:** plans and memory reflect retirement completion.

**Acceptance criteria:**

- this plan moves from `current/` to `archive/` once Phase 3 closes
- `roadmap.md` Active table row for tilt retirement updates to `Complete` and
  the Deferred table re-entry pointer reads correctly post-retirement
- `napkin.md` records the slice with mistakes-made and patterns-to-remember

## Reviewer expectations

- `code-reviewer` — gateway for every retirement slice
- `type-reviewer` — when removing variant types and the page document contract
  variant entries
- `test-reviewer` — when deleting tilt-targeted tests and rewriting shared
  suites; verify no behaviour-as-implementation tests are accidentally
  protected
- `pkg-reviewer` — for the new ADR and any JSON-LD impact
- `editor` — only if the canonical headline / positioning copy changes (it
  should not in this plan)

## Proof posture

- this plan changes rendering and content; the visual regression harness is
  required during Phase 2 on each rendering-affecting slice, not deferred
- Playwright E2E full pass required after Phase 2 and Phase 3
- `pnpm practice:fitness:informational` after Phase 3 doc reconciliation
