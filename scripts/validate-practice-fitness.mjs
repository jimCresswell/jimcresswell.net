#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  evaluateFitnessFile,
  extractFrontmatter,
  FITNESS_EXCLUDED_PATH_PREFIXES,
  FITNESS_EXCLUDED_PATH_SEGMENTS,
  getFrontmatterNumber,
  shouldInspectFitnessPath,
} from "./validate-practice-fitness-helpers.mjs";

const repoRoot = process.cwd();
const FITNESS_MODE_STRICT = "strict";
const FITNESS_MODE_INFORMATIONAL = "informational";
const EXCLUDED_DIRECTORY_NAMES = new Set([".git", "coverage", "dist", "node_modules"]);

async function readText(relPath) {
  return fs.readFile(path.join(repoRoot, relPath), "utf8");
}

function shouldSkipDirectory(relPath) {
  const normalizedPath = relPath.split(path.sep).join("/");
  const pathParts = normalizedPath.split("/");
  const directoryName = pathParts[pathParts.length - 1];

  if (EXCLUDED_DIRECTORY_NAMES.has(directoryName)) {
    return true;
  }

  if (FITNESS_EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))) {
    return true;
  }

  return FITNESS_EXCLUDED_PATH_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}
async function discoverMarkdownFiles(relDir = ".") {
  const absDir = path.join(repoRoot, relDir);
  const dirEntries = await fs.readdir(absDir, { withFileTypes: true });
  const sortedEntries = dirEntries.toSorted((left, right) => left.name.localeCompare(right.name));
  const markdownFiles = [];

  for (const entry of sortedEntries) {
    const relPath = relDir === "." ? entry.name : path.join(relDir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(relPath)) {
        continue;
      }

      markdownFiles.push(...(await discoverMarkdownFiles(relPath)));
      continue;
    }

    if (entry.isFile() && shouldInspectFitnessPath(relPath)) {
      markdownFiles.push(relPath.split(path.sep).join("/"));
    }
  }

  return markdownFiles;
}

async function discoverFitnessFiles() {
  const markdownFiles = await discoverMarkdownFiles(".");
  const fitnessFiles = [];

  for (const relPath of markdownFiles) {
    const content = await readText(relPath);
    const frontmatter = extractFrontmatter(content);

    if (getFrontmatterNumber(frontmatter, "fitness_line_target") !== null) {
      fitnessFiles.push(relPath);
    }
  }

  return fitnessFiles.toSorted((left, right) => left.localeCompare(right));
}

function passIndicator() {
  return "\x1b[32m✓\x1b[0m";
}

function failIndicator() {
  return "\x1b[31m✗\x1b[0m";
}

function warnIndicator() {
  return "\x1b[33m⚠\x1b[0m";
}

function formatLineStatus(result) {
  const count = String(result.totalLines).padStart(6);

  if (result.targetLines == null && result.limitLines == null) {
    return `    Lines:            ${count}  (no threshold)`;
  }

  const targetPart = result.targetLines != null ? `target ${result.targetLines}` : "";
  const limitPart = result.limitLines != null ? `limit ${result.limitLines}` : "";
  const thresholds = [targetPart, limitPart].filter(Boolean).join(" / ");

  if (!result.limitOk) {
    return `    Lines:            ${count} / ${thresholds}  ${failIndicator()}`;
  }

  if (!result.targetOk) {
    return `    Lines:            ${count} / ${thresholds}  ${warnIndicator()} above target`;
  }

  return `    Lines:            ${count} / ${thresholds}  ${passIndicator()}`;
}

function formatResult(result) {
  const lines = [];
  lines.push(`  ${result.filename}`);
  lines.push(formatLineStatus(result));

  if (result.limitChars != null) {
    const charIndicator = result.charsOk ? passIndicator() : failIndicator();
    lines.push(
      `    Characters:       ${String(result.totalChars).padStart(6)} / ${result.limitChars}  ${charIndicator}`
    );
  } else {
    lines.push(`    Characters:       ${String(result.totalChars).padStart(6)}  (no limit)`);
  }

  if (result.maxProseLineWidth != null) {
    const detail = result.proseOk
      ? ""
      : ` (${result.proseViolationCount} violations, longest at line ${result.maxProseLineNum})`;
    const proseIndicator = result.proseOk ? passIndicator() : failIndicator();
    lines.push(
      `    Max prose line:   ${String(result.maxProseLen).padStart(6)} / ${result.maxProseLineWidth}  ${proseIndicator}${detail}`
    );
  } else {
    lines.push(`    Max prose line:   ${String(result.maxProseLen).padStart(6)}  (no limit)`);
  }

  if (!result.proseOk && result.proseViolations.length > 0) {
    lines.push("    Prose violations:");
    for (const violation of result.proseViolations) {
      lines.push(
        `      line ${String(violation.lineNumber).padStart(3)}: ${violation.text.length} chars`
      );
    }

    if (result.proseViolationCount > 5) {
      lines.push(`      ... and ${result.proseViolationCount - 5} more`);
    }
  }

  return lines.join("\n");
}

function getMode(args) {
  return args.includes("--informational") ? FITNESS_MODE_INFORMATIONAL : FITNESS_MODE_STRICT;
}

export function getExitCode(mode, totalViolations) {
  if (mode === FITNESS_MODE_INFORMATIONAL) {
    return 0;
  }

  return totalViolations === 0 ? 0 : 1;
}

async function main(args = process.argv.slice(2)) {
  const mode = getMode(args);
  const fitnessFiles = await discoverFitnessFiles();

  console.log("\nPractice Fitness Check");
  console.log("══════════════════════════════════════\n");

  const results = await Promise.all(
    fitnessFiles.map(async (relPath) => evaluateFitnessFile(relPath, await readText(relPath)))
  );
  const totalViolations = results.reduce((sum, result) => sum + result.violations.length, 0);
  const totalWarnings = results.reduce((sum, result) => sum + result.warnings.length, 0);

  for (const result of results) {
    console.log(formatResult(result));
    console.log();
  }

  const exitCode = getExitCode(mode, totalViolations);

  if (totalViolations === 0 && totalWarnings === 0) {
    console.log("\x1b[32mResult: PASS\x1b[0m\n");
    return exitCode;
  }

  if (totalViolations === 0 && totalWarnings > 0) {
    console.log(
      `\x1b[33mResult: PASS with ${totalWarnings} warning${totalWarnings === 1 ? "" : "s"} (target exceeded)\x1b[0m\n`
    );
    for (const result of results) {
      for (const warning of result.warnings) {
        console.log(`  \x1b[33m⚠\x1b[0m ${result.filename}: ${warning}`);
      }
    }
    console.log();
    return exitCode;
  }

  const summaryColour = mode === FITNESS_MODE_INFORMATIONAL ? "\x1b[33m" : "\x1b[31m";
  const summaryLabel = mode === FITNESS_MODE_INFORMATIONAL ? "WARN" : "FAIL";
  const summarySuffix = mode === FITNESS_MODE_INFORMATIONAL ? " — informational mode" : "";

  console.log(
    `${summaryColour}Result: ${summaryLabel} (${totalViolations} violation${totalViolations === 1 ? "" : "s"}${totalWarnings > 0 ? `, ${totalWarnings} warning${totalWarnings === 1 ? "" : "s"}` : ""})${summarySuffix}\x1b[0m\n`
  );

  for (const result of results) {
    for (const violation of result.violations) {
      console.log(`  \x1b[31m•\x1b[0m ${result.filename}: ${violation}`);
    }
    for (const warning of result.warnings) {
      console.log(`  \x1b[33m⚠\x1b[0m ${result.filename}: ${warning}`);
    }
  }

  console.log();
  return exitCode;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main();
  process.exit(exitCode);
}
