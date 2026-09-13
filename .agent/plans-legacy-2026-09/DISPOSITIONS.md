# The conserved pre-schema plan corpus — dispositions

The lifecycle lanes (`active/`, `current/`, `future/`, `research/`, `archive/`) and
`roadmap.md` as they stood on 2026-09-13, moved here untouched at the plan-node migration
because the estate validator scans every `*.plan.md` under `.agent/plans/` and a pre-schema
plan cannot conform. Nothing here governs work; every file is evidence. Each row says where
its live intent now lives. **Status: proposed** by the migrating seat after reading every
file's status, deferred and next-step sections; the owner ratifies or amends on cards.

Dispositions: **converted** (a delivery node exists or is authored at pickup from this
record), **conserved** (the intent lives in a strategy stream choice), **superseded** (events
since the file was written closed it), **record** (complete; the file is the history).

| File                                                        | Disposition               | Where the intent lives now                                                                                                                                 |
| ----------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `active/personal-knowledge-graph-source-of-truth-design`    | converted (at pickup)     | GRAPH-1; the design record for a delivery node serving `personal-knowledge-graph`, Task B2.1 first; B2.2 stays deferred                                     |
| `current/personal-knowledge-graph-roadmap`                  | conserved                 | The knowledge-graph stream (sequencing, the two tracks); the strategic node supersedes the roadmap's role                                                   |
| `current/personal-knowledge-graph-execution`                | record                    | Track A complete for the current surface; GRAPH-2 names the re-open condition                                                                              |
| `current/cv-editorial-improvements`                         | conserved                 | CONTENT-1 (settled work listed in the content stream), CONTENT-3 (the deferred doors: tilts, A/B testing)                                                   |
| `current/linkedin-update`                                   | conserved                 | CONTENT-2; the private plan behind the editorial boundary is the instrument; the public stub's routing rules are in the stream                             |
| `current/dev-tooling-hygiene`                               | conserved                 | PLATFORM-4 (six parked majors, one per slice); dependency-cruiser is already a blocking `check` leg since the transplant                                    |
| `current/workspace-architecture-roadmap`                    | superseded                | Its premise ("no workspace manifest exists") closed by the transplant's monorepo; its extraction-gate rule survives as PLATFORM-2                          |
| `current/visual-regression-workspace`                       | conserved                 | PLATFORM-2; the harness stays in `jcdotnet/scripts/`; extraction only through the gate, authored at pickup                                                 |
| `current/practice-validation-workspace`                     | superseded                | The validators live in the `agent-tools` workspace since the transplant                                                                                    |
| `current/cv-workspace`                                      | superseded                | No `packages/` tier exists; the gate rule (PLATFORM-2) governs any future CV package; the Jim-free CV contract idea is conserved there                      |
| `current/jim-profile-workspace`                             | superseded                | As above; the single-source facade idea is GRAPH-1's composition layer                                                                                     |
| `current/professional-profile-graph-workspace`              | superseded                | As above; stable schemas and pure graph algorithms are GRAPH-3's shape                                                                                     |
| `current/web-page-workspace-and-boundary-enforcement`       | superseded                | As above; the losing condition is PLATFORM-2's text                                                                                                        |
| `future/neo4j-knowledge-graph`                              | conserved                 | GRAPH-3 (stable IDs, typed relationships, entities over nesting, every abstraction level a node); the migration sketch stays here                          |
| `future/visual-regression-harness-enhancements`             | conserved                 | PLATFORM-1's proof posture and this file's promotion rule; candidates stay here                                                                            |
| `research/*` (10 files)                                     | record                    | The knowledge-graph design record GRAPH-1 cites; the `pkg` skill and reviewer read them here                                                               |
| `archive/*` (26 files)                                      | record                    | Complete; ideas harvested below                                                                                                                            |
| `roadmap.md`, `active/README.md`, `archive/cloud-sub-plans.README.md` | record          | Indexes of the corpus as it stood                                                                                                                           |

## Ideas harvested from the archive

- `archive/e2e-testing-and-quality` deferred items: Lighthouse performance testing (CONTENT-3
  lists it among the closed doors; reopen on a concrete need); stale blob cleanup (nothing
  until storage costs matter).
- `archive/component-audit` §Storybook: considered and deferred (ADR-004); the migration path
  from RTL to Storybook interaction tests is low-friction if the component count grows.
- `archive/optional-app-relocation`: "Not Selected" on 2026-08-10; the transplant's monorepo
  then relocated the site to `jcdotnet/` anyway — the dormant re-entry conditions are moot,
  the deployment contract (ADR-019) and PDF contracts (ADR-001/002) it lists still apply.
- `archive/tilt-retirement` and `archive/capabilities-editorial`: the tilt re-entry route
  (ADR-021, the preserved reference document) and the `meta.summary` decoupling that the
  graph performs (ADR-011) — both in CONTENT-1/CONTENT-3.
- `archive/landing-content-draft`: a 17-line draft; the front page shipped from
  `front-page-content`.
