---
title: "Validation Strategy"
status: active
last_updated: 2026-09-24
fitness_line_target: 330
fitness_line_limit: 400
fitness_char_limit: 24000
fitness_line_length: 100
fitness_rationale: >-
  Sized at the 2026-09-12 merge of the TypeScript practice into this directive;
  substance is never trimmed to fit, and a later curation lane may split by seam.
split_strategy: >-
  Split at the compile-time / runtime seam: the type-flow patterns could become a
  companion reference beside typescript-gotchas.md, leaving the spine, the tiers
  and the gate-integrity doctrine here.
---

# Validation Strategy

The validation estate of this repository, from the compiler outward: the
compile-time type flow, runtime validation at every boundary, the deterministic
gates, and the evaluate / assure layers above them. It operationalises
[principles.md §Compiler Time Types and Runtime Validation](principles.md#compiler-time-types-and-runtime-validation)
and §Agentic Quality, and it is the formal home the
[testing-strategy.md](testing-strategy.md) doctrine points to for mutation checks.
The spine (test / evaluate / assure) and the assurance tiers are ratified (owner,
2026-06-23); the finer eval taxonomy is deliberately deferred until the first eval
suites in this repository produce real experience to write from.

## The spine: test / evaluate / assure

- **Test** — _deterministic_. Proves code does what its spec says. Binary,
  reproducible; unit of truth is the assertion, and a test uses no IO.
  [testing-strategy.md](testing-strategy.md) defines the tests, and the E2E and
  smoke checks beside them, which are validation surfaces. Mutation checks (§Prove the guard
  bites, below) are the meta-quality layer that makes test coverage meaningful.
- **Evaluate** — _probabilistic_. Measures the value and reliability of a
  judgement-laden capability across realistic inputs, graded relative to a
  baseline. Unit of truth is a graded outcome over a corpus plus a with/without
  delta. Assertions are authored _after_ the first run (this inverts test-first).
- **Assure** — the umbrella trust case: composes test + evaluate + conformance +
  UAT + observability + security review + human review into ongoing evidence that
  the capability is fit for the world.

**Describe the outcome you want; never audit the implementation choice** is the
continuity across all three — the same discipline as "test behaviour, not
implementation" in testing.

## Assurance tiers (risk-tiered, keyed on harm asymmetry)

Rigour is proportionate to the harm of getting it wrong — not uniform, and not
keyed on surface type.

| Tier | Applies to | Assurance floor |
|---|---|---|
| **Critical** | Asymmetric, hard-to-reverse harm — a public claim about a real person or organisation carried by the entity graph, the CV, the PDF or the JSON-LD | Tests + strict schema validation of the graph + human review of the rendered claim |
| **Standard** | User-facing where errors are visible and correctable — page composition, navigation, metadata, media negotiation | Tests + E2E + rendered proof (the visual regression harness) |
| **Light** | Internal / agent-facing where harm is cheap and self-correcting — formatting, scaffolding, Practice tooling | Tests + spot checks; evals optional |

## Compile-time types: preserve information, never widen

Type precision is one expression of strict, complete, schema-driven practice. The
type flow is `external input → validation → known types → strictly typed system`.
The ONLY function that takes `unknown` (or otherwise-untyped) input is the boundary
validator, which narrows to known types; **past that boundary nothing widens**.

- **No type widening or destruction** — never use widening casts (`as SomeType`),
  `any`, `!`, `Record<string, unknown>`, `{ [key: string]: unknown }`, `Object.*`
  methods, `Reflect.*` methods, `isObject` type predicates, `z.unknown()` where a
  concrete schema exists, `z.record(z.string(), z.unknown())`, or hand-crafted Zod
  schemas that duplicate a shape the entity schema already declares. `as const` and
  `satisfies SomeType` are permitted because they tighten compile-time information
  instead of disabling it ([`no-type-shortcuts.md`](../rules/no-type-shortcuts.md)).
- **`unknown` is type destruction** — `unknown`, `z.unknown()` and
  `Record<string, unknown>` erase structural type information. They are permitted
  only at named external boundaries and are forbidden as stand-ins for known
  shapes (§The `unknown` boundary exception, below).
- **Never widen literal types** into broad annotations such as `string` or
  `number` — including a `Set<string>` or a `readonly string[]` view over an
  `as const`-derived value to make a lookup type-check. Widening is information
  loss and a deferred bug. **Any widening is an immediate stop-and-reassess
  trigger**: trace to the exact domain type — the strict cure is almost always the
  precise union (`Set<DeclaredPhase>`) or a zero-widening membership check
  (`ids.some((id) => id === value)`), never a `string` view.
- **Single source of truth for types** — define each type once, preferably by
  inference from the schema that validates it (`z.infer<typeof EntitySchema>` in
  `jcdotnet/lib/entities.ts`) or from the library that owns it, then import it
  everywhere. Never redefine it later as an approximation.
- **Use library types directly** — do not invent a local type when a package
  exports the type you need; prefer official error classes and response types over
  local `*Like` shapes, introducing a local shape only when the library exposes
  nothing usable.
- **Type imports must be labelled with `type`** — `import type { T } from 'x'` or
  `import { type T } from 'x'`.
- **Avoid type-alias entropy** — do not introduce aliases that merely rename an
  inferred, library, or well-named local type. Good naming and direct imports keep
  the concept graph smaller.

### The constant-type-predicate pattern

The foundational type pattern of this codebase:

1. Define runtime constants with `as const`.
2. Derive strict types with `typeof ... [number]`.
3. Create type predicate functions backed by honest runtime checks.
4. Optionally use `satisfies` to prove interface compliance without losing literal
   types.

```typescript
const ALLOWED_COLORS = ['red', 'green', 'blue'] as const;
type AllowedColor = (typeof ALLOWED_COLORS)[number];

function isAllowedColor(color: string): color is AllowedColor {
  // Zero-widening membership: narrow by equality over the exactly-typed constant.
  return ALLOWED_COLORS.some((allowed) => allowed === color);
}
// Forbidden: a `readonly string[]` view or `new Set<string>(ALLOWED_COLORS).has(color)`
// — both widen the constant's literal type to `string`.
```

### Compile-time validation patterns

- **`as const satisfies T`** is the gold standard for data that must be both a
  literal type and structurally valid. `as const` alone preserves literals but skips
  structural checks; `satisfies` alone checks structure but widens literals.
  Combined, you get both:

  ```typescript
  const c = { name: 'search' } as const satisfies { name: string };
  // type: { readonly name: 'search' } — literal preserved + structural check
  ```

- **Type predicate stubs** — with `noUnusedParameters`, `() => false` will not
  compile as a type predicate stub. Use the parameter in the body:
  `(v: unknown): v is T => typeof v === 'string' && v === '__never__'`.
- **Compile-time type assertions** (`AssertNoX<T>`) are inert unless the resulting
  type is consumed in a binding or type path. Always bind the assertion result.
- **Spread with optional properties widens**: `{ ...defaults, ...overrides }` where
  `overrides.prop?: T` yields `prop: T | undefined` even when `defaults.prop: T`.
  Fix with explicit property resolution using `??` or a typed merge helper.
- **Discriminated unions** of `readonly string[] | { excludes: readonly string[] }`
  narrow with `'excludes' in value` (property check), not `Array.isArray(value)` —
  `Array.isArray` narrows to `string[]` but leaves the else branch still containing
  both union members.

### Derive views from the schema, never restate them

A hand-restated projection of an inferred type is a **shadow schema** — it drifts
silently when the contract evolves. When a consumer needs a narrowed view of an
entity type, derive it (`Partial<Pick<Entity, 'fieldA' | 'fieldB'>>` or indexed
access such as `NonNullable<Entity['sameAs']>`), never re-declare the fields by
hand; deriving keeps the consumable shape identical and turns contract drift into a
compile error. Verify field shapes against the SCHEMA, not a handoff note — a
relayed note once mis-stated a list of objects as strings (worked instance
2026-07-01). When a test fake cannot satisfy a complex inferred type without `as`,
extract a narrowed interface containing only the fields the code under test
consumes — interface segregation removes the assertion pressure at source rather
than working around it.

The detailed TypeScript and tooling quirks (runtime value typing, lint
interactions, collation, test doubles) live in
[typescript-gotchas.md](../reference/typescript-gotchas.md).

## Runtime validation at the boundary

Owner ruling (2026-07-28): **strict, all the time, everywhere**. Every boundary
this repository owns — the content JSON under `jcdotnet/content/`, environment
values, fetched data, file reads, hook and CLI inputs — carries a schema and is
validated to it at entry; the entity graph's validation in `jcdotnet/lib` is the
founding instance. Official library types count as validation; use Zod
elsewhere. Once validated, the validated type is used throughout the trusted zone
([`strict-validation-at-boundary.md`](../rules/strict-validation-at-boundary.md)).

### The `unknown` boundary exception and the preservation test

Permitted: a function parameter at an incoming external boundary from a
third-party system, where the data genuinely has no known shape yet; and
`z.unknown()` only when the upstream contract genuinely declares no structure.

Forbidden: replacing a concrete type with `unknown` to avoid a type error;
`z.unknown()` where a concrete Zod schema exists or can be derived;
`z.record(z.string(), z.unknown())` as a stand-in for a known object shape;
hand-crafting a Zod schema that approximates a shape the entity schema already
declares (the shadow-schema paragraph above).

**The preservation test.** If the type information exists anywhere in the
pipeline — the entity schema, the inferred types, a library's exported types — it
MUST be preserved. The test runs on the proposed change: can the type be sourced
from the schema or library? If yes, sourcing it is mandatory; using `unknown` in
its place is forbidden.

### The `process.env` boundary exception

`Record<string, string | undefined>` is acceptable at the `process.env` entry
boundary — the key space is genuinely unbounded. Zod validation immediately
narrows it. This is the correct exception to "Record is too generic".

### Zod v4 patterns

- `ZodIssue` is deprecated — derive the type via `ZodError['issues'][number]` (a
  stable structural alternative that avoids coupling to the `$`-prefixed core
  naming convention).
- `.passthrough()` is deprecated — use `.loose()` on existing schemas or
  `z.looseObject()` for new definitions.
- Shared Zod schemas are opt-in contracts: define fields as required in the
  schema; consumers use `.partial()` for optionality. This preserves contract
  semantics: "if you use this capability, you must satisfy these fields."

### Error types

Functions that can fail return `Result<T, E>` from `@engraph/result`, not thrown
exceptions ([`use-result-pattern.md`](../rules/use-result-pattern.md)). Error
types are specific, never `Error` or `unknown`; see
[principles.md §Handle All Cases Explicitly](principles.md#code-design-and-architectural-principles).

## Gate layers: what each check proves

Each layer catches a different class of defect; the layers compose, and the
canonical run order lives in the
[gates skill](../skills/change-custody/gates/SKILL-CANONICAL.md).

1. **Formatting** (`format`, `markdownlint:check`) — consistent style, no merge
   noise.
2. **Type correctness** (`type-check`) — compile-time type safety.
3. **Linting** (`lint`, `lint:shell`, `lint:runtime-only`) — code patterns, import
   boundaries, architectural rules. The custom rules in `@engraph/eslint` encode
   architectural decisions as enforceable checks.
4. **Static analysis** (`knip`, `depcruise`) — unused code, exports and
   dependencies; circular dependencies; layer violations. Linting enforces _what
   you should do_; static analysis detects _what you forgot to clean up_.
5. **Testing and checks** — `test` proves product behaviour at every level, with
   no IO; the smoke runner's checks and the site's Playwright suite are
   validation checks of the running system and its shipped form.
6. **Mutation checks** (§Prove the guard bites) — test-suite effectiveness: proves
   tests detect real faults, not merely exercise code paths.
7. **Build** (`build`) — every derived surface compiles from the entity graph.
8. **Specialist review** (sub-agents) — architectural compliance, security,
   documentation.
9. **Accessibility and rendered proof** (axe in the E2E suite;
   `visual-regression-harness`) — WCAG 2.2 AA, both themes, zero tolerance.

## Gate integrity: a green check proves its own path, nothing more

A green gate is evidence about the path the gate exercised — never about the path
production runs. Worked instance (2026-07-2x): a Vitest unit test passed on a
runtime fact the real build path could not satisfy, because Vite resolves
workspace packages and a `tsx`-driven build script does not — the green unit test
"proved" a resolution the shipped artefact lacked. When a claim is about a RUNTIME
or BUILD property, the check must run on that runtime or build path (a smoke check
on the built artefact, not a unit test on the source graph). Composes with the
`green-parts-red-composition` pattern: per-path checks compose no better than
per-part ones.

### Right tool: a check uses the property's real machinery (owner ruling 2026-08-09)

A validator's subject dictates its instrument. A check about **dependencies** runs
on a dependency **resolver** — dependency-cruiser, AST-based and already in the
blocking chain (group-matched containment via `$1` back-references,
phantom-dependency `dependencyTypes`, first-class dynamic-`import()` and `require`
analysis) — never on textual pattern-matching of source. Regex import-scanning is
the wrong tool: its silent-pass classes (literal dynamic imports, unrecognised
path idioms, comment-stripping bypasses) are the instrument's shape, not bugs to
patch one spelling at a time. Prefer the instrument that exercises the property's
real path over a textual shadow of it.

The module-system policy those rules enforce (owner ruling 2026-08-09): this
estate is **strictly ESM — zero `require` statements**; the presence of a
`require` IS the finding, never a style note. **Dynamic `import()` is strongly
discouraged**: it errors by default, with any sanctioned use carried as a
recorded, per-instance exemption in the rule configuration — never a silent
allowance.

**An observation is an instrument** (owner, 2026-09-14, verbatim: "sometimes
you don't need an automated check @validation-strategy.md sometimes you need
an observation"). Where the property's real machinery cannot run inside a
test (git's own merge semantics, a filesystem, a running vendor, a spawned
process), because tests never use or create IO
([testing-strategy.md](testing-strategy.md) §Philosophy), the property is
exercised once at cure time by hand and the run is recorded on the pull
request and in the records: the commands, the inputs, what was seen. An
observation is dated, first-hand and reproducible from its record; it is
never narrated as a suite's proof, and a suite is never built to replace it
with IO. Worked instance, in the lineage's estate (2026-09-14): its review-cost
gate's sync predicate, proven by unit tests over injected git output plus one
recorded run of the real git on its PR #146, a scratch repository exercising
the admitted and refused merge shapes by hand.

## Prove the guard bites: claim-directed mutation checks

When a change's value IS an assertion (a test instrument, a validator, a guard),
each claim the change makes lands with a mutant that negates exactly that claim,
verified killed in the same commit. The binding statement is
[testing-strategy.md §Prove the guard bites](testing-strategy.md); this is the
method:

1. Pick one mutant per failure mode the change claims to close — negate the claim
   itself (invert the predicate, drop the branch, skip the write), never an
   incidental line.
2. Apply it as a temporary forward file edit from a driver script that holds the
   original text (string-replace with a matched-needle assertion; restore by
   writing the original back — never via `git checkout` / `git restore`).
3. Run the narrowest suite that judges the claim; record the outcome; restore;
   re-run green.
4. Read the direction honestly. At unit level a mutant is killed when a cell
   fails. Against a live surface that is already red from a known defect, the
   direction inverts: the mutant must turn the red cell GREEN — that proves the
   new assertion (not some other break) is what catches the defect. "The cell went
   red" alone is evidence a defect surfaced, not evidence the instrument caught it.
5. The durable record is the commit body: which mutants, judged where, with what
   outcome. Driver scripts are throwaway.

A mutation score, where one is ever measured, is evidence, never a gate (owner
doctrine 2026-08-05); promotion to a gate is a separate owner decision with its
own evidence.

## Validation jurisdiction: we validate our own systems

Every validator names whose system it validates, and external-system content is
never in scope — the testing doctrine's existing "NEVER test external
functionality, that is not under our control"
([testing-strategy.md](testing-strategy.md)), applied to the whole validation
estate. A check whose walk crosses territory another system owns (an external
installer's output, a vendor's artefacts) must be scoped so that territory is
invisible to it, never tolerated through an exemption list: an exemption over
foreign territory is a jurisdiction claim wearing a tolerance, and it converts the
other system's normal output into findings. Class membership derives from the
owned system's own definition — location, recorded derivation, declared
membership — never from name patterns, which are configurable. Worked instance
(2026-08-12): a skills reconciliation sweep adjudicated every entry at the
projection roots, defining an external skills CLI's standard install layout as a
defect tolerated only via a homegrown lock exemption; cured by recognising
Practice projections through their recorded derivation and leaving everything
else untouched.

## Visibility precedes validation

A validator over a shape nobody has ratified promotes the accidental to the
canonical (owner correction, 2026-07-09, on an audit of agent-facing content
that had evolved organically: "a validator at this time might accidentally
lock in shapes that evolved organically and without intention or oversight").
Before proposing any validator, guard or eval gate, ask whether the surface's
shape has been ratified from first principles. If not, the sequence is: make
the shape visible and reviewable (a registry, a report), let the right people
judge it, ratify the intended shape, and only then guard it. The reflex to
guard drift the moment it is found presupposes that the current shape is
intended.

## Eval home

Evaluation **definitions are always version-controlled in-repo** with the
artefact they grade. Skills, prompts and sub-agents carry their evals as in-repo
`evals/evals.json` (agentskills.io convention), run in-repo and reviewed in PRs.
Any external runner is execution only, never the source of truth.

## The real-world loop (non-negotiable closure)

Test / evaluate / assure is an **internal-confidence triad** — every layer grades
against an expectation _we_ authored. It only becomes trustworthy when closed
against a real-world signal of value: how readers and consumers of the published
surfaces (the site, the CV, the PDF, the graph) actually behave, with eval corpora
**seeded from real usage distributions** so the loop is structural, not bolted
on. Which instrument captures that signal for this site is an owner decision;
until it is made, no assurance case here claims closure.

## What is not eval-shaped

Diffuse, long-horizon, cultural capability (doctrine, planning discipline,
collaboration) does not decompose into `prompt → graded output`. It takes a
different instrument (retrospective, experience corpus), not a forced
`evals/evals.json`. Forcing eval-shape onto it is the mirror category error of
treating evals as tests.
