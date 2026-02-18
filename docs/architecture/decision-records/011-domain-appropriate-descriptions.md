# ADR-011: Domain-appropriate descriptions

## Status

Accepted

## Date

2026-02-16

## Context

ADR-007 established `meta.summary` as a single short description shared across Open Graph metadata, JSON-LD Person description, Web App Manifest description, and page meta descriptions. This eliminated duplication — one string, derived everywhere — and included an explicit editorial constraint: "The `meta.summary` field must be written to work in all three contexts."

In practice, this constraint conflates fundamentally different artifacts:

| Context               | Domain          | Audience                         | Purpose                             |
| --------------------- | --------------- | -------------------------------- | ----------------------------------- |
| OG description        | Social sharing  | Human scanning a feed            | Drive curiosity, prompt a click     |
| JSON-LD Person        | Structured data | Machine building an entity model | Precise, semantically rich identity |
| Manifest description  | Application     | Someone installing a PWA         | Concise app summary                 |
| HTML meta description | SEO             | Human scanning search results    | Signal relevance to a query         |

These are not variants of the same thing. They are different things that happen to describe the same person. An OG description is a property of a page's social sharing behaviour. A JSON-LD Person description is a property of the Person entity. A manifest description is a property of the web application. Forcing them to share a single string creates a "light editorial constraint" (ADR-007) that is actually a structural misfit — it prevents each context from doing its job well.

### What DRY actually means here

ADR-007's DRY principle remains valid: the same fact should not be copied across multiple files, requiring manual synchronisation. But the same fact described for different audiences is not duplication — it is domain-appropriate expression. "Jim is a systems thinker who shapes change" expressed as a punchy social card, expressed as a precise Person description for machines, and expressed as a search result snippet are three expressions of the same reality, not three copies of the same string.

### Options evaluated

1. **Keep the single string.** Accept the editorial constraint. Simple but limits each context.
2. **Split into per-context properties under `meta`.** `meta.summary_og`, `meta.summary_jsonld`, etc. Wrong grouping — it organises by sentence length, not by domain.
3. **Domain-appropriate descriptions in their respective domains.** Each description lives where its domain dictates. Editorial consistency is enforced by editorial principles, not data proximity.

## Decision

**Option 3 — descriptions live in their respective domains.**

Each description serves a specific domain and should be defined where that domain's concerns are managed:

- **Person description** — on the Person entity (structured data domain). Written for machines: precise, semantically rich.
- **Page OG descriptions** — with page definitions (presentation domain). Written for humans scanning social feeds: punchy, curiosity-driving.
- **Manifest description** — in app configuration (application domain). Written for app store / launcher context: concise, functional.
- **HTML meta description** — with page metadata (SEO domain). Written for search result snippets: relevance signalling.

**Editorial consistency is an editorial principle, not a structural constraint.** All descriptions of the person — regardless of where they live in the data model — must be editorially consistent with the current positioning, voice, and identity. This is enforced by the editorial directives (see `editorial-guidance.md`), not by data structure proximity.

### Relationship to ADR-007

This ADR evolves ADR-007, not supersedes it. ADR-007's core contribution — eliminating satellite files and deriving metadata from content — remains correct. What changes is the understanding of `meta.summary`: a single string serving all contexts is an interim simplification, not the target state. As the content model evolves (see the personal knowledge graph plan), each domain acquires its own description naturally.

### Implementation timing

This is a forward-looking decision. The current `meta.summary` continues to serve all contexts until the knowledge graph plan restructures the content model. At that point, the decoupling happens naturally: the Person entity gets its own description, page definitions get their own OG descriptions, and the manifest gets its own description. No intermediate "split the meta object" step is needed.

## Consequences

**Benefits:**

- Each description can be optimised for its audience and context without compromise.
- The data model reflects reality: these are different things, and they live in different places.
- Editorial consistency is governed by editorial principles — a higher-quality guarantee than textual identity (same string). Two descriptions can tell the same story in different registers.
- No premature structural change needed. The current interim approach works; the target state emerges naturally from the knowledge graph work.

**Trade-offs:**

- Multiple descriptions of the same person must be kept editorially aligned. This requires discipline during content changes. Mitigated by the editorial consistency principle in `editorial-guidance.md`.
- Until the knowledge graph plan executes, `meta.summary` continues to serve all contexts. The decision is accepted now but implemented incrementally.

## Related

- [ADR-007: DRY content and metadata consolidation](007-dry-content-metadata.md) — predecessor; this ADR evolves its understanding of `meta.summary`
- [editorial-guidance.md](../../../.agent/directives/editorial-guidance.md) — editorial consistency principle
- [meta-seo-content-audit.plan.md](../../../.agent/plans/meta-seo-content-audit.plan.md) — immediate editorial fix for `meta.summary` content
- [personal-knowledge-graph.plan.md](../../../.agent/plans/personal-knowledge-graph.plan.md) — structural decoupling through the entity model
