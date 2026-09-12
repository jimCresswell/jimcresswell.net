import type {
  DefinedTerm,
  EmployeeRole,
  Graph,
  Organization,
  Person as SchemaPerson,
  ScholarlyArticle,
  Statement,
  Thesis,
  WebAPI,
} from "schema-dts";
import entitiesJson from "@/content/entities.json";
import { entities, entityGraph, type Entity } from "./entities";
import { cvPageJsonLd, frontPageJsonLd } from "./page-jsonld";

type EntityOfType<TType extends Entity["@type"]> = Extract<Entity, { "@type": TType }>;
type SchemaEmployeeRole = EmployeeRole<{ "@id": string }, "worksFor">;
type RawEntity = (typeof entitiesJson)["@graph"][number];

const schemaOrgValidatedEntityTypes = [
  "Person",
  "Organization",
  "EmployeeRole",
  "ScholarlyArticle",
  "DefinedTerm",
  "Statement",
  "Thesis",
  "WebAPI",
] as const;

type SchemaOrgValidatedEntityType = (typeof schemaOrgValidatedEntityTypes)[number];

const schemaOrgAllowedKeysByType = {
  Person: [
    "@type",
    "@id",
    "name",
    "honorificPrefix",
    "pronouns",
    "url",
    "description",
    "sameAs",
    "email",
    "knowsAbout",
    "hasOccupation",
    "worksFor",
    "hasCredential",
    "alumniOf",
    "subjectOf",
    "memberOf",
  ],
  Organization: ["@type", "@id", "name", "url", "sameAs", "description"],
  EmployeeRole: ["@type", "@id", "roleName", "worksFor", "startDate", "endDate", "description"],
  ScholarlyArticle: ["@type", "@id", "name", "author", "identifier", "sameAs"],
  DefinedTerm: ["@type", "@id", "additionalType", "name", "description"],
  Statement: ["@type", "@id", "additionalType", "name", "text", "about", "author", "inLanguage"],
  Thesis: ["@type", "@id", "name", "author", "inSupportOf", "about"],
  WebAPI: ["@type", "@id", "name", "url", "provider", "description"],
} as const satisfies Record<SchemaOrgValidatedEntityType, readonly string[]>;

type SchemaOrgKeyViolation = {
  entityId: string;
  entityType: SchemaOrgValidatedEntityType;
  key: string;
};

function getEntitiesOfType<TType extends Entity["@type"]>(
  entityType: TType
): EntityOfType<TType>[] {
  return entities.filter((entity): entity is EntityOfType<TType> => entity["@type"] === entityType);
}

function isAllowedKey(allowedKeys: readonly string[], key: string): boolean {
  return allowedKeys.includes(key);
}

function isSchemaOrgValidatedEntityType(
  entityType: string
): entityType is SchemaOrgValidatedEntityType {
  return schemaOrgValidatedEntityTypes.some((validatedType) => validatedType === entityType);
}

function findSchemaOrgKeyViolations(graph: readonly RawEntity[]): SchemaOrgKeyViolation[] {
  const violations: SchemaOrgKeyViolation[] = [];

  for (const entity of graph) {
    const entityType = entity["@type"];
    if (!isSchemaOrgValidatedEntityType(entityType)) continue;

    const allowedKeys = schemaOrgAllowedKeysByType[entityType];
    const entityId =
      "@id" in entity && typeof entity["@id"] === "string" ? entity["@id"] : "(entity without @id)";

    for (const key of Object.keys(entity)) {
      if (!isAllowedKey(allowedKeys, key)) {
        violations.push({ entityId, entityType, key });
      }
    }
  }

  return violations;
}

function toSchemaPerson(entity: EntityOfType<"Person">): SchemaPerson {
  return {
    "@type": entity["@type"],
    "@id": entity["@id"],
    name: entity.name,
    honorificPrefix: entity.honorificPrefix,
    url: entity.url,
    description: entity.description,
    sameAs: entity.sameAs,
    email: entity.email,
    knowsAbout: entity.knowsAbout,
    hasOccupation: entity.hasOccupation,
    worksFor: entity.worksFor,
    hasCredential: entity.hasCredential,
    alumniOf: entity.alumniOf,
    subjectOf: entity.subjectOf,
    memberOf: entity.memberOf,
  };
}

function toSchemaOrganization(entity: EntityOfType<"Organization">): Organization {
  return {
    "@type": entity["@type"],
    "@id": entity["@id"],
    name: entity.name,
    url: entity.url,
    sameAs: entity.sameAs,
    description: entity.description,
  };
}

function toSchemaEmployeeRole(entity: EntityOfType<"EmployeeRole">): SchemaEmployeeRole {
  return {
    "@type": entity["@type"],
    "@id": entity["@id"],
    roleName: entity.roleName,
    worksFor: entity.worksFor,
    startDate: entity.startDate,
    endDate: entity.endDate,
    description: entity.description,
  };
}

function toSchemaArticle(entity: EntityOfType<"ScholarlyArticle">): ScholarlyArticle {
  return {
    "@type": entity["@type"],
    "@id": entity["@id"],
    name: entity.name,
    author: entity.author,
    identifier: entity.identifier,
    sameAs: entity.sameAs,
  };
}

function toSchemaDefinedTerm(entity: EntityOfType<"DefinedTerm">): DefinedTerm {
  return {
    "@type": entity["@type"],
    "@id": entity["@id"],
    additionalType: entity.additionalType,
    name: entity.name,
    description: entity.description,
  };
}

function toSchemaStatement(entity: EntityOfType<"Statement">): Statement {
  return {
    "@type": entity["@type"],
    "@id": entity["@id"],
    additionalType: entity.additionalType,
    name: entity.name,
    text: entity.text,
    about: entity.about,
    author: entity.author,
    inLanguage: entity.inLanguage,
  };
}

function toSchemaThesis(entity: EntityOfType<"Thesis">): Thesis {
  return {
    "@type": entity["@type"],
    "@id": entity["@id"],
    name: entity.name,
    author: entity.author,
    inSupportOf: entity.inSupportOf,
    about: entity.about,
  };
}

function toSchemaWebApi(entity: EntityOfType<"WebAPI">): WebAPI {
  return {
    "@type": entity["@type"],
    "@id": entity["@id"],
    name: entity.name,
    url: entity.url,
    provider: entity.provider,
    description: entity.description,
  };
}

const schemaOrgPeople = getEntitiesOfType("Person").map(toSchemaPerson);
const schemaOrgOrganizations = getEntitiesOfType("Organization").map(toSchemaOrganization);
const schemaOrgEmployeeRoles = getEntitiesOfType("EmployeeRole").map(toSchemaEmployeeRole);
const schemaOrgArticles = getEntitiesOfType("ScholarlyArticle").map(toSchemaArticle);
const schemaOrgDefinedTerms = getEntitiesOfType("DefinedTerm").map(toSchemaDefinedTerm);
const schemaOrgStatements = getEntitiesOfType("Statement").map(toSchemaStatement);
const schemaOrgTheses = getEntitiesOfType("Thesis").map(toSchemaThesis);
const schemaOrgWebApis = getEntitiesOfType("WebAPI").map(toSchemaWebApi);
export const schemaOrgKeyViolations = findSchemaOrgKeyViolations(entitiesJson["@graph"]);

/**
 * Full entity graph exported after raw-JSON compatibility checks.
 *
 * The converter functions rebuild the key PKG entity types as fresh schema-dts
 * literals so shared property types are validated at compile time. The raw
 * source allowlist lives here in product code so tests only need to assert
 * that the entity source produces no vocabulary violations.
 */
export const schemaOrgEntityGraph: Graph = entityGraph;

/** Front-page subgraph validated against schema-dts at compile time. */
export const schemaOrgFrontPageGraph: Graph = frontPageJsonLd;

/** CV-page subgraph validated against schema-dts at compile time. */
export const schemaOrgCvPageGraph: Graph = cvPageJsonLd;

/** Counts for the schema-dts-validated core entity groups. */
export const schemaOrgCoreEntityCounts = {
  people: schemaOrgPeople.length,
  organizations: schemaOrgOrganizations.length,
  employeeRoles: schemaOrgEmployeeRoles.length,
  articles: schemaOrgArticles.length,
  definedTerms: schemaOrgDefinedTerms.length,
  statements: schemaOrgStatements.length,
  theses: schemaOrgTheses.length,
  webApis: schemaOrgWebApis.length,
};
