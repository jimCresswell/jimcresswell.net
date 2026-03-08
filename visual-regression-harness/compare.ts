import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import {
  ensureDirectory,
  getRouteArtifactPaths,
  regressionRoutes,
  type RegressionRoute,
} from "./shared";

interface ComparisonFailure {
  type: "html" | "png" | "missing";
  route: string;
  artifact: string;
  detail: string;
}

/**
 * Compare two captured artifact sets and fail on any difference.
 *
 * This harness is intentionally strict: DOM/HTML differences and pixel
 * differences are both treated as blockers unless a human explicitly reviews
 * and accepts them outside the tool.
 *
 * @param options Comparison configuration.
 */
export async function compareArtifactSets(options: {
  baselineDirectory: string;
  targetDirectory: string;
  outputDirectory: string;
}): Promise<void> {
  await ensureDirectory(options.outputDirectory);

  const failures: ComparisonFailure[] = [];

  for (const route of regressionRoutes) {
    for (const artifactPath of getRouteArtifactPaths(route)) {
      const baselinePath = path.join(options.baselineDirectory, route.key, artifactPath);
      const targetPath = path.join(options.targetDirectory, route.key, artifactPath);
      const outputPath = path.join(options.outputDirectory, route.key, artifactPath);

      const bothExist = await artifactsExist(baselinePath, targetPath);
      if (!bothExist) {
        failures.push({
          type: "missing",
          route: route.key,
          artifact: artifactPath,
          detail: "One or both artifacts are missing",
        });
        continue;
      }

      if (artifactPath.endsWith(".png")) {
        const differingPixels = await comparePngArtifacts(baselinePath, targetPath, outputPath);
        if (differingPixels !== 0) {
          failures.push({
            type: "png",
            route: route.key,
            artifact: artifactPath,
            detail:
              differingPixels === Number.POSITIVE_INFINITY
                ? "Image dimensions differ"
                : `${differingPixels} differing pixels`,
          });
        }
        continue;
      }

      const textMatches = await compareTextArtifacts(
        route,
        artifactPath,
        baselinePath,
        targetPath,
        outputPath
      );
      if (!textMatches) {
        failures.push({
          type: "html",
          route: route.key,
          artifact: artifactPath,
          detail: "Text artifacts differ",
        });
      }
    }
  }

  const summaryPath = path.join(options.outputDirectory, "summary.json");
  await fs.writeFile(summaryPath, `${JSON.stringify({ failures }, null, 2)}\n`, "utf8");

  if (failures.length > 0) {
    const failureSummary = failures
      .map((failure) => `${failure.route}/${failure.artifact}: ${failure.detail}`)
      .join("\n");
    throw new Error(`Visual regression comparison failed:\n${failureSummary}`);
  }
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
  outputPath: string
): Promise<boolean> {
  const baselineContents = await fs.readFile(baselinePath, "utf8");
  const targetContents = await fs.readFile(targetPath, "utf8");

  if (baselineContents === targetContents) {
    return true;
  }

  const diffSummary = createDiffSummary(route.key, artifactPath, baselineContents, targetContents);
  await ensureDirectory(path.dirname(outputPath));
  await fs.writeFile(`${outputPath}.diff.txt`, diffSummary, "utf8");

  return false;
}

async function comparePngArtifacts(
  baselinePath: string,
  targetPath: string,
  outputPath: string
): Promise<number> {
  const baselinePng = PNG.sync.read(await fs.readFile(baselinePath));
  const targetPng = PNG.sync.read(await fs.readFile(targetPath));

  if (baselinePng.width !== targetPng.width || baselinePng.height !== targetPng.height) {
    await ensureDirectory(path.dirname(outputPath));
    await fs.writeFile(
      `${outputPath}.diff.txt`,
      `Dimension mismatch: baseline=${baselinePng.width}x${baselinePng.height}, target=${targetPng.width}x${targetPng.height}\n`,
      "utf8"
    );
    return Number.POSITIVE_INFINITY;
  }

  const diff = new PNG({ width: baselinePng.width, height: baselinePng.height });
  const differingPixels = pixelmatch(
    baselinePng.data,
    targetPng.data,
    diff.data,
    baselinePng.width,
    baselinePng.height,
    { threshold: 0 }
  );

  if (differingPixels === 0) {
    return 0;
  }

  await ensureDirectory(path.dirname(outputPath));
  await fs.writeFile(outputPath, PNG.sync.write(diff));

  return differingPixels;
}

function createDiffSummary(
  routeKey: string,
  artifactPath: string,
  baselineContents: string,
  targetContents: string
): string {
  const baselineLines = baselineContents.split("\n");
  const targetLines = targetContents.split("\n");
  const maxLineCount = Math.max(baselineLines.length, targetLines.length);
  const diffLines = [`Route: ${routeKey}`, `Artifact: ${artifactPath}`, ""];

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
