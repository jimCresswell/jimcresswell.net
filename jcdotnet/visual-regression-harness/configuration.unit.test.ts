import { describe, expect, it } from "vitest";
import { parseVisualRegressionConfiguration } from "./configuration";

const completeConfiguration = {
  routes: [
    {
      key: "example",
      path: "/example",
      regions: [{ key: "content", selector: "main" }],
      expectedSectionIds: ["summary"],
      allowances: {
        targetOnlyExpectedSectionIds: true,
      },
    },
  ],
};

describe("parseVisualRegressionConfiguration", () => {
  it("accepts a complete serialisable repository comparison policy", () => {
    expect(parseVisualRegressionConfiguration(completeConfiguration)).toEqual(
      completeConfiguration
    );
  });

  it.each([
    ["missing configuration", undefined, "Invalid visual regression configuration"],
    [
      "non-absolute route path",
      {
        routes: [
          {
            ...completeConfiguration.routes[0],
            path: "example",
          },
        ],
      },
      "Invalid visual regression configuration",
    ],
    [
      "duplicate route keys",
      {
        routes: [
          completeConfiguration.routes[0],
          { ...completeConfiguration.routes[0], path: "/another-example" },
        ],
      },
      "Duplicate route key: example",
    ],
    [
      "duplicate route paths",
      {
        routes: [
          completeConfiguration.routes[0],
          { ...completeConfiguration.routes[0], key: "another-example" },
        ],
      },
      "Duplicate route path: /example",
    ],
    [
      "duplicate region keys",
      {
        routes: [
          {
            ...completeConfiguration.routes[0],
            regions: [
              completeConfiguration.routes[0].regions[0],
              completeConfiguration.routes[0].regions[0],
            ],
          },
        ],
      },
      "Duplicate region key: content",
    ],
    [
      "route key that escapes its artefact directory",
      {
        routes: [
          {
            ...completeConfiguration.routes[0],
            key: "../../escaped",
          },
        ],
      },
      "Invalid visual regression configuration",
    ],
    [
      "region key that escapes its artefact directory",
      {
        routes: [
          {
            ...completeConfiguration.routes[0],
            regions: [{ key: "../../artifact", selector: "main" }],
          },
        ],
      },
      "Invalid visual regression configuration",
    ],
    [
      "region key that collides with a core artefact",
      {
        routes: [
          {
            ...completeConfiguration.routes[0],
            regions: [{ key: "document", selector: "main" }],
          },
        ],
      },
      "Must not collide with a core route artefact",
    ],
    [
      "network-path route",
      {
        routes: [
          {
            ...completeConfiguration.routes[0],
            path: "//example.com/",
          },
        ],
      },
      "Must be a same-origin absolute path",
    ],
    [
      "route with a parent path segment",
      {
        routes: [
          {
            ...completeConfiguration.routes[0],
            path: "/example/../escaped",
          },
        ],
      },
      "Must not contain dot path segments",
    ],
  ])("rejects %s", (_caseName, configuration, expectedDiagnostic) => {
    expect(() => parseVisualRegressionConfiguration(configuration)).toThrow(expectedDiagnostic);
  });
});
