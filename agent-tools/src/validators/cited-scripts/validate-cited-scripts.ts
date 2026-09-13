import { discoverAuthoredFiles } from '../../core/authored-surfaces.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import {
  findMissingScriptCitations,
  type MissingScriptFinding,
} from './validate-cited-scripts-helpers.js';
import { loadWorkspaceScripts } from './workspace-scripts.js';

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
  '.agent/collaboration/rapid-comms/',
  'docs/explorations/',
];

const ALLOWLISTED_PATHS: readonly string[] = [];

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
    discoverAuthoredFiles(repoRoot, {
      roots: SCANNED_ROOTS,
      rootFiles: SCANNED_ROOT_FILES,
      extensions: SCANNED_EXTENSIONS,
      excludedPathFragments: EXCLUDED_PATH_FRAGMENTS,
    }),
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
