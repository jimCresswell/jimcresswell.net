/**
 * Zod schemas for the personal knowledge graph entity model.
 *
 * All entity types from `content/entities.json` are validated through these
 * schemas at import time. TypeScript types derive from the schemas (single
 * source of truth). Invalid entity data causes a build failure with a
 * descriptive error.
 *
 * Schema.org type mappings follow ADR-008 and the PKG skill type table.
 * `@id` conventions follow ADR-010 and the PKG skill conventions table.
 *
 * @example
 * ```ts
 * import { entities, type Person } from "@/lib/entities";
 * const person = entities.find((e): e is Person => e["@type"] === "Person");
 * ```
 */
import { z } from "zod";
import entitiesJson from "@/content/entities.json";

/** A JSON-LD `@id` reference to another entity. */
export const IdRefSchema = z.object({ "@id": z.string() });

/** A Schema.org PropertyValue for structured identifiers (DOIs, arXiv IDs). */
const PropertyValueSchema = z.object({
  "@type": z.literal("PropertyValue"),
  propertyID: z.string(),
  value: z.string(),
});

/** A `knowsAbout` item — a Thing with optional Wikidata `sameAs`. */
const KnowsAboutItemSchema = z.object({
  "@type": z.literal("Thing"),
  name: z.string(),
  sameAs: z.string().optional(),
});

/** An embedded Country (used in Occupation.occupationLocation). */
const CountrySchema = z.object({
  "@type": z.literal("Country"),
  name: z.string(),
});

// ─── Entity schemas ────────────────────────────────────────────────────

/** `schema:WebSite` — the website itself. Tier 1 consumer value. */
export const WebSiteEntitySchema = z.object({
  "@type": z.literal("WebSite"),
  "@id": z.string(),
  url: z.string(),
  name: z.string(),
  publisher: IdRefSchema.optional(),
  inLanguage: z.string().optional(),
});

/** `schema:ProfilePage` — a page about a person. Tier 1 consumer value. */
export const ProfilePageEntitySchema = z.object({
  "@type": z.literal("ProfilePage"),
  "@id": z.string(),
  url: z.string(),
  name: z.string(),
  isPartOf: IdRefSchema,
  inLanguage: z.string().optional(),
  about: IdRefSchema,
  mainEntity: IdRefSchema,
});

/** `schema:Person` — the central entity. Tier 2 consumer value. */
export const PersonEntitySchema = z.object({
  "@type": z.literal("Person"),
  "@id": z.string(),
  name: z.string(),
  honorificPrefix: z.string().optional(),
  pronouns: z.string().optional(),
  url: z.string(),
  description: z.string(),
  sameAs: z.array(z.url()),
  email: z.string(),
  knowsAbout: z.array(KnowsAboutItemSchema),
  hasOccupation: z.array(IdRefSchema),
  worksFor: z.array(IdRefSchema),
  hasCredential: z.array(IdRefSchema),
  alumniOf: z.array(IdRefSchema),
  subjectOf: z.array(IdRefSchema),
  memberOf: z.array(IdRefSchema),
});

/** `schema:Occupation` — occupation metadata for search engines. Tier 3. */
export const OccupationEntitySchema = z.object({
  "@type": z.literal("Occupation"),
  "@id": z.string(),
  name: z.string(),
  description: z.string(),
  occupationLocation: CountrySchema,
  skills: z.array(z.string()),
});

/** `schema:Organization` — an employer or other organisation. Tier 2. */
export const OrganizationEntitySchema = z.object({
  "@type": z.literal("Organization"),
  "@id": z.string(),
  name: z.string(),
  url: z.string().optional(),
  sameAs: z.array(z.string()).optional(),
  description: z.string().optional(),
});

/** `schema:CollegeOrUniversity` — an educational institution. Tier 2. */
export const CollegeOrUniversityEntitySchema = z.object({
  "@type": z.literal("CollegeOrUniversity"),
  "@id": z.string(),
  name: z.string(),
  url: z.string().optional(),
  sameAs: z.array(z.string()).optional(),
});

/** `schema:EmployeeRole` — a role mediating Person and Organisation. Tier 2. */
export const EmployeeRoleEntitySchema = z.object({
  "@type": z.literal("EmployeeRole"),
  "@id": z.string(),
  roleName: z.string(),
  worksFor: IdRefSchema,
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string(),
});

/** `schema:OrganizationRole` — a volunteer/membership role. Tier 3. */
export const OrganizationRoleEntitySchema = z.object({
  "@type": z.literal("OrganizationRole"),
  "@id": z.string(),
  roleName: z.string(),
  memberOf: IdRefSchema,
  description: z.string(),
});

/** `schema:EducationalOccupationalCredential` — a degree or certification. Tier 3. */
export const CredentialEntitySchema = z.object({
  "@type": z.literal("EducationalOccupationalCredential"),
  "@id": z.string(),
  credentialCategory: z.string(),
  educationalLevel: z.string().optional(),
  name: z.string(),
  recognizedBy: IdRefSchema.optional(),
  about: z.array(z.string()).optional(),
});

/**
 * `schema:Thesis` — a thesis linked to a credential.
 *
 * `inSupportOf` is Text per Schema.org spec (NOT an entity reference).
 * `about` carries the typed `@id` reference to the credential.
 */
export const ThesisEntitySchema = z.object({
  "@type": z.literal("Thesis"),
  "@id": z.string(),
  name: z.string(),
  author: IdRefSchema,
  inSupportOf: z.string(),
  about: IdRefSchema,
});

/** `schema:ScholarlyArticle` — a published paper with identifiers. Tier 2. */
export const ScholarlyArticleEntitySchema = z.object({
  "@type": z.literal("ScholarlyArticle"),
  "@id": z.string(),
  name: z.string(),
  author: z.union([IdRefSchema, z.array(IdRefSchema)]),
  identifier: z.array(PropertyValueSchema).optional(),
  sameAs: z.string().optional(),
});

/** `schema:SoftwareSourceCode` — software Jim created. Tier 3. */
export const SoftwareSourceCodeEntitySchema = z.object({
  "@type": z.literal("SoftwareSourceCode"),
  "@id": z.string(),
  name: z.string(),
  creator: IdRefSchema,
  codeRepository: z.string().optional(),
  sourceOrganization: IdRefSchema.optional(),
  description: z.string().optional(),
});

/** `schema:CreativeWork` + `additionalType` — a project. Tier 3. */
export const CreativeWorkEntitySchema = z.object({
  "@type": z.literal("CreativeWork"),
  "@id": z.string(),
  additionalType: z.string().optional(),
  name: z.string(),
  creator: IdRefSchema.optional(),
  url: z.string().optional(),
  description: z.string().optional(),
});

/** `schema:WebAPI` — a service offered by an organisation. Tier 3. */
export const WebAPIEntitySchema = z.object({
  "@type": z.literal("WebAPI"),
  "@id": z.string(),
  name: z.string(),
  url: z.string(),
  provider: IdRefSchema,
  description: z.string().optional(),
});

/**
 * `schema:Intangible` + `additionalType` — abstract identity constructs.
 *
 * Used for ProfessionalIdentity, ResearchBackground, GroundedPractice.
 * `additionalType` is required to provide domain specificity.
 */
export const IntangibleEntitySchema = z.object({
  "@type": z.literal("Intangible"),
  "@id": z.string(),
  additionalType: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

/**
 * `schema:Statement` + `additionalType` — expressive entities.
 *
 * Used for PositioningNarrative. Statement extends CreativeWork, so it
 * inherits `text`, `author`, `inLanguage`.
 * `additionalType` is required for domain specificity.
 */
export const StatementEntitySchema = z.object({
  "@type": z.literal("Statement"),
  "@id": z.string(),
  additionalType: z.string(),
  name: z.string(),
  text: z.string(),
  about: IdRefSchema.optional(),
  author: IdRefSchema.optional(),
  inLanguage: z.string().optional(),
});

/**
 * `schema:DefinedTerm` + `additionalType` — capabilities.
 *
 * Capabilities are real competences linked to ProfessionalIdentity.
 * Evidence grounding is expressed through descriptions, not typed links
 * (Schema.org doesn't support `isBasedOn` on DefinedTerm).
 */
export const DefinedTermEntitySchema = z.object({
  "@type": z.literal("DefinedTerm"),
  "@id": z.string(),
  additionalType: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
});

/** Discriminated union of all entity types in the graph. */
const EntitySchema = z.discriminatedUnion("@type", [
  WebSiteEntitySchema,
  ProfilePageEntitySchema,
  PersonEntitySchema,
  OccupationEntitySchema,
  OrganizationEntitySchema,
  CollegeOrUniversityEntitySchema,
  EmployeeRoleEntitySchema,
  OrganizationRoleEntitySchema,
  CredentialEntitySchema,
  ThesisEntitySchema,
  ScholarlyArticleEntitySchema,
  CreativeWorkEntitySchema,
  SoftwareSourceCodeEntitySchema,
  WebAPIEntitySchema,
  IntangibleEntitySchema,
  StatementEntitySchema,
  DefinedTermEntitySchema,
]);

/** The complete JSON-LD entity graph with `@context` and `@graph`. */
export const EntityGraphSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@graph": z.array(EntitySchema),
});

// ─── Parse and export ──────────────────────────────────────────────────

const parseResult = EntityGraphSchema.safeParse(entitiesJson);

if (!parseResult.success) {
  const issues = parseResult.error.issues
    .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Entity model validation failed:\n${issues}`);
}

/** Validated entity graph — all entities parsed through Zod schemas. */
export const entityGraph = parseResult.data;

/** All entities in the graph, typed as the discriminated union. */
export const entities = entityGraph["@graph"];

/**
 * Resolve the sole Person node from a parsed entity graph.
 *
 * @param nodes Parsed graph nodes to inspect.
 * @returns The graph's one Person entity.
 * @throws If the graph contains zero or multiple Person entities.
 */
export function resolveSinglePerson(nodes: readonly Entity[]): Person {
  const people = nodes.filter((entity): entity is Person => entity["@type"] === "Person");
  if (people.length !== 1) {
    throw new Error(`Entity model must contain exactly one Person entity (found ${people.length})`);
  }
  return people[0];
}

/** The Person entity — central node of the graph. */
export const person: Person = resolveSinglePerson(entities);

// ─── Derived types ─────────────────────────────────────────────────────

type Person = z.infer<typeof PersonEntitySchema>;
export type Entity = z.infer<typeof EntitySchema>;
export type EntityGraph = z.infer<typeof EntityGraphSchema>;
