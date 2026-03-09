# ADR-018: Practice-context adjunct for plasmid exchange

## Status

Accepted

## Date

2026-03-09

## Context

The Practice Core now travels as a stable six-file package in
`.agent/practice-core/`: the trinity, two entry points, and a changelog. That
package must stay portable, self-contained, and slow-changing.

In real exchange work, the changelog is often enough to explain _what_ changed
but not _why_ those changes mattered locally. Some transfers benefit from a
small amount of extra context: local pressures, false starts, repo-specific
adaptations, or the outcome-impact-value framing behind recent Practice
evolution.

Putting that extra material into the Core would dilute portability and make the
Core carry local rationale that is not meant to become universal doctrine.
Leaving it only in ephemeral chat loses the most reusable part of the lesson.

## Decision

Keep the six-file Practice Core as the canonical portable package.

Allow an optional adjacent directory, `.agent/practice-context/`, to support
Practice exchange when extra context is useful.

Rules:

1. `.agent/practice-context/` is **not** part of the Core.
2. `outgoing/` holds sender-maintained explanatory material and may accumulate
   over time.
3. Relevant outgoing files may be copied into a receiving repo's `incoming/`
   area for one exchange.
4. `incoming/` is transient and should be cleared after integration.
5. The directory carries explanation, not doctrine. Canonical settled rules
   still belong in the Core, directives, ADRs, README files, or other
   permanent docs.
6. If a change is significant enough to enter the practice-core changelog,
   agents should consider whether a supporting outgoing note or report would
   help a receiving repo understand it.

Recommended outgoing contents:

- evolution rationale
- local adaptations that should not be copied blindly
- false starts and corrections worth reusing elsewhere

## Consequences

- The Core stays small, portable, and self-contained.
- High-signal exchange-specific rationale can travel without being mistaken for
  permanent doctrine.
- Receiving repos get a clearer explanation of local pressures and trade-offs
  behind recent Practice evolution.
- Sender repos gain a small maintained support surface outside the Core.
- Receiving repos gain a transient incoming surface that must be cleared after
  integration.
- If the context directory is allowed to grow unchecked, it recreates the same
  portability problem it was meant to avoid. It must stay small and disposable.

## Related

- [ADR-012: Agent memory pipeline](012-agent-memory-pipeline.md)
- [ADR-015: Codex adapter model](015-codex-adapter-model.md)
