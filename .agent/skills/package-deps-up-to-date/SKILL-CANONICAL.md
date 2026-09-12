---
name: package-deps-up-to-date
classification: active
description: Check and refresh JavaScript package dependencies for any `package.json` project by detecting the package manager, reporting outdated packages, and applying manager-appropriate safe upgrades. Use when auditing dependency freshness before release or updating dependencies on request.
---

# Package Deps Up To Date

Use this skill when a repository has `package.json` and you
need a package-manager-aware dependency freshness check
without assuming npm, pnpm, or yarn.

## Primary action

Use the bundled script first:

```bash
python3 .agent/skills/package-deps-up-to-date/scripts/check-package-deps.py <project-path>
```

Useful flags:

- `--json` for structured output
- `--apply` for semver-safe upgrades
- `--apply --major` only when major-version drift is
  intentionally accepted

## Workflow

1. Confirm the target project contains `package.json`.
2. Run the script to detect the package manager and report
   outdated dependencies.
3. Summarise the stale ranges and the detected manager.
4. Apply updates only when requested.
5. Re-run the script after applying updates to confirm the
   repo is clean.
6. Run the target repo's quality gates before concluding.

## Detection order

The script detects the package manager in this order:

1. `packageManager` field in `package.json`
2. lockfile presence
3. available CLI on `PATH`

## Resources

- `scripts/check-package-deps.py` for the primary audit and
  apply workflow
- `references/manager-commands.md` for manager-specific
  command details and caveats

## Guardrails

- Default update mode is semver-safe: `npm update`,
  `pnpm up`, or `yarn upgrade`
- Major updates require explicit intent
- Prefer the script over re-deriving manager-specific
  commands by hand
- In this repo, `pnpm` remains mandatory; the multi-manager
  logic exists so the skill also works against external
  `package.json` projects
