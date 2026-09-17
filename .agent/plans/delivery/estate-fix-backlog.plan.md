---
id: estate-fix-backlog
node_type: delivery
name: Estate fix backlog — open pull requests to zero, then known defects in value order
overview: >-
  Land or close every open pull request, then work the estate's known defects
  and owner-approved corrections in a fixed value order, at most three open
  non-draft pull requests at a time, with routed review findings recorded here instead
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

The count of open pull requests reaches zero. Known defects
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
     row under §Review dispositions naming its slice, and resolved. Until
     slice 2 lands, the line's verb is `Rejected as a cure in this pull
     request` with the row named, the one form besides a cure SHA that
     lifts the merge hold today; slice 2 adds a lifting `Routed to <row>`.
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
   `owner-held`. The Director reads the section against the signed
   disposition lines on those pull requests and records the reading in
   `repo-continuity.md`.
3. **The cap holds.** No backlog slice opens while three non-draft pull
   requests are open. Proof: `owner-held`. The Director records the open
   count at each slice start in `repo-continuity.md`.
4. **The plan completes.** Every slice under §Backlog is landed, with its own
   pull request's proof, or dispositioned with a reason. Proof: `owner-held`.
   Each slice line names its merged pull request or its disposition, and the
   Director records each merge reading in `repo-continuity.md`. The
   slice list closes at ratification: a later disposition row joins an
   existing slice or, when none fits, is marked `carried forward` and a
   successor plan takes it at this plan's completion. Without that closure
   the ledger grows with every review and this criterion is never reached
   (`loop-exit-criteria-required`).

## Close-out, in order

1. #118: the owner's one bounded extra review on its CI cure. Landed
   2026-09-17 (`SHA: 92b596d`).
2. #124 landed 2026-09-17 (`SHA: 68e68e9`). #125 was closed with its reason
   under the triage in §Mechanism; its finding is a row under §Review
   dispositions.
3. `fix/lint-warnings-fail-v2` (lint warnings passed every gate before it),
   #126:
   landed 2026-09-17 (`SHA: 6254f0cc`). Round one's finding, a wrong sentence
   the pull request added, was cured in its settlement push
   (`SHA: faec77b3`); round two's wording item is a row under §Review
   dispositions.
4. `fix/architecture-reviewer-pairing` (#120's last-round cure,
   `SHA: 21668df0`), #127: landed 2026-09-17 (`SHA: 4ecbc451`). Round one
   made the persona clause conditional and plural in the settlement push; the
   same phrase in three sibling surfaces is a row under §Review dispositions.
5. `fix/mention-secrets-scan`, #128: landed 2026-09-17 (`SHA: 867e9e0c`).
   Round one's five findings were cured or rejected with Claude Code's own
   patterns as evidence; round two's Unicode edge is cured forward in #129
   (`fix/mention-parse-node`), which runs those patterns on node; #129 landed
   2026-09-17 (`SHA: 931f4072`) after its own two rounds, with the last round's
   two findings as rows below. The bypass was real. On Claude Code 2.1.274, a
   headless run showed an @-mentioned file reaching the model with no
   PreToolUse call, and the prompt hook's payload held only the prompt text.
   The steps taken, in order: the work in progress committed; `origin/main`
   merged; the helpers consolidated onto #122's `secrets-hooks-support.ts`;
   the privacy question settled from the Sonar documentation (the scan is
   local; telemetry carries no content or paths); the mutants and
   `pnpm check` rerun; the seat's own security review recorded in the
   description (the owner's word of 2026-09-17: no subagents); opened,
   reviewed, landed.
6. The strictness drafts, as the owner directed on 2026-09-16:
   - #94, the strict base: landed 2026-09-17 (`SHA: 20d0c8d9`). Round one's
     two documentation findings were cured in its settlement push; round two's
     one-word finding is carried on `fix/config-expert-isolated-modules`
     (`SHA: c864bc07`), merged into #95;
   - #95: landed 2026-09-17 (`SHA: d7f37d8a`), carrying #94's last-round
     line; its own round one (the carried line undeclared in the description)
     was cured in the description;
   - #96: landed 2026-09-17 (`SHA: cff790fa`), approved in round one.

   Each merges main, reruns its measurement with the flag on and off, is
   marked ready and lands.
7. The coordination branch folds into main through its pull request, carrying
   this plan and the continuity records. Close-out ends when that merge
   leaves the count at zero. The count first read zero on 2026-09-17 at
   #129's merge, before the fold opened.

## Backlog, in value order

Slices marked owner-approved trace to the owner's card answers of 2026-09-17,
recorded verbatim in `repo-continuity.md` at `SHA: 3372b944`.

Security:

1. Security, in this order:
   - the prompt secrets hook treats a node that is present but exits non-zero
     as "no mentions" (bash carries no exit status through
     `done < <(node ...)`), so the mentioned files go unscanned with no
     warning; capture the parser's status and warn as for a missing node, with
     a present-but-failing node stub in the mentions smoke (#129 round two,
     2026-09-17);
   - remove `${CLAUDE_PROJECT_DIR:-.}` from the three PreToolUse guard
     commands and from the hook grammar's accepted forms, with a security
     review.
2. The disposition grammar gains `Cured in description` and a lifting
   `Routed to <row>` form, in the parser and in `pr-lifecycle` together
   (owner-approved 2026-09-17; moved up from slice 14 the same evening). Only
   a cure SHA or a rejection lifts the merge hold today, so a true last-round
   finding that earns no diff of its own can only become a new pull request,
   which is how #128's last round became #129 during the close-out. With the
   verb, that finding is a ledger row and the reviewed pull request merges.
   The slice's earlier item, the visible "not scanned" warning when Sonar
   errors, landed in #128.

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
14. Three more:
    - `set-up-worktree-lane` says lane commits use the owner's identity;
    - ADR-005's knip location;
    - `recommended.ts`'s comment that `warn` avoids blocking.

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
source, the finding in one line, the slice that carries it, and why it was
routed rather than cured or rejected: outside the pull request's scope, below
its bar, or found in its last round. The signed line on the source pull
request carries the verb and the full rationale.

- 2026-09-17, #120 round two: the Barney trigger writes `content/` and `lib/`
  where the tree has `jcdotnet/`. Slice 15, outside #120's scope, a generator-level cure.
- 2026-09-17, #120 round two: design-system globs match no motion or component
  source (`packages/design/**` does not exist). Slice 15, outside #120's scope, a generator-level cure.
- 2026-09-17, #120 round two: editor globs miss `jcdotnet/content/entities.json`.
  Slice 15, outside #120's scope, a generator-level cure.
- 2026-09-17, #120 round two: `invoke-subagent-architect` globs miss
  `.gemini/**/*` and the five entry files. Slice 15, outside #120's scope, a generator-level cure.
- 2026-09-17, #120 round two: accessibility globs miss the PDF sources
  `jcdotnet/scripts/generate-pdf.ts` and `jcdotnet/lib/pdf-config.ts`.
  Slice 15, outside #120's scope, a generator-level cure.
- 2026-09-17, #120 round-one reviewers: `.agent/HUMANS.md`, `.agent/README.md`
  and `subagent-practice-core-protection.md` misdescribe `.github/agents/` and
  list two entry files; `GEMINI.md` omits the generated `.gemini/agents/`;
  `.codex/README.md` cites the surface matrix at a wrong path. Slice 16, outside #120's scope.
- 2026-09-17, #120 round-one reviewers: five agents have no `.github/agents/`
  wrapper. `codex-project-agents` tests read the live tree and duplicate the
  canonical-path extractor. Slice 15, outside #120's scope.
- 2026-09-17, #118 CI cure: when no pnpm is found, the commit workflow reports
  "advisory orchestrator exit 1" with no cause. Slice 8, outside #118's scope.
- 2026-09-17, #118 CI cure: `pnpm check` prints `unknown format "date-time"
  ignored` on a green run. Slice 10, outside #118's scope.
- 2026-09-17, #118 round one: `runLintChanged` throws where `principles.md`
  prefers `Result`. Slice 19, outside #118's scope.
- 2026-09-17, #122 closed classifier: a `.ksh`, `.dash` or `.bats` file with
  no shebang is not linted, and Husky hooks could be required to use the `sh`
  form. Slice 7, outside #122's scope.
- 2026-09-17, #122 round two and #125 round one: an unlisted shebang on a
  shell path is told remedies that do not clear the gate alone. Renaming
  alone leaves the form unlisted; adding it as not shell alone leaves the path
  shell. #125 closed with its reason; its branch `fix/shebang-refusal-remedy`
  (`SHA: 9d2dd5b8`) is input. Slice 7, last round, no diff of its own.
- 2026-09-17, #124 docs review: the `assertNeverResult` TSDoc says "instead of
  an exception", and the Result README's "No hidden control flow" sits beside
  three throwing helpers. Slice 19, outside #124's scope.
- 2026-09-17, #124 test review: in the Result unit tests, "narrows type
  correctly" compiles only through assignment narrowing, three tests repeat
  others, and the `map`, `flatMap` and `mapErr` assertions sit inside `if`
  blocks. Slice 19, outside #124's scope.
- 2026-09-17, #126 round two: `build-system.md` says `lint:fix` runs only
  through the root `pnpm fix`; the root also has a `lint:fix` script, so
  `pnpm fix` is a caller, not the only route. Slice 8, last round, below the bar.
- 2026-09-17, #127 round one: the assumptions-expert and subagent-architect
  tables and the reviewer roster say "plus the persona for the lane" in the
  singular and without the brief's condition (invoked when the change falls
  in its lane). Slice 15, outside #127's one-row scope, the class.
- 2026-09-17, #129 round two: `.agent/hooks/README.md` cites Claude Code's
  full path pattern while the hook applies its first group `^([^#]+)`; a path
  holding two `#` characters matches the full pattern not at all. State the
  applied prefix beside the full pattern. Slice 16, last round, below the bar.
- 2026-09-17, #129 round two: a present-but-failing node leaves the mentioned
  files unscanned with no warning. Slice 1, first item, last round, no diff of its own; security.

## Review record

- 2026-09-17, assumptions review by the seat under the assumptions-expert
  template, since the owner's word of that day allows no subagents. Findings
  applied: the completion criterion had no reachable exit while review rows
  kept arriving (it closes at ratification, as AC 4 now says); the security
  review in
  close-out item 5 named a subagent (now the seat's own review, recorded in
  the pull request); the close-out order listed the pairing branch before the
  lint pull request that was already open and reviewed (now in the order
  worked). Blocking held legitimate: no backlog slice opens before the count
  reaches zero, which is the owner's word of 2026-09-17 restated on resume
  ("land all PRs slowly and carefully"). Proportionality: the backlog is a
  ledger and an order, not a commitment to work it in one session; the cap
  of three bounds what is in flight.
- 2026-09-17, evening, the owner's reminder ("the goal is to thoughtfully get
  the PRs to zero") while #129 was in review. Reflection: the close-out landed
  #126, #127, #94, #95, #96 and #128, and opened three pull requests (#127
  from #120's last round, #128 the secrets cure, #129 from #128's last round).
  #127 and #129 exist because a last-round finding can lift the merge hold only
  by a cure SHA or a rejection, never by a ledger row; a true finding that
  earns no diff of its own therefore forces a pull request. That is the
  generator, so the disposition verb moved to slice 2. For the rest of the
  close-out no pull request opens except the coordination fold; a last-round
  finding on #129 or the fold takes a ledger row and the `Rejected as a cure
  in this pull request` line, the form that lifts the hold until slice 2.
- 2026-09-17, the fold's round one (Copilot): a delivery node is one bounded
  step of a lane, and this node holds nineteen slices; the reviewer asks for a
  split or a backlog surface. True as a reading of `.agent/plans/README.md`.
  Not cured here: the node's shape is the owner's to ratify, so the question
  rides the ratification card as its own item (keep one node with slices, or
  split into delivery nodes under a strategic backlog).
- 2026-09-17, the fold's round two (Copilot, the last round): ten record
  findings, all true and below the bar, carried to the successor branch's
  first commit; the plan's own (proof classes on AC 2 and AC 4, "non-draft"
  in the overview, "stays near it" in the goal, the six check clauses) are
  applied in that commit ahead of the ratification stamp.
- The `plan-body-first-principles-check` clauses: the shape clause fires on
  §Mechanism item 2 (the ledger row replaces the per-finding pull request);
  the landing-path clause on §Close-out item 7 (the fold carries this plan to
  main); the vendor-literal clause fires on every named version, tool and path
  (Claude Code 2.1.274, Sonar 1.7.0, node, pnpm, bash, `${CLAUDE_PROJECT_DIR}`,
  the file paths), each verified at pickup; the optionality clause finds no
  open alternative left to the implementer; the record-consumer clause names
  the Director and the next session as the readers of §Close-out and §Review
  dispositions; the rules-tier clause finds no rule change, only ledger rows
  and slices.

## Out of scope

- **New site features and content.** The site plan owns them. This plan exists
  to free attention for them.
- **The `practice-language-separation` lane.** It has its own node and its own
  owner gates.
- **Findings with no true observation.** They are rejected on their pull
  request with evidence and take no row here.
