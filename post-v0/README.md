# Post-v0 Folder

This folder contains guidance and checklists for **after** v0 generates the initial codebase.

**Do NOT pass this folder to v0** — it will distract generation and produce noisy boilerplate.

## Contents

| File | Purpose |
|------|---------|
| `hardening-checklist.md` | **Start here** — comprehensive checklist with suggested order of work |
| `testing-strategy.md` | Detailed testing implementation (Playwright, axe, visual regression) |
| `deployment-notes.md` | Hosting, security headers, SEO, performance |

## Workflow

1. **Export from v0** → commit raw export, tag as `v0-export/<date>`
2. **Work through `hardening-checklist.md`** in suggested order
3. **Reference `testing-strategy.md`** for test implementation details
4. **Reference `deployment-notes.md`** for production configuration
5. **Deploy** once all checklist items pass
