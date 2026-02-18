# Security Operations

Operational security practices for this repository. These rules apply to all contributors — human and AI.

## Git identity

Use `git@jimcresswell.net` as the author email for all commits in this repository. All commits must be GPG-signed.

```bash
git config user.email "git@jimcresswell.net"
git config commit.gpgsign true
```

## Guiding principle

If content would be useful to a social engineer, it does not belong in version control. This applies to commit messages, plan files, code comments, and any other tracked content.

## PII audit checklist

Before making this repository public (or changing visibility), audit for:

- [ ] Personal email addresses in tracked files and git history
- [ ] Psychological profile content (see [privacy.md](privacy.md) for categories)
- [ ] Physical location specifics beyond what is intentionally public
- [ ] Political specifics (year, party, ward, outcome)
- [ ] Third-party names without consent
- [ ] Career breadth details that belong in `.agent/private/`

## Content in plan files

Plan files in `.agent/plans/` are version-controlled and will be visible if the repo is public. They should be written as if they will be read by anyone.

- Store editorial constraints and decisions in plan files.
- Store private biographical context in `.agent/private/`, not in plan files.
- When a plan references private details, point to `.agent/private/identity.md` rather than inlining the content.

## Quality gate

`gitleaks` is part of the quality gate (`pnpm check`) and scans the full git history for secrets on every commit. It catches accidental credential commits but does not detect PII or psychological content — the rules in [privacy.md](privacy.md) cover those categories.

## Review cadence

Audit the repository against the PII checklist above before any change in public visibility. The audit should cover both the working tree and the full git history.
