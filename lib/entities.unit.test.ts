import { describe, it, expect } from "vitest";
import {
  IdRefSchema,
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
  EntityGraphSchema,
} from "./entities";

describe("IdRefSchema", () => {
  it("accepts an object with a string @id", () => {
    const result = IdRefSchema.safeParse({ "@id": "https://example.com/#thing" });
    expect(result.success).toBe(true);
  });

  it("rejects an object without @id", () => {
    const result = IdRefSchema.safeParse({ name: "test" });
    expect(result.success).toBe(false);
  });

  it("rejects a bare string", () => {
    const result = IdRefSchema.safeParse("https://example.com/#thing");
    expect(result.success).toBe(false);
  });
});

describe("WebSiteEntitySchema", () => {
  it("parses a valid WebSite entity", () => {
    const entity = {
      "@type": "WebSite",
      "@id": "https://www.jimcresswell.net/#website",
      url: "https://www.jimcresswell.net/",
      name: "Jim Cresswell",
      publisher: { "@id": "https://www.jimcresswell.net/#person" },
      inLanguage: "en-GB",
    };
    expect(WebSiteEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects a WebSite missing @id", () => {
    const entity = {
      "@type": "WebSite",
      url: "https://www.jimcresswell.net/",
      name: "Jim Cresswell",
    };
    expect(WebSiteEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("ProfilePageEntitySchema", () => {
  it("parses a valid ProfilePage", () => {
    const entity = {
      "@type": "ProfilePage",
      "@id": "https://www.jimcresswell.net/#webpage",
      url: "https://www.jimcresswell.net/",
      name: "Jim Cresswell",
      isPartOf: { "@id": "https://www.jimcresswell.net/#website" },
      inLanguage: "en-GB",
      about: { "@id": "https://www.jimcresswell.net/#person" },
      mainEntity: { "@id": "https://www.jimcresswell.net/#person" },
    };
    expect(ProfilePageEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects a ProfilePage without isPartOf", () => {
    const entity = {
      "@type": "ProfilePage",
      "@id": "https://www.jimcresswell.net/#webpage",
      url: "https://www.jimcresswell.net/",
      name: "Jim Cresswell",
      about: { "@id": "https://www.jimcresswell.net/#person" },
      mainEntity: { "@id": "https://www.jimcresswell.net/#person" },
    };
    expect(ProfilePageEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("PersonEntitySchema", () => {
  it("parses a valid Person entity", () => {
    const entity = {
      "@type": "Person",
      "@id": "https://www.jimcresswell.net/#person",
      name: "Jim Cresswell",
      honorificPrefix: "Dr",
      pronouns: "he/him",
      url: "https://www.jimcresswell.net/",
      description: "A description.",
      sameAs: ["https://github.com/jimCresswell"],
      email: "contact@jimcresswell.net",
      knowsAbout: [{ "@type": "Thing", name: "Cosmology" }],
      hasOccupation: [{ "@id": "https://www.jimcresswell.net/#occupation" }],
      worksFor: [{ "@id": "https://www.jimcresswell.net/cv/#role-oak-principal-2022-present" }],
      hasCredential: [{ "@id": "https://www.jimcresswell.net/#cred-phd" }],
      alumniOf: [{ "@id": "https://www.jimcresswell.net/#org-portsmouth" }],
      subjectOf: [{ "@id": "https://www.jimcresswell.net/#thesis-phd" }],
      memberOf: [],
    };
    expect(PersonEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects a Person without name", () => {
    const entity = {
      "@type": "Person",
      "@id": "https://www.jimcresswell.net/#person",
    };
    expect(PersonEntitySchema.safeParse(entity).success).toBe(false);
  });

  it("rejects malformed sameAs profile URLs", () => {
    const entity = {
      "@type": "Person",
      "@id": "https://www.jimcresswell.net/#person",
      name: "Jim Cresswell",
      url: "https://www.jimcresswell.net/",
      description: "A description.",
      sameAs: ["not a URL"],
      email: "contact@jimcresswell.net",
      knowsAbout: [],
      hasOccupation: [],
      worksFor: [],
      hasCredential: [],
      alumniOf: [],
      subjectOf: [],
      memberOf: [],
    };

    expect(PersonEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("OccupationEntitySchema", () => {
  it("parses a valid Occupation", () => {
    const entity = {
      "@type": "Occupation",
      "@id": "https://www.jimcresswell.net/#occupation",
      name: "Exploration and origination",
      description: "Finding structure in undefined spaces.",
      occupationLocation: { "@type": "Country", name: "United Kingdom" },
      skills: ["Problem shaping"],
    };
    expect(OccupationEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects an Occupation without skills array", () => {
    const entity = {
      "@type": "Occupation",
      "@id": "https://www.jimcresswell.net/#occupation",
      name: "Test",
      description: "Test.",
      occupationLocation: { "@type": "Country", name: "United Kingdom" },
    };
    expect(OccupationEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("OrganizationEntitySchema", () => {
  it("parses a minimal Organization", () => {
    const entity = {
      "@type": "Organization",
      "@id": "https://www.jimcresswell.net/#org-ba",
      name: "British Airways",
    };
    expect(OrganizationEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("parses a rich Organization with url and sameAs", () => {
    const entity = {
      "@type": "Organization",
      "@id": "https://www.jimcresswell.net/#org-oak",
      name: "Oak National Academy",
      url: "https://www.thenational.academy/",
      sameAs: ["https://www.gov.uk/government/organisations/oak-national-academy"],
      description: "An ALB of the Department for Education.",
    };
    expect(OrganizationEntitySchema.safeParse(entity).success).toBe(true);
  });
});

describe("CollegeOrUniversityEntitySchema", () => {
  it("parses a valid university", () => {
    const entity = {
      "@type": "CollegeOrUniversity",
      "@id": "https://www.jimcresswell.net/#org-portsmouth",
      name: "University of Portsmouth",
    };
    expect(CollegeOrUniversityEntitySchema.safeParse(entity).success).toBe(true);
  });
});

describe("EmployeeRoleEntitySchema", () => {
  it("parses a current role without endDate", () => {
    const entity = {
      "@type": "EmployeeRole",
      "@id": "https://www.jimcresswell.net/cv/#role-oak-principal-2022-present",
      roleName: "Principal Engineer",
      worksFor: { "@id": "https://www.jimcresswell.net/#org-oak" },
      startDate: "2022-06",
      description: "Leading technical direction.",
    };
    expect(EmployeeRoleEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("parses a historical role with endDate", () => {
    const entity = {
      "@type": "EmployeeRole",
      "@id": "https://www.jimcresswell.net/cv/#role-ft-labs-2011-2014",
      roleName: "Senior Developer",
      worksFor: { "@id": "https://www.jimcresswell.net/#org-ft-labs" },
      startDate: "2011-08",
      endDate: "2014-07",
      description: "Building the FT Web App.",
    };
    expect(EmployeeRoleEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects a role without roleName", () => {
    const entity = {
      "@type": "EmployeeRole",
      "@id": "https://www.jimcresswell.net/cv/#role-test",
      worksFor: { "@id": "https://www.jimcresswell.net/#org-oak" },
      startDate: "2022-06",
    };
    expect(EmployeeRoleEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("OrganizationRoleEntitySchema", () => {
  it("parses a volunteer role", () => {
    const entity = {
      "@type": "OrganizationRole",
      "@id": "https://www.jimcresswell.net/#role-growing-communities-volunteer",
      roleName: "Volunteer Market Gardener",
      memberOf: { "@id": "https://www.jimcresswell.net/#org-growing-communities" },
      description: "Volunteering as a market gardener.",
    };
    expect(OrganizationRoleEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects a volunteer role without memberOf", () => {
    const entity = {
      "@type": "OrganizationRole",
      "@id": "https://www.jimcresswell.net/#role-test",
      roleName: "Test",
      description: "Test.",
    };
    expect(OrganizationRoleEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("CredentialEntitySchema", () => {
  it("parses a credential with subject areas", () => {
    const entity = {
      "@type": "EducationalOccupationalCredential",
      "@id": "https://www.jimcresswell.net/#cred-phd",
      credentialCategory: "Doctor of Philosophy",
      educationalLevel: "Doctoral",
      name: "PhD, Astrophysics & Cosmology",
      recognizedBy: { "@id": "https://www.jimcresswell.net/#org-portsmouth" },
      about: ["Cosmology", "Large-scale structure"],
    };
    expect(CredentialEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("parses a credential without subject areas", () => {
    const entity = {
      "@type": "EducationalOccupationalCredential",
      "@id": "https://www.jimcresswell.net/#cred-msc",
      credentialCategory: "Master of Science",
      educationalLevel: "Master",
      name: "MSc, Cosmology",
      recognizedBy: { "@id": "https://www.jimcresswell.net/#org-sussex" },
    };
    expect(CredentialEntitySchema.safeParse(entity).success).toBe(true);
  });
});

describe("ThesisEntitySchema", () => {
  it("parses a thesis with inSupportOf as text and about as ref", () => {
    const entity = {
      "@type": "Thesis",
      "@id": "https://www.jimcresswell.net/#thesis-phd",
      name: "Luminosity Functions and Galaxy Bias",
      author: { "@id": "https://www.jimcresswell.net/#person" },
      inSupportOf: "PhD in Astrophysics & Cosmology",
      about: { "@id": "https://www.jimcresswell.net/#cred-phd" },
    };
    expect(ThesisEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects inSupportOf as an @id reference", () => {
    const entity = {
      "@type": "Thesis",
      "@id": "https://www.jimcresswell.net/#thesis-phd",
      name: "Test",
      author: { "@id": "https://www.jimcresswell.net/#person" },
      inSupportOf: { "@id": "https://www.jimcresswell.net/#cred-phd" },
      about: { "@id": "https://www.jimcresswell.net/#cred-phd" },
    };
    expect(ThesisEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("ScholarlyArticleEntitySchema", () => {
  it("parses an article with array of authors", () => {
    const entity = {
      "@type": "ScholarlyArticle",
      "@id": "https://doi.org/10.1111/j.1365-2966.2008.14082.x",
      name: "Scale-dependent galaxy bias",
      author: [{ "@id": "https://www.jimcresswell.net/#person" }],
      identifier: [
        { "@type": "PropertyValue", propertyID: "DOI", value: "10.1111/j.1365-2966.2008.14082.x" },
      ],
    };
    expect(ScholarlyArticleEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("parses an article with a single author ref", () => {
    const entity = {
      "@type": "ScholarlyArticle",
      "@id": "https://arxiv.org/abs/astro-ph/0512017",
      name: "CMB multipole alignments",
      author: { "@id": "https://www.jimcresswell.net/#person" },
    };
    expect(ScholarlyArticleEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects author as a bare string", () => {
    const entity = {
      "@type": "ScholarlyArticle",
      "@id": "https://doi.org/test",
      name: "Test",
      author: "Jim Cresswell",
    };
    expect(ScholarlyArticleEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("CreativeWorkEntitySchema", () => {
  it("parses a project with additionalType", () => {
    const entity = {
      "@type": "CreativeWork",
      "@id": "https://www.jimcresswell.net/#project-obaith",
      additionalType: "https://www.jimcresswell.net/schema/Project",
      name: "Obaith",
      creator: { "@id": "https://www.jimcresswell.net/#person" },
      description: "Research into systems change and leverage points.",
    };
    expect(CreativeWorkEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects a CreativeWork without name", () => {
    const entity = {
      "@type": "CreativeWork",
      "@id": "https://www.jimcresswell.net/#project-test",
    };
    expect(CreativeWorkEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("SoftwareSourceCodeEntitySchema", () => {
  it("parses software with codeRepository", () => {
    const entity = {
      "@type": "SoftwareSourceCode",
      "@id": "https://www.jimcresswell.net/#software-jimcresswell-net",
      name: "jimcresswell.net",
      creator: { "@id": "https://www.jimcresswell.net/#person" },
      codeRepository: "https://github.com/jimCresswell/jimcresswell.net",
    };
    expect(SoftwareSourceCodeEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("rejects software without creator", () => {
    const entity = {
      "@type": "SoftwareSourceCode",
      "@id": "https://www.jimcresswell.net/#software-test",
      name: "Test",
    };
    expect(SoftwareSourceCodeEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("WebAPIEntitySchema", () => {
  it("parses a WebAPI with provider", () => {
    const entity = {
      "@type": "WebAPI",
      "@id": "https://www.jimcresswell.net/#service-oak-api",
      name: "Oak Curriculum API",
      url: "https://open-api.thenational.academy/",
      provider: { "@id": "https://www.jimcresswell.net/#org-oak" },
      description: "Free access to curriculum data.",
    };
    expect(WebAPIEntitySchema.safeParse(entity).success).toBe(true);
  });
});

describe("IntangibleEntitySchema", () => {
  it("parses a ProfessionalIdentity", () => {
    const entity = {
      "@type": "Intangible",
      "@id": "https://www.jimcresswell.net/#professional-identity",
      additionalType: "https://www.jimcresswell.net/schema/ProfessionalIdentity",
      name: "Professional Identity",
      description: "Jim's professional identity.",
    };
    expect(IntangibleEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("requires additionalType for Intangible", () => {
    const entity = {
      "@type": "Intangible",
      "@id": "https://www.jimcresswell.net/#test",
      name: "Test",
    };
    expect(IntangibleEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("StatementEntitySchema", () => {
  it("parses a PositioningNarrative", () => {
    const entity = {
      "@type": "Statement",
      "@id": "https://www.jimcresswell.net/#positioning-default",
      additionalType: "https://www.jimcresswell.net/schema/PositioningNarrative",
      name: "Default Positioning",
      text: "I'm drawn to problems that don't have shape yet.",
      about: { "@id": "https://www.jimcresswell.net/#professional-identity" },
      author: { "@id": "https://www.jimcresswell.net/#person" },
      inLanguage: "en-GB",
    };
    expect(StatementEntitySchema.safeParse(entity).success).toBe(true);
  });

  it("requires additionalType for Statement", () => {
    const entity = {
      "@type": "Statement",
      "@id": "https://www.jimcresswell.net/#test",
      name: "Test",
      text: "Some text.",
    };
    expect(StatementEntitySchema.safeParse(entity).success).toBe(false);
  });
});

describe("DefinedTermEntitySchema", () => {
  it("parses a Capability", () => {
    const entity = {
      "@type": "DefinedTerm",
      "@id": "https://www.jimcresswell.net/#cap-zero-to-one",
      additionalType: "https://www.jimcresswell.net/schema/Capability",
      name: "Zero-to-one technical leadership",
      description: "I set architectural direction.",
    };
    expect(DefinedTermEntitySchema.safeParse(entity).success).toBe(true);
  });
});

describe("EntityGraphSchema", () => {
  it("parses a minimal valid graph", () => {
    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": "https://www.jimcresswell.net/#person",
          name: "Jim Cresswell",
          honorificPrefix: "Dr",
          pronouns: "he/him",
          url: "https://www.jimcresswell.net/",
          description: "Test.",
          sameAs: [],
          email: "test@test.com",
          knowsAbout: [],
          hasOccupation: [],
          worksFor: [],
          hasCredential: [],
          alumniOf: [],
          subjectOf: [],
          memberOf: [],
        },
      ],
    };
    expect(EntityGraphSchema.safeParse(graph).success).toBe(true);
  });

  it("rejects a graph with wrong @context", () => {
    const graph = {
      "@context": "https://example.org",
      "@graph": [],
    };
    expect(EntityGraphSchema.safeParse(graph).success).toBe(false);
  });
});
