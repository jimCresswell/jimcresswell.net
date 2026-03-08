# Visual Regression Harness

## Overview

Complete and harden the non-destructive ref-to-ref visual regression harness at `visual-regression-harness/`. The harness already works end-to-end: it resolves refs read-only, exports them via `git archive`, builds in temporary directories, captures screenshots and HTML artefacts, compares them, and writes durable output under `regression-artifacts/`. What remains is improving artifact identity and reuse, resolving the current known semantic HTML differences with Jim, and ensuring the harness stays useful beyond the PKG refactor.

## Current state (2026-03-08)

### What exists

| File                                                       | Purpose                                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `visual-regression-harness/cli.ts`                         | Commander CLI entrypoint                                                      |
| `visual-regression-harness/compare-refs.ts`                | Orchestration: export, build, serve, capture, compare, clean up               |
| `visual-regression-harness/capture.ts`                     | Playwright capture of screenshots and HTML artifacts                          |
| `visual-regression-harness/compare.ts`                     | Pixel comparison, HTML comparison, diff artefact generation, review summaries |
| `visual-regression-harness/compare-refs.unit.test.ts`      | Unit coverage for same-commit short-circuit rules, including `WORKTREE`       |
| `visual-regression-harness/comparison-config.ts`           | Explicit HTML normalisation rules for comparison                              |
| `visual-regression-harness/export-ref.ts`                  | Read-only export for git refs plus the special `WORKTREE` snapshot mode       |
| `visual-regression-harness/shared.ts`                      | Route definitions, viewport, selectors, helpers                               |
| `visual-regression-harness/README.md`                      | Usage, safety model, artifact layout                                          |
| `visual-regression-harness/compare.unit.test.ts`           | Unit coverage for review summaries, HTML normalisation, and PNG artefacts     |
| `visual-regression-harness/export-ref.integration.test.ts` | Integration coverage for `WORKTREE` export semantics                          |

### What works

- `pnpm visual-regression-harness <base-ref> <target-ref>` runs end-to-end.
- Exports are read-only (`git rev-parse` + `git archive`); the caller's worktree, index, refs, and history are never touched.
- Same-commit short-circuit avoids unnecessary builds when base and target resolve to the same SHA.
- CLI failure path produces a clean error message and exit code 1.
- `comparison.json` records refs, resolved SHAs, and safety metadata.
- `summary.txt` and `diff/summary.json` record whether human review is required and which unexpected differences were found.
- Every PNG comparison writes both a diff PNG and a `*.review.png` review strip, even when the diff is blank.
- `document.html` comparison now strips build-specific Next.js/Vercel runtime noise explicitly before comparison.
- The special source value `WORKTREE` snapshots the current repository state, including staged, unstaged, and untracked non-ignored files.
- `visual-regression-harness/compare.unit.test.ts` covers the comparison contract with 9 unit tests.
- `visual-regression-harness/compare-refs.unit.test.ts` protects the same-commit short-circuit semantics for git refs versus `WORKTREE`.
- `visual-regression-harness/export-ref.integration.test.ts` proves `WORKTREE` export behaviour against a temporary git repo.
- `pnpm check` and the full `pnpm test:e2e` suite both passed
  sequentially on 2026-03-08 after the latest refinement
  slice.

### What the latest runs found

`pnpm visual-regression-harness b76824a WORKTREE` completed and produced artifacts under `regression-artifacts/visual-regression-harness/b76824a-vs-WORKTREE/`.

- 5 unexpected differences across `/`, `/cv`, and `/cv/public_sector`.
- 0 unexpected pixel differences across all captured screenshots.
- 1 unexpected JSON metadata difference (`/cv` canonical URL now present).
- The remaining `.diff.txt` files now reduce to two semantic categories:
  1. JSON-LD `<script type="application/ld+json">` blocks added to `main.html`
  2. the deliberate `/cv/` canonical-link addition, visible in both
     `cv/document.html.diff.txt` and `cv/metadata.json.diff.txt`
- Section-level `id` attributes (for example `id="positioning"`) are now
  auto-accepted only when they match the shared page/document contract in
  `lib/page-document-contract.ts` exactly.
- `document.html` now stays out of the unexpected set unless there is a real head/document change such as the deliberate `/cv/` canonical-link addition; chunk hashes, CSS filenames, Next.js flight payload noise, and root font-class hashes are explicitly normalised away.
- The diff directory now contains saved PNG diff files and `*.review.png` strips for every screenshot artefact, confirming that the visual surface remains unchanged even while semantic HTML differences remain.
- The final-tree `WORKTREE` run now differs from the earlier committed-`HEAD` run in one deliberate way: `/cv/` emits a canonical link, so the review set includes `cv/document.html.diff.txt` and `cv/metadata.json.diff.txt` as intentional document/metadata changes.
- Document-as-data integrity checks now exist in `lib/page-document-contract.ts`,
  `lib/search-structured-data.ts`, and their integration/E2E tests.
- `/cv` now emits an explicit canonical link, and tilt-route alias behaviour is
  proven end-to-end.
- Two isolated deliberate-bad-change probes are now recorded as fresh proof that the harness catches obvious visual regressions:
  1. `probe-commit-vs-commit/` compares a baseline commit against a follow-up commit with a hot-pink background change and records 22 PNG differences.
  2. `probe-commit-vs-worktree/` compares a baseline commit against an uncommitted hot-pink `WORKTREE` change and records the same 22 PNG differences.

### What does not exist yet

- Artifact directories keyed by resolved commit SHAs (currently label-based).
- Reuse detection: the harness always exports, builds, and captures from scratch.
- A `--force` flag (currently unnecessary because reuse is not implemented).
- Any formal acceptance or rejection of the current semantic HTML differences.

## Foundation discipline

Before each phase, re-read and re-commit to:

- `.agent/directives/AGENT.md`
- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`

Before each session, also read `.agent/memory/distilled.md` and scan `.agent/memory/napkin.md`.

## Phases

### Phase 1: Resolve the current semantic HTML differences

Key principle: the harness already has a recorded run with concrete diffs. The next step is human review, not more automation.

Intended impact: the current proof trail either becomes a formal acceptance record or a concrete fix list.

Acceptance criteria:

- Jim has reviewed the recorded `.diff.txt` files under `regression-artifacts/visual-regression-harness/b76824a-vs-WORKTREE/diff/`.
- Each category of difference is explicitly accepted or rejected.
- If accepted: the decision is recorded in the execution plan and the harness README.
- If rejected: the implementation is changed and the harness re-run until the comparison passes.

#### Tasks

1. **Present the current diff categories to Jim.**
   Description: present the remaining JSON-LD `<script type="application/ld+json">` additions in `main.html` plus the deliberate `/cv/` canonical-link addition, with one example `.diff.txt` excerpt per category.
   Impact: Jim can make an explicit accept/reject decision on the final remaining semantic HTML categories rather than reviewing raw diffs.
   Acceptance criteria: each category has a clear example; Jim's decision is recorded.

2. **If any category is rejected, fix the implementation and re-run.**
   Description: adjust the source code (or the harness comparison logic, if the difference is inherently build-specific noise) and re-run the harness.
   Impact: the proof trail shows a green comparison or a documented set of accepted exceptions.
   Acceptance criteria: `pnpm visual-regression-harness b76824a WORKTREE` either records no review items or records only explicitly accepted categories.

3. **Auto-accept graph-derived section IDs only when integrity checks prove them.** ✅ COMPLETE
   Description: teach the harness to treat section `id` additions as auto-accepted only when they match the expected values derived from the page/graph model. Any unexpected `id` change must remain a review item.
   Impact: known non-visual section anchors stop creating noise, while accidental or drifted identifiers still surface.
   Acceptance criteria: expected section `id` additions no longer appear as unexpected differences; an unknown `id` addition still does.

4. **Add document-as-data integrity checks.** ✅ COMPLETE
   Description: add automated checks proving that the rendered HTML sections and page-level graph data remain internally consistent. This includes expected section IDs, page identity/canonical rules, and graph-to-page alignment.
   Impact: structural HTML changes are justified by the data model instead of being hand-waved as harmless.
   Acceptance criteria: tests fail if a required section ID is missing, duplicated, unexpected, or inconsistent with the graph/page rules.

5. **Define the tilt-route identity rule.** ✅ COMPLETE
   Description: decide and document whether tilt routes are alternate presentations of the canonical CV page or distinct canonical documents with their own page-level graph identities.
   Impact: the repo stops carrying ambiguous behaviour for canonical tags, JSON-LD page nodes, and variant-specific rich-result expectations.
   Acceptance criteria: one durable doc records the rule, implementation matches it, and tests prove it.

6. **Validate JSON-LD for both schema correctness and rich-result fitness.** ✅ COMPLETE
   Description: keep the existing Schema.org validity checks, then add a second explicit validation layer for the subset of page JSON-LD intended to serve search-result consumers.
   Impact: page-level structured data is proven both as valid linked data and as fit-for-purpose search metadata, without limiting the wider graph richness.
   Acceptance criteria: automated checks fail if required rich-result-facing page fields drift or page identity becomes inconsistent.

### Phase 2: Commit-addressed artifact identity and reuse

Key principle: repeated runs should be cheap and unambiguous. A comparison between two specific commits should produce the same artifacts regardless of how the refs were named.

Intended impact: the harness becomes practical for iterative use during binding work and future refactors.

Acceptance criteria:

- Durable artifact directories are keyed by resolved commit SHAs, not user-supplied ref labels.
- The harness detects when captured artifacts for a given commit SHA already exist on disk and reuses them instead of rebuilding.
- `comparison.json` continues to record both the original ref labels and the resolved SHAs.
- Reuse is opt-out (a `--force` flag or similar) so stale artifacts can be regenerated when needed.

#### Tasks

1. **Switch durable directory naming to commit SHAs.**
   Description: change the default output path from `<base-label>-vs-<target-label>` to `<base-sha-short>-vs-<target-sha-short>`. Keep the full SHAs in `comparison.json`.
   Impact: the same comparison always lands in the same directory regardless of branch names or tag aliases.
   Acceptance criteria: `pnpm visual-regression-harness b76824a HEAD` and `pnpm visual-regression-harness main HEAD` produce the same output directory when they resolve to the same commits.

2. **Add per-commit capture reuse.**
   Description: before exporting and building a ref, check whether `baseline/<route>/full-page.png` (or another sentinel file) already exists for that resolved SHA in the artifacts directory. If it does, skip the export/build/capture for that side.
   Impact: re-running after a target-only change rebuilds only the target side.
   Acceptance criteria: a second run with the same base ref completes significantly faster than the first; artifacts are byte-identical.

3. **Add a `--force` flag to bypass reuse.**
   Description: when `--force` is passed, always export, build, and capture from scratch regardless of existing artifacts.
   Impact: stale or corrupt artifacts can be regenerated without manually deleting directories.
   Acceptance criteria: `--force` always produces fresh artifacts; without `--force`, existing artifacts are reused.

### Phase 3: Comparison refinement

Key principle: the comparison must distinguish between meaningful rendering differences and inherent build-specific noise so the harness is useful beyond a single refactor.

Intended impact: future users of the harness do not have to manually filter out Next.js chunk hashes from every `document.html` diff.

Acceptance criteria:

- Build-specific noise (chunk hashes, CSS filenames, RSC payload hashes) does not cause false positives in the comparison.
- Meaningful DOM differences (content, attributes, structure) still require review.
- The filtering approach is explicit and documented, not silently normalising.

Status (2026-03-08): completed for the current harness scope.

- `document.html` is normalised explicitly to remove build/runtime noise.
- Screenshot comparison remains strict; there are no screenshot exclusion masks.
- Differences now produce review artefacts and `requiresReview`, not a binary command failure.

#### Tasks

1. **Chosen filtering strategy.**
   Description: normalise `document.html` by stripping known build-specific runtime patterns while keeping `main.html`, section HTML, metadata, and screenshots strict.
   Impact: the harness distinguishes semantic HTML changes from independently-built Next.js runtime noise.
   Acceptance criteria: the strategy is recorded in the harness README and ADR-016.

2. **Keep the filtering narrow.**
   Description: if future build noise appears, update the explicit normalisation list rather than adding broad ignore rules or screenshot masks.
   Impact: the harness stays reviewable and trustworthy.
   Acceptance criteria: new normalisation is explicit, documented, and covered by unit tests.

## Reviewer protocol

After non-trivial harness changes, invoke the `code-reviewer` gateway. Expect triage to:

- `test-reviewer` for harness test changes
- `type-reviewer` for type flow and CLI/API surface changes
- `pkg-reviewer` when harness behaviour affects PKG proof decisions or graph-binding evaluation

## Documentation requirements

- Keep `visual-regression-harness/README.md` up to date with stable usage, safety, and artifact-layout guidance.
- Record stable architectural implications in `docs/architecture/README.md` or `docs/architecture/content-model.md` when the harness changes how proof work is performed.

## Quality gates

After each implementation slice:

- run `pnpm check`
- run `pnpm test:e2e`
- re-run the relevant `pnpm visual-regression-harness <base-ref> <target-ref>` comparison when the change affects proof output
- wait for all gates to complete before analysing issues
- if any gate fails, restart from `pnpm format:fix` after fixing the root cause

## Safety invariants

These must hold across all phases and must never be weakened:

- The harness must NEVER use `git reset`, `git checkout`, branch switching, rebases, or force operations.
- The harness must NEVER touch the caller's worktree, index, refs, or git history.
- The harness must NEVER silently normalise or auto-accept differences. Any filtering or auto-acceptance rule must be explicit, narrow, documented, and backed by product-owned validation.
- The only directories the harness may delete are its own temporary export directories under `os.tmpdir()`.
- The only directories the harness may write to durably are under `regression-artifacts/`.

## Key files

| File                                                                  | Purpose                                             |
| --------------------------------------------------------------------- | --------------------------------------------------- |
| `visual-regression-harness/`                                          | All harness source code                             |
| `visual-regression-harness/README.md`                                 | Usage, safety model, artifact layout                |
| `regression-artifacts/`                                               | Durable output (gitignored)                         |
| `regression-artifacts/visual-regression-harness/b76824a-vs-WORKTREE/` | Latest recorded run                                 |
| `docs/architecture/README.md`                                         | Permanent architecture doc referencing the harness  |
| `docs/architecture/content-model.md`                                  | Permanent content-model doc referencing the harness |

## Related

- [PKG execution plan](../current/personal-knowledge-graph-execution.plan.md) — the harness was built to serve the PKG regression proof; that plan has the broader context
- [visual-regression-harness/README.md](../../visual-regression-harness/README.md) — durable harness usage and safety guide
- [Roadmap](../roadmap.md) — overall work-stream status
