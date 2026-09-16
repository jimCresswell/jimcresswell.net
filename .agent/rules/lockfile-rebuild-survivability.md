---
classification: situational
description: "On any dependency landing — a security-floor bump, version hold, a new or raised pnpm-workspace.yaml override, batch sweep, or single bump — run the delete-and-rebuild test: back up and delete pnpm-lock.yaml, pnpm install from declarations alone, then assert floors, holds, unchanged audit, and a green frozen install. No size threshold; run it, never reason about it. Not for changes touching no dependency declaration. Failure shapes — a floor held only by the lockfile's recorded version, evaporating silently on rebuild; an override changed without regenerating the lockfile, which CI's frozen install refuses; a manifest moved under a standing override, which pnpm silently ignores."
trigger: surface:dependency-management
globs:
  - "**/package.json"
  - pnpm-lock.yaml
  - pnpm-workspace.yaml
  - .npmrc
---

# Lockfile-Rebuild Survivability

Owner rule, verbatim (2026-07-25): **"all updates and overrides must be able
to survive having the lockfile fully deleted and rebuilt."**

`pnpm-lock.yaml` is a DERIVED artefact. A security floor, version hold, or pin
that holds only because the lockfile happens to record a good version is not a
constraint at all — it evaporates the first time anyone regenerates from
scratch, and the regression is silent, because the rebuilt tree still installs
cleanly and every gate stays green. The constraints that survive live in
declarations: `package.json` ranges and the `pnpm-workspace.yaml` `overrides:`
block.

## Trigger

Any dependency landing: a security-floor bump, a version hold, a new or raised
`overrides:` entry, a batch sweep, or a single package bump. No size threshold
— a one-line floor is exactly the case where "it resolves correctly right now"
gets mistaken for "the constraint is expressed".

## Action

Run the rebuild; do not reason about it. Reasoning cannot see an incidental
pin.

```bash
cp pnpm-lock.yaml /tmp/lock-committed.yaml   # forward-going copy, never a git removal
rm pnpm-lock.yaml
pnpm install                                  # rebuild from declarations alone
```

Then assert all four, and read each result rather than the exit code alone:

1. **Floors** — every advisory-carrying package resolves at or above its fixed
   version.
2. **Holds** — every documented major hold still holds (this repo's holds, each
   with how it is enforced and its lift condition, are listed in
   [`docs/engineering/build-system.md`](../../docs/engineering/build-system.md)
   §Dependency updates).
3. **Audit** — `pnpm audit` is unchanged, with any deliberate deferral still
   the only residue.
4. **Frozen install** — `CI=true pnpm install --frozen-lockfile` exits 0.

Restore by copying the backup back if the rebuild is not the state you want to
commit.

**A byte-identical rebuild is the strongest pass.** A rebuild that merely
satisfies all four assertions is still a pass: newly-published in-range
versions are legitimate drift, not a violation. A rebuild that drops a floor,
crosses a hold, or fails the frozen install means the constraint was never
declared — fix the declaration, never re-pin by hand.

## The override-alignment corollary

pnpm `overrides` replace the **effective specifier of every dependency they
bind**, direct dependencies included, and the lockfile records the override's
specifier and the overrides themselves. An override and the manifests it binds
therefore drift apart in two ways, and pnpm treats them differently (measured
on pnpm 12.4.2, 2026-09-16):

- **An override changed without regenerating the lockfile fails loudly.** The
  lockfile's recorded overrides no longer match the workspace's, and
  `CI=true pnpm install --frozen-lockfile` stops with
  `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` (verified by moving the `smol-toml` floor
  to `>=1.7.2 <2` alone). No local hook runs a frozen install, so CI's is the
  first surface that sees it, taking `install`, `secret-scan` and
  `run-quality-gates` down with it.
- **A manifest moved under a standing override is silent everywhere.** The
  override still replaces that dependency's specifier, so the lockfile stays as
  it was and the frozen install still exits 0 (verified by raising agent-tools'
  `smol-toml` to `^1.9.0`, a range no published version satisfies, under the
  `>=1.7.1 <2` floor). A manifest raise meant to pick up a new patch leaves the
  old version installed with every gate green.

So an override's comment names the manifests it rewrites, and the override and
those manifests move in the same change, with the lockfile regenerated.

## Worked instances

- **MCP-151 (2026-07-25)**: the security slice (#530, six bounded floors) and
  the estate-wide drift sweep (#531) were each tested by full delete-and-rebuild
  and came back **byte-identical** — every floor, both major holds, and the
  audit state proven declaration-derived rather than lockfile-retained.
- **The corollary, same lane**: the sweep moved `@types/node` manifests to
  `^24.13.3` while its override still read `^24.13.2`, and CI's frozen install
  failed with `ERR_PNPM_OUTDATED_LOCKFILE`. That was the source lineage on its
  pnpm of 2026-07-25; on pnpm 12.4.2 the same manifest move alone no longer
  fails (the silent direction above), so this instance is history, not the
  current behaviour. Cured by aligning the override — the same alignment
  `21fdff136` made for the esbuild security floor, and the same class recorded
  upstream for PR #296.

## Related Surfaces

- Overrides are temporary controls that must name the vulnerable dependency,
  why the override is safe, and the condition for removal
  ([`secops.md` §Dependencies and lockfile](../directives/secops.md#dependencies-and-lockfile)).
  This rule adds: and they must survive a rebuild.
- [`docs/engineering/build-system.md`](../../docs/engineering/build-system.md)
  — security `overrides` and `peerDependencyRules` belong in
  `pnpm-workspace.yaml`; a CVE floor earns an override, a tool-version pin does
  not.
- [`validators-must-recompute-not-just-record`](validators-must-recompute-not-just-record.md)
  — the same principle one layer up: a check that reads recorded state instead
  of recomputing it cannot see the defect.
