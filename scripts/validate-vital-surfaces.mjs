#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectMatrixPaths } from "./validate-vital-surfaces-helpers.mjs";

const repoRoot = process.cwd();
const matrixPath = ".agent/reference/cross-platform-agent-surface-matrix.md";
const issues = [];

async function exists(relPath) {
  try {
    await fs.access(path.join(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
}

async function readText(relPath) {
  return fs.readFile(path.join(repoRoot, relPath), "utf8");
}

function addIssue(message) {
  issues.push(message);
}

async function main() {
  if (!(await exists(matrixPath))) {
    addIssue(`Missing vital-surface contract: ${matrixPath}`);
  } else {
    const content = await readText(matrixPath);
    const surfacePaths = collectMatrixPaths(content);

    for (const surface of surfacePaths) {
      if (!(await exists(surface.path))) {
        addIssue(`${surface.context}: missing ${surface.path}`);
      }
    }
  }

  if (issues.length > 0) {
    console.error(
      `Vital-surface validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"}):`
    );
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    return 1;
  }

  console.log("Vital-surface validation passed (matrix contract satisfied).");
  return 0;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main();
  process.exit(exitCode);
}
