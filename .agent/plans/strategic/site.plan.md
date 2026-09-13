---
id: site
node_type: strategic
name: The site
overview: >-
  The site stays stable, provable at the production layer, and hygienic in
  its dependencies, so the content and the graph can be the priority.
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-09-13
ratified_where: >-
  Cards in session 880ff9 (Cauldron herds Lustre), 2026-09-13: "Ratify all
  three now", with the platform stream split into the site and the Practice
  in the same round; plan of record §Owner rulings, round 6.
serves: SITE-1
impact_areas:
  - site
  - visual-system
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-09-13
---

# The site

## Outcome

The site builds, deploys and proves itself at the production layer on every change; its
dependencies are patched and its majors taken one per slice; any further workspace boundary
passes the extraction gate before it exists.

## User groups and value

- **The owner** spends attention on the content and the graph, not on the ground they stand
  on.
- **Readers** get a site that renders, prints and is reachable, every time.
- **Seats on the repository** meet gates that exist and proof that was exercised.

## The bet

That stability is bought with proof (production-layer tests, reviewed visual baselines, a
layering gate) rather than with caution, and that the extraction gate keeps the monorepo
honest.

## Success looks like

`pnpm check` green on every leg with CI at parity; the visual and production proof current;
the six parked majors taken one per slice; no package created without a passing gate.

## Delivery

Delivery plans serving this node declare `serves: site` — enumerate them by search, never
by a hand-kept list.
