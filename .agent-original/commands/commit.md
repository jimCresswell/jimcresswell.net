# Commit Current Work

Create a well-formed commit for the current changes.

## Process

1. **Check status** — run `git status` to see what has changed.
2. **Review the diff** — `git diff` (and `git diff --cached` if staging) to understand exactly what will land.
3. **Verify the quality gates** — run `gates` or `pnpm check` so you know the tree is clean before staging.
4. **Stage selectively** — add only the files that belong in this commit. Never stage `.env`, credentials, or `bulk-downloads/`. Review each file before staging.
5. **Formulate the message** — use Conventional Commit format, keep the subject under 99 characters, describe _why_ the change matters.
6. **Commit** — run `git commit` with the message.
7. **Verify** — run `git status` again to confirm a clean working tree and `git log -1` to double-check the message.
8. **Push** — only if the user explicitly asked for it and branch policies allow, `git push`.

## Commit Message Format

```text
type(scope): concise description

Optional body explaining why, not what.
```

Approved types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`.

## Safety Rules

- Do **NOT** rewrite history or discard changes. No `git reset`, `git clean`, `git checkout --`, or `--force` on push.
- Do not push unless the user explicitly asked for it.
- Never bypass hooks (`--no-verify`) — the gates exist for a reason.
- Do not commit secrets, credentials, or generated bulk assets.
- Always review staged files before committing.

Any desperate-looking shortcut (stashing, force pushing, disabling hooks) must be validated with the user first.

## If Issues Arise

Fix them properly. No skipping tests, no disabling checks, no turning off lint rules.

See also: `.agent/directives/principles.md`, `.agent/directives/testing-strategy.md`
