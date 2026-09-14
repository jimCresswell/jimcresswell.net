/**
 * The typed outcome of listing a rule surface, and the pure classification
 * behind it. The projection leg acts destructively on a listing (`--fix`
 * removes a projection no rule renders), so a listing never reads a failure
 * as "nothing here": absence is ENOENT and nothing else, any other read
 * failure is `unreadable`, and an entry that is not a regular file is
 * `foreign` before any file is listed. A directory is foreign too: the rule
 * surfaces are flat (the canonical set admits no nested rule), and Claude
 * Code loads `.claude/rules/` recursively, so a nested hand-authored file
 * would be read by the platform and unseen by the gate (the 2a code-expert
 * finding, 2026-09-14).
 */

/** What listing a directory found: the closed set of outcomes a caller must handle. */
export type DirectoryListing =
  | { readonly kind: 'absent' }
  | { readonly kind: 'unreadable'; readonly cause: string }
  /** An entry that is not a regular file: a directory, a symlink or a special file. */
  | { readonly kind: 'foreign'; readonly entry: string }
  | { readonly kind: 'files'; readonly files: readonly string[] };

/** The two facts about a directory entry the classification reads (`fs.Dirent` satisfies it). */
export interface DirectoryEntry {
  readonly name: string;
  isFile(): boolean;
}

/**
 * Classify a directory's entries: the first entry in name order that is not a
 * regular file makes the listing `foreign`; otherwise the regular files with
 * the extension, sorted, as repo-relative paths.
 */
export function classifyDirectoryEntries(
  relDir: string,
  entries: readonly DirectoryEntry[],
  extension: string,
): DirectoryListing {
  const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name));
  const foreign = sorted.find((entry) => !entry.isFile());
  if (foreign !== undefined) {
    return { kind: 'foreign', entry: `${relDir}/${foreign.name}` };
  }
  return {
    kind: 'files',
    files: sorted
      .filter((entry) => entry.name.endsWith(extension))
      .map((entry) => `${relDir}/${entry.name}`),
  };
}
