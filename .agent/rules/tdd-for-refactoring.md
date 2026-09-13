# TDD for Refactoring

Refactoring is not an exception to TDD. Prove the current or intended behaviour
first, then refactor with green tests preserving that behaviour; if the proof
is missing, add or repair it before changing implementation.

For refactoring that changes signatures: update test call sites FIRST. Compiler
errors from signature changes are the RED phase for signature refactors — they
prove the tests reference the new contract before the implementation exists.

See `.agent/directives/testing-strategy.md` and
`.agent/directives/tdd-as-design.md`.
