import fs from 'node:fs/promises';
import path from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import {
  findMissingScriptCitations,
  type MissingScriptFinding,
} from './validate-cited-scripts-helpers.js';
import { loadWorkspaceScripts, readOptionalFile } from './workspace-scripts.js';

/**
 * Standalone validator that walks the authored agent and documentation
 * surfaces and fails when a `pnpm <script>` citation names a script that no
 * `package.json` defines.
 *
 * The gate exists because gate lists and command recipes are hand-copied
 * into skills, rules, directives and docs, and drift from `package.json`
 * silently: on 2026-09-12 the transplanted shared start-right workflow cited
 * twelve scripts this repository does not have, and a seat following it
 * would have run an imaginary gate suite. `validate-markdown-links` cannot
 * see the problem (it skips code spans and fenced blocks by design), and
 * `validate-no-stale-script-invocations` matches retired `scripts/*.mjs`
 * paths only.
 *
 * Wired into `pnpm docs-validators:check`.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/** Authored surfaces walked recursively. */
const SCANNED_ROOTS: readonly string[] = [
  '.agent',
  '.agents',
  '.claude',
  '.codex',
  '.cursor',
  '.github',
  'agent-tools/docs',
  'docs',
];

/** Root-level authored files. */
const SCANNED_ROOT_FILES: readonly string[] = [
  'AGENTS.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
  'README.md',
  'RULES_INDEX.md',
  'SECURITY.md',
  'skills.md',
];

const SCANNED_EXTENSIONS: ReadonlySet<string> = new Set(['.md', '.yml', '.yaml', '.toml']);

/**
 * Path-fragment exclusions: history, captures and frozen records quote dead
 * script names legitimately; the pre-transplant snapshot and reference-local
 * trees are never walked by a repo tool.
 */
const EXCLUDED_PATH_FRAGMENTS: readonly string[] = [
  '/archive/',
  '/node_modules/',
  '.agent-original/',
  '/reference-local/',
  '.agent/practice-core/CHANGELOG.md',
  '.agent/practice-core/provenance.yml',
  '.agent/practice-core/incoming/',
  '.agent/memory/',
  '.agent/reports/',
  '.agent/experience/',
  '.agent/evaluations/',
  '.agent/research/',
  '.agent/state/',
  'docs/explorations/',
];

const ALLOWLISTED_PATHS: readonly string[] = [];

interface ScannableFile {
  readonly path: string;
  readonly content: string;
}

interface DirectoryEntry {
  readonly name: string;
  isDirectory: () => boolean;
  isFile: () => boolean;
}

function toRepoRelative(absolute: string): string {
  return path.relative(repoRoot, absolute).split(path.sep).join('/');
}

function isExcluded(repoRelative: string): boolean {
  return EXCLUDED_PATH_FRAGMENTS.some((fragment) => repoRelative.includes(fragment));
}

async function readDirectoryEntries(absoluteDir: string): Promise<readonly DirectoryEntry[]> {
  try {
    return await fs.readdir(absoluteDir, { withFileTypes: true });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function isScannableFile(entry: DirectoryEntry): boolean {
  return entry.isFile() && SCANNED_EXTENSIONS.has(path.extname(entry.name));
}

async function collectFiles(absoluteDir: string, accumulator: ScannableFile[]): Promise<void> {
  for (const entry of await readDirectoryEntries(absoluteDir)) {
    const entryAbsolute = path.join(absoluteDir, entry.name);
    const repoRelative = toRepoRelative(entryAbsolute);
    if (isExcluded(entry.isDirectory() ? `${repoRelative}/` : repoRelative)) {
      continue;
    }
    if (entry.isDirectory()) {
      await collectFiles(entryAbsolute, accumulator);
    } else if (isScannableFile(entry)) {
      accumulator.push({ path: repoRelative, content: await fs.readFile(entryAbsolute, 'utf8') });
    }
  }
}

async function discoverScannableFiles(): Promise<readonly ScannableFile[]> {
  const files: ScannableFile[] = [];
  for (const rootRelative of SCANNED_ROOTS) {
    await collectFiles(path.join(repoRoot, rootRelative), files);
  }
  for (const fileName of SCANNED_ROOT_FILES) {
    const content = await readOptionalFile(path.join(repoRoot, fileName));
    if (content !== undefined) {
      files.push({ path: fileName, content });
    }
  }
  return files;
}

function formatFindings(findings: readonly MissingScriptFinding[]): string {
  return findings
    .map((finding) => {
      const detail =
        finding.reason === 'unknown-workspace'
          ? `no workspace named "${finding.scope}"`
          : `no script "${finding.scriptName}" in ${finding.scope}`;
      return `  ${finding.path}:${String(finding.line)}  ${finding.match}  → ${detail}`;
    })
    .join('\n');
}

async function main(): Promise<void> {
  const [files, scripts] = await Promise.all([
    discoverScannableFiles(),
    loadWorkspaceScripts(repoRoot),
  ]);
  const findings = findMissingScriptCitations(files, scripts, {
    allowlistedPaths: ALLOWLISTED_PATHS,
  });

  if (findings.length === 0) {
    writeLine(
      `validate-cited-scripts: OK (${String(files.length)} files scanned; every cited pnpm script exists).`,
    );
    return;
  }

  writeErrorLine(
    `validate-cited-scripts: ${String(findings.length)} cited script(s) do not exist.\n\n` +
      `${formatFindings(findings)}\n\n` +
      'Every `pnpm <script>` in a code span or fenced block must name a script the root or the ' +
      'filtered workspace defines in package.json. Fix the citation, add the script, or — for a ' +
      'surface that legitimately quotes a dead name — add the path to ALLOWLISTED_PATHS here.',
  );
  process.exitCode = 1;
}

await main();
