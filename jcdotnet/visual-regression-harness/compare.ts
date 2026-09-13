import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import {
  normaliseExpectedSectionIdAdditionsForComparison,
  normaliseTextArtifactForComparison,
  type ComparisonNote,
} from "./comparison-config";
import { ensureDirectory, getRouteArtifactPaths } from "./shared";
import type { RegressionRoute } from "./configuration";

type ComparedArtifactType = "html" | "json" | "png" | "missing";

interface UnexpectedDifference {
  type: ComparedArtifactType;
  route: string;
  artifact: string;
  detail: string;
}

/**
 * Durable comparison result returned by the harness.
 *
 * `requiresReview` means at least one unexpected difference was recorded and
 * needs explicit human approval or rejection.
 */
export interface ComparisonSummary {
  requiresReview: boolean;
  unexpectedDifferences: UnexpectedDifference[];
  artifacts: ComparisonArtifactSummary[];
}

interface ComparisonArtifactSummary {
  type: ComparedArtifactType;
  route: string;
  artifact: string;
  status: "match" | "unexpected_difference";
  detail: string;
  diffPath?: string;
  reviewPath?: string;
  differingPixels?: number;
  normalisationNotes?: ComparisonNote[];
}

/**
 * Compare two captured artifact sets and record any unexpected differences for
 * human review.
 *
 * This harness is intentionally strict about what counts as a difference, but
 * it is not a quality gate. Differences are durable review artefacts to accept
 * or reject explicitly, not an automatic check failure.
 *
 * @param options Comparison configuration.
 */
export async function compareArtifactSets(options: {
  baselineDirectory: string;
  targetDirectory: string;
  outputDirectory: string;
  routes: readonly RegressionRoute[];
}): Promise<ComparisonSummary> {
  await ensureDirectory(options.outputDirectory);

  const unexpectedDifferences: UnexpectedDifference[] = [];
  const artifactSummaries: ComparisonArtifactSummary[] = [];

  for (const route of options.routes) {
    for (const artifactPath of getRouteArtifactPaths(route)) {
      const baselinePath = path.join(options.baselineDirectory, route.key, artifactPath);
      const targetPath = path.join(options.targetDirectory, route.key, artifactPath);
      const outputPath = path.join(options.outputDirectory, route.key, artifactPath);
      const artifactType = classifyArtifactType(artifactPath);

      const bothExist = await artifactsExist(baselinePath, targetPath);
      if (!bothExist) {
        unexpectedDifferences.push({
          type: "missing",
          route: route.key,
          artifact: artifactPath,
          detail: "One or both artifacts are missing",
        });
        artifactSummaries.push({
          type: "missing",
          route: route.key,
          artifact: artifactPath,
          status: "unexpected_difference",
          detail: "One or both artifacts are missing",
        });
        continue;
      }

      if (artifactType === "png") {
        const pngComparison = await comparePngArtifacts(
          baselinePath,
          targetPath,
          outputPath,
          options.outputDirectory
        );
        const hasPngDifference = pngComparison.differingPixels !== 0;
        if (hasPngDifference) {
          unexpectedDifferences.push({
            type: "png",
            route: route.key,
            artifact: artifactPath,
            detail:
              pngComparison.differingPixels === Number.POSITIVE_INFINITY
                ? "Image dimensions differ"
                : `${pngComparison.differingPixels} differing pixels`,
          });
        }

        artifactSummaries.push({
          type: "png",
          route: route.key,
          artifact: artifactPath,
          status: hasPngDifference ? "unexpected_difference" : "match",
          detail:
            pngComparison.differingPixels === Number.POSITIVE_INFINITY
              ? "Image dimensions differ"
              : `${pngComparison.differingPixels} differing pixels`,
          diffPath: pngComparison.diffPath,
          reviewPath: pngComparison.reviewPath,
          differingPixels:
            pngComparison.differingPixels === Number.POSITIVE_INFINITY
              ? undefined
              : pngComparison.differingPixels,
        });
        continue;
      }

      const textComparison = await compareTextArtifacts(
        route,
        artifactPath,
        baselinePath,
        targetPath,
        outputPath,
        options.outputDirectory
      );
      if (!textComparison.matches) {
        unexpectedDifferences.push({
          type: artifactType,
          route: route.key,
          artifact: artifactPath,
          detail: "Text artifacts differ",
        });
      }

      artifactSummaries.push({
        type: artifactType,
        route: route.key,
        artifact: artifactPath,
        status: textComparison.matches ? "match" : "unexpected_difference",
        detail: textComparison.matches ? "Text artifacts match" : "Text artifacts differ",
        diffPath: textComparison.diffPath,
        normalisationNotes: textComparison.normalisationNotes,
      });
    }
  }

  const summaryPath = path.join(options.outputDirectory, "summary.json");
  const summary = {
    requiresReview: unexpectedDifferences.length > 0,
    unexpectedDifferences,
    artifacts: artifactSummaries,
  } satisfies ComparisonSummary;
  await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

  return summary;
}

function classifyArtifactType(artifactPath: string): ComparedArtifactType {
  if (artifactPath.endsWith(".png")) {
    return "png";
  }

  if (artifactPath.endsWith(".json")) {
    return "json";
  }

  return "html";
}

async function artifactsExist(baselinePath: string, targetPath: string): Promise<boolean> {
  const baselineExists = await fileExists(baselinePath);
  const targetExists = await fileExists(targetPath);
  return baselineExists && targetExists;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function compareTextArtifacts(
  route: RegressionRoute,
  artifactPath: string,
  baselinePath: string,
  targetPath: string,
  outputPath: string,
  outputRoot: string
): Promise<{
  matches: boolean;
  diffPath?: string;
  normalisationNotes: ComparisonNote[];
}> {
  const baselineContents = normaliseTextArtifactForComparison({
    artifactPath,
    contents: await fs.readFile(baselinePath, "utf8"),
  });
  const individuallyNormalisedTargetContents = normaliseTextArtifactForComparison({
    artifactPath,
    contents: await fs.readFile(targetPath, "utf8"),
  });
  const targetContents = normaliseExpectedSectionIdAdditionsForComparison({
    route,
    artifactPath,
    baselineContents: baselineContents.contents,
    targetContents: individuallyNormalisedTargetContents.contents,
  });
  const normalisationNotes = mergeComparisonNotes([
    ...baselineContents.notes,
    ...individuallyNormalisedTargetContents.notes,
    ...targetContents.notes,
  ]);

  if (baselineContents.contents === targetContents.targetContents) {
    return {
      matches: true,
      normalisationNotes,
    };
  }

  const diffPath = `${outputPath}.diff.txt`;
  const diffSummary = createDiffSummary(
    route.key,
    artifactPath,
    baselineContents.contents,
    targetContents.targetContents,
    normalisationNotes
  );
  await ensureDirectory(path.dirname(outputPath));
  await fs.writeFile(diffPath, diffSummary, "utf8");

  return {
    matches: false,
    diffPath: toRelativeArtifactPath(outputRoot, diffPath),
    normalisationNotes,
  };
}

async function comparePngArtifacts(
  baselinePath: string,
  targetPath: string,
  outputPath: string,
  outputRoot: string
): Promise<{
  differingPixels: number;
  diffPath: string;
  reviewPath: string;
}> {
  const baselinePng = PNG.sync.read(await fs.readFile(baselinePath));
  const targetPng = PNG.sync.read(await fs.readFile(targetPath));
  const diffPng = buildDiffPngPath(outputPath);
  const reviewPng = buildReviewPngPath(outputPath);

  await ensureDirectory(path.dirname(outputPath));

  if (baselinePng.width !== targetPng.width || baselinePng.height !== targetPng.height) {
    const reviewDiff = createBlankPng(
      Math.max(baselinePng.width, targetPng.width),
      Math.max(baselinePng.height, targetPng.height)
    );
    await fs.writeFile(diffPng, PNG.sync.write(reviewDiff));
    await fs.writeFile(
      reviewPng,
      PNG.sync.write(createReviewStripPng(baselinePng, reviewDiff, targetPng))
    );
    await ensureDirectory(path.dirname(outputPath));
    await fs.writeFile(
      `${outputPath}.diff.txt`,
      `Dimension mismatch: baseline=${baselinePng.width}x${baselinePng.height}, target=${targetPng.width}x${targetPng.height}\n`,
      "utf8"
    );
    return {
      differingPixels: Number.POSITIVE_INFINITY,
      diffPath: toRelativeArtifactPath(outputRoot, diffPng),
      reviewPath: toRelativeArtifactPath(outputRoot, reviewPng),
    };
  }

  const baselineComparedPng = clonePng(baselinePng);
  const targetComparedPng = clonePng(targetPng);

  const diff = createBlankPng(baselinePng.width, baselinePng.height);
  const differingPixels = pixelmatch(
    baselineComparedPng.data,
    targetComparedPng.data,
    diff.data,
    baselinePng.width,
    baselinePng.height,
    { threshold: 0 }
  );

  await fs.writeFile(diffPng, PNG.sync.write(diff));
  await fs.writeFile(reviewPng, PNG.sync.write(createReviewStripPng(baselinePng, diff, targetPng)));

  return {
    differingPixels,
    diffPath: toRelativeArtifactPath(outputRoot, diffPng),
    reviewPath: toRelativeArtifactPath(outputRoot, reviewPng),
  };
}

function createDiffSummary(
  routeKey: string,
  artifactPath: string,
  baselineContents: string,
  targetContents: string,
  normalisationNotes: readonly ComparisonNote[]
): string {
  const baselineLines = baselineContents.split("\n");
  const targetLines = targetContents.split("\n");
  const maxLineCount = Math.max(baselineLines.length, targetLines.length);
  const diffLines = [`Route: ${routeKey}`, `Artifact: ${artifactPath}`];

  if (normalisationNotes.length > 0) {
    diffLines.push("", "Normalisation:");
    for (const note of normalisationNotes) {
      diffLines.push(`- ${note.description}`);
    }
  }

  diffLines.push("");

  let differencesRecorded = 0;

  for (let index = 0; index < maxLineCount; index++) {
    const baselineLine = baselineLines[index] ?? "";
    const targetLine = targetLines[index] ?? "";

    if (baselineLine === targetLine) {
      continue;
    }

    diffLines.push(`Line ${index + 1}`);
    diffLines.push(`- ${baselineLine}`);
    diffLines.push(`+ ${targetLine}`);
    diffLines.push("");

    differencesRecorded += 1;
    if (differencesRecorded === 25) {
      diffLines.push("Further differences omitted.");
      break;
    }
  }

  return `${diffLines.join("\n")}\n`;
}

function mergeComparisonNotes(notes: readonly ComparisonNote[]): ComparisonNote[] {
  const mergedNotes = new Map<string, ComparisonNote>();
  for (const note of notes) {
    mergedNotes.set(note.code, note);
  }

  return [...mergedNotes.values()];
}

/** Clone a PNG so comparison work never mutates the captured source artifact. */
function clonePng(source: PNG): PNG {
  return PNG.sync.read(PNG.sync.write(source));
}

/** Create a solid white PNG canvas for diff and review output. */
function createBlankPng(width: number, height: number): PNG {
  const png = new PNG({ width, height });
  png.data.fill(255);
  return png;
}

/** Combine baseline, diff, and target screenshots into a single review strip. */
function createReviewStripPng(baselinePng: PNG, diffPng: PNG, targetPng: PNG): PNG {
  const separatorWidth = 16;
  const reviewPng = createBlankPng(
    baselinePng.width + diffPng.width + targetPng.width + separatorWidth * 2,
    Math.max(baselinePng.height, diffPng.height, targetPng.height)
  );

  copyPngInto(reviewPng, baselinePng, 0, 0);
  drawVerticalSeparator(reviewPng, baselinePng.width, separatorWidth);
  copyPngInto(reviewPng, diffPng, baselinePng.width + separatorWidth, 0);
  drawVerticalSeparator(
    reviewPng,
    baselinePng.width + separatorWidth + diffPng.width,
    separatorWidth
  );
  copyPngInto(reviewPng, targetPng, baselinePng.width + diffPng.width + separatorWidth * 2, 0);

  return reviewPng;
}

/** Copy one PNG into another at a fixed offset. */
function copyPngInto(targetPng: PNG, sourcePng: PNG, offsetX: number, offsetY: number): void {
  PNG.bitblt(sourcePng, targetPng, 0, 0, sourcePng.width, sourcePng.height, offsetX, offsetY);
}

/** Draw a neutral divider so the three review panels remain visually separate. */
function drawVerticalSeparator(png: PNG, startX: number, width: number): void {
  for (let x = startX; x < startX + width; x++) {
    for (let y = 0; y < png.height; y++) {
      const offset = (png.width * y + x) << 2;
      png.data[offset] = 220;
      png.data[offset + 1] = 220;
      png.data[offset + 2] = 220;
      png.data[offset + 3] = 255;
    }
  }
}

/** Keep the diff PNG path aligned with the artifact name for easier lookup. */
function buildDiffPngPath(outputPath: string): string {
  return outputPath;
}

/** Write a sibling review composite beside each per-artifact diff PNG. */
function buildReviewPngPath(outputPath: string): string {
  const parsedPath = path.parse(outputPath);
  return path.join(parsedPath.dir, `${parsedPath.name}.review${parsedPath.ext}`);
}

/** Store artifact references in summaries as forward-slash relative paths. */
function toRelativeArtifactPath(rootDirectory: string, artifactPath: string): string {
  return path.relative(rootDirectory, artifactPath).split(path.sep).join("/");
}
