# Onboarding and Documentation Review

Fix all documentation so a junior developer can go from `git clone` to confident contribution within a few hours. Every file path, command, and cross-link must be accurate. Every document must be clear, complete, and navigable.

## Status: Complete

## How to use this plan

This plan is structured in four sequential phases. Complete each phase fully before moving to the next. Within each phase, tasks are listed in execution order. Within each task, sub-tasks are listed in execution order. Do not skip steps. Run quality gates at the end of each phase.

### Before starting

1. Read `.agent/directives/AGENT.md` and `.agent/directives/rules.md`.
2. Read this entire plan to understand the full scope.
3. Ensure all prior changes are committed or intentionally staged. Uncommitted changes from other work are fine as long as they will be included in the final commit.

### Quality gate checkpoints

After each phase, run:

```bash
pnpm format
pnpm check
```

If either fails, fix before proceeding. Do not batch fixes across phases.

---

## Phase 1: Root README restructure and accuracy fixes

**Goal:** Make `README.md` accurate in every file path, command, and description. Restructure so a new reader encounters information in the order they need it.

**File:** `README.md`

---

### Task 1.1: Reorder sections

**Current order:** Title/Overview, Routes, Getting Started, Development Commands, Project Structure, Key Design Decisions, Quality Gates, Stack, Documentation, Agent Directives, Licence.

**Target order:**

1. Title / Overview
2. Getting Started
3. Development Commands
4. Project Structure (absorb Routes as a subsection)
5. Key Design Decisions
6. Quality Gates
7. Stack
8. Documentation
9. Development Standards (renamed from "Agent Directives")
10. Licence

**Steps:**

1. Read the full current `README.md`.
2. Move the `## Getting Started` section (including its Prerequisites) to immediately after `## Overview`. Preserve all content within the section.
3. Move the `### Routes` table from its current position into the `## Project Structure` section, placing it immediately after the directory tree as a `### Routes` subsection.
4. Move the `## Development Commands` section to immediately after `## Getting Started`.
5. Rename `## Agent Directives` to `## Development Standards`.
6. Verify the new order matches the target list above.

**Acceptance criteria:**

- The section order in `README.md` matches the target order exactly.
- No content has been lost or duplicated.
- All markdown heading levels are correct (`##` for top-level sections, `###` for subsections).

---

### Task 1.2: Fix Prerequisites in Getting Started

**Current content:** "**Prerequisites**: Node.js 24, pnpm"

**Problem:** Node.js 24 is not LTS (most developers have 18 or 20). gitleaks is required by `pnpm check` (and therefore every commit) but not listed. Playwright browsers are required for E2E tests but not mentioned.

**Steps:**

1. Find the line `**Prerequisites**: Node.js 24, pnpm` in the Getting Started section.
2. Replace it with a bullet list:

```markdown
**Prerequisites:**

- **Node.js 24** — use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage versions
- **pnpm** — the only supported package manager (`npm install -g pnpm`)
- **gitleaks** — secret scanning, required by quality gates (`brew install gitleaks` on macOS, see [gitleaks releases](https://github.com/gitleaks/gitleaks/releases) for other platforms)
```

3. After the existing `pnpm dev` line in the Getting Started code block, add a note about Playwright:

```markdown
To run E2E tests, install Playwright browsers once after `pnpm install`:

\`\`\`bash
pnpm exec playwright install
\`\`\`
```

**Acceptance criteria:**

- Prerequisites list includes Node.js 24 with version manager suggestion, pnpm, and gitleaks.
- Playwright browser install command appears in Getting Started.
- No other content in Getting Started is changed.

---

### Task 1.3: Fix Development Commands and Quality Gates code blocks

**Problems:**

- E2E commands (`test:e2e`, `test:e2e:pdf`, `test:e2e:ui`) are missing from Development Commands.
- `pnpm check` comment says "format" in **two** places: the Development Commands code block and the Quality Gates code block. Both should say "format-check" because the `check` script runs `format-check` (read-only), not `format` (write).

**Steps:**

1. In the Development Commands code block, change the `pnpm check` comment from:

   ```
   pnpm check          # All checks: format, lint, type-check, test, knip, gitleaks
   ```

   to:

   ```
   pnpm check          # All gates: format-check, lint, type-check, test, knip, gitleaks
   ```

2. Add the following E2E commands to the Development Commands code block, grouped after the existing test commands:

   ```
   pnpm test:e2e       # E2E tests — default project (Playwright, requires browsers installed)
   pnpm test:e2e:pdf   # E2E tests — PDF project (requires production build on :3001)
   pnpm test:e2e:ui    # Playwright UI mode (interactive)
   ```

3. In the Quality Gates section, change the `pnpm check` comment from:
   ```
   pnpm check          # All gates: format, lint, type-check, test, knip, gitleaks
   ```
   to:
   ```
   pnpm check          # All gates: format-check, lint, type-check, test, knip, gitleaks
   ```

**Acceptance criteria:**

- Both `pnpm check` comments (Development Commands and Quality Gates) say "format-check" not "format".
- Three E2E commands are listed in Development Commands with accurate descriptions.
- No other commands are changed.

---

### Task 1.4: Fix Project Structure tree

**Problems:**

- `public/manifest.webmanifest` is listed but does not exist (the manifest is generated dynamically by `app/manifest.ts`).
- `app/manifest.ts` is not listed.
- `e2e/` directory is missing.
- `lib/jsonld.ts` and `lib/strip-inline-markdown.ts` are missing.
- `prose.tsx` is missing from the components list (it is a key architectural component — the primary content renderer).

**Steps:**

1. In the `app/` section of the Project Structure tree, add `manifest.ts` with the comment `# Dynamic Web App Manifest generation`. Place it after `sitemap.ts`.

2. In the `components/` section, add the following after `rich-text.tsx`:
   - `prose.tsx` with the comment `# Content paragraph renderer`
   - `page-section.tsx` with the comment `# Reusable page section with heading`
   - `article-entry.tsx` with the comment `# Individual article/experience entry`

3. In the `lib/` section, add:
   - `jsonld.ts` with the comment `# Schema.org JSON-LD structured data builder`
   - `strip-inline-markdown.ts` with the comment `# Strips markdown syntax for plain-text contexts`

4. Add a new `e2e/` section to the tree, after `scripts/`:

   ```
   e2e/                    # End-to-end tests (Playwright)
     journeys/             # User story journey tests
     behaviour/            # Cross-cutting behavioural tests (a11y, SEO, content)
   ```

5. In the `public/` section, remove the line `manifest.webmanifest  # PWA manifest`. This file does not exist.

6. Verify all listed paths exist by running: `ls <path>` for each entry in the tree.

**Acceptance criteria:**

- Every path listed in the Project Structure tree exists on disk.
- No non-existent paths are listed.
- `e2e/` directory appears in the tree.
- `app/manifest.ts`, `lib/jsonld.ts`, `lib/strip-inline-markdown.ts`, `components/prose.tsx`, `components/page-section.tsx`, and `components/article-entry.tsx` all appear.
- `public/manifest.webmanifest` does not appear.

---

### Task 1.5: Improve Quality Gates section

**Current content mentions `pnpm check` and describes what it runs, but omits context a junior needs.**

**Steps:**

1. Read the current Quality Gates section in `README.md`.
2. After the existing description of what `pnpm check` runs, add a paragraph:

   ```markdown
   The pre-commit hook ([Husky](https://typicode.github.io/husky/)) runs `pnpm check` automatically on every commit. Husky is installed by the `prepare` script when you run `pnpm install` — no manual setup needed. The checks are chained with `&&` (fail-fast): if any step fails, subsequent steps do not run. Expect commits to take ~10-15 seconds.
   ```

3. After the Quality Gates section (before Stack), add a brief note about environment variables:

   ```markdown
   **Local development** works without any environment variables. `.env.local` is only needed to test the full Vercel Blob PDF path (see [architecture docs](docs/architecture/README.md) for details).
   ```

**Acceptance criteria:**

- Husky is named and explained.
- The fail-fast behaviour is documented.
- Expected commit time is noted.
- Local dev without env vars is noted.

---

### Task 1.6: Reframe Agent Directives as Development Standards

**Current content:** "AI agents working on this codebase should read `.agent/directives/AGENT.md` first."

**Problem:** This frames the development rules as AI-only. Human contributors would skip them and then violate them. The rules, testing strategy, and identity guidelines apply to all contributors.

**Steps:**

1. Find the `## Agent Directives` heading in `README.md`.
2. Replace the entire section with:

   ```markdown
   ## Development Standards

   This project has explicit rules for code quality, testing, and editorial voice that apply to all contributors — human and AI.

   - [`.agent/directives/AGENT.md`](.agent/directives/AGENT.md) — Project context, commands, structure (start here)
   - [`.agent/directives/rules.md`](.agent/directives/rules.md) — Development rules: TDD, type safety, code quality
   - [`.agent/directives/testing-strategy.md`](.agent/directives/testing-strategy.md) — Testing philosophy, test types, naming conventions
   - [`.agent/directives/editorial-guidance.md`](.agent/directives/editorial-guidance.md) — Jim's editorial voice and identity (read before any content work)
   ```

**Acceptance criteria:**

- Section heading is `## Development Standards`.
- All four directive files are linked.
- The framing makes clear these apply to all contributors, not just AI.

---

### Task 1.7: Link orphaned docs from Documentation section

**Problem:** `e2e/README.md` is not linked from anywhere. It is discoverable only by browsing the filesystem.

**Steps:**

1. In the `## Documentation` section, add a bullet:
   ```markdown
   - [e2e/](e2e/) — E2E test organisation, naming conventions, and test map
   ```

**Acceptance criteria:**

- `e2e/README.md` is reachable from the root README via the Documentation section.

---

### Task 1.8: Fix client component count in Key Design Decisions

**Problem:** The Key Design Decisions section says: "Only two components use `"use client"`: the theme toggle and the theme provider. Everything else is server-rendered." This is wrong. There are three `"use client"` components: `ThemeToggle`, `ThemeProvider`, and `SiteHeader`. This is the same error fixed in ADR-003, ADR-004, and the architecture README — but it also appears here.

**Steps:**

1. In the Key Design Decisions section, find:
   ```
   **Server components by default** — Only two components use `"use client"`: the theme toggle and the theme provider. Everything else is server-rendered.
   ```
2. Replace with:
   ```
   **Server components by default** — Only three components use `"use client"`: the theme toggle, the theme provider, and the site header. Everything else is server-rendered.
   ```

**Acceptance criteria:**

- The client component count is 3.
- All three client components are named.
- The claim is consistent with ADR-003, ADR-004, and the architecture README (all fixed in Phase 2 and 3).

---

### Phase 1 checkpoint

Run `pnpm format && pnpm check`. Both must pass. Then visually read the full `README.md` top to bottom and verify the flow makes sense for someone who has never seen the project.

---

## Phase 2: ADR fixes

**Goal:** Fix all factual inaccuracies in ADRs so they match the current codebase. Remove line number references that rot quickly unless they add essential context.

---

### Task 2.1: Fix ADR-003 (Print button removed)

**File:** `docs/architecture/decision-records/003-print-button-removed.md`

**Problems identified:**

1. Describes `SiteHeader` as having an `actions` prop. The component was refactored to be self-contained — it takes no props and uses `usePathname()` internally to decide what to show.
2. Claims removing the print button "eliminates the only remaining `"use client"` component on CV pages" — false. `SiteHeader`, `ThemeToggle`, and `ThemeProvider` are all `"use client"` and rendered on CV pages.
3. "How to restore" section references the old `actions` prop pattern. Following those instructions would not work.
4. Print CSS line range is stated as "lines 222-425" — actual range is approximately lines 234-434 in `app/globals.css`.

**Steps:**

1. Read the full ADR-003.
2. Find any reference to `SiteHeader` accepting an `actions` prop. Replace with a description of the current architecture: `SiteHeader` is self-contained, uses `usePathname()` to detect CV pages, and conditionally renders `DownloadPdfLink` when on a CV route.
3. Find the claim about eliminating the last `"use client"` component. Replace with: "The print button was the only component that existed solely for a client-side action (triggering `window.print()`). The remaining client components (`SiteHeader`, `ThemeToggle`, `ThemeProvider`) serve other purposes."
4. Find the "How to restore" section. Rewrite for the current architecture. The steps should be:
   - Create a new `PrintButton` client component that calls `window.print()`.
   - In `SiteHeader`, add it alongside `DownloadPdfLink` in the conditional CV-page block.
   - The comprehensive `@media print` CSS in `app/globals.css` already handles print layout.
5. Remove or generalise specific line number references (e.g. "lines 222-425"). Instead say "the `@media print` block in `app/globals.css`".
6. Save the file.

**Acceptance criteria:**

- No reference to a `SiteHeader` `actions` prop.
- Client component claim is factually correct.
- "How to restore" section would work if followed with the current codebase.
- No stale line number references.

---

### Task 2.2: Fix ADR-005 (Knip unused code detection)

**File:** `docs/architecture/decision-records/005-knip-unused-code-detection.md`

**Problems identified:**

1. States "There is no `knip.json` or `knip` field in `package.json`" — false. There is a `knip` field in `package.json` with `ignore` and `ignoreBinaries` configuration.
2. The `pnpm check` pipeline description omits `gitleaks`.

**Steps:**

1. Read the full ADR-005.
2. Find the sentence that says there is no `knip` config. Replace with: "Configuration is minimal — a `knip` field in `package.json` ignores the `.agent/temp/` working directory and the `gitleaks` system binary."
3. Find any description of the `pnpm check` pipeline. Update to include `gitleaks` at the end: `format-check → lint → type-check → test → knip → gitleaks`.
4. Save the file.

**Acceptance criteria:**

- The ADR accurately describes the knip configuration that exists.
- The `pnpm check` pipeline includes all six steps.

---

### Task 2.3: Reconcile PDF size in ADR-002 and architecture README

**Files:** `docs/architecture/decision-records/002-pdf-serving-architecture.md` and `docs/architecture/README.md`

**Problem:** ADR-002 says "~195 KB", architecture README says "~165 KB". One or both are wrong.

**Steps:**

1. Check the actual current PDF size. Run:

   ```bash
   pnpm build 2>/dev/null; ls -la .next/Jim-Cresswell-CV.pdf
   ```

   If no local build exists, note this and use the most recently documented size (~165 KB from the architecture README, which was more recently edited).

2. In ADR-002, find the "~195 KB" reference and update to match the actual size.
3. In `docs/architecture/README.md`, find the "~165 KB" reference and update to match the actual size.
4. Both documents must state the same size.

**Acceptance criteria:**

- ADR-002 and `docs/architecture/README.md` state the same PDF size.
- The stated size matches reality (or the best available evidence).

---

### Task 2.4: Fix ADR-004 (Storybook deferred)

**File:** `docs/architecture/decision-records/004-storybook-deferred.md`

**Problems identified:**

1. Says "only 2 are client components (`ThemeToggle`, `SiteHeader`)" — `ThemeProvider` is also `"use client"`, making it 3.
2. Links to `.agent/plans/component-audit.plan.md` which was moved to `.agent/plans/complete/component-audit.plan.md`.

**Steps:**

1. Read the full ADR-004.
2. Find the client component count. Change "2" to "3" and add `ThemeProvider` to the list.
3. Find the link to `component-audit.plan.md`. Update the path to `complete/component-audit.plan.md`.
4. Save the file.

**Acceptance criteria:**

- Client component count is 3 (`ThemeToggle`, `SiteHeader`, `ThemeProvider`).
- Link to component-audit plan resolves to the correct file.

---

### Phase 2 checkpoint

Run `pnpm format && pnpm check`. Both must pass.

---

## Phase 3: Architecture README and other docs fixes

**Goal:** Fix remaining inaccuracies in architecture README, docs README, requirements, and .agent README.

---

### Task 3.1: Fix architecture README client component list

**File:** `docs/architecture/README.md`

**Problem:** Under "Key Principles", the parenthetical says "(theme toggle, theme provider)" but `SiteHeader` is also `"use client"`.

**Steps:**

1. Find the sentence about client components in the Key Principles section. It currently reads something like: "Client components only where browser APIs are needed (theme toggle, theme provider)."
2. Change to: "Client components only where browser APIs are needed (theme toggle, theme provider, site header)."
3. Save the file.

**Acceptance criteria:**

- All three client components are named in the Key Principles section.

---

### Task 3.2: Reframe docs/README.md agent directives link

**File:** `docs/README.md`

**Problem:** The "Related" section links to "Agent directives" — framed as AI-specific. Should apply to all contributors.

**Steps:**

1. Read `docs/README.md`.
2. In the "Related" section, find the line:
   ```
   - [Agent directives](../.agent/directives/) — Rules and testing strategy for AI agents
   ```
3. Replace with:
   ```
   - [Development standards](../.agent/directives/) — Rules, testing strategy, and editorial voice for all contributors
   ```
4. Save the file.

**Acceptance criteria:**

- The link text says "Development standards" not "Agent directives".
- The description says "for all contributors" not "for AI agents".

---

### Task 3.3: Update REQ-08 in requirements.md

**File:** `docs/project/requirements.md`

**Problem:** REQ-08 (Quality Gates) lists format, lint, type-check, test, and E2E. Missing: knip and gitleaks.

**Steps:**

1. Read the REQ-08 section in `docs/project/requirements.md`.
2. Add two new bullet points to the list:
   ```
   - `pnpm knip` — Unused code and dependency detection (Knip).
   - `pnpm gitleaks` — Secret scanning across full git history (gitleaks).
   ```
3. Save the file.

**Acceptance criteria:**

- REQ-08 lists all six steps in `pnpm check` plus E2E.
- knip and gitleaks both appear with accurate descriptions.

---

### Task 3.4: Fix .agent/README.md

**File:** `.agent/README.md`

**Problems:**

1. `editorial-guidance.md` exists in `directives/` but is not listed in the directory structure tree.
2. The active plans table shows `cv-editorial-improvements.plan.md` with status "Planning" — should be "In Progress".
3. The new `onboarding-documentation-review.plan.md` is not listed in the active plans table.

**Steps:**

1. Read `.agent/README.md`.
2. In the directory structure tree under `directives/`, add `editorial-guidance.md` with a comment like `# Jim's editorial voice and identity`. Place it after `testing-strategy.md`.
3. In the active plans table, change the status of `cv-editorial-improvements.plan.md` from "Planning" to "In Progress".
4. Add a new row to the active plans table:
   ```
   | [onboarding-documentation-review.plan.md](plans/onboarding-documentation-review.plan.md) | In Progress | Documentation accuracy and onboarding flow review |
   ```
5. Save the file.

**Acceptance criteria:**

- `editorial-guidance.md` appears in the directory tree.
- `cv-editorial-improvements.plan.md` status is "In Progress".
- `onboarding-documentation-review.plan.md` appears in the active plans table with status "In Progress".

---

### Task 3.5: Verify e2e/README.md and docs/project/ accuracy

**Files:** `e2e/README.md`, `docs/project/user-stories.md`, `docs/project/requirements.md`

**This is a verification task, not an editing task.** These files were found to be accurate in the audit. Confirm they are still accurate.

**Steps:**

1. Read `e2e/README.md`. Verify:
   - All test file paths in the Test Map tables exist on disk.
   - The naming convention table matches actual file suffixes.
   - The Projects table accurately describes the `default` and `with-build` configs.

2. Read `docs/project/user-stories.md`. Verify:
   - Each user story has acceptance criteria.
   - No user story references features that do not exist.

3. Read `docs/project/requirements.md` (already edited in Task 3.3). Verify:
   - All requirements are still accurate.
   - REQ-08 now includes knip and gitleaks.

4. If any inaccuracies are found, fix them and note what was changed.

**Acceptance criteria:**

- All verified files are accurate.
- Any fixes are documented in the commit message.

---

### Phase 3 checkpoint

Run `pnpm format && pnpm check`. Both must pass.

---

## Phase 4: Final verification

**Goal:** Confirm the complete onboarding thread works end-to-end. Every document must be accurate, every link must resolve, and the flow must make sense.

---

### Task 4.1: Walk the onboarding thread

**This is a read-only verification task.** Follow the path a junior developer would take and verify every step.

1. Read `README.md` top to bottom. For each internal link, verify the target exists and is accurate.
2. From the Development Standards section, follow links to:
   - `.agent/directives/AGENT.md` — verify it is accurate and links to rules, testing, identity.
   - `.agent/directives/rules.md` — verify the quality gates list includes gitleaks.
   - `.agent/directives/testing-strategy.md` — verify it is accurate.
3. From the Documentation section, follow links to:
   - `docs/architecture/` — verify the architecture README is accurate.
   - `docs/architecture/decision-records/` — verify the ADR index is complete and all links resolve.
   - `docs/project/` — verify user stories and requirements are accurate.
   - `e2e/` — verify the E2E README is reachable and accurate.

**Acceptance criteria:**

- Every internal link in the documentation thread resolves to an existing file.
- No document contains factually incorrect claims about the current codebase.
- A reader following the thread from `README.md` would encounter no dead ends, contradictions, or confusion.

---

### Task 4.2: Run all quality gates

```bash
pnpm format
pnpm check
pnpm test:e2e
```

**Acceptance criteria:**

- `pnpm format` reports no changes (all files already formatted).
- `pnpm check` exits 0 (all six gates pass).
- `pnpm test:e2e` exits 0 (all E2E tests pass).

---

### Task 4.3: Commit

Create a single commit with all changes from all four phases. Commit message should summarise the scope:

```
Fix documentation accuracy and onboarding flow across all docs and ADRs
```

Do not push.

---

## Files affected

| File                                                                   | Phase | Changes                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                            | 1     | Restructure sections, fix prerequisites, fix project structure tree, fix commands (both Dev Commands and Quality Gates), improve quality gates, reframe agent directives, link e2e docs, fix client component count in Key Design Decisions |
| `docs/architecture/decision-records/003-print-button-removed.md`       | 2     | Fix stale SiteHeader description, client component claim, How to Restore, line numbers                                                                                                                                                      |
| `docs/architecture/decision-records/005-knip-unused-code-detection.md` | 2     | Fix zero-config claim, add gitleaks to pipeline                                                                                                                                                                                             |
| `docs/architecture/decision-records/002-pdf-serving-architecture.md`   | 2     | Reconcile PDF size                                                                                                                                                                                                                          |
| `docs/architecture/decision-records/004-storybook-deferred.md`         | 2     | Fix client component count, fix broken plan link                                                                                                                                                                                            |
| `docs/architecture/README.md`                                          | 3     | Fix client component list, reconcile PDF size                                                                                                                                                                                               |
| `docs/README.md`                                                       | 3     | Reframe agent directives as development standards                                                                                                                                                                                           |
| `docs/project/requirements.md`                                         | 3     | Add knip and gitleaks to REQ-08                                                                                                                                                                                                             |
| `.agent/README.md`                                                     | 3     | Add editorial-guidance.md to tree, fix plan status, add this plan to active plans table                                                                                                                                                     |
