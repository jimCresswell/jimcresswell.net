---
name: PKG skill and reviewer
overview: Create a PKG (personal knowledge graph) skill for guiding entity model work and a specialist PKG reviewer sub-agent for validating Schema.org, JSON-LD, and graph correctness. Register both in the practice index, AGENT.md, and Cursor adapters.
todos:
  - id: create-skill
    content: Create .agent/skills/pkg/SKILL.md -- compact operational guide for PKG work
    status: completed
  - id: create-reviewer
    content: Create .agent/sub-agents/templates/pkg-reviewer.md -- specialist reviewer template
    status: completed
  - id: create-adapter
    content: Create .cursor/agents/pkg-reviewer.md -- Cursor adapter
    status: completed
  - id: update-practice-index
    content: Update practice-index.md -- add skill and reviewer to tables
    status: completed
  - id: update-agent-md
    content: Update AGENT.md -- add skill and reviewer to tables
    status: completed
  - id: update-invoke-rule
    content: Update reviewer invocation rules -- wire the PKG reviewer into the gateway plus specialist trigger split
    status: completed
  - id: review
    content: Run code-reviewer on the new files
    status: completed
isProject: false
---

# PKG Skill and Reviewer Sub-Agent

## Context

The PKG work has accumulated substantial domain knowledge across four research domains, four ADRs, two plan documents, and a research findings reference. This knowledge needs to be operationally accessible to agents during PKG implementation (the skill) and during validation of PKG outputs (the reviewer).

The existing system has a clear pattern: skills guide execution, reviewers validate output. The code-reviewer is the gateway and triages to specialists, while specialist invoke rules route domain-specific changes directly. The PKG reviewer is one of those specialists.

## Scope and boundaries

**The PKG skill** is an active skill (invoked during PKG work, not always-on). It provides a compact operational guide: what to read, what conventions to follow, what pitfalls to avoid. It references the design reference and research findings for full detail -- it does not duplicate them.

**The PKG reviewer** is a specialist sub-agent (read-only, like all reviewers). It validates PKG-specific correctness that the gateway code-reviewer lacks domain knowledge to check: Schema.org type mappings, `@id` resolution, JSON-LD constraints, consumer value tier alignment, Neo4j forward-compatibility.

## Files to create

- [.agent/skills/pkg/SKILL.md](.agent/skills/pkg/SKILL.md) -- canonical skill
- [.agent/sub-agents/templates/pkg-reviewer.md](.agent/sub-agents/templates/pkg-reviewer.md) -- canonical reviewer template
- [.cursor/agents/pkg-reviewer.md](.cursor/agents/pkg-reviewer.md) -- Cursor adapter (thin wrapper)

## Files to update

- [.agent/practice-index.md](.agent/practice-index.md) -- add both to the Skills and Sub-agents tables
- [.agent/directives/AGENT.md](.agent/directives/AGENT.md) -- add both to the Sub-agents and Skills tables (note: already 2 lines over its 150-line ceiling per napkin; adding rows makes this worse -- flag for future tightening)
- [.agent/rules/invoke-code-reviewers.md](.agent/rules/invoke-code-reviewers.md) -- gateway reviewer invocation
- [.agent/rules/invoke-pkg-reviewer.md](.agent/rules/invoke-pkg-reviewer.md) -- specialist trigger for entity model, JSON-LD, and graph changes

## Phase 1 -- Create the PKG skill

**Goal:** Provide a compact operational guide for agents doing PKG work.

**Impact:** An agent starting PKG implementation has immediate access to conventions, pitfalls, and references without reading 500+ lines of plan documents.

### Task 1: Create `.agent/skills/pkg/SKILL.md`

Follow the pattern established by [.agent/skills/editorial-voice/SKILL.md](.agent/skills/editorial-voice/SKILL.md):

- YAML frontmatter: `name: pkg`, `classification: active`, description
- Reading requirements (what to read before PKG work -- tiered by phase, matching the implementation plan's reading requirements)
- Quick reference sections:
  - Schema.org type mappings (compact table from ADR-008 + research corrections)
  - `@id` conventions and canonical document rule
  - JSON-LD constraints (4 rules: single block, 1.0 subset, self-containment, every entity gets `@id`)
  - Consumer value tiers (3-tier table)
  - Neo4j forward-compatibility checklist (6 items)
  - Validation workflow (4-tool table)
- Common pitfalls (the `inSupportOf` class of error, `VolunteerAction` vs `OrganizationRole`, blank nodes)
- Reference links to authoritative sources (design reference, research findings, ADRs)

**Key principle:** Reference, don't duplicate. The skill is a signpost and quick-reference, not a copy of the research findings or design reference. An agent reads the skill first, then reads the full documents it points to.

**Acceptance criteria:**

- Skill file exists with correct YAML frontmatter
- Every section references its authoritative source
- No section exceeds what a quick-reference needs -- if it takes more than a few lines, point to the source document
- Common pitfalls are actionable (show the wrong thing and the right thing)

---

## Phase 2 -- Create the PKG reviewer

**Goal:** Provide a specialist reviewer that validates PKG-specific correctness.

**Impact:** Schema.org type errors, `@id` resolution failures, JSON-LD constraint violations, and Neo4j compatibility issues are caught during review rather than after deployment.

### Task 2: Create `.agent/sub-agents/templates/pkg-reviewer.md`

Follow the pattern established by [.agent/sub-agents/templates/type-reviewer.md](.agent/sub-agents/templates/type-reviewer.md):

- Identity block (name: `pkg-reviewer`, purpose, summary)
- Reading requirements (MANDATORY) -- the reviewer must read:
  - `.agent/skills/pkg/SKILL.md` -- compact operational reference
  - `.agent/plans/research/pkg-research-findings.md` -- full research context
  - `.agent/plans/personal-knowledge-graph.plan.md` -- design reference (entity inventory, conventions)
  - ADR-008, ADR-010 -- settled architectural decisions
- Core philosophy: "The graph models reality. Every entity is real. Every claim in the structured data must be Schema.org-valid and self-consistent."
- Assessment dimensions:
  - **Schema.org correctness** -- types, properties, and expected value types match Schema.org definitions (the `inSupportOf` class of error)
  - `**@id` resolution -- every `@id` reference in a subgraph resolves to a node in the same subgraph; canonical document rule followed
  - **JSON-LD constraints** -- single block per page, 1.0 subset, self-containment, no blank nodes
  - **Consumer value alignment** -- effort proportional to tier (Tier 1 types get most attention)
  - **Neo4j forward-compatibility** -- flat entities, `@id` references, content-derived slugs, Schema.org property names
  - **Entity completeness** -- all entity types from the design reference inventory are present; no orphaned entities
  - **Zod schema coverage** -- every entity type validated at the JSON boundary
- Priority categories: Critical / Important / Suggestions (matching existing reviewers)
- Output format: matching existing reviewers
- Read-only constraint

### Task 3: Create `.cursor/agents/pkg-reviewer.md`

Cursor adapter -- thin wrapper following the pattern in [.cursor/agents/editor.md](.cursor/agents/editor.md):

```yaml
---
name: pkg-reviewer
model: auto
description: PKG specialist reviewer -- validates Schema.org correctness, JSON-LD constraints, @id resolution, consumer value alignment, and Neo4j forward-compatibility. Invoke during PKG implementation or when the code-reviewer triages entity model / structured data changes.
tools: Read, Glob, Grep, LS, Shell, ReadLints
readonly: true
---
Read and follow @.agent/sub-agents/templates/pkg-reviewer.md
```

**Acceptance criteria:**

- Reviewer template file exists with correct structure
- All seven assessment dimensions documented with clear descriptions
- Reading requirements include all four PKG reference documents
- Cursor adapter exists and follows the established pattern

---

## Phase 3 -- Register and wire up

**Goal:** Both the skill and reviewer are discoverable and integrated into the existing system.

**Impact:** Agents find them through normal discovery paths (AGENT.md, practice-index, and the current reviewer invocation rules).

### Task 4: Update practice-index.md

Add to the Skills table:

```
| [pkg](skills/pkg/SKILL.md) | PKG entity model and structured data guide |
```

Add to the Sub-agents table:

```
| [pkg-reviewer](sub-agents/templates/pkg-reviewer.md) | PKG specialist -- Schema.org, JSON-LD, graph correctness |
```

### Task 5: Update AGENT.md

Add to the Sub-agents table:

```
| [pkg-reviewer](../sub-agents/templates/pkg-reviewer.md) | PKG specialist -- Schema.org, JSON-LD, graph correctness |
```

Add to the Skills table:

```
| [pkg](../skills/pkg/SKILL.md) | PKG entity model and structured data guide |
```

Note: AGENT.md is already at 152/150 lines (napkin). These additions push it further over. Flag for future tightening (the split strategy says "extract sub-agent roster, development commands, or project structure").

### Task 6: Update reviewer invocation rules

Keep the gateway reviewer rule broad and ensure the specialist trigger exists for PKG work:

- [.agent/rules/invoke-code-reviewers.md](.agent/rules/invoke-code-reviewers.md) should continue to describe the code-reviewer as the gateway that triages to installed specialists as needed.
- [.agent/rules/invoke-pkg-reviewer.md](.agent/rules/invoke-pkg-reviewer.md) should explicitly route entity model files, JSON-LD generation, `@id` conventions, and structured data output to `pkg-reviewer`.

**Acceptance criteria:**

- Both appear in practice-index.md tables
- Both appear in AGENT.md tables
- PKG reviewer is covered by the current gateway-plus-specialist reviewer invocation rules
- AGENT.md line count increase noted for future tightening

---

## Phase 4 -- Review

### Task 7: Run code-reviewer on the new files

Invoke the code-reviewer on the skill and reviewer template to check for completeness, consistency with existing patterns, and any gaps.

**Acceptance criteria:** Review complete; any issues addressed
