# Validation Scripts

This repo now carries two small validation surfaces that are worth sharing as
context. They are practical local tooling choices, not portable Core doctrine.

## Portability validation

Outcome: `scripts/validate-portability.mjs` checks that thin wrappers still
point at the canonical `.agent/` sources, that Codex reviewer registration is
wired correctly, and that the local cross-platform surface matrix exists.

Impact: adapter drift stops being a silent documentation problem and becomes a
blocking tooling failure.

Value mechanism: multi-platform support stays honest without requiring every
contributor to inspect several directories by hand.

## Practice fitness validation

Outcome: `scripts/validate-practice-fitness.mjs` checks the four-field fitness
frontmatter (`fitness_line_target`, `fitness_line_limit`,
`fitness_char_limit`, `fitness_line_length`) on governed docs.

Impact: document growth becomes visible and discussable, rather than silently
accumulating until files are unmanageable.

Value mechanism: the repo gets soft targets and hard limits without making
every doc edit block on advisory concerns.

## Local policy

- `pnpm check` includes `pnpm portability:check`
- `pnpm practice:fitness` is the strict mode when a task needs enforcement
- `pnpm practice:fitness:informational` is the normal companion report when
  changing Practice or directive docs
