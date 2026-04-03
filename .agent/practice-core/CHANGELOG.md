# Practice Core Changelog

Changes to the Practice Core files, newest first. Each entry records the repo
that made the change and what was changed. This file travels with the
Practice Core package.

## [new-cv] 2026-04-03

- Extracted trinity provenance into `provenance.yml` and updated the portable
  package model from six files to seven
- Replaced single-value `fitness_ceiling` wording with the four-field fitness
  model used by the new Practice fitness validator
- Migrated provenance entries from positional `index` fields to UUID `id`
  fields; chronology stays in array order and `date`, and integration still
  compares detailed content rather than shorthand fields alone
- Added an explicit local cross-platform agent surface contract in
  `.agent/reference/cross-platform-agent-surface-matrix.md`
- Added repo-local validation scripts and package commands for portability and
  Practice fitness, and wired portability validation into `pnpm check`
- Aligned wrapper surfaces (`deslop`, `pkg`, `start-right`, `read-practice`)
  and Codex command wrappers with their canonical sources
- Reconciled README, CONTRIBUTING, requirements, ADR-005, hooks, and related
  agent docs with the live check, test, and interactive tooling story

## [new-cv] 2026-03-09

- Added value traceability to the portable planning model: non-trivial work now has to state outcome, impact, and value mechanism
- Updated `practice-lineage.md` so the metacognition prompt and `plan` command both carry the outcome-to-value bridge explicitly
- Tightened `practice.md` to treat plan templates as optional supporting artefacts rather than a required `.agent/plans/templates/` layer
- Updated the bootstrap practice-index template so `.agent/plans/` no longer implies a mandatory templates subtree
- Added an optional `.agent/practice-context/` adjunct pattern with sender-maintained `outgoing/` support material and transient receiver-side `incoming/`; clear `incoming/` after integration and let agents consider supporting outgoing files when a changelog entry alone would be too thin
- Tightened consolidation truth-maintenance wording so graduation now explicitly
  reconciles frontmatter status, narrative status, next-step sections, and
  current-state or audit notes when live documentation changes role

## [new-cv] 2026-03-08

- Clarified the portable Codex model: `.agents/skills/` is for skills and command-shaped workflows, while real Codex reviewer sub-agents live under `.codex/`
- Updated `practice.md` to include `.codex/` in the tooling layer, review-system description, and artefact map
- Updated `practice-bootstrap.md` so its adapter summary and reviewer-roster wording match the `.codex/` reviewer model
- Aligned the portable Practice wording with the repo's current Codex reviewer architecture

## [new-cv] 2026-03-06

- Added "Restructuring an Existing Practice" path to practice-lineage.md
- Expanded Ecosystem Survey to include practice maturity assessment
- Extended "Never overwrite" to cover domain-specific practice mechanisms
- Added routine cohesion audit to consolidation command specification
- Reframed underscore-prefix rule as ecosystem-agnostic principle
- Added this changelog
- Updated all "five files" references to "six files" across practice-core
- Removed vestigial ADR numbers (114, 117, 119, 124, 125) from practice.md and practice-bootstrap.md — concepts already described inline
- Fixed broken references: `schema-first-execution.md`, `invoke-code-reviewers`, `pnpm qg`
- Made non-canonical paths generic: ADR directory paths removed from practice-core (routed via practice-index)
- Aligned distillation threshold to ~500 lines across practice.md and practice-bootstrap.md
- Made portability check step ecosystem-agnostic in practice-bootstrap.md

## [new-cv] 2026-03-05

- First restructuring hydration: adopted practice-core into a repo with mature platform-locked practice
- Added provenance entries for new-cv to all three trinity files

## [oak-open-curriculum-ecosystem] 2026-02-28

- Ecosystem-agnostic hydration: labelled ecosystem-specific content
- Added cold-start path
- Aligned consolidation with concurrent documentation principle

## [oak-open-curriculum-ecosystem] 2026-02-27

- Adopted practice-core structure, trinity concept, and bootstrap from round-trip

## [cloudinary-icon-ingest-poc] 2026-02-26

- Origin: initial practice-core files created for short-lived POC

## [oak-open-curriculum-ecosystem] 2026-02-26

- Origin: initial practice-lineage created for production SDK ecosystem
