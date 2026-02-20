# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for significant technical decisions in the project.

## Format

Each ADR follows a lightweight format:

- **Status** — Accepted, Superseded, or Deprecated
- **Date** — When the decision was made
- **Context** — The problem or situation that prompted the decision
- **Decision** — What was decided and why
- **Consequences** — Trade-offs, benefits, and risks

## Index

| ADR                                           | Title                                            | Status   | Date       |
| --------------------------------------------- | ------------------------------------------------ | -------- | ---------- |
| [001](001-build-time-pdf-generation.md)       | Build-time PDF generation with Puppeteer         | Accepted | 2026-02-06 |
| [002](002-pdf-serving-architecture.md)        | PDF serving via Route Handler at /cv/pdf         | Accepted | 2026-02-06 |
| [003](003-print-button-removed.md)            | Print button removed in favour of PDF download   | Accepted | 2026-02-06 |
| [004](004-storybook-deferred.md)              | Storybook deferred in favour of RTL + Vitest     | Accepted | 2026-02-06 |
| [005](005-knip-unused-code-detection.md)      | Knip for unused code and dependency detection    | Accepted | 2026-02-06 |
| [006](006-header-responsive-layout.md)        | Header responsive layout                         | Accepted | 2026-02-08 |
| [007](007-dry-content-metadata.md)            | DRY content and metadata consolidation           | Accepted | 2026-02-08 |
| [008](008-schema-org-compliance.md)           | Schema.org compliance for the knowledge graph    | Accepted | 2026-02-15 |
| [009](009-content-negotiation-proxy.md)       | Content negotiation via Next.js proxy            | Accepted | 2026-02-15 |
| [010](010-canonical-url-graph-identity.md)    | Canonical URL and graph identity                 | Accepted | 2026-02-15 |
| [011](011-domain-appropriate-descriptions.md) | Domain-appropriate descriptions                  | Accepted | 2026-02-16 |
| [012](012-agent-memory-pipeline.md)           | Agent memory pipeline — funnel to canonical docs | Accepted | 2026-02-20 |
