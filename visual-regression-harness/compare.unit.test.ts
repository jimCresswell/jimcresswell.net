import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { PNG } from "pngjs";
import { z } from "zod";
import { compareArtifactSets } from "./compare";
import { getRouteArtifactPaths, regressionRoutes } from "./shared";

const temporaryDirectories: string[] = [];
const SummarySchema = z.object({
  requiresReview: z.boolean(),
  unexpectedDifferences: z.array(z.record(z.string(), z.unknown())),
  artifacts: z.array(z.record(z.string(), z.unknown())),
});

describe("compareArtifactSets", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map((directoryPath) => fs.rm(directoryPath, { recursive: true, force: true }))
    );
  });

  it("records no review items when document.html differs only by build-specific runtime noise", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory, {
      "home/document.html": buildDocumentHtml({
        assetId: "a11ce5",
        mainHtml: "<main><h1>Home</h1></main>",
      }),
    });
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "home/document.html": buildDocumentHtml({
        assetId: "b22df9",
        mainHtml: "<main><h1>Home</h1></main>",
      }),
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(false);
    expect(comparison.unexpectedDifferences).toEqual([]);

    const summary = await readSummary(harnessDirectories.outputDirectory);
    expect(summary.requiresReview).toBe(false);
    expect(summary.unexpectedDifferences).toEqual([]);
    expect(summary.artifacts).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "document.html",
        status: "match",
        normalisationNotes: expect.arrayContaining([
          expect.objectContaining({ code: "document-next-assets" }),
          expect.objectContaining({ code: "document-next-flight" }),
          expect.objectContaining({ code: "document-root-font-class" }),
        ]),
      })
    );
  });

  it("records only the document.html normalisation notes that actually applied", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory, {
      "home/document.html":
        '<!DOCTYPE html><html class="inter_a11ce5-module__font__variable light"><head></head><body><main><h1>Home</h1></main></body></html>',
    });
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "home/document.html":
        '<!DOCTYPE html><html class="inter_b22df9-module__font__variable light"><head></head><body><main><h1>Home</h1></main></body></html>',
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(false);

    const summary = await readSummary(harnessDirectories.outputDirectory);
    expect(summary.artifacts).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "document.html",
        status: "match",
        normalisationNotes: [expect.objectContaining({ code: "document-root-font-class" })],
      })
    );
  });

  it("still records a review item when document.html has a semantic DOM change after normalisation", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory);
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "home/document.html": buildDocumentHtml({
        assetId: "b22df9",
        mainHtml:
          '<main><h1>Home</h1><script type="application/ld+json">{"@graph":[]}</script></main>',
      }),
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(true);
    expect(comparison.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "document.html",
        type: "html",
      })
    );

    expect(
      await fileExists(
        path.join(harnessDirectories.outputDirectory, "home", "document.html.diff.txt")
      )
    ).toBe(true);
  });

  it("writes screenshot diff and review artefacts even when the screenshots are identical", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory);
    await writeArtifactSet(harnessDirectories.targetDirectory);

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(false);

    expect(
      await fileExists(path.join(harnessDirectories.outputDirectory, "home", "full-page.png"))
    ).toBe(true);
    expect(
      await fileExists(
        path.join(harnessDirectories.outputDirectory, "home", "full-page.review.png")
      )
    ).toBe(true);

    const summary = await readSummary(harnessDirectories.outputDirectory);
    expect(summary.artifacts).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "full-page.png",
        status: "match",
        diffPath: "home/full-page.png",
        reviewPath: "home/full-page.review.png",
        detail: "0 differing pixels",
      })
    );
  });

  it("records semantic DOM and pixel differences while preserving review artefacts", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory);
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "home/main.html":
        '<main><h1>Home</h1><script type="application/ld+json">{"@graph":[]}</script></main>',
      "home/full-page.png": createPngBuffer({
        width: 2,
        height: 2,
        changedPixels: [[0, 0]],
      }),
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(true);
    expect(comparison.unexpectedDifferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          route: "home",
          artifact: "main.html",
          type: "html",
        }),
        expect.objectContaining({
          route: "home",
          artifact: "full-page.png",
          type: "png",
        }),
      ])
    );

    expect(
      await fileExists(path.join(harnessDirectories.outputDirectory, "home", "full-page.png"))
    ).toBe(true);
    expect(
      await fileExists(
        path.join(harnessDirectories.outputDirectory, "home", "full-page.review.png")
      )
    ).toBe(true);
    expect(
      await fileExists(path.join(harnessDirectories.outputDirectory, "home", "main.html.diff.txt"))
    ).toBe(true);

    const summary = await readSummary(harnessDirectories.outputDirectory);
    expect(summary.unexpectedDifferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          route: "home",
          artifact: "main.html",
          type: "html",
        }),
        expect.objectContaining({
          route: "home",
          artifact: "full-page.png",
          type: "png",
        }),
      ])
    );
  });

  it("records semantic main.html changes even when screenshots remain identical", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory);
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "home/main.html":
        '<main><h1>Home</h1><script type="application/ld+json">{"@graph":[]}</script></main>',
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(true);
    expect(comparison.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "main.html",
        type: "html",
      })
    );

    const summary = await readSummary(harnessDirectories.outputDirectory);
    expect(summary.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "main.html",
        type: "html",
      })
    );
  });

  it("records metadata changes as json review items rather than html differences", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory);
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "home/metadata.json": `${JSON.stringify({ route: "home", title: "Changed" }, null, 2)}\n`,
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(true);
    expect(comparison.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "metadata.json",
        type: "json",
      })
    );

    const summary = await readSummary(harnessDirectories.outputDirectory);
    expect(summary.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "metadata.json",
        type: "json",
      })
    );
    expect(summary.artifacts).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "metadata.json",
        type: "json",
        status: "unexpected_difference",
      })
    );
  });

  it("auto-accepts expected section id additions on CV HTML artifacts", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory, {
      "cv/positioning.html":
        '<section aria-labelledby="positioning-heading"><h2 id="positioning-heading">Positioning</h2><p>Base</p></section>',
      "cv/main.html":
        '<main><section aria-labelledby="positioning-heading"><h2 id="positioning-heading">Positioning</h2><p>Base</p></section><section aria-labelledby="capabilities-heading"><h2 id="capabilities-heading">Capabilities</h2></section></main>',
    });
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "cv/positioning.html":
        '<section id="positioning" aria-labelledby="positioning-heading"><h2 id="positioning-heading">Positioning</h2><p>Base</p></section>',
      "cv/main.html":
        '<main><section id="positioning" aria-labelledby="positioning-heading"><h2 id="positioning-heading">Positioning</h2><p>Base</p></section><section id="capabilities" aria-labelledby="capabilities-heading"><h2 id="capabilities-heading">Capabilities</h2></section></main>',
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(false);
    expect(comparison.unexpectedDifferences).toEqual([]);

    const summary = await readSummary(harnessDirectories.outputDirectory);
    expect(summary.artifacts).toContainEqual(
      expect.objectContaining({
        route: "cv",
        artifact: "positioning.html",
        status: "match",
        normalisationNotes: [expect.objectContaining({ code: "expected-section-id" })],
      })
    );
    expect(summary.artifacts).toContainEqual(
      expect.objectContaining({
        route: "cv",
        artifact: "main.html",
        status: "match",
        normalisationNotes: [expect.objectContaining({ code: "expected-section-id" })],
      })
    );
  });

  it("keeps unexpected section id changes as review items", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory, {
      "cv/positioning.html":
        '<section aria-labelledby="positioning-heading"><h2 id="positioning-heading">Positioning</h2><p>Base</p></section>',
    });
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "cv/positioning.html":
        '<section id="unexpected-positioning" aria-labelledby="positioning-heading"><h2 id="positioning-heading">Positioning</h2><p>Base</p></section>',
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(true);
    expect(comparison.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "cv",
        artifact: "positioning.html",
        type: "html",
      })
    );
  });

  it("records a review item when an expected artefact is missing", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory);
    await writeArtifactSet(harnessDirectories.targetDirectory);
    await fs.rm(path.join(harnessDirectories.targetDirectory, "home", "site-footer.html"), {
      force: true,
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(true);
    expect(comparison.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "site-footer.html",
        type: "missing",
      })
    );

    const summary = await readSummary(harnessDirectories.outputDirectory);
    expect(summary.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "site-footer.html",
        type: "missing",
      })
    );
  });

  it("records screenshot dimension mismatches and writes a dimension note", async () => {
    const harnessDirectories = await createHarnessDirectories();

    await writeArtifactSet(harnessDirectories.baselineDirectory);
    await writeArtifactSet(harnessDirectories.targetDirectory, {
      "home/full-page.png": createPngBuffer({ width: 3, height: 2 }),
    });

    const comparison = await compareArtifactSets(harnessDirectories);
    expect(comparison.requiresReview).toBe(true);
    expect(comparison.unexpectedDifferences).toContainEqual(
      expect.objectContaining({
        route: "home",
        artifact: "full-page.png",
        type: "png",
        detail: "Image dimensions differ",
      })
    );

    expect(
      await fileExists(path.join(harnessDirectories.outputDirectory, "home", "full-page.png"))
    ).toBe(true);
    expect(
      await fileExists(
        path.join(harnessDirectories.outputDirectory, "home", "full-page.review.png")
      )
    ).toBe(true);
    expect(
      await fileExists(
        path.join(harnessDirectories.outputDirectory, "home", "full-page.png.diff.txt")
      )
    ).toBe(true);
  });
});

async function createHarnessDirectories(): Promise<{
  baselineDirectory: string;
  targetDirectory: string;
  outputDirectory: string;
}> {
  const rootDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "visual-regression-compare-test-"));
  const baselineDirectory = path.join(rootDirectory, "baseline");
  const targetDirectory = path.join(rootDirectory, "target");
  const outputDirectory = path.join(rootDirectory, "diff");

  await fs.mkdir(baselineDirectory, { recursive: true });
  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.mkdir(outputDirectory, { recursive: true });

  temporaryDirectories.push(rootDirectory);

  return {
    baselineDirectory,
    targetDirectory,
    outputDirectory,
  };
}

async function writeArtifactSet(
  rootDirectory: string,
  overrides: Record<string, string | Uint8Array> = {}
): Promise<void> {
  for (const route of regressionRoutes) {
    for (const artifactPath of getRouteArtifactPaths(route)) {
      const relativePath = path.join(route.key, artifactPath);
      const fullPath = path.join(rootDirectory, relativePath);
      const override = overrides[relativePath];
      const contents = override ?? getDefaultArtifactContents(route.key, artifactPath);

      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, contents);
    }
  }
}

function getDefaultArtifactContents(routeKey: string, artifactPath: string): string | Uint8Array {
  if (artifactPath.endsWith(".png")) {
    return createPngBuffer({ width: 2, height: 2 });
  }

  if (artifactPath === "document.html") {
    return buildDocumentHtml({
      assetId: routeKey,
      mainHtml: `<main><h1>${routeKey}</h1></main>`,
    });
  }

  if (artifactPath === "main.html") {
    return `<main><h1>${routeKey}</h1></main>`;
  }

  if (artifactPath === "metadata.json") {
    return `${JSON.stringify({ route: routeKey }, null, 2)}\n`;
  }

  return `<section data-artifact="${artifactPath}">${routeKey}</section>`;
}

function buildDocumentHtml(options: { assetId: string; mainHtml: string }): string {
  return `<!DOCTYPE html><html class="inter_${options.assetId}-module__font__variable light"><head><link rel="stylesheet" href="/_next/static/chunks/${options.assetId}.css"><script src="/_next/static/chunks/${options.assetId}.js"></script></head><body>${options.mainHtml}<script>self.__next_f.push([1,"${options.assetId}"])</script><next-route-announcer style="position: absolute;"></next-route-announcer></body></html>`;
}

function createPngBuffer(options: {
  width: number;
  height: number;
  changedPixels?: Array<readonly [number, number]>;
}): Buffer {
  const png = new PNG({ width: options.width, height: options.height });
  png.data.fill(255);

  for (const [x, y] of options.changedPixels ?? []) {
    const offset = (png.width * y + x) << 2;
    png.data[offset] = 0;
    png.data[offset + 1] = 0;
    png.data[offset + 2] = 0;
    png.data[offset + 3] = 255;
  }

  return PNG.sync.write(png);
}

async function readSummary(outputDirectory: string): Promise<{
  requiresReview: boolean;
  unexpectedDifferences: Array<Record<string, unknown>>;
  artifacts: Array<Record<string, unknown>>;
}> {
  return SummarySchema.parse(
    JSON.parse(await fs.readFile(path.join(outputDirectory, "summary.json"), "utf8"))
  );
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
