---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract detail to referenced docs; this file is an index/entry point"
---

# AGENT.md

This is the operational entry point for AI agents working with this codebase.
Read all of it first, then follow the links that match the work in front of
you. This file is an index and stance-setter; durable detail lives in the
referenced homes.

## Grounding

Before any setup or command, classify the host with
[cloud-environment-routing.md](./cloud-environment-routing.md); a detected
non-executing host governs every execution-bearing step that follows.

Commit to British spelling, grammar, and date formats. Reflect on your current
task; update your task list if needed. Apply the
[user-collaboration directive](./user-collaboration.md): dialogue, scope
discipline, human risk acceptance, direct verification, and archive
discipline. For agent-to-agent work also apply the
[agent-collaboration directive](./agent-collaboration.md). In a coordinated
multi-agent session the two first-class seats — **Director** and
**Implementer** — are defined by
[PDR-117](../practice-core/decision-records/PDR-117-director-and-implementer-roles.md).
Team shape is owner-set per session; never infer a pairing from archived
collaboration records.

Read [metacognition.md](./metacognition.md) and apply it: its generative mode
is the default for any non-trivial work, and its retrospective mode runs on
every correction signal, wherever in the work it arrives, not only when a plan
is being finalised.

## The Practice

This file is the front door to the **agentic engineering practice**: the
self-reinforcing system of principles, structures, reviewers, and tooling that
governs how work happens in this repository. The lineage was transplanted from
the Oak Open Curriculum Ecosystem on 2026-09-12; the manifest and the owner's
rulings live at
[`docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`](../../docs/explorations/2026-09-12-oce-practice-lineage-transplant.md).

Start with:

- [practice-core/index.md](../practice-core/index.md) — portable Practice
  orientation
- [practice-index.md](../practice-index.md) — local bridge into this repo's
  live surfaces
- [practice.md](../practice-core/practice.md) — full Practice map
- [practice-lineage.md](../practice-core/practice-lineage.md) — cross-repo
  propagation and plasmid exchange

All work MUST start with the `start-right-quick`, `start-right-thorough`, or
`start-right-team` skill. If none has been specified, read
[`start-right-quick/SKILL-CANONICAL.md`](../skills/start-right-quick/SKILL-CANONICAL.md)
immediately after this file and apply it. For the layering contract, authority
order, and routing rule, see [orientation.md](./orientation.md).

ADRs define how the site should work and are the architectural source of
truth: [ADR index](../../docs/architecture/decision-records/README.md). PDRs
govern the Practice itself:
[PDR index](../practice-core/decision-records/README.md).

## First Question

**Could it be simpler without compromising quality?**

## First Principle

**Strict, everywhere, all the time.**

## Second Question

**Would this be simpler if the system changed?**

## Decision Lenses

The First Principle and the two questions above are lenses #2–#4 of the
canonical
[Decision Lenses — Order of Resolution](./principles.md#decision-lenses--order-of-resolution).
Lens #1 — **choose long-term architectural excellence at every decision
point** — governs them all, and lens #5 is **optimise for user value**. Apply
them in that order; the first that decisively resolves the question wins.

## Cardinal Rule

The entity model in `jcdotnet/content/entities.json` is the single source of truth for
identity, shared atoms, and structured data. Every rendered surface — page
metadata, JSON-LD, CV, PDF — DERIVES from it and never restates it. If the
graph changes, `pnpm build` MUST be sufficient to realign every surface
(ADR-020, ADR-021; full statement in
[principles.md §Cardinal Rule](./principles.md#cardinal-rule-of-this-repository)).

## Project Context

**What**: personal website and CV for Jim Cresswell, built on a personal
knowledge graph. **Stack**: Next.js, React, Tailwind CSS, deployed on Vercel.
**Package manager**: pnpm only. **Layout**: a Turborepo monorepo — `jcdotnet`
(the site), `agent-tools` (`@engraph/agent-tools`, the Practice tooling) and
five `@engraph/*` packages under `tooling/`. For setup and topology see the
[root README](../../README.md) and the
[architecture overview](../../docs/architecture/README.md).

## Rules

Read [principles.md](./principles.md); reflect on it, apply it, and follow it
at all times.

The rule tier, core and situational, lives in [`.agent/rules/`](../rules/). Rules
operationalise principles, ADRs, and PDRs; each declares how it loads and what
it is for in its frontmatter, from which [`RULES_INDEX.md`](../../RULES_INDEX.md)
at the repo root and the host's platform adapters (P1) are rendered
(`pnpm portability:fix`), never edited by hand. Claude and Cursor load their
adapter tiers automatically; Codex, Gemini, and any other non-loader platform
MUST read every canonical `.agent/rules/*.md` file listed there at session open.

## Reviewers And Tools

Apply your own critical thinking, then use reviewers when the platform and
owner direction allow it. Reviewer routing, timing, roster, depth, and
reporting requirements live in
[invoke-code-experts.md](../memory/executive/invoke-code-experts.md). The
roster with each expert's purpose is in
[practice-index.md §Experts](../practice-index.md#experts-sub-agents); the
site-specific lanes are the four named architecture experts (Barney — data and
graph; Betty — navigation and layout; Fred — build, caching, PDF; Wilma —
Practice and docs), `pkg-expert`, `editor` and `audience-reader`.

For a fast second opinion on whether the current work is the right work,
invoke [`$jc-cricket`](../skills/cognition/cricket/SKILL-CANONICAL.md).
Cricket is a priority-and-framing conscience check, never a substitute for an
artefact reviewer.

Agent workflow CLIs live in [agent-tools](../../agent-tools/README.md) and run
from the repo root via `pnpm --filter @engraph/agent-tools <script>`.

Agent artefacts follow the three-layer model: canonical content in `.agent/`,
generated thin platform adapters, and platform entry points. See
[artefact-inventory.md](../memory/executive/artefact-inventory.md) and the
[architecture overview](../../docs/architecture/README.md) before
adding rules, skills, sub-agents, adapters, or ADRs; regenerate adapters with
`pnpm portability:fix`.

Use the [commit skill](../skills/change-custody/commit/SKILL-CANONICAL.md) for
commits. **Do not push** unless explicitly asked.

## Memory And Continuity

Institutional memory lives in `.agent/memory/` in three modes
([memory/README.md](../memory/README.md)):

- [`active/distilled.md`](../memory/active/distilled.md) — refined
  cross-session lessons; [`active/napkin.md`](../memory/active/napkin.md) —
  current session observations. Read both every session; write the napkin
  continuously.
- [`operational/repo-continuity.md`](../memory/operational/repo-continuity.md)
  — where we are and what is next;
  [`operational/pending-graduations.md`](../memory/operational/pending-graduations.md)
  — learned doctrine awaiting a home.
- `executive/` — contracts: artefact inventory, expert catalogue, platform
  matrix.

Before inventing a new approach, check the
[pattern instances](../memory/active/patterns/README.md) and PDRs with
`pdr_kind: pattern`. The napkin rotates only after its contents have been
processed into permanent homes; rotation is never a goal.

## Content Work

Before any writing that represents Jim — CV, front page, LinkedIn, positioning
— read [editorial-strategy.md](./editorial-strategy.md) (audience, composition,
attention, readability, surface fit) and
[editorial-guidance.md](./editorial-guidance.md) (identity, voice, register),
then follow the `write-for-the-reader` skill, with `editorial-voice` at the
prose and its readers (`editor`, `prose-expert`, `audience-reader`) before
Jim reads, as `public-copy-runs-the-editorial-workflow` requires. Private
editorial material, if present, is confidential and informs writing only
([privacy.md](./privacy.md) §Private editorial material): never quote it or
reproduce its substance on a public surface; its existence, and a pointer to a
document in it, may be named, as that section says. The LinkedIn profile draft and the other
non-sensitive LinkedIn material listed in privacy.md's
[LinkedIn workspace authorisation][linkedin-authorisation] live in the
[LinkedIn workspace](../../linkedin/README.md); private material stays in its
existing home.

[linkedin-authorisation]: ./privacy.md#linkedin-workspace-authorisation--28-september-2026

## Essential Links

- Core practice: [Principles](./principles.md),
  [Testing Strategy](./testing-strategy.md), [TDD as Design](./tdd-as-design.md),
  [Validation Strategy](./validation-strategy.md) (types and runtime
  validation), [Definition of Delivery](./definition-of-delivery.md),
  [Privacy](./privacy.md), [Security Operations](./secops.md)
- Architecture: [Architecture](../../docs/architecture/README.md),
  [ADR index](../../docs/architecture/decision-records/README.md)
- UI: [Accessibility Practice](../reference/accessibility-practice.md)
- Build and operations: [Build System](../../docs/engineering/build-system.md),
  [Workflow](../../docs/engineering/workflow.md)
- Product: [Editorial Decision Records](../../docs/editorial/decision-records/),
  [User Stories](../../docs/project/user-stories.md),
  [Requirements](../../docs/project/requirements.md),
  [Experience Recording](../experience/README.md)

## Commands

From the repo root, through Turborepo. The hooks are the gate, placed by the
family convention "light commit, full push" (owner, 2026-09-12 and 2026-10-04,
both estates): the commit hook runs the light gate (formatting and lint over
the staged and changed files), the push hook runs the full `pnpm check`
aggregate, and CI composes the same legs with the pull request's checks. An
agent never runs the gates by hand beside the hooks (owner, 2026-09-14: "the
commit triggers the gates, there is no point and a fair amount of cost
running the gates separately as well, never, ever do that"). Running one test
file while a change is red is development, not a gate run. `pnpm check` is
the aggregate the hooks and CI compose, kept for their parity, writing no
tracked file; `pnpm fix` is the mutating pass that precedes it. Before every
commit, check the message in isolation:
`pnpm agent-tools:check-commit-message -m "…"` (the `commit-msg` hook is the
backstop, not the first check). The command source of truth is root
`package.json` and [Build System](../../docs/engineering/build-system.md).

These commands apply only after the environment classification permits local
execution. ChatGPT Work uses its non-execution route instead. Claude cloud uses
its separate [operating document](../claude-harness-integrations/cloud-environment.md).

The browser suites run as pull request checks. When one refuses and the cure
needs a local reproduction, run that one suite in a browser-capable host
environment with the necessary process permissions on the first attempt; do
not run it in the restricted sandbox to rediscover the known Playwright launch
failure.

When collecting evidence, keep independent command outputs attributable. Run
independent checks separately or through the parallel tool wrapper; use shell
chaining only when the dependency between commands is the behaviour being
tested.

The [Build System](../../docs/engineering/build-system.md) enumerates the live
entrypoints; do not duplicate that command inventory here.

## Project Structure

```text
jcdotnet/               # The site (@jimcresswell/www)
  app/                  # Next.js App Router pages, layouts, metadata
  components/           # React components
  content/              # The knowledge graph and authored content (JSON)
  lib/                  # Validation, derivation, contracts, PDF config
  e2e/                  # Playwright: journeys/ and behaviour/
  scripts/              # Build-time scripts (PDF, visual-regression harness)
agent-tools/            # @engraph/agent-tools — validators, collaboration, comms
tooling/                # @engraph/* shared packages
docs/                   # Architecture, ADRs, editorial records, project docs,
                        # governance, engineering, foundation, explorations
.agent/                 # Canonical Practice — see .agent/README.md
.claude/ .cursor/       # Generated platform adapters (pnpm portability:fix)
.codex/ .gemini/ .agents/ .github/
```

Site-only commands run through the workspace filter:
`pnpm --filter @jimcresswell/www dev | build | test:e2e | visual-regression-harness`.
The push hook runs `pnpm check` and then the site's E2E suite; the two never
run in parallel.

## Agent Behaviour

- **Verify claims with evidence** — build logs, rendered output, terminal
  state. Never report success without checking.
- **Plans are born sketch** and govern no work until owner-ratified; they must
  be standalone and discoverable.
- **Archive docs are historical records** — never update them.
- **Listen to owner priorities** — not document structure. Owner instructions
  carry the scope of their moment; do not generalise a local correction into a
  standing rule.

## Remember

1. When in doubt, **make it simpler**
2. Test behaviour, not implementation
3. The graph is the source of truth; surfaces derive
