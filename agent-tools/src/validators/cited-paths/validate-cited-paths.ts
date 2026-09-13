import fs from 'node:fs';
import path from 'node:path';

import { discoverAuthoredFiles } from '../../core/authored-surfaces.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import {
  findMissingPathCitations,
  type MissingPathFinding,
} from './validate-cited-paths-helpers.js';

/**
 * Standalone validator that walks the live doctrine surfaces and fails when
 * a code-formatted `.agent/` or `docs/` path names a file or directory that
 * does not exist.
 *
 * The gate exists because doctrine depends on surfaces by path, and a
 * transplant, a move or a trim leaves the citation behind: on 2026-09-13
 * the rules, skills, directives and entry points cited thirty-five absent
 * targets (pattern records, sub-agent templates, research directories, a
 * skill at its pre-move path), and every one was a latent refusal for the
 * seat that followed it. `validate-markdown-links` cannot see the problem
 * (it skips code spans and fenced blocks by design).
 *
 * Scope is the doctrine a seat internalises — skills, rules, directives and
 * the entry points — not every authored surface: the plans, reports and
 * memory quote paths as history, and `.agent/practice-core/` cites the
 * lineage's layout by design (PDR-105). Widening the roots is a deliberate
 * step taken once the current findings are cured.
 *
 * Wired into `pnpm docs-validators:check`.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

/** Doctrine surfaces walked recursively. */
const SCANNED_ROOTS: readonly string[] = ['.agent/directives', '.agent/rules', '.agent/skills'];

/** Entry points: the files a seat reads before anything else. */
const SCANNED_ROOT_FILES: readonly string[] = [
  'AGENTS.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
  'README.md',
  'RULES_INDEX.md',
  '.agent/README.md',
  '.agent/HUMANS.md',
  '.agent/practice-index.md',
];

const SCANNED_EXTENSIONS: ReadonlySet<string> = new Set(['.md']);

/** Path-fragment exclusions: archives and the private boundary are never walked by a repo tool. */
const EXCLUDED_PATH_FRAGMENTS: readonly string[] = [
  '/archive/',
  '/node_modules/',
  '.agent-original/',
  '/reference-local/',
];

/**
 * Targets whose absence is by design: directories a tool creates at its
 * first write, and ignored boundaries that exist only on some machines.
 */
const ALLOWLISTED_TARGETS: readonly string[] = [
  // Created by the first `commit-queue enqueue`; machine-local per-intent state.
  '.agent/state/collaboration/commit-queue',
  // An ignored compatibility boundary for isolated local notes (privacy.md).
  '.agent/private',
];

const ALLOWLISTED_PATHS: readonly string[] = [];

function targetExists(target: string): boolean {
  return fs.existsSync(path.join(repoRoot, target));
}

function formatFindings(findings: readonly MissingPathFinding[]): string {
  return findings
    .map((finding) => `  ${finding.path}:${String(finding.line)}  ${finding.match}`)
    .join('\n');
}

async function main(): Promise<void> {
  const files = await discoverAuthoredFiles(repoRoot, {
    roots: SCANNED_ROOTS,
    rootFiles: SCANNED_ROOT_FILES,
    extensions: SCANNED_EXTENSIONS,
    excludedPathFragments: EXCLUDED_PATH_FRAGMENTS,
  });
  const findings = findMissingPathCitations(files, targetExists, {
    allowlistedTargets: ALLOWLISTED_TARGETS,
    allowlistedPaths: ALLOWLISTED_PATHS,
  });

  if (findings.length === 0) {
    writeLine(
      `validate-cited-paths: OK (${String(files.length)} files scanned; every cited path exists).`,
    );
    return;
  }

  const distinctTargets = new Set(findings.map((finding) => finding.target)).size;
  writeErrorLine(
    `validate-cited-paths: ${String(findings.length)} citation(s) of ${String(distinctTargets)} absent path(s).\n\n` +
      `${formatFindings(findings)}\n\n` +
      'Every code-formatted `.agent/` or `docs/` path in live doctrine must name a file or ' +
      'directory that exists. Restore the target, re-point the citation, or — for a directory a ' +
      'tool creates at runtime — add the target to ALLOWLISTED_TARGETS here.',
  );
  process.exitCode = 1;
}

await main();
