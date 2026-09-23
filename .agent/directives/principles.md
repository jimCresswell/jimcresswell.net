---
fitness_line_target: 450
fitness_line_limit: 525
fitness_char_limit: 26000
fitness_line_length: 100
fitness_rationale: >-
  Limits inherited from the source lineage; measured past them at transplant
  (2026-09-12). Substance is never trimmed to fit; a curation lane graduates
  elaborated guidance to governance docs later.
split_strategy: "This file is the source of truth for all principles. Extract only elaborated guidance to governance docs, never the principles themselves. The principles are operationalised through several mechanisms, including rules, sub-agents, and tooling."
---

# Principles

All of these principles MUST be followed at all times.

## Decision Lenses — Order of Resolution

First determine whether the work has a formed question. When it begins as raw observations, a
recurring phenomenon, or an unshaped ask — or when a premature option list may foreclose the real
question — run Concept Exploration below. Once the question is well formed, apply these lenses
**in order**; the first that decisively resolves the question governs. They are the shared decision
substrate every agent and the Director apply, so decisions stay coherent across the team without
escalation — a question reaches the owner only when critical analysis through all five genuinely
fails to resolve it, or the decision is constitutively the owner's (for example product or feature
scope):

1. **Choose long-term architectural excellence at every decision point** — see
   [§Architectural Excellence Over Expediency](#architectural-excellence-over-expediency).
2. **Strict, everywhere, all the time** — see [§Strict and Complete](#strict-and-complete).
3. **Could it be simpler without compromising functionality or quality?** — the
   [§First Question](#first-question).
4. **Would it be simpler if the system changed?** Ask whether moving the system
   dissolves the problem, rather than solving it inside the current shape. A
   classification instrument is often a symptom of the system it grades: a
   census existed because the tree did not sort, and asking this question of
   each of its findings flipped four of five proposed changes from standing
   activities into constructed properties (2026-08-19).
5. **Optimise for user value.**

A question arriving as an either/or is usually a false frame (owner standing
directive, 2026-06-29). First determine whether the question and its options are
well formed; if not, run Concept Exploration before treating them as the frame.
Once formed, reject the binary out of hand, run the lenses over the real problem,
and find the third option that transcends both — or do both (immediate relief and
the structural cure are a sequence, not a choice). When a lens genuinely excludes
one side, the third option captures the excluded side's _intent_ without building it.

These resolve _questions_. They sit alongside standing concerns that are never
traded away — excellent developer experience, excellent **agent experience** (the
agent-facing substrate is a product whose users are agents; see
[PDR-111](../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)),
and the highest levels of software engineering excellence.

### Concept Exploration — the pre-decision workflow

The lenses resolve formed questions. Invoke the
[`concept-exploration`](../skills/cognition/concept-exploration/SKILL-CANONICAL.md) skill before committing
to an option list, including when an early list exists but may foreclose the real question. It
alternates `metacognition` and `reason`, then feeds its warranted, falsifiable synthesis into the
lenses above.

### Proportionality — the pre-decision sizing gate

The lenses resolve **shape**, never size. The
[`proportionality`](../skills/cognition/proportionality/SKILL-CANONICAL.md) skill is the paired
pre-decision gate — right SIZE of question, right instrument weight, right LEVEL to answer it —
bounding scope, instrument weight and attention cost ONLY, never correctness, strictness or
architectural quality. A gate, not a sixth lens; the skill carries why, and the domain
instruments it cites are the operational detail.

## First Question

Always apply the first question; **Ask: could it be simpler _without
compromising quality or value_?**. The answer will often be no, that is fine,
but bring real critical thinking to the question each time.

- **Trace work to value** — Every non-trivial piece of work must be traceable to a defined
  outcome, the impact that outcome is meant to create, and the mechanism by which that impact
  creates value. If you cannot state all three clearly, stop and reframe before planning or
  implementation.

### Ends Before Means, Front of Chain First

The what, the why, and the why-now are established in CONVERSATION with the
owner before building ANY structure. Probing artefacts, code, or deployments
to derive the purpose is still means-side work — the front of the chain is
the owner's stated end, and every elaboration boundary re-asks whether the
work is still denominated in that end rather than in the means built so far
(owner teaching 2026-07-2x, graduated 2026-08-14; the companion rule is
[`re-apply-first-question-at-elaboration-boundaries`](../rules/re-apply-first-question-at-elaboration-boundaries.md)).

## Strict and Complete

**Strict and complete, everywhere, all the time.** Prefer explicit, strict,
total, fully checked systems over permissive, partial, or hand-wavy
ones. Do not invent optionality, fallback options, or implied
enforcement. Do not preserve proven-wrong ideas behind compatibility
layers, adapters, soft migrations, "just in case" branches, or fallback
menus. A disproven design is removed or replaced with the correct design;
it is never kept alive as an option. Type precision is one of the clearest
concrete expressions of this tenet.

**Enforcement mechanisms ship without bypass surfaces.** When designing a
gate, guard, hook, or policy check, do not add a hotfix valve, an
override env-var, an exemption menu, or refusal text that names an
escape route. Owner ruling (2026-07-17, verbatim): _"there are no escape
hatches, examine the source of the question, we are never in such a rush
that doing things badly is a good idea."_ Two layers: (1) urgency never
licenses degraded practice — the refusal message teaches the correct
path (e.g. mint the ticket), never an override; (2) the impulse to
design a valve is itself the signal to examine, because it imports a
rush-assumption this estate rejects. The same absoluteness governs
risk-of-loss operations (`never-use-git-to-remove-work` §A Safety Proof
Never Licenses the Class): a discipline's value is that it holds
precisely when a locally-sound argument says it could bend.

## Architectural Excellence Over Expediency

We **always, ALWAYS** choose long-term architectural excellence
over cheap, fast, or "good enough". This is absolute. The
cheap-fast option is not a respectable third choice next to "do
it right" — it is categorically excluded from consideration.
Decide between architectural-excellence shapes only.

This applies to design AND to how options are presented. When
surfacing options to the owner or a peer agent, do not include a
"cheap cure" / "quick fix" / "land it then iterate" option as
if it were a legitimate trade-off; presenting it as one is
itself the failure mode.

The same failure mode has a quieter tell: a deferential opt-out
clause appended to an answer the principle has already forced,
reopening the forced answer as if it were a trade-off. When
excellence has forced the answer there is nothing to surface,
only something to settle — state the move and the reasoning, and
settle it.

The doctrine is operationalised through composing structural
defences:

- **The three structural cues at output time** — vocabulary
  trip-list, conditional-discipline check before proposing
  structure, and first-principles framing question. The portable form
  is PDR-043; the lineage's host adoption record is not transplanted. The hedging-vocabulary trip-list itself lives in the
  innate-immunity hook (`.agent/hooks/policy.json`); cataloguing
  it in this file would duplicate it. Cue 2 is intent-based: a
  proposed structure that means "the rule does not apply here"
  triggers the check even when it avoids the trip-list vocabulary.
- **Doctrine-authoring discipline** — at the moment a rule,
  principle, ADR, PDR, or governance document is authored or
  amended, the three tests of PDR-047 (substance / vocabulary /
  re-frame) catch self-violating clauses upstream of the
  enforcement scanner.
- **Memetic immune system** — the innate-immunity layer at
  write-time and the adaptive-immunity layer at consolidation-time
  enforce the principle structurally. See PDR-044.
- **Quality-gate fences** — `never-disable-checks`,
  `no-warning-toleration`, `replace-don't-bridge`,
  `dont-break-build-without-fix-plan`, `read-before-asking`, and
  adjacent rules each exist to defeat one expression of the
  rush impulse. The principle is their common generator.
- **Invented-urgency guard** — [`no-speed-pressure`](../rules/no-speed-pressure.md)
  names the failure mode where the agent supplies its own urgency
  to justify skipping the doctrine substrate; the urge is the
  diagnostic, not friction to refactor around.

The failure-mode shape: cheap fixes silently kill the diagnostic;
local optimisation under rush is global pessimisation; fences
accumulate while the generator stays unchanged. Worked failure-mode
example (shortcut-via-duplication): a shortcut that creates
duplication across architectural layers is not a shortcut — it is a
debt that compounds silently. Copying a function "because it's
faster" creates two implementations that drift apart, and the cost of
the drift is invisible until it manifests as a real bug (a stale
derived surface, inconsistent behaviour, stale configuration). The
correct response is always to fix the boundary, not to duplicate
across it.

[ts-practice]: validation-strategy.md

## Owner Direction Beats Plan

Owner direction during a session beats the active plan. On conflict:
follow the direction, surface the conflict, update the plan at the
next safe checkpoint. Never silently ignore or abandon. Precedence
rule, not a licence to abandon planning discipline (PDR-018).

## Core Rules

### Cardinal Rule of This Repository

The entity model in `jcdotnet/content/entities.json` is the single source of truth for
identity, shared atoms, and structured data (ADR-020, ADR-021). Page metadata,
JSON-LD, the CV, the PDF, and every rendered surface DERIVE from it; nothing
restates it. If the graph changes, then `pnpm build` MUST be sufficient to
bring every surface into alignment — no hand-edited duplicates, no ad-hoc
types. If a surface cannot be derived, the model is missing a field: fix the
model, not the consumer. Validation of that model at the boundary is strict
(`jcdotnet/lib/entities.ts`); a page never invents identity the graph does not carry.

The same rule governs every generated artefact: runtime behaviour flows from
the generated output of the one authority, and authored files are thin
façades over it — they never duplicate its logic, infer its types or widen
its unions. When analysing a generated file, analyse the generator that
produced it; the generator is the source of truth, and a change belongs in
the model or the generator, never in the emitted artefact. Static data that
must conform to the model is projected through its type boundary with
`satisfies`, so the projection cannot drift from the source it claims.

### Separate Framework from Consumer

Whenever we build something, clearly separate (a) a
purpose-specific, consumer-general framework from (b) the
product-specific consumer instance (here: this site, its content and
its identity). The framework is the reusable mechanism that solves a
category of problem — usable by any consumer. The consumer instance
applies that framework to this product's domain and data. Distinct
architectural layers MUST live in distinct workspaces (the `@engraph/*`
packages under `tooling/` and `agent-tools/` are the framework side;
`jcdotnet/` is the consumer). Modules/directories may organise code
inside a layer, but they do not satisfy layer separation. If general
mechanism and product-specific configuration share a workspace, split
the workspace. The framework defines the contract; the consumer
provides the specifics. The test: "Could another consumer use this
component unchanged?" If not, extract the product-specific parts.

The licence map is this same split made legible (owner doctrine
2026-08-02): keeping the product-specific instance thin — ideally
configuration passed to a general framework — is what keeps the
externally-constrained surface absolutely minimal, because the
permissively-licensed framework is the surface others may take and
the reserved remainder (the personal identity and content) stays small
only while the architecture keeps it extractable. A component whose
licence cannot be named in one word is one where general mechanism and
product identity cohabit.

A mechanism built to prove a capability is a consumer of the
framework, never the framework: check its warrant when it outlives its
demonstration. An identity built as an override sheet to prove live
switching quietly became the architecture until the owner read the
substitution off the page's own badges (2026-08-18); the day's defect
ledger argued for self-containment, and the demonstration instrument
was retired with its demo.

### Context Specificity Gradient

Every capability decomposes by context specificity. Push functionality
to the lowest general layer that preserves architectural excellence;
keep the highest-specificity layer as thin as possible, preferably
configuration only.

The WHY of the gradient: the deeper the layer, the more general it must
be, because everything above stands on it — and the investment bar rises
with depth for the same reason (a deep layer is expensive to change and
its defects propagate everywhere). Generality is demonstrated, never
asserted: a counter-instance (one consumer the "general" layer cannot
serve unchanged) is a falsifier against generality-by-assertion, not an
exception to accommodate.

The gradient runs below the repo boundary (owner-directed 2026-08-19):
the lowest general layer may be the ecosystem itself. Where a finished
canonical form already exists — an industry contract, a mature library —
adopt it behind a thin conformance check rather than re-derive it
in-estate; own only concepts with no external canonical form, or small
enough that a finished owned module costs less than curating a
dependency. Both directions stay falsifiable by measured cost. Which
canonical form is adopted is a different question from where an owned
implementation originates, and for algorithm and data-structure
foundations the owner decided the second for the whole class
(owner-directed 2026-09-08, recorded in the lineage's own-built-foundations
decision; scope confirmed 2026-09-09 as that class, not the estate): "select the
best, permissively licenced libraries, and use their code as inspiration
to create Reliable Atoms and composition layers tailored to our needs and
created to our deliberately very high quality standards" — the estate
authors them. That decision bounds the class
(language/runtime, protocol, storage, transport and platform capabilities
and standards conformance stay under the sentence above), owns the
provenance discipline that keeps learning distinct from adapting, and
keeps the class's whole-life effort saving an empirical hypothesis
measured through delivered capabilities and their later changes; what
that measurement reopens is the owner's decision, never a seat's.
A thin highest-specificity layer is also a detachable one (owner-directed
2026-08-19): a product surface built as configuration, styling, and
experience tuning on general machinery can be handed off to a product
squad — extracted to its own home — without dragging the lever machinery
its tuning turns.

Agent-work capabilities (collaboration, coordination, work management,
direction, lifecycle, identity, claims, handoff, review routing, and adjacent
concerns) are Practice-owned by default; host-local tooling implements them.
For product/tooling code, the scale is: ecosystem-canonical form -> many-repo
capability -> repo-generic layer -> purpose-specific reusable tool -> thin
product-wide wrapper -> narrow domain wrapper.

Product-specific state is a pressure signal. Keep it minimal; generated
state beats authored state. Hand-rolled types beside generated outputs mean
the generator or a lower layer may need to own more of the behaviour.

### Decompose at the Tension

When code resists clean classification or forces compromise
labels ("lifecycle-neutral", "shared", "cross-cutting"), that
resistance reveals hidden coupling. The response is to decompose
at the fault line — separate the concerns being conflated — not
to classify around the compromise. A barrel re-export that exists
to make something "work" is a symptom; the cure is to eliminate
the coupling that made the barrel necessary. Each tension resolved
this way produces cleaner boundaries and simpler classification.

### Code Design and Architectural Principles

- **TDD** - ALWAYS use TDD at ALL levels — unit, integration, AND
  E2E. Test and product code are two halves of one act of design;
  they land together as one atomic commit. See
  [tdd-as-design.md](tdd-as-design.md) for the foundational
  definition and atomic-landing invariant.
- **Keep it simple** - DRY, KISS, YAGNI, SOLID principles
- **NEVER create compatibility layers, no backwards
  compatibility** - replace old approaches with new approaches,
  never create compatibility layers, never prioritise backwards
  compatibility. When renaming, rename EVERYWHERE — interfaces,
  private functions, variable names, log keys, TSDoc. One concept
  = one name.
- **Keep it strict** - don't invent optionality, don't add fallback
  options. We know exactly what is needed, and the proper
  functioning of the system depends on acknowledging and embracing
  those restrictions, and the valuing insights offered by the type
  system.
- **No escape hatches** - no fallbacks, no compatibility layers, no
  preserving proven wrong ideas, no "just in case" branches, and no
  hedged plan options. When evidence disproves a shape, delete or replace
  it at the owning architectural level. Do not keep it reachable as a
  runtime option, migration bridge, alternate path, or executor choice.
- **No legacy surfaces** - do not preserve legacy directories, legacy
  data shapes, legacy commands, fallback readers, compatibility writers,
  or optional old paths. Repair historical data in place or replace the
  owning surface completely. A validator, reader, writer, or operator
  command MUST target the canonical surface and fail loudly when that
  surface is absent or invalid; it must not quietly scan an old location,
  skip a missing canonical directory, or keep a migration path alive.
- **No timing dependence** - nothing we build relies on timing, ordering
  luck, or a race being unlikely (owner principle, 2026-08-17, verbatim:
  "nothing we do should ever, ever rely on timing or races, we build
  things so they WORK" — "an important principle of fleet mechanics, and
  also in general"). Eliminate the shared mutable resource instead of
  shrinking its window; make the correct order structural (a render-time
  latch, a declarative guard, a per-seat directory) instead of scheduled;
  in review, a correctness argument that contains "the window is small",
  "usually", or an ordering assumption names a defect. The worked shapes
  are recorded in the lineage as the anti-pattern
  `timing-derived-state-is-the-defect` and its read-side dual, the
  pattern `timing-artefact-read-as-state`.
- **At most one holder, and for continuously owned authority exactly
  one** - a singleton-authority state never has two holders. A
  continuously owned authority (a coordinator role, a document root's
  theme, a shared index between windows' owner) has exactly one holder at
  all times, never zero; a windowed authority (a commit window on
  `git:index/head`) has one holder while it is open and none between
  windows, by design. Ownership is decided by context up front, never
  negotiated at runtime between two well-meaning holders — two theme holds
  on one root corrected each other forever until context (standalone: the
  page; framed: the parent) chose the owner (2026-08-19); the coordinator
  two-moments invariant of PDR-064 is the same rule for roles.
- **Pure functions first** - Use TDD to design (_test first_, red,
  green, refactor), no side effects, no I/O
- **Consistent Naming** - Use consistent naming conventions for
  files, modules, functions, data structures, classes, constants,
  type information and CONCEPTS. For instance, if we use `keyStage`
  then that is the label, not `keyStageSlug` or `keyStageId`. If
  you need to add nuance, use TSDoc to provide context, links, and
  examples.
- **Semantic naming over mechanism naming** — Name modules and
  functions by WHY they exist, not HOW they work.
  `preserveSchemaExamplesInToolsList` over
  `overrideToolsListHandler`. The name should explain the removal
  condition.
- **Build up through scales** - Functions → Modules → Packages
  (the workspaces in §Architectural Model)
- **Clear boundaries at each scale** - Define boundaries between
  and within scales CLEARLY with index.ts files
- **Fail FAST** - Fail fast with helpful error messages, never
  silently. NEVER IGNORE ERRORS. Detect problems early (validate
  at entry points, not deep in the call stack), fail immediately
  (don't continue with invalid state), be specific (error messages
  must explain what went wrong and why), and guide resolution
  (where possible, indicate how to fix the problem).
  Anti-patterns: swallowing exceptions with empty catch blocks,
  logging errors but continuing execution, returning `null` or
  `undefined` to indicate failure, generic error messages
  ("An error occurred").
- **Handle All Cases Explicitly** - Don't throw, use the result
  pattern `Result<T, E>`, handle all cases explicitly.
- **Preserve the error cause chain** - Always preserve the error
  cause chain, don't lose information, don't lose context, don't
  lose the ability to debug the problem.
- **No empty catch blocks** - Never use empty catch blocks, always
  handle errors explicitly and using the `Result<T, E>` pattern.
- **Never `void` a promise** - `void promise` swallows its rejection.
  A cleanup promise in an event handler carries an explicit `.catch`
  that routes to the error path.
- **Distinct HTTP semantics** - Never collapse distinct HTTP status
  codes into a single error kind (404 and 451 mean different things).
  Per-surface error types are cleaner than one unified error type —
  each surface has its own failure modes.
- **Libraries do not own logging** - A shared package (`tooling/*`)
  returns classified results; the consuming app is responsible for
  observability. Libraries never instantiate loggers or log
  internally — pass results up, and the app inspects and logs through
  its own logger.
- **Survey the workspaces before proposing new infrastructure** -
  Before proposing a new schema, validation pipeline, parsing helper,
  env-loading mechanism, or path primitive, survey `tooling/*`,
  `agent-tools/src` and `jcdotnet/lib`: read each README whose name
  plausibly matches the capability and grep for existing usage sites.
  The right proposal is usually an extension of an existing package
  (`@engraph/result`, `@engraph/safe-path`, `@engraph/type-helpers`,
  `@engraph/workspace-config`), not a parallel implementation.
- **Document Everywhere** - ALL code, all decisions, all use
  cases MUST be documented: TSDoc on every file/module/function/
  data structure/class/constant/type; ADRs for major engineering
  or architectural decisions; markdown for use cases, public
  APIs, CLIs, troubleshooting. Observe progressive disclosure;
  do NOT create summary documents of each piece of work. TSDoc
  syntax detail lives in the
  [tsdoc skill](../skills/tsdoc/SKILL-CANONICAL.md); the
  documentation-structure discipline is §Documentation Is
  Infrastructure below.
- **Onboarding** - Clear onboarding path from root README to
  workspace docs to TSDoc and ADRs, observing progressive
  disclosure throughout.
- **No machine-local paths** — Every path in a version-controlled
  file MUST resolve to the same meaningful target on every machine
  and in CI. The test is the destination, not the syntax: a
  relative-shaped `..` chain into a per-user surface is still
  machine-local; an absolute-shaped path rooted at a
  platform-provided variable is still portable. Whole-repo,
  retroactive, no exceptions (owner ruling 2026-06-12). See
  [privacy.md §Machine-local paths](./privacy.md#machine-local-paths)
  for the forbidden / permitted shapes, worked examples, and
  detection.
- **No symlinks** — Symlinks are forbidden. Structure workspaces
  properly and use the pnpm workspace dependency graph. Any
  discovered symlinks must be removed immediately as highest
  priority. Platform adapters (`.claude/`, `.cursor/`, `.agents/`)
  must be real files — thin pointers to canonical content — not
  symlinks. pnpm's own `node_modules` symlinks are managed by
  pnpm and are not in scope.
- **No shims, no hacks, no workarounds** — Do it properly or do
  something else. Never introduce shims, polyfills, compatibility
  wrappers, renamed globals, or any mechanism whose purpose is to
  make old code work with new contracts. Replace the old code. If
  the replacement is not ready, leave the old code disabled — do
  not bridge it.
- **Never use git to remove work** — We move forward via filesystem
  changes (Edit, Write, `rm`); git is for committed history only.
  Working-tree-overwrite commands silently wipe in-flight edits;
  reach for Edit, Write, or `rm` instead. See
  [`.agent/rules/never-use-git-to-remove-work.md`](../rules/never-use-git-to-remove-work.md)
  for the full rule and the `PreToolUse` hook enforcement.

### Refactoring

- **TDD** — see §Code Design above
- **NEVER create compatibility layers** - replace old approaches
  with new approaches
- **Don't extract single-consumer abstractions** — If a protocol
  has exactly one consumer, inline it. The test: "does anything
  else consume this?" If no, the extraction adds indirection and
  maintenance surface without value.
- **Splitting long files** - If a file exceeds 250 lines
  (`max-lines`), split it into smaller files defined by groupings
  of responsibility, keeping boundaries and public API clear with
  index.ts files, using TDD. Run lint after every substantive edit
  to catch violations early.
- **Never trim documentation to fit a limit** — size and complexity
  limits exist for developer experience, and documentation IS
  developer experience; a file over its limit is a signal of an
  unsplit seam, never of excess explanation. Split at a meaningful
  responsibility seam with each half fully documented; never
  condense TSDoc, comments or docs to satisfy the number (owner,
  2026-08-03: "we never trim to hit complexity limits … the
  approved approach is to split files by identifying fundamentally
  meaningful seams"; 2026-09-01: "we do not trim information to
  meet targets, we maximise developer experience").
- **Splitting long functions** - If a function exceeds 50 lines
  (`max-lines-per-function`), split it into smaller, pure functions
  with a single responsibility, using TDD. Extract conditional
  phase dispatch, multi-branch logic, and accumulator loops into
  named helpers.
- **Reducing complexity in functions** - If a function is too
  complex, identify distinct responsibilities and split it into
  smaller, pure functions with a single responsibility, using TDD.
  ESLint counts `??` and `?.` as branches — five
  nullish-coalescing expressions in one function can breach the
  complexity limit.
- **Removing unused code** - If a function is not used, delete it.
  If product code is only used in tests, delete it. If a file is
  not used, delete it. Delete dead code.
- **Moving files between workspaces** - Check whether removed tests
  should be recreated in the destination, and verify ESLint
  overrides, README relative links, and `tsconfig` include patterns
  transfer correctly. When moving any artefact, grep for the old
  path in `*.ts`, `*.mjs` and `*.json` as well as `*.md` — test
  fixtures and CLI defaults hardcode paths.
- **Version with git, not with names** - Fix files in place, or
  replace old approaches with new approaches, NEVER create parallel
  versions using naming. Incorrect: `execute-tool-call.ts` and
  `execute-tool-call.v2.ts`. Correct: `execute-tool-call.ts` with
  a git history showing the evolution. Incorrect:
  `execute-tool-call.ts` and `execute-tool-call-correct.ts`.
  Correct: `execute-tool-call.ts` with a git history showing the
  evolution.

### Tooling

Use the right tool for the job:

- **Turborepo** for monorepo operations
- **pnpm** for monorepo definitions and package management
- **Vitest** for testing **runtime logic**; **React Testing Library** for
  component integration tests
- **Playwright** for testing **runtime UI** and HTTP behaviour (E2E-UI and
  E2E-API against a production build — ADR-019)
- **Next.js** on **Vercel** for the site; **Tailwind CSS** for styling
- **TypeScript** for compiler time types
- **ESLint** for syntax correctness and code-style adherence
- **Prettier** for code-style adherence
- **knip** and **gitleaks** for unused code and secrets, repo-wide (the root
  `pnpm knip` and `pnpm secrets:scan`)
- **The visual regression harness** for rendering proof (ADR-022)

Practice tooling workspaces (`agent-tools`, `tooling/*`) MUST follow the
canonical patterns exported by `@engraph/workspace-config`, consumed as a
declared `workspace:*` dependency. The site workspace (`jcdotnet`) keeps its
own Next.js, Vitest and Playwright configuration and is the one app-shaped
exception — never by a relative path that
leaves the workspace (static imports and undeclared dependencies are
enforced by the dependency-cruiser boundary rules;
`validate-workspace-config-isolation` owns the resolver-invisible
legs). Workspace configs extend the
shared bases — they do not replace them. This applies to
`vitest.config.ts`, `tsup.config.ts`, and all other tooling;
`tsconfig.json` `extends` chains are the one root-anchored
convention that remains (an `extends` reference is not a module
import). Deviations cause silent quality-gate leaks (e.g. E2E
tests running under `pnpm test`, disabled lint rules, weakened
type-checking). See [Testing Strategy: Canonical Vitest
Configuration][vitest-config] for vitest-specific patterns. E2E
vitest configs may be workspace-specific when base defaults (include
paths, setup files) don't apply.

[vitest-config]: testing-strategy.md#canonical-vitest-configuration

### Code Quality

- **TDD** — see §Code Design above
- **NEVER disable checks** - Quality gates are NEVER disabled.
  Type checks, linting, formatting, tests, Git hooks (`--no-verify`),
  CI steps — none of them. The **`gate-off-fix-gate-on`** sequence
  (disable, fix, re-enable) is a named anti-pattern; the gate stays
  on throughout. See [`never-disable-checks.md`](../rules/never-disable-checks.md)
  for the operational discipline.
- **No warning toleration, anywhere** - Warnings are not deferrable
  in any system the repo influences (build, quality gates, runtime,
  monitoring). A warning is the cheap, early version of the failure
  it names. Fix the root cause in the same work-item, or escalate
  the warning to a hard error in the same commit. Acknowledged-and-
  deferred warnings consistently explode at the next stage. See
  `.agent/rules/no-warning-toleration.md` for the operational
  discipline (covers esbuild/tsc/ESLint/vitest/depcruise/knip and
  Vercel build output, runtime logs and monitoring surfaces).
- **Fix things** - All quality gates are blocking at all times,
  regardless of location, cause, or context.
- **An enforcement-scope gap is not a requirement gap** - Repo-wide
  standards (Result over throw, strict types, the rule corpus) govern
  every workspace regardless of where a lint rule happens to be
  wired; "not enforced here" never implies "not required here". A
  missing or narrowly-scoped binding is itself a defect — flag it,
  prefer the structural cure (extend the enforcement), and never read
  an inherited non-conforming local convention as ratified exemption.
- **Progressive re-enablement** - When a pre-existing lint override
  exists in a file you touch, fix the root cause; narrow
  directory-wide overrides to file-specific first.
- **Analysability is part of correctness** - For findings from static
  instruments (CodeQL, lint), "false positive" is usually the wrong
  frame: an alert on code whose safety the instrument cannot see is a
  true positive about analysability, and only source-shape cures are
  durable. Dismissal is doubly non-durable — the safety stays
  invisible to every future scan, and positional alert identity makes
  suppression a recurring tax. Worked instance (2026-07-29): five
  alerts headed for dismissal were fixed at source instead, and a
  differential test then proved one "false positive" regex was a real
  super-linear backtracking vector the dismissal path would have
  preserved. Fix-first is the only disposition (owner ruling
  2026-09-08: "We don't dismiss issues, we fix them").
- **Session-local tool reports are evidence only inside the session
  that produced them** - Do not make a shell invocation of an
  interactive-session command (such as Claude Code `/doctor`) a
  validation gate for plans or commits. Validate durable changes
  through repo-local gates, settings diffs, generated artefacts, and
  owner-supplied session evidence when the session surface itself is
  the subject.
- **Code that generates code is product code** - A generator's output
  is product code, so the generator is product code: full logger
  discipline, lint, and type strictness apply. Adapter generation
  (`pnpm portability:fix`) and every other generator are never
  "build scripts" exempt from the gates.
- **Every issue earns a check** - An issue, however discovered —
  exploration, exercise, review, external comment — is not resolved
  until a check of the appropriate kind exists that would catch the
  instance AND its class. The kind fits the class: behaviour → a
  unit/integration/E2E test; types → the type-check gate or a
  `satisfies` anchor; structural → an ESLint/boundary rule;
  process/CI coverage → a required status check or validator;
  content-quality invariant → construction plus human review, never
  a false-positive-prone grep test. A bare fix without the guarding
  check is an incomplete disposition. Operationalised in
  [testing-strategy.md §When a Defect Is Found](testing-strategy.md)
  and [`pr-comments-resolve-and-recheck.md`](../rules/pr-comments-resolve-and-recheck.md).
- **Local broken code never leaves** — Broken code is never
  acceptable. The local-only constraint is not an excuse to tolerate
  brokenness; it is the discipline that prevents brokenness from
  reaching other agents, reviewers, CI, and production before you
  finish fixing it. Two halves, both held: (1) broken code must be
  fixed, not tolerated — "it's just broken locally" is not a stable
  resting position, it is an in-progress fix that has not yet landed;
  (2) local broken code never leaves the local environment — no
  `git push` until the change is proven to work, built, gated, and
  observed running in the form it is supposed to run (test passing,
  dev server returning the expected response, CLI exiting clean, UI
  rendering the expected state). "It compiles" is not "it works";
  the proof is observed behaviour, not the absence of red. Pushing
  broken code burns peer-agent and reviewer cycles on diagnosis the
  author could have closed with one more local check, and pollutes
  the shared branch with state nobody can trust. See
  [`local-broken-code-never-leaves.md`](../rules/local-broken-code-never-leaves.md)
  for the operational discipline.
- **Never weaken a gate to solve a testing problem** - If a test
  needs content that a gate forbids (e.g. an `eslint-disable`
  comment to test the `no-eslint-disable` rule), solve via string
  construction, fixtures, or test infrastructure — never exempt the
  test from the gate. The purpose of hardening is strictness; any
  exemption undermines the gate for all future code.
- **WE DON'T HEDGE** - It is worth doing or it doesn't exist.
  We don't create plan stubs, or fallbacks, or invent
  optionality or prefix unused variables with an underscore.
  We fix it, or we delete it, or we never create it in the
  first place.
- **Don't hide problems — fix them or delete them** - `void
<expr>` to silence unused-variable lint and underscore-prefixing
  unused identifiers are banned. They hide dead state instead of
  removing it. No adapters, no compatibility layers, no half
  measures: use the value, restructure the code, or delete the
  binding. See
  [`no-warning-toleration` §Problem-hiding patterns](../rules/no-warning-toleration.md#problem-hiding-patterns).
- **Quality gates** - Run ALL gates after changes. From the repo root,
  `pnpm check` runs every gate, writing no tracked file (`pnpm fix` runs the
  auto-fixers first): format, markdownlint, shell and runtime-only
  lint, lint, type-check, test, `agent-tools:test:e2e` (the agent-tools
  end-to-end and smoke suite, which builds `agent-tools/dist`), `knip`,
  `depcruise`, `secrets:scan`, `portability:check`, `subagents:check`,
  `skills:check`, `encoding:check`, `repo-validators:check` (whose legs
  include the wire-contract check and the substrate audit),
  `docs-validators:check`.
  The site workspace adds the Playwright suite (`pnpm --filter @jimcresswell/www test:e2e`, against a
  production build — ADR-019). Run `check` and the E2E suite sequentially,
  never in parallel: each is a full-host run (builds, test workers, the
  Playwright web server). Across worktrees, full gates run side by side, at
  most two at once, and inside one worktree gate runs are sequential
  ([`no-unbounded-host-load` item 6](../rules/no-unbounded-host-load.md);
  owner, 2026-09-20: "two parallel gate runs are fine as long as they are in
  different work trees"). These bounds are about
  load, not correctness: each Playwright run serves on a port its own server
  process binds and keeps for its whole life, so checkouts no longer share a
  fixed port, and it reuses no existing server, so a gate can only ever prove
  its own build. Git hooks enforce this — pre-commit runs
  prettier on staged files and lint on changed workspaces; pre-push runs
  `check` and the site E2E suite.
- **Restart on fix** — After any quality-gate fix, restart the full sequence
  from the top. Fixes can introduce new issues downstream.
- **Visual regression harness is blocking proof for rendering-risk changes**
  — If a change can affect rendered output through content-model changes,
  graph infrastructure, metadata wiring, page composition, or rendering
  plumbing, run `pnpm --filter @jimcresswell/www visual-regression:harness`
  during implementation on meaningful slices, not only at the end.
  Unexpected differences block the work until reviewed and either fixed or
  explicitly approved (ADR-022). This proof is separate from `check` and the
  E2E suite; it complements them.
- **Work on branches for risky changes** — Feature branches for
  experimental or risky changes protect `main` from failed Vercel
  deployments and build-failure notifications; see
  [`never-commit-to-main.md`](../rules/never-commit-to-main.md).
- **No unused code** - If a function is not used, delete it. If
  product code is only used in tests, delete it. If a file is not
  used, delete it. Delete dead code. Static analysis tools (knip,
  dependency-cruiser) enforce this at scale.
- **Misleading docs are blocking** - Docs that misstate behaviour
  or point at retired surfaces are a quality-gate blocker. Missing
  docs prompt verification; misleading docs are trusted and acted
  on. Fix immediately — never defer, never TODO. Pairs with PDR-026
  §Landing target definition.
- **Target-architecture wording needs consuming-runtime evidence** -
  Present-tense architectural claims ("the SDK exposes the target
  schema", "all consumers migrated", "the app uses the new
  endpoint") MUST be backed by at least one consuming-runtime
  instance verified at write time. A shared package exposing a
  target schema is not proof that an app has migrated; the proof
  is the import resolved in a built composition root. Use future
  tense or "intended" when authoring without runtime evidence;
  reserve present tense for verified state. ADRs, runbooks,
  operator docs, RULES, and SKILLS all bind here — a rule or skill
  claiming a guarantee its mechanism does not deliver is the same
  defect and is cited as authority just as hard (five instances in
  five surfaces, 2026-07-27; falsifier for the class: a sixth
  instance in a surface this scope still misses). The rule binds in
  BOTH directions: doctrine claiming LESS than the mechanism
  delivers is the same defect — a stale under-claim is cited as
  authority just as hard and forecloses capability that exists
  (worked instance 2026-07-27: a docstring omitting the schema's
  `match` field cost a wrongly-scoped ticket and a false blocker
  claim). Companion to "Misleading docs are blocking": that rule
  fires after the misstatement lands; this rule prevents authoring
  the misstatement in the first place.

### Agentic Quality

Every agentic capability — prompts,
[skills](https://agentskills.io/skill-creation/evaluating-skills), MCP tools,
sub-agents — must carry an assurance case proportionate to the harm of getting
it wrong, internal-facing as much as user-facing. Assurance composes
deterministic tests, baseline-relative evaluations, conformance, and human
review; rigour is risk-tiered (highest where harm is asymmetric and
irreversible, light where cheap and self-correcting), never uniform. Evaluation
definitions are version-controlled with the artefact they grade. Capabilities
that are not eval-shaped take a different instrument, not forced graded-output
evals. No internal assurance is complete until it closes against a real-world
signal of value — grading only against expectations we authored measures our own
assumptions. See [validation-strategy.md](validation-strategy.md) for the
test/evaluate/assure frame, the assurance tiers, and the instrument-by-surface
mapping.

### Compiler Time Types and Runtime Validation

Type precision is one expression of strict, complete, schema-driven practice.
Operational detail lives in [Validation Strategy][ts-practice].

- **No type shortcuts** — Never use `as`, `any`, or `!`; they disable the type
  system ([`no-type-shortcuts.md`](../rules/no-type-shortcuts.md)).
- **Type imports must be labelled** — `import type { T } from 'x'` or
  `import { type T } from 'x'`.
- **Prefer runtime constants as type sources** — When types and predicate
  guards derive naturally from a stable runtime list or object, define the
  runtime value `as const` and derive the type from it.
- **Validate external data at the boundary** — Parse and validate every
  external signal (API responses, file reads, content JSON) with Zod
  ([`strict-validation-at-boundary.md`](../rules/strict-validation-at-boundary.md)).
- **Single source of truth for types** — Define types once and import them
  consistently.

### Testing

Tests prove runtime behaviour. TypeScript proves types; ESLint and
static analysis prove structural rules. **Foundationally, a test
describes a system state and product code is the path that guides the
system into that state — they are two halves of one act of design,
not two outputs of two acts.** See [TDD as Design][tdd-as-design] for
the load-bearing definition and the atomic-landing invariant. For
test-type taxonomy, full rules, examples, and recipes, see
[Testing Strategy][testing], [Testing TDD Recipes][tdd-recipes], and
[Test doubles model the boundary][di].

[tdd-as-design]: tdd-as-design.md
[testing]: testing-strategy.md
[tdd-recipes]: ../../docs/engineering/testing-tdd-recipes.md
[di]: testing-strategy.md#test-doubles-model-the-boundary-never-the-engine

Universal testing principles:

- use TDD at every affected test level;
- test behaviour through public interfaces, not implementation details;
- assert effects, not internal constants or configuration collections;
- each proof happens once and must prove product code;
- unit tests are pure, in-process, and mock-free;
- integration tests import code directly and use only simple DI fakes;
- E2E tests prove running-system behaviour;
- smoke tests prove the built artefact is viable in its shipped form (invoked as
  production invokes it, no loaders); every built binary carries at least one —
  new ones at landing, the pre-existing gap as recorded debt;
- tests must never read or mutate `process.env`, global objects, module cache,
  ambient env files, or `process.cwd()` — smoke composition roots only;
- do not test types — tests are for runtime logic; a test that only proves a
  type is deleted;
- no useless tests — each test proves something about product code, never
  about test code;
- no skipped tests, no conditional tests, no complex mocks, no complex test
  logic, no process spawning in in-process tests. Conditional tests are an
  architectural-failure symptom — remove them, fix the ambiguity in product
  code, write deterministic behaviour-proving tests.

### CSS and Accessibility

- **Relative units for scalability** — Use `rem`/`em` for text sizing,
  spacing, focus rings, and border radii. `px` is acceptable only for design
  constraints (container max-width) and WCAG minimums (44px touch targets).
  Layouts MUST scale with text size at 200%+ zoom.
- **Accessibility is a gate, not a review note** — axe runs in the E2E suite;
  a pre-hydration fallback state must pass contrast like any other state.
  Practice detail: [Accessibility Practice](../reference/accessibility-practice.md).

### Any User, Any Machine

The estate must work on any machine, for any user, including a cold,
fresh install (owner-set, 2026-07-21). This is a review lens applied to
every surface as it is touched, not a one-off migration: test each
design against three readers — another user on their own machine, the
current user on a new machine, and a cold clone with no local state.
Concretely: no named person where a role or derivation belongs
(resolve the collaborating human per the start-right skill's
§Collaborating Human ladder), no machine-local paths
([privacy.md §Machine-local paths](./privacy.md#machine-local-paths)), no
state that only exists because an earlier session happened to leave it
([important-state-not-in-temp-files](../rules/important-state-not-in-temp-files.md)),
and per-user surfaces derive their user at run time rather than at
authoring time. A surface that silently assumes its author's identity
or host is a portability defect even while it works perfectly for
them. The same lens covers checkouts: for any coordination-state,
path-resolution, or identity feature, many checkouts on many machines
is the case to satisfy first; a single checkout is the degenerate
case that satisfies it trivially. Resolving a path by walking up from
the current directory lands in the LOCAL checkout — in a
many-checkout world, the wrong registry. "Currently we run one
checkout" is the tripwire to re-ground, not a licence.

### Developer Experience

- **No commented out code** - Fix it or delete it
- **Inline docs everywhere** - ALL files, modules, functions, data
  structures, classes, constants, and type information MUST have
  inline jsdoc/tsdoc comments that can be compiled by `typedoc`
  to generate documentation.

### Architectural Model

Three kinds of workspace, documented in
[Build System §Workspace layout](../../docs/engineering/build-system.md#workspace-layout):

- **`jcdotnet`** — the site: Next.js App Router app, CV, personal knowledge
  graph, PDF generation, E2E and visual-regression proof.
- **`agent-tools`** — `@engraph/agent-tools`: Practice validators,
  collaboration state, comms, commit queue, adapter generation.
- **`tooling/*`** — `@engraph/*` shared packages: eslint plugin, result,
  safe-path, type-helpers, workspace-config.

### Layer Role Topology

Inside the site (`jcdotnet/`), data flows one way: `content/*.json` (the graph and the
authored content) → `lib/` (validation, derivation, contracts) → `components/`
→ `app/` (routes and metadata). Routes and components are **thin
presentation**; `lib/` owns derivation and contracts; content owns facts.

- **Content owns**: every fact, identity atom, and authored passage.
- **`lib/` owns**: validation of the graph, derivation of metadata and
  JSON-LD, the page-document contract, PDF configuration.
- **Components and routes own**: composition and presentation only. They
  NEVER restate a fact the graph carries or derive what `lib/` already
  derives.
- **The test**: "Could another surface need this?" If yes, it belongs in
  `lib/` (or in the graph), not in a component.

This is a structural constraint. Violations cause silent drift: the graph
changes and a component's copy does not.

### Documentation Is Infrastructure

Documentation in this repository configures agents and carries durable
intent — it is infrastructure, not supplementary text. The
software-design principles therefore apply to documentation **content**
and to the conceptual and organisational structures it sits within, not
only to code: **SSOT** (one canonical home per concept; every other
surface points, never restates), **DRY** (cite the stable interface;
keep only each document's own-concern content), **single responsibility**
(no god-documents), **decoupling and well-defined interfaces** (depend on
a document's stable identity, not its volatile prose; reference direction
flows toward the more fundamental artefact), and **stable indexes**
(READMEs and index surfaces point, they do not carry, and must not
drift). A DRY violation, a stale index, a god-document, or a dangling
cross-reference is a real defect, not a style nit. Canonical decision:
[PDR-023](../practice-core/decision-records/PDR-023-documentation-structure-discipline.md).

- **TSDoc everywhere** — All exported functions and non-trivial internal
  functions carry TSDoc; public interfaces include examples.
- **Good READMEs** — Each significant directory has a README that points,
  never carries.
- **Inline comments for the why** — The code shows what; comments explain
  why.
- **Content lives in JSON** — Content changes go in `jcdotnet/content/*.json`, never
  hard-coded in components.
- **Permanent docs never reference ephemeral docs** — Plans and prompts are
  ephemeral; `docs/`, directives, ADRs and EDRs never depend on them. Only the
  reverse direction is valid.
- **Tooling docs are contract surfaces** — When scripts, hooks, gate
  sequences, or adapter surfaces change, update README, CONTRIBUTING, ADRs
  and Practice docs in the same pass.
- **Narrative sections drift first** — When syncing a plan or record,
  inspect body status lines, decision tables, and current-state prose, not
  just frontmatter and todo checkboxes; prose is where stale truth hides. A
  child plan that changes runtime truth reconciles its parent plan and any
  closure proof in the same session.
- **Write the plain meaning, not coined status-jargon** — "safe to delete",
  not "reclaimable". Before using a coined adjective or status term, ask
  what it means for the reader and write that instead (or alongside, if the
  term is load-bearing jargon the reader already knows). Agent-authored
  artefacts accrete invented vocabulary that reads as ceremony.
- **Prose artefacts are accepted on decision and audience outcome** — For
  READMEs, decision records and runbooks, acceptance criteria name the
  decision and the reader outcome (discoverability, accuracy), never an
  exact sentence shape. Reserve executable tests and grep guards for code
  contracts, generated surfaces, or forbidden runtime exposure; validation
  of prose is read-through plus formatting and link hygiene.
- **Read the index before guessing URLs** — When researching external
  documentation, fetch `sitemap.xml`, `llms.txt`, or the docs index first.
