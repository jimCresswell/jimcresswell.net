---
id: estate-fix-backlog
node_type: delivery
name: Estate fix backlog — open pull requests to zero, then known defects in value order
overview: >-
  Land or close every open pull request, then work the estate's known defects
  and owner-approved corrections in a fixed value order, at most three open
  pull requests at a time, with routed review findings recorded here instead
  of each becoming its own pull request.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates:
  - awaiting: external-input
    clears_when: >-
      The owner re-pastes the cloud environment setup script from main, starts
      one cloud session, and reports the image's `bash --version` and
      `command -v bash`; the bash version floor slice is sized from that
      measurement.
    expires: 2026-10-08
last_updated: 2026-09-17
---

# Estate fix backlog

## Goal

The count of open pull requests reaches zero and stays near it. Known defects
and the corrections the owner approved on 2026-09-17 are worked in one
published order, so each session starts from a stated next step, and fixing
ends instead of looping.

## User groups and value

- **The owner:** no open pull request to chase, one place that says what is
  being fixed next and why, and decisions asked once. The owner's word of
  2026-09-17 set this goal: "bring the number of open PRs down to zero via
  normal procedures".
- **Agents working the estate:** a definite next slice, a limit on how much
  is in flight, and a home for review findings that do not earn a pull
  request.
- **Site visitors:** no direct experience of this work. The value reaches
  them only through an estate that stops absorbing the attention the site
  needs.

## Mechanism

1. **Close out before starting.** Every open pull request is landed or closed
   through `pr-lifecycle`, in the order under §Close-out. No backlog slice
   opens a pull request until the open count reaches zero.
2. **Triage decides whether a finding becomes a pull request.** Loops grew
   while each true review finding became its own follow-up pull request,
   which drew findings of its own (2026-09-16 and 2026-09-17). From here on,
   `pr-lifecycle` §Phase 4 and PDR-140 bind as written:
   - A finding that is correct, relevant and proportionate is cured in its
     pull request's own settlement push.
   - After the last round, only a correctness defect in the pull request's
     own claim is cured forward in a new pull request.
   - Every other true finding is answered with a signed line, recorded as a
     row under §Review dispositions naming its slice, and resolved.
3. **Work in progress is capped.** At most three open non-draft pull
   requests at a time (proposal P3, owner-ratified 2026-09-17). The next
   slice starts when one merges.
4. **Value order.** Security first, then gates that pass without checking,
   then the owner's strictness directive, then correctness defects, then
   doctrine corrections, then structure and clean-up.
5. **Batch by surface.** Slices that change the same files ride one pull
   request within `pr-lifecycle`'s file bands (about five files normal, ten
   acceptable).
6. **Generators before instances.**
   - Where findings keep recurring in one shape, the slice cures what
     generates them.
   - Rule routing is generated from each agent's declaration (P1, ratified
     2026-09-17), not swept by hand.
   - Each gate is proven by a planted violation (P2, ratified 2026-09-17).

## Acceptance criteria (each with a proof)

1. **The open pull request count reaches zero at close-out.** Proof:
   `owner-held`. The Director reads `gh pr list --state open` empty and
   records the dated reading in `repo-continuity.md` §Next Safe Steps.
2. **No routed finding is dropped.** Every review finding routed out of a
   pull request from 2026-09-17 on has a row under §Review dispositions,
   naming its source pull request and the slice that carries it. Proof:
   `repo-safe`. The section is read against the signed disposition lines on
   those pull requests.
3. **The cap holds.** No backlog slice opens while three non-draft pull
   requests are open. Proof: `owner-held`. The Director records the open
   count at each slice start in `repo-continuity.md`.
4. **The plan completes.** Every slice under §Backlog is landed, with its own
   pull request's proof, or dispositioned with a reason. Proof: `repo-safe`.
   Each slice line names its merged pull request or its disposition.

## Close-out, in order

1. #118: the owner's one bounded extra review on its CI cure. Landed
   2026-09-17 (`SHA: 92b596d`).
2. #124 landed 2026-09-17 (`SHA: 68e68e9`). #125 was closed with its reason
   under the triage in §Mechanism; its finding is a row under §Review
   dispositions.
3. `fix/architecture-reviewer-pairing` (#120's last-round cure,
   `SHA: 21668df0`): open its pull request, review, land.
4. `fix/lint-warnings-fail-v2` (lint warnings pass every gate today): open,
   review, land.
5. `fix/mention-secrets-scan`: the bypass is real. On Claude Code 2.1.274, a
   headless run showed an @-mentioned file reaching the model with no
   PreToolUse call, and the prompt hook's payload held only the prompt text.
   The cure is uncommitted in the `override-floors` worktree. Its next steps,
   in order:
   - commit the work in progress;
   - merge `origin/main` (#122 conflicts in the prompt smoke);
   - move the helpers into #122's `secrets-hooks-support.ts`;
   - trim the smoke to what the cure needs;
   - settle, with evidence, whether scanning files outside the project sends
     content off the machine (Sonar documents the scan as local; telemetry is
     on);
   - rerun the mutants and `pnpm check`;
   - get a security-expert review;
   - open, review, land.
6. The strictness drafts, as the owner directed on 2026-09-16:
   - #94, the strict base;
   - then #95;
   - then #96.

   Each merges main, reruns its measurement with the flag on and off, is
   marked ready and lands.
7. The coordination branch folds into main through its pull request, carrying
   this plan and the continuity records. Close-out ends when that merge
   leaves the count at zero.

## Backlog, in value order

Security:

1. Remove `${CLAUDE_PROJECT_DIR:-.}` from the three PreToolUse guard commands
   and from the hook grammar's accepted forms, with a security-expert review.
2. The prompt secrets hook, when Sonar itself errors, lets the prompt through
   with a visible "not scanned" warning.

Gates that pass without checking:

3. `.husky/commit-msg` runs commitlint `--strict`. Root scripts that call
   `pnpm --filter` pass `--fail-if-no-match`.
4. A CI job runs `pnpm audit`. The dependency-currency skill also reads
   repository advisories for pinned floors.
5. A planted-violation smoke for each `pnpm check` leg (P2). Sliced at pickup,
   a few legs per pull request.

Strictness (owner directive 2026-09-16, one draft pull request each):

6. `noUncheckedIndexedAccess` slices:
   - 2c: agent-tools tests and smokes;
   - 2d: `src/pr-watch`, `src/corpus-analysis`, `src/spawn`;
   - 2e: the remaining `src` files;
   - the flip into `tsconfig.base.json`, after a config-expert review;
   - then `exactOptionalPropertyTypes` by the same method.

Runtime floor:

7. Bash 5.2 or later: a version guard in each bash script, fail-closed in the
   security hooks, enforced by the shellcheck gate. Husky hooks stay strict
   POSIX. Sized after the owner gate above clears.

Correctness defects:

8. The commit workflow drops the "no pnpm found" message. The commit-queue
   CLI topic ignores `PRACTICE_COORDINATION_HOME`.
9. `comms-provenance-check.ts` and `comms-archive-move.ts` scan a directory
   that does not exist. The partial work in the `tools-lineage-paths`
   worktree is the input.
10. Green runs print nothing extra:
    - Turbo telemetry off for the repository, CI and cloud;
    - the `unknown format "date-time"` stderr line;
    - the four knip "Remove redundant entry pattern" hints.
11. The gitleaks pins agree between CI and cloud setup. The `run-quality-gates`
    job that validators name either exists or is no longer named.
12. Delete the expired `minimumReleaseAgeExclude` block. Loosen the site's
    exact vite pin to `^7.3.6`, with a cold resolution.

Doctrine corrections (owner-approved 2026-09-17):

13. Four corrections:
    - `no-warning-toleration.md`: drop the start-at-warn allowance, citing
      PDR-126;
    - `testing-strategy.md`: the system under test is the site over HTTP or
      an agent-tools CLI over stdio;
    - tests assert outcomes, never call inspection;
    - `principles.md`: knip and gitleaks run repo-wide.
14. Four more:
    - `set-up-worktree-lane` says lane commits use the owner's identity;
    - ADR-005's knip location;
    - `recommended.ts`'s comment that `warn` avoids blocking;
    - the disposition grammar gains "Cured in description", in the parser and
      in `pr-lifecycle` together.

Structure and clean-up:

15. Rule routing is generated from each agent's declaration (P1): triggers,
    globs and descriptions. The rows under §Review dispositions naming this
    slice are its acceptance cases. The partial work in the `expert-roster`
    worktree (`fix/site-relative-paths-in-rules`) is the input.
16. Cited-path, cited-ADR and agent-name validation runs over every tracked
    text surface (P1). The transplant residue list in `repo-continuity.md` is
    its first run's expected catch.
17. Enable `no-export-trivial-type-aliases` at error. Delete
    `repo-check profile`. Rename `oak-commit-queue-v1` while no intent is
    queued.
18. Move the test helper shared by agent-tools and the site into a private
    `tooling/` package.
19. The Result unit tests. The nine tests outside the site with no class
    suffix. The two agent-tools `expectTypeOf` tests.

## Review dispositions

One row per finding routed out of a pull request, dated. The row names the
source, the finding in one line, and the slice that carries it.

- 2026-09-17, #120 round two: the Barney trigger writes `content/` and `lib/`
  where the tree has `jcdotnet/`. Slice 15.
- 2026-09-17, #120 round two: design-system globs match no motion or component
  source (`packages/design/**` does not exist). Slice 15.
- 2026-09-17, #120 round two: editor globs miss `jcdotnet/content/entities.json`.
  Slice 15.
- 2026-09-17, #120 round two: `invoke-subagent-architect` globs miss
  `.gemini/**/*` and the five entry files. Slice 15.
- 2026-09-17, #120 round two: accessibility globs miss the PDF sources
  `jcdotnet/scripts/generate-pdf.ts` and `jcdotnet/lib/pdf-config.ts`.
  Slice 15.
- 2026-09-17, #120 round-one reviewers: `.agent/HUMANS.md`, `.agent/README.md`
  and `subagent-practice-core-protection.md` misdescribe `.github/agents/` and
  list two entry files; `GEMINI.md` omits the generated `.gemini/agents/`;
  `.codex/README.md` cites the surface matrix at a wrong path. Slice 16.
- 2026-09-17, #120 round-one reviewers: five agents have no `.github/agents/`
  wrapper. `codex-project-agents` tests read the live tree and duplicate the
  canonical-path extractor. Slice 15.
- 2026-09-17, #118 CI cure: when no pnpm is found, the commit workflow reports
  "advisory orchestrator exit 1" with no cause. Slice 8.
- 2026-09-17, #118 CI cure: `pnpm check` prints `unknown format "date-time"
  ignored` on a green run. Slice 10.
- 2026-09-17, #118 round one: `runLintChanged` throws where `principles.md`
  prefers `Result`. Slice 19.
- 2026-09-17, #122 closed classifier: a `.ksh`, `.dash` or `.bats` file with
  no shebang is not linted, and Husky hooks could be required to use the `sh`
  form. Slice 7.
- 2026-09-17, #122 round two and #125 round one: an unlisted shebang on a
  shell path is told remedies that do not clear the gate alone. Renaming
  alone leaves the form unlisted; adding it as not shell alone leaves the path
  shell. #125 closed with its reason; its branch `fix/shebang-refusal-remedy`
  (`SHA: 9d2dd5b8`) is input. Slice 7.
- 2026-09-17, #124 docs review: the `assertNeverResult` TSDoc says "instead of
  an exception", and the Result README's "No hidden control flow" sits beside
  three throwing helpers. Slice 19.
- 2026-09-17, #124 test review: in the Result unit tests, "narrows type
  correctly" compiles only through assignment narrowing, three tests repeat
  others, and the `map`, `flatMap` and `mapErr` assertions sit inside `if`
  blocks. Slice 19.

## Out of scope

- **New site features and content.** The site plan owns them. This plan exists
  to free attention for them.
- **The `practice-language-separation` lane.** It has its own node and its own
  owner gates.
- **Findings with no true observation.** They are rejected on their pull
  request with evidence and take no row here.
