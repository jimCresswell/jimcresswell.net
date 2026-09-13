/**
 * The file universe of the root format and markdown gates, and the argv each
 * tool takes over it.
 *
 * The universe is what git records — the tracked tree for the root gates, the
 * staged set for the pre-commit hook — never a disk walk. A walk lints
 * whatever the machine happens to carry (a generated read model, an editor's
 * workspace file, a build output) and so proves that machine, not the
 * repository: the "green here, red in CI" class. Existence therefore comes
 * from git and is never declared; only ownership (which tracked surfaces a
 * tool formats) stays declared, in each tool's own ignore file.
 *
 * Pure: every function maps captured git output or a file list to a value, so
 * the composition root in `repo-check.ts` owns the only process edge.
 *
 * @packageDocumentation
 */

const NUL = '\0';
const SYMLINK_MODE_PREFIX = '120000 ';

/**
 * Split NUL-separated git output (the `-z` form) into paths.
 *
 * @param stdout - Captured stdout of a `-z` git command.
 * @returns The paths in order, without the trailing empty record.
 *
 * @example
 * ```ts
 * parseNulSeparatedPaths('a.md\0b/c.ts\0'); // ['a.md', 'b/c.ts']
 * ```
 */
export function parseNulSeparatedPaths(stdout: string): readonly string[] {
  return stdout.split(NUL).filter((entry) => entry.length > 0);
}

/**
 * Repo-relative paths of index entries that are symbolic links, read from
 * `git ls-files --cached -s -z` (`<mode> <object> <stage>\t<path>`).
 *
 * A symlink carries no formattable content of its own: the linked target is
 * checked under its real path, and prettier refuses symlink paths outright.
 *
 * @param lsFilesStageOutput - Captured stdout of `git ls-files --cached -s -z`.
 * @returns The symlink paths.
 */
export function parseSymlinkPaths(lsFilesStageOutput: string): ReadonlySet<string> {
  const symlinks = new Set<string>();
  for (const record of parseNulSeparatedPaths(lsFilesStageOutput)) {
    if (!record.startsWith(SYMLINK_MODE_PREFIX)) {
      continue;
    }
    // The first tab ends the metadata; the path may itself carry tabs, which
    // the -z form preserves, so split there and nowhere else.
    const delimiter = record.indexOf('\t');
    if (delimiter !== -1) {
      symlinks.add(record.slice(delimiter + 1));
    }
  }
  return symlinks;
}

/**
 * The files that are not symlinks.
 *
 * @param files - Candidate repo-relative paths.
 * @param symlinks - The symlink paths to drop.
 * @returns `files` in order, without any member of `symlinks`.
 */
export function withoutSymlinks(
  files: readonly string[],
  symlinks: ReadonlySet<string>,
): readonly string[] {
  return files.filter((file) => !symlinks.has(file));
}

/**
 * The Markdown files among the given paths.
 *
 * @param files - Repo-relative paths.
 * @returns The paths ending in `.md`, in order.
 */
export function markdownOnly(files: readonly string[]): readonly string[] {
  return files.filter((file) => file.endsWith('.md'));
}

/** Prettier runs read-only (`check`) or as the repair (`write`). */
export type PrettierMode = 'check' | 'write';

/**
 * The `pnpm exec` argv that runs prettier over exactly the given files.
 *
 * `--ignore-unknown` is load-bearing: the tracked universe carries every file
 * type the repository holds, and prettier must skip what it has no parser for
 * rather than fail. `.prettierignore` still applies to explicitly named
 * paths, so ownership exclusions hold. The write mode keeps prettier's cache;
 * a check never reads one, so a proof of the tree is never a proof of a cache.
 *
 * @param mode - Read-only check or the repair.
 * @param files - Repo-relative paths to format.
 * @returns Arguments for `pnpm`.
 */
export function prettierArgs(mode: PrettierMode, files: readonly string[]): readonly string[] {
  const modeArgs = mode === 'check' ? ['--check'] : ['--write', '--cache'];
  return ['exec', 'prettier', ...modeArgs, '--ignore-unknown', ...files];
}

/** markdownlint runs read-only (`check`) or as the repair (`fix`). */
export type MarkdownlintMode = 'check' | 'fix';

/**
 * The `pnpm exec` argv that runs markdownlint-cli2 over exactly the given
 * files.
 *
 * `--no-globs` is load-bearing, not redundant: it tells markdownlint-cli2 to
 * lint ONLY the explicit paths instead of unioning them with a `globs` array
 * from `.markdownlint-cli2.jsonc`. The config's rules and `ignores` still
 * apply, so an explicitly named but excluded file is skipped.
 *
 * @param mode - Read-only check or the repair.
 * @param files - Repo-relative Markdown paths to lint.
 * @returns Arguments for `pnpm`.
 */
export function markdownlintArgs(
  mode: MarkdownlintMode,
  files: readonly string[],
): readonly string[] {
  const modeArgs = mode === 'fix' ? ['--fix'] : [];
  return ['exec', 'markdownlint-cli2', '--no-globs', ...modeArgs, ...files];
}
