import { discoverAuthoredFiles } from '../../core/authored-surfaces.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { collectTrackedPaths } from '../../core/repository-paths.js';
import { writeLine, writeErrorLine } from '../../core/terminal-output.js';

import {
  findStaleScriptInvocations,
  type StaleScriptInvocationFinding,
} from './validate-no-stale-script-invocations-helpers.js';

/**
 * Standalone validator that walks authored repo surfaces (CI workflow YAML,
 * project documentation, app docs, agent research notes, agent directives,
 * memory, and Practice Core narrative) and fails if any file uses a stale
 * root `scripts/<name>` invocation now that root script logic must live in
 * workspace-owned commands.
 *
 * The gate exists to prevent regression of the failure class fixed in
 * PR-90 commit `b8540657`: the TS6 migration renamed `.mjs` scripts to
 * `.ts` but left workflow YAML and authored markdown referencing the old
 * paths, breaking CI and producing reviewer comments. SonarCloud and
 * Copilot caught the drift externally; this validator catches it locally
 * before push.
 *
 * Wired into `pnpm test:root-scripts` alongside the workspace-owned ESLint
 * boundary inventory validator.
 *
 * @packageDocumentation
 */

// Resolve the repository root independently of the caller's cwd (matches the
// sibling validators and the hook-policy loader).
const repoRoot = resolveRepoRoot(import.meta.url);

/**
 * Authored surfaces walked recursively. Tests, generated artefacts,
 * archives, and vendored skills are excluded by the predicate below.
 */
const SCANNED_ROOTS: readonly string[] = [
  '.github/workflows',
  'docs',
  '.agent/research',
  '.agent/directives',
  '.agent/memory/active',
  '.agent/memory/operational',
  '.agent/memory/executive',
  '.agent/practice-core',
  'apps',
];

/**
 * File extensions that may contain authored prose or workflow steps.
 */
const SCANNED_EXTENSIONS: ReadonlySet<string> = new Set(['.md', '.yml', '.yaml']);

/**
 * Path-fragment exclusions. Files matching any fragment are skipped.
 *
 * - `/archive/` — historical record, never edited as live guidance.
 * - `clerk-backend-api/SKILL.md` — vendored third-party skill that
 *   references its upstream `node scripts/extract-tags.js` invocation
 *   (Clerk-internal, not repo-internal).
 */
const EXCLUDED_PATH_FRAGMENTS: readonly string[] = ['/archive/', 'clerk-backend-api/SKILL.md'];

/**
 * Files allowlisted in the helper because they legitimately discuss the
 * stale-invocation pattern in prose (e.g. plans describing the drift
 * verbatim alongside the cure).
 */
const ALLOWLISTED_PATHS: readonly string[] = [
  '.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md',
];

/**
 * Surfaces may be optional (e.g. `.agent/research` exists in some checkouts
 * and not others); the shared walker treats a missing root as empty.
 */
function discoverScannableFiles(): Promise<readonly { path: string; content: string }[]> {
  return discoverAuthoredFiles(repoRoot, {
    roots: SCANNED_ROOTS,
    rootFiles: [],
    extensions: SCANNED_EXTENSIONS,
    excludedPathFragments: EXCLUDED_PATH_FRAGMENTS,
    universe: collectTrackedPaths(repoRoot),
  });
}

function formatFindings(findings: readonly StaleScriptInvocationFinding[]): string {
  return findings
    .map((finding) => `  ${finding.path}:${finding.line}  ${finding.match}`)
    .join('\n');
}

async function main(): Promise<void> {
  const files = await discoverScannableFiles();
  const findings = findStaleScriptInvocations(files, { allowlistedPaths: ALLOWLISTED_PATHS });

  if (findings.length === 0) {
    writeLine('validate-no-stale-script-invocations: OK (no stale root `scripts/...` invocations)');
    return;
  }

  writeErrorLine(
    `validate-no-stale-script-invocations: ${findings.length} stale invocation(s) found.\n\n` +
      `${formatFindings(findings)}\n\n` +
      `Authored surfaces must call workspace-owned package scripts instead of root \`scripts/\` files. ` +
      `Convert each finding above (or, for plans/research material legitimately describing ` +
      `the drift in prose, add the file path to ALLOWLISTED_PATHS in this script).`,
  );
  process.exit(1);
}

await main();
