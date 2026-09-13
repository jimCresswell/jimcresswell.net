---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure on a file that grows by append each session; 115 clears the
  noise while still flagging genuine over-runs.
fitness_content_role: reference
overflow_disposition: "leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)"
merge_class: index-narrative-tables
---

# Repo Continuity

The canonical continuity contract for `jimcresswell.net`: where we are, what is
live, what is next. Refreshed by `session-handoff`; read at session resume.

## Current State

- `main` carries the monorepo and the Practice since PR #53 merged (`55649a2`, 2026-09-13); the
  transplant closure runs as small PRs against `main` (node §Transplant closure; items 1 to 4
  landed, item 4 as bounded with its residue rows named in the report). Plan of record: `docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`
  (§Owner rulings, rounds 1 to 16, carry the state; the latest round is current).
- Seven pnpm workspaces; root scripts through Turborepo; root devDeps installed.

Landed before the closure, all on `main` since PR #53 (kept as the record of how; nothing below
names a live branch):

- **Landed through `feat/monorepo`** (merged in #53): the transplant
  (directives merged, 127 rules triaged, skills + adapters, JC statusline mark,
  `preserve-caught-error` on) and Phase 8 harness (Claude/Codex/Cursor hooks and
  statusline, hook policy restored, full Husky set, `ci.yml` with CI parity,
  root gates: gitleaks, knip, depcruise, markdownlint footprint, sub-agent
  adapters for 27 templates). **`pnpm check` is green end to end.**
- **Re-evaluate slice 1 committed** (plan §Re-evaluate ×3): the identity CLIs read
  the harness-native `CLAUDE_CODE_SESSION_ID` (PDR-027 amendment) and the hook
  reports truthfully; the shared start-right workflows cite the gates skill
  instead of a lineage gate list; the copied docs layer is re-homed by role —
  `docs/governance` and `docs/foundation` dissolved, six developer docs stay in
  `docs/engineering`, eight host guides in `.agent/reference`, six doctrine
  merges into directives and rules. `.agent-original/` deleted 2026-09-13 after
  the computed loss-scan (round 13).
- **Link repair done (2026-09-12, resumed session):** `validate-markdown-links`
  reports 0; `docs-validators:check` (reference direction, machine-local paths,
  markdown links, cited scripts) is a `check` leg and a CI step, so `check:docs`
  is now a subset of `check`. The patterns index is generated from the (empty)
  local corpus and its validator is green. Two lineage methodology docs were
  imported: `memory/operational/{ephemeral-to-permanent-homing,collaboration-state-lifecycle}.md`.
- Gates since closure item 3 (PR #56, `1829cd4`): `repo-validators:check` runs check-ci-parity,
  claim-freshness, pretooluse-guard-routing, policy-reappraisal, lifecycle-scripts,
  no-stale-script-invocations, collaboration-state, identity-naming,
  workspace-config-isolation and plan-corpus as `check` legs; the agent-tools smoke suite
  (collaboration-tui, codex-session-alert with `--silent`) runs as the e2e leg. Still to
  retire under item 5: `validate-ratified-lists`. Not re-checked today: the fitness vocabulary
  in the `practice-fitness` sources.

- Deep consolidation status: **filed, cards pending — closure session 2** (node item 8): the
  three unprocessed napkins under `.agent/memory/active/unconsolidated/` plus this session's
  captures are on the pending-graduations register since PR #63 (`SHA: dc23dff`): thirty-three
  live rows, split as twenty-eight decision-debt blocks (the parser's readout: five 2026-09-12
  captures plus twenty-three session 2 entries) and five constitutional rows in PDR-130's slow
  lane, which are not decision-debt. The live continuation is the owner's one batch of cards;
  the napkins are archived only after it.
- The generators: the rules-index and trigger generator is lane B's PR #55 (item 6, PR 1);
  the sub-agent adapter generator (2b) and the 2a remainder are handed back to the Director
  (lane B's handoff record v3).
- **2026-09-13, late afternoon (wrap 6, historical):** `practice-completion` ratified with its three gates
  cleared and the transplant closure as eight checked exit conditions in two sessions (node
  §Transplant closure); the private editorial material made optional and minimally mentioned;
  `compute-dont-hope` and `record-generalisation-moves` are rules; the generalisation register
  holds fifteen rows, six owed to the lineage; the bootstrap closure and the validators' universe
  are derived; draft PR #53 open and green through 653f274, CI running on 7d6f292. No watcher,
  cron, claim or monitor was live at the wrap; nothing survives compaction and nothing needs
  re-arming.

- **2026-09-13, evening (wrap 7, the Director session):** the owner named this seat Director (PDR-117)
  and started three Implementer seats. Landed on `main`: the Director records and the channel rule
  (PR #54, `c426c6c`), closure item 4 (PR #57, `4a61112`, merged by the merge bot the owner created:
  App `jimbot-of-the-devonshire-jimbots`, config per-checkout and untracked, key outside the repo).
  Then, the same evening: item 3 merged (PR #56, `1829cd4`, by the owner); lanes B and C handed
  back and stood down; the owner set n=2 (Director and lane A, 17:16Z) with an ARC channel beside
  native messaging; open at 17:40Z: #58 (records), #60 (the per-checkout Playwright port), #55
  (one thread, cure by lane A), #59 (carried on #58). The live map is `director-handoff.md`
  (§Current handoff state, the board, the routing log whose last entry is current); it is the
  successor Director's first read.

## Active Threads

- OCE Practice lineage transplant — closure (Director: Cauldron herds Lustre, `director-handoff.md`;
  lanes A, B, C under `threads/closure-lane-*.next-session.md`).
- Closure session 2, the synthesis onto the register (`threads/session-2-synthesis.next-session.md`;
  opened 2026-09-13 about 20:40Z on the owner's word; the register PR #63 merged at
  `SHA: dc23dff` 22:39Z; the live continuation is the owner's cards and the fast-lane and
  slow-lane dispositions that follow them).

## Paused Threads

- LinkedIn editorial pass (owner-led, private boundary; headline is the only
  settled field).
- Track B Source-of-Truth Design, Phase B2.1.
- Dev-Tooling Hygiene (dependency updates handled locally).

## Next Safe Steps

The owner-set order of 2026-09-12 (rules triage, harness integration, the two re-evaluation
slices, the restart assessment, link repair, script naming, the plan-node migration, the
Practice definition and its delivery node) is done and recorded in the plan node
`.agent/plans/delivery/practice-completion.plan.md` and the journey report
`.agent/reports/practice-transplant/journey-so-far.md`; the transplant closure's items 1 to 6
landed on `main` (PR #53 at `SHA: 55649a2`, then the closure PRs listed in the Director's
handoff). Live now, in order:

1. The Director's handoff `.agent/memory/operational/director-handoff.md` §Current handoff state
   is the resume contract: the open pull requests, the lane A order (item 5's remaining parts,
   then 2a, 2b, the Gemini projection, the corpus-analysis work, `sif`), and item 7 last.
2. Session 2's cards: the owner answers the register's session 2 entries in one batch
   (`threads/session-2-synthesis.next-session.md` §Next safe step); graduations land as their
   own small pull requests; the napkins are archived after the answers.
3. The `practice-language-separation` node (sketch; not urgent) awaits ratification on cards; the
   tooling residue named in the plan (§Oak residue in tooling) rides item 5.
