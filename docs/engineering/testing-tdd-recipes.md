---
fitness_line_target: 350
fitness_line_limit: 500
fitness_char_limit: 28000
fitness_line_length: 100
fitness_doc_kind: recipe
split_strategy: 'Split recipes by test level if this grows past 500 lines'
---

# Testing TDD Recipes

This is the worked-example companion to
[Testing Strategy](../../.agent/directives/testing-strategy.md). The strategy
is the authoritative doctrine; this file shows how to apply the doctrine at
unit, integration, and E2E levels.

> **Recipe document.** This is a recipes file. Recipes carry higher
> fitness limits than policies/directives because their value scales with
> worked examples, but the contract is reciprocal: the table of contents
> below MUST stay current with every section heading. Adding or removing a
> section without updating the ToC is a breach of the recipe contract.

## Table of Contents

- [TDD At All Levels](#tdd-at-all-levels)
  - [Unit Test TDD](#unit-test-tdd)
  - [Integration Test TDD](#integration-test-tdd)
  - [E2E Check TDD](#e2e-check-tdd)
- [Rule Summary](#rule-summary)
- [Red Specs And File Naming](#red-specs-and-file-naming)
  - [Validate Test Discovery](#validate-test-discovery)
- [Common Violations And Fixes](#common-violations-and-fixes)
  - [Writing Code Before Tests](#writing-code-before-tests)
  - [Updating E2E Checks After Implementation](#updating-e2e-checks-after-implementation)
  - [Tests That Only Pass With The Current Implementation](#tests-that-only-pass-with-the-current-implementation)
  - [Adding To Existing IO Debt In A Unit Test File](#adding-to-existing-io-debt-in-a-unit-test-file)
  - [Validator Script vs Integration Test](#validator-script-vs-integration-test)
- [Lessons From Review Rounds](#lessons-from-review-rounds)

## TDD At All Levels

TDD applies to unit tests, integration tests and E2E checks (an E2E check
drives a running system and is a validation surface, not a test). Each level
specifies the desired behaviour before implementation changes at that same
level.

### Unit Test TDD

Cycle: Red, Green, Refactor.

1. Red: write a unit test for a pure function that does not exist yet. Run it;
   it must fail.
2. Green: write the minimal implementation. Run the test; it must pass.
3. Refactor: improve the implementation without changing behaviour. The test
   stays green.

Example:

```typescript
// 1. Red: write the test first.
describe('calculateTotal', () => {
  it('sums array of numbers', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});
// Run test -> fails because calculateTotal does not exist.

// 2. Green: minimal implementation.
function calculateTotal(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0);
}
// Run test -> passes.

// 3. Refactor if needed; the test stays green.
```

### Integration Test TDD

Cycle: Red, Green, Refactor.

1. Red: write an integration test specifying how code units work together. Run
   it; it must fail.
2. Green: implement the units and wiring. Run it; it must pass.
3. Refactor: improve integration without changing behaviour.

Example:

```typescript
// 1. Red: write the integration test first.
describe('createProfileLinks', () => {
  it('returns the sameAs URLs of the person the loader supplies', async () => {
    const loadPerson = async () => ({ sameAs: ['https://github.com/jimCresswell'] });
    const links = createProfileLinks({ loadPerson });

    const urls = await links.profileUrls();

    expect(urls).toEqual(['https://github.com/jimCresswell']);
  });
});
// Run test -> fails because createProfileLinks does not exist.

// 2. Green: implement the integration point.
export function createProfileLinks(options: ProfileLinksOptions) {
  return {
    async profileUrls(): Promise<readonly string[]> {
      const person = await options.loadPerson();
      return person.sameAs;
    },
  };
}
// Run test -> passes.
```

### E2E Check TDD

E2E checks specify system behaviour. When system behaviour changes, update the
E2E check first and run it against the old system to prove the red phase.

Example:

```typescript
// Scenario: the CV PDF route must serve a real PDF with immutable caching.
test.describe('REQ-07: PDF response correctness', () => {
  test('GET /cv/pdf returns application/pdf with the download filename', async ({ request }) => {
    const response = await request.get('/cv/pdf');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/pdf');
    expect(response.headers()['content-disposition']).toContain('Jim-Cresswell-CV.pdf');
  });

  test('PDF response has immutable cache headers', async ({ request }) => {
    const response = await request.get('/cv/pdf');

    expect(response.headers()['cache-control']).toContain('immutable');
  });
});
// Run E2E check -> fails while the old route handler serves the file without the cache header.
// Implement the route handler change, then rerun -> passes.
```

Wrong sequence:

```typescript
// 1. Implement new behaviour first.
// 2. Run E2E checks; they fail because they specify old behaviour.
// 3. Update E2E checks after implementation.
```

The check became a regression patch, not a specification.

## Rule Summary

| Level       | Specifies                   | Write Before             | Red Phase       |
| ----------- | --------------------------- | ------------------------ | --------------- |
| Unit        | Pure function behaviour     | Before function exists   | No function     |
| Integration | Code units working together | Before units are wired   | Units not wired |
| E2E         | System behaviour            | System behaviour changes | Old behaviour   |

If tests or checks lag behind code at any level, TDD was not followed at that level.

## Red Specs And File Naming

Write red-phase specs that describe not-yet-implemented system behaviour in
`*.e2e.test.ts` files (the site's suite uses `*.e2e-ui.test.ts` and
`*.e2e-api.test.ts`), not `*.unit.test.ts` files. The pre-commit hook is light
(formatting, markdown, and lint on the changed workspaces), so a red in-process
spec can be committed on a branch; the pre-push hook runs `pnpm check`
(which includes the `test` task) plus the site's `test:e2e`, and CI runs the
same set, so every spec must be green before push/merge unless the owner
explicitly authorises staged WIP.

### Validate Test Discovery

A passing focused test command is only evidence if it actually discovered the
intended spec file. When adding or renaming tests, read the command output as
well as the exit code. If a workspace can exit 0 with no discovered tests, add
`--passWithNoTests=false` to the focused Vitest command or use the workspace's
checked test script.

For agent-tools and `tooling/*` tests, the shared Vitest base config
(`@engraph/workspace-config`) discovers `src/**/*.test.ts`, `src/**/*.spec.ts`,
`tests/**/*.test.ts` and `tests/**/*.spec.ts`, where a `*.unit.test.ts` file
matches because `*.test.ts` matches it. The site's Vitest discovers only
`**/*.unit.test.ts` and `**/*.integration.test.{ts,tsx}` outside `e2e/`, and
Playwright reads only `e2e/`, so a site test outside `e2e/` without one of
those suffixes runs under neither runner. knip takes its site test entries from
the same include, so it lists such a file under "Unused files" and `pnpm check`
fails; the cure is the class suffix, never a knip ignore or deleting the test.
A file elsewhere in the tree, or with another suffix, is not evidence unless
the include pattern names it.

## Common Violations And Fixes

### Writing Code Before Tests

Wrong:

```typescript
function add(a: number, b: number) {
  return a + b;
}

it('adds numbers', () => expect(add(1, 2)).toBe(3));
```

Correct:

```typescript
it('adds numbers', () => expect(add(1, 2)).toBe(3));
// Run -> fails because add does not exist.

function add(a: number, b: number) {
  return a + b;
}
// Run -> passes.
```

### Updating E2E Checks After Implementation

Wrong:

```typescript
// 1. Implement new feature.
// 2. Run E2E checks; they fail because they specify old behaviour.
// 3. Update E2E checks to match implementation.
```

Correct:

```typescript
// 1. Update E2E checks to specify new behaviour.
// 2. Run E2E checks; they fail because the feature is absent.
// 3. Implement the feature.
// 4. Run E2E checks; they pass.
```

### Tests That Only Pass With The Current Implementation

Wrong:

```typescript
it('calls internal method', () => {
  const spy = vi.spyOn(service, '_privateMethod');
  service.doThing();
  expect(spy).toHaveBeenCalled();
});
```

Correct:

```typescript
it('produces the expected result', () => {
  const result = service.doThing();
  expect(result).toBe(expectedValue);
});
```

The correct test survives refactoring because it proves behaviour, not the
private route to that behaviour.

### Adding To Existing IO Debt In A Unit Test File

Existing IO in a `*.unit.test.ts` file is **not** licence to add more.
The unit-test taxonomy ([Testing
Strategy](../../.agent/directives/testing-strategy.md) §Test Types)
fixes the contract: pure, in-process, mock-free, no IO. A
historically non-conformant file is a known gap, not a permission
slip. When new behaviour you want to prove unit-style touches IO,
the move is to **factor the pure logic out and unit-test the
extract** — not to grow the IO fixture in place.

Wrong shape (IO debt grows under the precedent argument):

```typescript
// some-thing.unit.test.ts (already imports fs and runs against the
// real repo file system; "everyone else does it here so I will too")
it('rejects malformed config', () => {
  const config = JSON.parse(readFileSync('agent-tools/fixtures/bad-config.json', 'utf8'));
  expect(parseConfig(config)).toEqual({ ok: false, error: 'malformed' });
});
```

Correct shape (factor the pure parser; unit-test the extract):

```typescript
// agent-tools/src/core/parse-config.ts (pure)
export function parseConfig(input: unknown): ParseConfigResult {
  /* ... */
}

// agent-tools/src/core/parse-config.unit.test.ts (unit, no FS)
it('rejects malformed config', () => {
  expect(parseConfig({ foo: 'bar' })).toEqual({ ok: false, error: 'malformed' });
});
```

Walking around the file's existing debt with one more violation
makes the next refactor harder; routing the new proof to a pure
extract makes the next refactor land that pure extract for free.
Local precedent is not a TDD authority; the test-type taxonomy is.

### Validator Script vs Integration Test

Per [Testing Strategy §Rules](../../.agent/directives/testing-strategy.md#rules):
_validation scripts that require external resources should be standalone
scripts, not tests_. A vitest file that walks the real repo file system
and asserts a property of repo state is running a validator, not testing
code behaviour. The vitest harness carries pre-commit gating semantics
that do not match what the file is actually doing.

Wrong shape (validator wearing a vitest harness):

```typescript
// agent-tools/src/validators/portability/validate-portability.integration.test.ts
it('every canonical skill has a Claude adapter', () => {
  const skills = readdirSync('.agent/skills');
  for (const skill of skills) {
    expect(existsSync(`.claude/skills/${skill}`)).toBe(true);
  }
});
```

Correct shape — pure helper unit-tested + standalone runtime script:

```typescript
// agent-tools/src/validators/portability/portability-checks.ts (helper, pure)
export function adapterMissingFor(canonical: readonly string[], adapters: readonly string[]) {
  return canonical.filter((slug) => !adapters.includes(slug));
}

// agent-tools/src/validators/portability/portability-checks.unit.test.ts (unit test, no FS)
it('reports canonical skills with no adapter', () => {
  expect(adapterMissingFor(['a', 'b'], ['a'])).toEqual(['b']);
});

// agent-tools/src/validators/portability/validate-portability.ts (runtime script wired into a workspace command)
const missing = adapterMissingFor(await listCanonicalSkills(), await listClaudeAdapters());
if (missing.length > 0) {
  console.error(`Missing: ${missing.join(', ')}`);
  process.exit(1);
}
```

Structural cue: if the test body is `readdirSync` / `existsSync` /
`readFileSync` over real repo paths and assertions are about repo state
(not function output), it belongs in a validator owned by the workspace or
package that owns the contract being validated, such as
`agent-tools/src/validators/` (each wired to a `validate-*` script in
`agent-tools/package.json`), not in the test runner. "Look at peers" is a
useful first orientation, but peers can be drift — the canonical-pattern test
is _named guidance in the directives_, not the count of similar sibling files.

## Lessons From Review Rounds

Each line is a lesson from the review of a test that had passed its gates.

- **A fake that branches on an incidental argument is call inspection.** A test whose fake
  read a dry run's argv to choose what to print was deleted: the flag was a detail of how the
  product called the tool, not contract data flowing through the seam, which is the only kind
  of parameter the testing strategy admits a parametric fake for. The flag is guaranteed by
  construction and proven by one observation of the real tool.
- **A test pins the estate's behaviour, never the runtime's.** A case that passed only because
  `localeCompare` handles a non-BMP character on one Node version pinned the implementation
  and was removed. Two assertions on Node's own `TypeError` became assertions on the helper's
  contract. A smoke asserts the estate's operator-facing messages, never a library's.
- **A surviving mutant whose change has no observable effect marks dead code**: a deletion
  candidate before it is a missing test.
- **A mutant can survive because an earlier layer answers first.** Dropping an empty-token
  backstop survived until the token mint became an injected port: the mint's own schema had
  rejected the empty token before the backstop ran.
- **Ported tests are reviewed as tests.** Tests carried byte-for-byte from the other estate
  were routed away from test review at open and still drew four blocking findings (two
  expect-then-if, an assertion on a query log, a branching mock). A port inherits its
  source's test gaps.
- **Green gates, killed mutants and byte parity are not evidence of test quality.** Asked why
  four test pull requests were weak, the seat that wrote them named: no test-expert review,
  directives not re-read at resume, those three signals taken as quality, copied patterns,
  and a pace it had set itself.
- **Prove a CLI topic's routing by its help.** Run `<topic> --help` through the unified entry
  point and expect the topic's own help text. The test fails when the topic's map entry is
  removed, which an assertion on the usage list does not catch.
- **An eval judge reads assertions literally.** State a fixture's expected outcome in
  observable terms (what the record must contain), never in the method's vocabulary, and
  make each prompt self-contained: an empty workspace cannot hold the material a prompt
  refers to.
- **A fake never answers in sequence, and a fake clock is never keyed to a count of the
  product's reads.** Either one asserts how often the product asked. Move the proof to the seam
  where the state is a constant, or change the world on what the product writes (2026-10-01:
  a test review found guard tests whose fake counted the product's questions, after two rounds
  of vendor review had passed them).
- **When the doctrine refuses the test you want, ask where the property lives.** A property no
  admissible fake can observe (one token for every attempt) is carried by the structure: a type,
  or the place of a call. Where an outcome depends on a port not being reached, a fake of that
  port that fails is the probe: reaching it turns the outcome into a failure the test reads at
  the boundary (2026-09-29).
- **One property test for a class of leak.** A renderer meant to print by allowlist is tested
  with a nonce at every position and shape of its input: no character of it appears unless its
  token is in the closed vocabulary. Six leaks found one per review round were one class; the
  second instance of a class is the signal to write the structural test before the third cure
  (2026-09-27).
- **A test that fails under load is a measurement first.** Read the host's load and run what
  the test measures before widening its bound: a watcher smoke's ten-second exit failed under
  host load and passed on one retry after two load readings (2026-09-24). A bound widened to
  quiet one failure hides the next.
