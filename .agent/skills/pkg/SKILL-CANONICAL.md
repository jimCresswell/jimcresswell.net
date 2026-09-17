---
name: pkg
classification: active
description: >-
  Operational guide for personal knowledge graph work — entity model authoring,
  Schema.org conventions, JSON-LD constraints, and validation. Use when building,
  modifying, or reviewing the entity model, JSON-LD generation, or graph outputs.
---

# Personal Knowledge Graph

Compact operational reference for PKG work. For full detail, read the
sources listed below — this skill is a signpost, not a copy.

**Current-state reminder:** the visible website still renders from
`content/cv.content.json` and `content/frontpage.content.json`. The graph is
real and operational for JSON-LD and related outputs, but graph-backed page
composition is future Track B work, not current implementation.

## Reading requirements

Before PKG work, read and internalise:

| Document                                                                      | Purpose                                                        |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `.agent/plans/strategy/stream-knowledge-graph.md`                             | The live graph strategy: GRAPH-1 (graph-backed source of truth, Track B), GRAPH-2 (publication surface, Track A), GRAPH-3 (Neo4j-ready shape) |
| `.agent/plans-legacy-2026-09/DISPOSITIONS.md`                                 | Where each legacy graph plan's intent now lives; the legacy files below are the evidence record, and the stream above carries the live strategy |
| `.agent/plans-legacy-2026-09/current/personal-knowledge-graph-roadmap.plan.md`               | Conserved roadmap; the knowledge-graph stream now holds its sequencing and its two tracks |
| `.agent/plans-legacy-2026-09/current/personal-knowledge-graph-execution.plan.md`             | Track A execution record — complete for the current surface    |
| `.agent/plans-legacy-2026-09/research/graph-current-state-audit.md`                          | Implementation audit and architecture baseline as recorded; verify against the code |
| `.agent/plans-legacy-2026-09/active/personal-knowledge-graph-source-of-truth-design.plan.md` | Track B design record GRAPH-1 cites                            |
| `.agent/plans-legacy-2026-09/archive/graph-metaplan.plan.md`                                 | Completed reset record — why the current stack exists          |
| `.agent/plans-legacy-2026-09/research/personal-knowledge-graph-design-notes.md`              | Historical design reference — entity inventory and conventions |
| `.agent/plans-legacy-2026-09/archive/personal-knowledge-graph-phase-model.plan.md`           | Archived phase model and acceptance criteria                   |
| `.agent/plans-legacy-2026-09/research/pkg-research-findings.md`                              | Research findings — verified facts across four domains         |

Before editorial-intensive phases (entity population, role descriptions), additionally read:

| Document                                             | Purpose                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------- |
| `.agent/skills/editorial-voice/SKILL-CANONICAL.md`             | Jim's voice — two registers, common pitfalls                        |
| `.agent/directives/editorial-guidance.md`            | Authoritative editorial constraints                                 |

## Schema.org type mappings

Source: ADR-008 (`docs/architecture/decision-records/008-schema-org-compliance.md`), ADR-014 §2 (`docs/architecture/decision-records/014-entity-model-design.md`, the abstract and expressive entities) and ADR-021 (`docs/architecture/decision-records/021-canonical-only-cv-identity.md`, the retired tilt entities) + research findings (`.agent/plans-legacy-2026-09/research/pkg-research-findings.md`).

| Entity               | `@type`                                | `additionalType`           |
| -------------------- | -------------------------------------- | -------------------------- |
| Person               | `Person`                               | —                          |
| WebSite              | `WebSite`                              | —                          |
| Organisation         | `Organization` / `CollegeOrUniversity` | —                          |
| Role (employed)      | `EmployeeRole`                         | —                          |
| Role (volunteer)     | `OrganizationRole`                     | —                          |
| Credential           | `EducationalOccupationalCredential`    | —                          |
| Thesis               | `Thesis`                               | —                          |
| Publication          | `ScholarlyArticle`                     | —                          |
| Project              | `CreativeWork`                         | `.../Project`              |
| Software             | `SoftwareSourceCode`                   | —                          |
| Service              | `WebAPI`                               | —                          |
| ProfessionalIdentity | `Intangible`                           | `.../ProfessionalIdentity` |
| ResearchBackground   | `Intangible`                           | `.../ResearchBackground`   |
| GroundedPractice     | `Intangible`                           | `.../GroundedPractice`     |
| Capability           | `DefinedTerm`                          | `.../Capability`           |
| PositioningNarrative | `Statement`                            | `.../PositioningNarrative` |
| CVPage / FrontPage   | `ProfilePage`                          | —                          |

## `@id` conventions

Source: ADR-010 (`docs/architecture/decision-records/010-canonical-url-graph-identity.md`) + design reference.

| Entity type    | Pattern                                | Example                     |
| -------------- | -------------------------------------- | --------------------------- |
| Sitewide       | `https://www.jimcresswell.net/#<type>` | `#website`, `#person`       |
| Organisation   | `.../#org-<slug>`                      | `#org-oak`                  |
| Credential     | `.../#cred-<slug>`                     | `#cred-phd`                 |
| Thesis         | `.../#thesis-<slug>`                   | `#thesis-phd`               |
| Publication    | Canonical external URL                 | `https://arxiv.org/abs/...` |
| Role (CV page) | `.../cv/#role-<slug>-<dates>`          | `cv/#role-oak-2020-present` |
| Page           | `.../<path>#webpage`                   | `#webpage`, `cv/#webpage`   |

**Canonical document rule:** an entity's `@id` resolves to the page that is its canonical Linked Data document. Site-level entities resolve to the root. Page-anchored entities resolve to their page.

## JSON-LD constraints

Source: research findings (`.agent/plans-legacy-2026-09/research/pkg-research-findings.md`) — JSON-LD Best Practices.

1. **Single block per page.** One `<script type="application/ld+json">` containing one `@graph`.
2. **JSON-LD 1.0 subset only.** No 1.1 features (`@nest`, `@propagate`, `@included`).
3. **Self-containment.** Every `@id` reference in a subgraph resolves to a node within the same subgraph.
4. **Every entity gets an `@id`.** No blank nodes except genuinely embedded values (PostalAddress, PropertyValue).

## Consumer value tiers

Source: research findings (`.agent/plans-legacy-2026-09/research/pkg-research-findings.md`) — Consumer Value Tiers.

| Tier                | What happens                        | Key types                                                                |
| ------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| 1 — Rich results    | Visible Google features             | `ProfilePage`, `WebSite` + `SearchAction`, `Organization`                |
| 2 — Entity/E-E-A-T  | Entity understanding, trust signals | `Person`, `EmployeeRole`, `ScholarlyArticle`, `CollegeOrUniversity`      |
| 3 — AI/completeness | Valid but invisible to Google       | `Thesis`, `SoftwareSourceCode`, `DefinedTerm`, `Intangible`, `Statement` |

Effort should be proportional to tier.

## Neo4j forward-compatibility

Source: research findings (`.agent/plans-legacy-2026-09/research/pkg-research-findings.md`) — Neo4j Compatibility.

- [ ] Every entity has `@id` and `@type`
- [ ] Relationships are `{"@id": "..."}` references — no embedded entities
- [ ] Content-derived slugs for IDs — not array positions or hashes
- [ ] Schema.org property names as-is — map directly to Neo4j relationship types
- [ ] Entities file is valid JSON-LD — `@context`, `@graph` throughout
- [ ] No deep nesting — flat entity definitions with relationship references

## Validation workflow

Source: research findings (`.agent/plans-legacy-2026-09/research/pkg-research-findings.md`) — Validation Strategy.

| Tool                     | When            | Purpose                                            |
| ------------------------ | --------------- | -------------------------------------------------- |
| Programmatic `@id` check | Development     | Every `@id` reference resolves within the subgraph |
| Schema.org Validator     | Pre-deployment  | Strict spec compliance                             |
| Google Rich Results Test | Post-deployment | Google eligibility and visual preview              |
| Google Search Console    | Ongoing         | Real indexing errors and performance               |

## Common pitfalls

| Pitfall               | Wrong                               | Right                                                                                           |
| --------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `inSupportOf` type    | `inSupportOf: {"@id": "#cred-phd"}` | `inSupportOf: "PhD in Astrophysics"` (Text) + `about: {"@id": "#cred-phd"}`                     |
| `isBasedOn` domain    | `isBasedOn` on `DefinedTerm`        | `DefinedTerm` extends `Intangible`, not `CreativeWork` — express evidence in prose (ADR-014 §6) |
| `makesOffer` range    | `Organization.makesOffer → WebAPI`  | `WebAPI.provider → Organization` — `makesOffer` expects `Offer` intermediary (ADR-014 §7)       |
| Volunteer modelling   | `VolunteerAction`                   | `OrganizationRole` with `memberOf` chain                                                        |
| Blank nodes           | Entity without `@id`                | Every entity gets a stable `@id`                                                                |
| Cross-page references | Relying on cross-page `@id` merge   | Each subgraph is self-contained                                                                 |
| JSON-LD 1.1 features  | `@nest`, scoped contexts            | Stick to 1.0 subset                                                                             |
| Pronouns modelling    | Custom field for pronouns           | `Person.pronouns` — first-class Schema.org property                                             |

## Reference

- `.agent/plans/strategy/stream-knowledge-graph.md` — the live knowledge-graph strategy (GRAPH-1 to GRAPH-3)
- `.agent/plans-legacy-2026-09/DISPOSITIONS.md` — where each legacy graph plan's intent now lives
- `.agent/plans-legacy-2026-09/current/personal-knowledge-graph-roadmap.plan.md` — conserved roadmap; the knowledge-graph stream holds its sequencing
- `.agent/plans-legacy-2026-09/current/personal-knowledge-graph-execution.plan.md` — Track A execution record
- `.agent/plans-legacy-2026-09/research/graph-current-state-audit.md` — implementation baseline as recorded
- `.agent/plans-legacy-2026-09/active/personal-knowledge-graph-source-of-truth-design.plan.md` — Track B design record
- `.agent/plans-legacy-2026-09/archive/graph-metaplan.plan.md` — completed reset record
- `.agent/plans-legacy-2026-09/research/personal-knowledge-graph-design-notes.md` — historical design reference
- `.agent/plans-legacy-2026-09/archive/personal-knowledge-graph-phase-model.plan.md` — phase model (archived goals, tasks, acceptance criteria)
- `.agent/plans-legacy-2026-09/research/pkg-research-findings.md` — research findings (verified facts across four domains)
- `docs/architecture/decision-records/008-schema-org-compliance.md` — ADR-008: Schema.org compliance
- `docs/architecture/decision-records/010-canonical-url-graph-identity.md` — ADR-010: canonical URL and graph identity
- `docs/architecture/decision-records/011-domain-appropriate-descriptions.md` — ADR-011: domain-appropriate descriptions
- `.agent/plans-legacy-2026-09/future/neo4j-knowledge-graph.plan.md` — Neo4j migration sketch; its shape rules are GRAPH-3
