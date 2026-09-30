---
id: turbo-remote-cache-optional-and-persistent
node_type: delivery
name: The Turbo remote cache, optional everywhere and reached without a login
overview: >-
  Both estates reach the Vercel Remote Cache with no interactive login (OIDC in
  CI, a keychain-backed token on a host), the cache stays optional with one
  information line wherever it is not in use, and a commit never depends on it.
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-09-30
ratified_where: >-
  The owner's words of 2026-09-30 in the session of Galaxy binds Gravity
  (46de68): the plan approval ("Carry out the other steps"), then "it's optional
  everywhere, we choose to enable it" and "we never test for configuration";
  recorded verbatim on the lane's thread record
  turbo-remote-cache.next-session.md.
serves: best-of-each-practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates:
  - awaiting: external-input
    clears_when: >-
      The owner has added a Turborepo CLI OIDC policy for this repository on
      the Vercel team and set the TURBO_TEAM repository variable; the first
      CI run of PR 1 whose remote-cache step succeeds is the proof.
    expires: 2026-10-21
last_updated: 2026-09-30
---

# The Turbo remote cache, optional everywhere and reached without a login

Authored 2026-09-30 by the seat at pickup. The work rests on the owner's words of
2026-09-30: no interactive `turbo login` anywhere ("relying on me logging in is not
acceptable"); the remote cache "is optional everywhere, we choose to enable it", locally and
in cloud CI, with one information line where it is not configured ("configure an optional
remote Turbo cache"); remote caching enabled in both OCE's and this repository's GitHub CI; no
project-scoped token; and "we never test for configuration".

## Goal

Every gate on a host with the token, and every CI run of ours, shares the team's remote cache
with no login. A fork, a Dependabot run, a clone or a shell without a credential runs the same
gates on turbo's local cache and says so in one line. A commit never depends on the network or
on a cache token. The same bytes carry this in both estates.

## User groups and value

- The owner, on any machine: a token placed once (a keychain-backed `TURBO_TOKEN`) and never a
  login prompt again; a gate that reads "Remote caching enabled" without asking.
- Seats and hooks on the owner's host: commits and pushes that do not fail when a credential
  lapses or the network is away, and one line that names the missing configuration instead.
- Forks and other contributors: CI and hooks that work with no Vercel account at all, and one
  line saying how to opt in.
- The two estates' maintainers: one shape for the cache step, the hook notice and the docs,
  identical in OCE and here, so a future team move or vendor change touches known places.

## Mechanism

- CI reaches the cache by GitHub OIDC (`vercel/setup-turborepo-remote-cache-action`, pinned by
  SHA): the job holds `id-token: write`, the action exchanges the job's OIDC token for a
  short-lived, team-bound Vercel token, sets `TURBO_TOKEN` and `TURBO_TEAM` for the following
  steps and revokes the token when the job ends. The step runs only where a token can exist and
  a team is named (`vars.TURBO_TEAM != ''`, not Dependabot, not a fork's pull request) and
  carries `continue-on-error: true`; a companion step prints a `::notice` line whenever the step
  did not succeed. No long-lived secret is read.
- `turbo.json` names the team (`remoteCache.teamSlug`), turbo's lowest-priority team source, so
  a clone needs no `turbo link` and the environment still outranks it.
- A host exports a team-scoped token as `TURBO_TOKEN` from its shell profile, read from a
  keychain; `.husky/turbo-remote-cache-notice.sh`, sourced by `pre-commit` and `pre-push`,
  prints one line when the shell carries none.
- The pre-commit's planning dry run (`repo-check lint-changed`) reads the local cache only
  (`--cache=local:rw`): a dry run marks hits and misses the step never reads and writes nothing,
  so reaching the remote cache only made the commit depend on the token and the network. The
  lint run and every full gate keep both caches, and turbo's own warning for a refused token
  still shows there, judged by exit code. `local:rw`, not `local:r`: a host's `TURBO_FORCE=true`
  meets `local:r` with "no caches are enabled".
- The flag is configuration, guaranteed by construction, never by a test: the proof is a
  real-turbo observation at cure time (a refused token, default versus `--cache=local:rw`),
  recorded on the pull request.

## Acceptance criteria (each with a proof)

1. This repository's CI `build-and-test` job reaches the remote cache on our own runs.
   Proof, `owner-held` until the policy and variable exist, then `repo-safe` by the run log:
   the step succeeds with `team: engraph`, `pnpm build` prints `Remote caching enabled`, the
   post step revokes the token, and a second run on an unchanged package prints
   `cache hit, replaying logs`. The seat reads the run and records it on the thread record.
2. A run without a credential still passes and says so. Proof, `repo-safe`: the next Dependabot
   pull request's `build-and-test` shows the cache step skipped, the `::notice` annotation
   present, the job green.
3. A commit never depends on the cache. Proof, `repo-safe`: with `TURBO_TOKEN` set to a value
   the cache refuses, `repo-check lint-changed` plans cleanly and runs the lint (observed
   2026-09-30 on turbo 2.11.2; before the cure the step threw on the warning); the existing
   behaviour tests of the step stay green with no argv pinned.
4. A shell without a token gets one line, a shell with one gets none. Proof, `repo-safe`:
   `env -u TURBO_TOKEN sh -c '. .husky/turbo-remote-cache-notice.sh'` prints the line;
   with the variable set it prints nothing; `pnpm lint:shell` green.
5. OCE carries the same bytes: its CI step gains the team guard, the notice and
   `continue-on-error`; its release workflow reaches the cache by OIDC instead of a secret that
   does not exist; its `turbo.json` names the team; its hooks source the notice. Proof,
   `repo-safe` by OCE's CI on the pull request; the release workflow's runtime proof is
   `owner-held` until the next release run on its `main`, read and recorded by the seat.

## Todos

1. PR 1, this repository: `ci.yml`, `turbo.json`, the lint-changed dry run and its tests, the
   hook notice, the build-system docs, this node and the thread record. Round budget: 2.
2. PR 2, OCE, after PR 1 lands (one open pull request per seat): its `ci.yml` (five jobs),
   `release.yml`, `turbo.json`, the hook notice, its build-system docs; the body corrects PR
   312's record that a `TURBO_TOKEN` secret remained for `release.yml` (none existed). Round
   budget: 2.

## Out of scope

- A composite action to dedupe OCE's call sites: a later tidy, once both estates carry the
  same bytes.
- A self-hosted cache or a project-scoped token: the owner declined both.
- Making turbo's own auth warning fatal in exit-code gates: a `no-warning-toleration` question
  for the gate plan, not this lane.
- OCE's `windows-basic` job still setting the deprecated `TURBO_REMOTE_CACHE_READ_ONLY`; its
  replacement is `TURBO_CACHE: 'local:rw,remote:r'`, a follow-up.
