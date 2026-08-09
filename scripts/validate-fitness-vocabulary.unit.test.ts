import { describe, expect, it } from "vitest";
import {
  extractFrontmatterSection,
  extractFrontmatterKeys,
  findInvalidFitnessKeys,
} from "./validate-fitness-vocabulary.mjs";

describe("validate-fitness-vocabulary helpers", () => {
  it("reads keys declared in frontmatter", () => {
    const content = "---\nfitness_line_target: 100\nfoo: bar\n---\nbody";
    const section = extractFrontmatterSection(content);
    const keys = extractFrontmatterKeys(section);

    expect(keys).toContain("fitness_line_target");
    expect(keys).toContain("foo");
  });

  it("flags fitness keys outside the canonical vocabulary", () => {
    const keys = ["fitness_line_target", "fitness_line_bonus", "fitness_line_limit"];
    const invalid = findInvalidFitnessKeys(keys);

    expect(invalid).toEqual(["fitness_line_bonus"]);
  });
});
