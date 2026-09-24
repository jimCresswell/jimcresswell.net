/**
 * Resolve repository-path citations in authored surfaces against the paths
 * that exist.
 *
 * Doctrine cites the surfaces it depends on by path: a rule points at a
 * pattern record, a skill at a sub-agent template, a directive at a
 * reference. When the target is absent the citation is a latent refusal — a
 * seat follows it and finds nothing. On 2026-09-13 forty such targets were
 * cited from twenty live files after a lineage transplant, and no gate saw
 * them: `validate-markdown-links` skips code spans by design. This helper is
 * the recur-proof half of the cure. Extraction lives in
 * `extract-path-citations.ts`; this module resolves each citation through an
 * injected existence check so it stays pure.
 *
 * @packageDocumentation
 */

import { extractPathCitations, type PathCitation } from './extract-path-citations.js';

export { extractPathCitations, type PathCitation };

/** A citation whose target does not exist. */
export interface MissingPathFinding {
  /** Repo-relative path to the file containing the finding. */
  readonly path: string;
  /** 1-based line number of the finding. */
  readonly line: number;
  /** The token as written. */
  readonly match: string;
  /** The normalised repo-relative target that does not exist. */
  readonly target: string;
}

/**
 * Resolve every path citation in the given files through `exists`.
 *
 * @param files - In-memory files with repo-relative paths.
 * @param exists - Whether a repo-relative path names an existing file or
 * directory.
 * @returns Findings in file then line order; empty when every citation
 * resolves.
 *
 * @example
 * ```ts
 * findMissingPathCitations(
 *   [{ path: '.agent/rules/x.md', content: 'See `.agent/memory/active/patterns/gone.md`.' }],
 *   () => false,
 * );
 * // [{ path: '.agent/rules/x.md', line: 1, match: '.agent/memory/active/patterns/gone.md', target: '.agent/memory/active/patterns/gone.md' }]
 * ```
 */
export function findMissingPathCitations(
  files: readonly { readonly path: string; readonly content: string }[],
  exists: (target: string) => boolean,
): readonly MissingPathFinding[] {
  return files.flatMap((file) => missingCitationsInFile(file, exists));
}

function missingCitationsInFile(
  file: { readonly path: string; readonly content: string },
  resolves: (target: string) => boolean,
): readonly MissingPathFinding[] {
  return extractPathCitations(file.content)
    .filter((citation) => !resolves(citation.target))
    .map((citation) => ({
      path: file.path,
      line: citation.line,
      match: citation.match,
      target: citation.target,
    }));
}
