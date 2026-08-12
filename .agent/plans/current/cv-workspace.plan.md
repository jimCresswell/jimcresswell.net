---
name: CV Workspace
overview: Accepted product child. Prove a synthetic Jim-free CV contract, inject composition and output policy into the current renderer, then extract only the stable CV model and rendering boundary.
todos:
  - id: cv-boundary-disposition
    content: Classify CV semantics, Jim composition, app routes, output policy, and presentation ownership before package movement.
    status: pending
  - id: cv-synthetic-red-proof
    content: Write failing runtime and renderer proof for a complete non-Jim CV with different labels, order, person, and output link.
    status: pending
  - id: cv-final-interface-in-place
    content: Inject sections, composition, site reference, and output policy into the current CV renderer and switch current routes.
    status: pending
  - id: cv-package-extraction
    content: Move the proven Jim-free model and renderer to packages/cv.
    status: pending
  - id: cv-integration-closure
    content: Prove current HTML, accessibility, E2E, PDF, and visual behaviour, enforce dependencies, and remove old ownership.
    status: pending
isProject: true
---

# CV Workspace

## Status

**Accepted child of the
[Workspace Architecture Roadmap](workspace-architecture-roadmap.plan.md); not
active pending its entry conditions and explicit promotion.**

This child does not wait for Track B composition. It proves that composition
is supplied to a reusable CV renderer rather than becoming CV policy. Its tilt
prerequisite is now satisfied: ADR-021 retired `HeadlineToggle`, variant routes,
tilt-only content, and canonical-alias behaviour.

The merged tree also provides bounded seam evidence. `cvLayoutContent` derives
Person-owned identity atoms before passing data into `CVLayout`, but the
renderer still imports current section, site-reference, and PDF/output policy.
The Jim-free runtime model, complete synthetic fixture, and final injected
interface therefore remain pending.

## Outcome, impact, value mechanism, and proof

**Outcome:** `packages/cv` owns a Jim-free runtime model and renderer that
accept content, section composition, labels, output affordances, and print
policy as explicit inputs; the application supplies Jim's configured values.

**Impact:** CV semantics and rendering can change without editing Jim's public
identity, site routes, or source model, while Track B remains free to choose
Jim's composition representation.

**Value mechanism:** a complete synthetic CV and a final injected interface
remove hidden Jim assumptions in place; moving that proven seam then adds
independent dependency, proof, and lifecycle ownership.

**Proof:** a non-Jim fixture with different structure renders independently;
the current canonical CV retains headings, content, accessibility, responsive
behaviour, PDF, and visual output through app integration.

## Entry conditions

- parent adopted and this child promoted
- earlier tooling and graph children are complete or explicitly dispositioned
- ADR-021 tilt retirement is complete and current canonical `/cv` proof is green
- current CV content, page-contract, renderer, PDF, E2E, and visual surfaces
  have one recorded inherited baseline
- live collaboration and custody for adjacent CV, page-contract, manifest,
  lockfile, and CSS paths is re-checked at activation
- CV extraction gate has a provisional disposition before a manifest is added

## Ownership boundary

### Package should own

- validated CV-domain runtime schemas and derived types
- generic section, entry, narrative-slot, and accessible-heading semantics
- renderer contracts/components accepting content and composition inputs
- optional output-affordance semantics with supplied URL/filename/label
- reusable print/PDF presentation primitives only where independent of Jim and
  app orchestration

### Package must not own

- Jim's name, contact details, facts, prose, section order, or labels such as
  “Before Oak”
- site URL, `/cv`, configured PDF filename, brand tokens, Vercel/Blob policy,
  Next routes, or app layouts
- Track B facts/prose/composition storage model
- tilt variants or canonical-alias behaviour

## Boundaries

### In scope

- reusable portions of `lib/cv-content.ts`, `components/cv-layout.tsx`,
  `components/article-entry.tsx`, section/document semantics, and pure output
  helpers
- synthetic non-Jim fixtures and package-local tests
- final injected interfaces in current app code before movement
- app adapters, explicit exports, manifest, dependencies, README, and rules

### Out of scope

- moving or redesigning Jim's public source-of-truth content
- changing editorial claims or adding/removing CV sections
- app route, Vercel Blob, production PDF orchestration, or deployment movement
- generic web-page extraction
- global CSS ownership changes beyond the minimum required for unchanged package
  rendering; final CSS disposition remains a later Jim/final-boundary task

## Tasks

### Task 1 — Draw and disposition the CV boundary

**Outcome:** current renderer/model fields are classified as CV semantics, Jim
composition/content, app integration, or later presentation ownership.

**Impact:** package design cannot smuggle the current CV's order and labels into
generic policy.

**Value mechanism:** classification makes the second fixture test real domain
reuse rather than prop-renamed site configuration.

**Acceptance criteria and proof:** every current import/prop has a final owner;
route/filename/site/brand values are outside the package; the synthetic API
sketch has one coherent reason to change; the gate records provisional PASS or
closes Internal Module before movement.

### Task 2 — Specify a non-Jim CV with red proof

**Outcome:** runtime and React tests define the minimum accepted CV model and
renderer behaviour using different person, labels, ordering, roles, education,
and output affordance.

**Impact:** current Jim assumptions become observable before they become public
package API.

**Value mechanism:** a genuine second configured instance demonstrates which
semantics belong to CVs rather than this site.

**Acceptance criteria and proof:** schemas accept/reject useful runtime inputs;
section/accessibility/entry/narrative/output behaviour is covered; tests prove
current order and “Before Oak” are not required; tests fail because the final
interface is absent.

### Task 3 — Introduce the final interface in place

**Outcome:** current `CVLayout` receives content, composition, section metadata,
output URL/name/label, and site reference explicitly; current routes own those
configured values.

**Impact:** the application can pause green with a clean CV seam before any
package move.

**Value mechanism:** the interface remains the eventual package API, so
dependency inversion—not a transitional adapter—does the semantic work.

**Acceptance criteria and proof:** no renderer import reaches current content,
page contract, site config, PDF config, or Jim values; both current and
synthetic consumers pass integration tests; each route switch removes its old
path; current accessibility and rendered structure remain green.

### Task 4 — Extract `packages/cv`

**Outcome:** the already-proven model and renderer have a private manifest,
explicit exports, local dependencies, TypeScript/test configuration, and README.

**Impact:** reusable CV behaviour receives independent ownership and proof.

**Value mechanism:** package boundaries enforce the Jim-free seam without
changing the consumer contract already proven in the app.

**Acceptance criteria and proof:** package-local gates pass; source contains no
Jim name, site URL, `/cv`, configured filename, current content import, current
labels, or app code; app uses `workspace:*`; old root implementations are
removed in the same slice. If this is the first passing extraction,
`pnpm-workspace.yaml` is created with explicit public patterns and root plus
package discovery is proved in the same slice.

### Task 5 — Prove app integration and close ownership

**Outcome:** package and application adapters are the only live CV
implementations and their dependency direction is enforced.

**Impact:** Jim-profile adoption can later supply composition without reopening
CV policy.

**Value mechanism:** deletion, static rules, and product-level proof preserve
both sides of the seam.

**Acceptance criteria and proof:** package/root gates, canonical CV
integration, accessibility, responsive E2E, PDF generation/serving, metadata,
markdown, and blocking visual comparison pass; no old path or re-export bridge
remains.

## Extraction-gate decision

Expected PASS only if the synthetic CV uses the same runtime model and renderer
without Jim-shaped configuration.

**Losing condition:** retain an enforced CV domain module if most renderer
inputs exist only to recreate this site's labels, route policy, or layout
quirks, or package setup outweighs the implementation it owns.

## Test and proof strategy

- runtime schema unit tests and synthetic renderer integration tests
- current app consumer integration tests
- production CV, accessibility, metadata, markdown, and PDF E2E
- blocking visual and PDF review for renderer or style movement
- dependency/literal/Knip proof for package purity and deletion

## Documentation obligations

- package README with model, composition inputs, output contract, examples,
  non-goals, dependencies, and tests
- architecture/content-model docs distinguishing CV policy from Jim composition
- PDF and accessibility docs if reusable presentation contracts move
- workspace ADR observed CV disposition
- parent/roadmap and Jim Profile handoff

## Completion handoff

Record final API, synthetic proof, app adapter owner, PASS/FAIL disposition,
render/PDF evidence, and deferred presentation ownership. If Professional
Profile Graph and CV are two consecutive failed product candidates, stop and
reassess the modular-monolith alternative under the parent programme condition;
do not promote another child. Otherwise recommend promotion of
[Jim Profile Workspace](jim-profile-workspace.plan.md).
