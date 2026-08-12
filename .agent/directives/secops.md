---
fitness_line_target: 60
fitness_line_limit: 80
fitness_char_limit: 4200
fitness_line_length: 100
split_strategy: Split by responsibility — extract git operations from audit procedures
---

# Security Operations

Operational security practices for this repository. These rules apply to all contributors — human
and AI.

## Git identity

Use `git@jimcresswell.net` as the author email for commits made in a local checkout. All commits
must carry a GitHub-verifiable cryptographic signature; GPG and SSH signatures are both accepted.
GitHub-generated merge or squash commits may use GitHub's platform identity and GPG signature.

```bash
git config user.email "git@jimcresswell.net"
git config commit.gpgsign true
```

For SSH signing, also configure the public key registered with GitHub as a signing key:

```bash
git config gpg.format ssh
git config user.signingkey "$HOME/.ssh/id_ed25519.pub"
```

## Guiding principle

If content would be useful to a social engineer, it does not belong in version control. This applies
to commit messages, plan files, code comments, and any other tracked content.

## PII audit checklist

Before making this repository public (or changing visibility), audit for:

- [ ] Personal email addresses in tracked files and git history
- [ ] Psychological profile content (see [privacy.md](privacy.md) for categories)
- [ ] Physical location specifics beyond what is intentionally public
- [ ] Political specifics (year, party, ward, outcome)
- [ ] Third-party names without consent
- [ ] Private editorial sources, drafts or analysis outside the ignored private repository

## Content in plan files

Plan files in `.agent/plans/` are version-controlled and will be visible if the repo is public. They
should be written as if they will be read by anyone.

- Store editorial constraints and decisions in plan files.
- Store private sources, drafts, evidence and analysis in the ignored private editorial repository,
  not in plan files.
- Point only to its local routing README. Never publish the private remote, commit identifiers or
  source-level details in a public plan.

## Quality gate

The `secrets:scan` stage is part of `pnpm check` and scans the full Git history for secrets on every
commit. It catches accidental credentials but does not detect PII or psychological content — the
rules in [privacy.md](privacy.md) cover those categories.

## History-rewrite boundary

A public-history rewrite is an exceptional recovery operation, not ordinary cleanup. Before any
rewrite or force push, preserve and verify the complete live state: Git refs and object database,
index, tracked and untracked changes, ignored sources, relevant pull-request state, and any
out-of-repo material needed for recovery. Use a private remote and a fresh-clone check so custody is
not single-disk.

Build and test the replacement in an isolated clone. Push only with an exact `--force-with-lease`
against the observed old ref, then verify a fresh public clone, the pull request and all regenerated
checks. Rewriting a branch reduces ordinary reachability; it does not prove that hosting-provider
caches or infrastructure no longer retain old objects. See
[private-editorial-workspace.md](../reference/private-editorial-workspace.md).

## Review cadence

Audit the repository against the PII checklist above before any change in public visibility. The
audit should cover both the working tree and the full git history.
