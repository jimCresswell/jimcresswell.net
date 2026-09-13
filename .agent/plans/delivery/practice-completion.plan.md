---
id: practice-completion
node_type: delivery
name: Practice completion — the entire Practice, as appropriate here, with the record that makes the next transplant quick
overview: >-
  Bring every function of the Practice over from the lineage pin, adapted to
  this repository, cure every claim the estate makes without a mechanism,
  and leave a compiled record (what, how, why) plus the instruments that make
  the next transplant a fraction of this one.
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-09-13
ratified_where: >-
  Owner cards, 2026-09-13 after the second compaction ("Ratify as written");
  the same round cleared the three gates recorded under §Owner rulings.
  Plan of record: docs/explorations/2026-09-12-oce-practice-lineage-transplant.md
  §Owner rulings, round 8.
serves: practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-13
---

# Practice completion

Authored 2026-09-13 at the owner's direction, verbatim: "We want the entire
Practice brought over, as appropriate for the context of this repo, and we
want a record of what, how, why, so that the next time we do this it is MUCH
much quicker, and of course we want to explore how the Practice could be
extracted into a separate, installable entity that could be simply added to
other repos without sacrificing the learning, self improvement, contributions
back to the Practice and wider Practice ecosystem."

The direction flips the transplant's default. On 2026-09-12 a surface stayed
only when the host ran what it governs; from today a surface comes over
unless it is product (an app, a vendor the host lacks, a domain the host does
not have), and the Practice's knowledge about itself is Practice. Rulings
made under the old default (the trimmed instruments, the dropped patterns
corpus, the four generic rules dropped as vendor-shaped) reopen under this
node; product drops stand.

## Owner rulings (2026-09-13, on cards, the ratification round)

1. **Gemini is carried; Windsurf is rejected.** The Gemini projection is
   imported from the pin, scrubbed, and becomes a `portability:check` leg;
   Windsurf is recorded as unsupported in the surface matrix.
2. **The Practice's knowledge base comes over as the cited subset, scrubbed.**
   Records that live doctrine here cites (five today) and the research the
   definition names are imported; the rest stays at the pin, re-importable.
3. **The instruments belong to this node.** Classify, antigen-scan, digest,
   the adapter generator and the rules-index generator serve every future
   transplant, so they are todo 6 here. The earlier second-host preparation
   node was withdrawn as premature and removed from the estate.

## Goal

Every one of the nine functions in
`.agent/reports/practice-transplant/what-the-practice-is.md` reads "present,
current generation, divergence recorded" with a proof; no live doctrine
cites a surface the estate lacks; the record of what, how and why is one
indexed set a successor loads; and the installable-entity design is a
warranted proposal the lineage can act on.

## User groups and value

- **The owner** gets a Practice that is whole here, a record that makes the
  next host cheap, and a design for installing it elsewhere without losing
  the learning loop or the return channel.
- **Seats here** stop meeting latent refusals: every cited pattern, record,
  instrument and path resolves.
- **The lineage and its ecosystem** get the instruments and the extraction
  design as suggestions through the open channel.

## Mechanism

Function by function against the pin (`e477e62f7`), in the order the
definition report ranks the evidence: first the estate's own unmet claims
(exercised, not surveyed), then the diff, then the functions neither tree
carries. Every import is scrubbed by the antigen scan and lands with a
disposition row; every claim cured lands with the validator that keeps it
cured. The record is compiled, not appended: the reports index is the entry,
the runbook is the how, the definition is the what, the journey is the why.

## Acceptance criteria (each with a proof)

1. **No unmet claim.** A cited-paths validator (backticked `.agent/` and
   `docs/` paths in live skills, rules, directives and entry points resolve;
   placeholders and runtime-created directories allowlisted; archives
   excluded) is a `docs-validators:check` leg and green. Proof: the leg in
   `package.json`, its CI parity, the run.
2. **Every installed instrument is activated.** `practice-substrate` (fixed
   for pnpm 12), `validate-protocol-wire-contract` and the `agent-tools`
   smoke suite run under `check` or a named gate. Proof: the scripts exist
   and `pnpm check` is green with them.
3. **The definition's nine rows read present.** Each row cites its proof
   (a validator, a run, a file). Proof: the report's table, dated.
4. **The record is one indexed set.** The reports index names what, how,
   why and how-faster, and the runbook's completeness step cites the nine
   functions. Proof: the index and the runbook diff.
5. **The installable-entity design is warranted.** The exploration carries
   the ecosystem frame (install, learn, contribute back, update) with a
   falsifier per proposal, and the lineage-side proposals are sent under
   ruling 6. Proof: the report addendum and the comms record.

## Todos

1. **Cure class A** (doctrine cites what the estate lacks): import the seven
   doctrine-cited pattern files and the five cited research and report
   records from the pin, scrubbed; fix the path drift (`*-reviewer`
   template citations in the nine local skills, `skills/free-play/`, the
   surface-matrix path); restore `corpus-analysis`, `workflow-build` and the
   workflow file under `.agent/state/` so the four `corpus-*` templates and
   consolidate-docs §synthesis engine name a runnable instrument; give `sif`
   its concrete instruments (`the-codex-dialogues`, `codex-helper`) or
   rewrite its routing; land the cited-paths validator first so the cure is
   measured.
2. **Activate class B3**: `practice-substrate` root script and leg,
   `validate-protocol-wire-contract` leg, `test:e2e` for the smoke suite,
   the lineage root scripts that have consumers here (`lint:shell:syntax`,
   `check:profile`, `outdated`, `depcruise:report`).
3. **Function-by-function completeness pass** against the pin: the
   operational registers (create or declare runtime-created, per the
   substrate manifest), mutation testing (`stryker`, `mutate`) or its
   explicit absence in `testing-strategy.md`, the four generic rules
   re-triaged under the new default, the Gemini projection and the cited
   knowledge-base subset per §Owner rulings.
4. **Compile the record**: the reports index as the entry (what, how, why,
   how-faster); the runbook's step 13 cites the nine functions as its
   completeness audit; `provenance.yml` gains the completion entry; the
   plan of record stays the chronological log.
5. **The installable entity**: extend the exploration with the ecosystem
   frame (nine functions carried; install = pin and generate; learn = the
   local loop; contribute = outbound by shape to the lineage's incoming box
   under PDR-024 and PDR-125; update = three-way against the ancestor pin
   with local divergence preserved); send proposals 1 to 4 of the
   exploration to the lineage under ruling 6; draft the PDR amendment
   candidate for `provenance.yml` as the lockfile.
6. **Instruments**: `transplant classify`,
   `transplant antigen-scan`, `transplant digest`, the adapter generator,
   the rules-index generator, as `agent-tools` bins with fixture tests.

## Out of scope

Any particular next host (the instruments are host-agnostic); product
surfaces of the lineage (the MCP app, its vendors, the curriculum domain, the
design system's product tier); the 57-lesson synthesis (its own item,
owner-reviewed); `.agent-original/` deletion (the loss-scan list first).

## Plan-body first-principles check

- **Shape.** Every proof tests repo-authored behaviour: a validator's run, a
  script's existence, a report's dated table. None tests a vendor.
- **Landing path.** `.agent/plans/delivery/`, scanned by `validate-plan-corpus`
  as a `repo-validators:check` leg since 2026-09-13.
- **Reversibility.** Every import is from a pinned commit and lands with a
  disposition row; every activation is a script and a leg.
- **Optionality.** The generator direction is closed by PDR-009; the
  installable form is deliberately open (exploration proposal 5) until the
  ecosystem frame is warranted.
