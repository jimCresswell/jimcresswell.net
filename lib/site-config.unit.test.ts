import { describe, it, expect } from "vitest";
import { getSiteUrl } from "./site-config.js";

describe("getSiteUrl", () => {
  it("uses production domain on production deployments", () => {
    expect(
      getSiteUrl("production", "www.jimcresswell.net", "jimcresswell-abc123-engraph.vercel.app")
    ).toBe("https://www.jimcresswell.net");
  });

  it("uses deployment URL on preview deployments", () => {
    expect(
      getSiteUrl("preview", "www.jimcresswell.net", "jimcresswell-abc123-engraph.vercel.app")
    ).toBe("https://jimcresswell-abc123-engraph.vercel.app");
  });

  it("falls back to localhost when no Vercel env vars are set", () => {
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("uses custom port for localhost", () => {
    expect(getSiteUrl(undefined, undefined, undefined, "4000")).toBe("http://localhost:4000");
  });
});
