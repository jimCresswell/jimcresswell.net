---
classification: situational
description: invoke config expert
trigger: surface:tsconfig, ESLint, Vitest, Prettier, markdownlint, Turbo, knip, dependency-cruiser, Husky, package.json scripts, next.config, postcss, Playwright config
---

# Invoke Config Reviewer

Invoke `config-expert` when changes touch TypeScript, ESLint, Vitest, Prettier, markdownlint,
Turbo, knip, dependency-cruiser or Husky configuration, `package.json` scripts, locks, env
handling, the site's Next.js, PostCSS or Playwright settings, or deployment-relevant tooling. Use
it whenever platform behaviour might change because configuration changed.

See `.agent/sub-agents/templates/config-expert.md` for the full reviewer brief.
