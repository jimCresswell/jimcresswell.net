/**
 * JSON-LD structured data builder.
 *
 * Constructs a Schema.org JSON-LD graph from `cv.content.json` (the single
 * source of truth for editorial content). Structured-data-specific details
 * — publications, `knowsAbout`, occupation metadata — are defined as
 * constants in this module because they have no editorial equivalent.
 *
 * The WebPage node's `name` and `description` are the same values used for
 * the page's HTML `<title>` and `<meta name="description">`, ensuring
 * consistency between what humans see in search results and what machines
 * read in JSON-LD.
 *
 * To add new JSON-LD nodes, add them to {@link buildGraph}. The structure
 * is deliberately extensible — each category (publications, credentials,
 * organisations) is generated independently and merged into the graph.
 */
import { cvContent, cvOpenGraph } from "./cv-content";
import { SITE_URL } from "./site-config";

// ─── Structured-data-specific constants ────────────────────────────────
// These have no editorial equivalent in cv.content.json. They describe
// Jim's work in terms that search engines and AI systems can classify.

/** Topics Jim is known for — consumed by search engines and AI for entity understanding. */
const KNOWS_ABOUT = [
  // Leadership & strategy
  "Technical leadership",
  "Systems understanding",
  "Systems thinking",
  "Communicating technical impact to non‑technical stakeholders",
  "Organisational design",
  "Product strategy",
  // Creation & origination
  "Zero‑to‑one product creation",
  "Proof of concept creation",
  "Rapid prototyping",
  // Domains
  "Digital‑first public services",
  "Public services",
  "Education technology",
  "AI‑mediated access to knowledge and learning",
  "Public digital infrastructure",
  "Responsible AI",
  "Open data",
  "National‑scale systems",
  // Technical craft
  "Open API and SDK design",
  "Model Context Protocol (MCP)",
  "Agentic software engineering",
  "Software engineering",
  "The open web",
  "Semantic search",
  "Model fitting",
  // Technologies
  "TypeScript",
  "Node.js",
  "React",
  "Next.js",
  "Google Cloud Platform (GCP)",
  "PaaS hosting e.g. Vercel, Netlify",
  // Personal / ecological
  "Ecology‑informed agriculture and perennial food systems",
  "Nature‑based solutions",
  "Climate tech",
  "Resilience through diversity",
];

/** Occupation metadata — how search engines classify Jim's professional work. */
const OCCUPATION = {
  "@type": "Occupation",
  name: "Exploration and origination",
  description:
    "Finding the underlying structure in undefined problem spaces — shaping the frame that turns ambiguity into something that can be confidently delivered against. Core work includes identifying leverage in complex systems, navigating irreversible decisions with incomplete information, and setting direction that shapes outcomes long after the initial work.",
  occupationLocation: {
    "@type": "Country",
    name: "United Kingdom",
  },
  skills: [
    "Problem shaping",
    "Systems understanding",
    "Judgment under uncertainty",
    "Constraint‑based decision making",
    "Research‑to‑practice translation",
    "Origination",
    "Architectural direction‑setting",
  ],
};

/**
 * Credential-level details not present in cv.content.json.
 * Keyed by degree abbreviation — must match `cv.content.json` `education[].degree`.
 */
const CREDENTIAL_DETAILS: Record<
  string,
  { category: string; level: string; about?: readonly string[] }
> = {
  PhD: {
    category: "Doctor of Philosophy",
    level: "Doctoral",
    about: ["Cosmology", "Large‑scale structure", "Statistical modelling"],
  },
  MSc: {
    category: "Master of Science",
    level: "Master",
  },
  MPhys: {
    category: "Master of Physics",
    level: "Master",
  },
};

/** Publications and creative works with permanent identifiers. */
const PUBLICATIONS = [
  {
    "@type": "Thesis",
    "@id": `${SITE_URL}/#thesis-mphys`,
    name: "The Design and Construction of a Theremin",
    author: { "@id": `${SITE_URL}/#person` },
    inSupportOf: { "@id": `${SITE_URL}/#cred-mphys` },
  },
  {
    "@type": "CreativeWork",
    "@id": "https://arxiv.org/abs/astro-ph/0512017",
    name: "Cosmic microwave background multipole alignments in slab topologies",
    author: { "@id": `${SITE_URL}/#person` },
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "arXiv",
        value: "astro-ph/0512017",
      },
    ],
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1111/j.1365-2966.2008.14082.x",
    name: "Scale-dependent galaxy bias in the Sloan Digital Sky Survey as a function of luminosity and colour",
    author: [{ "@id": `${SITE_URL}/#person` }],
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "DOI",
        value: "10.1111/j.1365-2966.2008.14082.x",
      },
    ],
  },
  {
    "@type": "Thesis",
    "@id": `${SITE_URL}/#thesis-phd`,
    name: "Luminosity Functions and Galaxy Bias in the Sloan Digital Sky Survey",
    author: { "@id": `${SITE_URL}/#person` },
    inSupportOf: { "@id": `${SITE_URL}/#cred-phd` },
  },
];

// ─── ID helpers ────────────────────────────────────────────────────────

/**
 * Derive a URL-safe ID fragment from an institution name.
 * @example orgId("University of Bath") // "bath"
 */
function orgId(institution: string): string {
  const parts = institution.split(" ");
  const last = parts[parts.length - 1];
  if (!last) {
    throw new Error(`Cannot derive org ID from empty institution name`);
  }
  return last.toLowerCase();
}

/**
 * Derive a credential ID from a degree abbreviation.
 * @example credId("PhD") // "phd"
 */
function credId(degree: string): string {
  return degree.toLowerCase();
}

// ─── Graph construction ────────────────────────────────────────────────

/**
 * Build the full JSON-LD `@graph` array.
 *
 * Each category of nodes is constructed independently, making it
 * straightforward to add new node types (e.g. experience roles,
 * volunteer work, projects).
 */
function buildGraph() {
  // ── Site & page ──────────────────────────────────────────────────

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: cvContent.meta.name,
    inLanguage: cvContent.meta.locale,
  };

  // name and description match the page's <title> and <meta description>
  const webpage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/cv/#webpage`,
    url: cvOpenGraph.url,
    name: cvOpenGraph.title,
    description: cvOpenGraph.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: cvContent.meta.locale,
    about: { "@id": `${SITE_URL}/#person` },
  };

  // ── Person ───────────────────────────────────────────────────────

  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: cvContent.meta.name,
    url: `${SITE_URL}/`,
    sameAs: [cvContent.links.github, cvContent.links.linkedin, cvContent.links.google_scholar],
    description: cvContent.meta.summary,
    knowsAbout: [...KNOWS_ABOUT],
    hasOccupation: [OCCUPATION],
    hasCredential: cvContent.education.map((edu) => ({
      "@id": `${SITE_URL}/#cred-${credId(edu.degree)}`,
    })),
    alumniOf: cvContent.education.map((edu) => ({
      "@id": `${SITE_URL}/#org-${orgId(edu.institution)}`,
    })),
    worksFor: [{ "@id": `${SITE_URL}/#org-oak` }],
  };

  // ── Organisations ────────────────────────────────────────────────

  const employer = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#org-oak`,
    name: cvContent.experience[0].organisation,
  };

  const universities = cvContent.education.map((edu) => ({
    "@type": "CollegeOrUniversity",
    "@id": `${SITE_URL}/#org-${orgId(edu.institution)}`,
    name: edu.institution,
  }));

  // ── Education credentials ────────────────────────────────────────

  const credentials = cvContent.education.map((edu) => {
    const details = CREDENTIAL_DETAILS[edu.degree];
    if (!details) {
      throw new Error(
        `No credential details for degree "${edu.degree}". ` +
          `Add an entry to CREDENTIAL_DETAILS in lib/jsonld.ts.`
      );
    }
    return {
      "@type": "EducationalOccupationalCredential",
      "@id": `${SITE_URL}/#cred-${credId(edu.degree)}`,
      credentialCategory: details.category,
      educationalLevel: details.level,
      name: `${edu.degree}, ${edu.field}`,
      recognizedBy: { "@id": `${SITE_URL}/#org-${orgId(edu.institution)}` },
      ...(details.about ? { about: [...details.about] } : {}),
    };
  });

  // ── Assemble ─────────────────────────────────────────────────────

  return [website, webpage, person, employer, ...universities, ...credentials, ...PUBLICATIONS];
}

/**
 * Complete JSON-LD structured data for the CV page.
 *
 * All editorial content is derived from `cv.content.json`.
 * Structured-data-specific metadata (publications, keywords, occupation)
 * is defined as constants in this module.
 *
 * The WebPage `name` and `description` are identical to the page's HTML
 * `<title>` and `<meta name="description">` — same source, same values.
 */
export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": buildGraph(),
};
