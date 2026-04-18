---
prompt_id: linkedin-content-preparation
title: "LinkedIn Content Preparation"
type: handoff
status: active
last_updated: 2026-04-18
---

Continue the LinkedIn profile update work for Jim Cresswell.

Ground the session first: follow the **start-right** skill
([`../skills/start-right/SKILL.md`](../skills/start-right/SKILL.md))
or the thin adapter
[`jc-start-right`](../../.agents/skills/jc-start-right/SKILL.md)
— same workflow (foundation docs, `plans/active/`, practice box, gates).

This is **collaborative editorial work**. Present options to Jim and iterate.
Do not propose final wording without Jim's input.

## Read first

1. [`../directives/AGENT.md`](../directives/AGENT.md)
2. [`../directives/rules.md`](../directives/rules.md)
3. [`../directives/editorial-guidance.md`](../directives/editorial-guidance.md)
4. [`../memory/distilled.md`](../memory/distilled.md)
5. [`../memory/napkin.md`](../memory/napkin.md)
6. [`../plans/roadmap.md`](../plans/roadmap.md)
7. [`../plans/current/linkedin-update.plan.md`](../plans/current/linkedin-update.plan.md)
8. [`../../content/cv.content.json`](../../content/cv.content.json) — the canonical editorial source
9. [`../../archive/prior_cv_content.json.bak`](../../archive/prior_cv_content.json.bak) — career history (gitignored; may not be present)
10. `.agent/temp/linkedin.pdf` — current LinkedIn profile export (gitignored; may not be present)
11. `.agent/temp/old-cv-website/` — Jim's previous CV website (gitignored; may not be present)

## Grounding truths to preserve

- LinkedIn content derives from the editorial CV and `editorial-guidance.md`.
  It has **no graph dependency** — earlier "subsumed" framing was wrong.
- The canonical positioning paragraphs and headline in `content/cv.content.json`
  are the voice reference. LinkedIn entries must not contradict them.
- Tilts are being retired (see `../plans/current/tilt-retirement.plan.md`); do
  not derive LinkedIn content from tilt-specific positioning. Tilt content is
  preserved in `docs/architecture/reference/cv-tilt-content-and-rationale.md`
  if it provides editorial signal, but the canonical positioning is primary.
- This is **content preparation only**. LinkedIn API automation has been ruled
  out; Jim applies the final content manually.
- The output is a single copy-paste-ready document at
  `.agent/temp/linkedin-update-content.md` (gitignored).

## Active task

Run the five-phase workflow defined in
[`../plans/current/linkedin-update.plan.md`](../plans/current/linkedin-update.plan.md):

1. Read source material (editorial CV, archive, current LinkedIn).
2. Resolve open structural and editorial questions with Jim.
3. Draft headline and About section options; iterate to one approved version.
4. Draft role descriptions; iterate to approved versions.
5. Compile the final copy-paste-ready document at
   `.agent/temp/linkedin-update-content.md`.

## Before editing

- read every gitignored reference file that is present and note what is
  missing
- prepare a brief comparison of the current LinkedIn profile vs the editorial
  CV positioning before opening the conversation with Jim
- treat the seven open questions in the LinkedIn plan as an explicit checklist;
  do not pre-decide them

## Likely relevant files

- [`../plans/current/linkedin-update.plan.md`](../plans/current/linkedin-update.plan.md)
- [`../directives/editorial-guidance.md`](../directives/editorial-guidance.md)
- [`../../content/cv.content.json`](../../content/cv.content.json)
- [`../../lib/jsonld.ts`](../../lib/jsonld.ts) — current `KNOWS_ABOUT` and `OCCUPATION` for skills-section input
- [`../../docs/architecture/reference/cv-tilt-content-and-rationale.md`](../../docs/architecture/reference/cv-tilt-content-and-rationale.md) — supplementary editorial signal only

## Do the work

- run the workflow phases in order
- record decisions inline in the LinkedIn plan or in a working note
- update [`../memory/napkin.md`](../memory/napkin.md) with mistakes,
  corrections, and what was learned
- mark the LinkedIn plan complete and move it to `complete/` once Jim has
  applied the content

## Proof requirements

- this is content preparation only; no rendering changes; no visual regression
  harness required
- if any cross-document changes happen (e.g. an editorial fact is corrected in
  `cv.content.json` during the work), run the full gate sequence and treat
  that as a separate slice

## After changes, run in order

- `pnpm format:fix`
- `pnpm markdownlint:fix`
- `pnpm lint:fix`
- `pnpm typecheck`
- `pnpm test`
- `pnpm knip`
- `pnpm gitleaks`
- `pnpm test:e2e` (only if any code or content changed; not required for the
  gitignored output document)

## End by summarising

- which content was finalised and approved
- which open questions Jim resolved during the session
- whether the LinkedIn plan moves to `complete/`
- whether any editorial fact in `cv.content.json` was changed and needs
  follow-up coverage
