/**
 * Rule glob resolution: every file glob a canonical rule declares must match at
 * least one tracked file.
 *
 * @remarks
 * A rule's `globs` are rendered into the Claude `paths` and Cursor `globs`
 * adapters, which load the rule when an agent touches a matching file. A glob
 * naming a root the tree does not have renders exactly and loads the rule
 * nowhere, and nothing else reports it: eight rules carried such roots until
 * they were re-rooted by hand. This check is the class's gate.
 *
 * Its limits, deliberately:
 * - It proves a glob matches something, not that it matches what the rule
 *   governs. A glob that is live but misses the rule's real homes passes; homes
 *   stay a reviewer's judgement.
 * - It checks whole patterns, not brace alternatives. A pattern is live when any
 *   alternative matches, so an alternative that matches nothing passes inside a
 *   live group. That is how a rule keeps a target that must never exist:
 *   `**\/*.{js,mjs,cjs,sh}` on the TypeScript-only rule catches a `.js` or `.cjs`
 *   file the moment one appears. Checking per alternative would condemn it.
 * - A whole pattern that matches nothing is reported, including a glob for a
 *   file absent on purpose; keeping one means folding it into a live group, a
 *   data decision the check forces into the open.
 * - "Tracked" means the git index (`git ls-files`): a new governed directory
 *   reads as dead until it is staged, and a governed file removed without
 *   `git rm` still counts locally until the index drops it.
 *
 * Matching uses `path.posix.matchesGlob`, whose wildcards do not enter
 * dot-directories (`**\/*.css` does not match `.cursor/theme.css`); a rule that
 * governs files under a dot-directory names that directory literally.
 *
 * @packageDocumentation
 */
import path from 'node:path';

import type { RuleDeclaration } from '../../rule-declarations/rule-declaration.js';

/**
 * The glob-resolution issues for a set of rule declarations.
 *
 * @param declarations - The canonical rules' parsed declarations.
 * @param trackedPaths - Every tracked repo-relative path.
 * @returns One issue per declared glob that matches no tracked path, in declaration order.
 */
export function ruleGlobResolutionIssues(
  declarations: readonly RuleDeclaration[],
  trackedPaths: readonly string[],
): string[] {
  return declarations.flatMap((declaration) =>
    declaration.classification === 'situational'
      ? declaration.globs
          .filter(
            (glob) =>
              !trackedPaths.some((trackedPath) => path.posix.matchesGlob(trackedPath, glob)),
          )
          .map(
            (glob) =>
              `.agent/rules/${declaration.name}.md: glob "${glob}" matches no tracked file; re-root it to where the governed files live, or drop it`,
          )
      : [],
  );
}
