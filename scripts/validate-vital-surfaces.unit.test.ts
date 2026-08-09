import { describe, expect, it } from "vitest";
import { extractPathsFromCell, collectMatrixPaths } from "./validate-vital-surfaces-helpers.mjs";

describe("validate-vital-surfaces helpers", () => {
  it("extracts base paths from table cells", () => {
    const cell = ".cursor/skills/ → .agent/directives/AGENT.md";
    const wildcardCell = ".agents/skills/jc-*/";

    const extracted = extractPathsFromCell(cell);
    expect(extracted).toEqual(
      expect.arrayContaining([".cursor/skills", ".agent/directives/AGENT.md"])
    );

    const wildcardPaths = extractPathsFromCell(wildcardCell);
    expect(wildcardPaths).toEqual([".agents/skills"]);
  });

  it("collects unique paths from matrix tables", () => {
    const sample = `
| Surface | Cursor | GitHub Copilot |
| --- | --- | --- |
| **Skills** | .cursor/skills/ | unsupported |
| **Commands** | .cursor/commands/ | unsupported |

| Platform | Entry File | Notes |
| --- | --- | --- |
| Cursor | .agent/directives/AGENT.md | canonical entry |
| GitHub Copilot | .github/copilot-instructions.md → .agent/directives/AGENT.md | entry-point chain |
`;

    const collected = collectMatrixPaths(sample);
    const paths = collected.map((entry) => entry.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        ".cursor/skills",
        ".cursor/commands",
        ".agent/directives/AGENT.md",
        ".github/copilot-instructions.md",
      ])
    );
  });

  it("ignores descriptive prose in non-path columns", () => {
    const extracted = extractPathsFromCell("Protects owner-edited Practice surfaces");

    expect(extracted).toEqual([]);
  });
});
