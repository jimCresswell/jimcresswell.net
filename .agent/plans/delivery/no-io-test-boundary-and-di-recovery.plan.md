---
id: no-io-test-boundary-and-di-recovery
node_type: delivery
name: No-IO test boundary and dependency-injection recovery
overview: >-
  Bring every test in this estate to the no-IO invariant and the owner's
  2026-09-24 ruling: each offender is cured by injection or moved to
  validation, never exempted, and an IO lint rule with no allow-list refuses
  IO in every test, helper and setup file of every workspace.
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
lineage. The concept is the lineage's plan of the same name; this node is this estate's own.

## Goal

Every test proves the behaviour of product code and uses or creates no IO: no filesystem, network,
socket (loopback included), process spawn, clock or environment read, in the test or in any helper
it imports (owner, 2026-09-14 and 2026-09-15). No test constrains configuration or implementation
(owner, 2026-09-24: "no excemptions, strict, everywhere, all of the time"). What a test cannot prove
without IO is proven by a validator's self-proof run by a CI-gated task, or by an observation
recorded once.

## User groups and value

Every seat that reads a test's verdict: a green suite then means the product behaves, not that the
host's filesystem, clock and process table did. Tests stay fast and deterministic on a shared host.

## The estate as it stands

Measured at `SHA: 32f81d80`, not yet classified per file.

**The census.** 454 in-suite test files (every `*.test.ts` and `*.test.tsx` outside
`jcdotnet/e2e/`), counted by the patterns in the script below, run from the repository root. The
census sizes the work; it greps raw text, so the IO rule's own tests, which carry banned imports as
string fixtures, keep it above zero, and it is never the acceptance proof:

```bash
C=32f81d80
files=$(git ls-tree -r --name-only "$C" | grep -E '\.test\.tsx?$' | grep -v '^jcdotnet/e2e/')
count() { printf '%s\n' "$files" | while read -r f; do git show "$C:$f" | grep -q -E "$1" && echo "$f"; done | grep -c .; }
count "from ['\"]node:fs|node:fs/promises|mkdtemp|tmpdir\("                  # 21 filesystem
count "node:child_process|\bspawn\(|execFile|execa"                            # 9 process spawn
count "node:net|node:http|\blisten\(|fetch\(['\"]https?://(localhost|127\.0\.0\.1)"  # 2 socket
count "Date\.now\(|new Date\(\)|performance\.now\(|setTimeout\(|setInterval\(" # 13 clock or timer
count "toHaveBeenCalled|toHaveBeenNthCalledWith|\.mock\.calls|\bcalls\)\.to|calls\.length|\bcalls\[" # 23 call inspection
count "sentinel: re-adjudicate"                                                # 1 literal content pin
count "test-helpers/(repo-doc|context-cost-fixture|temp-substrate-repo|skills-repo-sandbox|agent-identity-doc|depcruise-fixture|rules-index-classification-fixtures|temp-collaboration-state)" # 27 IO helpers
```

27 test files, 2 of them also counted above, do filesystem IO through eight helper modules they
import:
`repo-doc.ts`, `context-cost-fixture.ts`, `temp-substrate-repo.ts`, `skills-repo-sandbox.ts`,
`agent-identity-doc.ts`, `depcruise-fixture.ts`, `rules-index-classification-fixtures.ts` and
`temp-collaboration-state.ts`, each under a `test-helpers/` directory in `agent-tools`.

**Named offenders.**

- The site's integration tests with real IO: `jcdotnet/scripts/built-site-server.integration.test.ts`
  (a socket, a loopback `fetch`, timers), `jcdotnet/scripts/e2e-global-setup.integration.test.ts`
  (`mkdtemp`, spawn, timers), and `command-output`, `compare` and `export-ref` under
  `jcdotnet/visual-regression-harness/` (spawn, filesystem). `jcdotnet/components/site-footer`
  reads the clock and `site-header` uses `vi.mock`.
- Tests whose TSDoc claims a spawn shape the doctrine no longer admits:
  `agent-tools/tests/merge-bot.git-executor-stdio.integration.test.ts`,
  `merge-bot.read-env-child.integration.test.ts`,
  `repo-check-runtime.spawn-topology.integration.test.ts` and
  `jcdotnet/visual-regression-harness/command-output.integration.test.ts`, with their helper
  `jcdotnet/test-helpers/exit-before-writing.ts`.
- `agent-tools/tests/depcruise-boundary-rules.integration.test.ts` and its helper
  `depcruise-fixture.ts` build a temp tree on disk, and their TSDoc cites the spawning rule's old
  heading.
- `agent-tools/e2e-tests/collaboration-tui.e2e.test.ts` imports product code and runs in process
  with injected fakes: an integration test under an E2E name, cured by a rename.
- `agent-tools/src/merge-bot/merge-cli.integration.test.ts` pins two literal messages, each marked
  "A6 sentinel: re-adjudicate amendment A6": content pins, which the doctrine no longer admits.
  The cure proves the behaviour the messages carry, or drops the pins.

**The enforcement gaps.** The rule `@engraph/no-real-io-in-tests`
(`tooling/eslint/src/rules/no-real-io-in-tests.ts`) runs at `warn`, which every workspace that
loads it fails through `--max-warnings 0`. Its gaps are these:

- a per-file allow-list of nine entries (`tooling/eslint/src/configs/recommended.ts`), whose ninth
  recorded reason cites an `mkdtemp` mandate the doctrine no longer carries;
- a structural allow-list admitting `test-helpers/`, `test-fakes/` and the Vitest configuration
  files, pinned by `tooling/eslint/src/configs/strict.unit.test.ts`;
- a `fetch` allowance for `localhost` and `127.0.0.1` URLs, which lets a test open a loopback
  socket;
- no clock detection, and no `node:process`, `tls`, `http2`, `dns`, `os` or `execa` in its banned
  list;
- a trigger that matches test files only, so helpers and setup files are never linted, whatever the
  allow-list says;
- a trigger that also matches the site's `*.e2e-ui.test.ts` and `*.e2e-api.test.ts` checks, which
  legitimately use IO;
- no reach into the site: `jcdotnet/eslint.config.ts` does not load the plugin.

**Text that still teaches the old model outside the doctrine.**

- `tooling/workspace-config/src/vitest.e2e.config.base.ts` and `no-network.setup.ts`.
- The rule's own examples (a valid localhost `fetch`, `import.meta.dirname` anchoring, MSW).
- `jcdotnet/eslint.config.ts`'s `vi.mock` advice.
- `.agent/reference/shell-and-tooling-gotchas.md`'s loopback helper and
  `.agent/reference/tooling.md`'s Supertest entry.
- "E2E tests" wording in `CONTRIBUTING.md`, `docs/engineering/workflow.md`,
  `jcdotnet/e2e/README.md`, `docs/engineering/testing-tdd-recipes.md` and the config-expert
  template.

## Mechanism

1. **Inventory.** One row per offending file: its level, IO kind, the product boundary that made IO
   seem necessary, and its cure class (use-case extraction with injected dependencies, a move to
   validation, a rename, or deletion when no behaviour is observable). No blank cells.
2. **Cure.** Each cure is a TDD cycle that lands green: the product gains the seam, and the test
   takes simple fakes as arguments. A proof that needs real IO moves to a validator or a recorded
   observation. Nothing is exempted.
3. **Widen and harden the rule**, in the landing that cures the last offender:
   - its trigger covers every test, helper and setup file;
   - checks leave its scope by location (`jcdotnet/e2e/`, `smoke-tests/`), never by an allow-list,
     and a companion refusal rejects any file there that imports product code and runs it in
     process, so location alone never exempts a test;
   - it detects clock reads and the missing modules;
   - the localhost `fetch` allowance and both allow-lists are deleted;
   - it runs at `error`;
   - the site's lint loads it.

## Acceptance criteria (each with a proof)

1. The inventory has a row for every offender and no blank cell. Proof, `repo-safe`: the table in
   this node, recomputed by the census script at its commit.
2. The rule is at `error`, with no allow-list option, no structural patterns and no localhost
   allowance, and it lints every workspace's tests, helpers and setup files; a file in a check
   location that runs product code in process is refused. Proof, `repo-safe`: the
   lint leg of the gate over the whole tree, and fixtures the rule refuses.
3. No test, helper or setup file uses a filesystem, process, network or clock API. Proof,
   `repo-safe`: the widened rule over the whole tree, and the inventory with no offender left.

## Estate status

A local gap: this is this estate's own recovery. The doctrine it serves is an exchange item, and
the lineage runs its own recovery under the same name.

## Out of scope

- The lineage's own estate.
- Checks that already run outside the test suites, other than confirming how they are reached.
