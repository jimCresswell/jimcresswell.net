---
fitness_line_target: 200
fitness_line_limit: 260
fitness_char_limit: 12000
fitness_line_length: 100
---

# Distilled Learnings

Quick-reference entries that are NOT in permanent docs. Read before every session. See
`docs/architecture/README.md` for full architecture coverage.

---

## Workspace Quick Reference

- Contact email: <contact@jimcresswell.net>; pronouns: he/him; honorific prefix: Dr (all in
  `content/entities.json` Person entity)

## Troubleshooting

- `StrReplace` fails on markdown files: Unicode quotes block matching, so read
  the exact text first
- Prettier reformats code fences: language tag `text` gets applied to bare
  fences
- Playwright import fails on JSON-backed app modules: keep route-emission
  proof in Playwright, but move app-module contract proof to Vitest or import
  raw JSON directly
- GitHub's Copilot pull-request reviewer login is
  `copilot-pull-request-reviewer[bot]`; omitting `[bot]` returns 422.
- SSH-signed commits can appear as `No signature` in local `git log` when
  `gpg.ssh.allowedSignersFile` is absent. Verify the commit through GitHub or
  configure allowed signers before classifying it as unsigned.

## Playwright runs against a production build

`pnpm test:e2e` now uses `pnpm build && pnpm start` as its web server.
Production removes the dev-only Turbopack `Runtime ChunkLoadError` overlay and
the Next.js dev-tools issue badge that previously caused intermittent E2E
failures and forced narrow per-route stabilising helpers. PDF generation is
part of the build, so PDF tests run alongside everything else (no separate
`with-build` project). When in doubt, prefer producing more proof at the
production layer over working around dev-server transients in test code.

## Harness activation order (2026-09-12 transplant)

The PreToolUse guard fails closed and reloads the moment `.claude/settings.json`
changes. Land `.agent/hooks/policy.json` first, make sure `agent-tools/dist`
is built (the `postinstall` bootstrap does it), and only then wire `hooks` in
settings. Done in the other order, every Bash, Edit and Write call is refused
until the policy file exists. Source: napkin 2026-09-12; routing: pending
graduation 1.

## Staging a large set without the wildcard guard

`git add -u -- . ':!path'` trips the wildcard-staging guard and a refused
command aborts the rest of its `&&` chain silently. Stage with
`git diff --name-only | xargs git add --`, write commit-message files in their
own command, and run `pnpm agent-tools:check-commit-message -F <file>` before
`git commit -F`. Source: napkin 2026-09-12; routing: pending graduation 2.
