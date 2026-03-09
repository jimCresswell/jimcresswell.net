# PKG Research Findings

Research conducted March 2026 across four domains: Schema.org types, JSON-LD
best practices, Google structured data consumption, and Neo4j compatibility.
Findings are organised by topic. The graph metaplan and the preserved draft
roadmap / successor-plan inputs reference this document.

---

## Consumer Value Tiers

Not all structured data is consumed equally. This tier system categorises entity types by what search engines and AI systems actually do with them, so effort is proportional to value.

| Tier                                        | What happens                                                                                                         | Entity types                                                                                                                                                                           |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 — Google rich results**                 | Produces visible features in Google Search                                                                           | `ProfilePage` (enhanced listings), `WebSite` + `SearchAction` (sitelinks searchbox), `Organization` (knowledge panel)                                                                  |
| **2 — Entity building and E-E-A-T**         | Consumed by Google for entity understanding and trust signals; no visible features                                   | `Person` (with `sameAs`, `knowsAbout`, `hasCredential`, `hasOccupation`), `EmployeeRole` chains, `ScholarlyArticle` with DOIs, `CollegeOrUniversity`                                   |
| **3 — AI readiness and graph completeness** | Valid Schema.org; invisible to Google; valuable for AI/LLM consumption via search indexes and for the internal model | `Thesis`, `SoftwareSourceCode`, `WebAPI`, `DefinedTerm`, `Intangible` + `additionalType`, `Statement`, `Occupation` (outside job-posting context), `EducationalOccupationalCredential` |

**Key insight**: most entity types in the PKG (`Person`, `Thesis`, `ScholarlyArticle`, `SoftwareSourceCode`, `EmployeeRole`, `Credential`, `Occupation`) do **not** trigger Google rich results. Their value is in entity understanding, E-E-A-T signals, and AI readiness — not direct visual enrichment.

The broader value of rich structured data is in entity building (Google knows who Jim is), E-E-A-T signals (Google trusts the content), AI readiness (search indexes feed AI systems), and future-proofing (as AI consumption of structured data matures).

---

## Schema.org Type Verification

### Confirmed correct

| Type                                   | Status                   | Notes                                                                                                                                                                                    |
| -------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Person`                               | Correct                  | Core type. All listed properties verified: `worksFor`, `alumniOf`, `hasCredential`, `knowsAbout`, `hasOccupation`, `sameAs`, `honorificPrefix`, `subjectOf`.                             |
| `Person.pronouns`                      | **First-class property** | Expects `DefinedTerm`, `StructuredValue`, or `Text`. No custom modelling needed.                                                                                                         |
| `Organization` / `CollegeOrUniversity` | Correct                  | `CollegeOrUniversity` is `EducationalOrganization > CollegeOrUniversity`.                                                                                                                |
| `EducationalOccupationalCredential`    | Correct                  | `credentialCategory`, `educationalLevel`, `recognizedBy`, `about` all valid.                                                                                                             |
| `ScholarlyArticle`                     | Correct                  | `author`, `identifier` with `PropertyValue` pattern is the standard approach.                                                                                                            |
| `Occupation`                           | Correct                  | `occupationLocation`, `skills`, `name`, `description` all valid.                                                                                                                         |
| `WebSite` / `WebPage` / `ProfilePage`  | Correct                  | `ProfilePage` is a first-class Schema.org type (not an extension). Google uses it for enhanced listings.                                                                                 |
| `SoftwareSourceCode`                   | Correct                  | `codeRepository`, `creator`, `sourceOrganization` all valid.                                                                                                                             |
| `WebAPI`                               | Correct                  | `provider`, `documentation`, `url` all valid. Part of the `Service` hierarchy.                                                                                                           |
| `DefinedTerm`                          | Correct                  | Explicitly used in Schema.org for competencies — appears as expected type for `skills` on `Person` and `Occupation`. Excellent fit for capabilities.                                     |
| `Intangible` + `additionalType`        | Valid pattern            | `additionalType` expects `Text` or `URL`. Can point to custom URIs (e.g. `https://www.jimcresswell.net/schema/ProfessionalIdentity`). Standard mechanism for extending type specificity. |

### Corrections needed

| Issue                | Detail                                                                                                                                                                                                                  | Fix                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `Thesis.inSupportOf` | Expects `Text`, not an entity reference. Schema.org defines it as "Qualification, candidature, degree, application that Thesis supports." The official example uses `"inSupportOf": "Conservation Biology"` — a string. | Use `inSupportOf` as text (e.g. "PhD in Astrophysics & Cosmology"). For a typed entity relationship, use `Thesis.about → Credential` instead. |
| Volunteer modelling  | `VolunteerAction` is for discrete volunteering events, not ongoing relationships.                                                                                                                                       | Use `OrganizationRole` with `Person.memberOf → OrganizationRole → OrganizationRole.memberOf → Organization` for ongoing volunteer roles.      |

### Assessed as valid but weak

| Type        | Assessment                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Statement` | Exists on Schema.org ("a statement about something, for example a fun or interesting fact"). Semantically, it was designed for factual assertions, not narrative prose. Pragmatically acceptable for positioning narratives — the `text` and `about` properties match the need. ADR-008 accepts this trade-off. Alternative: use `description` on a ProfessionalIdentity `Intangible`. |

### Role `worksFor` chain — confirmed

The Schema.org Role mechanism uses property reification: `Person.worksFor → EmployeeRole → EmployeeRole.worksFor → Organization`. Although `Person.worksFor` formally expects `Organization`, the Role intermediary pattern is the standard Schema.org way to model roles with dates. Official Schema.org examples (Joe Montana/49ers, Delia Derbyshire/BBC Radiophonic Workshop) demonstrate exactly this pattern. Validators accept it.

For volunteering: `Person.memberOf → OrganizationRole → OrganizationRole.memberOf → Organization`.

### `identifier` with `PropertyValue` — confirmed

The `PropertyValue` pattern for DOIs and arXiv IDs is the standard Schema.org approach:

```json
"identifier": [
  { "@type": "PropertyValue", "propertyID": "DOI", "value": "10.1111/j.1365-2966.2008.14082.x" }
]
```

For DOIs, consider also using `sameAs: "https://doi.org/..."` (which Google actively uses for entity reconciliation) alongside the `PropertyValue` identifier.

---

## JSON-LD Best Practices

### `@graph` usage

Each page should have a single `<script type="application/ld+json">` block containing one `@graph` array. Multiple blocks on the same page have unreliable cross-referencing — one report showed the Rich Results Test failing to recognise properties spread across separate blocks.

### JSON-LD version

Stick to the JSON-LD 1.0 subset: `@context`, `@graph`, `@id`, `@type`, and Schema.org properties. No search engine consumer processes 1.1 features (`@nest`, `@propagate`, `@included`, scoped contexts). The Schema.org context itself is a 1.0 context.

### `@id` conventions

Fragment URIs (hash URIs) are the recommended pattern for entities within a document:

- `https://www.jimcresswell.net/#person` — resolves to the root document, which describes the Person
- `https://www.jimcresswell.net/cv/#role-oak-2020-present` — resolves to the CV page, which describes the role

**Canonical document rule**: an entity's `@id` resolves to the page that is its canonical Linked Data document. The fragment is stripped during resolution, and the resulting document should describe the entity. Site-level entities (Person, WebSite, organisations) use root-anchored fragments. Page-specific entities (roles anchored to the CV) use page-path fragments.

**Implication for cross-page subgraphs**: if a role entity appears in both the homepage and CV subgraphs, its `@id` (`cv/#role-oak-*`) still points to the CV page as the canonical description. This is valid in Linked Data — the `@id` says where the canonical description lives, not which pages include the entity.

### Subgraph closure — Concise Bounded Description (CBD)

The plan's subgraph closure algorithm is a well-known Linked Data pattern called Concise Bounded Description (CBD), a W3C Member Submission (2004). CBD defines: given a starting resource, recursively include all triples where that resource is the subject, plus all triples describing any referenced resources.

The PKG's variant extends CBD with:

1. Following `@id` references (not just blank nodes) — richer than standard CBD
2. Supporting optional pruning — the homepage includes a subset; the CV includes everything

Implementation considerations:

- Every `@id` reference in a page's subgraph must resolve to a node within the same subgraph (self-containment)
- Depth limits are unnecessary at the current scale (~50-100 entities) but a max-depth parameter is prudent
- The closure function should accept a pruning predicate — pruning policy is configuration, not algorithm
- This is a pure function: entity graph in, pruning config in, subgraph array out — ideal for TDD

### Cross-page entity identity

Google supports "syntax graph merge" (October 2023) for structured data across different syntaxes on the same page. Cross-page entity identity via shared `@id` is processed but not formally guaranteed. Google uses names, properties, and `sameAs` signals for entity reconciliation — not solely `@id`.

**Recommendation**: use the same `@id` across pages but make each page's subgraph self-contained. Don't rely on cross-page merging. The `/api/graph` endpoint (ADR-010) serves the complete graph for Linked Data clients that do proper entity resolution.

### Graph size

No practical concern at the PKG's scale. A rough estimate: ~50 entities × ~200 bytes = ~10 KB of JSON-LD. Google's limits (~0.5 MB structured data, ~1000 properties per object) are orders of magnitude larger.

### JSON-LD-only entities

Google's visible-content policy ("Don't mark up content that is not visible to readers") targets rich result types (Product, Recipe, FAQ). For entity-description types (Person, Organization), the policy is more permissive — `sameAs`, `knowsAbout`, `alumniOf`, `hasCredential`, `hasOccupation` are widely accepted without visible equivalents.

**Safe**: identity/credential properties, `sameAs` links, `knowsAbout`, organisation details, credential subjects.

**Defensible**: full role descriptions in JSON-LD where the visible page discusses the career but at a higher level. The roles aren't hidden — they're at finer granularity than the visible narrative.

### RDF implications

JSON-LD is an RDF serialisation. Every entity without an `@id` is a blank node (anonymous, not reconcilable across pages). Give every entity an `@id`. The open world assumption aligns with the PKG design: each page publishes a subgraph, and absence of a statement doesn't mean the statement is false.

---

## Google Structured Data Reality

### Rich results

Google supports approximately 30 structured data types for rich results, out of 800+ Schema.org types. The types relevant to this site:

- **ProfilePage**: triggers enhanced listings in Discussions and Forums search feature. Shows creator name, photo. `mainEntity → Person` is consumed.
- **WebSite + SearchAction**: triggers sitelinks searchbox.
- **Organization**: triggers logo display, Knowledge Panel contribution, "About this result" data.

**Not rich result types**: `Person`, `EmployeeRole`, `EducationalOccupationalCredential`, `ScholarlyArticle`, `Thesis`, `SoftwareSourceCode`, `Occupation`, `DefinedTerm`, `Statement`, `Intangible`.

### Knowledge Panel

Without Wikipedia/Wikidata, a Knowledge Panel for a non-public-figure professional is unlikely. The structured data contributes to entity understanding ("Google knows who you are") even without a visible panel. Most impactful signals: `sameAs` links to authoritative profiles (LinkedIn, GitHub, Google Scholar), consistent `@id` across pages.

### `knowsAbout` entity linking

Google doesn't consume clustering structure in `knowsAbout`. The highest-impact improvement is entity linking — linking each item to its Wikidata/Wikipedia entity:

```json
{
  "@type": "Thing",
  "name": "Cosmology",
  "sameAs": "https://www.wikidata.org/wiki/Q338"
}
```

This helps Google resolve `knowsAbout` items to known entities in its Knowledge Graph, which is significantly more powerful than bare strings.

### Google Scholar

**Google Scholar does NOT consume JSON-LD.** It uses Highwire Press meta tags (`citation_title`, `citation_author`, `citation_date`, `citation_doi`, etc.). `ScholarlyArticle` JSON-LD is valuable for Google Search entity-building but does not reach Google Scholar.

If Google Scholar indexing from this site matters, `<meta name="citation_*">` tags would need to be added to pages that discuss publications.

### E-E-A-T signals

Structured data contributes to all four pillars:

- **Experience**: `EmployeeRole` with dates and descriptions
- **Expertise**: `knowsAbout`, `hasCredential`, `subjectOf` (publications)
- **Authoritativeness**: `sameAs` links to authoritative profiles
- **Trustworthiness**: consistent `@id` across pages, ProfilePage markup

Post December 2025 Core Update: sites with verified expertise signals gained ~4 positions on average.

### AI consumption

Current AI systems (ChatGPT, Claude, Perplexity) do **not** directly parse JSON-LD when they fetch pages. The mechanism is indirect: structured data enriches search engine indexes, which feed AI response generation. Attribute-rich schema achieves 62% citation rates vs 42% for generic schema.

The real AI play for entity grounding is Wikidata, not site-level JSON-LD. But the PKG's structured data still matters because Google and Bing process it during indexing.

---

## Neo4j Compatibility

### Forward compatibility confirmed

The PKG's design principles are already ideal for future Neo4j migration:

- Stable entity IDs (fragment URIs → Neo4j `uri` property)
- Flat entities with `@id` references (not nesting) → direct node/edge mapping
- Schema.org property names → relationship types and property names
- Schema.org `@type` → Neo4j node labels
- The `EmployeeRole` reification pattern → naturally becomes a mediating node

### Migration tools

| Tool                         | Works on Aura?                | Language   | Notes                                                                  |
| ---------------------------- | ----------------------------- | ---------- | ---------------------------------------------------------------------- |
| neosemantics (n10s)          | No (plugin, needs Enterprise) | Cypher     | Best tool; handles JSON-LD import/export natively                      |
| rdflib-neo4j                 | Yes                           | Python     | RDFLib Store backed by Neo4j; works on Aura Free                       |
| neo4j-driver + custom script | Yes                           | TypeScript | Parse JSON-LD, generate Cypher; keeps everything in the existing stack |
| jsonld-to-cypher             | Yes                           | JavaScript | Compiles JSON-LD to Cypher CREATE statements                           |

### Design recommendations for forward compatibility

1. **Every entity gets `@id` and `@type`** — no exceptions, even abstract entities
2. **Relationships are always `{"@id": "..."}` references** — never embed entities inside other entities
3. **Content-derived slugs for IDs** — `org-oak`, `role-oak-2020-present`, not array positions or hashes
4. **Schema.org property names as-is** — `worksFor`, `alumniOf`, `hasCredential` map directly to Neo4j relationship types
5. **The entities file should be valid JSON-LD** — `@context`, `@graph`, `@id`, `@type` throughout, so any RDF tool can consume it
6. **Consider a short `entityId` alongside the full URI** — ergonomic Cypher: `MATCH (n {entityId: 'org-oak'})` vs `MATCH (n {uri: 'https://www.jimcresswell.net/#org-oak'})`
7. **`additionalType` values** — in Neo4j, a post-import step can project these to labels for richer querying

### Scale assessment

For ~50-100 entities, Neo4j is overkill for production but free (Aura Free tier). Its value at this scale is interactive exploration during editorial work (Neo4j Browser) and demonstrating the capability (knowledge graphs in `knowsAbout`). Auto-pause on Aura Free is the main concern for build-time queries.

---

## Validation Strategy

Four-tool workflow, each serving a different purpose:

| Tool                                                                    | When            | Purpose                                                                         |
| ----------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------- |
| Programmatic `@id` resolution check                                     | Development     | Every `@id` reference in a subgraph resolves to a node within the same subgraph |
| [Schema.org Validator](https://validator.schema.org/)                   | Pre-deployment  | Strict Schema.org spec compliance; validates all syntaxes                       |
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Post-deployment | Verify Google eligibility; shows which types trigger rich results               |
| [Google Search Console](https://search.google.com/search-console)       | Ongoing         | Alerts; tracks performance; shows real indexing errors                          |

---

## Related

- [personal-knowledge-graph-design-notes.md](personal-knowledge-graph-design-notes.md) — historical design working notes
- [personal-knowledge-graph-phase-model.plan.md](../complete/personal-knowledge-graph-phase-model.plan.md) — archived phase model
- [ADR-008](../../../docs/architecture/decision-records/008-schema-org-compliance.md) — Schema.org compliance throughout the graph
- [ADR-010](../../../docs/architecture/decision-records/010-canonical-url-graph-identity.md) — canonical URL and graph identity
- [ADR-011](../../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md) — domain-appropriate descriptions
