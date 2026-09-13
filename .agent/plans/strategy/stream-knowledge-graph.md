---
title: 'Strategy — Stream: the knowledge graph'
type: strategy
status: sketch
last_updated: 2026-09-13
governed_by:
  - .agent/plans/strategy/README.md
---

# Stream — the knowledge graph

_Part of the [strategy](README.md). How the CV is known: a personal knowledge graph whose
entities are real, whose claims are valid, and whose representations are consumed by search
engines, assistants and people alike._

## Choices

- **GRAPH-1 — A graph-backed source of truth for one canonical CV view (Track B).** Facts,
  authored prose and composition are distinct ownership layers that still resolve into one
  cohesive graph across files; editorial prose and full selection and ordering are not yet
  graph-derived, and ADR-020 is a bounded Person identity-atom seam. The live design step is
  Task B2.1, the page selection and ordering model; B2.2 is deferred. The legacy corpus's
  Track B design plan and its six research notes are the design record.
- **GRAPH-2 — The graph is a deliberate publication surface (Track A, complete for the
  current surface).** Explicit consumers and channels, JSON-LD under Schema.org, negotiated
  media types, and internal plus external validation proof. Re-open only when the
  publication surface changes materially.
- **GRAPH-3 — Graph-shaped from the start, Neo4j-ready later.** Stable entity IDs that
  survive a migration, typed relationships named explicitly, entities over nesting, and every
  abstraction level (a positioning narrative as much as a role) a real node. A Neo4j
  migration is a later intent with a promotion rule, not current work.

## Sequencing

Track A first (done), Track B design now, Track B implementation only once the design is
decision-complete. LinkedIn is not downstream of this stream (CONTENT-2).

## Won't do

- Design tilt composition into Track B (tilts are retired).
- Start a Neo4j migration before the source-of-truth design closes.
