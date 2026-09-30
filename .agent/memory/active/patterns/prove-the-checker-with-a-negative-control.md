---
name: Prove the Checker With a Negative Control
polarity: pattern
use_this_when: A new validator, guard, lint rule, harness comparison or schema check is about to be declared working because it passes on the current tree — before that, make it fail on the failure it exists to catch
category: testing
proven_in: jcdotnet/visual-regression-harness (an isolated temporary repository from `git archive` plus a deliberate visual change) and the schema-dts guard's red phase (the historical failure re-added), 2026-03-08
proven_date: 2026-03-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A checker that passes on a healthy tree is declared working without ever having been shown to fail, so a silently vacuous check (wrong glob, wrong exit code, wrong comparison) ships green and guards nothing"
  stable: true
---

## Principle

A checker earns its verdict by failing on the thing it checks for. Passing on the current
tree proves only that the tree is healthy or the checker is blind, and the two look the same
from outside. So every new checker is proved with a negative control before it is trusted: a
deliberate instance of the failure it exists to catch, run through the checker, refused. This is
the checker-level form of the guard-level rule in `validation-strategy` §Prove the guard bites
(a mutant applied in place to product code); the difference is that a checker's negative control
often needs its own isolated fixture, because the failure cannot be introduced safely into the
live repository.

## Shape

1. **Name the failure the checker exists to catch**, in one sentence, before writing the
   checker. If the sentence cannot be written, the checker has no claim to prove.
2. **Build the control where the failure can exist safely.** For a repository-level checker
   (a visual harness, a link validator, a portability check), that is an isolated temporary
   repository made from `git archive` of the current tree with the failure introduced by hand.
   For a guard over generated output (a schema-dts type guard), it is the historical failure
   re-added to a fixture. For a lint rule, it is a fixture file the rule must refuse.
3. **Run the checker on the control and read the refusal**, not just the exit code: the
   message names the failure the checker was written for, at the location the control put it.
4. **Then run it on the healthy tree** and read the pass. Only now is the checker's verdict
   evidence.
5. **Keep the control** where the checker can be re-proved after each change to it: a fixture
   beside the checker, or the recipe for the isolated repository in the checker's README.

## Worked instances

- **The visual-regression harness (2026-03-08).** The harness was proved by making a
  temporary repository from `git archive`, introducing a deliberate visual change, and reading
  the harness refuse it, before any claim that the harness detects rendering drift. The README
  records the recipe.
- **The schema-dts guard (2026-03-08).** The red phase re-added the historical failure the
  guard was written to prevent; the guard refused it; then the fix landed and the guard passed.
- **The register's own admission example.** The pending-graduations register's worked shape
  for what belongs on it named this pattern as stable across three instances with no file yet;
  this file is its home (graduated 2026-09-30).

## Relationship

- `validation-strategy` §Prove the guard bites: the guard-level form, a mutant in place; this
  pattern is the checker-level form with an isolated control.
- `tests-prove-behaviour-no-exemptions`: a test that cannot fail proves nothing; the same
  invariant one level up.
- `compute-dont-hope`: a checker's coverage is computed by running it on a known failure, not
  assumed from its source.
