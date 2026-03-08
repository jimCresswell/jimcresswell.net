# Visual Regression Harness

## Overview

Complete and harden the non-destructive ref-to-ref visual regression harness at `visual-regression-harness/`. The harness already works end-to-end: it resolves refs read-only, exports them via `git archive`, builds in temporary directories, captures screenshots and HTML artifacts, compares them, and writes durable output under `regression-artifacts/`. What remains is improving artifact identity and reuse, resolving the current known DOM-only differences with Jim, and ensuring the harness passes quality gates and stays useful beyond the PKG refactor.

## Current state (2026-03-08)

### What exists

| File                                        | Purpose                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| `visual-regression-harness/cli.ts`          | Commander CLI entrypoint                                                |
| `visual-regression-harness/compare-refs.ts` | Orchestration: export, build, serve, capture, compare, clean up         |
| `visual-regression-harness/capture.ts`      | Playwright capture of screenshots and HTML artifacts                    |
| `visual-regression-harness/compare.ts`      | Pixel comparison (`pixelmatch`, `threshold: 0`) and raw text comparison |
| `visual-regression-harness/export-ref.ts`   | `git archive` based read-only export                                    |
| `visual-regression-harness/shared.ts`       | Route definitions, viewport, selectors, helpers                         |
| `visual-regression-harness/README.md`       | Usage, safety model, artifact layout                                    |

### What works

- `pnpm visual-regression-harness <base-ref> <target-ref>` runs end-to-end.
- Exports are read-only (`git rev-parse` + `git archive`); the caller's worktree, index, refs, and history are never touched.
- Same-commit short-circuit avoids unnecessary builds when base and target resolve to the same SHA.
- CLI failure path produces a clean error message and exit code 1.
- `comparison.json` records refs, resolved SHAs, and safety metadata.
- `diff/summary.json` records all failures; `.diff.txt` files record line-level text differences.
- `pnpm check:ci` and `pnpm test:e2e` both pass with the harness in the tree.

### What the latest run found

`pnpm visual-regression-harness b76824a HEAD` completed and produced artifacts under `regression-artifacts/visual-regression-harness/b76824a-vs-HEAD/`.

- 16 HTML/DOM failures across `/`, `/cv`, and `/cv/public_sector`.
- 0 pixel diff images (no `.png` artifacts in `diff/`).
- The recorded `.diff.txt` files show that section-level `id` attributes (e.g. `id="positioning"`, `id="experience"`) exist in `HEAD` but not in the pre-PKG baseline. This is the primary and possibly only cause of the HTML/DOM differences.
- The home page `document.html` diff also shows Next.js build-specific differences (chunk hashes, CSS filenames, RSC payload) and the addition of a `<script type="application/ld+json">` block in the target.

### What does not exist yet

- Artifact directories keyed by resolved commit SHAs (currently label-based).
- Reuse detection: the harness always exports, builds, and captures from scratch.
- Any formal acceptance or rejection of the current DOM-only differences.

## Foundation discipline

Before each phase, re-read and re-commit to:

- `.agent/directives/AGENT.md`
- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`

Before each session, also read `.agent/memory/distilled.md` and scan `.agent/memory/napkin.md`.

## Phases

### Phase 1: Resolve the current DOM-only differences

Key principle: the harness already has a recorded run with concrete diffs. The next step is human review, not more automation.

Intended impact: the current proof trail either becomes a formal acceptance record or a concrete fix list.

Acceptance criteria:

- Jim has reviewed the recorded `.diff.txt` files under `regression-artifacts/visual-regression-harness/b76824a-vs-HEAD/diff/`.
- Each category of difference is explicitly accepted or rejected.
- If accepted: the decision is recorded in the execution plan and the harness README.
- If rejected: the implementation is changed and the harness re-run until the comparison passes.

#### Tasks

1. **Present the current diff categories to Jim.**
   Description: categorise the recorded differences into (a) section-level `id` attributes from PKG HTML binding, (b) Next.js build-specific noise (chunk hashes, CSS filenames), and (c) the addition of the JSON-LD `<script>` block. Present each category with an example `.diff.txt` excerpt.
   Impact: Jim can make an informed accept/reject decision per category rather than reviewing raw diffs.
   Acceptance criteria: each category has a clear example; Jim's decision is recorded.

2. **If any category is rejected, fix the implementation and re-run.**
   Description: adjust the source code (or the harness comparison logic, if the difference is inherently build-specific noise) and re-run the harness.
   Impact: the proof trail shows a green comparison or a documented set of accepted exceptions.
   Acceptance criteria: `pnpm visual-regression-harness b76824a HEAD` either passes or fails only on explicitly accepted categories.

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
- Meaningful DOM differences (content, attributes, structure) still cause failures.
- The filtering approach is explicit and documented, not silently normalising.

#### Tasks

1. **Decide the filtering strategy with Jim.**
   Description: present options: (a) compare only the `main.html` and section-level artifacts, treating `document.html` as informational only; (b) normalise `document.html` by stripping known build-specific patterns before comparison; (c) keep strict comparison on all artifacts and accept that `document.html` will always differ between independently built refs.
   Impact: the harness's usefulness depends on whether it can distinguish signal from noise.
   Acceptance criteria: a strategy is chosen and recorded in the harness README.

2. **Implement the chosen filtering strategy.**
   Description: implement whichever approach Jim approves. If normalisation, add a clearly documented normalisation step. If informational-only, change `document.html` comparison to produce warnings rather than failures.
   Impact: the harness produces actionable results on every run.
   Acceptance criteria: `pnpm visual-regression-harness b76824a HEAD` either passes cleanly or fails only on genuine content/attribute differences.

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
- The harness must NEVER silently normalise or auto-accept differences. If filtering is added, it must be explicit and documented.
- The only directories the harness may delete are its own temporary export directories under `os.tmpdir()`.
- The only directories the harness may write to durably are under `regression-artifacts/`.

## Key files

| File                                                              | Purpose                                             |
| ----------------------------------------------------------------- | --------------------------------------------------- |
| `visual-regression-harness/`                                      | All harness source code                             |
| `visual-regression-harness/README.md`                             | Usage, safety model, artifact layout                |
| `regression-artifacts/`                                           | Durable output (gitignored)                         |
| `regression-artifacts/visual-regression-harness/b76824a-vs-HEAD/` | Latest recorded run                                 |
| `docs/architecture/README.md`                                     | Permanent architecture doc referencing the harness  |
| `docs/architecture/content-model.md`                              | Permanent content-model doc referencing the harness |

## Related

- [PKG execution plan](personal-knowledge-graph-execution.plan.md) — the harness was built to serve the PKG regression proof; that plan has the broader context
- [visual-regression-harness/README.md](../../visual-regression-harness/README.md) — durable harness usage and safety guide
- [Roadmap](roadmap.md) — overall work-stream status
