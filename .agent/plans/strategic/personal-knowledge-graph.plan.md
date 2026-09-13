---
id: personal-knowledge-graph
node_type: strategic
name: The personal knowledge graph
overview: >-
  A graph of real entities and valid claims that is both the source of truth
  for the CV's facts and the way the CV is known to search engines,
  assistants and people.
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-09-13
ratified_where: >-
  Cards in session 880ff9 (Cauldron herds Lustre), 2026-09-13: "Ratify all
  three now"; plan of record §Owner rulings, round 6.
serves: GRAPH-1
impact_areas:
  - knowledge-graph
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-09-13
---

# The personal knowledge graph

## Outcome

The CV's facts live in a graph whose entities are real and whose claims validate against
Schema.org; the page composes from that graph through distinct ownership layers (facts,
authored prose, composition); the graph publishes as JSON-LD and negotiated representations
with internal and external proof; and its shape (stable IDs, typed relationships, entities
over nesting) survives a later move to a graph database.

## User groups and value

- **Search engines and assistants** consume valid structured data and negotiated
  representations, so the CV is found and understood as the owner intends.
- **The owner** edits facts once; every view derives.
- **Seats on the repository** work from a design record (the Track B plan and six research
  notes, conserved in the legacy corpus) rather than re-auditing.

## The bet

That a graph-backed source of truth for one canonical view pays back the design cost in
truthfulness and reach, and that shaping it graph-first now makes the later database move
a migration rather than a redesign.

## Success looks like

Task B2.1 (page selection and ordering) closes decision-complete; Track B implementation is
authored from the design, not from a fresh audit; the publication proof (GRAPH-2) stays
green as the surface changes.

## Delivery

Delivery plans serving this node declare `serves: personal-knowledge-graph` — enumerate them
by search, never by a hand-kept list.
