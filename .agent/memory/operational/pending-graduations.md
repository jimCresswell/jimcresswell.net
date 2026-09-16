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
these by unless a review date has arrived. **Bootstrap exception: a row tracking an
ALREADY-ACCEPTED record is decided retain vs retire-by-its-own-falsifier at
review — promote/kill applies only to not-yet-minted concepts.**

| Concept | Prediction (by review) | Falsifier | Review |
| ------- | ---------------------- | --------- | ------ |
| Ratified text is the owner's: a verdict quotes the governing text before it rules and never rules against it; a change to ratified text is a card after the item lands (source: napkin 2026-09-13, Wrap 7, lane A, lane C wrap: a verdict overturned a ratified todo and the owner asked what else was being overturned; home: a new rule `ratified-text-changes-only-by-card` or a clause in `precedence-is-not-approval`, whose lines 42 to 45 at SHA: ea3142b route a precedent challenge to a card and bind no verdict to quote the text it rules under) | No Director or seat verdict contradicts a ratified line; every method change to ratified work arrives as a card | A verdict contradicts a ratified line with the clause loaded, or a method change to ratified work lands without a card | Owner's session 2 card (owner word decides earlier), else 2026-12-13 |
| A method question to the owner is asked as the sensible shape under the estate's rules, never as one authority against another (source: owner, 2026-09-13 evening, on the Gemini card: "this is not a matter of competing authorities, what does sensible look like?"; home: principles §Decision Lenses, one sentence after the either/or clause, whose lines 41 to 47 bind questions and options, not cards) | The next card that pairs ratified text against an estate rule is refused by its author before it is sent | A card framed as two texts in competition is sent to the owner | Owner's session 2 card (owner word decides earlier), else 2026-12-13 |
| Process is the last resort: before adding a step, a card, a precondition, a node or a pass, ask whether a computation, an existing rule or the owner's recorded words already answer it (source: napkin 2026-09-13, Wraps 6 and 7, four owner corrections of one shape in one afternoon; home: `compute-dont-hope`, whose lines 14 to 17 cover hand-kept lists only; the card half is already carried by `present-verdicts-not-menus` lines 97 to 99 and 189 to 192) | Cards per session fall to owner-only decisions; the owner names no invented optionality in the next five card rounds | The owner names invented optionality (a step, card, precondition, node or pass that doctrine or a computation already answered) in a card round | Owner's session 2 card (owner word decides earlier), else 2026-12-13 |
| Consolidation runs one truth-maintenance pass over every surface that advertises plan state: frontmatter status, narrative status, next-step sections, current-state notes, roadmap and parent tables, READMEs (source: napkin 2026-03-09 and 2026-04-03, promoted there; the transplanted consolidate-docs skill did not keep it: its sweep at line 348 is scoped to a renamed surface and line 362 asks only for plans and prompts up to date) | The next consolidation's record lists the status surfaces it swept and no frontmatter-versus-narrative status divergence survives it | A consolidation closes leaving a status divergence between two of the named surfaces | Owner's session 2 card (owner word decides earlier), else 2026-12-13 |
| Consolidation checks each domain skill the period's findings touch, diffing its pitfalls table against those findings (source: napkin 2026-03-07; home: the consolidate-docs skill, where the word pitfall does not occur and skills appear only as a graduation destination, line 595) | The next consolidation names at least one skill pitfalls table it checked | A consolidation closes with a stale pitfalls table in a skill its findings touched | Owner's session 2 card (owner word decides earlier), else 2026-12-13 |

<!-- Drained at the 2026-09-06 dedicated consolidation: ten entries decided, every one already
carried by its target home — pr-lifecycle, the plan skill, start-right-team, the wrap skill, the
cricket skill, the no-moving-targets rule — verified by reading the home; two entries restored
2026-09-07 at review (their targets were not yet carried) and drained again the same day once
PR #75 carried them (pr-lifecycle's reviewer-set clause names the Codex connector; the plan skill
and the plan-templates README carry the decision-log sentence). The commits and the homes are
the record. -->

- **Owned doctrine is placed where the situation arises, not only where the instrument's ceremony lives**
  `[captured: 2026-09-16 | source: the arc's retrospective and its second protected pass: four
  situations the arc met were answered by doctrine already in the tree (PDR-140's response
  pricing, the 2026-07-15 handover ruling, the coordination branch's home clause, pr-lifecycle's
  silent-CI clause), each surfacing through the owner or a peer; the pass found doctrine firing
  was otherwise the norm (seventeen decision records and twenty-eight rules cited) and that
  #62's failure was compliance at the action moment, not consultation at open | owner's card
  2026-09-16 filing it to this lane | review: 2026-12-15]`
  Concept: an estate that imports or accumulates doctrine faster than it places it leaves rules
  that read correctly and fire nowhere; the placement question is whether a general mechanism is
  needed (triggers keyed to the seat's situation) or whether per-instrument gates suffice.
  Prediction, by the review date: with the per-instrument gates now adopted (PDR-140's
  declaration at open, the push-time budget gate, records riding their pull request), owner
  corrections that already-owned doctrine answered fall to at most one per arc. Falsifier: two
  or more such corrections in any arc after the gates land, which would show the gates are too
  narrow and a general placement mechanism is needed.

## Entries

Every entry is an inline-bracket block the item-count parser counts (schema:
`agent-tools/src/practice-fitness/item-count.ts`); the prose under a block carries its
doctrine, prediction and the home read. The five entries captured at the 2026-09-12 transplant
close were folded into this shape on 2026-09-13 (they had carried a heading-and-bullets shape
the parser neither counted nor flagged, so the register read as empty while holding them);
substance unchanged. Session 2 (closure item 8) added its candidates on 2026-09-13 from the
Director's draft (`threads/session-2-synthesis.next-session.md`), each home read first-hand
on `main` at SHA: ea3142b before filing; candidates found already written are recorded there
as duplicates with the home, never here.

### Captured at the 2026-09-12 transplant close

Each is single-instance today; graduation waits on PDR-101 quorum or an owner ruling.

- **Harness install order: policy, then built dispatcher, then settings**
  `[captured: 2026-09-12 | source: napkin 2026-09-12 (night), writing .claude/settings.json
  hooks before .agent/hooks/policy.json existed locked the session out of Bash, Edit and
  Write; the guard fails closed by design and reloads on the settings write | target:
  .agent/hooks/README.md §Activation (and PDR-005 if a second transplant repeats it) |
  trigger: a second instance or an owner ruling | size: S | status: pending]`
  Prediction (PDR-130): no session repeats the lockout once the order is in the README.

- **Stage by listing paths; never a message-file write after a guarded command**
  `[captured: 2026-09-12 | source: napkin 2026-09-12 (night), a refused git add inside an
  && chain skipped the heredoc that followed; the next commit -F ran on a missing file and the
  continuity commit swallowed the bundle | target: stage-by-explicit-pathspec (a how-to-stage-
  a-large-set clause) and the commit skill's message-file step | trigger: a second instance
  or an owner ruling | size: S | status: pending]`
  Prediction: zero mis-bundled commits in the next ten sessions.

- **The antigen scrub is two-tier and can silently mangle test fixtures**
  `[captured: 2026-09-12 | source: napkin 2026-09-12 (evening, night), org-shaped replacement
  is a sed; product-shaped residue is excise-or-case-by-case; a sed over test fixtures put one
  rule test out of the rule's own scope without a failure until the suite ran | target: PDR-005
  as a scrub checklist (product code, package metadata, test fixtures) | trigger: a second
  instance or an owner ruling | size: S | status: pending]`
  Prediction: the second transplant's residue scan finds no fixture class.

- **Generators land before the artefacts they produce**
  `[captured: 2026-09-12 | source: wrap 2026-09-12, the sub-agent adapter generator and the
  classified rules-index generator existed only in the transplanting session; recipes conserved
  in .agent/reports/practice-transplant/efficiency-guidance.md | target: a clause in
  practice-core-portability or a new short rule (the Practice-estate form of the dropped
  generator-first-mindset) | trigger: a second instance or an owner ruling | size: S |
  status: pending]`
  Prediction: both generators exist as agent-tools bins before the next adapter regeneration.

- **A transplanted surface's assertions are exercised, never trusted**
  `[captured: 2026-09-12 | source: re-evaluate slice 1, the hook's env-file claim, the gate
  list with twelve dead scripts, the docs layer placed by arrival path, a record number whose
  subject differed at the target, the bootstrap building from the lineage's workspace paths
  (one class, five instances) | target: PDR-005 §Re-evaluate as the step's definition
  (enumerate each surface's assertions about the host and exercise each; prefer a validator
  leg over truing the text; the cited-scripts, CI-parity, reference-direction and
  machine-local-paths validators are the worked instances) | trigger: a second instance or an
  owner ruling | size: M | status: pending]`
  Prediction: the next transplant's re-evaluate step is a checklist run, not a discovery, and
  finds no dead script citation because the validator runs at the end of the harness phase.
  Generalisation (2026-09-12, evening, `journey-so-far.md`): the class is wider than
  transplants, nominal adoption: a surface saying X is adopted while no mechanism makes X true
  (a gate list, a hook's claim, a docs path, a source PDR whose scripts its own package.json no
  longer defines, a plan-node estate whose validator is unwired); the cure shape is the same:
  wire the mechanism, then true the text. Falsifier: if the remaining nominal adoptions here
  (plan-node estate, the two generators, the archived lessons) are cured by text alone, the
  generalisation was a story.

### Session 2 candidates (captured 2026-09-13; the owner's card answers are the dispositions)

The disposition of this batch by owner cards is the ratified node's item 8 verbatim
(`.agent/plans/delivery/practice-completion.plan.md` §Transplant closure, item 8: "the
candidates go to the owner as one batch of cards; the answers are the dispositions; nothing
graduates without them"): an owner word for this batch, not the general pre-approval PDR-100
abolishes; PDR-101's quorum stands for every other graduation. The constitutional-class
candidates of the batch (A, B, C, 1a and 1b under PDR-130's class test: how the estate decides
under ratified text, frames a question to the owner, adds process, and consolidates) sit in
§Slow lane above with review dates and are not decision-debt; the operational lessons file here.

- **A push slot is a turn: ask, wait for the word, then push**
  `[captured: 2026-09-13 | source: napkin 2026-09-13 (lane C wrap; lane A; Director), two
  seats read "tell me before you push" as notify-and-go; the hazard was a shared e2e port and
  stays as host load after the port cure | target: start-right-team §5 (a slot clause: the
  request, the one-word confirmation, the release by word, the forcing fact named); lane C's
  per-user memory push-slot-is-ask-then-wait graduates into it | trigger: the owner's card
  answer (session 2 batch) | size: S | status: pending]`
  Doctrine: a message naming a sequencing point is a request for a turn; the seat waits for the
  one-word confirmation; the holder releases by word; the forcing fact is named each time.
  Prediction: no seat pushes on its own announcement in the next ten team sessions. Home read:
  start-right-team §5 line 747 names the commit queue only as a swept surface; no commit-queue
  reference exists under .agent/reference/; the doctrine lives only in director-handoff.md
  lines 79 and 97 to 99, a routing record.

- **Records land at waypoints, never per event**
  `[captured: 2026-09-13 | source: napkin 2026-09-13 (Director), a records pull request pushed
  per event drew five review rounds, each finding the next stale line; the cure made every
  live-state block defer to the routing log's last entry; Wrap 4 recorded the tension with the
  transplanted session-handoff clause | target: session-handoff (resolving the tension with
  its refreshes-ride-the-next-substantive-commit clause, owner ruling 2026-07-15) and
  pr-lifecycle Phase 2 (a records-changeset clause) | trigger: the owner's card answer
  (session 2 batch) | size: M | status: pending]`
  Doctrine: commit records at each state change; push once per landed merge or shape change; a
  live-state block says which line is current where it and the log disagree. Prediction: the
  next Director records PR settles in at most two review rounds. Home read: session-handoff
  lines 216 to 230 say refreshes ride the next substantive commit with one compaction
  carve-out, so the commit-cadence half needs reconciling with that ruling, not appending;
  pr-lifecycle has no skill §Scope (the description's §Scope is Phase 2, lines 149 to 152) and
  neither home carries push-per-landed-merge or the live-state precedence line.

- **A claimed violation is checked against the validator that polices it before it is repeated**
  `[captured: 2026-09-13 | source: napkin 2026-09-12 (Session 4), a sub-agent's "violation"
  claim reached a peer seat before the reference-direction validator's own count (zero) was
  read; retracted; distilled.md line 70 holds it as buffer | target: verify-dont-trust (a
  clause) and read-diagnostic-artefacts-in-full | trigger: the owner's card answer (session 2
  batch) | size: S | status: pending]`
  Doctrine: a claimed violation of a policed rule is checked against the policing validator's
  output first; the validator's verdict outranks any reader's. Prediction: no finding is sent
  to a peer or the owner that its validator contradicts. Home read: verify-dont-trust polices
  the green direction only (lines 38, 120); read-diagnostic-artefacts-in-full is about a
  returned artefact read in full (lines 8, 20), not a validator never run.

- **A failure hypothesis names the mechanism's existence at time T as its first premise**
  `[captured: 2026-09-13 | source: napkin 2026-09-12 (Session 5), a "missed startup write"
  diagnosis and a timeout change cured a non-event; the hook did not exist at the startup in
  question (one git log --diff-filter=A settles it) | target: verify-dont-trust (a clause) or a
  patterns file mechanism-existed-at-time-t | trigger: the owner's card answer (session 2
  batch) | size: S | status: pending]`
  Prediction: no structural change lands on a misdiagnosis of this shape in the next ten
  sessions. Home read: verify-dont-trust lines 376 to 377 treat unprobed state generally with
  no existence-at-time premise; no patterns file on the subject exists.

- **Converge on the lineage's practised convention; never alias two after a transplant**
  `[captured: 2026-09-13 | source: napkin 2026-09-12 and 13 (Session 5, Wrap 4), two
  gate-naming conventions kept side by side and aliased until the owner ruled "adopt OCE
  naming"; the runbook plan lines 126 to 133 already state it for script names, a plan is not
  a doctrine home | target: replace-dont-bridge (a transplant clause) and PDR-005 | trigger:
  the owner's card answer (session 2 batch) | size: S | status: pending]`
  Doctrine: when a transplant leaves two conventions live, converge on the lineage's practised
  one and surface the choice; an alias layer is a compatibility layer. Prediction: the next
  transplant leaves no aliased convention at its first gate-green. Home read:
  replace-dont-bridge lines 35 and 49 to 50 carry the one-name invariant and the adapter ban,
  nothing on a lineage's practised convention; PDR-005 lines 197 to 198 warn of same-named
  directories only.

- **Antigen density chooses the merge method; a merged surface's paths are exercised**
  `[captured: 2026-09-13 | source: napkin 2026-09-12 (Session 5, slice 2 item 2), under five
  antigen lines copy and graft, over fifteen rewrite on the lineage's structure; two host
  paths were wrong and found only by ls | target: PDR-005 §The process (the execution step's
  method choice and a path-exercise clause); the runbook cites it | trigger: the owner's card
  answer (session 2 batch) | size: S | status: pending]`
  Prediction: the runbook's step 6 names the thresholds and the next transplant records its
  densities. Home read: PDR-005 lines 91 to 93 key the method to gradient position with no
  thresholds; lines 99 to 101 grep antigens with no count and no path exercising.

- **Completeness is judged by function and exercised claims; a trim ruling names its default**
  `[captured: 2026-09-13 | source: napkin 2026-09-13 (Wrap 5; Session 6), the estate called
  itself complete when check was green while doctrine cited forty absent paths; the owner
  flipped the default ("bring unless product") and earlier trims reopened | target: PDR-005
  §Completeness audit and practice-core/practice-verification.md | trigger: the owner's card
  answer (session 2 batch) | size: M | status: pending]`
  Doctrine: a transplant's completeness proof is the function-by-function audit with exercised
  claims (the cited-paths check as the cheapest instrument); every trim ruling records the
  default it was made under and reopens when the default changes. Prediction: the next
  transplant's completion report cites nine function rows with proofs before any "complete"
  word, and its trim rulings name their default. Home read: PDR-005 lines 103 to 104 audit
  concept representation, lines 312 to 313 record a rationale with no default;
  practice-verification audits at surface granularity (lines 178, 262); no cited-paths check in
  either.

- **A projection generator preserves role multiplicity; a census against the pin proves it**
  `[captured: 2026-09-13 | source: napkin 2026-09-13 (Director), the one-wrapper-per-template
  projection flattened the four pinned Cricket roles into two generic wrappers; a computed
  census against the pin found it and three stubbed rules | target: PDR-009 (a
  many-to-one-per-template clause beside the existing trigger-consolidation section) and the
  transplant runbook's completeness step | trigger: the owner's card answer (session 2 batch)
  | size: S | status: pending]`
  Prediction: the sub-agent adapter generator (item 6, 2b) emits the quartet from a role
  declaration, and the census is a leg or an audit script under inputs/. Home read: PDR-009
  lines 197 to 199 consolidate many rules onto one trigger, the opposite direction; lines 147
  to 148 validate coverage and form with no counts; the runbook lines 159 and 185 to 186 have
  the direction and row disposition, no census.

- **Manifest declarations: runtime-created is declared; superseded is not declared at all**
  `[captured: 2026-09-13 | source: napkin 2026-09-13 (lane C), a surface absent until its first
  writer acts is declared runtime-created (the commit-queue shape); a surface doctrine has
  superseded gets no entry; the manifest already practises the first (lifecycle
  "runtime-created" at manifest lines 1086 and 1129) while the contract text still carries a
  memorial ("must not remain on disk", lines 124 and 150) | target: memory/executive/README.md
  and memory-state-substrate-contracts.md (the lifecycle row) and no-tombstones-for-removed-
  ideas (a manifest clause) | trigger: the owner's card answer (session 2 batch) | size: S |
  status: pending]`
  Doctrine: the substrate manifest declares presence and lifecycle; absence-by-supersession
  lives in the superseding record, never in the manifest. Prediction: no manifest entry of the
  form "never exists" is authored in the next ten sessions. Home read: the README (line 22)
  scopes the manifest by inventory; the contract (line 74) lists lifecycle values with no
  runtime-created class and no supersession rule; no-tombstones (lines 28, 65) scopes itself to
  prose.

- **Split proofs by layer; graph-backed E2E expectations from JSON fixtures by import attribute**
  `[captured: 2026-09-13 | source: napkin 2026-03-09 (Track A A3 slices, three instances),
  importing a product module into a Playwright spec failed on bundler-resolved JSON imports;
  the contract assertion stayed in Vitest and the emitted-channel assertion in Playwright, with
  content/entities.json imported with a JSON import attribute on the E2E side | target:
  testing-strategy §Site Workspace Conventions (one bullet) and
  docs/engineering/testing-patterns.md | trigger: the owner's card answer (session 2 batch) |
  size: S | status: pending]`
  The never-import-an-app-module cell is already written: testing-strategy lines 452 to 453
  and testing-patterns lines 147 to 151. Prediction: no site E2E spec imports an app module in
  the next ten sessions. Home read: the contract-versus-channel split and the JSON import
  attribute appear in neither home (testing-strategy lines 463 to 464 name the proof layer
  only; testing-patterns lines 133 to 136 point at real sources over fixtures).

- **Prove a checker with a negative control**
  `[captured: 2026-09-13 | source: napkin 2026-03-08 (an isolated temp repository from git
  archive plus a deliberate visual change; the red phase of the schema-dts guard proved by
  adding the historical failure); the register's own admission example names this pattern as
  unhomed | target: patterns/prove-the-checker-with-a-negative-control.md, cited from
  validation-strategy §Prove the guard bites as the checker-level form | trigger: the owner's
  card answer (session 2 batch) | size: S | status: pending]`
  Prediction: the pattern file exists and is cited from validation-strategy; the next new
  validator's PR names its negative control. Home read: no such patterns file exists (six
  files listed); validation-strategy lines 282 to 286 apply a mutant in place in the live
  repository and never name an isolated repository or a re-added historical failure.

- **Stable current-state architecture truth moves into permanent architecture docs**
  `[captured: 2026-09-13 | source: napkin 2026-03-09 (Permanent Graph Truth), the
  split-ownership truth lived only in an audit until moved to docs/architecture/; historical
  ADRs stay accepted with a clarification note when the architecture moves on | target:
  documentation-hygiene (a clause) and the docs-adr-expert template (a check row) | trigger:
  the owner's card answer (session 2 batch) | size: S | status: pending]`
  Prediction: no current-state architecture fact lives only in a plan or audit at the next
  consolidation. Home read: documentation-hygiene lines 11 to 15 bind fix-in-the-same-landing;
  the template's archive discipline (lines 107 to 110) and reference direction (111 to 113)
  are adjacent, neither carries relocation of truth or the clarification-note shape.
  The two rules the Director asked to be read carry neither half: no-moving-targets lines 186
  to 192 and 212 govern citation direction and the ADR as a decision's home;
  permanent-doc-is-the-consolidation-record lines 32 to 36 name the durable tier.

- **When a source-of-truth boundary lands, search accepted ADRs and plans for superseded names**
  `[captured: 2026-09-13 | source: napkin 2026-08-12, older accepted ADRs and a current plan
  still spoke of meta.summary and live tilt routes after the boundary landed | target:
  documentation-hygiene (the same clause as the entry above, second instance) and the
  docs-adr-expert template | trigger: the owner's card answer (session 2 batch) | size: S |
  status: pending]`
  Prediction: the next boundary change's PR lists the grep of superseded names it ran. Home
  read: the template's stale-reference sweep (line 160) has no field-name trigger and no
  plans-and-accepted-ADRs corpus; documentation-hygiene has no clause.

- **CLI file writers write atomically and never follow links**
  `[captured: 2026-09-13 | source: PR #55's fourth and fifth rounds (2026-09-13), a truncating
  write that broke resumability and a symlink write-through, each cured with an atomic writer
  and an lstat seam; the third cell, names validated at the boundary, is already written
  (security-expert lines 119 to 122; code-expert lines 131 to 134) | target: a patterns file
  cli-writer-boundary-discipline cited by the security-expert and code-expert templates |
  trigger: the owner's card answer (session 2 batch) | size: S | status: pending]`
  Prediction: the next CLI that writes files under a caller-supplied name ships with the three
  cells in its first PR. Home read: no patterns file; neither template mentions atomic write
  or symlink refusal.

- **An open ARC channel pins the primary working copy to the branch carrying its file**
  `[captured: 2026-09-13 | source: napkin 2026-09-13 (Director), the channel file, committed on
  the records branch, vanished from disk on a switch to a branch cut from main and reappeared
  on the switch back; the tail replayed the file; a partner append in the window would have
  blocked the switch | target: reference/arc-rapid-communication.md §Operating constraints
  (standing) | trigger: the owner's card answer (session 2 batch) | size: S | status:
  pending]`
  Doctrine: while a channel is open, the primary working copy stays on the branch that carries
  the channel file; other branches' work runs in worktrees. Prediction: no channel tail replays
  a file in the next ten team sessions. Home read: §Operating constraints (lines 148 to 184)
  names five constraints, none about branches; the worktree mention (lines 63 to 69) is about
  path resolution.

### Session 2, verified before filing (the Director's list; each home read, the lesson unwritten)

- **Read the writer before creating the surface it supposedly writes to**
  `[captured: 2026-09-13 | source: napkin 2026-09-13 (lane C), a curator-passes README was
  imported because a report listed it as a register the loop writes to; PDR-081 and the
  curator-pass skill say the opposite | target: verify-data-supports-shape-before-building (a
  worked-failure row: a directory the lineage kept for history is not a register the doctrine
  writes to) | trigger: the owner's card answer (session 2 batch) | size: S | status:
  pending]`
  Home read: the rule gates a new surface on a cited assignment (lines 33 to 36) and scopes its
  source-versus-projection clause to the entity model (line 31); its worked failures (lines
  57 to 67) carry no writer-versus-register instance.

- **A platform-integration plan settling reusable architecture is mined into an ADR before close**
  `[captured: 2026-09-13 | source: napkin 2026-03-08, a platform-integration plan settled
  reusable architecture that reached no ADR until a later pass | target: the plan skill (a
  completion clause beside the acceptance-criteria proof contract) | trigger: the owner's card
  answer (session 2 batch) | size: S | status: pending]`
  Prediction: no closed platform-integration plan carries an architecture decision absent from
  the ADR index. Home read: the skill's lines 201 to 203 fire only when a permanent page is
  amended; line 332 delegates to consolidation; no before-close obligation.

- **Losing paths of a design family are executable and a dated FAIL is a disposition**
  `[captured: 2026-09-13 | source: napkin 2026-08-12, plan-family acceptance is permission to
  test the boundary, not approval to extract; an evidenced FAIL is a complete and useful child
  outcome | target: the plan skill (the decision ledger, a FAIL disposition beside applied,
  already-covered, superseded and out-of-scope) | trigger: the owner's card answer (session 2
  batch) | size: S | status: pending]`
  Prediction: the next design family's plan carries a dated FAIL child without reopening the
  family. Home read: no fail, losing or dead-end text in the skill; the ledger at lines 290 to
  292 lists no FAIL disposition; the lesson lives in the napkin at lines 110 to 111.

- **A large fixture, an allowlist or a helper definition inside a test is a design smell**
  `[captured: 2026-09-13 | source: napkin 2026-03-08 (owner preference), logic that a test
  carries as a fixture, an allowlist or a helper belongs in product code as the source of
  truth | target: testing-strategy §KISS (the three smell classes and the relocation cure) |
  trigger: the owner's card answer (session 2 batch) | size: S | status: pending]`
  Prediction: the next test PR carrying one of the three classes is asked for the product-code
  home at review. Home read: lines 62 and 162 to 164 forbid complex logic and say simplify the
  code and the test; line 55 sizes fixtures; the three classes and the cure are unnamed.

- **The tooling references carry the upgrade and lint-configuration traps that bit**
  `[captured: 2026-09-13 | source: the three unconsolidated napkins and today's captures (the
  knip instance at napkin-2026-03-08 line 360), five instances: pnpm up --latest moved eslint
  past Next's supported range; Playwright browsers are reinstalled after an @playwright/test
  update; a flat ESLint config encodes no local policy without explicit rules; markdownlint
  needs explicit globs; knip flags a plugin loaded by a CLI option, cured by an
  ignoreDependencies entry with its reason | target: reference/tooling.md (four) and
  reference/typescript-gotchas.md §ESLint (the flat-config one) | trigger: the owner's card
  answer (session 2 batch) | size: S | status: pending]`
  Prediction: none of the five recurs as a napkin capture in the next ten sessions. Home read:
  tooling.md lines 3 to 8 and 47 to 48 carry the currency floor and a once-per-checkout
  browser install; typescript-gotchas lines 53 to 65 cover plugin typing only; neither file
  names markdownlint or knip.

- **The visual harness README carries its three unwritten operating lessons**
  `[captured: 2026-09-13 | source: napkin 2026-03-08 (six harness lessons, three unhomed),
  capture regions use structural selectors, never ids a refactor introduced; the artefact
  directory of the first failing run is recorded before any re-run, because re-runs write into
  the same directory; a page-output fix landing after a run invalidates that run | target:
  jcdotnet/visual-regression-harness/README.md (an operating section) and ADR-022 for the
  re-run clause | trigger: the owner's card answer (session 2 batch) | size: S | status:
  pending]`
  Prediction: the next harness-driven PR names the first failing run's directory and its
  re-run. Home read: README lines 84 to 86 and 155 permit id anchors under contract with no
  selector rule; lines 80 and 100 print the directory on success and overwrite it on re-run;
  ADR-022 lines 76 to 78 and README lines 188 to 190 push the first run earlier and oblige no
  re-run.

- **Stacked PRs over the same continuity files have no safe unchanged merge order**
  `[captured: 2026-09-13 | source: napkin 2026-08-12 (three-PR closeout), the accepted
  outcomes were preserved and the bounded story rebuilt on fresh main once custody was proved
  | target: pre-merge-divergence-analysis (a stacked-PR clause beside the memory-and-state
  paragraph) and the complex-merge skill's resolution order | trigger: the owner's card answer
  (session 2 batch) | size: S | status: pending]`
  Prediction: the next stacked set of records PRs is rebuilt on main rather than merged in
  sequence. Home read: pre-merge-divergence-analysis lines 63 to 69 and complex-merge lines
  148 to 152 govern one diverged pair; no stacked-PR text; the lesson lives in the napkin at
  lines 106 to 107.

- **Local signature verification needs an allowed-signers file to show what GitHub verifies**
  `[captured: 2026-09-13 | source: napkin 2026-08-12, git log --show-signature reported no
  signature because no SSH allowed-signers file was configured while GitHub verified the
  commits; distilled.md line 32 holds it as buffer | target: reference/merge-bot.md (a
  verification clause: configure gpg.ssh.allowedSignersFile or verify through GitHub before
  classing a commit unsigned) | trigger: the owner's card answer (session 2 batch) | size: S |
  status: pending]`
  Prediction: no seat classes a bot commit unsigned from a local readout in the next ten
  sessions. Home read: no allowed-signers text under .agent/reference/; merge-bot.md lines 273
  to 274 use signature in another sense.

### Captured at the end of the transplant closure (2026-09-15, the Director's end-of-arc wrap)

- **Wrap records go to the coordination branch; no seat mints a private records branch**
  `[captured: 2026-09-15 | source: owner correction 2026-09-15 ("the whole point of
  coordination branches is to have a common home for things like wraps"; to lane A, "write to
  the coordination branch, a later seat will handle the commit and push"), after the Director
  named its records branch records/director-12 to ride a later substantive pull request and
  approved lane A's records/lane-a-close; the Director's handoff item 110 | target:
  session-handoff step 2 (beside the 2026-07-15 handover ruling and its local amendment) and
  the wrap skill's step 2 (the work-safety evidence names the coordination branch as the
  wrap's home) | trigger: the owner's word (fired) | size: S | status: due]`
  Prediction: the next two wraps in this estate write to the primary checkout's day-stamped
  coordination branch, and neither mints a records branch nor proposes a records pull request.
  Home read: session-handoff step 2 carries the handover-commit and handover-PR ruling and the
  2026-09-13 compaction amendment and names no coordination branch;
  `coordination-branch-24h-lifetime` step 5 makes the primary checkout's own branch the home
  of accruing shared state, but its trigger is the branch-cut ceremony, not a wrap; the wrap
  skill names no branch.

- **Delete a merged branch through the REST API; a push-based delete runs the full pre-push gate**
  `[captured: 2026-09-15 | source: the Director's handoff item 109, the Director deleted #88's
  branch with git push inside lane A's push slot and the pre-push hook ran the full gate on
  the shared host (green); lane A deleted #91's branch through the REST API with no hook |
  target: pr-lifecycle (its "merge without the flag and delete the branch separately" line
  gains the method: DELETE on git/refs/heads/<branch> through the API, never a push, on a
  shared host) | trigger: a verified tool behaviour and an in-session miss (fired) | size: S |
  status: due]`
  Prediction: no push-slot overlap from a branch deletion in the next ten sessions. Home read:
  pr-lifecycle's merge section says to merge without `--delete-branch` and delete the branch
  separately, with no method; `merge-bot merge` prints that the merge-base deletion sweep is
  not discharged; neither names the pre-push hook.

### Ruled at the arc's retrospective (2026-09-16, the owner's cards)

- **A prose or records pull request declares its intake at open, and a review is requested once per settlement push**
  `[captured: 2026-09-16 | source: the arc's retrospective (the agentic-engineering reports,
  2026-09-15): pull request #62 took twenty-one explicit Copilot requests in four hours while
  PDR-140 sat in this estate from the transplant commit, never applied to its own pull
  requests; owner's card 2026-09-16 adopting proposal 2 | target: pr-lifecycle (the open step
  carries PDR-140 clause 3's declaration: artefact class, verification point, settlement
  budget) and the merge-bot reference (one review request per settlement push) | trigger: the
  owner's card (fired) | size: M | status: due]`
  Prediction: the next ten declared prose or records pull requests average three Copilot
  reviews or fewer. Home read: PDR-140 clause 3 binds the declaration at pull-request open and
  is unreferenced by pr-lifecycle's open step; the merge-bot reference describes requesting a
  review, not rationing it.

- **A scope ruling is re-costed in measured agent-hours before work continues**
  `[captured: 2026-09-16 | source: the arc's retrospective: sixteen ruling rounds and eight
  closure items with no restated cost, about sixty agent-hours against an opening hour; owner's
  card 2026-09-16 adopting proposal 3 | target: the plan skill (a re-cost step when a ruling
  widens a ratified scope) and the start-right-team route | trigger: the owner's card (fired) |
  size: S | status: due]`
  Prediction: the next ratified scope expansion carries a restated cost in agent-hours before
  the work starts, and the owner's decision records the bound. Home read: the plan skill's
  acceptance and sequencing sections carry no re-estimation step; PDR-026 governs the landing
  commitment, not the cost of a widened scope.

- **A multi-seat arc starts at two seats and widens only on measured throughput**
  `[captured: 2026-09-16 | source: the arc's retrospective: four seats ran at 3.8 seat-hours per
  merge against 0.95 at two, and lanes B and C handed most of their items back; owner's card
  2026-09-16 adopting proposal 6 | target: PDR-082 (an operating default beside the n=2 mode)
  and start-right-team §Choose Temporary Responsibilities | trigger: the owner's card (fired) |
  size: S | status: due]`
  Prediction: the next multi-seat arc opens at two seats, and any widening cites measured
  seat-hours per merge. Home read: PDR-082 defines the n=2 mode's drop and retain sets but no
  starting default; start-right-team's role section names seat cost without a measured test.
