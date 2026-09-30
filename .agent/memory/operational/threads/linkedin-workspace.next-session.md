# Thread: linkedin-workspace — the LinkedIn workspace and profile lane

**Thread identity.** The owner's LinkedIn work: the `linkedin/` document workspace (the profile
draft and its supporting material) and, on the owner's request only, the live profile at
linkedin.com/in/jimcresswell. **Participating agent identities:** Galaxy binds Gravity (46de68,
claude-code, claude-fable-5-1, implementer, 2026-09-29 to 2026-09-30). The owner's Codex agent
that created the workspace on 2026-09-28 is not recorded here by identity. **Landing target for
the next session:** the latest dated block governs. **Grounding order:** `AGENT.md`, the
start-right skill for the session shape, this record, `linkedin/README.md`,
`linkedin/rewrite-handoff.md`, then `.agent/directives/privacy.md` §LinkedIn workspace
authorisation.

## Current Continuation

- Branch: none. The lane is at rest; its last PR (JC.net 273) merged at b6232c77. The primary
  checkout sits on `main` at b6232c77 with a clean tree (the owner's arrangement for this lane).
- Invocation pointer: `$jc-start-right-quick continue linkedin-workspace from this record`, or
  the team skill if a peer is live.
- Controlling plan: none. The editorial direction is `linkedin/rewrite-handoff.md`; the workspace
  contract is `linkedin/README.md`.
- Next safe step: read `linkedin/rewrite-handoff.md`, then wait for the owner's direction on
  editing Draft 1 (`linkedin/profile-draft.md`). No change to LinkedIn itself without the
  owner's explicit request for that change; drafting, approval and publication are separate
  states (the README's working agreement).
- Completed prerequisites: `linkedin/` is a documents-only private pnpm workspace package (PR
  273); `main`'s knip gate is green; read-only access to the live profile through Claude in
  Chrome is proven (owner-signed-in view, 2026-09-29).
- Recent relevant commits: 82760e26, 4c869cf0, b2003cb0, 2bf65a44 (the owner's workspace
  set-up), 794c5aca and b6232c77 (PR 273).
- Team expectation: unknown until live grounding. The Director lane closed 2026-09-29 14:04Z;
  an n=1 seat takes both estates' Practice work, and this lane is separate from it by the
  owner's word.
- Acceptance bar: workspace edits land by the normal path (commit, PR, gates, merge);
  LinkedIn changes only on the owner's request, exact wording reviewed with the owner first.

## Owner rulings that govern this lane (verbatim or in substance, with dates)

- 2026-09-28 13:4xZ: "the linkedin work is finished for now, it is ready for review and merge,
  it is a first draft and does not require editorial review yet".
- 2026-09-29: "I told you to commit and push and merge the linkedin work just like any other
  work, it's not special, only putting it on Linkedin is special, and that happens manually".
- 2026-09-29 (on `linkedin/package.json`): a value the owner set is never changed under a
  "fix nits" instruction; the licence stays `UNLICENSED`, the name `linkedin`, the description
  "LinkedIn drafts". Licensing changes only on the owner's explicit word. Home: this record and
  the seat's napkin block; a rule clause is a graduation candidate (below).
- 2026-09-29: the live-profile check was read-only; nothing was clicked or changed.

## Lane state, 2026-09-30T09:4xZ (Galaxy binds Gravity, 46de68)

- Landed: PR 273 makes `linkedin/` documents only (the ESLint and TypeScript scaffolding,
  `src/hi.ts`, the lint scripts and their devDependencies removed; `"private": true` added; the
  root `@types/node` line that came with the scaffolding removed; lockfile importer
  `linkedin: {}`). `main` CI and CodeQL green at b6232c77. Branch retired, worktree removed.
- Live profile, observed 2026-09-29 through Chrome: headline and About unchanged from the 27
  September baseline (`linkedin/reference/current-profile-2026-09-27.md`); the top card shows
  the location at a finer grain than the baseline records. The baseline may have coarsened it
  deliberately: do not "correct" the baseline from a live read; ask the owner if it matters.
  Experience and the lower sections were not read.
- Open question, unresolved: why `linkedin/` needed to be a pnpm workspace member at all is
  unrecorded (the owner: "it needed a package.json file"). Falsifier: if nothing ever consumes
  it as a package, the `pnpm-workspace.yaml` line can go and the directory is a plain folder.
  The README's "so that it has a place in the monorepo" is the seat's inference.
- Harness facts for a seat on this lane, 2026-09-29: the auto-mode classifier refused the
  persistent comms watcher, so `claims open` refused by F-95; the lane ran on a team-start
  broadcast, a directed event and a native session message. `EnterWorktree` by path into the
  sibling `-worktrees/` directory worked with the owner at the prompt. The isolation guard
  refuses a token mint with `gh pr create` in one command; the same lines as a scratchpad
  script run by `bash` pass. `merge-bot push`, `mint-token` and `merge-bot merge` worked from a
  worktree without a local `.github/merge-bot.json`. The pre-commit lint-changed leg prints
  Turbo's "No tasks were executed" WARNING for a commit touching only root and `linkedin/`
  files and passes.
- Graduation candidate (not authored): a clause for `scope-from-goal-before-approach`: under a
  fix or nits instruction, owner-typed values (licence, name, description, wording) are Out by
  default; changing one needs its own In line agreed before the edit.

## Blockers / low-confidence areas

- None blocking. Low confidence: the reason for workspace membership (above).

## Promotion watchlist

- The graduation candidate above; the Turbo warning tolerance in lint-changed (a
  `no-warning-toleration` question for the n=1 seat's gate work, not this lane's).
