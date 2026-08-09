import { describe, expect, it } from "vitest";
import {
  extractFrontmatter,
  getFrontmatterValue,
  parseCodexRegistrations,
} from "./validate-portability-helpers.mjs";

describe("validate-portability helpers", () => {
  it("extracts frontmatter and reads key values", () => {
    const content = "---\nname: start-right\ndescription: example\n---\nbody";
    const frontmatter = extractFrontmatter(content);

    expect(frontmatter).toContain("name: start-right");
    expect(getFrontmatterValue(frontmatter, "name")).toBe("start-right");
    expect(getFrontmatterValue(frontmatter, "description")).toBe("example");
  });

  it("parses Codex registrations with quoted and bare agent names", () => {
    const config = `
[agents."code-reviewer"]
config_file = ".codex/agents/code-reviewer.toml"

[agents.editor]
config_file = ".codex/agents/editor.toml"
`;

    const registrations = parseCodexRegistrations(config);

    expect(registrations.get("code-reviewer")).toBe(".codex/agents/code-reviewer.toml");
    expect(registrations.get("editor")).toBe(".codex/agents/editor.toml");
  });
});
