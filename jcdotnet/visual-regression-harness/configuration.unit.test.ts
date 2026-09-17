import { describe, expect, it } from "vitest";
import { parseVisualRegressionConfiguration } from "./configuration";

const contentRegion = { key: "content", selector: "main" };

const exampleRoute = {
  key: "example",
  path: "/example",
  regions: [contentRegion],
  expectedSectionIds: ["summary"],
  allowances: {
    targetOnlyExpectedSectionIds: true,
  },
};

const completeConfiguration = {
  routes: [exampleRoute],
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
            ...exampleRoute,
            path: "example",
          },
        ],
      },
      "Invalid visual regression configuration",
    ],
    [
      "duplicate route keys",
      {
        routes: [exampleRoute, { ...exampleRoute, path: "/another-example" }],
      },
      "Duplicate route key: example",
    ],
    [
      "duplicate route paths",
      {
        routes: [exampleRoute, { ...exampleRoute, key: "another-example" }],
      },
      "Duplicate route path: /example",
    ],
    [
      "duplicate region keys",
      {
        routes: [
          {
            ...exampleRoute,
            regions: [contentRegion, contentRegion],
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
            ...exampleRoute,
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
            ...exampleRoute,
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
            ...exampleRoute,
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
            ...exampleRoute,
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
            ...exampleRoute,
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
