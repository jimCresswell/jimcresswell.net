# Thread: turbo-remote-cache — the remote cache, optional everywhere and reached without a login

**Thread identity.** The lane that lands the delivery node
`turbo-remote-cache-optional-and-persistent` in this repository and in OCE. **Participating
agent identities:** Galaxy binds Gravity (46de68, claude-code, claude-fable-5-1, implementer,
2026-09-30); Crucible binds Slag (7b999c, claude-code, claude-fable-5-1, implementer, 2026-10-01).
**Landing target for the next session:** the latest dated block governs.
**Grounding order:** `AGENT.md`, the start-right skill for the session shape, this record, the
delivery node, then `docs/engineering/build-system.md` §Caching.

## Current Continuation (2026-10-01T16:0xZ, the latest block governs)

- Both pull requests have landed. PR 1: jimcresswell.net PR 275 at SHA:f6a26954 (2026-09-30).
  PR 2: OCE PR 313 at SHA:e453ff81a (2026-10-01T14:57:09Z, Crucible binds Slag): one pure sync
  with `engraph`, no review thread, merged by OCE's merge-bot, branch deleted, worktree removed.
- Observed on OCE's side before the landing: on PR 313's reviewed head (CI run 36723959829) the
  cache-by-OIDC step succeeded in every job that runs turbo, so OCE's team variable and OIDC
  policy are in place.
- Observed here on 2026-10-01: no `TURBO_TEAM` repository variable exists, and the run on `main`
  at SHA:cb285512 (36877727338) skipped the OIDC step and posted the notice. Criterion 2 again;
  criterion 1 still waits on the owner's two acts.
- Invocation pointer: `$jc-start-right-quick continue turbo-remote-cache from this record`.
- Controlling plan: `.agent/plans/delivery/turbo-remote-cache-optional-and-persistent.plan.md`
  (status `ratified`).
- Next safe step: read the first CI run after the owner's two acts on this repository for
  criterion 1, and OCE's next release run on its `main` for criterion 5's runtime half; record
  both here, then close the node against its five criteria.
- Owner acts still owed (criterion 1): the Vercel OIDC policy for `jimCresswell/jimcresswell.net`
  on team `engraph`; `gh variable set TURBO_TEAM --body engraph -R jimCresswell/jimcresswell.net`.
- Completed prerequisites: the owner's keychain-backed `TURBO_TOKEN` and `TURBO_TEAM=engraph`
  in the shell profile (an agent shell reads "Remote caching enabled"); `turbo logout`; an
  org-wide Vercel OIDC policy for the `EngraphCode` GitHub org; OCE's `ci.yml` on OIDC (PR 312).
- Team expectation: unknown until live grounding; the Director lane closed 2026-09-29.
- Acceptance bar: the delivery node's five criteria with their proofs.

## Owner words that govern this lane (verbatim, 2026-09-30)

- "We need both estates to have persistent access to remote caching, relying on me logging in
  is not acceptable."
- "we need to scope both of those values to Engraph, so that switching to other org values is a
  trivial change" (the keychain item keyed by team slug; `TURBO_TEAM` selects both values).
- "I don't want a project scoped token. Carry out the other steps."
- "we need the GitHub CI to also fallback to working with no remote cache, so that we don't
  break other people's forks, but in that case we should output a information log line,
  something like 'configure an optional remote Turbo cache'".
- "remote caching needs to be optional with an information line both locally and in cloud CI
  such as GitHub".
- "To be clear, I want remote caching enabled in both OCE and JC.net in GitHub".
- "No, it's optional everywhere, we choose to enable it. And we never test for configuration."
  The seat had written a test whose fake read the dry run's argv to decide what to print: call
  inspection dressed as modelling the vendor. Deleted; the flag is guaranteed by construction and
  proven by a real-turbo observation on the pull request.

## Owner acts still owed (PR 1's first green run waits on them)

1. A Turborepo CLI OIDC policy on the Vercel team covering the GitHub account `jimCresswell`,
   repository `jimcresswell.net`, no branch filter.
2. `gh variable set TURBO_TEAM --body engraph -R jimCresswell/jimcresswell.net`.

## Lane state, 2026-09-30T12:3xZ

- PR 1 in the lane worktree, uncommitted at this line: `ci.yml` (job permissions, the guarded
  `continue-on-error` OIDC step, the notice step), `turbo.json` (`teamSlug`),
  `repo-check-lint-changed.ts` (`--cache=local:rw`, the TSDoc), its integration test (argv pins
  and call inspection removed; behaviour cases kept), `.husky/turbo-remote-cache-notice.sh` and
  the two hooks, `docs/engineering/build-system.md`, the delivery node, this record.
- Proofs held locally: 17 tests green; the cured step plans cleanly under a refused token; the
  notice prints only without a token; `lint:shell` green over 21 scripts.
- Verified vendor facts: turbo 2.11.2 `--cache` (default prints the auth warning under a bogus
  token; `local:rw` silent; `local:r` warns under `TURBO_FORCE=true`); the action's `v1.1.0`
  tag equals the pinned SHA and is the latest release; OCE's `release.yml` triggers on CI
  completing for its `main`; OCE's hooks judge turbo by exit code only.

## Lane state, 2026-09-30T12:54Z

- PR 1 is PR 275 (SHA:b8610df6, opened by the bot 12:43Z; Copilot requested as the operator
  12:43:47Z). CI run 36716649076 green: `build-and-test` step 4 (the OIDC exchange) skipped
  because no `TURBO_TEAM` variable exists yet, step 5 posted the `::notice` annotation with the
  full line, Build through the smoke suite green. That is acceptance criterion 2 observed on our
  own run; criterion 1 waits on the owner's two acts and the first run after them.
- Copilot review 12:52Z, four findings, all cured in the next push: plan status `ratified`
  (the stamp was complete; `sketch` governs no work); the hook line and the docs no longer
  claim local-only operation without `TURBO_TOKEN`, since turbo also reads a `turbo login`
  credential from its own config (the credential that expired and started this arc); this
  record indexed in `repo-continuity.md` §Active Threads.
- Copilot round two (13:04Z on SHA:3cada054), three items, all cured: `SHA:` prefixes on this
  record's commit citations; the skip proof in the lint-changed integration test uses the
  unreachable sentinel, so any lint invocation rejects (mutant: a skip branch that calls the lint
  and discards its result, caught with "the lint ran"). Rounds are spent; a further finding is
  cured or Rejected in this push's slot turn.

## Promotion watchlist

- The `local:rw`/`TURBO_FORCE` interaction: a candidate line for the shell-and-tooling gotchas
  reference once PR 1 lands.
