# Rule declarations

A canonical rule under `.agent/rules/` declares how it is loaded and what it is for in its
frontmatter (`classification`, `description`, `trigger`, `globs`). The declaration is the one
source for the rules index, the Cursor triggers and the Claude and `.agents` adapters
(`compute-dont-hope`): `pnpm portability:fix` renders them from it and `pnpm portability:check`
recomputes them byte for byte, so none is ever edited by hand. This module owns the
declaration shape, its reader, the renderers, the drift check, and the sweep that minted the
declarations from the surfaces that carried them by hand before.

- [`rule-declaration.ts`](rule-declaration.ts) — the closed declaration shape;
  [`read-rule-declaration.ts`](read-rule-declaration.ts) reads it from a rule's frontmatter.
- [`render-rule-projections.ts`](render-rule-projections.ts) — the index and the three
  adapters as pure functions of the declarations, each platform's documented shape;
  [`rule-projection-drift.ts`](rule-projection-drift.ts) — missing, drifted and stale
  projections against the surfaces. The portability validator's
  `rule-projection-validation.ts` wires them into `portability:check` and `portability:fix`.
- [`parse-rules-index.ts`](parse-rules-index.ts), [`parse-cursor-trigger.ts`](parse-cursor-trigger.ts),
  [`parse-claude-rule-adapter.ts`](parse-claude-rule-adapter.ts) — readers for the three
  hand-kept sources, over the line-based [`frontmatter-lines.ts`](frontmatter-lines.ts) reader
  the platforms' own tolerance requires.
- [`reconcile-rule-declaration.ts`](reconcile-rule-declaration.ts) — the most-specific-wins
  rule for sources that disagree, every reconciliation returned for listing.
- [`render-rule-frontmatter.ts`](render-rule-frontmatter.ts),
  [`render-reconciliation-report.ts`](render-reconciliation-report.ts) — the block a rule
  carries and the table a pull request lists.
- [`sweep-rule-frontmatter.ts`](sweep-rule-frontmatter.ts) and its entry
  [`rule-frontmatter-sweep.ts`](rule-frontmatter-sweep.ts) — the all-or-nothing sweep over the
  tracked rules; `pnpm --filter @engraph/agent-tools rule-frontmatter-sweep [--write]`.

The sweep is a transplant instrument: a host that arrives with a hand-kept index and triggers
runs it once to mint its declarations, then the generator owns the projections.
