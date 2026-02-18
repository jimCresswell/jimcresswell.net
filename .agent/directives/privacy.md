# Privacy

Rules for handling psychologically sensitive and personally identifiable content in this repository. These rules apply to all contributors — human and AI.

## Categories

### Private (gitignored only — `.agent/private/`)

- Psychological context that reveals inner states or personal vulnerabilities
- Raw personal quotes
- Career breadth details: specific roles, employers, and biographical items not already visible on the published site
- Third-party names without explicit consent
- Biographical details that narrow physical location beyond what is publicly known

### Public (version-controlled)

- Editorial guidance: voice register, editorial principles, audience definitions
- Published content: positioning paragraphs, capabilities, front page narrative
- Technical architecture, code, tests, configuration
- Plan files (written as if they will be public — see [secops.md](secops.md))

## Rules

1. **Never commit content that reveals psychological vulnerabilities to version control.** This includes plan files, commit messages, and code comments.

2. **Third-party individuals must not be named in version-controlled files without explicit consent.** Reference them indirectly or store the detail in `.agent/private/`.

3. **Biographical details that narrow physical location beyond "UK" require explicit approval.** Borough-level ("Hackney") is acceptable in published content. Year, ward, and party for political activity are not.

4. **Political affiliation and specific election details must be generalised.** Example: "ran for a council seat in Hackney" is acceptable; year, party, and outcome are not.

5. **Editorial sessions that surface private biographical context must store it in `.agent/private/`, not in plan files.** Plan files are version-controlled and should contain only editorial constraints and decisions, not the psychological backstory that produced them.

## Where private content lives

All psychologically sensitive and PII-heavy content lives in `.agent/private/`. This directory has its own `.gitignore` that excludes everything except the `.gitignore` itself. Files stored here are local-only and never enter version control.

Currently:

- `.agent/private/identity.md` — private biographical and psychological context that informs the editorial voice in `editorial-guidance.md`.
