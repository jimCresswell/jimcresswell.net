import { describe, expect, it } from "vitest";
import { buildSubagentWrapperDescriptors } from "./validate-subagents-helpers.mjs";

describe("validate-subagents helpers", () => {
  it("emits the required wrapper descriptors", () => {
    const descriptors = buildSubagentWrapperDescriptors("code-reviewer");

    expect(descriptors).toHaveLength(3);
    expect(descriptors.map((descriptor) => descriptor.relPath)).toEqual([
      ".cursor/agents/code-reviewer.md",
      ".claude/agents/code-reviewer.md",
      ".github/agents/code-reviewer.md",
    ]);
    expect(
      descriptors.every((descriptor) =>
        descriptor.pointer.includes(".agent/sub-agents/templates/code-reviewer.md")
      )
    ).toBe(true);
    expect(descriptors.every((descriptor) => descriptor.frontmatterName === "code-reviewer")).toBe(
      true
    );
  });
});
