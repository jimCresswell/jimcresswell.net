---
title: 'Strategy'
type: strategy
doc_role: index
status: ratified
last_updated: 2026-09-13
audience: 'The owner (decide) and every seat on the repository (build)'
---

# Strategy

> **A living strategy.** Four streams, authored at the plan-node migration (2026-09-13)
> from the owner's word on the cards of that day — "eventually I expect that the site and
> Practice will be relatively stable and the content and graphs will be the priority.
> Ultimately this is my CV, the content is what matters" — and from the intent the legacy
> plan corpus carried; ratified on cards the same day (the platform stream split into the
> site and the Practice at ratification). This README is the stable index; the detail lives
> in the stream files.

## In one line

**The CV is the product; the graph is how it is known; the site and the Practice are the
stable ground both stand on, each kept provable in its own stream.**

## The streams

| Stream              | File                                                   | Choice IDs   | Priority                               |
| ------------------- | ------------------------------------------------------ | ------------ | -------------------------------------- |
| The content         | [stream-content.md](stream-content.md)                 | `CONTENT-*`  | First — the CV is the product          |
| The knowledge graph | [stream-knowledge-graph.md](stream-knowledge-graph.md) | `GRAPH-*`    | With the content — how the CV is known |
| The site            | [stream-site.md](stream-site.md)                       | `SITE-*`     | Stable ground, kept provable           |
| The Practice        | [stream-practice.md](stream-practice.md)               | `PRACTICE-*` | Stable ground, kept current and closed |

## Strategic choices (the traceability spine)

Every plan in the estate traces to a **strategic choice** here: each strategic node serves
exactly one published choice, and each delivery plan or runbook serves one strategic node,
inheriting its upward trace. The choices are an enumerable, stable set with IDs; the ID
contract (stable, additive, resolvable), the typed `serves` field and the validator are the
[plan-node schema](../plan-node-schema.md)'s. The validator recomputes the registry from
this README's families and the concrete IDs the stream files publish.

## Open decisions

| Decision                                   | Owner | Status / note                                                                 |
| ------------------------------------------ | ----- | ----------------------------------------------------------------------------- |
| The streams and their names                | Owner | **Settled 2026-09-13** — four streams; the platform split into site and Practice |
| The choices per stream                     | Owner | **Ratified 2026-09-13** with the strategic nodes; living-strategy refinement    |
| Whether the site and the Practice separate | Owner | **Settled 2026-09-13** — separate streams and nodes                            |

## Related

- [The plan-node estate](../README.md) — the mechanism's home.
- [The conserved legacy corpus](../../plans-legacy-2026-09/DISPOSITIONS.md) — the plans
  these streams were read from, each with its disposition.
