---
fitness_line_target: 1100
fitness_line_limit: 1467
fitness_char_limit: 200000
fitness_line_length: 100
fitness_item_count: required
fitness_item_count_target: 0
fitness_item_count_soft: 2
fitness_item_count_hard: 3
fitness_item_dwell_target: 2
fitness_item_dwell_soft: 4
fitness_item_dwell_hard: 7
lifecycle_model: >-
  canonical pending-graduations register — every live item is decision-debt
  (status pending/due/overdue) until it is graduated, rejected, or marked
  duplicate. Provenance and adaptation are the safety net for a wrong call.
access_pattern: >-
  consolidation-pass-only — read at consolidations and drain sessions; not
  loaded every session by every agent
drain_strategy: >-
  Drain by DECIDING: graduate (write the doctrine into its rule/PDR/ADR/pattern/
  governance-doc home, then remove the entry) or reject (decided not worth a
  home, with the reason). The decision-debt count falls only through a recorded
  terminal disposition — never by deleting an undecided item and never by raising
  a limit. Do not split, shard, or hide buffer depth.
fitness_rationale: >-
  The primary health signal for this buffer is the decision-debt count
  (fitness_item_count, target 0) — a flow-rate reading of whether graduation is
  keeping pace with capture. The line and character limits are a secondary
  structural signal: drain-cadence back-pressure for a consolidation-pass-only
  buffer, not a size cap. Recalibrated 2026-06-08: line hard 2200 -> 1467, target
  1500 -> 1100, so line-critical (hard x 1.5, the global ADR-144 ratio) lands at
  ~2200. Both signals are reported and acted on, never chased: substance is never
  trimmed to clear a zone (knowledge-preservation), and the register is drained
  down by deciding items, not by tombstone-removal.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Pending Graduations

The canonical register of **learned doctrine awaiting its permanent home** —
a lesson, pattern, or decision that is _already settled_ and simply not yet
written into the rule / PDR / ADR / pattern file / governance doc where it will
live and fire. Every live entry is decision-debt (`status: pending/due/overdue`),
drained by **graduating** it (write it into its home, verify, then remove the
entry) or **rejecting** it (decided not worth a home, with the reason). The
target is empty (`fitness_item_count_target: 0`); provenance and adaptation are
the safety net for a wrong call.

## What belongs here — and what does not

An entry belongs ONLY if all three hold:

1. **It is learned doctrine** — a settled lesson, pattern, or decision, validated
   by implementation, by surviving at least one later session uncorrected, or by
   an owner correction. Not a hypothesis, not a proposal, not a question.
2. **Its home is a doctrine surface** — a rule, PDR, ADR, `patterns/` file, or
   governance doc. (If the natural home is a _plan_ or a _report_, the item is
   future work or a proposal, not a graduation — see below.)
3. **It is not yet written there** — the only outstanding act is authoring it
   into that home.

**Belongs** (worked shapes):

- _"The prove-the-checker-with-a-negative-control lesson is stable across three
  instances and has no pattern file yet."_ → graduates to a `patterns/` file.
- _"The decision-locus doctrine (product scope is the owner's; engineering is
  collaborative) is settled and uncorrected, but lives only in the napkin."_ →
  graduates to a `user-collaboration.md` section.

**Does NOT belong** — route via the destinations table in
[`ephemeral-to-permanent-homing.md`](ephemeral-to-permanent-homing.md):

- **Future work / a build to do later** (_"author the portable Core PDR when a
  second repo adopts X"; "build the IDE plugin once the owner approves"_) → a
  `plans/` entry (in `future/` with a promotion trigger). The underlying doctrine
  may already be homed; the _doing-it-later_ is a plan, not a graduation.
- **A proposal or feasibility finding** (_"here is a design for an IDE
  integration plane"_) → a `reports/` or `research/` artefact, promoted to a plan
  on owner GO.
- **An open question** (_"what liveness primitive should the operating model
  carry?"_) → [`open-questions.md`](open-questions.md) if strategic, or an
  exploration plan if it is a design decision needing a session.
- **An operational what-next or owner decision** (_"should we re-establish the
  Director seat?"_) → [`repo-continuity.md`](repo-continuity.md) (Next Safe Steps
  / Open Owner-Decision Items) or the owning thread record.
- **A tooling gap** → the frictions register.

The test: if you cannot name the _exact_ rule / PDR / ADR / pattern / doc section
the entry will be written into, it is probably not a graduation — find its real
home above. An item only remains live decision-debt when it is genuinely settled
doctrine, has a doctrine home, and that home just has not been authored yet.

## Draining and dwell

Each consolidation decides _every_ decidable item — graduate or reject — toward
an empty register. An item stays only when a named constraint genuinely blocks
authoring its home now. The anti-starvation guard is the **dwell-time axis**
(`fitness_item_dwell_*`, target 2 / soft 4 / hard 7 days): it surfaces the
_oldest_ undecided item's age and escalates it. The dwell reading is **age, not
a hedge** — a short dwell is never licence to leave a decidable item undecided.

New capture appends below as inline-bracket entries — `- **<title>**` then a
backtick-wrapped inline `[…]` block (may wrap across lines) with pipe-separated
`captured / source / target / trigger / size / status` fields (schema:
`agent-tools/src/practice-fitness/item-count.ts`). Every field name carries a
colon (`captured: …`, `trigger: …`). The bracket must NOT be fenced — a fenced
or unwrapped block is silently uncounted (it raises a malformed finding).
`target` must name a doctrine surface (rule / PDR / ADR / pattern / governance
doc); if it names a plan or report, the item belongs elsewhere. **After ANY
append, run the parser's own readout** (`pnpm practice:fitness:informational`,
the Live decision-debt line) **and verify the count MOVED** — colon-less
fields once left four items reading as a clean register (vacuous-green in a
debt register, 2026-07-08).

<!-- New pending-graduation capture appends below as inline-bracket entries. -->

<!-- Register drained to empty at the 2026-09-09 dedicated consolidation (Vanilla lifts
Nectar): the one row — the triage rule step 4 naming the exhaustion and late-cure transitions
— graduated to review-feedback-defaults-to-triage §Action step 4 in the same change; home
verified by reading it. The commit and the home are the record. -->

<!-- Register drained to empty at the 2026-08-14 dedicated consolidation (Quasar
wakes Nadir, the fresh directive-headroom seat all five rows were gated on):
ends-before-means graduated to principles.md §Ends Before Means, Front of Chain
First; the generality-depth articulation to principles.md §Context Specificity
Gradient; owner-channel-answer-first to user-collaboration.md §Working Model
(bullet); the goal-hook pacing clause to metacognition.md §Fluency (standing
goal-hook paragraph); the file-emitting-watcher clause to
use-monitor-for-event-driven-wake §A File-Emitting Watcher Is Half-Armed
Without a Read Path, cross-referenced from comms-all-channels-watcher §Related
Surfaces. Homes verified live at drain. The commits and the homes are the
record. -->

<!-- Register drained to empty at the 2026-08-07 curator pass (Gull lifts Nimbus, fresh
seat clearing the directive-file-context-budget gate both rows were held on): the
constraint-surface sentence (Badger, 2026-08-02) graduated to principles.md §Separate
Framework from Consumer as the licence-map paragraph; the sentinel-taxonomy row (Birch,
2026-08-03) was found ALREADY LANDED in testing-strategy.md §Prove-behaviour as the
designed-sentinel admissibility clause (commit 92defb609, owner doctrine 2026-08-03,
MCP-462 trigger artefact named in place) — home verified live first-hand, row removed as
already-graduated. The commits and the homes are the record. -->

<!-- Register drained to empty at the 2026-07-20 dedicated consolidation (Siren lifts
Trench): the F-92 heartbeat-loop item was already terminal (duplicate of F-92, whose cure
now also lives in the liveness-heartbeat-cron rule's canonical-invocation clause); the
no-risk-of-loss absoluteness clause graduated to never-use-git-to-remove-work §A Safety
Proof Never Licenses the Class; the "nothing is mine" ruling graduated to the PDR-117
2026-07-20 amendment; derived-output conservation graduated to the
derived-output-conservation pattern; the cut-branch roll-up practice graduated to
no-parallel-long-lived-branches and the verification-methods candidate to the
verification-method-must-answer-the-question pattern; the no-escape-hatches ruling
graduated to principles.md §Strict and Complete. All homes verified live before this
drain. The commits and the homes are the record. -->

## Slow lane (PDR-130 — constitutional-class concepts, decided at their review date)

Rows here are live deliverables under a named review gate, NOT decision-debt:
each carries a prediction, a falsifier, and a review date, and is decided
(promote / kill-with-reasoning) AT that date. A dedicated consolidation passes
these by unless a review date has arrived. **Bootstrap exception (the row
below): a row tracking an ALREADY-ACCEPTED record is decided retain vs
retire-by-its-own-falsifier at review — promote/kill applies only to
not-yet-minted concepts.**

| Concept | Prediction (by review) | Falsifier | Review |
| ------- | ---------------------- | --------- | ------ |

<!-- Drained at the 2026-09-06 dedicated consolidation: ten entries decided, every one already
carried by its target home — pr-lifecycle, the plan skill, start-right-team, the wrap skill, the
cricket skill, the no-moving-targets rule — verified by reading the home; two entries restored
2026-09-07 at review (their targets were not yet carried) and drained again the same day once
PR #75 carried them (pr-lifecycle's reviewer-set clause names the Codex connector; the plan skill
and the plan-templates README carry the decision-log sentence). The commits and the homes are
the record. -->

## Entries

Captured at the 2026-09-12 transplant close. Each is single-instance today; graduation waits
on PDR-101 quorum or an owner ruling. The 57-lesson napkin synthesis (plan of record
§Ordering note) is the first drain pass and will add to this list.

### 1. Harness install order: policy, then built dispatcher, then settings

- **Status**: pending (captured 2026-09-12)
- **Source**: napkin 2026-09-12 (night) — writing `.claude/settings.json` hooks before
  `.agent/hooks/policy.json` existed locked the session out of Bash, Edit and Write; the guard
  fails closed by design and reloads on the settings write.
- **Candidate home**: `.agent/hooks/README.md` §Activation (and PDR-005 if a second transplant
  repeats it).
- **Prediction (PDR-130)**: no session repeats the lockout once the order is in the README.

### 2. Stage by listing paths; never a message-file write after a guarded command

- **Status**: pending (captured 2026-09-12)
- **Source**: napkin 2026-09-12 (night) — a refused `git add` inside an `&&` chain skipped the
  heredoc that followed; the next `commit -F` ran on a missing file and the continuity commit
  swallowed the bundle.
- **Candidate home**: `stage-by-explicit-pathspec` rule (a "how to stage a large set" clause) and
  the commit skill's message-file step.
- **Prediction**: zero mis-bundled commits in the next ten sessions.

### 3. The antigen scrub is two-tier and can silently mangle test fixtures

- **Status**: pending (captured 2026-09-12)
- **Source**: napkin 2026-09-12 (evening, night) — org-shaped replacement is a sed; product-shaped
  residue is excise-or-case-by-case; a sed over test fixtures put one rule test out of the rule's
  own scope without a failure until the suite ran.
- **Candidate home**: PDR-005 (wholesale transplantation) as a scrub checklist: product code,
  package metadata, test fixtures.
- **Prediction**: the second transplant's residue scan finds no fixture class.

### 4. Generators land before the artefacts they produce

- **Status**: pending (captured 2026-09-12)
- **Source**: wrap 2026-09-12 — the sub-agent adapter generator and the classified rules-index
  generator existed only in the transplanting session; recipes conserved in
  `.agent/reports/practice-transplant/efficiency-guidance.md`.
- **Candidate home**: `generator-first-mindset` was dropped at triage as SDK-specific; this is the
  Practice-estate form of the same doctrine — a clause in `practice-core-portability` or a new
  short rule.
- **Prediction**: both generators exist as `agent-tools` bins before the next adapter regeneration.

### 5. A transplanted surface's assertions are exercised, never trusted

- **Status**: pending (captured 2026-09-12, re-evaluate slice 1)
- **Source**: the hook's env-file claim, the gate list with twelve dead scripts, the docs layer
  placed by arrival path, a record number whose subject differed at the target, the bootstrap
  building from the lineage's workspace paths — one class, five instances in one slice.
- **Candidate home**: PDR-005 (wholesale transplantation) §Re-evaluate as the step's definition:
  enumerate the assertions each surface makes about the host and exercise each; prefer making
  the assertion checkable (a validator leg) over truing the text. The cited-scripts, CI-parity,
  reference-direction and machine-local-paths validators are the worked instances.
- **Prediction**: the next transplant's re-evaluate step is a checklist run, not a discovery,
  and finds no dead script citation because the validator runs at the end of the harness phase.
