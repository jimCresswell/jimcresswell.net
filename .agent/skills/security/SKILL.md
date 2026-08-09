---
name: security
classification: active
description: Use when work changes headers, secrets, env, proxies, middleware, or trust surfaces.
---

# Security

Use this skill while changing headers, secrets handling, env loading, proxy or
middleware behaviour, third-party scripts, or dependency surfaces with
meaningful security impact. It complements `security-reviewer`; use the
reviewer for the independent defensive review.

## Read in order

1. `.agent/sub-agents/templates/security-reviewer.md`
2. `.agent/rules/invoke-security-reviewer.md`
3. `.agent/directives/secops.md`
4. Relevant changed files such as `next.config.ts`, `proxy.ts`, `app/api/**`,
   and any env or dependency surfaces

## How to use it

1. Start by naming the boundary being defended: header policy, secret handling,
   request validation, client-bundle exposure, or third-party trust.
2. Keep secrets on the server side, narrow the number of places that read
   `process.env`, and avoid serialising sensitive values into rendered output.
3. Check the existing decision records before widening a security surface; this
   repo already has explicit header and operational-security choices.
4. Hand off to `security-reviewer` after implementation, and pair with `config`
   when the security change also rewires build or runtime configuration.
