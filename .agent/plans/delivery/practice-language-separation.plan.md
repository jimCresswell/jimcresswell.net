---
id: practice-language-separation
node_type: delivery
name: Practice language separation — a universal core, thin language packs, and language-agnostic instrument contracts
overview: >-
  Make the Practice's memotype/phenotype boundary mechanical: declared scope
  with a leak validator, a schema'd host profile, thin language packs for
  TypeScript, Python and Rust, and the agent-tools contracts as JSON Schema
  plus a conformance corpus any implementation can run.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: best-of-each-practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: practice-completion
    kind: beneficial
owner_gates:
  - awaiting: owner-decision
    clears_when: >-
      The owner ratifies the direction as a strategy choice in the Practice
      stream (proposed PRACTICE-4: "The Practice is language-agnostic at its
      core; languages are thin packs; instrument contracts are
      language-neutral and enforced by conformance"), or amends its wording.
    expires: 2026-10-04
  - awaiting: owner-decision
    clears_when: >-
      The owner rules how the instruments reach a non-TypeScript host: the
      reference implementation shipped as a built binary (the recommended
      default), a port per language validated by the conformance corpus, or
      both in a named order.
    expires: 2026-10-04
  - awaiting: owner-decision
    clears_when: >-
      The owner names the Rust reference (a recorded PDR-006 gap; the pack may
      be authored from its own first host) and confirms the Python pack's
      first host. The owner has already ruled (2026-09-13) that the existing
      Python Practice repository (https://github.com/EngraphCode/python-starter)
      is a very rough sketch, not a template: the
      Python pack is authored from the universal layer with a structure
      matching the lineage, and that repository provides hints, never intent.
    expires: 2026-10-04
last_updated: 2026-09-23
---

# Practice language separation

Authored 2026-09-13 at the owner's direction (verbatim in the exploration record): separate the
universal Practice from its language-specific parts in documents, rules, skills and the agent
tools; support at least TypeScript, Python and Rust; define the agent tools' contracts and
interactions language-agnostically and still enforce them. Not urgent; important. The reasoning
is in
[`.agent/reports/practice-transplant/practice-language-separation.md`](../../reports/practice-transplant/practice-language-separation.md);
this node sequences it.

The lineage already claims the boundary (PDR-035 memotype/phenotype, PDR-008 gate names that
travel verbatim, PDR-006 reference repos per ecosystem) and carries one language-agnostic
contract with its discipline written in (the inter-Practice wire schema). This node makes the
claim mechanical.

## Goal

A host declares its languages once. Universal doctrine carries no language token and a
validator refuses one. A language pack is mostly configuration. Every agent-tools contract is
readable from any language as JSON Schema and every interaction is pinned by a conformance
corpus that any implementation runs. A Python or Rust host installs the Practice without a seat
trimming.

## User groups and value

- **The owner** gets a Practice that installs into the next host regardless of its language,
  with the trim step gone, and an instrument layer whose behaviour is specified once.
- **Seats on a non-TypeScript host** stop internalising rules that are false for them and stop
  meeting commands that do not exist.
- **The lineage and its ecosystem** get a contract layer through which contributions travel
  without carrying a toolchain, and the design as a proposal under ruling 6.
- **Implementers of a second agent-tools** (if the owner ever orders one) get a corpus to pass
  instead of a codebase to read.

## Mechanism

Declaration before enforcement, contract before port. Scope is declared on every artefact and a
validator refuses leakage; the host profile turns PDR-008's table into data the universal
doctrine points at by role; the TypeScript pack is extracted from the live estate before any
new pack is authored, so the universal layer's generality is demonstrated on a real
counter-instance rather than asserted; the instrument contracts are authored as JSON Schema
2020-12 in Core with the reference implementation bound by generated types and boundary
validation; interactions are pinned by fixture cases run black-box against a binary.

Minimum shippable shape without `practice-completion`: the leak validator stands alone; the
antigen-scan instrument that node's todo 6 lands is its sibling, not its prerequisite.

## Acceptance criteria (each with a proof)

1. **No language token in universal doctrine.** Every `.agent` artefact declares `scope`; a
   `docs-validators:check` leg refuses a universal artefact carrying a token from any language
   pack's vocabulary. Proof (repo-safe): the leg, green, and its first pre-cure count recorded
   in the plan of record.
2. **The host profile is the single source for host facts.** `.agent/practice-host.json`
   validates against its Core-carried schema; the gates skill, the start-right workflows and
   the cited-scripts validator read gate names and the task runner from it. Proof (repo-safe):
   the schema, the validator, and a grep showing no universal artefact names `pnpm`.
3. **Projection follows the profile.** `portability:fix` emits a platform adapter only for
   artefacts whose scope matches the profile; `portability:check` refuses a stray. Proof
   (repo-safe): the generator's test with a Python-only profile fixture.
4. **The TypeScript pack is thin and complete.** The pack holds every artefact the leak
   validator moved out of the universal layer, and the estate's gates are green with the
   universal layer plus the pack. Proof (repo-safe): `pnpm check`; the pack's file count and
   the universal layer's, recorded.
5. **Every instrument contract is JSON Schema.** Each schema-versioned format (active claims,
   closed claims, comms events, watcher heartbeat, the hook policy, the host profile) and each
   frontmatter contract (plan node, skill, pattern, template) has an authored schema under
   `practice-core/schemas/`, the reference implementation binds by generated types, and a
   validator refuses drift between a schema and the fixtures its consumers use. Proof
   (repo-safe): the schemas, the sync leg, green.
6. **Interactions are pinned by a corpus.** A fixture corpus under `agent-tools` runs black-box
   against the built binary as its smoke suite, covering every CLI topic's verbs with setup,
   argv, exit code, output and state diff. Proof (repo-safe): the smoke leg, green, and the
   corpus's case count per topic.
7. **A second language pack installs.** A Python host fixture (a minimal repository) takes the
   universal layer, the Python pack and the built instruments, and its start-right run meets no
   dead command or false rule. Proof (repo-safe): the fixture and its run, in CI.

## Todos

1. **Measure and declare.** Add `scope` to every `.agent` artefact's frontmatter (universal
   by default; the nine language-bound rules, the four toolchain skills, the type and framework
   experts declared explicitly); land the leak validator with the TypeScript vocabulary; record
   the first count; wire the leg after the cures. The transplant antigen scan and this scan
   share one instrument with two vocabularies.
2. **The host profile.** Author `practice-core/schemas/practice-host.schema.json` and
   `.agent/practice-host.json` for this host; move PDR-008's per-ecosystem table into the
   profile's gate-role map; re-point the gates skill, the shared start-right workflows and the
   cited-scripts resolver at the profile; universal doctrine names roles.
3. **Extract the TypeScript pack.** Split the TypeScript practice back out of
   `validation-strategy.md` at its declared seam; move the language-bound rules, skills and
   experts under the pack; teach the adapter generator and `portability:check` to project by
   the profile; prove the estate green on universal plus pack.
4. **Contracts as schemas.** Author the JSON Schemas for the schema-versioned formats and the
   frontmatter contracts; bind the reference implementation by generated types with boundary
   validation; land the sync validator; PDR amendment candidate naming JSON Schema 2020-12 as
   the contract language and the conformance corpus as the behaviour specification.
5. **The conformance corpus.** Author fixture cases per CLI topic and the black-box runner;
   adopt it as the agent-tools smoke suite; name the reference-implementation-only behaviours.
6. **Python and Rust packs.** The Python pack is authored from the universal layer with the
   lineage's structure, reading the existing Python Practice repository for hints only (owner
   ruling 2026-09-13); the Rust pack after the third gate names its host; the Python host
   fixture in CI.
7. **Instruments for non-TypeScript hosts** per the second gate: the built-binary release
   shape, or the port order.
8. **Send the design to the lineage** under ruling 6 as a proposals batch, with the
   exploration record's warrants and falsifiers.

## Out of scope

Rewriting the reference implementation in another language before the corpus exists (the
corpus is what makes a port checkable); framework packs beyond the ones the live estate
already carries (Next.js and React stay as the first framework pack, extracted with the
TypeScript pack); cross-cutting ecosystem packs (SQL, infrastructure, containers) named by
PDR-006 — same mechanism, later; product surfaces.

## Plan-body first-principles check

- **Shape.** Every proof tests repo-authored behaviour: a validator's run, a generator's
  fixture, a schema sync, a smoke run. The only vendor shapes touched are the platform hook
  wire contracts, already validated by the estate.
- **Landing path.** `.agent/plans/delivery/`, scanned by `validate-plan-corpus`.
- **Reversibility.** Every step is additive: scope declarations, schemas, a profile, a corpus;
  the leg is wired last; the pack extraction is a move with the generator proving the
  projection.
- **Optionality.** The contract language is decided by precedent (the wire schema); the
  authoring direction (schema-first) is a verdict with a named falsifier, not a gate; the
  instrument delivery shape is the owner's cost decision and stays a gate.
