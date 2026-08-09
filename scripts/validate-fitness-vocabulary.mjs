#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = process.cwd();
const FITNESS_MODE_INFORMATIONAL = "informational";
const FITNESS_MODE_STRICT = "strict";
const ALLOWED_FITNESS_KEYS = new Set([
  "fitness_line_target",
  "fitness_line_limit",
  "fitness_char_limit",
  "fitness_line_length",
]);
const EXCLUDED_DIRS = new Set([".git", "node_modules", "coverage", ".next"]);
const EXCLUDED_SEGMENTS = ["/archive/"];

async function readText(relPath) {
  return fs.readFile(path.join(repoRoot, relPath), "utf8");
}

function shouldSkipDirectory(relPath) {
  const normalized = normalizePath(relPath);
  if (EXCLUDED_DIRS.has(path.basename(normalized))) {
    return true;
  }
  if (EXCLUDED_SEGMENTS.some((segment) => normalized.includes(segment))) {
    return true;
  }
  return false;
}

function normalizePath(relPath) {
  return relPath.split(path.sep).join("/");
}

async function discoverMarkdownFiles(relDir = ".") {
  const entries = await fs.readdir(path.join(repoRoot, relDir), { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relPath = relDir === "." ? entry.name : path.join(relDir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(relPath)) {
        continue;
      }
      files.push(...(await discoverMarkdownFiles(relPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(normalizePath(relPath));
    }
  }

  return files;
}

/**
 * Extracts the text inside a Markdown frontmatter block.
 *
 * @param {string} content - The Markdown content.
 * @returns {string} The YAML frontmatter block without the surrounding `---`.
 */
export function extractFrontmatterSection(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? "";
}

/**
 * Parses the frontmatter block and returns the keys that were declared.
 *
 * @param {string} frontmatter - The YAML frontmatter text.
 * @returns {string[]} The list of keys (in declaration order).
 */
export function extractFrontmatterKeys(frontmatter) {
  if (!frontmatter) {
    return [];
  }

  return frontmatter
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(":", 1)[0].trim())
    .filter(Boolean);
}

/**
 * Determines which fitness keys are not part of the canonical vocabulary.
 *
 * @param {string[]} keys - The frontmatter keys to evaluate.
 * @returns {string[]} Keys that start with `fitness_` but are not allowed.
 */
export function findInvalidFitnessKeys(keys) {
  return keys.filter((key) => key.startsWith("fitness_") && !ALLOWED_FITNESS_KEYS.has(key));
}

function getMode(args) {
  return args.includes("--strict") ? FITNESS_MODE_STRICT : FITNESS_MODE_INFORMATIONAL;
}

async function main(args = process.argv.slice(2)) {
  const mode = getMode(args);
  const markdownFiles = await discoverMarkdownFiles();
  const violations = [];

  for (const relPath of markdownFiles) {
    const content = await readText(relPath);
    const frontmatter = extractFrontmatterSection(content);
    const keys = extractFrontmatterKeys(frontmatter);
    const invalidKeys = findInvalidFitnessKeys(keys);

    if (invalidKeys.length > 0) {
      violations.push({ filename: relPath, keys: invalidKeys });
    }
  }

  if (violations.length === 0) {
    console.log("Fitness vocabulary validation passed (no invalid keys).");
    return 0;
  }

  for (const violation of violations) {
    console.log(`• ${violation.filename}: ${violation.keys.join(", ")}`);
  }

  if (mode === FITNESS_MODE_INFORMATIONAL) {
    console.log(`Result: WARN (${violations.length} file(s) use non-canonical fitness keys)`);
    return 0;
  }

  console.log(`Result: FAIL (${violations.length} file(s) use non-canonical fitness keys)`);
  return 1;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = await main();
  process.exit(exitCode);
}
