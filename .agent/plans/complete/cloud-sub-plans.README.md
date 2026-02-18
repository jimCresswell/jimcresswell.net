# Cloud Sub-Plans

Small, well-defined sub-plans suitable for Cursor cloud agents. Each plan is self-contained with clear goals, intended impact, and acceptance criteria.

## Design Principles

- **Self-contained** — each plan includes all context a cloud agent needs to execute without reading the parent plan or other documents
- **Small scope** — completable in a single agent session
- **Clear acceptance criteria** — unambiguous pass/fail checks
- **Explicit dependencies** — every plan states what must be done first
- **Quality gates** — every plan ends with `pnpm check` (and `pnpm test:e2e` where relevant)

## Plans (all complete)

From [component-audit.plan.md](../component-audit.plan.md):

| Plan                                                       | Description                                     | Status   |
| ---------------------------------------------------------- | ----------------------------------------------- | -------- |
| [01-rtl-setup](01-rtl-setup.plan.md)                       | Install and configure React Testing Library     | Complete |
| [02-tailwind-hygiene](02-tailwind-hygiene.plan.md)         | Canonical classes and design tokens             | Complete |
| [03-section-primitives](03-section-primitives.plan.md)     | Extract PageSection, Prose, ArticleEntry        | Complete |
| [04-site-footer-refactor](04-site-footer-refactor.plan.md) | DRY refactor of SiteFooter + RTL test           | Complete |
| [05-site-header-refactor](05-site-header-refactor.plan.md) | Data-driven navigation + RTL test               | Complete |
| [06-cv-layout-refactor](06-cv-layout-refactor.plan.md)     | Use primitives, accept content props + RTL test | Complete |
| [07-root-layout-shell](07-root-layout-shell.plan.md)       | Move shared shell to root layout                | Complete |

### Dependency Graph

```
Wave 1 (parallel):  01-rtl-setup  ·  02-tailwind-hygiene
Wave 2 (parallel):  03-section-primitives  ·  04-site-footer  ·  05-site-header
Wave 3:             06-cv-layout-refactor
Wave 4:             07-root-layout-shell
```

## Project Context

Agents executing these plans should also read:

- [`.agent/directives/AGENT.md`](../../.agent/directives/AGENT.md) — Project context and commands
- [`.agent/directives/rules.md`](../../.agent/directives/rules.md) — Core development rules (TDD, type safety, code quality)
- [`.agent/directives/testing-strategy.md`](../../.agent/directives/testing-strategy.md) — Testing philosophy and conventions
