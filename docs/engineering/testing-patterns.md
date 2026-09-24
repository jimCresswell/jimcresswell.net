---
fitness_line_target: 300
fitness_line_limit: 400
fitness_char_limit: 20000
fitness_line_length: 100
fitness_line_length_rationale: >-
  Sized to the file's real footprint at the 2026-09-12 transplant (owner-ratified): this is a
  recipe companion whose value scales with worked instances, and the repo rule is knowledge
  preservation over fitness warnings, so the budget reflects the content rather than trimming it.
split_strategy: 'Split specialised domains into focused pattern files if this grows.'
---

# Testing Patterns

Reusable testing recipes referenced by the
[testing strategy](../../.agent/directives/testing-strategy.md).

`.agent/directives/testing-strategy.md` is the authoritative doctrine.
This file is a governed recipe companion; patterns here must conform to the
directive and to the immediate-fail rules.

For worked Red/Green/Refactor examples, see
[Testing TDD Recipes](./testing-tdd-recipes.md).

---

## In-Process Tests with Dependency Injection

Tests that exercise a unit in-process must configure it through dependency
injection — explicit config objects and injected IO seams — never by reading or
mutating `process.env`. Do not import production config loaders unless the test
is directly proving the loader; they may read `.env` files as part of the
production pipeline.

### The Pattern

The bootstrap's rebuild decision (`agent-tools/src/bootstrap/bootstrap-helpers.ts`)
takes its filesystem as a `WorkspaceDepFsIo` seam, so the test describes the
decision as a pure function over mtimes with an in-memory tree:

```typescript
import { workspaceDepDistIsStale, type WorkspaceDepFsIo } from './bootstrap-helpers.js';

// 1. Build the seam explicitly — never touch the real filesystem or process.env
const io: WorkspaceDepFsIo = fakeIo({
  fileMtimes: {
    '/repo/tooling/result/dist/index.js': 100,
    '/repo/tooling/result/src/index.ts': 200,
  },
  dirEntries: { '/repo/tooling/result/src': [file('index.ts')] },
});

// 2. Drive the unit through its interface with the seam injected
const stale = workspaceDepDistIsStale('/repo/tooling/result', ['index.js', 'index.d.ts'], io);

// 3. Assert the observable decision
expect(stale).toBe(true);
```

### Key Rules

- Do not read or write `process.env` in tests. Build literal config objects or
  use hermetic test helpers that do not read disk.
- Do not import a runtime config loader into these tests unless the loader is
  the direct unit under test.
- For tests needing multiple configurations (e.g. a token present vs absent),
  create **separate config objects** for each case.
- Helpers that mutate `process.env` to flip a mode must not exist. Use the
  isolated config pattern instead.

### Subprocess-Spawned Checks

A test never spawns a process (`testing-strategy.md` §Rules). A check that
spawns a built command as a **separate process** (a smoke check using
`spawn('node', [entryPoint], { env })`) may pass environment variables via the
spawn `env` option: they are scoped to the child process.

A check's composition root (its runner config, global setup or entry script)
may load ambient environment, validate it, and pass the resulting object on.
The check's other files consume the injected object; they never read or write
`process.env`.

### Reference Implementations

Compliant tests to use as templates:

- `agent-tools/src/bootstrap/bootstrap-staleness.unit.test.ts` — an injected
  filesystem seam over an in-memory tree.
- `agent-tools/src/codex/team-alert-bootstrap.integration.test.ts` — an
  integration test that wires real units through injected IO.
- `jcdotnet/lib/pdf-config.unit.test.ts` — deploy-key and path derivation
  proved by passing values, never by setting Vercel's environment variables.

---

## Untestable Code Is a Product-Code DI Defect

When adding tests to existing green code would make them audit-shaped, check
whether the untestability is itself the defect: a test that is merely
audit-shaped is deleted or rewritten (`tdd-as-design` §Describe vs. Audit),
while a seam testable only through prohibited mechanisms, or a test that seems
to need real IO, IS the defect. In both of those shapes the product code lacks
a dependency-injection seam:

- **A seam testable only through prohibited mechanisms** (ambient env import,
  a module-level singleton reachable only via `vi.mock`, a non-injectable
  route). The conformant cure is a **fresh TDD cycle** against a
  not-yet-existing injectable seam — genuine RED first — NOT a retrofit and
  NOT abstention (test-expert ruling, 2026-07-01, a search seam in the lineage
  repository: extract the core with the service injected + a
  `createHandler(fn)` factory). "Tests would be audit-shaped" is a signal to
  inspect the product code's injectability, never merely a reason to skip.
- **A unit or integration test that seems to need real IO** (see [Test File
  Classification](#test-file-classification)): a loopback socket counts. The fix is to refactor the
  product to be testable (route the read/write through an injectable
  dependency, as sibling modules already do) and inject an in-memory fake —
  never to leave the IO in the test, and never to treat the refactor as
  out-of-scope ("if you need to refactor code to make it testable that is a
  good thing — that is surfacing an architectural issue and fixing it";
  owner, 2026-06-13).

## Real-Content Backstops for Transforms

For any generator, transform, extractor, or content firewall, **green
fixtures are not proof**: fixtures encode the cases you already thought
of, and the real source carries the ones you didn't. Add a backstop that
runs on the real source — a generation-time assertion or a real-content
test — and inspect the real output before calling the transform done
(worked instances 2026-06-30: fixtures passed twice while the real
generated body carried a routing coupling and a structure leak that only
grepping the real content caught). For a separation or firewall that
encodes a principle, the real-content check IS the proof. The site's
`e2e/behaviour/content-integrity.e2e-ui.test.ts` is the local instance: it
proves the rendered pages against the JSON sources in `content/`, not
against fixtures.

## Test File Classification

Test classification is based on what the test actually does,
not what the author intends:

- **Module-level state with IO is a missing seam**: a test that touches a
  module-level singleton with IO is a defect under any name. Inject the
  singleton's IO and prove the rest in process.
- **A socket is IO, whatever tool opens it**: a request driven at an
  imported, in-process app over a harness's loopback listener is IO in a
  test. Exercise the handler below the listener, called directly. A request
  driven at a separately running black-box system over a network interface is
  an E2E check, classified by the boundary, not the tool (owner-ratified
  2026-07-29). The site's Playwright suite is the E2E
  case: it runs against a production build served by the harness's own
  server process, started by the global setup on a port of its own
  (`jcdotnet/e2e/`, `*.e2e-ui.test.ts` for browser journeys and
  `*.e2e-api.test.ts` for HTTP-level checks; `jcdotnet/e2e/README.md`).
- **Middleware proofs mount the middleware alone**: mount the
  middleware on a bare app with one probe route and drive it directly; never
  boot the full application to prove one middleware decision (review lens
  Q3/Q4).

## Composition Testing

Unit + E2E tests can all pass while the integrated product fails. For features
spanning multiple modules, add a **composition test** that exercises the
integration seam. The site's content negotiation is the local example: the
proxy, the route handler and the rendered document each have their own tests,
and `e2e/behaviour/markdown-content-negotiation.e2e-api.test.ts` proves the
composed path (an `Accept` header in, the right representation out). A
composition test IS the enforcement for multi-module integration — it is what
catches a knip or depcruise cleanup that removed a module every unit test had
already stopped exercising.

## Rendered-Output Assertions

Test a function that returns rendered or string output (a statusline
renderer, a formatter, a layout assembler) by **observable relationships
through the interface** — "the line containing X also contains Y",
relative order, presence/absence — never geometry or exact content.

- Forbid: pinned row indices (`rows[2]`), `toHaveLength` line counts,
  exact ANSI-escape literals, whole-object `.toEqual` on the parsed
  result. A harmless layout reflow or an added field must not break a
  test that proves nothing about behaviour.
- Strip ANSI before asserting visible text; prefer `toMatchObject` over
  `.toEqual` so additive fields don't break unrelated tests.
- Write helpers (line-containing-needle, relative-index, strip-ANSI) and
  assert relationships. Treat any `rows[N]` / line-count / exact-escape
  assertion on rendered output as a coupling smell to remove.

This is the rendered-output specialisation of testing-strategy's "test
behaviour through public interfaces; assert effects, not internal
constants". (Owner-corrected twice in one session, 2026-06-29.)

The same discipline covers **owner-tunable values** (a separator glyph, a
colour, a cosmetic label, a display string): a test that hard-codes one
asserts configuration, not behaviour, and breaks on every free owner
change. The cure is DI-for-testability: make the value a parameter with a
default, have the test **inject a probe value and assert the probe
renders** — default-independent — and keep the default as editable config no
test references. Verify by grepping the tests for the default value: zero
matches (worked instance 2026-06-15: a statusline separator pinned literally
across a suite broke on every glyph change; the probe-injection cure ended
the churn).

## Flaky-Test Disposition

Evaluate a flaky test before silencing it: is it a good test (describes a
system state per `tdd-as-design`)? A good-intent test with a fragile,
environment-coupled assertion gets its **assertion fixed to prove visible
behaviour** (e.g. strip ANSI and assert the visible text — a colour-support
split once made the same source green in a no-colour run and red in a colour
one); a genuinely bad test (proves types, mirrors implementation, tests the
mock) gets **deleted**. Never skip, retry-wrap, or loosen a flake — the
wrapper silences the signal without curing the coupling; the only
dispositions are fix-the-assertion or delete (see
[`testing-strategy`](../../.agent/directives/testing-strategy.md) §Rules).

## Acceptance Value-Proxies

Acceptance value-proxies must compare against independent ground-truth
measures. A value-proxy acceptance criterion ("the new CLI produces a
value within ±N% of the prior baseline") is **tautological** if the
new implementation and the baseline use the same method. Reproducing
the baseline value does not validate correctness; it validates only
internal consistency.

Worked example: a token-count CLI defines acceptance as "the chars/4
output agrees with the prior chars/4 baseline ±5%." The baseline is
itself chars/4. The CLI cannot fail the acceptance check by
construction — chars/4 reproducing chars/4 proves nothing.

The cure is to compare against a **method-independent ground-truth
measure**. For token-count, that is `wc -c` for total characters; the
chars/4 conversion then becomes a mechanical step verified
independently. For other domains, the ground-truth measure is the
authoritative external observation (file size from `stat`, byte count
from the filesystem, response time from a stopwatch, etc.) that the
proxy is supposed to approximate.

Acceptance criteria framed as "agrees with prior baseline ±N%" without
naming an independent ground-truth measure are tautological and fail
under normal churn (any drift looks like baseline error rather than
proxy error). Reject the framing at plan-author time, not at WS
execution.

## Testability Seams Must Not Bypass the Gate Under Test

A convenience seam added to make a guarded surface testable — a CLI
override flag, a mode env var, a directory redirect — can itself become a
bypass of the very gate or backstop the test exists to prove, or a leak
path for ambient disk state (`.env.local` via global `process.env`) into
tests. When adding a testability seam to a protective surface, review it
as product attack surface: can the seam disable the protection in
production invocations, and does the test still prove the gate fires with
the seam present? Inject configuration explicitly (DI) rather than adding
ambient overrides — see `no-global-state-in-tests`.

## Test Configuration Gotchas

- `tsconfig.json` `include` patterns `**/*.test.ts` and `**/*.spec.ts` do NOT match
  test utility files (harness, fixture builder). Add `tests/**/*.ts` to the include
  array when creating non-test utilities in test directories.
- ESLint `projectService: true` uses the nearest `tsconfig.json`, not
  `tsconfig.lint.json`. Files must be included in both for linting to work.
- Stale vitest include globs are silent because of `passWithNoTests: true` — remove
  dead globs promptly after file moves.
- After refactoring entry points (removing `dotenv`, changing a config loader's
  signature), check E2E and smoke tests that launch the process directly — they
  break when the entry-point contract changes.
- Removing a test (e.g. deleting an audit-shaped constant assertion) can orphan the
  export it referenced — knip then blocks the commit. Un-export or delete the orphan
  in the same change.
- A spread-derived object is a new object: assert structural equality with
  `toStrictEqual`, never identity with `toBe`.

## Discriminating Fixtures

Pick test inputs that maximally **distinguish** the contract from its plausible
regressions — a fixture that still passes under a wrong implementation is a weak
tripwire.

- **Place a witness value _between_ events, not after them.** For an as-of / `--now`
  filter over time-ordered fixtures (e.g. events at 11:00 and 12:00), a `--now` of
  `11:30` (between) fails loud if the filter couples wrongly and drops an event; a
  `--now` after all events (e.g. `13:00`) passes green even under a broken filter.
- The general rule: choose the input that, under the most likely wrong
  implementation, produces a _different_ observable result from the correct one.

## Test Isolation

- Drive HTTP behaviour through the public request surface, never through a
  framework's private router internals.
- Extract repeated setup into scoped helpers inside `describe`.
- Bulk factories accept `startIndex`; do not mutate readonly `_id`.

### Related

- [Testing strategy directive][testing-strategy]
- [Testing TDD Recipes](./testing-tdd-recipes.md)

[testing-strategy]: ../../.agent/directives/testing-strategy.md
