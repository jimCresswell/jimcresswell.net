# Skill composition — modes, workflows, programmes

The skill estate is infrastructure for agents: markdown files are load-bearing
architecture, so DRY and single-source-of-truth apply to them exactly as they
apply to code. This reference names the composition hierarchy and the two
rules that make it an architecture rather than a taxonomy. Imported and
adapted 2026-08-09 from the Oak Open Curriculum Ecosystem Practice (itself
adapted from the Resonance estate, 2026-07-20), mapped onto this repo's skill
roster.

## The three layers

- **Modes** — ways of being present to the work: `metacognition` (inward) and
  `reason` (outward). A mode is **entered, not executed**; it cannot be
  summarised into a checklist without ceasing to be itself. Modes have no
  steps to delegate and nothing to loop.
- **Workflows** — bounded compositions with one purpose and (usually) one
  sitting: `concept-exploration`, `retrospective`, `knowledge-safety-sweep`,
  `session-handoff`, `consolidate-docs`, `plan`, `pr-lifecycle`,
  `semantic-merge`, `undo-change`, `distillation`, `author-skills`,
  `quality-gates`, and kin. A workflow summons modes at its judgement moments
  and may summon sibling workflows for sub-purposes.
- **Programmes** — compositions that loop workflows toward a declared
  end-state across sittings: `wrap` (deep closeout to the metaloss fixed
  point), `consolidate-until-done` (grounding plus consolidation passes until
  every buffer is drained), and the session-boot compositions
  (`start-right-quick`, `start-right-thorough`, `start-right-team`) that
  structure a whole session's execution. A programme owns the loop, the exit
  contract, and the honest partial-exit; the work inside each pass belongs to
  the summoned workflows.

## The two rules

1. **Summon by reference, never inline.** The substance of a composed
   capability lives in exactly one canonical file — the summoned skill, rule,
   or directive. The summoning skill carries only the MOMENT (when to summon)
   and the REASON (what the summons is for there). Restating a summoned
   skill's steps inline is drift-by-duplication: the copies diverge, and the
   divergent copy always loses. The corollary: when a capability appears
   inline in two skills, extract it to its own skill and summon it from both.
2. **Modes are doors, not steps.** A summons of `metacognition` or `reason`
   is an entry into a different way of attending, with whatever presence that
   costs — never a box the invoking workflow ticks. A failed pass that merely
   restates its inputs is the named failure (each mode's own success test
   governs).

## Current composition map (2026-08-09)

```text
programmes   wrap ────────────────────▶ modes; work-safety evidence;
                                          session-handoff; consolidate-docs
                                          (conditional); retrospective
                                          (offered); owns the metaloss
                                          recursion to its fixed point
             consolidate-until-done ──▶ start-right-quick, consolidate-docs
             start-right-* ────────────▶ grounding over everything

workflows    consolidate-docs ─────────▶ modes at drain-open; loss-scan
                                          discipline per knowledge-safety-sweep;
                                          distillation at the napkin threshold
             session-handoff ──────────▶ modes at scan-open; loss-scan
                                          discipline per knowledge-safety-sweep
             pr-lifecycle ─────────────▶ retrospective after significant arcs;
                                          semantic-merge on diverged memory
             plan ─────────────────────▶ modes at the design gate
             concept-exploration ──────▶ modes as alternating movements;
                                          proportionality as its sizing pair;
                                          hands settled synthesis to plan
             retrospective ────────────▶ modes; lands its record in
                                          .agent/reports/

modes        metacognition, reason (entered everywhere above; owned nowhere
             but their own canonical files)
```

The map is descriptive, refreshed when composition changes; the summoning
skills' own text is authoritative at each edge.
