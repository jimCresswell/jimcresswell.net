# Napkin

## Session: 2026-04-03 — Start-right and project-spec as core skills

### What Was Done

- Moved **start-right** and **project-spec-creation** from `.agent/prompts/` to
  **`.agent/skills/`** (canonical), with **Cursor** and **Codex** thin adapters.
- **`jc-start-right`** command and **`.agents/skills/jc-start-right`** now read
  `.agent/skills/start-right/SKILL.md` instead of a prompt file.
- Updated **AGENT.md**, **practice-index**, **practice-bootstrap**,
  **practice-lineage**, **practice.md**, and **`.agent/README.md`** so session
  entry is skill-based; track prompts remain under `prompts/`.

### Patterns to Remember

- **Session grounding** = `start-right` skill, not a prompt. **Generative UI
  handoff packs** = `project-spec-creation` skill.

## Session: 2026-03-21 — Active plan lives in `plans/active/`

### What Was Done

- Moved **Track B source-of-truth design** into **`active/personal-knowledge-graph-source-of-truth-design.plan.md`** (no separate `CURRENT.md`; **`active/README.md`** names the file and when to move plans on focus change).
- Updated cross-links from `current/` → `active/` across roadmap, research,
  prompts, PKG skill, and parent plans.
- **Start Right**, **AGENT.md**, **jc-consolidate-docs**, and **practice-bootstrap**
  now describe **`active/`** as the folder that holds the real primary plan file.

### Patterns to Remember

- **`current/`** holds other in-flight plans; the **primary** execution plan file
  lives under **`active/`**. Reconcile **roadmap** and **`active/README.md`**
  when moving plans in or out.

## Session: 2026-03-09 — Track A External Validator Boundary Closure

### What Was Done

- Continued from the existing Track A Phase A4 proof record rather than
  starting a new audit
- Re-checked whether the remaining `/cv/` Schema.org evidence and any stable
  Google Rich Results Test verdict could be captured cleanly from this
  automation environment
- Confirmed three reinforcing external limits:
  direct fetch of `https://www.jimcresswell.net/cv/` now returned Cloudflare's
  managed challenge page, `https://validator.schema.org/` redirected straight
  to Google's anti-abuse `sorry` flow, and `https://search.google.com/test/rich-results`
  exposed only the tool shell with no stable non-browser submission path
- Updated the Track A proof note and live plan stack so the remaining external
  gap is recorded as an accepted validator-side boundary rather than left open
  indefinitely
- Marked the Track A external-validation handoff prompt as completed and
  updated the Track B entry-condition note so the next session does not restart
  Phase A4 by mistake

### Mistakes Made

- Went straight to live external fetches before settling the local-preflight
  question. For this slice the final decision still had to stay anchored to the
  live/public path, but the local-vs-live split should be stated earlier.
- Tried to use a long-running local `pnpm dev` session as a preflight source.
  In this sandbox, a dev server started in one exec session was not reachable
  from separate commands, so that path was not a reliable way to inspect local
  output.

### Patterns to Remember

- If the live page fetch itself is now blocked by Cloudflare and the official
  validator homepage is already redirecting to anti-abuse, treat that as
  positive evidence that the remaining gap is validator-side boundary rather
  than open proof debt.
- For this environment, do not spend long trying to curl a dev server started
  in a separate interactive exec session. Prefer existing local proof surfaces
  or a purpose-built background approach if local preflight is genuinely needed.

## Session: 2026-03-09 — Consolidate Docs and Track B Handoff

### What Was Done

- Ran the consolidate-docs pass after closing Track A
- Confirmed there was no incoming practice-core payload, no distillation
  rotation needed, and no directive or permanent-doc fitness ceiling breach
- Promoted Track B design to the active graph task in the roadmap and
  source-of-truth design plan now that Track A is complete
- Added a new active handoff prompt for the first Track B slice:
  `.agent/prompts/personal-knowledge-graph-track-b-source-of-truth-design.prompt.md`
- Updated the completed Track A prompts so they now point to the active Track B
  handoff instead of a completed Track A prompt

### Patterns to Remember

- When a track closes, consolidation is not finished until the active handoff
  chain points at the true next task. Completed prompts that still point to
  completed prompts are stale even if the plans are correct.
- For multi-track programmes, the roadmap todo states and the next-session
  prompt should change in the same pass. Otherwise the status summary and the
  operator handoff diverge immediately.

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

## Session: 2026-03-09 — Track B Layer Map and Worked Ownership Examples

### What Was Done

- Recorded the first Track B B1 design note in
  `.agent/plans/research/graph-source-of-truth-layer-map.md`
- Defined the target as one cohesive graph spread across distinct ownership
  layers for facts, authored prose, and composition
- Worked the ownership rules through concrete `/` and `/cv` examples, including
  tilt behaviour
- Updated the live Track B plan, roadmap, and active handoff prompt so the next
  session starts from B2 rather than re-opening B1
- Ran the consolidate-docs sweep and corrected two stale live planning docs:
  `.agent/plans/roadmap.md` and
  `.agent/plans/current/cv-editorial-improvements.plan.md`
- Collapsed two completed Track A prompts to clean completion records after the
  consolidate-docs sweep exposed stale active-task instructions under their
  completed headers
- Ran the required gate sequence in order:
  `pnpm format:fix`, `pnpm markdownlint:fix`, `pnpm lint:fix`,
  `pnpm typecheck`, `pnpm test`, `pnpm knip`, `pnpm gitleaks`,
  `pnpm test:e2e`
- Re-ran `pnpm test:e2e` after one transient failure and confirmed the suite
  passed on the unchanged worktree
- Stabilised the branded-404 Playwright proof with a small helper that reloads
  once only when the Next.js runtime chunk overlay appears instead of the page
- Promoted the Next.js chunk-overlay troubleshooting pattern into
  `.agent/memory/distilled.md` because it cleared the bar for stable,
  repo-specific troubleshooting guidance

### Mistakes Made

- The first framing risked sounding like three separate silos. Tightened it so
  the design now says explicitly that multiple source files still resolve into
  one cohesive graph through stable IDs.
- The first full Playwright rerun surfaced a transient Next.js
  `Runtime ChunkLoadError` overlay on `/cv/nonexistent`, which made the
  invalid-variant 404 assertion fail even though the unchanged worktree passed
  on immediate rerun.
- The first documentation pass missed stale status lines in the broader roadmap
  and parent editorial plan. The consolidate-docs sweep needs to cover the plan
  index layer, not only the active graph plan stack.
- Two completed Track A prompts still contained obsolete active-task bodies.
  A completion banner alone was not enough; the stale instructions underneath
  still made the handoff chain misleading.

### Patterns to Remember

- For Track B design, separate storage boundaries from semantic boundaries:
  multiple files can still be one graph if ownership and IDs are explicit.
- Durable identity statements can stay in the facts layer when they are
  first-class domain claims; page-only connective copy belongs in authored
  prose; route exposure and canonical behaviour stay in composition.
- For doc-only graph design slices, capture explicitly why the visual
  regression harness was not required so the proof boundary stays visible.
- If Playwright fails with a Next.js runtime chunk overlay rather than an app
  assertion mismatch, inspect the artefact first and rerun on the unchanged
  worktree before assuming the current slice caused a regression.
- When the overlay is a known dev-server chunk-load failure and the product
  behaviour is otherwise correct, keep the mitigation in a narrow E2E helper
  rather than changing app code or weakening the assertion.
- After graph-plan status changes, re-check `.agent/plans/roadmap.md` and any
  parent plan tables, not only the active track plans and prompts.
- When a prompt becomes complete, strip or replace the old task body instead of
  only prepending a completion note. Otherwise the prompt still carries stale
  execution truth.

## Session: 2026-03-14 — Consolidate-Docs Rule Tightening

### What Was Done

- Promoted the remaining useful detached-worktree workflow lesson into
  `.agent/commands/jc-consolidate-docs.md`
- Made the command say explicitly that track- or phase-status changes must
  reconcile the active plan stack, `.agent/plans/roadmap.md`, and parent-plan
  summary tables in the same pass

### Patterns to Remember

- For plan-stack status changes, upstream summaries are part of the same source
  of truth update; do not leave roadmap or parent-plan tables to "catch up"
  later.

## Session: 2026-04-03 — Practice Core And Tooling Alignment

### What Was Done

- Updated the local Practice Core from the older six-file/frontmatter model to
  a seven-file package with `provenance.yml` and four-field fitness metadata
- Added a local cross-platform surface contract in `.agent/reference/` and
  wired `scripts/validate-portability.mjs` into `pnpm check`
- Added `scripts/validate-practice-fitness.mjs` plus package commands for
  strict and informational Practice/doc fitness checks
- Aligned local wrappers and adapter names so `deslop`, `pkg`, `start-right`,
  and `read-practice` match the canonical `.agent/` layer
- Reconciled README, CONTRIBUTING, requirements, ADR-005, and agent docs with
  the real hook and script behaviour
- Ran a consolidate-docs sweep on the PKG handoff chain, fixed stale prompt
  links that still pointed at the old `new-cv` repo, and converted those
  prompt references to repo-relative links
- Tightened `jc-consolidate-docs` so live plan and prompt docs explicitly
  prefer repo-relative links over hard-coded absolute workspace paths
- Revisited the incoming provenance UUID migration proposal after the refreshed
  note landed, adopted it locally, and migrated trinity provenance from
  positional `index` fields to UUID v4 `id` fields
- Updated Practice Core, outgoing rationale, and local reference wording so
  chronology now lives in chain order and `date` while integration still
  compares detailed content
- Cleared the integrated UUID migration note from
  `.agent/practice-context/incoming/`
- Ran a follow-up consolidate-docs sweep and corrected `.agent/README.md`
  where the active Track B plan was still labelled `Planned` instead of
  reflecting the live in-progress state
- Tightened `jc-consolidate-docs` again so repo-local overview tables or
  READMEs that advertise live plan state must be reconciled alongside the
  active plan stack and roadmap

### Mistakes Made

- It was easy to let positional provenance indexes look like stable identity.
- Non-Practice tooling docs can drift quietly even when the canonical Practice
  docs are correct; checking only Practice files is not enough.
- Live prompt stacks can still carry stale repo-root paths even after status
  and content are otherwise current.
- The first pass on the UUID migration was too conservative because the local
  invariant was not stated sharply enough: chronology and identity needed to
  be separated without weakening the detailed-comparison rule.
- Repo-level overview docs can drift on plan status even when the active plan
  stack itself is correct.

### Patterns to Remember

- Provenance entry IDs are UUIDs for stable reference. Chain order and `date`
  carry chronology.
- UUIDs remove index-as-version confusion, but integration still compares the
  detailed content and each entry's `repo`, `date`, and `purpose` instead of
  reducing the decision to shorthand matching.
- In a multi-platform agent repo, supported and unsupported surfaces need an
  explicit written contract. Missing files are not a reliable signal.
- Portability validation and Practice fitness validation solve different
  problems. Keep portability blocking in the main gate; keep doc-fitness
  advisory unless the task explicitly needs strict enforcement.
- Repo-facing tooling docs are part of the execution contract. When hooks,
  scripts, or gate counts change, update README, CONTRIBUTING, ADRs, and
  Practice docs in the same pass.
- In live plans and prompts, prefer repo-relative links from the file's own
  directory. Hard-coded absolute workspace paths drift when repos move or are
  renamed.
- When a Practice-format migration is non-obvious, write down the exact local
  invariant it preserves. That makes it much easier to judge whether it really
  clears the bar here.
- If a repo README or overview table advertises live plan state, reconcile it
  in the same pass as the roadmap and active plan stack.
