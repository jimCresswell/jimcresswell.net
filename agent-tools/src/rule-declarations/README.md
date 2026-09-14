# Rule declarations

A canonical rule under `.agent/rules/` declares how it is loaded and what it is for in its
frontmatter (`classification`, `description`, `trigger`, `globs`). The declaration is intended
as the one source for the rules index, the Cursor triggers and the pointer adapters
(`compute-dont-hope`); the generator that derives them from it is the next change, and until
it lands those projections stay hand-kept. This module owns the declaration type and the sweep
that minted the declarations from the surfaces that carried them by hand before.

- [`rule-declaration.ts`](rule-declaration.ts) — the closed declaration shape.
- [`parse-rules-index.ts`](parse-rules-index.ts), [`parse-cursor-trigger.ts`](parse-cursor-trigger.ts),
  [`parse-claude-rule-adapter.ts`](parse-claude-rule-adapter.ts) — readers for the three
  hand-kept sources, over the line-based [`frontmatter-lines.ts`](frontmatter-lines.ts) reader
  the platforms' own tolerance requires.
- [`reconcile-rule-declaration.ts`](reconcile-rule-declaration.ts) — the most-specific-wins
  rule for sources that disagree, every reconciliation returned for listing.
- [`render-rule-frontmatter.ts`](render-rule-frontmatter.ts),
  [`render-reconciliation-report.ts`](render-reconciliation-report.ts) — the block a rule
  carries and the table a pull request lists.
- [`sweep-rule-frontmatter.ts`](sweep-rule-frontmatter.ts), its name boundary
  [`rule-name.ts`](rule-name.ts) (a rule is addressed by its basename alone, and an index row
  naming no swept rule refuses the sweep; either way before any rule path is built), its projection
  reader [`rule-projections.ts`](rule-projections.ts) (the Cursor trigger and the Claude
  adapter, read and parsed together; an already-declared rule still needs both), its
  file-system port [`sweep-fs.ts`](sweep-fs.ts) (regular files only; a link is never read or
  written through; the one admitted read) and its entry
  [`rule-frontmatter-sweep.ts`](rule-frontmatter-sweep.ts) — the all-or-nothing sweep over the
  tracked rules; `pnpm --filter @engraph/agent-tools rule-frontmatter-sweep [--write]`.

The sweep is a transplant instrument: a host that arrives with a hand-kept index and triggers
runs it once to mint its declarations, then the generator owns the projections.
