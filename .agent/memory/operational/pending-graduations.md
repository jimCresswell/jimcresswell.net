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
| Owned doctrine is placed where the situation arises, not only where the instrument's ceremony lives (the arc's retrospective and its second protected pass, 2026-09-16; owner's card filing it to this lane): an estate that imports or accumulates doctrine faster than it places it leaves rules that read correctly and fire nowhere; four situations the arc met were answered by doctrine already in the tree (PDR-140's response pricing, the 2026-07-15 handover ruling, the coordination branch's home clause, pr-lifecycle's silent-CI clause), each surfacing through the owner or a peer, while doctrine firing was otherwise the norm (seventeen decision records and twenty-eight rules cited); the placement question is whether a general mechanism is needed (triggers keyed to the seat's situation) or whether per-instrument gates suffice | With the per-instrument gates adopted (PDR-140's declaration at open, the push-time budget gate, records riding their pull request), owner corrections that already-owned doctrine answered fall to at most one per arc | Two or more such corrections in any arc after the gates land: the gates are too narrow and a general placement mechanism is needed | 2026-12-15 (first consolidation on/after) |

<!-- Drained at the 2026-09-06 dedicated consolidation: ten entries decided, every one already
carried by its target home — pr-lifecycle, the plan skill, start-right-team, the wrap skill, the
cricket skill, the no-moving-targets rule — verified by reading the home; two entries restored
2026-09-07 at review (their targets were not yet carried) and drained again the same day once
PR #75 carried them (pr-lifecycle's reviewer-set clause names the Codex connector; the plan skill
and the plan-templates README carry the decision-log sentence). The commits and the homes are
the record. -->

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

### Queued for a directive-budget context (captured 2026-09-30, the two-estate consolidation)

Each targets a `.agent/directives/` file, so it waits for the first context whose reading
(`agent-tools session-metadata`) is below 30 % (`directive-file-context-budget`); the
lesson is settled and its home named, and only the authoring remains.

- **The owner decides; a rule's reasoning is not a refusal, and a session-over word bounds what follows**
  `[captured: 2026-09-30 | source: the napkin's 2026-09-30 boundary blocks (the owner, verbatim:
  "the estate doesn't reject anything, I am the one with authority"; "you were never supposed
  to keep going, you were supposed to fix one small issue"), and napkin 2026-03-09 (do not
  re-question a direction the owner has set) | target: user-collaboration.md §Scope Discipline
  (a rule's considered-and-rejected paragraph is reasoning the owner may overrule, never the
  estate's verdict; after a session-over word a new ask is a bounded fix and a plan's execution
  waits for a fresh seat unless the owner says otherwise; a set direction is executed, not
  re-argued) | trigger: the first context below 30 % | size: S | status: pending]`

- **A public-plan privacy review covers backstory, rejected methods, participants and custody**
  `[captured: 2026-09-30 | source: napkin 2026-08-12 (the plan-family publication), a privacy
  review of a plan headed for the public repository must read editorial backstory, rejected
  methods, participant diagnosis and custody narrative as well as conventional secrets |
  target: privacy.md §Rules (one clause) | trigger: the first context below 30 % | size: S |
  status: pending]`

- **Editorial lessons of the 2026-02-20 session: domains, credit, positioning language, voice**
  `[captured: 2026-09-30 | source: napkin 2026-03-08 (the 2026-02-20 editorial session): model
  fitting and strategic uncertainty are unrelated domains and are never conflated; the
  collaborative-credit form for industry stories is "helping build", never sole credit;
  positioning language ("second and third-order effects") is not a description of the research
  and is not written as one; the roguish quality shows in voice, never in biography, and the
  biographical detail behind it stays out of version control | target: editorial-guidance.md
  (§Collaborative credit, §Physics as silent ballast, §Voice and register) | trigger: the first
  context below 30 % | size: S | status: pending]`

- **A mutant that dies on a syntax error proves nothing**
  `[captured: 2026-09-30 | source: distilled.md (Siren's lessons block, 2026-09-25), a mutant
  that removes a statement and leaves a syntax error is killed by the parser, not by the
  claim; replace the removed statement with a no-op (`:` in shell, `;` or `void 0`in
  TypeScript) so the mutant fails on the claim itself | target: validation-strategy.md §Prove
  the guard bites (the method list) | trigger: the first context below 30 % | size: S |
  status: pending]`

- **Tests prove behaviour with no IO and no child processes; validators start the minimum**
  `[captured: 2026-09-30 | source: the owner's words of 2026-09-29 (09:2xZ and 12:2xZ) held in
  the per-user memory: tests are forbidden real IO and child processes with no carve-outs and
  no call inspection, pinned literals or counts; validation scripts start the minimum
  processes, never alter code or trigger builds, and every CI task runs through Turbo; too
  many slow validation scripts have dodged the test rules, and behaviour goes into tests with
  dependency injection; the 2026-09-24 half is already ratified in the
  `no-io-test-boundary-and-di-recovery`node | target: testing-strategy.md (the boundary
  section that carries the 2026-09-24 ruling gains the 2026-09-29 words verbatim) | trigger:
  the first context below 30 % | size: S | status: pending]`

### Session 2 candidates (captured 2026-09-13; the owner's card answers are the dispositions)

The disposition of this batch by owner cards is the ratified node's item 8 verbatim
(`.agent/plans/delivery/practice-completion.plan.md` §Transplant closure, item 8: "the
candidates go to the owner as one batch of cards; the answers are the dispositions; nothing
graduates without them"): an owner word for this batch, not the general pre-approval PDR-100
abolishes; PDR-101's quorum stands for every other graduation. The constitutional-class
candidates of the batch (A, B, C, 1a and 1b under PDR-130's class test: how the estate decides
under ratified text, frames a question to the owner, adds process, and consolidates) sit in
§Slow lane above with review dates and are not decision-debt; the operational lessons file here.

- **Split proofs by layer; graph-backed E2E expectations from JSON fixtures by import attribute**
  `[captured: 2026-09-13 | source: napkin 2026-03-09 (Track A A3 slices, three instances),
  importing a product module into a Playwright spec failed on bundler-resolved JSON imports;
  the contract assertion stayed in Vitest and the emitted-channel assertion in Playwright, with
  content/entities.json imported with a JSON import attribute on the E2E side | target:
  testing-strategy §Site Workspace Conventions (one bullet; the
  docs/engineering/testing-patterns.md half landed 2026-09-30) | trigger: the owner's card answer (session 2 batch) |
  size: S | status: pending]`
  The never-import-an-app-module cell is already written: testing-strategy lines 452 to 453
  and testing-patterns lines 147 to 151. Prediction: no site E2E spec imports an app module in
  the next ten sessions. Home read: the contract-versus-channel split and the JSON import
  attribute appear in neither home (testing-strategy lines 463 to 464 name the proof layer
  only; testing-patterns lines 133 to 136 point at real sources over fixtures).

### Session 2, verified before filing (the Director's list; each home read, the lesson unwritten)

- **A large fixture, an allowlist or a helper definition inside a test is a design smell**
  `[captured: 2026-09-13 | source: napkin 2026-03-08 (owner preference), logic that a test
  carries as a fixture, an allowlist or a helper belongs in product code as the source of
  truth | target: testing-strategy §KISS (the three smell classes and the relocation cure) |
  trigger: the owner's card answer (session 2 batch) | size: S | status: pending]`
  Prediction: the next test PR carrying one of the three classes is asked for the product-code
  home at review. Home read: lines 62 and 162 to 164 forbid complex logic and say simplify the
  code and the test; line 55 sizes fixtures; the three classes and the cure are unnamed.
