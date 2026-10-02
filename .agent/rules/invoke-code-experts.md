---
classification: core
description: After non-trivial changes, invoke specialist experts.
---

# Invoke Specialist Experts

Operationalises the [sub-agent architecture](../sub-agents/README.md) — layered prompt composition and domain-specialist experts.

After non-trivial changes, invoke specialist experts. `code-expert`
is the gateway reviewer: triage what changed, choose the
specialists and review depth needed, capture findings explicitly, and act on
them before considering the work complete.

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer catalogue and invocation policy.

Each test change gets a `test-expert` verdict before it is committed, and the commit message
or the pull-request body records the verdict (both estates' practice from 2026-09-29, after
test changes landed against the testing directive with green gates).
