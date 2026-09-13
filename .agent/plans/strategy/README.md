---
title: 'Strategy'
type: strategy
doc_role: index
status: sketch
last_updated: 2026-09-13
audience: 'The owner (decide) and every seat on the repository (build)'
---

# Strategy

> **A living strategy.** Three streams, authored at the plan-node migration (2026-09-13)
> from the owner's word on the cards of that day — "eventually I expect that the site and
> Practice will be relatively stable and the content and graphs will be the priority.
> Ultimately this is my CV, the content is what matters" — and from the intent the legacy
> plan corpus carried. Born sketch; the owner ratifies the streams and their choices on
> cards. This README is the stable index; the detail lives in the stream files.

## In one line

**The CV is the product; the graph is how it is known; the site and the Practice are the
stable ground both stand on.**

## The streams

| Stream              | File                                          | Choice IDs   | Priority                                    |
| ------------------- | --------------------------------------------- | ------------ | ------------------------------------------- |
| The content         | [stream-content.md](stream-content.md)         | `CONTENT-*`  | First — the CV is the product               |
| The knowledge graph | [stream-knowledge-graph.md](stream-knowledge-graph.md) | `GRAPH-*` | With the content — how the CV is known      |
| The platform        | [stream-platform.md](stream-platform.md)       | `PLATFORM-*` | Stable ground: the site and the Practice    |

## Strategic choices (the traceability spine)

Every plan in the estate traces to a **strategic choice** here: each strategic node serves
exactly one published choice, and each delivery plan or runbook serves one strategic node,
inheriting its upward trace. The choices are an enumerable, stable set with IDs; the ID
contract (stable, additive, resolvable), the typed `serves` field and the validator are the
[plan-node schema](../plan-node-schema.md)'s. The validator recomputes the registry from
this README's families and the concrete IDs the stream files publish.

## Open decisions

| Decision                                   | Owner | Status / note                                                          |
| ------------------------------------------ | ----- | ---------------------------------------------------------------------- |
| The three streams and their names          | Owner | Proposed 2026-09-13 from the owner's sentence; ratified on cards       |
| The choices per stream                     | Owner | Proposed 2026-09-13 from the legacy corpus's live intent; ratified on cards |
| Whether the site and the Practice separate | Owner | Open — one platform stream while both are stable                       |

## Related

- [The plan-node estate](../README.md) — the mechanism's home.
- [The conserved legacy corpus](../../plans-legacy-2026-09/DISPOSITIONS.md) — the plans
  these streams were read from, each with its disposition.
