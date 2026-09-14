import { describe, it, expect } from "vitest";
import { acceptMdConfigFor } from "./accept-md-config.js";

describe("acceptMdConfigFor", () => {
  it("self-fetches through the internal Vercel URL when one is set", () => {
    expect(acceptMdConfigFor("jimcresswell-abc123-engraph.vercel.app").baseUrl).toBe(
      "https://jimcresswell-abc123-engraph.vercel.app"
    );
  });

  it("leaves baseUrl unset locally so the route falls back to the request origin", () => {
    expect(acceptMdConfigFor(undefined).baseUrl).toBeUndefined();
  });

  it("excludes the API and Next internals from markdown negotiation", () => {
    const config = acceptMdConfigFor(undefined);
    expect(config.exclude).toEqual(["/api/**", "/_next/**"]);
    expect(config.include).toEqual(["/**"]);
    expect(config.cache).toBe(true);
  });
});
