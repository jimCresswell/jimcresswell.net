# Napkin

## Session: 2026-03-09 — Track A External Validator Evidence

### What Was Done

- Continued Track A Phase A4 from the live execution handoff rather than
  starting a new audit
- Captured the first external-validator evidence note in
  `.agent/plans/research/graph-rich-result-external-validator-evidence.md`
- Recorded a successful Schema.org Validator code-mode result for the deployed
  home-page inline JSON-LD snippet: zero errors, zero warnings
- Recorded the live validator-side limitations that blocked clean external
  proof closure:
  Schema.org URL mode initially claimed the live home URL was not reachable,
  later requests were redirected into Google's anti-abuse `sorry` flow, and
  Google Rich Results Test returned `Something went wrong` for both `/` and
  `/cv/`
- Updated the roadmap, execution plan, and adjacent proof notes so the new A4
  note is discoverable and Track A remains explicitly active in Phase A4
- Ran a follow-up consolidate-docs pass to update the active A4 handoff prompt
  and the negotiated-media-type slice note so the next session starts from the
  partial external-validator evidence rather than re-opening already-captured
  proof
- Ran the required gate sequence in order:
  `pnpm format:fix`, `pnpm markdownlint:fix`, `pnpm lint:fix`,
  `pnpm typecheck`, `pnpm test`, `pnpm knip`, `pnpm gitleaks`,
  `pnpm test:e2e`

### Mistakes Made

- Started by trying to drive the validator UIs repeatedly. With these tools,
  repeated automation attempts can trigger anti-abuse behaviour quickly and
  make later runs less useful than the first successful one.

### Patterns to Remember

- For Track A external validation, start with the emitted live inline JSON-LD
  snippet and use validator code mode before spending time on URL mode.
- Record exact external-tool messages. For this slice, the important proof was
  not only the home Schema.org pass but also the difference between semantic
  validator feedback and validator-side infrastructure failure.
- If external validators become unstable, update the live proof note and keep
  Phase A4 active. Do not silently treat missing external proof as closed.
- When the proof note changes phase handoff truth, update the active prompt in
  the same pass. Otherwise the next session starts from stale instructions even
  when the plans are accurate.

## Session: 2026-03-09 — Consolidate Docs

### What Was Done

- Ran the consolidate-docs pass across the live Track A plan stack and related
  practice docs
- Corrected one stale research-note handoff: the negotiated media-type slice
  note still listed the home-page JSON-LD proof and manifest proof as open even
  though later A3 slices had closed them
- Reconciled the distillation threshold wording so the distillation skill and
  `jc-consolidate-docs` now both use the same `~500`-line trigger
- Tightened the consolidate-docs command so it explicitly checks slice notes
  with "remaining" or "next" sections, not only current-state, audit, and
  execution plans
- Added a fresh-session prompt for the next Track A slice: tighter CV metadata
  description proof for `/cv` and `/cv/[variant]`
- Archived the previous napkin to
  `.agent/memory/archive/napkin-2026-03-09.md`

### Mistakes Made

- Let the first consolidation read focus on current-state and execution docs
  before checking the slice-specific research note. In this repo, slice notes
  can carry live handoff truth too.

### Patterns to Remember

- When closing a proof gap, re-check every place that has a "what remains",
  "next session", or "follow-on" section. Those sections drift more easily than
  status headers.
- If Playwright proof needs graph-backed expectations, prefer raw JSON fixture
  imports in the E2E layer and keep direct app-module contract proof in Vitest.

## Session: 2026-03-09 — Track A CV Metadata Description Proof

### What Was Done

- Confirmed that `/cv` and `/cv/[variant]` already derive `description` and
  `openGraph.description` from `person.description` through `lib/cv-content.ts`
- Added module-level proof in `lib/page-document-contract.integration.test.ts`
  that the base CV metadata export and active tilt metadata generation keep
  those description fields aligned with `person.description`
- Added emitted-route proof in `e2e/behaviour/seo.e2e-api.test.ts` that `/cv`
  and `/cv/public_sector` emit matching `description` and `og:description`
  fields in the rendered `<head>`
- Recorded the slice in
  `.agent/plans/research/graph-cv-metadata-description-proof.md`
- Updated the live Track A and Track B handoff docs so they stop claiming that
  A3 is still the active phase
- Replaced the stale A3 handoff prompt with a new Track A Phase A4 external
  validation prompt and marked the old prompt as completed
- Fixed an unrelated gate-revealed accessibility issue in
  `components/theme-toggle.tsx`: the pre-hydration fallback labels were too
  faint in light theme and failed axe on `/cv/public_sector`
- Ran the visual-regression harness because that accessibility fix changed
  rendered header output; review showed only non-visual `site-header.html`
  diffs with zero pixel differences across `/`, `/cv`, and `/cv/public_sector`

### Mistakes Made

- None in the implementation slice. The main risk was stale plan truth after
  the proof landed, so the docs needed updating in the same pass.

### Patterns to Remember

- If a Track A slice is proof-only, capture why the visual regression harness
  was not needed. The repo rule is about rendering risk, not about every graph
  adjacent change.
- For metadata proof, split the contract by layer: Vitest for metadata exports,
  Playwright for emitted head fields.
- Axe can catch pre-hydration fallback states that route-level SEO and content
  checks never exercise directly. If a client component renders a placeholder
  before mount, its contrast still has to pass.
