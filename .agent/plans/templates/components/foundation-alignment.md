# Component: Foundation Document Alignment

Before beginning work and at the start of each phase, read
the foundation documents. They are the authority.

## Foundation Documents

1. `.agent/directives/principles.md` — Core principles
2. `.agent/directives/testing-strategy.md` — TDD at ALL levels
3. `.agent/directives/principles.md` §Cardinal Rule — the entity graph is the source of truth and the build derives every surface

## Per-Phase Check-in

At the start of each phase, ask:

1. Does this deliver system-level value, not just fix the immediate issue?
2. Could it be simpler without compromising quality?
3. Are we following TDD at all levels (unit, integration, E2E)?
4. Do all types flow from the schema?

## Compliance Checklist (End of Plan)

- [ ] **Cardinal Rule**: every rendered surface derives from `content/entities.json` via `pnpm build`
- [ ] **No Type Shortcuts**: No `as`, `any`, `Record<string, unknown>`, `!`
- [ ] **No Compatibility Layers**: Replaced old approaches, not wrapped them
- [ ] **Quality Gates**: All gates pass across all workspaces
- [ ] **Test Behaviour**: Tests validate behaviour, not implementation details
- [ ] **Simple Mocks**: Fakes injected as arguments, no complex mock frameworks
- [ ] **Generator First**: Changes made in templates, not generated output
