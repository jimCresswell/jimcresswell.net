---
classification: situational
description: Keep TSDoc and contract docs truthful and current
trigger: surface:**/*.ts,**/*.tsx,docs/**/*,.agent/**/*,README.md
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - docs/**/*
  - .agent/**/*
  - README.md
---

# TSDoc And Documentation Hygiene

Keep exported functions and non-trivial internal logic documented with TSDoc, and update contract
docs when tooling, rules, or behaviour changes. Permanent documentation must stay truthful, use
canonical names, and never depend on ephemeral plan files.

See `.agent/directives/principles.md` for the full policy.
