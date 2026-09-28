---
classification: situational
description: Do not leave skipped tests in the tree
trigger: surface:test-authoring — tests, e2e specs and the Vitest and Playwright configs
globs:
  - "**/*.test.*"
  - jcdotnet/e2e/**/*
  - agent-tools/e2e-tests/**/*
  - "**/vitest*.config*.ts"
  - jcdotnet/playwright.config.ts
---

# No Skipped Tests

Do not leave `it.skip`, `describe.skip`, or any other skipped-test mechanism in the tree. If a test
cannot stand as a real proof, fix it or delete it.

See `.agent/directives/testing-strategy.md` for the full policy.
