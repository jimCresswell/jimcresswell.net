# Personal Knowledge Graph

Build a unified model where all site outputs — page rendering, Open Graph, JSON-LD, Web App Manifest, sitemap, PDF — are derived views onto the same underlying reality. A personal knowledge graph of entities and typed relationships, with each output as a derived view.

## Status: Implementation (design settled, Phases 1-4 code complete, manual validation and regression proof pending)

**This is the design reference** — the entity inventory, principles, Schema.org conventions, and resolved design decisions. All design questions have been answered. For phased execution with todos and acceptance criteria, see the [implementation plan](personal-knowledge-graph-implementation.plan.md). For the detailed operational plan (per-task status, reviewer invocations), see the [execution plan](personal-knowledge-graph-execution.plan.md).

## How to use this plan

This is a collaborative session. Jim has examples to integrate and a clear vision for the model's scope. Present options at each decision point and iterate.

1. Read `.agent/directives/AGENT.md` and `.agent/directives/rules.md` — standard project entry point.
2. Read `.agent/directives/editorial-guidance.md` — voice, audience, keyword strategy, cross-domain editorial consistency.
3. Read `content/entities.json`, `lib/entities.ts`, and `lib/jsonld.ts` — the current entity-driven JSON-LD pipeline: graph source, validation layer, and full-graph export.
4. Read `lib/cv-content.ts` — current OG/metadata derivation.
5. Read `content/cv.content.json` and `content/frontpage.content.json` — current editorial content.
6. Read `archive/prior_cv_content.json.bak` — full career history with dates and role titles.
7. Read `docs/architecture/decision-records/007-dry-content-metadata.md` and `011-domain-appropriate-descriptions.md` — the single-source approach, its evolution, and why descriptions in different domains are different artifacts.
8. Read the completed [meta-seo-content-audit.plan.md](complete/meta-seo-content-audit.plan.md) — this plan's editorial fixes are the starting point. The content it corrected is the content this plan migrates.
9. Review Jim's examples and reference materials.
10. Walk through each phase below with Jim.

---

## Vision

The site's visible pages, structured data, social previews, and machine-readable metadata are all views onto the same underlying reality — Jim's career, work, identity, and relationships. They should be centrally defined, editorially consistent, and visible.

Currently, ADR-007 achieves this for editorial text: `cv.content.json` is the single source of truth, and OG/manifest/JSON-LD are derived. But the principle is incomplete:

- **Invisible content decisions** — `KNOWS_ABOUT`, `OCCUPATION`, `PUBLICATIONS`, `CREDENTIAL_DETAILS` in `lib/jsonld.ts` are real facts about Jim, represented to machines. They're in TypeScript, not in the content model. They're correct, but they're not visible or editable alongside the rest of the content.
- **No entity model** — Content is structured around page layout (positioning, experience, prior_roles, capabilities, education). The underlying entities (a Person, an Organisation, a Role with dates, a Publication with identifiers) don't exist as first-class objects. They're flattened into prose or hardcoded as constants.
- **Two content files, no shared entities** — `cv.content.json` and `frontpage.content.json` overlap (links, name) but don't share a common entity model. Person, organisations, publications should be defined once.
- **Missing views** — The front page has no JSON-LD at all. The Person entity exists only on `/cv`.
- **No graph–DOM binding** — JSON-LD `@id` values don't correspond to HTML element IDs. The graph floats alongside the page rather than being anchored to it.

The goal is not a big-bang rewrite. The current architecture works well. The goal is to evolve it: make the entity model explicit, make all content decisions visible, and ensure every output is a derived view.

### Abstraction levels in the same graph

A critical organising principle: the graph contains entities at different levels of abstraction, and they coexist naturally. What appears "cross-cutting" in a hierarchical content model is just an entity at a higher abstraction level that hasn't been named yet. In a graph, there is no cross-cutting — only relationships that haven't been made explicit.

| Level          | Examples                                                            | Schema.org `@type`                                                 |
| -------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Specific       | Role, Organisation, Credential, Publication, Thesis, Project, dates | `EmployeeRole`, `Organization`, `ScholarlyArticle`, `Thesis`, etc. |
| Abstract       | Person, ProfessionalIdentity, ResearchBackground, GroundedPractice  | `Person`, `Intangible` + `additionalType`                          |
| Expressive     | PositioningNarrative, Capability, TiltVariant                       | `Statement`, `DefinedTerm` + `additionalType`                      |
| Presentational | WebSite, CVPage, FrontPage, OGCard, PDFView                         | `WebSite`, `ProfilePage`, `WebPage`                                |

All of these are real. Jim really is a Person. He really does have a ProfessionalIdentity. That identity really does have Capabilities — real competences, not marketing claims. Those capabilities really are grounded by Roles and Projects. A PositioningNarrative is a real expression of a real identity. A TiltVariant is a real reframing for a real audience. None of these are "editorial constructs" — they are qualities, attributes, and expressions of real entities at different levels of abstraction.

Every entity has a standard Schema.org type ([ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md)). For specific entities, Schema.org has precise types. For abstract and expressive entities, Schema.org provides generic types (`Intangible`, `DefinedTerm`, `Statement`) with `additionalType` for domain specificity. There is no class of entity excluded from structured data — the difference between levels is abstraction, not validity.

This means:

- **All entities are real.** A Role has dates. A ProfessionalIdentity has a PositioningNarrative. Both are nodes. Both have typed relationships. Both have Schema.org types. Both can appear in JSON-LD.
- **"Cross-cutting" dissolves.** The `meta.summary` that currently serves too many masters (OG, JSON-LD, manifest) dissolves naturally: these are different artifacts in different domains, not variants of one description ([ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md)). The Person entity gets its own description (structured data domain). Pages get their own OG descriptions (presentation domain). The manifest gets its own description (application domain). Each lives where its domain dictates. Editorial consistency is an editorial principle (see `editorial-guidance.md`), not a data structure constraint.
- **Different views traverse different paths.** The CV page traverses from CVPage through ProfessionalIdentity to Roles and Capabilities. The front page traverses from FrontPage through Person to a different subset. Same graph, different traversals.

---

## Current state

### What works (ADR-007)

| Output            | Derived from                                                                      | Source fields                                        |
| ----------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Page rendering    | `cv.content.json`                                                                 | All editorial sections                               |
| Open Graph (CV)   | `lib/cv-content.ts`                                                               | `meta.name`, `meta.summary`, `meta.locale`           |
| Open Graph (site) | `app/layout.tsx`                                                                  | `frontpage.meta.title`, `frontpage.meta.description` |
| JSON-LD           | `content/entities.json`, `lib/entities.ts`, `lib/page-jsonld.ts`, `lib/jsonld.ts` | Entity graph, page selection, and URL rewriting      |
| Web App Manifest  | `app/manifest.ts`                                                                 | `meta.name`, `meta.summary`                          |
| Page `<title>`    | Page metadata exports                                                             | `meta.name` (via `cvOpenGraph.title`)                |
| Sitemap           | `app/sitemap.ts`                                                                  | Tilt routes via `lib/cv-content.ts`                  |
| PDF               | Build-time render                                                                 | The CV page itself (content flows automatically)     |

### The seams

| Seam                             | Detail                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JSON-LD constants are invisible  | `KNOWS_ABOUT`, `OCCUPATION`, `PUBLICATIONS`, `CREDENTIAL_DETAILS` are real facts about Jim buried in TypeScript. They describe how Jim is represented to search engines and AI. They should be visible as content alongside all other entities.                                                                                                                                                                                  |
| No entity model                  | Content is structured for page sections, not entities. A Role at an Organisation with start/end dates has no representation — it's flattened into prose.                                                                                                                                                                                                                                                                         |
| Two content files, overlapping   | `cv.content.json` and `frontpage.content.json` both define links. Person attributes (name) appear in both.                                                                                                                                                                                                                                                                                                                       |
| Front page has no JSON-LD        | The Person entity, publications, organisations — none appear on `/`.                                                                                                                                                                                                                                                                                                                                                             |
| Content omits known facts        | Full role history (FT Labs, HMPO, BA, HP Labs, short engagements) exists in the archive and LinkedIn but has no structured representation anywhere.                                                                                                                                                                                                                                                                              |
| No graph–DOM binding             | JSON-LD `@id` values don't map to HTML element IDs. Machines can't connect graph nodes to page content.                                                                                                                                                                                                                                                                                                                          |
| Descriptions partially conflated | `meta.summary` still serves as CV OG description, manifest description, and page meta description. The front page now has its own `meta.description` in `frontpage.content.json`, decoupling site-level OG from CV content. The entity model would complete the decoupling — each domain gets its own description where it belongs ([ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md)). |

---

## Sources of information

| Source                              | What it provides                                                         | Status                          |
| ----------------------------------- | ------------------------------------------------------------------------ | ------------------------------- |
| `content/cv.content.json`           | Current editorial content — organisations, roles, education, links       | Available                       |
| `content/frontpage.content.json`    | Front page content — hero narrative, links                               | Available                       |
| `lib/jsonld.ts`                     | Current JSON-LD constants — publications, knows_about, occupation        | Available                       |
| `archive/prior_cv_content.json.bak` | Full career history with dates, role titles, descriptions                | Available                       |
| `.agent/temp/linkedin.pdf`          | LinkedIn profile export — additional role detail, dates                  | Gitignored — may not be present |
| `.agent/temp/old-cv-website/`       | Previous CV website with full role descriptions                          | Gitignored — may not be present |
| Old CV website                      | `https://jimcresswell.github.io/cv/`                                     | Public                          |
| Jim                                 | Corrections, missing context, editorial decisions, examples to integrate | Collaborative                   |

---

## Principles

- **All views derive from the same model.** Page rendering, OG, JSON-LD, manifest, sitemap, PDF — all consume the same entity and content data. No view has information that only exists in its own code.
- **Entities are first-class.** A Person, an Organisation, a Role, a Publication, a Project — each is defined once with a stable identity. Views select and present subsets.
- **The model can contain more than any single view shows.** A full role history with dates can live in the model even if the visible CV only shows selected entries. The JSON-LD view can expose the full history; the page view shows the editorial selection. Different views, same reality.
- **Every entity must be published.** No orphan data. Every entity in the model must appear in at least one published output on the site — whether that's visible page content, JSON-LD structured data (in the page's `<script type="application/ld+json">`), OG metadata, or HTML attributes. A role that doesn't appear in the visible CV still appears in the JSON-LD graph, which is published HTML. Data that reaches no published view should not be in the model.
- **All content decisions are visible.** Nothing that describes Jim (to humans or machines) should be buried in TypeScript constants. If it's about Jim's identity, expertise, or career, it lives in the content model.
- **All entities are real.** A ProfessionalIdentity is as real as a Role — it's more abstract, not less real. A Capability is a real competence, not a marketing claim. A PositioningNarrative is a real expression of a real identity. The graph models reality at multiple levels of abstraction. There is no hierarchy of validity.
- **No cross-cutting concerns.** If something seems to span multiple entities, it is an entity at a higher abstraction level that hasn't been named yet. Name it, give it relationships, and the "cross-cutting" dissolves.
- **Schema.org compliance throughout.** Every entity uses a standard [Schema.org](https://schema.org/) type and standard properties. For specific entities, use the most precise type (`Person`, `Organization`, `OrganizationRole`). For abstract and expressive entities, use generic types (`Intangible`, `DefinedTerm`, `Statement`) with `additionalType` for domain specificity. Every entity can appear in JSON-LD. No entity is excluded from structured data by design. See [ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md).
- **Framing is identity, not history.** The graph contains Jim's full career history — every role, every title, every date. But expressions (descriptions, roleNames, capability claims) must frame who Jim is _now_, not who he was perceived to be in past contexts. Jim is a leader who used the best levers available at the time to make change. Historical role titles like "QA Automation Consultant" or "Head of Test" are facts (they stay in the graph as roleNames). Descriptions of those roles express what Jim was actually _doing_ — leading systemic change, shaping delivery culture, building capability — not the job-title framing of the era. If someone reads the graph, they should see a leader, not a QA engineer.
- **Editorial consistency.** All descriptions of the same entity should be editorially consistent — the OG summary, the JSON-LD Person description, and the page prose should tell the same story in their respective registers. Where different contexts need different text, use separate relationships from the same identity construct.
- **Define once, reference everywhere.** Each entity gets a single identity. Pages compose references, not copies.
- **Visible content unchanged during technical migration.** When data moves from content files to the entity model, the rendered web pages must remain identical. No editorial regression during structural work. The graph migration is a refactoring — same outputs, better internal structure. Editorial improvements happen as separate, deliberate changes.
- **Evolutionary, not revolutionary.** The current architecture works. Build on it incrementally. No big-bang refactoring.
- **Shape for a future graph database.** The JSON-based model should remain compatible with migration to Neo4j (see [future/neo4j-knowledge-graph.plan.md](future/neo4j-knowledge-graph.plan.md)). This means: stable entity IDs, typed relationships as references (not nesting), flat entity definitions, and entities at all abstraction levels modelled as graph nodes.

---

## Consumer value tiers

Not all structured data is consumed equally. Research (see [research findings](research/pkg-research-findings.md)) reveals a clear hierarchy. This ensures effort is proportional to value.

| Tier                                        | What happens                                                                                  | Entity types                                                                                                                                                                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 — Google rich results**                 | Produces visible features in Google Search                                                    | `ProfilePage` (enhanced listings), `WebSite` + `SearchAction` (sitelinks searchbox), `Organization` (knowledge panel)                                                                                                                                                 |
| **2 — Entity building and E-E-A-T**         | Consumed by Google for entity understanding and trust signals; no visible features            | `Person`, `EmployeeRole` chains, `ScholarlyArticle` with DOIs, `CollegeOrUniversity`                                                                                                                                                                                  |
| **3 — AI readiness and graph completeness** | Valid Schema.org; invisible to Google; valuable for AI/LLM consumption and the internal model | `Thesis`, `SoftwareSourceCode`, `WebAPI`, `DefinedTerm` (Capability), `Intangible` + `additionalType` (abstract entities), `Statement` (positioning), `EducationalOccupationalCredential`, `Occupation` (outside job-posting context — this site has no job postings) |

Most entity types in this plan are Tier 2 or Tier 3 — effort should be proportional.

---

## Design Phase 1: Entity and relationship audit

Audit all entities and relationships across all sources. Present a complete inventory to Jim.

### Specific entities

- **Person** — already exists in JSON-LD (`schema:Person`); review for completeness. Add `sameAs` links (GitHub, LinkedIn, Google Scholar). Include `honorificPrefix`: "Dr", `pronouns`: "he/him" (a first-class Schema.org property — expects `DefinedTerm`, `StructuredValue`, or `Text`).
- **WebSite** — the website itself (`schema:WebSite`), with `publisher` pointing to Person. Not currently in the JSON-LD.
- **Organisations** — all employers, universities, volunteer organisations. `schema:Organization` or `schema:CollegeOrUniversity`. Includes all organisations named in the CV and archive, plus additional career breadth organisations listed in `.agent/private/identity.md`.
  - **Oak National Academy** — the CV narrative uses "a live national public service" for a general audience. The entity node description should carry the precise institutional language: "An operationally independent arms-length body of the Department for Education in the UK" (an executive non-departmental public body). Reference sources: [GOV.UK listing](https://www.gov.uk/government/organisations/oak-national-academy), [Oak About Us](https://www.thenational.academy/about-us/who-we-are) ("an independent public body"), [Oak Curriculum API](https://open-api.thenational.academy/) (OGL, API offering). The entity description serves machine consumers and public-sector-literate readers; the CV narrative serves everyone else.
- **Roles** — every professional role with title, start date, end date, organisation. `schema:EmployeeRole` or `schema:OrganizationRole`. Full decomposition from the CV, career archive, and `.agent/private/identity.md` (for additional career breadth roles). Includes all roles from the archive plus volunteer and short-engagement roles from the private file.
  - **Note:** Historical role titles are facts and stay as `roleName`. Role `description` fields express what Jim was actually doing — leading change, shaping delivery culture, building capability — not the job-title framing of the era. See "Framing is identity, not history" principle.
- **Credentials** — degrees plus certifications. `schema:EducationalOccupationalCredential`.
  - PhD Astrophysics & Cosmology (Portsmouth), MSc Cosmology (Sussex), MPhys Physics (Bath).
  - Certifications (JSON-LD only — they also appear on [LinkedIn](https://www.linkedin.com/in/jimcresswell), linked from the footer on all pages): Monitoring the Oceans from Space (EUMETSAT), Fire Marshal Course, The Data Scientist's Toolbox (Johns Hopkins University), AgilePM Foundation.
- **Theses** — linked to their supporting credentials. `schema:Thesis` with `inSupportOf` (Text — e.g. "PhD in Astrophysics & Cosmology") and `about` → `EducationalOccupationalCredential` (typed entity relationship). Note: Schema.org defines `inSupportOf` as expecting `Text`, not an entity reference. Use `Thesis.about → Credential` for the typed link.
  - PhD: "Luminosity Functions and Galaxy Bias in the Sloan Digital Sky Survey".
  - MSc: "Observing Cosmological Topology".
  - MPhys: "The Design and Construction of a Theremin".
- **Publications** — already exist in JSON-LD; cross-check against Google Scholar. `schema:ScholarlyArticle`. **Research note**: Google Scholar does **not** consume JSON-LD — it uses Highwire Press `citation_*` HTML meta tags. `ScholarlyArticle` markup is valuable for Google Search entity-building (Tier 2) but does not reach Google Scholar. **Decision (confirmed)**: Google Scholar indexing from this site is not a goal. Jim manages his Google Scholar entry independently; the PKG links TO it via `sameAs`. No `citation_*` meta tags needed.
- **Projects** — this website, Obaith, Reforest Now, Theremin. `schema:CreativeWork` + `additionalType`. Additional projects (e.g. data visualisation work) to be confirmed with Jim during Design Phase 2.
- **Services** — services offered by organisations. `schema:WebAPI` or `schema:Service`.
  - **Oak Curriculum API** — a live service offered by Oak, not a project Jim created. `schema:WebAPI` with `url`: `https://open-api.thenational.academy/` and `provider`: Oak. Offers free access to curriculum data under OGL.
- **Software** — software Jim conceived and built. `schema:SoftwareSourceCode`.
  - **Oak SDK/MCP server** — Jim conceived and built this. `schema:SoftwareSourceCode` with `creator`: Jim, `sourceOrganization`: Oak. The [oak-mcp-ecosystem](https://github.com/oaknational/oak-mcp-ecosystem) repo is currently private — add `codeRepository` when it goes public. Relates to the Curriculum API: the SDK/MCP makes the API's data accessible to AI-powered services.
  - **jimcresswell.net** — this website. `schema:SoftwareSourceCode` with `codeRepository`: `https://github.com/jimCresswell/jimcresswell.net`.
- **Volunteer roles** — Growing Communities and other volunteer work. `schema:OrganizationRole`. See `.agent/private/identity.md` for the full list.

### Abstract entities

These are real entities at a higher level of abstraction. They currently exist only as unnamed content structures (JSON keys, prose sections). They should become explicit entities with their own identities, Schema.org types, and relationships.

- **ProfessionalIdentity** — Jim really has a professional identity. It has capabilities, a positioning narrative, a summary. Currently implicit in the structure of `cv.content.json`. `schema:Intangible` + `additionalType`.
- **ResearchBackground** — the "Research & Sense-Making in Unknown Systems" entry in the "Before Oak" section (`prior_roles`). A real aspect of Jim's identity, linked to credentials, publications, and the research domain. `schema:Intangible` + `additionalType`.
- **GroundedPractice** — the "Grounded Practice: Food, Land, Community" entry in the "Before Oak" section (`prior_roles`). A real aspect of Jim's identity, linked to volunteer work, personal projects, and interests. `schema:Intangible` + `additionalType`.

### Expressive entities

These are real expressions of real identities. A positioning narrative is not marketing copy — it's a real statement that a real person makes about a real identity.

- **PositioningNarrative** — the positioning paragraphs. Currently `positioning.paragraphs` — a property of the CV page, but actually an expression of the professional identity. `schema:Statement` + `additionalType`. **Decision (confirmed)**: `Statement` is the correct type — these ARE statements Jim is making about his professional identity. `Statement` extends `CreativeWork`, so it inherits `text`, `author`, `inLanguage`, `dateCreated` — nothing is lost vs using `CreativeWork` directly. The positioning belongs to ProfessionalIdentity (not Person directly); the front page narrative is a different entity that relates to Person. `Intangible` + `additionalType` remains correct for abstract identity constructs (ProfessionalIdentity, ResearchBackground, GroundedPractice) because they are non-physical concepts, not authored text.
- **Capability** — each capability is a real competence linked to the professional identity and grounded by evidence (Roles, Projects, Publications). `schema:DefinedTerm`.
- **TiltVariant** — an alternative expression of the professional identity for a specific audience. Currently `tilts.*` entries. `schema:Statement` + `additionalType`.

### Presentational entities

- **CVPage**, **FrontPage** — page-level entities that select and order content from the graph. `schema:ProfilePage` (a more specific subtype of `WebPage`, appropriate for pages about a person). Each has `about` and `mainEntity` pointing to Person.
- **OGCard**, **ManifestEntry** — metadata presentation entities, each with context-appropriate descriptions.
- **PDFView** — the print/PDF presentation, which may select differently from the web view.

### Relationships to audit

All relationships use standard Schema.org properties where available.

Specific (with Schema.org properties):

- `Person.worksFor` → `EmployeeRole` → `EmployeeRole.worksFor` → `Organization` (role mediates with `roleName`, `startDate`, `endDate`, `description`)
- `Person.memberOf` → `OrganizationRole` → `OrganizationRole.memberOf` → `Organization` (volunteer/membership roles)
- `Person.alumniOf` → `CollegeOrUniversity`
- `Person.hasCredential` → `EducationalOccupationalCredential` → `Credential.recognizedBy` → `CollegeOrUniversity`
- `Person.subjectOf` → `Thesis` / `ScholarlyArticle` (Person links to their works)
- `Thesis.author` → `Person` / `ScholarlyArticle.author` → `Person` (works link back — bidirectional)
- `Thesis.inSupportOf` → `Text` (e.g. "PhD in Astrophysics & Cosmology" — Schema.org expects Text, not an entity reference)
- `Thesis.about` → `EducationalOccupationalCredential` (typed entity relationship — thesis linked to credential)
- `WebSite.publisher` → `Person`
- `SoftwareSourceCode.creator` → `Person`
- `SoftwareSourceCode.sourceOrganization` → `Organization`
- `Organization.makesOffer` → `WebAPI` (e.g. Oak → Curriculum API)
- `WebAPI.provider` → `Organization`
- `SoftwareSourceCode` → `WebAPI` (explore `schema:targetProduct` or `schema:about` — SDK/MCP interfaces with the API)

Abstract:

- Person → ProfessionalIdentity (has — explore `schema:hasOccupation` or generic `schema:about`)
- Person → ResearchBackground (has)
- ResearchBackground → Credential / Publication (groundedBy — explore `schema:isBasedOn`)

Expressive:

- ProfessionalIdentity → PositioningNarrative (summarisedBy — explore `schema:description` or `schema:subjectOf`)
- ProfessionalIdentity → Capability (claims — explore `schema:knowsAbout`)
- ProfessionalIdentity → TiltVariant (framedAs — explore `schema:isVariantOf`)
- Capability → Role / Project / Publication (groundedBy — explore `schema:isBasedOn`)
- TiltVariant → PositioningNarrative (hasPositioning)

Presentational (with Schema.org properties):

- `ProfilePage.about` → `Person` / `ProfilePage.mainEntity` → `Person`
- `ProfilePage.isPartOf` → `WebSite`
- `ProfilePage.inLanguage` → `"en-GB"`
- OGCard — a page-level metadata entity with its own description, appropriate for social sharing context (see [ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md))
- ManifestEntry — an application-level metadata entity with its own description, appropriate for app launcher context
- PDFView → CVPage (renders)

### Content decisions currently invisible

These live in `lib/jsonld.ts` constants and need to move into the content model:

- `KNOWS_ABOUT` — 35 topic strings describing Jim's expertise (expanded during the meta-SEO content audit from 20, with clustering by domain). **Decision (confirmed)**: link all 35 `knowsAbout` items to Wikidata/Wikipedia entities via `sameAs` (e.g. `{"@type": "Thing", "name": "Cosmology", "sameAs": "https://www.wikidata.org/wiki/Q338"}`). This is the highest-impact improvement for entity resolution — significantly more powerful than bare strings for Google entity reconciliation.
- `OCCUPATION` — name, description, location, skills.
- `CREDENTIAL_DETAILS` — category, level, and subject areas for each degree.
- `PUBLICATIONS` — 4 works with identifiers (DOIs, arXiv IDs) and relationships.

**Decision:** Bring it all in. The full role history, all credentials (including certifications as JSON-LD only), theses, volunteer work, other experience, Code Science Limited, the WebSite entity. The model holds the complete reality. Each view selects what to present.

Certifications (EUMETSAT, Fire Marshal, JHU Data Science, AgilePM) appear in the JSON-LD graph but not on visible pages — they are also visible on LinkedIn, which is linked from the footer on all pages.

Role `description` fields must be framed for who Jim is now. Historical titles are facts; descriptions are expressions of what Jim was actually doing.

---

## Design Phase 2: Content model design

Design where entities live and how views consume them.

### Key question: structure of the model

The model needs to support:

1. **Entities with stable identities** — each entity has a key/ID that all views reference. Entities at all abstraction levels (specific, abstract, expressive).
2. **Page-level composition** — which entities a page presents, in what order, with what prose. A page selects from the graph.
3. **Entity metadata** — dates, identifiers, relationships — properties that may not appear on every page but exist in JSON-LD or other views.
4. **Cross-page sharing** — the Person entity is the same on `/` and `/cv`.

### Option A: Layered content files

```text
content/
  entities.json          # All entities at all abstraction levels: person, orgs, roles, credentials, identity, capabilities, etc.
  cv.content.json        # Page composition: which entities to present, in what order, with what page-specific prose
  frontpage.content.json # Page composition: hero narrative, which entities to reference
```

The entity file is the shared model — all real entities (specific, abstract, expressive) with their properties and relationships. The page content files are views that select, order, and present entities for a particular page.

### Option B: Expand cv.content.json with an entities section

```text
content/
  cv.content.json        # Existing structure + new top-level `entities` key
  frontpage.content.json # References entities from cv.content.json
```

Simpler file structure but the CV content file becomes responsible for non-CV-specific entities.

### Option C: Something else

Jim may have a different preference for how the model should be structured.

**Decision (confirmed):** Option A — layered content files. `content/entities.json` holds all entities at all abstraction levels (valid JSON-LD with `@context` and `@graph`). Page composition files (`cv.content.json`, `frontpage.content.json`) become views that reference entities by ID. Cleanest separation of concerns — entities exist independently of any page, and the entity file is directly consumable by RDF/Neo4j tools.

### Schema.org structural conventions

These conventions apply when the entity model is serialised as JSON-LD.

**Entity `@id` naming scheme:**

| Entity type    | Pattern                                                | Example                                       |
| -------------- | ------------------------------------------------------ | --------------------------------------------- |
| Sitewide       | `https://www.jimcresswell.net/#<type>`                 | `#website`, `#person`                         |
| Organisation   | `https://www.jimcresswell.net/#org-<slug>`             | `#org-oak`, `#org-ft-labs`, `#org-portsmouth` |
| Credential     | `https://www.jimcresswell.net/#cred-<slug>`            | `#cred-phd`, `#cred-msc`, `#cred-mphys`       |
| Thesis         | `https://www.jimcresswell.net/#thesis-<slug>`          | `#thesis-phd`, `#thesis-msc`                  |
| Publication    | Canonical external URL                                 | `https://arxiv.org/abs/astro-ph/0512017`      |
| Role (CV page) | `https://www.jimcresswell.net/cv/#role-<slug>-<dates>` | `cv/#role-oak-2020-present`                   |
| Role (other)   | `https://www.jimcresswell.net/#role-<slug>`            | `#role-growing-communities-volunteer`         |
| Page           | `https://www.jimcresswell.net/<path>#webpage`          | `#webpage`, `cv/#webpage`                     |

IDs that include a page path (e.g. `cv/#role-oak-2020-present`) double as HTML anchor links — the `@id` and the element `id` match, giving humans deep-links and machines stable identifiers.

**Canonical document rule:** an entity's `@id` resolves to the page that is its canonical Linked Data document (the fragment is stripped during HTTP resolution). Site-level entities (`#person`, `#website`, `#org-*`) resolve to the root document. Page-anchored entities (`cv/#role-*`, `cv/#webpage`) resolve to the CV page. If a role entity appears in both the homepage and CV subgraphs, its `@id` still points to the CV page as the canonical description — this is valid in Linked Data and consistent with [ADR-010](../../docs/architecture/decision-records/010-canonical-url-graph-identity.md).

**Structured identifiers (PropertyValue pattern):**

DOIs, arXiv IDs, and other formal identifiers use the Schema.org `PropertyValue` pattern rather than bare strings:

```json
"identifier": [
  { "@type": "PropertyValue", "propertyID": "DOI", "value": "10.1111/j.1365-2966.2008.14082.x" }
]
```

**Locale metadata:**

`WebSite` and `ProfilePage` nodes carry `"inLanguage": "en-GB"`.

**Credential subject areas:**

`EducationalOccupationalCredential` nodes carry `about` arrays for subject areas, e.g. `"about": ["Cosmology", "Large-scale structure", "Statistical modelling"]` on the PhD.

**Organisation URLs and `sameAs`:**

Organisations with public websites carry `url` properties, e.g. `"url": "https://labs.ft.com/"` on FT Labs. Organisations with authoritative external listings (e.g. GOV.UK, Companies House, Wikipedia) should also carry `sameAs` arrays pointing to those listings — this helps machine consumers reconcile the entity across sources. For example, Oak would carry `"url": "https://www.thenational.academy/"` and `"sameAs": ["https://www.gov.uk/government/organisations/oak-national-academy"]`.

**Role-mediating pattern (Schema.org standard):**

The `Person → EmployeeRole → Organization` chain uses `worksFor` at both levels:

```text
Person.worksFor → [EmployeeRole @id]
EmployeeRole.worksFor → [Organization @id]
EmployeeRole.roleName, .startDate, .endDate, .description
```

For volunteering: `Person.memberOf → [OrganizationRole @id]`, then `OrganizationRole.memberOf → [Organization @id]`.

**Bidirectional publication links:**

Person links to publications/theses via `subjectOf`; publications/theses link back via `author`. Both directions are standard Schema.org and help consumers traverse the graph in either direction.

---

## Design Phase 3: Derive all views from the model

Once the content model is designed, ensure every output derives from it.

### View derivation: subgraph closure algorithm

Each page gets a JSON-LD subgraph derived from the canonical entity model. The algorithm is a variant of Concise Bounded Description (CBD), a [W3C Member Submission](https://www.w3.org/Submission/CBD/) for extracting a self-contained subgraph rooted at a given entity:

1. Start from the page's root entity (e.g. the `ProfilePage` node for `/cv/`).
2. Follow `mainEntity` / `about` to reach the `Person` node.
3. Recursively include every entity referenced by `@id` from already-included entities (closure).
4. Optionally prune: the homepage may include only the most recent role(s); the CV page includes the full career. The closure function accepts a pruning predicate — pruning policy is configuration, not algorithm.
5. The canonical `@id` values (e.g. `https://www.jimcresswell.net/#person`, `https://www.jimcresswell.net/cv/#role-oak-2020-present`) stay consistent across pages so consumers can reconcile entities.

This is the concrete mechanism for "different views traverse different paths."

### JSON-LD constraints (confirmed by [research](research/pkg-research-findings.md))

- **Single block per page.** One `<script type="application/ld+json">` containing one `@graph` array. Multiple blocks have unreliable cross-referencing in practice.
- **JSON-LD 1.0 subset only.** No consumer processes 1.1 features (`@nest`, `@propagate`, `@included`, scoped contexts). Stick to `@context`, `@graph`, `@id`, `@type`, and Schema.org properties.
- **Self-containment.** Every `@id` reference in a page's subgraph must resolve to a node within the same subgraph. Dangling references are invalid.
- **Give every entity an `@id`.** Avoid blank nodes (anonymous, not reconcilable across pages). The only exception is genuinely embedded values that never need independent identity (e.g. `PostalAddress`, `PropertyValue` within identifier arrays).

### Publishing strategy

- **Homepage:** Identity-focused subgraph — `WebSite` + `ProfilePage` + `Person` + top capabilities + maybe the current role. Lighter.
- **CV page:** Comprehensive subgraph — `ProfilePage` + `Person` + all Roles + all Credentials + Theses + Publications + Volunteer work + certifications (JSON-LD only). Full career in structured data.

### Views to update

| View             | Current source           | Target source                                 | Changes needed                                          |
| ---------------- | ------------------------ | --------------------------------------------- | ------------------------------------------------------- |
| CV page          | `cv.content.json`        | Content model (page composition)              | Minimal — page composition stays in the same shape      |
| Front page       | `frontpage.content.json` | Content model (page composition)              | Reference shared entities (Person, links)               |
| Open Graph       | `lib/cv-content.ts`      | Content model → derivation                    | Source fields may expand (per-page descriptions?)       |
| JSON-LD (CV)     | `lib/jsonld.ts`          | Content model entities → graph builder        | Constants move out of TypeScript into the content model |
| JSON-LD (front)  | Does not exist           | Content model entities → graph builder        | New: Person + subset of graph on front page             |
| Web App Manifest | `app/manifest.ts`        | Content model → derivation                    | Minimal change — already derives from `meta.*`          |
| Sitemap          | `app/sitemap.ts`         | Content model → derivation                    | Minimal change — already derives from tilt routes       |
| PDF              | Rendered CV page         | No change — PDF flows from the page rendering | Automatic                                               |

### JSON-LD enrichment

With entities in the model, the JSON-LD graph can be significantly richer:

- **Full role history** with `OrganizationRole` nodes — start/end dates, titles, organisations — even for roles not visible on the page.
- **Projects and software** as `SoftwareSourceCode` or `CreativeWork` — this website, Oak SDK/MCP server. **Services** as `WebAPI` — Oak Curriculum API.
- **Volunteer work** — Growing Communities, Obaith, and other volunteer roles.
- **Richer Person** — all `sameAs` links, comprehensive `knowsAbout`, detailed occupation.
- **Cross-page graph** — Person and WebSite nodes shared; each page gets its own WebPage node.

### Schema design decisions

- **Roles**: `OrganizationRole` (Schema.org) allows start/end dates and named positions.
- **Software**: `SoftwareSourceCode` with `codeRepository`. **Services**: `WebAPI` with `provider` → Organisation. See Design Phase 1 entity definitions for Oak Curriculum API and SDK/MCP modelling.
- **Volunteer work**: `OrganizationRole` with `Person.memberOf` → `OrganizationRole` → `OrganizationRole.memberOf` → `Organization`. Research confirms `VolunteerAction` is for discrete events, not ongoing relationships.

**Decision:** Schema.org type mappings are decided in [ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md). Volunteer modelling is resolved: `OrganizationRole` with `memberOf` (see [research findings](research/pkg-research-findings.md)). Specific schema choices for roles and software are confirmed in the entity audit above.

---

## Design Phase 4: HTML semantic binding

Design how graph node IDs map to HTML element IDs in the rendered pages.

### Current HTML structure

The CV page uses `<section>` elements (via `<PageSection>`) with `id` attributes: `positioning`, `experience`, `before-oak`, `capabilities`, `education`. Individual entries use `<article>` elements (via `<ArticleEntry>`).

### Binding levels

1. **Section-level** — Section `@id` values (e.g. `#experience`, `#education`) match existing section `id` attributes. Low effort, mostly in place.
2. **Entity-level** — Entity `@id` values (e.g. `#org-oak`, `#cred-phd`) added as `id` attributes to corresponding HTML elements. Requires minor component changes.
3. **Role anchors as navigable IDs** — Role `@id` values like `https://www.jimcresswell.net/cv/#role-oak-2020-present` map to `<section id="role-oak-2020-present">` in the HTML. This gives stable identifiers for the graph, clickable deep-links for humans, and consistent merging across pages and crawlers.

**Decision (confirmed):** All three binding levels, reflecting a multi-scale graph. Section-level IDs (`#experience`, `#education`) for page structure. Entity-level IDs (`#org-oak`, `#cred-phd`) on corresponding HTML elements. Role anchors (`cv/#role-oak-2020-present`) as navigable deep-link URLs. The HTML expresses all three granularities simultaneously — the `@id` and the element `id` match at every level. This extends [ADR-010](../../docs/architecture/decision-records/010-canonical-url-graph-identity.md) which establishes `#person`, `#website`, and the `cv/#webpage` convention.

---

## Design Phase 5: Consistency and framing review

Once the model exists and all views derive from it, review consistency across all outputs and ensure framing reflects who Jim is now.

### Consistency checks

- Does the OG description tell the same story as the page positioning?
- Does the JSON-LD Person description align with the page narrative?
- Does the manifest description make sense in its context (app launcher)?
- Are `KNOWS_ABOUT` terms consistent with the capabilities section?

### Framing review — critical

Every role `description` in the graph must be reviewed against the "Framing is identity, not history" principle:

- Historical role titles stay as facts (`roleName`: "QA Automation Consultant", "Head of Test", "Programme QA Consultant"). These are what the roles were called.
- Role `description` fields express what Jim was _actually doing_: leading systemic change, shaping delivery culture, creating technical strategies, building organisational capability. Not QA, not devops, not automation — leadership and change using the best levers available.
- The reader of the JSON-LD graph should see: a leader and originator who brings rigour from research into increasingly large-scale system change, and who now shapes national-scale public services and AI-powered knowledge systems. Not a QA engineer who got promoted. The physics credentials speak for themselves in the structured data — descriptions should not lead with them (see "physics as silent ballast" in editorial-guidance.md).

This pass reviews both visible page content and JSON-LD descriptions. The framing must be consistent everywhere.

**Decision:** TBD — review after model is implemented.

---

## Implementation

For phased execution with todos, acceptance criteria, and progress tracking, see the [implementation plan](personal-knowledge-graph-implementation.plan.md). That plan distils this design reference into five actionable phases:

1. Entity model design (collaborative, produces schema + skeleton)
2. Entity population (editorial-intensive — role descriptions, constant migration)
3. View derivation (structural refactoring, no visible change)
4. New views and enrichment (front page JSON-LD, HTML binding, validation)
5. LinkedIn as a derived view

### Quality gates at each step

- **Visible content unchanged.** After each structural migration step, the rendered HTML of all pages must be byte-identical (or pixel-identical if markup changes are cosmetic, e.g. attribute ordering). Snapshot the current rendered output before starting; diff against it after each step. Editorial changes happen separately, never in the same commit as structural migration.
- `pnpm check` passes.
- `pnpm test:e2e` passes.

**Structured data validation** — four-tool workflow (see [research findings](research/pkg-research-findings.md)):

| Tool                                                                    | When            | Purpose                                                                         |
| ----------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------- |
| Programmatic `@id` resolution check                                     | Development     | Every `@id` reference in a subgraph resolves to a node within the same subgraph |
| [Schema.org Validator](https://validator.schema.org/)                   | Pre-deployment  | Strict Schema.org spec compliance; validates all syntaxes                       |
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Post-deployment | Verify Google eligibility; visual preview of which types trigger rich results   |
| [Google Search Console](https://search.google.com/search-console)       | Ongoing         | Alerts; tracks performance; shows real indexing errors                          |

---

## Files affected

| File                                 | Changes                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `content/entities.json` (new)        | All entities at all abstraction levels — person, orgs, roles, credentials, identity, capabilities, etc. |
| `content/cv.content.json`            | May reference entities; page composition stays                                                          |
| `content/frontpage.content.json`     | May reference shared entities (Person, links)                                                           |
| `lib/jsonld.ts`                      | Refactored — imports entities from content model, composes graph                                        |
| `lib/cv-content.ts`                  | Refactored — may import shared entity data                                                              |
| `app/cv/page.tsx`                    | May change if JSON-LD builder interface changes                                                         |
| `app/page.tsx`                       | Add JSON-LD to front page                                                                               |
| `app/manifest.ts`                    | May derive from shared entity data                                                                      |
| `components/cv-layout.tsx`           | Possibly: add `id` attributes for graph–DOM binding                                                     |
| `components/article-entry.tsx`       | Possibly: accept entity `id` attribute                                                                  |
| `docs/architecture/README.md`        | Update Content & Metadata section                                                                       |
| `docs/architecture/content-model.md` | Update to reflect entity model                                                                          |

---

## References

- [JSON-LD 1.1 W3C Recommendation](https://www.w3.org/TR/json-ld11/)
- [JSON-LD Vocabulary](https://www.w3.org/ns/json-ld.html)
- [json-ld.org](https://json-ld.org/)
- [Schema.org](https://schema.org/)
- [Schema.org Validator](https://validator.schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ADR-007](../../docs/architecture/decision-records/007-dry-content-metadata.md) — the foundation this plan builds on
- [ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md) — Schema.org compliance throughout the graph

---

## Sequencing

**Prerequisite complete.** The [meta-seo-content-audit.plan.md](complete/meta-seo-content-audit.plan.md) has been completed. All editorial content in `meta.summary`, `KNOWS_ABOUT`, `OCCUPATION`, front page OG description, and the capabilities has been aligned with the positioning. This plan now operates on correct, editorially settled content throughout — the structural migration can proceed without editorial concerns.

---

## Related

- [research/pkg-research-findings.md](research/pkg-research-findings.md) — Schema.org, JSON-LD, Google structured data, and Neo4j research findings
- [personal-knowledge-graph-implementation.plan.md](personal-knowledge-graph-implementation.plan.md) — phased execution plan with todos and acceptance criteria
- [cv-editorial-improvements.plan.md](cv-editorial-improvements.plan.md) — parent plan
- [meta-seo-content-audit.plan.md](complete/meta-seo-content-audit.plan.md) — editorial content fixes (prerequisite — complete)
- [capabilities-editorial.plan.md](complete/capabilities-editorial.plan.md) — capabilities work (complete — terms added to `KNOWS_ABOUT`)
- [future/neo4j-knowledge-graph.plan.md](future/neo4j-knowledge-graph.plan.md) — future migration to Neo4j; shapes current design decisions
- [ADR-007](../../docs/architecture/decision-records/007-dry-content-metadata.md) — current single-source approach
- [ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md) — Schema.org compliance throughout the graph
- [ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md) — domain-appropriate descriptions (descriptions in different domains are different artifacts)
- [editorial-guidance.md](../../.agent/directives/editorial-guidance.md) — editorial hierarchy, keyword strategy, audience, editorial voice, cross-domain editorial consistency
- [linkedin-update.plan.md](linkedin-update.plan.md) — LinkedIn provides additional role data as a source
