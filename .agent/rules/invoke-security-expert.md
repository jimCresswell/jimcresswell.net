---
classification: situational
description: invoke security expert
trigger: surface:headers, secrets, middleware, proxy, CSP
---

# Invoke Security Reviewer

Invoke `security-expert` when changes touch headers, secrets, env loading, proxies, middleware,
dependencies, auth, or public attack-surface behaviour. Use it for any change that could widen the
security posture.

See `.agent/sub-agents/templates/security-expert.md` for the full reviewer brief.
