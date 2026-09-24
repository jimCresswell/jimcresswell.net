---
id: no-io-test-boundary-and-di-recovery
node_type: delivery
name: No-IO test boundary and dependency-injection recovery
overview: >-
  Bring every test in this estate to the no-IO invariant and the owner's
  2026-09-24 ruling: each offender is cured by injection or moved to
  validation, never exempted, and the IO lint rule refuses at error with no
  allow-list.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: best-of-each-practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-24
---

# No-IO test boundary and dependency-injection recovery

Authored 2026-09-24 by the exchange seat, with the alignment of `testing-strategy.md` to the
lineage. The concept is the lineage's plan of the same name; this node is this estate's own, and
`testing-strategy.md` §Philosophy points here.

## Goal

Every test proves the behaviour of product code and uses or creates no IO: no filesystem, network,
socket (loopback included), process spawn, clock or environment read, in the test or in any helper
it imports (owner, 2026-09-14 and 2026-09-15). No test constrains configuration or implementation
(owner, 2026-09-24: "no excemptions, strict, everywhere, all of the time"). What a test cannot prove
without IO is proven by a validator's self-proof run by a CI-gated task, or by an observation
recorded once.

## User groups and value

Every seat that reads a test's verdict: a green suite then means the product behaves, not that the
host's filesystem and process table did. Tests stay fast and deterministic on a shared host.

## The estate as it stands

Sized at `SHA: 32f81d80`, not yet classified:

- The ESLint rule `no-real-io-in-tests` runs at `warn`. It carries nine per-file allow-list entries
  (`tooling/eslint/src/configs/recommended.ts`) and a structural allow-list that admits IO under
  `test-helpers/**` and `test-fakes/**`. Both are exemptions, and the warning tier is itself a
  standing exemption.
- The spawning suites under `agent-tools/tests/`, the spawn-topology suite among them.
- `agent-tools/e2e-tests/collaboration-tui.e2e.test.ts`, an E2E check named as a test.
- The agent-tools smoke files under `agent-tools/smoke-tests/` and the site's Playwright suite under
  `jcdotnet/e2e/` are checks by definition; each is confirmed to run outside the test suites and
  from a CI-gated task.
- By grep, with overlaps: about 30 test files record calls, about 48 touch the filesystem and about
  30 spawn processes.

## Mechanism

1. **Inventory.** One row per offending file: its test level, IO kind, the product boundary that made
   IO seem necessary, and its cure class (use-case extraction with injected dependencies, a move to
   validation, or deletion when no behaviour is observable). No blank cells.
2. **Cure.** Each cure is a TDD cycle that lands green: the product gains the seam, and the test
   takes simple fakes as arguments. A proof that needs real IO moves to a validator or a recorded
   observation. Nothing is exempted.
3. **Enforce.** `no-real-io-in-tests` goes to `error` in the same landing as the last offender's
   cure, and its allow-list mechanism, per-file and structural, is deleted.

## Acceptance criteria (each with a proof)

1. The inventory has a row for every offender and no blank cell. Proof: the table in this node,
   recomputed from the grep at its commit.
2. `no-real-io-in-tests` is at `error` with no allow-list option and no structural patterns. Proof:
   the lint leg of the gate, and a fixture outside the suites that the rule refuses.
3. No test file imports a filesystem, process, network or clock module. Proof: the lint rule.

## Out of scope

- The lineage's own estate; its seat runs its own recovery under the same name.
- Checks that already run outside the test suites, other than confirming how they are reached.
