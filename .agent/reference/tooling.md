# Tooling

All tooling MUST use the latest versions. `pnpm outdated` is the first-pass
check — but it computes its "latest" under the workspace's
`minimumReleaseAge` floor, so an age-floored release's row reads current
there (verified 2026-08-11, pnpm 11.20). The exhaustive currency check is
registry reads — `pnpm view <pkg> version` / `pnpm view <pkg> time` — per
the update-dependencies skill's age-floor census.

> `pnpm outdated` / `pnpm run outdated` (the repo's `outdated` script, recursive over the workspace) exits with a
> non-zero code when it finds outdated packages. That is the command's normal
> "updates available" signal, not a failure — scripts and CI must not treat the
> exit code as an error.

## Build System

- [pnpm](https://pnpm.io) - Package manager and workspace orchestration
- [Turborepo](https://turbo.build/repo) - Task runner with caching and dependency management (see [Build System docs](../../docs/engineering/build-system.md))

## Development

- [pnpm](https://pnpm.io)
- [husky](https://typicode.github.io/husky) - [set up with `pnpm dlx husky-init`](https://www.npmjs.com/package/husky-init)
- [lint-staged](https://github.com/okonet/lint-staged)
- [TypeScript](https://www.typescriptlang.org) - with strict settings.
- [Prettier](https://prettier.io)
- [ESLint](https://eslint.org)
- [Vitest](https://vitest.dev)
- [Supertest](https://github.com/visionmedia/supertest)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Zod](https://www.npmjs.com/package/zod)
- [tsup](https://tsup.egoist.dev) [package at](https://www.npmjs.com/package/tsup)
- [commitlint](https://commitlint.js.org)

## Running

- [tsx](https://www.npmjs.com/package/tsx) for directly running the TypeScript
- [Node.js](https://nodejs.org) 24.x for running the compiled JavaScript

## External System Tools

These tools are not managed by pnpm but are required by specific workflows:

- [gitleaks](https://github.com/gitleaks/gitleaks) — required for secrets scanning
  (`pnpm secrets:scan`, a `pnpm check` leg, so also at pre-push and in CI)
- [shellcheck](https://www.shellcheck.net) — required for shell script linting
  (`pnpm lint:shell`, a `pnpm check` leg, over every tracked shell script) at the
  version `.agent/setup/install-shellcheck.sh` pins; the script installs it for
  developers, CI and cloud sessions alike
- [Playwright browsers](https://playwright.dev/docs/browsers) — `pnpm --filter @jimcresswell/www exec playwright install chromium-headless-shell`
  once per checkout, before `pnpm test:e2e`

Scripts that require these tools should emit explicit installation guidance when
the command is missing.

## Publishing

- [Vercel](https://vercel.com) — the site deploys from `main`; nothing is
  published to a package registry (the `@engraph/*` packages are private
  workspace packages).

## TSDoc Compliance

TSDoc compliance is enforced at two layers:

1. **Lint-time enforcement**: `eslint-plugin-tsdoc` is installed in
   `@engraph/eslint-plugin-standards`; non-standard tags in hand-written
   code fail lint (no warnings are tolerated).

2. **Custom tag declaration**: `tsdoc.json` configs (root and
   per-workspace) declare `@generated` as a custom modifier tag,
   allowing it to pass the TSDoc parser without triggering warnings.

The lineage's third layer — stripping non-standard tags from generated
code at generation time — has no subject here, since no code is generated
from an external schema.

## Validation

- [Claude Code](https://www.npmjs.com/package/@anthropic-ai/claude-code) (installed globally)
