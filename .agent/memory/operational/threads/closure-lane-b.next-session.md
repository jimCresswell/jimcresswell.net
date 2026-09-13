# Thread: closure-lane-b — the last hand-kept copies derived from rule frontmatter

**Thread identity.** Lane B of the transplant closure (node
`.agent/plans/delivery/practice-completion.plan.md` §Transplant closure, item 6). Director:
Cauldron herds Lustre (880ff9), claim `1db07581`; route questions and blocks to the Director by
directed comms event, never to the owner.

## Current continuation

- **Role:** Implementer (PDR-117). Enter your own worktree before any edit; branch
  `closure/lane-b` from `main` (at or after `55649a2`).
- **Owns exclusively:** `.agent/rules/**`, `RULES_INDEX.md`, `.cursor/rules/**`,
  `.claude/rules/**`, `.agents/rules/**`, the rules-index and Cursor-trigger generator (under
  `agent-tools/src/skills-adapter-generate/` or the portability module), and the sub-agent
  adapter descriptions derived from `.agent/sub-agents/templates/`. Lane C will send you its
  four generic-rule re-triages as a directed event; apply them here so `.agent/rules/` has one
  writer.
- **Item 6 — the last hand-kept copies derived:** every canonical rule carries
  `classification`, `description` and `globs` frontmatter; `pnpm portability:fix` generates
  `RULES_INDEX.md` and the `.cursor/rules/*.mdc` triggers from that frontmatter, and
  `portability:check` recomputes them; sub-agent adapter descriptions derive from the
  templates. Acceptance: the generator's fixture tests; a byte-equal regeneration of today's
  index and triggers before any content change (prove the generator reproduces the hand-kept
  files first, then let it own them); `pnpm portability:check` and `pnpm check` green; CI
  green.
- **Director verdict (2026-09-13, on the read-only survey):** the frontmatter is derived by script
  from today's `RULES_INDEX.md` (classification, trigger) and `.cursor/rules/*.mdc` (description,
  alwaysApply); a `trigger` key is added beside classification, description and globs; where the
  two sources disagree the index wins, and every reconciled rule is listed in the PR with both
  prior values; byte-equal proof for the index and for every adapter that already agreed.
  Second verdict (same day): the MORE SPECIFIC declaration wins, and the index's bare column is
  the least specific. So a `.mdc` with `alwaysApply: true` and no globs loses to the index's named
  trigger, but a rule the index calls core whose Cursor globs and Claude `paths` adapter both scope
  it becomes situational with a `surface:*` trigger derived from the globs (eight rules, listed).
  Where a Cursor glob and a Claude paths list disagree, take the union and list it.
- **Shape:** two PRs if the frontmatter sweep and the generator are separable
  (`design-work-for-small-prs`); the sweep touches 129 files, so land it first and fast.
- **Next safe step:** `start-right-team` as `team-member-non-closeout-owner`; team-start
  report; claim `--role implementer --thread closure-lane-b` on the paths above after the
  Director acknowledges; commit intent before each push.
- **Team expectation:** small PRs against `main`; the Director merges green PRs. Report
  downtime to the Director.
- **Acceptance bar:** the node's item 6 proof verbatim; a generalisation-register row for the
  generator (it makes the rules index derivable in any host).

## Participating agent identities

- Director: Cauldron herds Lustre (880ff9), 2026-09-13.
- Implementer: (added on pickup).

## Landing target for the next session

The frontmatter sweep merged; the generator PR open with the byte-equal regeneration proof in
its description.

## Grounding order

`start-right-team` → `director-handoff.md` → the node §Transplant closure item 6 → the
existing adapter generator and `portability:check` sources → `.agent/rules/README.md` if
present → `RULES_INDEX.md` as the target to reproduce.

## Standing decisions

Compute, don't hope (the index and triggers are outputs, never edited by hand again); no
tombstones; source is TypeScript; stage by explicit pathspec; a green, clean PR is merged
without asking.
