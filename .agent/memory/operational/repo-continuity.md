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
overflow_disposition: "leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)"
merge_class: index-narrative-tables
---

# Repo Continuity

The canonical continuity contract for `jimcresswell.net`: where we are, what is
live, what is next. Refreshed by `session-handoff`; read at session resume.

## Current State

- **2026-09-30T16:33Z: the dedicated two-estate consolidation, in progress** (Hawthorn binds Bracken,
  b3f117, at the owner's word of 2026-09-30). `main` is at b6232c77; the coordination branch
  `coordination/2026-09-29-b6232c` carries ten pushed commits: the register drained to three
  owner-gated entries, the buffers empty (distilled, the per-user memory index, the napkin rotated),
  the six consolidation skills and the per-user-memory rule the same bytes in both estates, the five
  queued directive entries written, the lineage's memory lessons homed, the comms table's section B
  homed. The lineage's `coordination/2026-09-29-76974c` carries the mirror, four commits pushed. The
  live reading is `threads/two-estate-consolidation.next-session.md`, newest state block first.

- **2026-09-29T13:4xZ: the Director lane closed; one seat (n=1) takes the work on both estates**
  (Wick binds Temper, ed7b48, at the owner's word). The handoff is on the lineage: its
  `estate-coordination` thread record's journal entry "2026-09-29T13:4xZ — HANDOFF to the n=1
  seat", with the retrospective
  `.agent/reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md`.
  JC.net has no open pull request of this lane apart from its coordination draft; `main` is green
  at b6232c77. The LinkedIn agent (Galaxy binds Gravity) works in `linkedin/` and in the primary
  checkout on `main`, a separate lane by the owner's word: write JC.net records from a worktree.

The state entries from 2026-09-13 to 2026-09-28 that stood here are archived byte-identical in
`archive/repo-continuity-current-state-2026-09-13-to-2026-09-28.md`.

## Active Threads

- LinkedIn workspace (`linkedin/`, `threads/linkedin-workspace.next-session.md`): reopened on
  2026-09-28 under privacy.md's dated workspace authorisation; landed as PRs 240 (03cac8b3f,
  14:48:24Z), 252 (f0f2f1fc2), 253 (b29ef39bd), 254 (1a164ae34, the authorisation as its own
  section) and 259 (efdcc2376, the paper's author list); no editorial pass yet (the owner's word,
  13:4xZ). Further batches from the owner's Codex agent are repo content that a Practice seat
  commits and lands by the normal path (the owner's word, 2026-09-28); publishing to LinkedIn is
  a separate act on the owner's request. 2026-09-29: PR 273 (b6232c77) made the workspace
  documents only and cured `main`'s knip gate; the lane is at rest, its seat (Galaxy binds
  Gravity, 46de68) closed 2026-09-30, and the record's latest block governs.
- JC.net's exchange seat (`threads/practice-exchange-seat.next-session.md`): its seat closed with the
  Director lane on 2026-09-29; the record's latest dated block governs, and its landings list is the
  lane's proof.
- Closure session 2's synthesis (`threads/session-2-synthesis.next-session.md`): the cards were
  answered 2026-09-14 (the Director's handoff item 78); the graduation drain is curator work.
- Turbo remote cache, optional everywhere (`threads/turbo-remote-cache.next-session.md`): the
  delivery node `turbo-remote-cache-optional-and-persistent`, ratified 2026-09-30; PR 275 merged
  here (SHA:f6a26954), OCE PR 313 open for harvest; the record's latest dated block governs.
- Two-estate consolidation (`threads/two-estate-consolidation.next-session.md`): running on
  2026-09-30 (Hawthorn binds Bracken) at the owner's word, JC.net the home and the lineage worked
  non-resident; the record's newest state block governs and opens with the four counts.

## Paused Threads

- Track B Source-of-Truth Design, Phase B2.1.
- Dev-Tooling Hygiene (dependency updates handled locally).

## Next Safe Steps

STATE, 2026-09-30T16:33Z (Hawthorn binds Bracken, the two-estate consolidation, in progress): the live
next steps are the newest state block of `threads/two-estate-consolidation.next-session.md`. The items
below are still open from the 2026-09-16 snapshot, each verified in the tree on 2026-09-30; the snapshot
itself, with its later state notes, is archived byte-identical in
`archive/repo-continuity-next-safe-steps-snapshot-2026-09-16.md`.

- The `minimumReleaseAgeExclude` block in `pnpm-workspace.yaml` has been dead config since 2026-09-17
  and is still present: delete it.
- The three hand-authored hook shims under `.claude/hooks/` (`practice-session-identity.mjs`,
  `plan-gate-drift-alert.mjs`, `run-pretooluse-guard.mjs`) are still present; each gets a first-hand
  fire and no-fire probe before its shim is deleted (the snapshot's maintenance item 2).
- The Cricket seat adapters are still named by effort alone (`cricket-judgement-low`, `-medium`,
  `-high`, `cricket-procedure-xhigh`) while model power pairs inversely with effort; the rename lives
  in the two templates under `.agent/sub-agents/templates/` and regenerates with `pnpm portability:fix`.
- The `practice-language-separation` node is a sketch awaiting the owner's cards.
- The ESLint 10 hold for the site waits on `eslint-plugin-react`; an assumptions-expert review of
  source-run hooks comes before any `PreCompact` gate is built.
- Editorial work follows on the owner's word; nothing on the Practice side blocks it.
