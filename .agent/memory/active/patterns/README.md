# Repo-Local Pattern Instances

Specific, ecosystem-grounded instances of engineering patterns
proven by real implementation in this repository. Each entry
captures a concrete pattern proven in a specific TypeScript/Zod/
Vitest/MCP context (or other specific ecosystem context present
here).

## Relationship to Practice Core

This directory holds **specific repo-grounded instances** of
engineering patterns and is the **primary pattern home** for the
repo. General, ecosystem-agnostic abstract patterns and
Practice-governance patterns (review, planning, consolidation,
reviewer authority, etc.) live as **PDRs** in
`.agent/practice-core/decision-records/` — patterns may use
`pdr_kind: pattern` frontmatter to mark themselves as the general
form of a recurring engineering or governance problem.

The previous `.agent/practice-core/patterns/` directory was retired
2026-04-29 (PDR-007 amendment): no general patterns had been
authored there, and Practice-governance abstractions matured as
PDRs instead. There is no Core-pattern destination.

## Sibling memory classes

Cross-agent collaboration patterns (multi-agent coordination
substance, distinct from single-agent engineering substance) live
in [`.agent/memory/collaboration/`](../../collaboration/README.md).
Same lifecycle and graduation bar; different substance. Founding
entry: `parallel-track-pre-commit-gate-coupling`.

An instance here may have a `related_pdr: PDR-NNN` or
`related_pattern: <name>` frontmatter pointer linking it to the
general form. The instance stays in place regardless: instance-
level proof continues to live at the repo level after general
abstraction is authored.

## Polarity (required, every pattern)

Every pattern entry MUST be explicit about its polarity. Three
distinct shapes appear in this directory and the difference
matters at the moment of reading — a reader skimming a pattern to
decide whether to apply it or recognise it as a failure mode needs
the polarity at a glance, not after parsing the body:

| Polarity | Meaning | Header marker |
| --- | --- | --- |
| `pattern` | A shape to **repeat**: the body describes a positive solution shape proven to work, with the structural elements a reader should reproduce when applying it | `> **POLARITY: PATTERN.** This is a shape to repeat...` |
| `anti-pattern` | A failure mode to **avoid**: the body names a recurring failure shape (often with a diagnostic for catching it in the moment) and the corrective discipline; recognising the anti-pattern shape is the first move in not repeating it | `> **POLARITY: ANTI-PATTERN.** This is a failure mode to avoid...` |
| *(none — does not belong here)* | A recurring observation that lacks an actionable shape (no clear repeat-shape, no clear failure-mode-and-cure pair) | Belongs in [`distilled.md`](../distilled.md) (cross-session refinement) or [`pending-graduations.md`](../../operational/pending-graduations.md) (queued candidates), NOT in this directory |

Patterns are doctrine ready to apply; observations awaiting shape
are not yet patterns. Categories (`code` / `architecture` /
`process` / `testing` / `agent`) are orthogonal to polarity — every
(category, polarity) pair is admissible.

The polarity is recorded in two places per pattern file:

1. **Frontmatter field** `polarity: pattern | anti-pattern` —
   machine-readable for the index and for tooling.
2. **Blockquote header** in the body, immediately after the
   frontmatter — human-visible at a glance during reading.

Pre-2026-05-05 pattern files predate this discipline and are being
backfilled across the next consolidation passes; new entries from
2026-05-05 onward MUST carry both markers. Until backfill catches
up, use
`eager-rounding-off-on-partial-structures.md`
as the shape-of-the-art template for new pattern files — copying
an existing pre-2026-05-05 file as template would silently produce
a non-conformant entry.

## Categories

Patterns span five categories:
**code** (implementation techniques), **architecture** (system
structure and boundaries), **process** (engineering workflows and
decision-making), **testing** (verification strategies), and
**agent** (agentic infrastructure design). (Categories are
orthogonal to polarity per the Polarity section above.)

Note: Practice-governance patterns that were in this directory
before 2026-04-18 have been **absorbed as PDRs** (PDR-012 through
PDR-023) under the Core contract established by PDR-007. The
instance files remain here with `related_pdr` frontmatter pointing
at the general PDR form.

## Taxonomy

| Category | Scope | Examples |
|---|---|---|
| `code` | Implementation techniques: type-safety, validation, error handling, module structure | Const maps, boundary narrowing, DI patterns |
| `architecture` | System structure, boundaries, cross-cutting concerns | Schema sync, retriever delegation, rate limiting |
| `process` | Engineering workflows, decision-making, documentation practices | Check-driven development, plan promotion |
| `testing` | Verification strategies, test design, mock patterns | Interface segregation for fakes, conformance tests |
| `agent` | Agentic infrastructure: skills, rules, subagents, platform adapters | Surface separation, agent workflow design |

## Barrier to Entry

A pattern is admitted only when **all four criteria** are met:

| Criterion | Meaning |
|---|---|
| **Broadly applicable** | Not domain-specific; applies across codebases |
| **Proven by implementation** | Backed by real shipped code, not theoretical. *Amended 2026-09-02 (routed off PR #915's review at owner word):* for patterns whose subject is a decision or a working practice rather than code, the implementation is an executed decision or sitting with a recorded outcome — the existing precedents (Different-Lens Reviewer Divergence cites a session; Coordinator as Slice Runner cites a single instance, and remains provisional) stand as admitted — and, for admissions from this date on, `proven_in` names the sitting or decision, its date, and who ruled it. |
| **Prevents a recurring mistake** | Addresses a problem likely to recur. "Occurred more than once" is the default heuristic, **not a gate**: per [PDR-100](../../../practice-core/decision-records/PDR-100-decision-debt-as-a-first-class-pillar.md) a single-instance lesson graduates when the lenses (long-term architectural excellence / strict-everywhere / improve-DX) give a clear answer — provenance and adaptation are the safety net, not a second instance. |
| **Stable** | Not expected to change soon |

## Promotion and Retirement

Patterns follow a lifecycle:

1. **Candidate** -- Observed once, captured in the napkin.
2. **Admitted** -- Meets all four barrier criteria; added here with full frontmatter.
3. **Retired** -- Superseded by a library, language feature, or better pattern; moved to an archive section with rationale.

## Frontmatter Schema

Every pattern file has YAML frontmatter:

```yaml
---
name: "Human-readable pattern name"
polarity: pattern | anti-pattern   # REQUIRED for entries authored 2026-05-05 onwards
use_this_when: "One sentence: the situation where this pattern applies (positive shape) OR the situation where this failure mode is at risk of firing (anti-pattern)"
category: code | architecture | process | testing | agent
proven_in: "file path where pattern was first applied or proven"
proven_date: YYYY-MM-DD
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "What mistake this prevents (anti-patterns name the mistake itself; positive patterns name the mistake their absence permits)"
  stable: true
cross_plane: true   # optional; see Cross-Plane Span Tag below
---
```

Concept-node keys are not part of this schema. ADR-221 §6 makes a pattern file its own
concept node; the concept front-matter keys are never minted by hand — they arrive with the
SDK increment that owns the concept-node schema, whose own checks settle whether the index
regeneration tolerates added keys. A pattern's lifecycle stage (PDR-134's candidate and
working classes) is stated in its prose; the promotion trigger is a key for it appearing in
the schema block above, and the 2026-09-02 rotation graduated five pattern files in the
prose form.
The `use_this_when` field is the primary discovery mechanism. It describes the moment an engineer should think "I have seen this before." For anti-patterns, the trigger is the moment the failure mode is about to fire — the diagnostic moment.

### Cross-Plane Span Tag (optional)

`cross_plane: true` is an optional frontmatter field naming patterns whose substance genuinely spans multiple memory planes (`active/`, `operational/`, `executive/`). Added when a pattern's behaviour-change reaches beyond learning-loop (active) into continuity state (operational) or stable catalogues (executive). Defined by [PDR-030 Plane-Tag Vocabulary](../../../practice-core/decision-records/PDR-030-plane-tag-vocabulary.md); routes through the graduation channel defined in [PDR-028 Executive-Memory Feedback Loop](../../../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md). Accumulation of `cross_plane: true` patterns in a rolling window is the Family-B Layer-2 seam-review signal per [PDR-029](../../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md). Omit the field entirely when the pattern is single-plane — do not set `cross_plane: false`.

## How Patterns Differ from Rules

**Rules** (in [`principles.md`](../../../directives/principles.md)) are principles: "never use type-erasing `as`". **Patterns** are "how to implement the principle": replace the `as` cast with a const map lookup. Rules say what; patterns say how.

## Empirical-to-Normative Flow

Patterns are observations from real practice before they are
prescriptions. A pattern records that a behaviour shape or solution
move has appeared often enough, and concretely enough, to name.

Knowledge can then move in either direction:

- doctrine, rules, and principles can shed examples into recipe books;
- recipe books can reveal repeated moves that become patterns;
- mature patterns can feed recipe books, rules, principles, scanners,
  quality gates, ADRs, PDRs, or PDR amendments;
- enforcement failures and owner corrections feed back into capture as
  new evidence.

PDR-014 owns the routing discipline for these moves. The pattern file
is not necessarily the final home; it is often the empirical proof
surface that makes later governance or enforcement honest.

## How Patterns Differ from Source Code

**Source code** is concrete: a specific const map for specific HTTP status codes. **Patterns** are abstract: the principle of using const maps to replace runtime conversions that mirror compile-time type transformations. Patterns describe the shape of the solution, not the domain-specific implementation.

## Index Maintenance

The entire Pattern Index section below — headings, per-category lists,
and counts — is **GENERATED from pattern frontmatter**. Never hand-edit
it: the pre-commit `validate-patterns-index` gate refuses hand-edited
drift. After adding or changing a pattern file, regenerate with
`pnpm --filter @engraph/agent-tools validate-patterns-index:fix`.

## Pattern Index

### Process (1)

- **Inherited Framing Without First-Principles Check** *(anti-pattern)* -- Use this when: About to execute a plan body, rewrite an existing artefact, or translate an "old X to new X" — before writing code, tests, or doctrine, check whether the inherited shape is the right shape for the behaviour being proven. → [inherited-framing-without-first-principles-check.md](inherited-framing-without-first-principles-check.md)

### Agent (4)

- **Eager Rounding-Off on Partial Structures Under Failure Pressure** *(anti-pattern)* -- Use this when: An enforcer fires (gate, hook, scanner, validator, lint, type-check) and the proposed response involves bypass, "doctrinal collision", or any framing that lets work proceed past the signal — check whether the agent has rounded a partial structure into a whole structure and constructed a problem that does not exist. → [eager-rounding-off-on-partial-structures.md](eager-rounding-off-on-partial-structures.md)
- **Parallel `isolation:\"worktree\"` Dispatch Is Unreliable; Prefer Sequential** *(anti-pattern)* -- Use this when: Considering a parallel `Agent` batch with `isolation:\"worktree\"` for non-trivial work that depends on a specific branch HEAD or specific repo state. → [parallel-worktree-dispatch-unreliable.md](parallel-worktree-dispatch-unreliable.md)
- **Passive Guidance Loses to Artefact Gravity** *(anti-pattern)* -- Use this when: Designing a guardrail against an agent failure mode — choose between documented-but-not-enforced guidance (passive) and an environmentally-triggered rule, hook, or read-on-entry surface (active); passive guidance alone is a watchlist item, not a guardrail. → [passive-guidance-loses-to-artefact-gravity.md](passive-guidance-loses-to-artefact-gravity.md)
- **Structural Enforcer Recursive Exclusion** *(anti-pattern)* -- Use this when: Designing a structural enforcer (hook, scanner, lint rule, regex matcher) that scans for a pathogen — vocabulary, file shape, prohibited construct, code smell — across a path scope; the cataloguing documents and tests inside that scope will trip the enforcer on themselves unless explicitly excluded. → [structural-enforcer-recursive-exclusion.md](structural-enforcer-recursive-exclusion.md)
