/**
 * Path scoping for a `ScopedContentBlockGroup`, shared by the write-hook
 * (absolute file paths) and the two whole-tree gates that reuse the policy's
 * blocks (repository-relative paths): lineage names, machine-local paths.
 * The root a root-anchored scope reads against is the caller's: for the hook,
 * the session's project directory; a path outside it matches no anchored
 * scope, so the anchor fails closed, never open.
 */

/** A Windows absolute path: a drive letter with a separator, or a UNC root. */
const WINDOWS_ABSOLUTE = /^(?:[A-Za-z]:[\\/]|\\\\)/u;

/** The path with the host's separators read as `/`, so every scope form compares one way. */
function withSlashes(filePath: string): string {
  return filePath.replaceAll('\\', '/');
}

function isAbsolutePath(filePath: string): boolean {
  return filePath.startsWith('/') || WINDOWS_ABSOLUTE.test(filePath);
}

/**
 * The file path relative to the repository root, when it can be: a relative
 * path as given; an absolute path inside a known root made relative; an
 * absolute path outside the root, or with no root known, `undefined` (it is
 * no repository surface, so no root-anchored scope can name it). Separators
 * are read as `/` on both sides, so a Windows path and root compare too.
 */
function repoRelativePath(filePath: string, repoRoot: string | undefined): string | undefined {
  const file = withSlashes(filePath);
  if (!isAbsolutePath(filePath)) {
    return file;
  }
  if (repoRoot === undefined) {
    return undefined;
  }
  const root = withSlashes(repoRoot);
  const prefix = root.endsWith('/') ? root : `${root}/`;
  return file.startsWith(prefix) ? file.slice(prefix.length) : undefined;
}

/**
 * Whether a repository-relative path is the anchored entry itself or a descendant of it:
 * a directory entry (trailing `/`) is a prefix; a file entry matches exactly or as a
 * directory prefix, never a sibling that merely shares the name (`policy.json.bak`).
 */
function underAnchor(relative: string, anchor: string): boolean {
  if (anchor.endsWith('/')) {
    return relative.startsWith(anchor);
  }
  return relative === anchor || relative.startsWith(`${anchor}/`);
}

/**
 * Match a single path-scope entry against a file path.
 *
 * Entries beginning with `**\/*` (no space) are treated as a suffix match
 * (e.g. `**\/*.plan.md` matches any path ending in `.plan.md`). Entries
 * beginning with `./` are root-anchored: they match a repository-relative
 * path from its first character (`./.agent/memory/` matches
 * `.agent/memory/x.md`, never `docs/.agent/memory/x.md`), so an exemption
 * cannot be claimed by a nested copy of an exempt path (5c-ii). All other
 * entries are treated as substring matches against the file path, which
 * works equivalently for absolute and relative forms because the path
 * always contains its own directory prefix.
 */
function matchesPathScope(filePath: string, scope: string, repoRoot: string | undefined): boolean {
  if (scope.startsWith('**/*')) {
    return withSlashes(filePath).endsWith(scope.slice(4));
  }
  if (scope.startsWith('./')) {
    const relative = repoRelativePath(filePath, repoRoot);
    return relative !== undefined && underAnchor(relative, scope.slice(2));
  }
  return withSlashes(filePath).includes(scope);
}

/**
 * Determine whether a file path is in scope for a `ScopedContentBlockGroup` —
 * matches at least one include and no excludes. `repoRoot` lets a
 * root-anchored scope read an absolute path (the write-hook's form); the
 * whole-tree gates pass repository-relative paths and need no root.
 */
export function isPathInScope(
  filePath: string | undefined,
  includePaths: readonly string[],
  excludePaths: readonly string[] = [],
  repoRoot?: string,
): boolean {
  if (filePath === undefined) {
    return false;
  }
  const matchesInclude = includePaths.some((scope) => matchesPathScope(filePath, scope, repoRoot));
  if (!matchesInclude) {
    return false;
  }
  return !excludePaths.some((scope) => matchesPathScope(filePath, scope, repoRoot));
}
