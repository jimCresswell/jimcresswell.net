---
name: Graph Expression Execution
overview: Adopted Track A execution plan. Improve the existing graph layer as a deliberate publication surface, with explicit consumers, channels, validation, and proof.
todos:
  - id: phase-a1-impact-model
    content: Define Track A consumers, channels, intended impacts, and proof criteria.
    status: completed
  - id: phase-a2-output-audit
    content: Audit current graph-facing outputs against the Track A impact model.
    status: completed
  - id: phase-a3-refinement
    content: Implement the agreed graph-expression refinements.
    status: completed
  - id: phase-a4-proof
    content: Record internal and external validation for the delivered Track A outputs.
    status: completed
isProject: false
---

# Graph Expression Execution

## Status

Adopted on 2026-03-09 as the first execution track under
[personal-knowledge-graph-roadmap.plan.md](personal-knowledge-graph-roadmap.plan.md).

Use this plan with
[graph-current-state-audit.md](../research/graph-current-state-audit.md),
[graph-publication-consumer-and-proof-model.md](../research/graph-publication-consumer-and-proof-model.md),
[graph-publication-output-audit.md](../research/graph-publication-output-audit.md),
[graph-negotiated-media-type-refinement.md](../research/graph-negotiated-media-type-refinement.md),
[graph-cv-metadata-description-proof.md](../research/graph-cv-metadata-description-proof.md),
[graph-rich-result-external-validator-evidence.md](../research/graph-rich-result-external-validator-evidence.md),
and [pkg-research-findings.md](../research/pkg-research-findings.md).

This is the live execution authority for Track A.

Phase A1, Phase A2, Phase A3, and Phase A4 are complete.

Subsequent state (2026-08-12): ADR-020 adopts a bounded Person-owned
identity-atom seam into visible composition. Editorial prose and full page
selection/ordering remain Track B work. ADR-021 retires audience-tilt routes;
historical Track A evidence for `/cv/public_sector` remains valid evidence of
the surface that existed when those proofs were recorded.

The first A3 slice is recorded in
[graph-negotiated-media-type-refinement.md](../research/graph-negotiated-media-type-refinement.md):
the negotiated graph channel now serves the same JSON-LD payload for both
`application/ld+json` and `application/json`, with the response content type
matching the request.

The closing A3 proof slice is recorded in
[graph-cv-metadata-description-proof.md](../research/graph-cv-metadata-description-proof.md):
the existing graph-derived CV description fields are now proven at both the
metadata-export and emitted-route levels.

The current A4 external-validator record is now in
[graph-rich-result-external-validator-evidence.md](../research/graph-rich-result-external-validator-evidence.md):
the live home-page inline graph has a recorded Schema.org Validator code-mode
pass, while the remaining official-validator work is now closed as an accepted
tool-side boundary rather than left implicit.

## Outcome, impact, and value mechanism

**Outcome:** improve the existing entity graph, JSON-LD publication, graph API
output, and graph-adjacent metadata so they serve named consumers and are
backed by proof.

**Impact:** the graph layer becomes intentional, validated, and worth keeping
as a real publication surface rather than a merely valid sidecar.

**Value mechanism:** better machine-readable publication strengthens search and
indexing signals, supports programmatic graph consumers, and clarifies where
the current architecture is sufficient or limited.

## Boundary

This plan is the right place for:

- graph publication strategy for the architecture that exists today
- page-subgraph and full-graph refinement
- consumer-value-driven output decisions
- structured-data validation and proof

This plan is not the place for:

- designing the graph-backed source-of-truth architecture
- migrating visible page composition into the graph
- claiming that full page composition is already graph-derived
- using LinkedIn or another downstream view as an architectural driver

That work belongs to
[personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md).

## Current truth

Track A starts from the current implementation baseline:

- `content/entities.json` is a validated entity graph
- JSON-LD publication derives from that graph
- `/api/graph` and `Accept: application/ld+json` expose the graph as a real
  output surface
- the manifest and some metadata derive from graph entities
- editorial prose and full page composition do not derive from the graph;
  bounded Person identity atoms now do under ADR-020

The current Track A outputs in scope are recorded in
[graph-publication-consumer-and-proof-model.md](../research/graph-publication-consumer-and-proof-model.md).
That note is the authority for the implementation-backed consumer matrix,
success model, proof model, and explicit non-goals for the current publication
layer.

## Phase A1 completion record

Phase A1 is recorded in
[graph-publication-consumer-and-proof-model.md](../research/graph-publication-consumer-and-proof-model.md).

It makes explicit:

- the named consumers Track A serves today
- the named channels currently wired to the graph
- the intended impacts and value mechanisms per output area
- the proof criteria, validation surfaces, and reviewer expectations
- the explicit non-goals that keep Track A separate from Track B

Phase A2 is now recorded in
[graph-publication-output-audit.md](../research/graph-publication-output-audit.md).
Track A should now refine against that audit rather than redefining the model
again.

## Foundations already complete

These are completed groundwork, not the main work of this plan:

- entity syntax, validation, and type mappings
- entity population across the current graph model
- full-graph and page-subgraph publication
- page/document contract logic for canonical identity and section IDs
- historical regression proof that the PKG work did not introduce unexpected
  pixel drift

## Phases

### Phase A1 — Impact Model

**Goal:** define who Track A is for, which outputs matter, and what success
means.

**Impact:** later refinement work is constrained by value rather than by
generic graph completeness.

**Value mechanism:** naming real consumers and channels stops low-value
enrichment work from crowding out meaningful publication improvements.

**Acceptance criteria:**

- the plan names the consumers Track A is meant to serve
- the relevant channels are explicit
- each output area has a stated intended impact
- proof criteria exist before refinement begins

**Completion record:** see
[graph-publication-consumer-and-proof-model.md](../research/graph-publication-consumer-and-proof-model.md).

#### Tasks

##### Task A1.1 — Consumer and Channel Matrix

**Outcome:** a documented matrix of consumers, channels, and target graph
aspects.

**Impact:** the repo can prioritise the outputs that matter most.

**Value mechanism:** work can be ranked against real consumer benefit instead of
internal neatness.

**Acceptance criteria:**

- search/indexing consumers are covered
- programmatic graph consumers are covered
- browser/install consumers are covered where the graph already feeds output
- internal validation and reviewer consumers are covered
- each channel is mapped to the graph aspects it depends on

##### Task A1.2 — Success and Proof Model

**Outcome:** an explicit definition of what Track A is trying to improve and how
proof will be recorded.

**Impact:** implementation can be judged against agreed outcomes rather than
retrofitted stories of success.

**Value mechanism:** proof requirements reduce the risk of shipping changes that
are valid but not useful.

**Acceptance criteria:**

- each planned refinement category has a success statement
- validator and review tools are assigned to the relevant channels
- current proof gaps are identified explicitly
- intentional non-goals are documented

### Phase A2 — Output Audit

**Goal:** compare current graph-facing outputs against the Phase A1 model.

**Impact:** the next refinements are chosen because they close meaningful gaps.

**Value mechanism:** an audit distinguishes correctness problems from weak
expression and from channels that simply do not matter enough.

**Acceptance criteria:**

- current outputs are audited by consumer and channel
- each gap is classified clearly
- no change is justified solely by generic graph richness

**Completion record:** see
[graph-publication-output-audit.md](../research/graph-publication-output-audit.md).

Phase A2 found no confirmed correctness failures in the current Track A
surfaces. The live priority is now proof-led refinement:

- tighten CV metadata proof for the graph-derived description fields already in
  use
- preserve the now-delivered negotiated graph contract unless a later slice
  widens its route coverage again

#### Tasks

##### Task A2.1 — Full-Graph and Page-Subgraph Audit

**Outcome:** an assessment of the current full graph and page subgraphs.

**Impact:** the main JSON-LD publication paths are understood before changes are
made.

**Value mechanism:** the repo refines the graph where consumers will actually
benefit.

**Acceptance criteria:**

- strengths and gaps are documented
- `@id` integrity and closure expectations are included
- consumer relevance is noted for each proposed refinement

##### Task A2.2 — Adjacent Output Audit

**Outcome:** an assessment of graph-adjacent outputs such as the manifest,
metadata, and graph API behaviour.

**Impact:** Track A covers the whole machine-readable surface, not just inline
JSON-LD scripts.

**Value mechanism:** improvements land where the graph already has operational
reach.

**Acceptance criteria:**

- adjacent outputs are listed and checked
- each proposed change is tied to a consumer or proof need
- low-value channels are explicitly deprioritised where appropriate

### Phase A3 — Refinement

**Goal:** implement the agreed graph-expression improvements.

**Impact:** the graph layer becomes more intentional and more useful without
pretending the page-rendering architecture has changed.

**Value mechanism:** focused refinements improve the outputs that matter while
preserving the current rendering truth.

**Acceptance criteria:**

- changes implement the approved impact model
- graph publication remains self-consistent and valid
- for rendering-risk slices, the visual regression harness is run during
  implementation and unexpected differences are resolved before continuing
- docs and tests stay honest about current rendering architecture

**Current record:** the negotiated media-type slice is now delivered and proven
in
[graph-negotiated-media-type-refinement.md](../research/graph-negotiated-media-type-refinement.md).
The home-page inline JSON-LD emitted-channel proof slice is also now delivered
through `e2e/behaviour/seo.e2e-api.test.ts` and
`lib/page-document-contract.integration.test.ts`.
The manifest proof slice is also now delivered through
`app/manifest.integration.test.ts` and
`e2e/behaviour/manifest.e2e-api.test.ts`.
The CV metadata description proof slice is now also delivered in
[graph-cv-metadata-description-proof.md](../research/graph-cv-metadata-description-proof.md)
through `lib/page-document-contract.integration.test.ts` and
`e2e/behaviour/seo.e2e-api.test.ts`.
Phase A3 is now complete.

**Track A closure record:** use
[graph-publication-output-audit.md](../research/graph-publication-output-audit.md)
and
[graph-rich-result-external-validator-evidence.md](../research/graph-rich-result-external-validator-evidence.md)
as the latest proof record. The home-page Schema.org code-mode evidence is
captured, and the remaining `/cv/` Schema.org and Google Rich Results Test
gaps are now recorded as accepted validator-side limits for this slice. Do not
re-open Track A external validation unless the live structured-data output
changes materially or a new manual validation request is explicit.

**Next active graph task:** continue in
[personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md).
Track B is now the active design track, while implementation remains out of
scope until that plan is decision-complete.

#### Tasks

##### Task A3.1 — Publication Refinement

**Outcome:** refined graph outputs aligned to the impact model.

**Impact:** the graph publishes better-targeted machine-readable signals.

**Value mechanism:** consumers get clearer or more complete data where it
matters.

**Acceptance criteria:**

- each change maps back to a named consumer and channel
- no compatibility layer or duplicate source is introduced
- harness proof is captured during implementation whenever a slice could affect
  the rendered site surfaces already under harness coverage
- TDD and reviewer discipline are followed for non-trivial changes

##### Task A3.2 — Plan and Doc Truth Maintenance

**Outcome:** live plans and related docs stay aligned with the delivered Track A
scope.

**Impact:** execution work cannot silently drift into Track B claims.

**Value mechanism:** truthful docs preserve architectural clarity and protect
future decision quality.

**Acceptance criteria:**

- no live doc implies graph-backed page composition unless it exists
- Track A changes are reflected in the graph roadmap where necessary

### Phase A4 — Validation and Proof

**Goal:** prove that Track A outputs are correct and fit for their intended
consumers.

**Impact:** the graph layer earns trust as a maintained publication system.

**Value mechanism:** explicit proof makes future graph work easier to justify
and safer to extend.

**Acceptance criteria:**

- validation results are recorded explicitly
- output correctness is evidenced, not assumed
- intentional exceptions are documented clearly

#### Tasks

##### Task A4.1 — Internal Validation

**Outcome:** updated automated checks and reviewer evidence for Track A outputs.

**Impact:** correctness regressions are caught inside the repo.

**Value mechanism:** maintainable proof lowers the future cost of graph changes.

**Acceptance criteria:**

- relevant automated checks are updated or added
- reviewer findings are resolved or recorded explicitly

##### Task A4.2 — External Validation

**Outcome:** recorded results from appropriate external validation tools.

**Impact:** Track A is tested against the consumers and validators it claims to
serve.

**Value mechanism:** external proof prevents self-referential success claims.

**Acceptance criteria:**

- Schema.org Validator is used where relevant
- Google Rich Results Test is used where relevant
- outcomes and limitations are recorded in a discoverable place

## Reviewer protocol

After every non-trivial change, use:

- `code-reviewer` as gateway
- `pkg-reviewer` on graph, JSON-LD, entity-model, and `@id` work
- `type-reviewer` on schema, validation, or type-flow changes
- `test-reviewer` on test additions or changes
- `editor` when wording or public framing changes

## Out of scope

- source-of-truth redesign
- graph-backed page composition
- migration of authored content into graph-owned structures
- publication-completeness proof for the future source-of-truth model
- LinkedIn derivation work
