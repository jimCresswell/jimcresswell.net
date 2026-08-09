import { describe, expect, it } from "vitest";
import {
  evaluateFitnessFile,
  extractFrontmatter,
  getFrontmatterNumber,
  shouldInspectFitnessPath,
} from "./validate-practice-fitness-helpers.mjs";

describe("validate-practice-fitness helpers", () => {
  it("skips archived and inbound markdown paths", () => {
    expect(shouldInspectFitnessPath(".agent/practice-context/incoming/note.md")).toBe(false);
    expect(shouldInspectFitnessPath(".agent/plans/archive/old.plan.md")).toBe(false);
    expect(shouldInspectFitnessPath(".agent/directives/AGENT.md")).toBe(true);
  });

  it("reads numeric fitness frontmatter values", () => {
    const content = "---\nfitness_line_target: 10\nfitness_line_limit: 20\n---\nbody";
    const frontmatter = extractFrontmatter(content);

    expect(getFrontmatterNumber(frontmatter, "fitness_line_target")).toBe(10);
    expect(getFrontmatterNumber(frontmatter, "fitness_line_limit")).toBe(20);
    expect(getFrontmatterNumber(frontmatter, "missing_key")).toBeNull();
  });

  it("warns above target and fails above hard limits", () => {
    const warningContent = `---\nfitness_line_target: 2\nfitness_line_limit: 5\nfitness_char_limit: 200\nfitness_line_length: 40\n---\nLine one\nLine two\nLine three`;
    const warningResult = evaluateFitnessFile("doc.md", warningContent);

    expect(warningResult.warnings).toContain("Lines: 3 exceeds target 2 (limit 5)");
    expect(warningResult.violations).toEqual([]);

    const violationContent = `---\nfitness_line_target: 2\nfitness_line_limit: 4\nfitness_char_limit: 20\nfitness_line_length: 10\n---\nThis line is intentionally much too long`;
    const violationResult = evaluateFitnessFile("doc.md", violationContent);

    expect(violationResult.violations.some((message) => message.includes("Characters:"))).toBe(
      true
    );
    expect(
      violationResult.violations.some((message) => message.includes("Prose line width:"))
    ).toBe(true);
  });
});
