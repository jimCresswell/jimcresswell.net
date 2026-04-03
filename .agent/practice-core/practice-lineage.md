---
provenance: provenance.yml
fitness_line_target: 500
fitness_line_limit: 600
fitness_char_limit: 30000
fitness_line_length: 100
---

# Practice Lineage

This is the canonical lineage document for this repo's Practice. It serves two
purposes: (1) the reference for how the plasmid exchange mechanism works, and
(2) the source template for outbound propagation.

When propagating the Practice to another repo, copy all seven Practice Core
files: the trinity (`practice.md`, this file, and `practice-bootstrap.md`),
the entry points (`README.md` and `index.md`), the changelog (`CHANGELOG.md`),
and the provenance file (`provenance.yml`). If
`.agent/practice-context/outgoing/` exists, relevant files may be copied into
the receiving repo's `.agent/practice-context/incoming/` as optional support
material, but they are not part of the Core. See §Frontmatter and
§Plasmid Exchange below.

## Frontmatter

The trinity files carry YAML frontmatter with `provenance` (pointer to
`provenance.yml`) and four fitness thresholds:
`fitness_line_target` (soft), `fitness_line_limit` (hard),
`fitness_char_limit` (hard), and `fitness_line_length` (hard, always 100).
All measure content only — frontmatter excluded. See §Fitness Functions.

### Provenance (provenance.yml)

Per-file provenance chains live in `provenance.yml`, which travels with the
Core package. Each file has its own chain because the files may have evolved
independently in early history. Each entry records:

| Field     | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| `id`      | UUID v4 identifying this entry.                                                         |
| `repo`    | Repository name.                                                                        |
| `date`    | Date this iteration was created or last evolved.                                        |
| `purpose` | What the Practice is being used for — tells receiving repos what shaped this evolution. |

The chain tracks origin (first entry), evolution (last `repo` differs → new
learnings), and context (`purpose` describes what shaped the evolution).
Array order and `date` carry chronology. Evolving repos append new entries to
`provenance.yml`.

**Critical caveat**: IDs help reference individual entries, but they do not
replace detailed comparison. Different files can describe utterly different
histories, and older incoming repos may still send positional `index` fields
that need one-pass UUID migration. Compare the detailed content, `repo`,
`date`, and `purpose` fields rather than relying on shorthand matching alone.

## The Practice Blueprint

The blueprint below encodes the condensed core of the Practice. It is
sufficient to grow a new Practice in an empty repo, or to transmit structural
advantages to an existing one. Adapt everything to local context; copy nothing
blindly.

### Principles

The First Question: **could it be simpler without compromising quality?**
Apply it every time. The answer is often no, and that is fine.

The universal rules:

- **TDD always.** Write the test first. Red (prove it fails), Green (make it
  pass), Refactor (improve the implementation while behaviour remains proven).
  This is non-negotiable at all levels: unit, integration, end-to-end.
- **Pure functions first.** No side effects, no I/O. Design for testability.
- **Fail fast with helpful errors.** Never silently. Never ignored.
- **Result pattern where it earns its keep.** Handle failure cases explicitly.
  If a repo has a local error-handling doctrine, preserve it rather than
  forcing an alien abstraction.
- **No type shortcuts.** No `as` (except `as const`), no `any`, no `!`, no
  `Record<string, unknown>`. Preserve type information; never widen.
- **Keep it strict.** DRY, KISS, YAGNI, SOLID. Do not invent optionality or
  workaround layers that hide uncertainty rather than resolving it.
- **No dead code.** Unused code, skipped tests, commented-out code: delete it.
  Version with git, not with names.
- **Never disable checks.** No disabling lints, type checks, formatting, tests,
  validators, or git hooks. Fix the root cause.
- **Validate at boundaries.** External data is unknown until parsed and
  validated.
- **Use the correct proof layer.** Tests prove behaviour. Type-checking proves
  type contracts. Lint and static analysis prove repo-wide patterns. Portability
  validators prove agent-surface alignment. Do not steal proof from the layer
  that owns it.

### Metacognition

Before planning work, pause:

> Think hard -- those are your thoughts.
> Reflect deeply on those thoughts -- those are your reflections.
> Consider those reflections -- those are your insights.
>
> How do your insights change how you see what you have done, what you are
> doing, and what you will do? What has changed? Why? Would you do anything
> differently? What is the bridge from outcome to impact to value?

This process is universal. It costs nothing and prevents shallow execution.

### Testing Philosophy

- Test **behaviour**, never implementation.
- Test to **interfaces**, not internals.
- Each test must prove something useful about product code. Tests that test
  mocks, test code, or types are waste — delete them.
- Use the **correct proof layer**. Tests are not a substitute for type
  checks, lint rules, portability validation, or document-fitness checks.
- **Unit test**: a single pure function in isolation. No mocks, no I/O.
  Naming convention varies by ecosystem.
- **Integration test**: units working together as code (not a running system).
  Simple mocks or fakes may be injected as parameters only. No global state
  manipulation.
- **Prohibited**: global state manipulation in tests — environment variable
  mutation, global mock injection, module cache manipulation, or any mechanism
  that creates hidden coupling between tests. Pass configuration as function
  arguments.

### Agent Pattern

The Practice can use specialist sub-agents for review. The minimum viable
roster is **code-reviewer** (gateway — correctness, security, performance,
test coverage; triages to specialists), **test-reviewer** (classification,
mock simplicity, TDD compliance; recommends deletion for tests that test mocks
or types), and **type-reviewer** (type flow tracing, widening detection;
"why solve at runtime what you can embed at compile time?"). Each reads
directives first, applies the First Question, and reports with severity levels
and actionable fixes.

For production, expand as needed: editorial, security, configuration,
architecture, or domain-specific reviewers. Use layered composition at scale;
inline prompts for short-lived projects.

### Workflow Commands

The Practice is driven by named workflows:

- **start-right** — Default session entry point. Read directives and memory,
  ask guiding questions, check the Practice Box, align on the next step.
- **gates** — Run the repo's quality gates in the documented order. All are
  blocking once invoked.
- **review** — Run gates, triage which specialists are needed, invoke them,
  and consolidate findings into a single report.
- **commit** — Conventional commit workflow with quality gates as pre-check.
- **consolidate-docs** — Verify documentation is current, extract any
  remaining plan content to permanent locations, update status markers, check
  the Practice Box, audit cohesion, and consider Practice evolution.
- **plan** — Read directives. Create a plan with explicit outcome, impact,
  value mechanism, acceptance criteria, risk assessment, and non-goals.
- **think** — Structured thinking without acting.
- **step-back** — Reflection on approach and assumptions.
- **go** — Mid-session re-grounding.

### Always-Applied Rules

These are lightweight rules that fire on every agent interaction. The
activation mechanism is platform-specific — see `practice-bootstrap.md` §Rules
for the canonical-first model and platform adapter formats:

- Read AGENT.md at session start
- Read the Practice index at session start
- Read and write to the napkin continuously
- TDD at all levels
- No type shortcuts
- Fail fast with helpful errors
- Never disable checks
- No skipped tests
- Do not suppress warnings with naming conventions — fix the root cause
- All quality gate issues are blocking
- No global state in tests
- Invoke reviewers after non-trivial changes when the reviewer layer exists

### The Knowledge Flow

The knowledge flow is the Practice's central mechanism. See
[practice.md §The Knowledge Flow](practice.md#the-knowledge-flow) for the full
treatment: the cycle diagram, three-audience model, fitness functions at every
stage, and feedback properties.

The condensed cycle: **Capture** (napkin, always on) → **Refine** (distilled,
periodic) → **Graduate** (permanent docs, on consolidation) → **Enforce**
(rules and directives, always on) → **Apply** (work) → repeat. Each stage
serves a broader audience: the napkin serves the current session, distilled
serves future agents, permanent docs serve everyone. Each transition raises
the bar.

The flow has two critical properties:

1. **Self-replicating**: the mechanism travels via plasmid exchange, so a
   receiving repo inherits the learning loop, not just its current outputs.
2. **Self-applicable**: the rules that enforce the Practice are themselves
   subject to the same evolution process. If a rule proves wrong, it can
   change — but only if the change clears the three-part bar.

### Skills and prompts

**Skills** (`.agent/skills/`) hold reusable workflows. The `start-right`
skill is the session entry point: read directives, understand context, ask
guiding questions, and align on the next step. **Prompts**
(`.agent/prompts/`) are track or handover playbooks; they are not the generic
session opener.

## Adaptation Levels

**POC (days to weeks)**: inline agents, simplified gates, no layered
composition, no ADR infrastructure, no full learning loop. Metacognition and
napkin retained. Three reviewers: code, test, type.

**Production (months to years)**: layered agent architecture, fuller
specialist roster, learning loop (`napkin -> distilled -> rules`), ADR
infrastructure, and full quality-gate sequence.

## How the Practice Evolves

Most session learnings go into the napkin. That is the default.

The Practice itself changes only when a learning is **structural**. The bar:

1. **Validated by real work?** Speculation does not clear the bar.
2. **Would its absence cause a recurring mistake?** If it is only "nice to
   know", it stays in the napkin.
3. **Stable?** If you expect it to change again soon, it is not ready. The
   Practice is a ratchet, not a pendulum.

The `jc-consolidate-docs` command includes a step to consider Practice
evolution. That is the natural trigger point.

## Fitness Functions

The three-part bar governs what enters but not cumulative growth. Without
fitness limits, files bloat — compounded by plasmid exchange adding content
across repos.

### Thresholds

Four fitness fields govern each tracked file. All measure content only
(frontmatter excluded). Width applies to prose only; code blocks, tables, and
frontmatter are excluded.

| File                    | Target lines | Limit lines | Char limit | Rationale                                    |
| ----------------------- | ------------ | ----------- | ---------- | -------------------------------------------- |
| `practice.md`           | 340          | 450         | 22000      | System map including knowledge flow          |
| `practice-lineage.md`   | 475          | 600         | 30000      | Complete portable blueprint and exchange doc |
| `practice-bootstrap.md` | 525          | 675         | 32000      | Annotated templates for every artefact type  |

Target exceedance warns; limit exceedance blocks. `fitness_line_length` is
always 100. Only the user should raise hard limits.

### Beyond the Trinity

Fitness functions extend to key documents in the knowledge flow. Agent-facing
documents (directives, memory files) and repo-facing docs that describe live
tooling can carry the same four fitness fields, with optional
`split_strategy` guidance. Only shallow-browsing entry points (for example the
root README) are exempt.

### Tightening Process

When a file exceeds its target or limit: identify grown sections, merge
overlapping principles, remove examples that have served their teaching
purpose, and compress while preserving coverage. Present tightened versions to
the user before committing.

## Plasmid Exchange

The Practice is not hierarchical. Each repo carries its own Practice
instance, adapted to its own context. The Practice travels as the seven-file
Core package: the plasmid trinity (`practice.md`, `practice-lineage.md`,
`practice-bootstrap.md`), entry points (`README.md`, `index.md`), changelog
(`CHANGELOG.md`), and provenance file (`provenance.yml`). Optional support
material may also travel from a sender's `.agent/practice-context/outgoing/`
into a receiver's `.agent/practice-context/incoming/`.

### The Practice Box

Every repo with a Practice has a canonical location for incoming material:
**`.agent/practice-core/incoming/`** (the Practice Box). This directory is
normally empty (with a `.gitkeep`). When Practice Core files arrive from
another repo, they are placed here.

The Practice Box is checked at two points:

1. **Session start** (via `start-right`) — alert the user if files are
   present.
2. **Consolidation** (via the `jc-consolidate-docs` command step 6) — perform
   the full integration flow.

### Integration Flow

When Practice Core files appear in the Practice Box:

1. **Check provenance carefully.** Read `provenance.yml`. If the last entry's
   `repo` for any file differs from the local repo name, that file has been
   evolved elsewhere and may carry new learnings. Do not compare files by
   UUID alone, and do not rely on legacy `index` numbers from older incoming
   repos. Compare detailed content first. If an incoming chain still uses
   `index`, migrate it to UUID `id` fields in one pass before appending local
   history.
2. **Read it.** Read the changelog for a summary of what changed since the
   last provenance entry matching the local repo. Then read the full files —
   and `.agent/practice-context/README.md` plus `incoming/` if they exist —
   to understand what was learned and why.
3. **Compare** with the local Practice. Identify differences across the full
   Practice system: directives, rules, skills, commands, prompts, reviewer
   wiring, and local surface/reference docs. Compare detailed content, not
   provenance numbers.
4. **Apply the same bar.** Does the incoming learning meet the structural
   change criteria for _this_ repo? (Validated by real work? Prevents
   recurring mistakes? Stable?)
5. **Propose changes** to the user. Be specific: which files across the
   Practice and repo-facing tooling docs would change, and why.
6. **On approval, apply.** Update Practice, Lineage, rules, skills, commands,
   prompts, directives, or local tooling docs as warranted.
7. **Record what was taken** in the napkin (for traceability, not
   attribution).
8. **Audit cohesion.** Check that all Practice Core files
   (`practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `README.md`,
   `index.md`, `CHANGELOG.md`, `provenance.yml`) are internally consistent;
   that `.agent/practice-index.md` and `.agent/reference/` still tell the same
   truth; and that broader docs such as README, CONTRIBUTING, hook docs, and
   ADRs remain aligned where they describe the same workflows.
9. **Clear transient exchange material.** Remove the incoming files. If
   `.agent/practice-context/incoming/` exists, clear its received files and
   working notes. Local `outgoing/` may remain. The integration is complete.

If nothing clears the bar, record that in the napkin too — the incoming
material was reviewed and found not applicable to this context. That is a
valid outcome.

## Growing a Practice from This Blueprint

**Effort heuristic**: in the first real migration, roughly a third of Practice
files may be fully portable (zero edits), a third may need selective editing
(universal core with domain-specific sections to remove), and a third may need
complete rewrite or deletion. The mixed tier is the most labour-intensive
because it requires line-by-line judgement about what is universal and what is
local.

### Restructuring an Existing Practice

When the target repo already has a mature practice (platform-locked or
otherwise), survey existing practice topology first: commands, skills, rules,
agents, memory pipeline, prompts, hooks, docs, and local platform config — not
just language and tooling. Determine the hydration path: cold start,
augmentation, or restructuring.

For restructuring: create canonical versions in `.agent/` first, convert
platform files to thin adapters second, update references third. Existing
mechanisms that exceed the blueprint — specialised reviewers, editorial
systems, domain-specific sub-agents — are adaptations, not deviations.
Preserve and integrate them.

1. Create the directory structure: `.agent/directives/`,
   `.agent/practice-core/` (with `incoming/.gitkeep`), `.agent/plans/`,
   `.agent/prompts/`, `.agent/memory/`, `.agent/reference/`,
   `.agent/research/`, `.cursor/rules/`, `.cursor/commands/`, and
   `.cursor/agents/`. If the Practice Core files were received from another
   repo, they should already include `index.md`, `README.md`, `CHANGELOG.md`,
   and `provenance.yml` alongside the trinity.
2. Write `AGENT.md` in `.agent/directives/` as a stable structural index:
   project context, artefacts, rules pointer, sub-agent roster, development
   commands, and repo structure. Link to `.agent/practice-core/index.md` for
   the full Practice. No mutable state.
3. Write `rules.md` encoding the Principles above, adapted to local tooling.
4. Write `testing-strategy.md` encoding the Testing Philosophy above, with
   local test targets.
5. Write `metacognition.md` from the condensed version in
   `practice-bootstrap.md` (it is universal).
6. Follow `practice-bootstrap.md` for the remaining artefacts: sub-agent
   definitions, workflow commands, rules, core skills (`start-right`,
   `project-spec-creation`), supporting skills, prompts, reference docs, and
   validator guidance. For each artefact type, create canonical content in
   `.agent/` first, then add thin platform adapters.
7. **Practice Core files.** If building from scratch: write all seven files in
   `.agent/practice-core/` — the trinity with YAML frontmatter
   (`provenance: provenance.yml` plus four fitness fields), `README.md`,
   `index.md`, `CHANGELOG.md`, and `provenance.yml`. If received from another
   repo: append a new provenance entry for each trinity file in
   `provenance.yml`, then update the changelog with what changed locally.
8. **Create `.agent/practice-index.md`** — the bridge file that carries
   navigable links from Practice Core to the repo's actual directives, ADRs,
   tools, reference docs, and directories. This file is not part of the
   travelling package.
9. **Validate**: every file reference in every directive, agent, command, and
   rule resolves. Every agent's first-action file exists. The repo builds.
   Where available, run `pnpm portability:check` and
   `pnpm practice:fitness:informational`.
10. **Audit cohesion.** Check that all Practice Core files are internally
    consistent, that `.agent/practice-index.md` links resolve, that
    `.agent/reference/` still matches the live surfaces, and that broader docs
    describing tooling remain aligned with the actual hooks, scripts, and
    commands.

## Validation

After growing or propagating the Practice, verify that nothing is **silently
broken**. The most dangerous failure mode is not missing files — it is files
that look correct but whose internal references do not resolve, or docs that
describe a tooling flow the repo no longer runs.

1. **Reference check** — every file path in directives, agents, commands, and
   rules resolves.
2. **Practice-index check** — `.agent/practice-index.md` exists, its links
   resolve, and it points at the real local artefacts.
3. **Surface-contract check** — if the repo spans multiple agent platforms,
   `.agent/reference/cross-platform-agent-surface-matrix.md` exists and tells
   the same story as the wrappers and project config.
4. **Agent check** — each reviewer or agent's first-action file reference
   exists.
5. **Build and gate check** — the repo's documented quality-gate commands
   still pass and match the docs that describe them.
6. **Stable-index check** — `AGENT.md` and `AGENTS.md` contain no mutable
   session state.
7. **Cohesion check** — Practice Core, Practice index, reference docs, and
   repo-facing tooling docs remain aligned. No stale descriptions, no
   contradictions, no outdated gate counts or hook descriptions.

### Validation scripts

Generic shell snippets still help during hydration:

Reference check (rough):

```bash
rg -o '\./[^\s\)]+\.md' .agent/ .cursor/ --no-filename | sort -u | while read ref; do
  path="${ref#./}"
  if [ ! -f "$path" ]; then
    echo "BROKEN: $ref"
  fi
done
```

Self-containment check (verifies Practice Core has no external links except the
permitted bridge to `../practice-index.md`):

````bash
for f in .agent/practice-core/*.md; do
  awk '/^```/{skip=!skip; next} !skip{print}' "$f" \
    | rg -n '\]\(\.\.\/' \
    | rg -v 'practice-index\.md' \
    && echo "VIOLATION: $f has external links outside code fences"
done
````

This repo also carries repo-local implementations:

- `pnpm portability:check` — validates thin-wrapper parity, reviewer adapter
  registration, and the presence of the local surface matrix
- `pnpm practice:fitness` — strict validation for docs using the four-field
  fitness frontmatter
- `pnpm practice:fitness:informational` — advisory report for Practice and
  directive work while limits are still being tuned

## Learned Principles

Principles discovered through Practice propagation and evolution. These have
cleared the bar.

- **Separate universal from domain-specific at the file level.** When rules
  about TDD live in the same file as rules about a specific schema,
  portability requires line-by-line editing.
- **Silent degradation is the worst failure mode.** Agents, directives,
  commands, and tooling docs can all look correct while silently failing
  because references drift or the described scripts no longer match reality.
- **Intentional repetition aids discoverability but hinders portability.** A
  single canonical source referenced from thin wrappers preserves both.
- **Stable indexes, mutable plans.** `AGENT.md` is a structural map. Mutable
  work state belongs in plans.
- **If a behaviour must be automatic, it needs a rule, not just a skill.**
  Skills are discovered; rules are always applied.
- **Plasmids need a provenance chain, not just an origin.** The last `repo`
  tells a receiving repo whether a file has been somewhere new.
- **Chronology and identity are separate concerns.** Provenance entry IDs are
  UUIDs for stable reference; chain order and `date` carry time, and
  integration still compares detailed content.
- **Documentation is concurrent, not retrospective.** ADRs, READMEs, and
  tooling docs should be updated in the same pass as the code or script
  changes they describe.
- **Plans need value traceability, not just activity.** A plan must name the
  outcome it seeks, the impact it should create, and the mechanism by which
  that impact creates value.
- **Understand local norms before hydrating.** The Practice enables
  excellence; it does not replace what has already been achieved.
- **Fitness functions need more than one dimension.** Line counts alone are
  gameable; line, character, and line-width constraints together keep docs
  readable and honest.
- **Supported and unsupported agent surfaces should be explicit.** Missing
  files are not a reliable contract.
- **Practice Core files must be self-contained.** The only permitted external
  navigable link is `../practice-index.md`; everything else outside the Core
  should be referenced as plain text.
