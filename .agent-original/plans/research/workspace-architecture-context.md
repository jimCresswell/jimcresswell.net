# Workspace Architecture Context

## Status

Recorded on 2026-08-10 as the evidence and concept-exploration record for the
[Workspace Architecture Roadmap](../current/workspace-architecture-roadmap.plan.md),
accepted by Jim later that day.

Reassessed on 2026-08-12 after PR #39 landed the visual-configuration seam and
PR #36 landed the canonical-only CV plus bounded graph-owned identity atoms.
Those changes refine the observed source boundaries without authorising a
package move. The application remains at the repository root, Optional App
Relocation is archived as Not Selected, no workspace manifest exists, and the
Visual Regression child remains the first current extraction hypothesis.

This report is context, not decision authority. Track B Phase B2.1 remains the
single primary repo plan. Every child gate must re-read live source, consumers,
dependencies, proof, and collaboration custody; this report deliberately
contains no private editorial evidence or transient checkout state.

## Question

What in this repository is:

1. generic web-page machinery
2. reusable professional-profile graph machinery
3. reusable CV-domain machinery
4. public material specific to Jim's site and CV
5. development or Practice tooling

And, given those boundaries, which concerns should become pnpm workspaces
rather than remain internal modules of one Next.js application?

## Evidence boundary

The 2026-08-12 refresh covered the public repository source estate through the
merged PR #36 tree:

- 123 tracked implementation, test, script, harness, and root configuration
  files selected by the reproducible code/config census below
- 10,594 lines across that selected public code and configuration estate
- all 753 lines in the three public content documents under `content/`
- root package, TypeScript, Next.js, Playwright, Vitest, Vercel, lint,
  formatting, and dependency configuration
- the live graph plans, architecture records, testing strategy, and Practice
  validation contract

The ignored private editorial boundary was not traversed for this public
refresh. Only its architectural exclusion is relevant here: it must remain
outside workspace discovery, public build/test/lint/format/dependency graphs,
generated artefacts, and automated synchronisation.

The dated code/config census combines these non-overlapping tracked-file
queries, then counts their paths and lines:

```sh
git ls-files 'app/**' 'components/**' 'lib/**' 'e2e/**' 'scripts/**' \
  'visual-regression-harness/**' 'logo/**' | rg '\.(ts|tsx|js|mjs)$'
git ls-files | rg '^[^/]+\.(ts|js|mjs|json)$'
```

It deliberately excludes Markdown, CSS, lockfiles, generated output, binary
assets, and the separately counted public JSON content.

## Executive finding

The original three-way classification is too coarse. The code contains five
different responsibilities:

| Responsibility             | Reuse boundary                                    | Current examples                                                                            |
| -------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Generic web page           | Any content-led website                           | semantic section/prose primitives, theme and accessibility shell, alternate representations |
| Professional-profile graph | A person, career, or CV-style knowledge graph     | Schema.org entity schemas, graph validation, subgraph selection, URL rewriting              |
| CV domain                  | A CV regardless of whose CV it is                 | CV model, section semantics, renderer, print/PDF contract                                   |
| Jim profile                | This public identity and this site's composition  | facts, prose, ordering, section labels, branding, site policy, PDF filename                 |
| Tooling and custody        | Repository operations rather than product runtime | visual comparison, Practice validators, E2E, asset generation, private editorial boundary   |

The best target hypothesis is a small pnpm monorepo with the existing root
application as the default app workspace, four candidate product packages,
and two tooling workspaces:

```text
./                         # @jimcresswell/www; root app workspace
packages/web-page
packages/professional-profile-graph
packages/cv
packages/jim-profile
tooling/visual-regression
tooling/practice-validation
```

This is not yet an instruction to create every candidate. The workspace file
should land with the first child whose extraction gate passes; pnpm includes
the root package without moving it. If Jim explicitly values a pure
orchestration root,
`apps/www` remains a valid early, isolated relocation, but it is no longer a
load-bearing prerequisite. Every package extraction must still pass the gate
in this report. A package that fails stays an internal module.

## Concept exploration

### Movement 1 — observations before explanation

- The repository is currently one private package, `@jimcresswell/www`, with
  no `pnpm-workspace.yaml`.
- PR #39 landed an injected, repository-owned TypeScript configuration
  boundary for the visual harness. Harness code no longer imports product
  source. PR #36's later exact-base comparison retained zero pixel differences.
  No package or workspace topology has changed.
- pnpm always includes the root package in a workspace, even when custom
  `packages/*` and `tooling/*` location patterns are configured. Moving the app
  is therefore not required for workspace discovery or `workspace:*` links
  ([pnpm workspace settings](https://pnpm.io/settings#packages)).
- One Next.js deployment currently owns routes, content, graph publication,
  CV rendering, PDF generation, tests, and repository tooling.
- Most files have a recognisable centre of gravity, but the important seams
  combine schema with instance data, reusable rendering with Jim-specific
  composition, or generic tooling with app imports.
- Editorial prose and full page composition still render from
  `content/frontpage.content.json` and `content/cv.content.json`. Bounded Person
  name, email, description, and profile URLs are graph-owned and injected at
  application boundaries; the broader graph publication still comes from
  `content/entities.json`.
- The adopted Track B design distinguishes facts, authored prose, and
  composition while retaining one cohesive graph.
- Track B remains incomplete, while ADR-021 has completed tilt retirement.
  Freezing Jim-profile composition APIs now would still encode unsettled Track
  B decisions.
- The Practice validators and visual-regression engine have independent
  reasons to change and test, even though they are currently launched from the
  root package.
- Private editorial sources have a different custody and disclosure contract
  from every public build input and remain explicitly excluded.
- The app-relocation candidate crossed application, content, E2E, PDF, Vercel,
  path-alias, root-command, and visual-proof surfaces. Sequence R rejected that
  cost absent an owner-valued clean-root outcome.

### Movement 2 — problem frame

The repository currently uses filesystem proximity as if it were one kind of
ownership. It is actually carrying several:

- deployment ownership
- domain ownership
- public identity and editorial ownership
- build and proof ownership
- private source custody

That conflation makes otherwise reusable code import Jim's content, lets
tooling import product contracts, and makes root gates depend on one broad
TypeScript and dependency surface. It also obscures which decisions are
generic policy and which are merely true of the current CV.

The architectural problem is therefore not “how do we move folders?” It is:

> Which boundaries create independently understandable, testable, and
> governable responsibilities without turning a small single-deployable site
> into package ceremony, and how can each boundary land green and then wait
> indefinitely without a coordinated multi-branch cutover?

### Movement 3 — candidate solutions and challenge

#### Candidate A — keep one package and impose internal modules

This is the strongest alternative. The site has one deployable and about ten
thousand lines of source and tests. Directory boundaries plus
`dependency-cruiser` could provide most architectural enforcement with less
configuration.

**Warrant:** package boundaries are not free; a one-consumer abstraction can
hide rather than clarify ownership.

**Falsifier:** retain the monolith when a candidate package has only one
meaningful consumer, shares most configuration with the app, and cannot be
verified or changed independently.

#### Candidate B — create the seven-workspace topology immediately

This gives the clearest physical boundaries and makes dependency direction
enforceable through manifests and TypeScript projects.

**Warrant:** graph, CV, content, app, and tooling already have different
change reasons and proof surfaces.

**Falsifier:** reject immediate wholesale extraction because Track B still
changes Jim-profile composition contracts, and because some generic primitives
do not yet have a second meaningful consumer. Tilt retirement was an additional
unsettled contract when this comparison was first recorded on 2026-08-10; it is
now complete.

#### Candidate C — seam-first extraction with the app at the root

First remove reach-back through final typed interfaces, then create the
workspace root with the first proven tooling package. Keep the app as the root
package. Extract one package at a time and stop when a boundary fails its gate.

**Warrant:** this gains physical enforcement where evidence is strongest while
avoiding an app-wide path migration that pnpm does not require. Seam-first
changes can be reviewed, reverted, or left in place independently.

**Falsifier:** choose the clean-root alternative if the root package's combined
app/orchestration ownership creates measured recurring friction, or stop the
programme if two consecutive product candidates fail the extraction gate.

#### Candidate D — clean-root bootstrap with one coordinated app move

After current overlapping work is settled, pause app/config changes, relocate
the deployable to `apps/www` in one behaviour-preserving tranche, and then use
the target paths for every extraction.

**Warrant:** if a pure orchestration root is itself a durable owner outcome,
paying the relocation cost once avoids changing app paths after packages exist.

**Falsifier:** keep the app at root if relocation needs persistent duplicate
manifests, cwd inference, outside-root deployment exceptions, or operational
workarounds that exceed the ownership clarity it creates.

### Movement 4 — synthesis

Candidate C is the recommendation. It preserves Candidate A as a legitimate
local outcome for weak package candidates and Candidate D as an explicit
owner-selectable topology branch. The workspace count is an end-state
hypothesis, not a quota.

The first seam is now proven in place: PR #39 injected visual-regression
configuration. PR #36 added bounded graph-owned identity injection and removed
tilt policy, but did not complete the synthetic graph or CV contracts. The
first workspace attempt remains visual-regression tooling, which would also
introduce `pnpm-workspace.yaml` only after a fresh PASS. If it fails, the first
later child to pass creates the substrate instead. Product packages follow
their stable dependency direction. Jim-profile adoption waits for Track B; the
generic web-page package remains last because it is the easiest place to
over-generalise a one-site component library.

## Source classification

### Application and route layer — 14 code files

All files under `app/` remain application-owned because they implement Next.js
route, metadata, layout, or deployment integration. They may consume package
APIs but must not become package internals.

| Surface                                              | Classification                                     | Target disposition                                           |
| ---------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `app/page.tsx`, `app/cv/**`                          | App composition using Jim and CV concerns          | application workspace                                        |
| `app/api/graph/route.ts`                             | App adapter over graph publication                 | application workspace                                        |
| `app/api/accept-md/route.ts`                         | Generic protocol implemented through Next.js       | app adapter; reusable parsing may remain external dependency |
| `app/layout.tsx`, `app/not-found.tsx`                | Site shell and Jim-specific composition            | app with injected Jim-profile data                           |
| `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts` | App publication with Jim/site inputs               | app; consume Jim-profile and graph APIs                      |
| `app/globals.css`                                    | Mixed generic base, Jim theme, and CV print policy | split only when owning packages exist                        |
| `app/manifest.integration.test.ts`                   | App-level publication proof                        | co-locate with the application                               |

### Components — 19 code and test files

Tests follow the component they prove.

| Files                                                        | Classification                                                         | Target disposition                                                       |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `page-section*`, `prose*`, `rich-text.tsx`, `article-entry*` | Generic semantic document primitives                                   | candidate `packages/web-page`                                            |
| `skip-link.tsx`, `theme-provider.tsx`, `theme-toggle.tsx`    | Generic accessibility and theme shell                                  | candidate `packages/web-page`                                            |
| `markdown-page-link.tsx`                                     | Generic alternate-representation affordance with Next coupling         | app adapter or `web-page` only if framework seam is explicit             |
| `cv-layout*`                                                 | CV renderer mixed with Jim section order, PDF URL, and site URL        | split between `packages/cv`, `packages/jim-profile`, and app composition |
| `download-pdf-link.tsx`                                      | CV output affordance with app route and Jim filename                   | CV primitive with injected URL/name, assembled by app                    |
| `site-header*`, `site-footer*`, `logo.tsx`                   | Shell mechanics with injected identity but app navigation/brand policy | keep in app; reassess generic mechanics only after real consumers exist  |

### Library — 29 code and test files

Tests follow their production module unless they prove cross-package
integration, in which case the app owns them.

| Files                                                  | Classification                                                             | Target disposition                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `entities.ts`, `same-as.ts`                            | Mixed: reusable validation/selection plus Jim's configured graph/singleton | value APIs to `professional-profile-graph`; data to `jim-profile`         |
| `subgraph.ts`, `rewrite-jsonld-urls.ts`                | Reusable graph algorithms                                                  | `professional-profile-graph`                                              |
| `graph-media-type.ts`                                  | Reusable graph publication protocol                                        | `professional-profile-graph` or app adapter, chosen by consumer proof     |
| `jsonld.ts`                                            | Graph algorithm mixed with Jim graph and site URL                          | pure builder to graph package; configured instance to app/Jim profile     |
| `page-jsonld.ts`, `search-structured-data.ts`          | Professional-profile publication mixed with route and Jim composition      | pure rules to graph package; route binding to app                         |
| `schema-org-check.ts`                                  | Graph validation mixed with current Jim graph and page outputs             | generic validators to graph package; site completeness to app             |
| `cv-content.ts`                                        | CV model and validation mixed with Jim content and metadata                | model/parser to `cv`; instance and editorial values to `jim-profile`      |
| `page-document-contract.ts`                            | Site route identity, canonical CV semantics, and Jim section composition   | split across app, `cv`, and `jim-profile`; no retired tilt policy remains |
| `pdf-config.ts`                                        | Generic deploy/blob rules plus graph-derived configured Jim filename       | pure helpers to `cv`; configured filename/path to Jim profile/app         |
| `parse-markdown-links.tsx`, `strip-inline-markdown.ts` | Generic content rendering helpers                                          | candidate `web-page`                                                      |
| `site-config.ts`                                       | Generic deployment URL resolution configured for this site                 | app infrastructure; package only if another consumer appears              |

### E2E — 17 code files

The E2E suite under `e2e/` proves the deployed application: routes, journeys,
accessibility, content integrity, graph output, metadata, markdown negotiation,
and PDF behaviour. It belongs to the application workspace, not to domain packages.
Package contracts receive faster unit and integration tests; the app retains
end-to-end behavioural proof against a production build.

The retired audience route now has negative HTML, Markdown, graph-media, and
misleading-control proof; no tilt-specific positive journey remains.

### Scripts — 17 code and test files

| Files                              | Classification                                                     | Target disposition                               |
| ---------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `scripts/generate-pdf.ts`          | CV build operation tied to Next, Vercel Blob, and Jim route/output | app build adapter consuming CV/Jim configuration |
| `scripts/validate-*.mjs` and tests | Practice validation, independent of product runtime                | `tooling/practice-validation`                    |

The Practice validators should remain root-invoked because they govern the
whole repository, but their implementation and tests can live in their own
workspace.

### Visual regression — 12 code and test files

The engine under `visual-regression-harness/` is reusable tooling. At the
original census, its product-contract import was the boundary violation
preventing independent packaging. PR #39 removed that reach-back: the root now
supplies two routes, regions, expected sections, and allowances through a
validated contract with traversal, origin, duplicate, and artefact-collision
checks.

If the fresh extraction gate passes, move the engine and tests to
`tooling/visual-regression` without changing that dependency direction. The
tooling workspace must not import app or product source.

### Logo generator — 1 source file

`logo/generate-icons.ts` contains a reusable rendering algorithm and
Jim-specific initials, font, palette, paths, and output policy. It also reads
`spec/theme.json`, which is absent, while `logo/` is excluded from TypeScript
and ESLint coverage.

Do not create another workspace for it now. Repair or retire the generator
under a separate app/tooling slice. Extract an asset-generation package only
if another real configuration consumer appears.

### Root configuration — 14 tracked code/config files

`accept-md.config.js`, `proxy.ts`, `next.config.ts`, `postcss.config.mjs`, and
`vercel.json` are app or deployment configuration. `playwright.config.ts`
belongs with the app acceptance suite. While the app remains at root, its
manifest continues to own app dependencies and explicit orchestration scripts
invoke child workspaces. Package-local TypeScript, tests, and dependencies
remain independently owned. A pure orchestration manifest would exist only if
new evidence explicitly reopens and reverses the archived relocation
disposition.

The rest of the selected root set is `eslint.config.ts`, `prettier.config.ts`,
`tsconfig.json`, `visual-regression.config.ts`, its integration test,
`vitest.config.ts`, `vitest-setup.ts`, and `package.json`.

The present `next.config.ts` sets `typescript.ignoreBuildErrors: true`.
Workspace adoption must therefore make recursive package typechecking an
explicit blocking root command; a successful Next build is not type proof.

### Public content — 753 lines

| File                             | Current role                                                | Target disposition                                                           |
| -------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `content/entities.json`          | Jim's machine-readable graph and graph-owned identity atoms | `packages/jim-profile/content/graph/entities/` after Track B adoption design |
| `content/cv.content.json`        | Jim's canonical CV prose, entries, and section grouping     | facts/prose/composition under `jim-profile`; reusable model in `cv`          |
| `content/frontpage.content.json` | Jim's visible home-page prose and composition               | `jim-profile` prose/composition                                              |

The target content topology follows the adopted Track B B1 decision:

```text
packages/jim-profile/content/graph/
  entities/
  prose/
  composition/
```

These are storage and ownership layers inside one cohesive graph, not three
independent content systems.

### Private editorial boundary

The ignored private editorial boundary must remain:

- outside `pnpm-workspace.yaml`
- outside public build, test, lint, formatting, packaging, and dependency
  graphs
- absent from generated public artefacts and committed lockfiles
- unavailable to automated content synchronisation

At architectural altitude, private editorial material is neither runtime,
professional-profile graph machinery, CV rendering machinery, nor generic web
machinery. Public facts and prose are deliberate reviewed outputs, never a
mirror or automated derivative of a private source.

It must not become a submodule, package dependency, build input, or automated
sync source.

## Mixed seams that determine the migration order

| Seam                                 | Why it cannot move mechanically as one unit                            | Required split                                                          |
| ------------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `lib/entities.ts`                    | imports Jim data while declaring reusable schemas                      | parser/schema API accepts data; Jim instance is created outside package |
| `components/cv-layout.tsx`           | renderer still imports current section, site-reference, and PDF policy | CV renderer accepts composition and output links as inputs              |
| `lib/page-document-contract.ts`      | combines site route identity, canonical CV semantics, and Jim ordering | app route contract + CV section semantics + Jim composition             |
| `app/globals.css`                    | combines base tokens, Jim theme, layout, and print pagination          | generic base + CV print contract + Jim theme/app composition            |
| visual regression configuration seam | original tooling import reached into product source; now inverted      | preserve the injected app-owned contract if package extraction wins     |
| `lib/pdf-config.ts`                  | generic helpers derive a Jim filename from the configured Person       | pure helpers plus injected person/output configuration                  |
| `site-header.tsx`, `site-footer.tsx` | identity is injected, but navigation/control/brand policy is app-owned | keep app-owned; reassess only generic mechanics after real reuse        |
| `logo/generate-icons.ts`             | reusable algorithm contains Jim brand configuration                    | keep app-local until configuration has another consumer                 |

These seams are also the highest-value proof points: if the split produces
awkward or Jim-shaped package APIs, the candidate package boundary is wrong.

## Target dependency direction

```text
professional-profile-graph      web-page
             ^                     ^
             |                     |
             +--- jim-profile ---> cv
                       ^            ^
                       |            |
                       +--- root app+

tooling/visual-regression  <-- root/app-owned serialisable config
tooling/practice-validation <-- root invocation only
```

Rules:

- the application workspace may compose any product package.
- `packages/jim-profile` may depend on `packages/cv` and
  `packages/professional-profile-graph`.
- `packages/cv` may depend on `packages/web-page`.
- `web-page` and `professional-profile-graph` are inward leaves: neither may
  import CV, Jim profile, app, or tooling source.
- tooling may depend on published package contracts where genuinely generic,
  but must not reach into application source. Prefer serialisable configuration.
- no product package imports a tooling workspace.
- all packages are `private: true` initially and use `workspace:*` for internal
  dependencies. Publishing is a separate owner decision.

## Workspace extraction gate

A candidate becomes a workspace only when all of the following are true:

1. **Responsibility:** it has one coherent reason to change.
2. **Boundary value:** it has at least two meaningful consumers, or clear
   independent value in custody, verification, dependency weight, or lifecycle.
3. **Dependency direction:** its public API allows inward-only imports.
4. **Configuration:** generic or CV packages contain no Jim literals, content
   imports, route assumptions, or brand policy.
5. **Proof:** its contract can be tested without booting the Next app.
6. **Operational proportionality:** its manifest, TypeScript config, and build
   commands remove more ambiguity than they add.
7. **Migration:** every slice uses the intended final interface, switches a
   bounded consumer atomically, and leaves no bridge-only compatibility layer
   or duplicated source of truth.

**Losing condition:** if a package has one meaningful consumer and most of its
API is configuration for Jim's site, keep it as an internal module and enforce
the boundary with dependency rules.

**Programme stop condition:** if two consecutive product candidates fail the
gate, pause the plan family and reassess whether the modular monolith is the
right target.

## Build-versus-buy decision

Use native pnpm workspaces and TypeScript project boundaries.

| Option                | Disposition               | Reason                                                                      |
| --------------------- | ------------------------- | --------------------------------------------------------------------------- |
| pnpm workspaces       | Recommend                 | already pinned and sufficient for one deployable with a small package graph |
| Turborepo             | Defer                     | no demonstrated remote-cache, multi-deployable, or task-graph bottleneck    |
| Nx or Lerna           | Reject for this programme | adds governance and migration machinery without a current need              |
| internal modules only | Retain as fallback        | correct outcome for any candidate that fails the extraction gate            |

`dependency-cruiser` remains owned by the existing Dev-Tooling Hygiene plan.
The workspace family consumes that decision and later updates its rules; it
does not create a competing architecture-gate programme.

## Sequencing constraints

1. Do not replace the current primary active plan. This family stays in
   `current/` until Jim promotes one child.
2. Track B gates Jim-profile composition, binding, adoption, and completeness.
   It does not gate already-stable graph schemas/parsers/algorithms or Jim-free
   CV renderer seams that explicitly accept composition as input.
3. Preserve ADR-021's canonical-only boundary; do not reintroduce retired tilt
   policy through a package API.
4. Treat the landed dependency tranche as inherited state; reconcile the six
   parked majors and dependency-cruiser work so lockfile, config, and boundary
   changes are not performed twice.
5. Sequence R keeps the app at the root. Reopening the archived relocation
   disposition requires new evidence and an explicit owner decision before the
   first package move.
6. Reassess the landed visual-configuration seam, then let the
   visual-regression child create the workspace file and first real child
   workspace only if its extraction gate passes.
7. Extract Practice validation separately after a fresh live validator,
   manifest, workspace, and lockfile custody check; serialize all manifest and
   lockfile edits.
8. Extract stable graph and CV boundaries independently, then run Jim-profile
   adoption after Track B supplies its remaining decisions; inherit ADR-021's
   settled canonical-only CV boundary.
9. Attempt `web-page` last and keep weak candidates internal.

## Unresolved evidence

- Whether generic web primitives will have a second meaningful in-repo consumer
  after CV extraction. This determines whether `web-page` is a package or an
  app-internal module.
- The exact Track B composition and completeness APIs. Those are intentionally
  not invented here.
- Whether the required per-route `targetOnlyExpectedSectionIds` allowance is
  the clearest final extracted-package policy API. Configuration injection and
  the no-app-import constraint are settled; the comparison-algorithm-shaped
  flag must be reassessed before movement.
- Whether the repaired logo generator has any reuse value beyond this app.
- Whether independent package builds are necessary or source-imported private
  packages are the simpler initial model.

## Changed assumptions

- The original three buckets became five because professional-profile graph
  logic and tooling/private custody are not CV details.
- “Before Oak”, the current section order, headings, and pagination are Jim's
  composition, not generic CV policy.
- A monorepo does not imply publishing or multiple deployments.
- The seven-workspace diagram is a hypothesis and stopping rule, not a target
  count.
- Tooling is the strongest semantic extraction and gets the first attempts; the
  first child that actually passes creates the workspace substrate while the
  app remains at root.
- App relocation is archived as Not Selected under Sequence R; no current child
  waits on it.
- Track B is a prerequisite only for composition, binding, adoption, and
  completeness contracts. Pure graph and Jim-free CV seams can proceed without
  inventing those decisions.
- Independence comes from final stable interfaces, single-source consumer
  cutovers, and green pause points—not temporary shims or parallel branches.
- A green configuration seam is itself a complete publication unit. It does
  not need a workspace manifest or mechanical package move in the same PR.

## Plan family

- [Workspace Architecture Roadmap](../current/workspace-architecture-roadmap.plan.md)
- [Optional App Relocation](../archive/optional-app-relocation.plan.md)
- [Visual Regression Workspace](../current/visual-regression-workspace.plan.md)
- [Practice Validation Workspace](../current/practice-validation-workspace.plan.md)
- [Professional Profile Graph Workspace](../current/professional-profile-graph-workspace.plan.md)
- [CV Workspace](../current/cv-workspace.plan.md)
- [Jim Profile Workspace](../current/jim-profile-workspace.plan.md)
- [Web Page Workspace and Boundary Enforcement](../current/web-page-workspace-and-boundary-enforcement.plan.md)

## Report completion criteria

- every tracked source family is dispositioned
- public and private content boundaries are explicit
- observed current state is separate from the accepted target
- the strongest alternative and its winning condition are preserved
- the topology has a falsifier, per-package losing condition, and programme
  stop condition
- unresolved evidence is carried into the child plan that can prove it
