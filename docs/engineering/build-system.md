# Build System

This document describes the monorepo build system, the quality gate commands,
and the design rationale behind them. Root `package.json` is the executable
source of truth for script names; update this file in the same change whenever
command names or gate membership change.

## Overview

The build system uses:

- **pnpm** — package manager and workspace orchestration
- **Turborepo** — task runner with caching and dependency ordering
- **tsup** and **tsc** — the library build toolchain under `tooling/*`
- **Next.js** — the site build, with PDF generation appended to it

## Workspace layout

`pnpm-workspace.yaml` declares three workspace groups:

| Group          | Package                                                                                                                           | Build                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `jcdotnet/`    | `@jimcresswell/www` — the Next.js 16 site and CV                                                                                  | `next build && tsx scripts/generate-pdf.ts`                              |
| `agent-tools/` | `@engraph/agent-tools` — the Practice tooling (validators, hooks, statusline, agent CLIs)                                         | `tsc -p tsconfig.build.json`, then the executable bit on the CLI entries |
| `tooling/*`    | `@engraph/eslint-plugin-standards`, `@engraph/result`, `@engraph/safe-path`, `@engraph/type-helpers`, `@engraph/workspace-config` | `tsup` for JavaScript plus `tsc --emitDeclarationOnly` for types         |

Linking and hoisting use **pnpm defaults** (no overrides for
`linkWorkspacePackages`, `preferWorkspacePackages`, or `shamefullyHoist`), which
keeps the strict `node_modules` layout.

Internal `@engraph/*` dependencies must use the `workspace:` protocol in
`package.json` (`workspace:*` or `workspace:^`). Do not point them at the public
registry by semver alone.

Workspace package `exports` maps advertise **standard conditions only**
(`types`, `import`, `default`) and always resolve to built `dist/` output — there
is no `development` export condition, so every consumer (tsx tooling, Vitest,
Next.js/Turbopack) resolves the same built artefacts. Turbo's `^build` dependency
guarantees `dist/` exists before dependent build, lint, test, and type-check
tasks run; when invoking a workspace script directly (outside turbo), build its
workspace dependencies first. Invoke source-executed TypeScript tooling through
workspace-owned package scripts, such as
`pnpm --filter @engraph/agent-tools <script>` or the corresponding root
`agent-tools:*` wrapper.

`allowBuilds` in `pnpm-workspace.yaml` is an **intentional** allowlist: only
packages mapped to `true` may run install lifecycle scripts. Security
`overrides`, `peerDependencyRules`, and the `minimumReleaseAge` floor also live
in `pnpm-workspace.yaml`, not in root `package.json`. pnpm 12 reads no `pnpm`
field from any `package.json`: in the root manifest the field draws a warning,
and in a workspace member it is ignored without one.

**pnpm `overrides` rewrite EVERY transitive contract, not just your pins.** An
override earns its place only when the transitive resolution is itself the
problem (a CVE floor = yes; a format-tool version pin = no — `package.json`
ranges alone are the correct pin). Every override in `pnpm-workspace.yaml`
carries a comment naming the advisory, the reachability, and its removal
condition; keep that discipline when adding one.

### ESLint 9 and ESLint 10 coexist

The site declares ESLint 9 with `eslint-config-next`; `agent-tools`, every
`tooling/*` package and the root manifest (for the `lint:runtime-only` script)
declare ESLint 10. `agent-tools`, `tooling/result`, `tooling/safe-path` and
`tooling/type-helpers` lint with `@engraph/eslint-plugin-standards`. Two
configs hand-roll theirs from `typescript-eslint` and `@eslint/js` instead: the
plugin's own (`tooling/eslint`), which cannot lint through its own build, and
`tooling/workspace-config`'s, because the plugin's build and test configs
consume that package and a dependency back onto the plugin would close a
workspace cycle. `lint:runtime-only` uses `@eslint/js`'s recommended rules.
Both ESLint lines resolve in one lockfile, and the split shapes the
`brace-expansion` security override: the site's
ESLint 9 line reaches `brace-expansion` 1.x through `@eslint/config-array`'s
`minimatch@3`, and an unscoped 5.x floor broke that resolver at lint time. The
tree holds the 1.x and 5.x lines, so the override is scoped per major
(`brace-expansion@1`, `@5`), each line kept on its own patched floor; the
override's comment in `pnpm-workspace.yaml` names the advisories. Do not
collapse the two entries into one.

### `postinstall` builds `agent-tools/dist`

`pnpm install` runs `tsx agent-tools/src/bootstrap/bootstrap.ts` as the root
`postinstall`. It builds the `@engraph/*` closure that agent-tools imports
(`workspace-config` first, then the leaf packages), each with its own `tsup` and
with agent-tools' TypeScript 7 compiler for its declarations, skipping any
package whose `dist` is already current for its `src` and build config, and
then compiles `agent-tools/dist` with `tsc` directly. The
build orchestrator and the package manager stay out of the install lifecycle
(`validate-lifecycle-scripts` enforces this). The result is that the
PreToolUse guards in `.claude/settings.json`, the statusline and the agent CLIs
work immediately after a fresh clone, a new worktree, or a Vercel install.
`PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP=1` opts out deliberately. A missing
compiler (`@typescript/native`, TypeScript 7) fails the install loudly rather
than leaving the fail-open guards without `dist`.

Two other lifecycle hooks run around install: `pnpm:devPreinstall` validates
the pnpm version against `packageManager`, and `prepare` installs the husky
hooks.

### Dependency updates

`.github/dependabot.yml` schedules weekly npm version updates at the root.
`minimumReleaseAge: 1440` in `pnpm-workspace.yaml` is enforced at RESOLUTION
time only — a frozen-lockfile CI install does not re-check release ages — so a
lockfile regeneration is where the 24h floor either binds or silently does
not; pnpm's own resolver applies it deterministically, and whether Dependabot's
invocation honours it is version-dependent and unestablished here. Read
Dependabot PRs with that in mind.

The security floors in the `overrides:` block may rest on advisories a
maintainer has published in the package's own repository before GitHub reviews
them. `pnpm audit` and Dependabot read only GitHub's reviewed database, so an
audit reporting zero does not show that a floor is current: when setting or
checking a floor, also read the repository's advisories
(`gh api repos/<owner>/<repo>/security-advisories`).

Three constraints are held deliberately. A sweep must not break any of them:

- **The `typescript` name stays on the 6.0 compiler API; the compiler is
  TypeScript 7.** TypeScript 7.0 ships `tsc` but not the 6.0 compiler API
  (its programmatic surface is the `unstable/*` subpaths), and the API
  consumers here import the 6.0 API: `typescript-eslint` 8.x declares
  `typescript: ">=4.8.4 <6.1.0"` and `dependency-cruiser` 18.x supports
  `<7.0.0`. Running them on TypeScript 7 would leave type-aware linting on an
  unsupported compiler, and switching that layer off is what
  [`never-disable-checks`](../../.agent/rules/never-disable-checks.md) forbids.
  So every workspace that lists TypeScript declares both aliases from the
  [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0):
  `@typescript/native` → `npm:typescript@^7`, which supplies `tsc`, and
  `typescript` → `npm:@typescript/typescript6@^6`, which keeps the 6.0 API and
  names its binary `tsc6`. The postinstall bootstrap compiles with
  `@typescript/native`, resolving its bin through the package manifest. The
  root manifest declares the `typescript` alias too, because
  `dependency-cruiser` resolves its compiler from its location in pnpm's
  virtual store (`node_modules/.pnpm`) by walking up to the root
  `node_modules`, whichever workspace loads it.
  `next build` resolves `typescript` and
  type-checks the site with `tsc6`, while `pnpm type-check` uses TypeScript 7,
  so the site is checked by both compilers and either one blocks.
  Enforced by those alias ranges in each manifest. Getting this wrong fails
  both gates, by different routes: `typescript-eslint` stops loudly
  (`typescript-eslint does not support TS 7.0`), while `dependency-cruiser`
  on its own cruises only the JavaScript modules and exits 0, so
  `pnpm depcruise` runs it through `repo-check depcruise-gate`, which reads the
  cruise summary and fails when no supported TypeScript compiler was found, on
  any environment warning, and on a violation of any severity.
  **Lift condition: `typescript-eslint` and `dependency-cruiser` support
  TypeScript 7's API (announced for 7.1); then drop the `typescript` alias and
  declare TypeScript 7 under its own name.**
- **`@types/node` stays on 24.x**, matching `engines.node: 24.x`. Enforced by
  the `'@types/node': '^24.x.y'` override in `pnpm-workspace.yaml`, which
  covers workspaces that pull it only as a transitive peer. Lift it when the
  project moves Node majors. `pnpm -r up --latest` crosses this hold.
- **`jcdotnet` stays on ESLint 9.** `eslint-config-next` 16.x admits ESLint
  `>=9` but depends on `eslint-plugin-react` 7.37.5, whose peer range ends at
  ESLint `^9.7`; under ESLint 10 it crashes on the removed
  `context.getFilename`. Enforced by the `^9` range in `jcdotnet/package.json`;
  the other workspaces are on ESLint 10. ESLint 9 is out of support upstream
  (npm marks 9.39.5 deprecated), so this hold carries risk and is worth
  re-checking at every sweep. **Lift condition: `eslint-plugin-react` ships
  ESLint 10 support.**

All three holds must survive a full lockfile rebuild — see
[`lockfile-rebuild-survivability`](../../.agent/rules/lockfile-rebuild-survivability.md).

**Project `.npmrc` is optional.** Use it for npm-compatible registry and auth
only (`registry`, scoped registry maps, tokens). Avoid pnpm-only keys in
`.npmrc`: npm 9+ warns on unknown project config, and a future npm major may
treat that as an error. Other pnpm settings belong in `pnpm-workspace.yaml`
(see [pnpm settings](https://pnpm.io/settings)).

## Build Order

Every workspace exports a `build` script, and Turbo's `^build` dependency
orders them by the workspace dependency graph:

```text
┌──────────────────────────────┐
│ @engraph/workspace-config    │  ← leaf: no workspace deps; every tsup config imports it
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────────────────────────────────┐
│ @engraph/result · @engraph/safe-path · @engraph/type-helpers │
│ @engraph/eslint-plugin-standards                         │
└──────────────┬───────────────────────────────────────────┘
               ▼
┌──────────────────────────────┐
│ @engraph/agent-tools         │  ← imports the leaf packages from built dist/
└──────────────────────────────┘

┌──────────────────────────────┐
│ @jimcresswell/www            │  ← no @engraph/* runtime deps; next build + PDF
└──────────────────────────────┘
```

`@engraph/eslint-plugin-standards` is a `devDependency` of the packages it
lints, so it is built before their `lint` tasks run (`lint` depends on
`^build`).

### PDF generation is part of the site build

`@jimcresswell/www`'s `build` script is
`next build && tsx scripts/generate-pdf.ts`: after the Next.js build the script starts a local
server, renders `/cv` with Puppeteer's full Chrome, and stores the PDF in
Vercel Blob (when `BLOB_READ_WRITE_TOKEN` is set) or under `.next/` locally.
Vercel's `buildCommand` (`jcdotnet/vercel.json`) installs the Chrome system
libraries and the browser before running the same script; CI's `e2e` job
installs the Puppeteer and Playwright browsers for the same reason. The
mechanics, environment variables and operational notes live in
[Architecture §PDF Generation](../architecture/README.md#pdf-generation) and
[ADR-001](../architecture/decision-records/001-build-time-pdf-generation.md).

### Turbo task overrides replace, they do not merge

`turbo.json` overrides `lint`, `lint:fix`, `type-check`, `test` and `test:e2e`
for `@engraph/agent-tools` so they also depend on the package's own `build`
(its CLIs and hook dispatchers are exercised from `dist/`) and hash
`runtime-only-scripts/**` as an input. Task-specific overrides
(`@package#task`) **replace** the generic task definition entirely — they do
NOT merge with it. Every override MUST restate `outputs`, `inputs`, and `cache`
from the generic parent, or those fields default to empty: an override with
only `dependsOn` produces `outputs: []`, so cache hits restore zero files.
Verify overrides with `turbo run <task> --filter=<package> --dry=json` and
inspect `resolvedTaskDefinition`. Corollary: a workspace with any
`@package#task` override needs overrides for every task type it uses, or the
missing ones fall through to the generic inputs and produce stale cache hits.

## Quality Gate Surfaces

Quality is enforced through four surfaces, each triggered at a different point
in the development lifecycle:

| Surface        | Runs                                                                                                                                                                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **pre-commit** | The branch guard (refuses commits on `main`), Prettier and markdownlint on the staged files, and `turbo run lint` for the workspaces changed since `HEAD` (`repo-check lint-changed`, which skips the run when turbo plans no task, as for a commit that changes no workspace). Light by design (owner ruling 2026-09-12: light commit, full push). |
| **commit-msg** | `prevent-accidental-major-version`, then commitlint (Conventional Commits).                                                                                                                                                                                                                                                                         |
| **pre-push**   | `pnpm check` plus the site's end-to-end suite (`pnpm --filter @jimcresswell/www test:e2e`).                                                                                                                                                                                                                                                         |
| **CI**         | `.github/workflows/ci.yml` — four jobs after `install`: `secret-scan`, `static-checks` (format, markdown, shell, runtime-only, sub-agents, portability, skills, encoding, the docs and repo validator aggregates, knip, depcruise), `build-and-test` (build, lint, type-check, test, the agent-tools end-to-end and smoke suite), `e2e`.            |

The merge, cherry-pick and revert paths fire `pre-merge-commit`,
`prepare-commit-msg` and `applypatch-msg`, which carry the same branch guard.

**Key principle**: pre-push and CI run the same check set.
`validate-check-ci-parity` refuses a drift between the `check` legs and the
workflow's run steps, so a CI-only failure indicates an environmental or
configuration issue (a cold cache, a missing browser, a lockfile that does not
match), not a missing check.

The full gate is authoritative in both directions. A **successful push has
already run the entire pre-push gate** — the push cannot succeed otherwise —
so do not offer `pnpm check` or CI-watching merely to "confirm green" after
a push succeeds. Conversely, a green declared on a **partial local subset**
(e.g. lint + type-check + tests, but not format-check) is never proof the
commit or push will pass: the gates are independent, so enumerate the
actual gate set the boundary will run and run that set, never the
convenient subset.

## Quality Gate Commands

The canonical one-leg-per-line sequence, and the gates that live outside the
aggregate, are listed in the
[gates skill](../../.agent/skills/change-custody/gates/SKILL-CANONICAL.md);
this section explains the shape, not the list.

Validate through the canonical root commands, never ad-hoc per-package
invocations from the repo root (e.g. running vitest against a path at root).
Ad-hoc runs bypass per-package config (vitest `globals`, setup files) and the
workspace boundary, producing failures (`describe is not defined`, foreign
worktree copies pulled in) that are artefacts of the wrong command, not the
code — and a red result from the wrong command is still yours to trace to that
root cause, never to dismiss as a harness quirk.

### `pnpm check` — the full aggregate

`pnpm check` is the only canonical **full** aggregate verification command and
it writes **no tracked file**: it composes the root format and markdown checks, the shell
and runtime-only lints, the Turbo `lint`, `type-check` and `test` tasks, knip,
depcruise, the secret scan, and the Practice validators (portability,
sub-agents, skills adapters, encoding, the `docs-validators:check` aggregate
with machine-local paths among its legs, and the `repo-validators:check`
aggregate, whose legs include the substrate audit `practice:substrate:check`
and the inter-Practice wire-contract check). The
audit's instance-tier leg validates the live collaboration state of the
checkout it runs on: an absent, untracked-by-design surface (the claim
registries, the shared-comms-log render) reads as informational, so a fresh
checkout and CI always pass it, while a present-but-invalid registry or a
stale render — or a render deleted while events exist — is blocking. That is
the one leg whose verdict can differ between a live checkout and CI, by
design: CI can only ever see the informational verdict. The aggregate's only
write is the agent-tools build output under `agent-tools/dist` (ignored, and
rebuilt by the end-to-end leg so the smoke suite proves the built binaries),
so it is the surface pre-push, CI and any repo-wide claim of green cite.
`pnpm check` is an alias kept so the hook and the parity validator have a
stable name.

The root format and markdown legs take the **tracked tree** as their universe:
`repo-check prettier-tracked` and `repo-check markdownlint-tracked` ask
`git ls-files` for the file list (the pre-commit hook's `prettier-staged` and
`markdownlint-staged` ask for the staged set the same way) and pass it to the
tool, so the gate reads the same on every checkout and in CI. A disk walk would
lint whatever one machine happens to carry — a build output, a generated read
model, an editor's workspace file — and prove that machine, not the repository.
`.prettierignore` and `.markdownlint-cli2.jsonc` therefore declare **ownership**
only (which tracked surfaces each tool governs), never existence.

`pnpm check` does not build the site or run its browser suites; those run on
their own surfaces (`pnpm build`, `pnpm test:e2e`). It does run the
agent-tools end-to-end and smoke suite (`pnpm agent-tools:test:e2e`): the
in-process end-to-end tests, then every `smoke-tests/*.smoke.ts`, discovered
from the directory rather than listed, so a new smoke is gated the moment it
exists.

### `pnpm fix` and `pnpm fix:docs` — the mutating repairs

`pnpm fix` runs `format:root`, `markdownlint:root` and `lint:fix` — the
auto-fixers only, and `pnpm fix:docs` the docs subset. Run `pnpm check` after either, so
the proof that follows the repair is the same gate. Use the repairs
to cure a failing proof, then re-run the proof from the beginning; a mutating
command is never final evidence that the tree is clean.

### `pnpm check:docs` — documentation work gate

Runs the focused verify-only baseline for general documentation changes without
builds, product tests, or browser suites: root Prettier and markdownlint, then
the documentation validators (`validate-reference-direction`,
`validate-no-machine-local-paths`, `validate-no-lineage-names`,
`validate-markdown-links`, `validate-cited-scripts`, `validate-cited-paths`,
`validate-patterns-index`).
It is deliberately narrower than `pnpm check` and
makes no full-repository verification claim. Fitness reports
(`pnpm practice:fitness` and siblings) are not part of this gate: they remain
signals and never justify deleting or compressing knowledge.

#### Aggregate gate doctrine

- `pnpm check` is executable truth. CI, prompts, and READMEs name this surface
  for full-repository verification; documentation-only work uses
  `pnpm check:docs`.
- Extend `pnpm check` rather than adding a second competing full-gate surface.
- Repo-wide claims stay within the workspace task exports that back them. A
  workspace is only in the repo-wide `lint`, `type-check`, or `test` story if
  it exports that task (`@engraph/workspace-config` exports no `test`, for
  example).
- Package-local green is navigation, not acceptance. It helps locate a
  problem, but it does not replace the last full repo-root gate when making a
  repo-wide claim.
- Aggregate gates expose failures in layers. The root shell chain stops at the
  first red leg, so an upstream red stage hides downstream stages until it is
  fixed; a continue-mode turbo run
  (`pnpm exec turbo run lint type-check test --continue`) reveals several
  failures within the Turbo stage but does not prove the later root-only legs
  would pass.

## Task Dependencies

```text
build → test, type-check, lint / lint:fix   (via ^build: dependencies build first)
build → test:e2e                            (same-package build: Playwright needs the artefact)
```

| Task                | Depends On | Why                                                          |
| ------------------- | ---------- | ------------------------------------------------------------ |
| `build`             | `^build`   | Dependencies build first                                     |
| `type-check`        | `^build`   | Upstream `.d.ts` files must exist for type checking          |
| `lint` / `lint:fix` | `^build`   | The ESLint plugin package must be built before linting       |
| `test`              | `^build`   | Workspace packages resolve from `dist/`                      |
| `test:e2e`          | `build`    | Same-package build for the production-build Playwright suite |

`@engraph/agent-tools` additionally depends on its own `build` for `lint`,
`lint:fix` and `type-check` (see the override note above). `globalDependencies`
(`**/.env.*local`, `tsconfig.base.json`) invalidate every task when they
change.

**Undeclared dependencies present as race-shaped failures — never mask them
with concurrency clamps.** If reducing concurrency "fixes" a build, the real
defect is a missing dependency edge — declare it (in the workspace
`package.json` and, where task-level, `turbo.json`) and remove the clamp.

## Caching

Remote caching is enabled in `turbo.json`; the hooks export `TURBO_UI=0` so the
TUI does not swallow output.

| Task                            | Cached | Notes                                                            |
| ------------------------------- | ------ | ---------------------------------------------------------------- |
| `build`                         | ✅     | Outputs `dist/**` and `.tsup/**`                                 |
| `@jimcresswell/www#build`       | ✅     | Outputs `.next/**` minus `.next/cache/**`; hashes the Vercel env |
| `type-check`                    | ✅     | Re-checks only when source changes                               |
| `lint`                          | ✅     | Re-lints only when source or config changes                      |
| `test`                          | ✅     | Re-runs only when source or tests change                         |
| `test:e2e`                      | ✅     | Re-runs only when the e2e inputs change                          |
| `@engraph/agent-tools#test:e2e` | ❌     | The smoke suite proves the built binaries every run; no outputs  |
| `lint:fix`                      | ❌     | Modifies source files                                            |
| `clean`                         | ❌     | Destructive operation                                            |
| `dev`                           | ❌     | Persistent process                                               |

### A task's declared outputs must cover its full write-set

Turbo restores exactly the declared `outputs` globs on a cache replay. When a
task script writes a file outside those globs, a replay restores part of the
task's effect and silently skips the rest. The site is the worked instance: the
generic `build` task declares `dist/**` and `.tsup/**`, but `next build` writes
`.next/` (and the site's build script writes the CV PDF under `.next/` too), so
until 2026-09-14 a Turbo cache hit on `@jimcresswell/www#build` restored
nothing. The package task now declares `.next/**` minus `.next/cache/**`, and
because a hit now replays the artefact it also declares in `env` every variable
the build bakes in or branches on (the Vercel environment and URLs that shape
the canonical URL, and the blob token and deployment identifiers that decide
whether and where the PDF is uploaded), so a hash never collides across
deployments. Playwright's web server and Vercel run the site's own `build`
script directly, outside Turbo. When adding or changing a task, enumerate every
path its script writes (read the script, not the task name) and declare them
all, and every environment variable that changes what it writes.

## Mixing pnpm and turbo

Use turbo for workspace tasks that benefit from caching, tasks with
cross-workspace dependencies, and parallel execution of independent tasks. Use
pnpm for root-only operations (`format-check:root`, `markdownlint-check:root`, `lint:shell`,
`lint:runtime-only`, the validators) and for the `agent-tools:*` wrappers. The
root has no workspace entry, so making root operations turbo tasks would need
special configuration; the current split is simpler and correct.

## Troubleshooting

### Stale build artefacts

```bash
pnpm clean
pnpm build
```

### Type-check fails with "Cannot find module '@engraph/…'"

Workspace packages resolve from built `dist/`, so this means a producer was
not built before the consumer ran. Confirm the generic `type-check` task in
`turbo.json` depends on `["^build"]`, then run `pnpm clean && pnpm build`.

### `pnpm install` runs a bootstrap `tsc` — a surprise early gate

Editing a workspace `package.json` (e.g. adding a script) makes the next pnpm
run re-verify dependencies, which triggers the postinstall bootstrap and a
whole-package `tsc` over agent-tools. This catches real type errors BEFORE any
explicit type-check pass — read the error HEAD (the tail is pnpm plumbing).
Used deliberately, it is a free whole-package pre-gate: run `pnpm install` in
a worktree immediately after resolving a merge, before reaching for the gate
suite.

### Lint runs against the BUILT eslint plugin — config-source edits are invisible until rebuild

An edit to `@engraph/eslint-plugin-standards` source (a rule config or
allowlist) does not affect lint output until the plugin package rebuilds —
ESLint resolves the built `dist/`. Rebuild the plugin after every
config-source edit before trusting a lint readout.

### Cache misses on every run

1. **Directory paths in inputs** — a bare directory path makes Turbo hash the
   whole directory including build outputs. Use file globs, or rely on
   `dependsOn: ["^build"]` for cross-package dependencies.
2. **Both `env` and `passThroughEnv` for the same variable** — the value then
   affects the hash. Use `passThroughEnv` (the repo uses
   `globalPassThroughEnv`) for values that must not affect caching.
3. **Unstable generated outputs** — timestamps or random ordering in a
   generated file miss every time; keep generators deterministic.

To debug cache misses:

```bash
turbo run build --dry=json | jq '.tasks[0].inputs'
turbo run build --dry=json | jq '.tasks[] | {task: .taskId, hash: .hash}'
```

## Command Naming: Source of Truth

The root `package.json` `scripts` field is the single source of truth for
command names. When documenting commands in markdown, use the exact names from
`package.json`; `validate-cited-scripts` (part of `pnpm check:docs`) refuses
any `pnpm <script>` in a code span or fenced block that no `package.json`
defines. Note the read-only/mutating pairs: `pnpm format-check:root` checks and
`pnpm format:root` writes; `pnpm markdownlint-check:root` checks and
`pnpm markdownlint:root` writes; `pnpm lint` checks and `pnpm lint:fix` writes.

### Drift Prevention Checklist

After renaming or adding commands in `package.json`:

1. Search all `.md` files for the old command name:
   `rg 'pnpm old-name' --glob '*.md'`
2. Update every non-archive match to the new name
3. Run `pnpm check:docs` — the cited-scripts validator catches what the search
   missed
4. Verify onboarding-path docs specifically:
   - `README.md` (root, especially Getting Started)
   - `CONTRIBUTING.md`
   - `.agent/directives/AGENT.md`
   - `.agent/skills/change-custody/gates/SKILL-CANONICAL.md`

## Documentation Link Integrity

Broken links silently erode the onboarding experience. `validate-markdown-links`
(part of `pnpm check:docs`) checks every relative link target; run it after
deleting or moving any markdown file and before merging documentation PRs. To
find references to a moved file by hand:

```bash
rg 'old-filename\.md' --glob '*.md'
```

The documentation follows a progressive disclosure chain; verify it is intact
after structural changes:

```text
README.md (root, including Getting Started)
  → CONTRIBUTING.md
    → workspace READMEs (jcdotnet/, agent-tools/, tooling/*)
      → docs/ — architecture, ADRs, engineering, editorial
```

## Knip Configuration Gotchas

- **Standalone scripts need `entry`, not just `project`**: knip only traces
  dependency trees from `entry` points. Scripts invoked via `tsx` (not
  imported by the main entry) must be listed as entries. `project` defines
  the file set; `entry` defines the dependency graph roots.
- **Root workspace requires `workspaces["."]`**: top-level `entry`/`project`
  fields are ignored when `workspaces` is defined.
- **A gate whose config is DERIVED from a contract surface breaks silently
  when that surface changes.** knip once auto-detected workspace entry points
  through a `development` export condition; when exports went dist-only
  (2026-07-03) it silently lost its source entries and reported dozens of
  phantom "unused" findings. Cure: explicit source `entry` declarations
  mirroring each exports map (`knip.config.ts`), and generally: when changing
  a contract surface (exports maps, tsconfig, lockfile), list the gates that
  derive config from it and re-derive them.

## File Cleanup After Deletion

Empty directories persist after file deletion — always `rmdir` after deleting
the last file. The portability validator checks for `SKILL.md` presence, so
an empty skill directory causes a false positive.

## Filtered Gates Certify Less Than They Appear To

A green gate run certifies only the suites it actually ran, against the
artefacts it actually resolved:

- **A filtered `pnpm --filter @engraph/agent-tools type-check` can pass on
  stale types**: `tsc` resolves workspace dependencies via their built
  `dist/*.d.ts`, while vitest resolves `src` — so a filtered type-check can go
  green against stale dist types (or red against types a rebuild would fix)
  while tests see different code. When a filtered result is load-bearing,
  rebuild the producer workspaces first (the full `pnpm check` orders `^build`
  ahead of `type-check` for exactly this reason).
- **A fresh checkout or worktree cannot lint until producer workspaces are
  built** — the flat config imports `@engraph/eslint-plugin-standards` from
  `dist/`. The postinstall bootstrap covers the agent-tools closure; run
  `pnpm build` for the rest.
- **`pnpm check` does not run every suite** (the site's `test:e2e` and `build`
  are outside it; the agent-tools smoke suite is inside it through
  `agent-tools:test:e2e`, while the per-file `smoke:*` scripts stay manual
  shortcuts) — verify the aggregate actually exercises
  the suites your change touches before citing it as proof. When reporting,
  distinguish **run-verified** (the gate exercised the change) from
  **construction-verified** (a behaviour-preserving no-op the gate never
  ran) — a green aggregate says nothing about the latter.

## Serial Gate Chains Unmask Downstream Failures

`pnpm check`'s serial chain hides downstream failures behind upstream ones: a
leg that exits red stops the chain, so everything after it is unobserved, and
clearing one leg routinely unmasks previously-latent failures in the next.
Treat each newly-green leg as a magnifying glass on the one after it — a red
gate appearing after you fixed a different gate is usually unmasking, not
regression. Prefer single-gate iteration over whole-chain reruns while
converging.

## Linting and Auto-Fix Safety

- **`lint:fix` can silently revert manual edits**: `pnpm fix` runs
  `lint:fix`. If an edit introduces code that the linter
  "fixes" back, the edit is lost mid-pipeline. Verify the edited file AFTER
  the repair aggregate, not just after a single gate.
- **Reviewer fixes must exist on disk**: a disposition recorded in a napkin,
  summary, or review thread is not evidence. Open or search the target file
  after applying the fix, especially after auto-fix gates.
- **Never edit generated files** — edit the generators instead. When knip or
  depcruise flags a generated file (the skills adapters under
  `.claude/skills/`, for example), fix the generator that produced it and
  regenerate (`pnpm skills:generate`, `pnpm portability:fix`).

## Related Documentation

- [Gates skill](../../.agent/skills/change-custody/gates/SKILL-CANONICAL.md) — the canonical gate sequence
- [ADR-001: Build-time PDF generation](../architecture/decision-records/001-build-time-pdf-generation.md)
- [ADR-005: Knip for unused code and dependency detection](../architecture/decision-records/005-knip-unused-code-detection.md)
- [ADR-019: Playwright runs against a production build](../architecture/decision-records/019-playwright-against-production-build.md)
- [`lockfile-rebuild-survivability`](../../.agent/rules/lockfile-rebuild-survivability.md)
- [Tooling](../../.agent/reference/tooling.md)
