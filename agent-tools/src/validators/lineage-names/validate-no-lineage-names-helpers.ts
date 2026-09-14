/**
 * Pure helpers for the lineage-name leak validator.
 *
 * @remarks
 * The Practice was transplanted from another lineage (the provenance chain in
 * `.agent/practice-core/provenance.yml` tells that story). Its names belong in
 * the records that tell it, never on a live surface: a fixture URL, a package
 * manifest, a reference link or a comment carrying the lineage's organisation
 * or repository reads as this estate's fact and leaks the transplant into
 * product and tooling.
 *
 * The needle set is DECLARED once, in the `lineage-name` scoped block of
 * `.agent/hooks/policy.json`, the block the PreToolUse write-hook also reads,
 * so the commit and CI gate and the write-time guard match the same names and
 * exempt exactly the same files (the records: provenance, changelog, memory,
 * reports, plans, the transplant exploration; and the CV content, where the
 * lineage's organisation is a fact about the owner's work). It is declared
 * rather than derived because the chain cannot select the lineage: it names
 * the owner's own earlier repositories beside it, and the organisation login
 * appears in no provenance field.
 *
 * Matching is case-insensitive and literal: a lineage name is a name, not a
 * pattern, and `OakNational` in a URL is the same leak as `oaknational`.
 *
 * @packageDocumentation
 */

import { type ScanFile } from '../../core/tracked-file-scan.js';
import { isPathInScope } from '../../hook-policy/matchers.js';
import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

export type { ScanFile };

/** A single lineage-name occurrence. */
export interface LineageNameHit {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly text: string;
}

/** The policy concept name for the lineage-name block. */
const LINEAGE_NAME_CONCEPT = 'lineage-name';

/**
 * Select the lineage-name block from the policy's scoped content blocks.
 *
 * @returns the block, or `undefined` when the policy does not define it.
 */
export function selectLineageNameBlock(
  blocks: readonly ScopedContentBlockGroup[],
): ScopedContentBlockGroup | undefined {
  return blocks.find((block) => block.concept === LINEAGE_NAME_CONCEPT);
}

/** The needle set: the block's declared names, trimmed, deduplicated case-insensitively. */
export function lineageNeedles(block: ScopedContentBlockGroup): string[] {
  const needles: string[] = [];
  for (const candidate of block.patterns.map((pattern) => pattern.trim())) {
    const lower = candidate.toLowerCase();
    if (lower !== '' && !needles.some((needle) => needle.toLowerCase() === lower)) {
      needles.push(candidate);
    }
  }
  return needles;
}

/**
 * Scan one file's content for lineage names, case-insensitively and literally.
 *
 * @remarks
 * Every line is inspected (fences included). At most one hit is recorded per
 * line, enough to flag it; the text recorded is the needle as it appears.
 */
export function findLineageNameHits(
  file: string,
  content: string,
  needles: readonly string[],
): LineageNameHit[] {
  const lowered = needles.map((needle) => needle.toLowerCase());
  const hits: LineageNameHit[] = [];
  content.split('\n').forEach((rawLine, index) => {
    const line = rawLine.toLowerCase();
    for (const needle of lowered) {
      const at = line.indexOf(needle);
      if (at !== -1) {
        hits.push({
          file,
          line: index + 1,
          column: at + 1,
          text: rawLine.slice(at, at + needle.length),
        });
        break;
      }
    }
  });
  return hits;
}

/**
 * Scan many files for lineage names, honouring the block's include / exclude
 * path scoping (via {@link isPathInScope}).
 */
export function scanForLineageNames(
  files: readonly ScanFile[],
  block: ScopedContentBlockGroup,
  needles: readonly string[],
): LineageNameHit[] {
  const hits: LineageNameHit[] = [];
  for (const file of files) {
    if (!isPathInScope(file.path, block.include_paths, block.exclude_paths)) {
      continue;
    }
    hits.push(...findLineageNameHits(file.path, file.content, needles));
  }
  return hits;
}
