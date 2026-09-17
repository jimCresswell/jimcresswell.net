---
classification: situational
description: Keep tests isolated from global-state mutation
trigger: surface:**/*.test.*,e2e/**/*
globs:
  - "**/*.test.*"
  - e2e/**/*
---

# No Global State Manipulation in Tests

Tests MUST NOT read or mutate global state. Prohibited in ALL tests
(unit, integration, AND E2E):

- `process.env.X` reads — inherit ambient shell state and hide missing DI seams
- `process.env.X = 'value'` — mutates global state, causes race conditions
- `vi.stubGlobal('fetch', ...)` — mutates global objects
- `vi.mock('module', ...)` — manipulates module cache, leaks between files
- `vi.doMock('module', ...)` — manipulates module cache, subtle race conditions

In-process tests also must not touch ambient `.env` files or `process.cwd()`.
Pass configuration as explicit function parameters. Simple fakes are injected
as constructor arguments, not complex mocks.

Smoke composition roots — the Vitest runner config or spawn invocation — may
read ambient env, validate it, and inject the result. Test files and setup files
must not read or mutate `process.env`.

Operationalises `.agent/directives/testing-strategy.md` §Rules (No ambient global state
access); the dependency-injection pattern is in `docs/engineering/testing-patterns.md`
§In-Process Tests with Dependency Injection.
