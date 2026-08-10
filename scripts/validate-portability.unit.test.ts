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

  it("parses Codex registration headers with trailing comments", () => {
    const config = `
[agents."code-reviewer"] # canonical gateway
config_file = ".codex/agents/code-reviewer.toml"

[agents.editor] # editorial specialist
config_file = ".codex/agents/editor.toml"
`;

    const registrations = parseCodexRegistrations(config);

    expect(registrations.get("code-reviewer")).toBe(".codex/agents/code-reviewer.toml");
    expect(registrations.get("editor")).toBe(".codex/agents/editor.toml");
  });

  it("parses Codex config_file assignments with trailing comments", () => {
    const config = `
[agents.editor]
config_file = ".codex/agents/editor.toml" # canonical adapter
`;

    const registrations = parseCodexRegistrations(config);

    expect(registrations.get("editor")).toBe(".codex/agents/editor.toml");
  });

  it("returns only reviewer tables when agents also contains scalar settings", () => {
    const issues: string[] = [];
    const config = `
[agents]
max_threads = 4

[agents.editor]
config_file = ".codex/agents/editor.toml"
`;

    const registrations = parseCodexRegistrations(config, (issue) => issues.push(issue));

    expect([...registrations]).toEqual([["editor", ".codex/agents/editor.toml"]]);
    expect(issues).toEqual([]);
  });

  it("accepts scalar arrays inside reviewer registrations", () => {
    const issues: string[] = [];
    const config = `
[agents.editor]
nickname_candidates = ["gateway"]
config_file = ".codex/agents/editor.toml"
`;

    const registrations = parseCodexRegistrations(config, (issue) => issues.push(issue));

    expect(registrations.get("editor")).toBe(".codex/agents/editor.toml");
    expect(issues).toEqual([]);
  });

  it("does not attribute nested config_file values to a parent registration", () => {
    const issues: string[] = [];
    const config = `
[agents.editor]
[agents.editor.metadata]
config_file = ".codex/agents/editor.toml"
`;

    const registrations = parseCodexRegistrations(config, (issue) => issues.push(issue));

    expect(registrations.get("editor")).toBe("");
    expect(issues).toEqual(['unsupported nested Codex agent registration "editor"']);
  });

  it("rejects nested reviewer tables inside arrays", () => {
    const issues: string[] = [];
    const config = `
[agents.editor]
config_file = ".codex/agents/editor.toml"

[[agents.editor.metadata]]
label = "gateway"
`;

    const registrations = parseCodexRegistrations(config, (issue) => issues.push(issue));

    expect(registrations.get("editor")).toBe(".codex/agents/editor.toml");
    expect(issues).toEqual(['unsupported nested Codex agent registration "editor"']);
  });

  it("ends registration scope when another TOML table begins", () => {
    const config = `
[agents.editor]
[features]
config_file = ".codex/agents/editor.toml"
`;

    const registrations = parseCodexRegistrations(config);

    expect(registrations.get("editor")).toBe("");
  });

  it.each([
    ["spaced table header", `[ agents.editor ]\nconfig_file = ".codex/agents/editor.toml"\n`],
    ["dotted key", `agents.editor.config_file = ".codex/agents/editor.toml"\n`],
  ])("parses a registration expressed with a %s", (_case, config) => {
    const registrations = parseCodexRegistrations(config);

    expect(registrations.get("editor")).toBe(".codex/agents/editor.toml");
  });
});
