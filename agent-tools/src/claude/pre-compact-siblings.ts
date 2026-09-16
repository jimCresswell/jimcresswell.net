/**
 * Which entries beside the session's transcript the Claude Code `PreCompact`
 * observer records.
 *
 * @remarks
 * Loaded from TypeScript source by the hook entry
 * (`src/bin/claude-pre-compact-observe-hook.ts`), so a relative import added
 * here must name its `.ts` file.
 *
 * @packageDocumentation
 */

/** What kind of directory entry a sibling of the transcript is. */
export type SiblingKind = 'file' | 'directory' | 'other';

/** One entry beside the session's transcript: its name and kind, and its size when it is a file that was measured. */
export interface SiblingFile {
  readonly name: string;
  readonly kind: SiblingKind;
  readonly bytes?: number;
}

/** The sibling entries worth measuring, and how many there were before the cap. */
export interface SiblingSelection<T extends { readonly name: string }> {
  readonly entries: readonly T[];
  readonly total: number;
}

/**
 * Choose which entries beside the transcript to record.
 *
 * @param entries - Every entry in the transcript's directory, in whatever order
 *   the filesystem returned them.
 * @param limit - The most entries to keep.
 * @returns The entries sorted by name so repeated observations are comparable,
 *   capped at `limit`, and the full count so a capped list never reads as
 *   complete.
 */
export function selectSiblings<T extends { readonly name: string }>(
  entries: readonly T[],
  limit: number,
): SiblingSelection<T> {
  const sorted = [...entries].sort((left, right) => left.name.localeCompare(right.name));
  return { entries: sorted.slice(0, limit), total: entries.length };
}
