# .agent/plans/ — the planning estate

The repository's home for **intent and mechanism**: why each piece of
work exists, how it is done, what proves it done, and who ratified it.
The state of any instance of the code — a deployment, a dashboard — is
that system's own record, never this corpus's, which records the desired
outcome and its owner-held proof; the full contract is the
[plan-node schema](plan-node-schema.md).

Three plan types: **strategic** (the outcome and the bet — long-lived,
few), **delivery** (one step of a lane — short-lived, archived at
completion, authored by its implementer at pickup), **runbook** (a
repeatable procedure). Milestones and lanes are not plan types.

**Every plan is born `sketch`** and governs no work until it carries a
complete owner-ratification stamp (`ratified_by` + `ratified_date` +
`ratified_where`). Executed is not ratified; the stamp is the difference,
and the estate validator (`validate-plan-corpus`, a `repo-validators:check`
leg) enforces it together with every `serves`, `impact_areas` and
`depends_on` edge.

_Reading path: start at the [strategy index](strategy/README.md) for the
three streams and their choices; each strategic node under `strategic/`
serves one choice; each delivery plan or runbook serves one strategic
node. Enumerate what serves a node by search, never by a hand-kept list._

## Layout

| Path                                         | Holds                                                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [`plan-node-schema.md`](plan-node-schema.md) | The contract every plan conforms to                                                                               |
| [`impact-areas.md`](impact-areas.md)         | The closed, additive registry behind `impact_areas`                                                               |
| [`strategy/`](strategy/README.md)            | The strategy corpus: the index with the choice families, one `stream-*.md` per stream with the concrete choice IDs |
| `strategic/`                                 | Strategic nodes, one per stream                                                                                   |
| `delivery/`                                  | Delivery plans (steps of the live lanes)                                                                          |
| `runbooks/`                                  | Operational procedures                                                                                            |
| [`templates/`](templates/README.md)          | The three authoring templates, each opening with its ratification block                                           |
| `*/archive/`                                 | Terminal plans (completed, abandoned or superseded, each with its disposition), inside their type's directory; the validator scans them like any other directory |

Plans are public-repository artefacts: **mechanism only**; anything
private stays behind the private editorial boundary.

## Provenance

The estate structure and its validator arrived with the Practice lineage
transplant (2026-09-12); the strategy corpus, the three strategic nodes
and the impact registry were authored at the plan-node migration
(2026-09-13) under the owner's rulings of that day. One conserved corpus
precedes this estate, evidence and not a baseline: the pre-schema
lifecycle lanes and roadmap, untouched in
[`.agent/plans-legacy-2026-09/`](../plans-legacy-2026-09/DISPOSITIONS.md)
with a disposition per file.
