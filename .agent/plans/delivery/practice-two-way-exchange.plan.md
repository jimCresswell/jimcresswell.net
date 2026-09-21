---
id: practice-two-way-exchange
node_type: delivery
name: Practice exchange — every instance raised to the highest level any of them defines
overview: >-
  After the transplant closes, compute what each Practice instance has learned
  since its ancestor, compare at the concept level, and land the higher form of
  every concept in every estate, each under its own owner's word. Three estates
  since 2026-09-21: this one, the lineage, and castr.
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-09-14
ratified_where: >-
  The owner's word to the Director in the Director session of 2026-09-14 ("yes, you
  both have Practice boxes, and yes the node is ratified"), recorded in
  .agent/memory/operational/director-handoff.md §Decisions overnight, item 101.
  Amended by the owner's card answers of 2026-09-21 in the session of Brazier spins
  Temper (c70341), recorded in this node's §Rulings of 2026-09-21 and in the napkin.
serves: practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: practice-completion
    kind: blocking
owner_gates: []
last_updated: 2026-09-21
---

# Practice exchange

## Rulings of 2026-09-21

The owner answered sixteen cards in chat on 2026-09-21 (Brazier spins Temper, c70341); the
ones that change this node, verbatim where quoted:

1. The window is open: "open now, but make sure that we are working with the most up to date
   delta possible." The gate that waited on this word cleared with it.
2. Three estates, one register: this estate, the lineage (EngraphCode/open-curriculum-ecosystem)
   and castr (EngraphCode/castr), with one concept register carrying three landing columns;
   castr's own innovations ledger folds in as rows.
3. Numbering: the lineage's PDR numbers stay canonical; castr's colliding records (096, 097,
   124) renumber above 141 when they land.
4. This seat leads the window as the exchange seat; no Director seat unless a team forms.
5. castr's refresh is a re-transplant with this estate's runbook, sequenced by the owner:
   "in parallel we should identify a subset of upgrades to the Castr Practice that will enable
   the tidying and architectural and functional debt work to complete more efficiently and to a
   higher standard, then we finish that work, then we finish the transplant." The subset is
   chosen by the open castr pull requests' blockers, bounded to six instruments (the review-round
   machine, the merge bot with its measured-state hold, the pr-watch grammar, the worktree-lane
   skill, the ship-independent rule, the declaration generators); this seat measures the blockers
   read-only.
6. PDR-141 lands here now as one small pull request, ahead of the register.
7. The lineage's delta note in the Practice Box is register input at the window, not processed
   on its own.
8. The lineage's method amendment (its seat, on the ARC channel, 2026-09-21): a records path
   satisfies the register validator with a row reading "records, not portable" or "graduated
   into <row>".

Authored 2026-09-14 by the Director at the owner's direction, verbatim: "make sure that we have
a plan for exploring that Practice delta, and any other advancements that have happened by the
time we get to it. We have also developed our Practice beyond theirs. We will need a thoughtful
two way exchange to bring both Practices up to the highest level that either of them define."

## Problem

Two living Practice instances share an ancestor: the lineage commit this transplant was pinned
to (`SHA: e477e62f7`, 2026-09-12), which on this estate is the transplant merge
(`SHA: 55649a2`) whose Practice surfaces were imported at that pin (the first import's lineage
pin, `SHA: a55fd8fdd`, is superseded by it). Since then both moved: the lineage's own curator
delivered a delta note into this estate's Practice Box
(`.agent/practice-core/incoming/2026-09-14-oak-line-delta-since-e477e62f7.md`) naming a new
Core decision record and schema, four amended decision records, clauses on thirty-one rules and
ten skills, three new tooling families and a changed pre-push hook; this estate, in the same
window, adapted every surface it brought and built instruments the lineage does not have (the
measured-state merge bot and its suppressed-findings hold, the sub-agent adapter generator, the
lineage-name and machine-local-path validators, the tracked-universe gates, the per-checkout
e2e port, the transplant's own record and runbook). Neither instance is a superset of the
other. The lineage doctrine's two-way merge ("start from the incoming files, merge local
additions back") covers a locally evolved Practice at the file level; it has no step that
decides, for a concept both sides evolved independently, which encoding is higher, so a
file-level merge would overwrite one estate's learning with the other's encoding. The gap:
no mechanism yet gives every such concept one disposition and lands it on both sides. The
harm: each estate keeps repairing what the other has already cured, and the drift compounds
with every session on either side. Success: every concept that changed on either side since
the ancestor has one disposition, recorded once, landed in both estates under each owner's
ratification, with the Box empty and the provenance chains naming each other's heads.

## Goal

Both Practice instances carry the higher form of every concept either one defined since the
ancestor, each landed through its own estate's gates, with a recomputable record of what moved
where and why, and a repeatable procedure so the next exchange is a session, not a project.

## User groups and value

- **The owner**, who runs both estates: one set of cards per exchange, decisions made once,
  and no concept cured twice.
- **Seats on either estate**: the rules, skills and instruments they run are the best either
  estate has found; a lesson learned on one side stops recurring on the other.
- **The Practice itself**: its exchange doctrine (transformation and conjugation, the Box, the
  provenance chain) is exercised in both directions and amended where the exercise finds it
  thin.

## Mechanism

The exchange is conjugation, not transformation: both estates are live and the material is
negotiated, so the inter-Practice collaboration protocol governs the writes and the join, and
the lineage doctrine's Integration Flow governs the reading. Deltas are computed at the window,
never pinned in this node, so whatever lands on either side before then is in scope.

1. **Compute every delta from its ancestor** at the window's opening: on the lineage the
   Practice surfaces changed between its pin and its main, on this estate those changed between
   the transplant merge and its main, on castr those changed since its own Core transplant, and
   on the lineage those changed since castr's pinned read (Core, directives, rules, skills,
   sub-agents, hooks, adapters, agent-tools, CI and root manifests; continuity and memory
   surfaces excluded as local by doctrine). The delta note is an input to the lineage side's
   list, superseded by the computed list. The instrument is
   `.agent/reports/practice-transplant/inputs/exchange-delta.sh`, driven over the pins in
   `.agent/reports/practice-transplant/inputs/exchange-pins.tsv` by
   `.agent/reports/practice-transplant/inputs/exchange-deltas.sh`; the computed lists sit beside
   them, so every delta is recomputable. Heads are re-pinned once before the register closes.
2. **Classify every changed path into a concept row**, not a file row: the same concept on
   both sides (which encoding is higher, or a merge of the two); one side only (bring, or
   decline with the reason: product, host-specific, already implicit); a conflicting ruling
   (a card, to the owner, once, for both estates). The first pass is one seat with the
   assumptions-expert lens on the rows that claim "already implicit"; no fleet.
3. **The exchange register**: one file under the transplant's reports
   (`.agent/reports/practice-transplant/exchange-register.md`) carrying every row with its
   disposition per estate, its path globs and its landing pull request on each side; the
   validator `pnpm exchange-register:check`, a `docs-validators:check` leg, refuses a path in
   any delta with no row and a glob that matches nothing.
4. **Land inbound here** as pull requests sized to about eight review-facing claims, two review
   rounds binding by default, every finding left after round two dispositioned in that same
   slot turn, a further round only as the Director's correctness exception (closure record,
   item 100), every import carrying a provenance entry (`id` as a UUID, `repo`, `date`,
   `purpose`; pin-free) and the
   lineage head it was read at recorded in the register and the delivery event;
   the fitness functions and the cohesion audit run after each landing (two-way merges push
   files over their ceilings).
5. **Deliver outbound** into the lineage's Practice Box as a pin-free note plus the material,
   with the paired delivery event on that estate's comms stream, through the join ceremony;
   the lineage's own seats land it under the lineage's gates. This estate never writes into the
   lineage's tree.
6. **Close**: both provenance chains carry the exchange's entries (repo, date, purpose) and
   the heads read live in the delivery events and the register; both Boxes are empty; the
   exchange register is the record; the lineage doctrine's §Integration Flow and the
   collaboration protocol are amended where this exchange found them thin, as candidates on the
   register first.

Known overlap for step 2, recorded now so the window starts with it: this estate's
suppressed-findings hold (closure item 5a-vi) and the lineage's pull-request tally family cover
the same ground with different encodings; the lineage's review-cost push gate and this estate's
two-round ruling of 2026-09-14 do too.

## Acceptance criteria (each with a proof)

- Both deltas are recomputable from the ancestor and each estate's main by one script, and the
  register covers every path in either delta by a concept row (a path-to-row mapping, one row
  covering many paths). Proof: the register validator as a `docs-validators:check` leg, green
  (`repo-safe`).
- Every register row has a disposition and, where it lands here, a merged pull request in this
  repository. Proof: the register's rows cite merged pull requests; the validator refuses a
  landing row for this estate without one (`repo-safe`); landings on the lineage are proven by
  the owner-held criterion below.
- The owner's cards for the conflicting rows are answered and the answers are the dispositions.
  Proof: the plan of record's ruling round, cited from the register (`owner-held`, the owner
  verifies on the cards).
- This estate's provenance chain carries the exchange's entries, the register names the lineage
  head read, the cohesion audit and the fitness functions are green after the last inbound
  landing, and the Box is empty. Proof: `provenance.yml`, the register, the verification
  audit's run, the directory (`repo-safe`).
- The outbound material was delivered to the lineage's Box with its comms event, integrated by
  the lineage's seats, and cleared, and the lineage's provenance chain carries the exchange
  entry. Proof: the delivery event id, the lineage's landing pull requests, its provenance
  entry and its empty Box, recorded in the register; the owner verifies on the lineage estate
  (`owner-held`).

## Todos

1. At the window: the delta script and the computed lists, one per pins row (one pull request,
   code-class; this amendment rides it).
2. The concept rows and the register (one pull request, prose-class, the intake contract
   declared at open), then the register validator (one pull request, code-class).
3. The cards for conflicting rows, one batch.
4. Inbound landings, one pull request per eight claims, in the register's order.
5. The outbound note and material, delivered through the join ceremony.
6. The close: provenance, audit, Box, and the doctrine amendments as register candidates.

## Plan-body first-principles check

- **Shape.** Every proof tests repo-authored behaviour: a delta script's run, a register
  validator's leg, a provenance entry, an empty directory; the lineage-side proofs are
  owner-held and named as such.
- **Landing path.** `.agent/plans/delivery/`, scanned by `validate-plan-corpus`; the register
  under the transplant's reports; the validator as a `docs-validators:check` leg.
- **Reversibility.** Every inbound landing is a pull request with a register row and a
  provenance entry; every outbound delivery is a Box note with a paired event; nothing is
  written into the other estate's tree from here.
- **Optionality.** The concept-row disposition is the open design; the exchange mode
  (conjugation under the collaboration protocol) and the pin-free Box contract are closed by
  existing doctrine and not reopened here.

## Out of scope

- The transplant closure's items 3 to 8: this node opens after they land, and a closure pull
  request never carries exchange material.
- The graduation drain of the pending-graduations register and the archive of the
  unconsolidated napkins: curator work on its own cadence (closure record, item 94).
- The Practice language separation node: it consumes this exchange's result, not the reverse.
- Editing the lineage's tree from this estate: outbound material lands under the lineage's own
  gates by its own seats.
- Reconciling continuity and memory surfaces: local by doctrine on both sides.
