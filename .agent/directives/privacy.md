---
fitness_line_target: 60
fitness_line_limit: 80
fitness_char_limit: 4200
fitness_line_length: 100
split_strategy: Split by responsibility — extract PII handling from psychological safety
---

# Privacy

Rules for handling psychologically sensitive and personally identifiable content in this repository.
These rules apply to all contributors — human and AI.

## Categories

### Private (ignored local boundary)

- Psychological context that reveals inner states or personal vulnerabilities
- Raw personal quotes
- Career breadth details: specific roles, employers, and biographical items not already visible on
  the published site
- Third-party names without explicit consent
- Biographical details that narrow physical location beyond what is publicly known

### Public (version-controlled)

- Editorial guidance: voice register, editorial principles, audience definitions
- Published content: positioning paragraphs, capabilities, front page narrative
- Technical architecture, code, tests, configuration
- Plan files (written as if they will be public — see [secops.md](secops.md))

## Rules

1. **Never commit content that reveals psychological vulnerabilities to version control.** This
   includes plan files, commit messages, and code comments.

2. **Third-party individuals must not be named in version-controlled files without explicit
   consent.** Reference them indirectly or store the detail in the private editorial repository.

3. **Biographical details that narrow physical location beyond "UK" require explicit approval.**
   Borough-level ("Hackney") is acceptable in published content. Year, ward, and party for political
   activity are not.

4. **Political affiliation and specific election details must be generalised.** Example: "ran for a
   council seat in Hackney" is acceptable; year, party, and outcome are not.

5. **Editorial sessions that surface private context must store it in the ignored private
   editorial repository, not in plan files.** Plan files are public and may contain only public-safe
   constraints, routing and status — never drafts, evidence or the backstory behind a decision.

6. **Git ignore is not a complete tooling boundary.** Formatters, search tools, archives and agent
   utilities may traverse ignored nested repositories. Exclude the private boundary explicitly
   whenever a tool's scope is broader than tracked files.

## Where private content lives

The active editorial source packs, drafts, evidence and collaboration records live in the ignored
nested repository at `.agent/reference-local/editorial-private/`. Its local README is the routing
surface. The parent repository must never track the nested repository as a submodule or publish its
remote, commit identifiers or update cadence.

`.agent/private/` remains an ignored compatibility boundary for isolated local notes, but it is not
the current editorial source of truth. See
[private-editorial-workspace.md](../reference/private-editorial-workspace.md) for the public-safe
operational contract.
