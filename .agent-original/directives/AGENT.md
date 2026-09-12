---
fitness_line_target: 180
fitness_line_limit: 220
fitness_char_limit: 12500
fitness_line_length: 100
split_strategy: Extract detail to referenced docs; this file is an index/entry point
---

# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first,
then follow all instructions.

## Grounding

Commit to always using British spelling, British English grammar, and British date and time formats.

## First Question

Always apply the first question: **Ask: could it be simpler without compromising quality?**

## Project Context

**What**: Personal website and CV for Jim Cresswell
**Stack**: Next.js 16, React 19, Tailwind CSS 4, deployed on Vercel
**Package Manager**: pnpm (REQUIRED — never npm/yarn)

## The Practice

This repo follows the Agentic Engineering Practice. For the full system — principles, structure,
tooling, and knowledge flow — see [practice-core/index.md](../practice-core/index.md). For navigable
links to this repo's artefacts, validators, and reference surfaces, see
[practice-index.md](../practice-index.md). For explicit supported and unsupported platform mappings,
see [cross-platform-agent-surface-matrix.md](../reference/cross-platform-agent-surface-matrix.md).

## Rules

Read [the principles](./principles.md); reflect on them, _apply_ them — they MUST be followed at ALL times.
Read [metacognition](./metacognition.md) and apply it before planning.

## Essential Links

- [Principles](./principles.md) — Core development principles
- [Testing Strategy](./testing-strategy.md) — TDD approach and test types
- [Metacognition](./metacognition.md) — Pause and reflect before planning
- [Editorial guidance](./editorial-guidance.md) and [strategy](./editorial-strategy.md) —
  Read both before content work: identity and voice; audience, composition and readability.
- [Privacy](./privacy.md) — Psychological safety and PII handling
- [Security Operations](./secops.md) — Git email, PII audits, operational security
- [Cross-Platform Surface Matrix](../reference/cross-platform-agent-surface-matrix.md) — Supported
  and unsupported agent surfaces
- [Architecture](../../docs/architecture/) — System architecture and ADRs
- [Editorial Decision Records](../../docs/editorial/decision-records/) — Specific editorial
  decisions with context and rationale (EDRs)
- [User Stories](../../docs/project/user-stories.md) — Key user stories
- [Requirements](../../docs/project/requirements.md) — Non-functional requirements

## Session Start

Every session, read `.agent/memory/distilled.md` and scan `.agent/memory/napkin.md` before doing
anything. These contain hard-won patterns and recent context. Update the napkin continuously as you
work — log mistakes, corrections, and what works. See the [napkin skill](../skills/napkin/SKILL.md).

Then follow **[start-right-quick](../skills/start-right-quick/SKILL.md)** for normal work or
**[start-right-thorough](../skills/start-right-thorough/SKILL.md)** for structural, risky, or
multi-phase work. The matching command adapters are `/jc-start-right-quick` and
`/jc-start-right-thorough`.

Also read **`.agent/plans/active/README.md`** and the **active plan markdown** in
`.agent/plans/active/` — the current execution focus lives in that folder as the real plan file, not
only in `plans/current/`. When the primary focus changes, move plans, update that README, and
reconcile `roadmap.md` together.

## Agent Tools

### Sub-agents

Canonical reviewer prompts live in `.agent/sub-agents/templates/`. In Codex, the project reviewer
roster is registered in `.codex/config.toml` and each role uses a thin `.codex/agents/*.toml`
adapter that points back to the canonical template.

| Agent                                                                                   | Purpose                                                                      |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [editor](../sub-agents/templates/editor.md)                                             | Editorial reviewer — audience, structure, readability, voice and consistency |
| [code-reviewer](../sub-agents/templates/code-reviewer.md)                               | Gateway reviewer — quality, correctness, and triage                          |
| [test-reviewer](../sub-agents/templates/test-reviewer.md)                               | TDD compliance and test quality                                              |
| [type-reviewer](../sub-agents/templates/type-reviewer.md)                               | TypeScript type safety                                                       |
| [pkg-reviewer](../sub-agents/templates/pkg-reviewer.md)                                 | PKG specialist — Schema.org, JSON-LD, graph                                  |
| [architecture-reviewer-barney](../sub-agents/templates/architecture-reviewer-barney.md) | Data, graph, and PKG architecture                                            |
| [architecture-reviewer-betty](../sub-agents/templates/architecture-reviewer-betty.md)   | Navigation, layout, and experience architecture                              |
| [architecture-reviewer-fred](../sub-agents/templates/architecture-reviewer-fred.md)     | Build, caching, PDF, and runtime resilience                                  |
| [architecture-reviewer-wilma](../sub-agents/templates/architecture-reviewer-wilma.md)   | Practice, plan, and documentation architecture                               |
| [accessibility-reviewer](../sub-agents/templates/accessibility-reviewer.md)             | Accessibility, semantics, and assistive flows                                |
| [design-system-reviewer](../sub-agents/templates/design-system-reviewer.md)             | Design tokens, spacing, and responsive rhythm                                |
| [react-component-reviewer](../sub-agents/templates/react-component-reviewer.md)         | React hooks, hydration, and component boundaries                             |
| [config-reviewer](../sub-agents/templates/config-reviewer.md)                           | Next.js, pnpm, and repo configuration surfaces                               |
| [docs-adr-reviewer](../sub-agents/templates/docs-adr-reviewer.md)                       | ADRs, docs, and governance narratives                                        |
| [security-reviewer](../sub-agents/templates/security-reviewer.md)                       | Headers, secrets, and defensive surfaces                                     |
| [mcp-reviewer](../sub-agents/templates/mcp-reviewer.md)                                 | Cross-platform agent and MCP coherence                                       |
| [subagent-architect](../sub-agents/templates/subagent-architect.md)                     | Reviewer architecture and dispatch sanity                                    |

### Skills

| Skill                                                                 | Purpose                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [start-right-quick](../skills/start-right-quick/SKILL.md)             | Fast session grounding — foundation docs, memory, active plan, inbound Practice |
| [start-right-thorough](../skills/start-right-thorough/SKILL.md)       | Deeper grounding for structural, risky, or multi-phase work                     |
| [patterns](../skills/patterns/SKILL.md)                               | Find portable Practice patterns and local pattern instances                     |
| [accessibility](../skills/accessibility/SKILL.md)                     | Support active accessibility work before review                                 |
| [architecture](../skills/architecture/SKILL.md)                       | Support active architecture work across the reviewer personae                   |
| [config](../skills/config/SKILL.md)                                   | Support active configuration and tooling work                                   |
| [design-system](../skills/design-system/SKILL.md)                     | Support active design-system and visual-language work                           |
| [docs-adr](../skills/docs-adr/SKILL.md)                               | Support active ADR and durable-doc updates                                      |
| [mcp](../skills/mcp/SKILL.md)                                         | Support active multi-platform agent-surface work                                |
| [react-component](../skills/react-component/SKILL.md)                 | Support active App Router and component-boundary work                           |
| [security](../skills/security/SKILL.md)                               | Support active defensive and secrets-sensitive changes                          |
| [subagent-architecture](../skills/subagent-architecture/SKILL.md)     | Support active reviewer-estate design and wiring                                |
| [project-spec-creation](../skills/project-spec-creation/SKILL.md)     | Core workflow — project definition docs for generative UI handoff (v0, Bolt, …) |
| [editorial-voice](../skills/editorial-voice/SKILL.md)                 | Apply Jim's voice within the wider editorial strategy                           |
| [quality-gates](../skills/quality-gates/SKILL.md)                     | Run quality gates with restart-on-fix discipline                                |
| [napkin](../skills/napkin/SKILL.md)                                   | Session learning log — always active, read and update every session             |
| [distillation](../skills/distillation/SKILL.md)                       | Rotate napkin into curated distilled.md when it grows large                     |
| [start-right-team](../skills/start-right-team/SKILL.md)               | Team grounding for multi-seat ARC collaboration in this shared checkout         |
| [metacognition](../skills/metacognition/SKILL.md)                     | Inward mode — reflective depth behind the metacognition directive               |
| [reason](../skills/reason/SKILL.md)                                   | Outward mode — direct-trial gate, stop gate, five structured-reasoning moves    |
| [concept-exploration](../skills/concept-exploration/SKILL.md)         | Explore unshaped concepts through alternating movements before options form     |
| [proportionality](../skills/proportionality/SKILL.md)                 | Pre-decision sizing gate — scope, instrument, level; never an expediency door   |
| [plan](../skills/plan/SKILL.md)                                       | Author plans with the four value questions and authoring disciplines            |
| [session-handoff](../skills/session-handoff/SKILL.md)                 | Continuity surfaces and the deep context-loss scan when work pauses             |
| [consolidate-docs](../skills/consolidate-docs/SKILL.md)               | Consolidate the estate; graduate durable knowledge to permanent homes           |
| [consolidate-until-done](../skills/consolidate-until-done/SKILL.md)   | Persistent curation programme — drain buffers or name the owner decisions       |
| [knowledge-safety-sweep](../skills/knowledge-safety-sweep/SKILL.md)   | Mid-session capture of would-be-lost context without closing the seat           |
| [wrap](../skills/wrap/SKILL.md)                                       | Deep closeout programme — handoff, consolidation, metaloss recursion            |
| [retrospective](../skills/retrospective/SKILL.md)                     | Post-mortem on a completed arc; record lands in `.agent/reports/`               |
| [pr-lifecycle](../skills/pr-lifecycle/SKILL.md)                       | PR from branch to merge — review-round state machine and honest closeout        |
| [semantic-merge](../skills/semantic-merge/SKILL.md)                   | Concept-preserving merge of diverged memory and state files                     |
| [undo-change](../skills/undo-change/SKILL.md)                         | Safety decision tree for undo/revert/reset — halts for owner authorisation      |
| [author-skills](../skills/author-skills/SKILL.md)                     | Create or update repo-local skills and adapters                                 |
| [deslop](../skills/deslop/SKILL.md)                                   | Remove AI-generated code slop from diffs                                        |
| [pkg](../skills/pkg/SKILL.md)                                         | PKG entity model and structured data guide                                      |
| [package-deps-up-to-date](../skills/package-deps-up-to-date/SKILL.md) | Audit and update `package.json` dependencies safely                             |

### Commands

| Command                    | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `/jc-start-right-quick`    | Ground yourself before beginning normal work     |
| `/jc-start-right-thorough` | Ground yourself before structural or risky work  |
| `/jc-gates`                | Run quality gates with restart-on-fix discipline |
| `/jc-commit`               | Create a well-formed commit with safety checks   |
| `/jc-consolidate-docs`     | Ensure plans, prompts, and memory are up to date |
| `/jc-plan`                 | Structured planning workflow                     |
| `/jc-editor`               | Invoke editorial review                          |
| `/jc-go`                   | Resume from the current continuity surfaces      |
| `/jc-metacognition`        | Apply the metacognition directive explicitly     |
| `/jc-review`               | Run the reviewer flow after a non-trivial change |
| `/jc-session-handoff`      | Prepare the repo for the next session            |

## Development Commands

All commands use `pnpm`. Key commands:

- `pnpm dev` — local development server
- `pnpm build` — production build
- `pnpm check` — blocking gates with auto-fix where appropriate
- `pnpm test:e2e` — Playwright E2E suite against a production build
- `pnpm test:e2e:ui` — interactive Playwright UI mode
- `pnpm vital-surfaces:check` — vital Practice surface validation
- `pnpm portability:check` — agent-surface parity validation
- `pnpm subagents:check` — reviewer wrapper and registry validation
- `pnpm practice:fitness:informational` — advisory Practice/doc fitness report
- `pnpm fitness-vocabulary:check` — advisory fitness-frontmatter vocabulary check

Full gate sequence, restart-on-fix discipline, and individual checks are documented in
[principles.md](./principles.md#code-quality). All available scripts are in `package.json`.

## Project Structure

```text
app/                    # Next.js App Router pages and layouts
components/             # React components
content/                # CV content JSON files
lib/                    # Utility functions and types
scripts/                # Build-time scripts (PDF generation)
docs/                   # Project documentation
  architecture/         # System architecture and ADRs
  editorial/            # Editorial decision records (EDRs)
  project/              # User stories and requirements
public/                 # Static assets
e2e/                    # End-to-end tests (Playwright)
  journeys/             # User story journey tests
  behaviour/            # Cross-cutting behavioural tests (a11y, SEO, content)
.agent/                 # Canonical Practice artefacts (platform-agnostic)
  directives/           # Principles, rules, and operational directives
  practice-core/        # Portable practice-core files and practice box
  hooks/                # Hook policy and deliberate hook-surface documentation
  reference/            # Stable local reference docs such as the surface matrix
  commands/             # Canonical commands
  skills/               # Canonical skills
  rules/                # Canonical always-applied rules
  sub-agents/templates/ # Canonical sub-agent templates
  plans/                # Work planning — active/ holds the primary plan file; see active/README.md
  prompts/              # Session-entry prompt estate and archived handoff prompts
  memory/               # Napkin, distilled, and local pattern instances
  experience/           # Experiential records
.agents/                # Codex platform adapters
  skills/               # Thin skill and command wrappers plus adapter-local metadata
.claude/                # Claude platform adapters
  agents/               # Reviewer adapters
  commands/             # Command adapters
  skills/               # Skill adapters
  rules/                # Rule adapters
.codex/                 # Codex project configuration
  config.toml           # Project-local reviewer sub-agent registry
  agents/               # Thin reviewer adapter files
.github/                # GitHub Copilot and GitHub-facing agent surfaces
  agents/               # Reviewer adapters
  workflows/            # CI workflows for check, validators, and E2E
.cursor/                # Cursor platform adapters (thin wrappers)
  agents/               # Sub-agent adapters
  commands/             # Command adapters
  skills/               # Skill adapters
  rules/                # Rule triggers (alwaysApply)
```

## Agent Behaviour

- **Don't push git commits** unless explicitly asked.
- **Verify claims with evidence** — check build logs, rendered output, terminal state. Never assume
  or report success without checking.
- **Plans must be standalone** — a fresh agent with no prior context must be able to pick up and
  execute a plan without ambiguity.
- **Plans must be discoverable** — linked from parent plan, README, and related docs.
- **Archive docs are historical records** — never update them.
- **Listen to user priorities** — not document structure. When the user says focus on X, don't get
  sidetracked by Y.

## Remember

1. When in doubt, **make it simpler**
2. Test behaviour, not implementation
3. TSDoc on all exported functions
