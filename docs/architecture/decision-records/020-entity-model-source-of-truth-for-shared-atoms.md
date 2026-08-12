# ADR-020: Entity model is the source of truth for shared identity atoms

## Status

Accepted

## Date

2026-08-12

## Context

The two-layer content model in [ADR-014](014-entity-model-design.md) separates
editorial page composition from structured identity facts. In practice, the
shared atoms were copied across overlapping files: the name appeared on the
Person, CV metadata, and home metadata/hero; profile URLs appeared on the
Person and in both page files; email appeared on the Person and in CV links;
and the Person description duplicated the CV summary. The home social
description was and remains intentionally distinct.

Those copies could drift silently. Equality tests would only detect the drift
after it happened; they would not remove its cause. Editorial prose is a
different concern: page-specific descriptions may intentionally differ and
must not be forced equal merely because they describe the same person.

## Decision

The sole `Person` entity in `content/entities.json` owns shared identity atoms:

- `Person.name` supplies the visible name, site title, CV title, PDF filename,
  page/document contracts, header label, and footer copyright.
- `Person.email` supplies the visible CV email address.
- `Person.sameAs` supplies the labelled LinkedIn, GitHub, and Google Scholar
  profile links. `resolveSameAsUrlByHostname` parses each URL, matches an exact
  hostname, and requires exactly one match.
- `Person.description` supplies the short CV metadata and manifest description.

The duplicated fields are removed from the page-composition JSON. Editorial
prose and page-specific presentation metadata remain in their page files.

Identity is injected at composition boundaries. `app/layout.tsx`, a server
component, passes the name, derived PDF filename, and profile-link props to
generic site-chrome components; the client `SiteHeader` and
`DownloadPdfLink` do not import the entity graph or its Zod validation bundle.
`cvLayoutContent` similarly composes graph-owned atoms with CV editorial
content before rendering.

The graph parser also enforces that the graph contains exactly one `Person`,
and validates `sameAs` entries as URLs before provider resolution.

## Proof

- DRY ownership is structural: the removed JSON fields cannot drift because
  they no longer exist.
- Unit and integration tests prove zero-, one-, and multiple-Person behaviour,
  URL validation, exact-hostname matching, missing profiles, and ambiguity.
- Component tests prove that generic header and footer behaviour is driven by
  injected props.
- The full production E2E suite passed 49/49, covering rendered pages,
  metadata, the machine-readable graph, and PDF-facing routes.
- Visual-regression review found zero differing pixels on the home and CV
  pages. The reviewed HTML-only differences are the intended retired tilt
  graph statements, static headline markup, and Next.js head-tag ordering.

## Consequences

- Shared identity facts have one owner and flow into each consumer explicitly.
- Generic site chrome remains reusable and does not bundle Jim-specific content
  or graph validation into the client boundary.
- Schema.org's unkeyed `sameAs` array requires a small repository convention:
  each labelled provider hostname must occur exactly once.
- Inline prose links remain editorial content. They can intentionally differ
  from identity-profile URLs and are reviewed editorially, not equality-tested.
- Names authored on other graph nodes, such as `WebSite` and `ProfilePage`, are
  not unified here. This is a bounded identity-atom consolidation seam; full
  graph-backed composition remains owned by the active Track B design and its
  phased adoption work.

## Related

- [ADR-007](007-dry-content-metadata.md) — earlier metadata consolidation
- [ADR-014](014-entity-model-design.md) — layered entity-model design
- [ADR-011](011-domain-appropriate-descriptions.md) — domain-appropriate prose
- [Content model](../content-model.md) — current ownership and composition
- `lib/entities.ts`, `lib/cv-content.ts`, `lib/same-as.ts`,
  `lib/page-document-contract.ts`, and `lib/pdf-config.ts`
