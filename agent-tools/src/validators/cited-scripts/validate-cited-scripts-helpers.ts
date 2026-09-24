/**
 * Resolve `pnpm <script>` citations in authored surfaces against the scripts
 * `package.json` files actually define.
 *
 * A transplanted or hand-copied gate list drifts from the scripts that exist:
 * on 2026-09-12 twelve of the nineteen `pnpm` invocations in the shared
 * start-right workflow named scripts this repository does not have, and
 * nothing refused the citations. This helper is the recur-proof half of the
 * cure. Extraction lives in `extract-script-citations.ts`; this module
 * resolves each citation against the root and workspace script tables.
 *
 * The helper is pure and operates on in-memory files and script tables; the
 * runtime that walks the file system is in `validate-cited-scripts.ts`.
 *
 * @packageDocumentation
 */

import { extractScriptCitations, type ScriptCitation } from './extract-script-citations.js';

export { extractScriptCitations, type ScriptCitation };

/** The script tables the citations resolve against. */
export interface WorkspaceScripts {
  /** Root `package.json` script names. */
  readonly root: ReadonlySet<string>;
  /** Workspace package name → its script names. */
  readonly workspaces: ReadonlyMap<string, ReadonlySet<string>>;
}

/** A citation that resolves to no script. */
export interface MissingScriptFinding {
  /** Repo-relative path to the file containing the finding. */
  readonly path: string;
  /** 1-based line number of the finding. */
  readonly line: number;
  /** The cited command text. */
  readonly match: string;
  /** The script name that did not resolve. */
  readonly scriptName: string;
  /** Where the name was looked up: `root` or the workspace package name. */
  readonly scope: string;
  /** Why it did not resolve. */
  readonly reason: 'missing-script' | 'unknown-workspace';
}

/** Optional configuration for {@link findMissingScriptCitations}. */
export interface FindMissingScriptCitationsOptions {
  /**
   * Repo-relative paths exempted from the check: surfaces that legitimately
   * quote a dead script name (a lineage changelog, a dated exploration).
   */
  readonly allowlistedPaths?: readonly string[];
}

/**
 * Resolve every citation in the given files against the script tables.
 *
 * @param files - In-memory files with repo-relative paths.
 * @param scripts - The root and workspace script tables.
 * @param options - See {@link FindMissingScriptCitationsOptions}.
 * @returns Findings in file then line order; empty when every citation
 * resolves.
 *
 * @example
 * ```ts
 * findMissingScriptCitations(
 *   [{ path: 'docs/guide.md', content: 'Run `pnpm sdk-codegen` first.' }],
 *   { root: new Set(['build']), workspaces: new Map() },
 * );
 * // [{ path: 'docs/guide.md', line: 1, match: 'pnpm sdk-codegen', scriptName: 'sdk-codegen', scope: 'root', reason: 'missing-script' }]
 * ```
 */
export function findMissingScriptCitations(
  files: readonly { readonly path: string; readonly content: string }[],
  scripts: WorkspaceScripts,
  options: FindMissingScriptCitationsOptions = {},
): readonly MissingScriptFinding[] {
  const allowlistedPaths = new Set(options.allowlistedPaths ?? []);
  const findings: MissingScriptFinding[] = [];
  for (const file of files) {
    if (allowlistedPaths.has(file.path)) {
      continue;
    }
    for (const citation of extractScriptCitations(file.content)) {
      const finding = resolveCitation(file.path, citation, scripts);
      if (finding !== undefined) {
        findings.push(finding);
      }
    }
  }
  return findings;
}

/**
 * Resolve one citation found in the file at `path`: unfiltered against the
 * root table, filtered against the named workspace's.
 */
export function resolveCitation(
  path: string,
  citation: ScriptCitation,
  scripts: WorkspaceScripts,
): MissingScriptFinding | undefined {
  if (citation.workspaceFilter === undefined) {
    return scripts.root.has(citation.scriptName)
      ? undefined
      : finding(path, citation, 'root', 'missing-script');
  }
  const workspace = scripts.workspaces.get(citation.workspaceFilter);
  if (workspace === undefined) {
    return finding(path, citation, citation.workspaceFilter, 'unknown-workspace');
  }
  return workspace.has(citation.scriptName)
    ? undefined
    : finding(path, citation, citation.workspaceFilter, 'missing-script');
}

function finding(
  path: string,
  citation: ScriptCitation,
  scope: string,
  reason: MissingScriptFinding['reason'],
): MissingScriptFinding {
  return {
    path,
    line: citation.line,
    match: citation.match,
    scriptName: citation.scriptName,
    scope,
    reason,
  };
}
