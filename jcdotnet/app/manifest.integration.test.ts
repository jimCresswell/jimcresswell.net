import { describe, expect, it } from "vitest";
import { person } from "@/lib/entities";
import manifest from "./manifest";

describe("manifest route", () => {
  it("keeps Track A-owned identity fields aligned with the person entity", () => {
    const result = manifest();

    expect(result.name).toBe(person.name);
    expect(result.short_name).toBe(person.name);
    expect(result.description).toBe(person.description);
  });
});
