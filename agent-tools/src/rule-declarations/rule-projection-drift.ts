/**
 * Compare the projections the declarations render with what the projection surfaces hold.
 *
 * A projection that is absent is missing, one whose bytes differ is drifted, and a file on a
 * projection surface that no declaration renders is stale. The comparison is byte-exact on
 * purpose: the surfaces are outputs, and any difference means a hand edit or a stale
 * generation, never a second source of truth (`validators-must-recompute-not-just-record`).
 *
 * @packageDocumentation
 */

import type { RuleProjection } from './render-rule-projections.js';

/** What the surfaces hold against what the declarations render. */
export interface RuleProjectionDrift {
  /** Expected paths with no file. */
  readonly missing: readonly string[];
  /** Expected paths whose file text differs. */
  readonly drifted: readonly string[];
  /** Files on the surfaces that no declaration renders, in path order. */
  readonly stale: readonly string[];
}

/**
 * Diff the expected projections against the actual surface files.
 *
 * @param expected - The projections rendered from the declarations.
 * @param actual - Every file currently on the projection surfaces (and the index), keyed by
 * repo-relative path.
 * @returns The missing, drifted and stale paths.
 */
export function diffRuleProjections(
  expected: readonly RuleProjection[],
  actual: ReadonlyMap<string, string>,
): RuleProjectionDrift {
  const expectedPaths = new Set(expected.map((projection) => projection.path));
  const missing = expected
    .filter((projection) => !actual.has(projection.path))
    .map((projection) => projection.path);
  const drifted = expected
    .filter(
      (projection) =>
        actual.has(projection.path) && actual.get(projection.path) !== projection.text,
    )
    .map((projection) => projection.path);
  const stale = [...actual.keys()]
    .filter((path) => !expectedPaths.has(path))
    .sort((left, right) => left.localeCompare(right));
  return { missing, drifted, stale };
}
