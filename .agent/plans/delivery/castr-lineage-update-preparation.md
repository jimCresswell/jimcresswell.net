---
id: castr-lineage-update-preparation
node_type: delivery
name: Castr lineage-update preparation
overview: >-
  Land the instruments and the instance-1 inputs that let the castr
  transplant run as the practice-lineage-transplant runbook, so its owner
  questions are only castr-specific and its mechanical steps are bins.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: practice-lineage-transplant
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: practice-lineage-transplant
    kind: beneficial
owner_gates: []
last_updated: 2026-09-12
---

# Castr lineage-update preparation

`serves` names the runbook because this repository has no strategic node
yet; the plan-node migration re-parents it. The beneficial dependency's
minimum shippable shape without the runbook ratified: the bins and the
inputs land and are usable from the sketch runbook's step numbers, which
are stable across ratification edits.

## Goal

The castr transplant costs a fraction of the first one: its owner
questions are only the ones castr's profile cannot answer, its
classification and scrub are instruments, and its instance-1 verdicts
arrive as inputs rather than being re-derived.

## User groups and value

- **The owner** answers castr-specific questions only; instance 1's
  standing answers (which lineage subjects are upstream product, which
  scripts have no consumer, where each cited lineage record lives locally)
  are inputs.
- **The castr seat** (a live sole operator there today) runs the runbook
  with bins and a manifest; it writes no instrument of its own.
- **This repository** gains the two generators it lost at instance 1's
  context end, as bins it can re-run.

## What the castr pre-read measured (2026-09-12, read-only)

Facts read from the castr checkout and the OCE git objects; the castr seat
confirms the ancestor at the runbook's precondition 2 before anything else.

- castr already carries the OCE lineage at the June 2026 generation (a
  three-way merge recorded in its `provenance.yml` on 2026-06-05; its own
  transplant records name gap rescans to 2026-06-28), inside an `@engraph`
  pnpm monorepo with its own `agent-tools` workspace and root script set.
  No monorepo conversion, no org scrub, and the harness surfaces (husky,
  hooks, markdownlint, gitleaks) already exist there.
- castr's local divergence to preserve: 12 rules only castr has; three PDR
  numbers whose subject differs from the lineage's (096, 097, 124); its own
  sub-agent adapter generator (`agent-tools/src/agent-adapter-generate`,
  which takes the Codex adapters as the hand-authored source); its own
  transplant plan family under `.agent/plans/transplant/` and PDR-096 on
  transplant completeness.
- Upstream delta, measured from the candidate ancestor `68656471c` (the
  last OCE `main` commit on 2026-06-28) to the instance-1 pin `a55fd8fdd`,
  machinery paths only: 434 files changed, about 39,800 lines added and
  2,100 removed; rules 33 added, 64 modified, 4 deleted, 1 renamed; 39
  skill directories added; 21 PDRs added. Measured from the 2026-06-05
  date instead, the counts are larger (494 files; rules 49 added), so the
  ancestor choice is the first thing the castr run settles, by the
  byte-equality check, not by date. `agent-tools` shows 1,020 files
  changed, most of it upstream product tooling the instance-1 excise list
  already names.
- Since the pin, OCE's pull-request machinery merged at `2b1b15ab8`
  (seven surfaces, named in repo-continuity); castr takes that generation
  or a later one, so the pin is re-chosen at castr's precondition 1.

## Mechanism

Three-way classification against the ancestor turns most of the 434 paths
into a mechanical overwrite (castr unchanged since its base) and confines
judgement to the both-changed and theirs-only sets. The instance-1 verdict
table supplies the default verdict for every theirs-only rule, skill and
script it already names, so fresh judgement is spent only on the rules,
skills and PDRs newer than instance 1's own source, and on castr's 12 local
rules. Instruments as bins remove the re-scripting that cost instance 1
twice.

The adapter-generator direction is not an open decision: PDR-009 (canonical
`.agent/` substance; platform files are thin adapters of it) and ADR-015
(the Codex adapter model) settle that the canonical templates are the
source and every platform adapter is a projection. The bin landed here
follows that ruling; castr's generator inverts it, and the runbook's step 8
replaces it at castr's run, by castr's seat.

## Todos

One slice per PR (`design-work-for-small-prs`); slicing consumes the review
dispositions below. Script names in this node and the runbook are written
without a `pnpm` prefix on purpose: the cited-scripts validator refuses a
`pnpm <script>` citation whose script does not exist yet, and these do not
exist until their slice lands.

1. **Build-versus-buy for classification, first.** Before any bespoke
   classifier: add the pinned source as a remote of a scratch clone and try
   `git diff --name-status <ancestor> <pin>` joined with per-path
   byte-equality against the host, and `git merge-tree` for the
   both-changed set. If that yields the five classes the runbook's step 2
   names, `transplant classify` is a thin wrapper that emits the manifest
   rows (JSON and markdown) and nothing more.
2. **`transplant classify`** as an `agent-tools` bin with a fixture-tree
   test, per the answer to 1.
3. **`transplant antigen-scan`**: the two-tier grep list as data (org-shaped
   and product-shaped), a bin that reports hits by tier; fixture test.
4. **`transplant digest`**: the per-rule digest (frontmatter, headings,
   every product-shaped line) the runbook's step 6 triages from; fixture
   test.
5. **The sub-agent adapter generator** as a bin, canonical templates as
   the source (PDR-009), emitting the Claude, Cursor and Codex adapters and
   the Codex registry; the recipe is in the efficiency-guidance report's
   wrap findings; fixture test.
6. **The classified rules-index generator** as a bin (three-column
   `RULES_INDEX.md` from the canonical rules plus their classification);
   fixture test. Runbook step 8 is its consumer.
7. **Instance-1 inputs as data** under
   `.agent/reports/practice-transplant/inputs/`: the rules verdict table
   (rule, verdict, reason class) from the plan of record's rules-triage
   section; the drop list by subject class; the script keep/retire list;
   the record-number-to-home map, derived from the rules-triage commit's
   diff (every replaced `ADR-NNN` citation and its replacement); the
   antigen list; the config decision list; the standing owner question
   set. Each file states which runbook step reads it (4, 5, 6, 9 or 10)
   and what default it changes.

## Acceptance criteria

1. Every instrument the runbook's precondition 5 names exists as a root
   `package.json` script and runs green on a fixture tree. Proof:
   `repo-safe`, the agent-tools unit tests (a `pnpm check` leg) and the
   cited-scripts validator, which runs under `pnpm check:docs`. `check:docs`
   is not yet a leg of `pnpm check`, pre-push or CI; wiring it is the close
   of the link-repair pass on repo-continuity, and until then the proof is
   the command run by hand and its output recorded on this node.
2. Every inputs file names its reader step and the runbook cites it by
   path. Proof: `repo-safe`, the markdown-links validator (also
   `check:docs`, same wiring caveat) resolves every citation.

The castr run's own outcomes (owner question count, elapsed time against
the two-hour threshold, zero session-local instruments at close) are the
runbook's verification, recorded there by the seat that runs it.

## Out of scope

- Writing into the castr checkout: its live seat owns it; this node
  prepares inputs and instruments here and measures castr read-only.
- The installable-thing generator, the lineage lockfile and the OCE-side
  seam work (proposals 1 to 4 of the packaging exploration): deferred to
  the castr result by proposal 5's own falsifier.
- The plan-node estate migration (39 legacy plans, the validator's
  `docs/strategy` dependency): a slice 2 item on repo-continuity; until it
  lands, this node and the runbook conform to the templates by hand and no
  gate scans them.

## Plan-body first-principles check

- **Shape.** The proofs test repo-authored behaviour (bins on fixtures,
  citations resolving), never that a vendor did its job.
- **Landing path.** `.agent/plans/runbooks/` and `.agent/plans/delivery/`
  are the ratified node-type directories, but no wired gate scans them yet
  (the plan-corpus validator is not a `check` leg and fails on a missing
  `docs/strategy`); the two validators the proofs cite run only under
  `check:docs`, which no hook or CI job runs today. Both stated so nobody
  reads the absence of a red as a green.
- **Vendor literals.** `git diff --name-status`, `git merge-tree`,
  `git show <pin>:<path>` and `git tag` are the only external surfaces; the
  repo scripts named (`portability:fix`, `subagents:check`, `skills:check`,
  the validators) exist in the root `package.json` today.
- **Optionality.** The generator direction is closed by PDR-009 and
  ADR-015; the ancestor is closed by a check, not a date; no open decision
  is embedded.
- **Record consumer.** The inputs directory has a named reader per file
  (runbook steps); the runbook's timing table is read by the owner deciding
  proposal 5.
- **Rules tier.** `replace-dont-bridge` (one generator design, no bridge),
  `stage-by-explicit-pathspec`, `design-work-for-small-prs`,
  `practice-core-portability` (the runbook lives outside Core; a PDR-005
  amendment is the Core-side graduation after instance 2),
  `no-tombstones-for-removed-ideas`; and the privacy directive's
  machine-local-paths clause (checkouts are named as placeholders).

## Review dispositions

| Date       | Source                   | Finding                                                                     | Disposition                                                          |
| ---------- | ------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 2026-09-12 | assumptions-expert, pre-ratification | Ancestor derived from a date contradicted the node's own counts             | applied: ancestor is a recorded SHA proven by byte-equality          |
| 2026-09-12 | assumptions-expert, pre-ratification | Owner gate on generator design is settled by PDR-009 and ADR-015            | applied: gate removed, enforcement story carried                     |
| 2026-09-12 | assumptions-expert, pre-ratification | Proofs cited validators no gate runs; future scripts invisible to the check | applied: `check:docs` wiring stated; bare script names on purpose   |
| 2026-09-12 | assumptions-expert, pre-ratification | Two acceptance criteria belonged to the castr run                           | applied: moved to the runbook's verification                         |
| 2026-09-12 | assumptions-expert, pre-ratification | `depends_on` key, missing minimum shape, a non-rule cited as a rule         | applied                                                              |
| 2026-09-12 | assumptions-expert, pre-ratification | Unevidenced counts (root scripts, "126 rules"); five bins in one PR         | applied: counts removed, one bin per slice, build-versus-buy first  |
