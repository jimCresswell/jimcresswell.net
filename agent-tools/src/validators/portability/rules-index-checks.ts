/**
 * The Codex project-document byte budget for the rules index.
 *
 * `RULES_INDEX.md` is rendered from the rule declarations and compared byte for byte by the
 * projection leg (`rule-projection-validation.ts`), which already answers for its presence
 * and its rows. What the rendered bytes cannot answer for themselves is whether Codex will
 * load them whole: Codex imposes a project-document size budget, and an index past it risks
 * truncation and silent rule-load failure. This module keeps that one check.
 */

import { DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES, RULES_INDEX_PATH } from './portability-constants.js';

/**
 * Options for {@link getRulesIndexPortabilityIssues}.
 */
export interface RulesIndexPortabilityIssuesOptions {
  /** Full text content of the rules index Markdown file. */
  rulesIndexContent: string;
  /**
   * Override path label used in issue messages.
   * Defaults to {@link RULES_INDEX_PATH}.
   */
  rulesIndexPath?: string;
  /**
   * Maximum allowed byte size for the rules index.
   * Defaults to {@link DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES}.
   */
  maxBytes?: number;
}

/**
 * Returns the portability issues of the rules index that its rendered bytes cannot answer
 * for: today, the Codex project-document byte budget.
 *
 * @param opts - The index text and the configurable limit.
 * @returns An array of human-readable issue strings; empty means no issues.
 */
export function getRulesIndexPortabilityIssues(opts: RulesIndexPortabilityIssuesOptions): string[] {
  const rulesIndexPath = opts.rulesIndexPath ?? RULES_INDEX_PATH;
  const maxBytes = opts.maxBytes ?? DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES;
  const byteSize = Buffer.byteLength(opts.rulesIndexContent, 'utf8');
  return byteSize > maxBytes
    ? [`${rulesIndexPath}: ${byteSize} bytes exceeds Codex project-doc budget ${maxBytes}`]
    : [];
}
