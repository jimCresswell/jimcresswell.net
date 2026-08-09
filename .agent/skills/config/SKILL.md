---
name: config
classification: active
description: Use when work changes Next.js, pnpm, env, or tooling configuration surfaces.
---

# Config

Use this skill while changing build or runtime configuration, scripts, lockfiles,
or environment-loading behaviour. It complements `config-reviewer`; use the
reviewer to independently assess the finished configuration surface.

## Read in order

1. `.agent/sub-agents/templates/config-reviewer.md`
2. `.agent/rules/invoke-config-reviewer.md`
3. Relevant root config files such as `package.json`, `pnpm-lock.yaml`,
   `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `eslint.config.ts`,
   `playwright.config.ts`, `vitest.config.ts`, and `proxy.ts`
4. Any product files that consume the configuration you are changing

## How to use it

1. Start from the contract: which script, flag, path, or env value is supposed
   to change, and what user-facing behaviour depends on it.
2. Prefer one obvious configuration path over layered fallbacks or duplicate
   script names.
3. Check every referenced file path and script name directly; config drift here
   is usually a broken pointer, not a subtle algorithmic bug.
4. Hand off to `config-reviewer` after implementation, and use
   `security-reviewer` as well when the config change affects headers, secrets,
   or proxies.
