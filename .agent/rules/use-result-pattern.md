---
classification: situational
description: Use Result<T, E> for error handling. Never throw exceptions.
trigger: surface:source-authoring
globs:
  - "**/*.{ts,tsx,mts}"
---

# Use Result Pattern

Use `Result<T, E>` for error handling. Never throw exceptions. Errors are part of the type signature, and the compiler rejects a read of `value` or `error` until `ok` is checked; handling the failure is the caller's job. Handle all cases explicitly.

When a constructed error **must** leave a boundary (e.g. at a trust
edge, a library surface that cannot return `Result`, or inside a
`catch` block re-expressing a caught error), attach `{ cause }` so
the causal chain is preserved. ESLint core's built-in
[`preserve-caught-error`](https://eslint.org/docs/latest/rules/preserve-caught-error)
rule (ESLint 9.35.0+, with `requireCatchParameter: true`) is the mechanical
check for this. The rule catches missing cause,
cause-mismatch against a different variable, destructured-parameter
loss, and variable shadowing. Legitimate pass-through cases use the
standard `// eslint-disable-next-line preserve-caught-error --
<reason>` comment (composes with `@engraph/no-eslint-disable`,
which requires a reason).

The `Result` type and its helpers live in `@engraph/result` (`tooling/result/`);
see its README. Enforcement: `@engraph/no-throw-statement` exists in
`@engraph/eslint` and is switched off in this repository by owner ruling
(2026-09-12); until the owner re-enables it, reviewers carry this rule.
