/**
 * Which git repository a file belongs to, for a content block whose concept
 * covers only this repository's own files (`excludes_other_repositories`).
 *
 * @remarks
 * A repository is known by its common git directory: a primary checkout's
 * `.git` directory, which every worktree of it shares through the `gitdir`
 * line of its `.git` file and the `commondir` file beside that gitdir. So
 * this repository's worktrees read as this repository wherever they sit on
 * disk, and a checkout of any other repository reads as another. Two common
 * directories are compared by identity (device and inode on disk), never by
 * spelling, so a path spelt in another letter case, through a firmlink or
 * through a symbolic link names the one repository it reaches.
 *
 * The walk starts where the file really is (its real path, or its nearest
 * existing directory's for a new file, so a link on the way is followed to
 * where the write lands) and climbs to the nearest `.git` entry, reading the
 * disk only through the {@link RepositoryProbe} seam. A git directory counts
 * only when it holds a `HEAD`, as git itself requires.
 *
 * A file reads as in another repository only when its repository is found
 * and differs from this one's. A file in no repository, a `.git` entry that
 * cannot be read or is neither a directory nor a file, a `commondir` that
 * cannot be read, a path deeper than the climb allows, a relative path, or
 * an unknown own repository all read as not another repository, so an
 * exempting block keeps applying: the exemption fails closed, never open.
 *
 * @packageDocumentation
 */

import { lstatSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

/** What reading a file gave: its text, no such file, or a file that could not be read. */
type FileReading =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'absent' }
  | { readonly kind: 'unreadable' };

/** What `<directory>/.git` is: a git directory, a pointer file, nothing, or anything else. */
type GitEntry = 'directory' | 'file' | 'absent' | 'unknown';

/** The disk reads the walk makes, injectable so the walk is tested over literal layouts. */
export interface RepositoryProbe {
  /** What `<directory>/.git` is; `unknown` for any other kind of entry or a failed read. */
  readonly gitEntry: (directory: string) => GitEntry;
  /** A regular file's text, or why there is none. */
  readonly readText: (filePath: string) => FileReading;
  /** A path's real path (links followed, the disk's own letter case), or `null` when it does not exist. */
  readonly realPath: (filePath: string) => string | null;
  /** A directory's identity on disk, or `null` when it is not a directory that can be read. */
  readonly identity: (directory: string) => string | null;
}

/** The most directories either climb visits; a deeper path names nothing, keeping the block. */
const MAX_CLIMB = 256;

/** The `gitdir: <path>` line of a worktree's or submodule's `.git` file. */
const GITDIR_LINE = /^gitdir:[ \t]*(.+?)[ \t]*$/mu;

/**
 * The first directory, from `start` upward, that `found` names something for,
 * within {@link MAX_CLIMB} steps; `undefined` at the filesystem root or the cap.
 */
function climb<T>(start: string, found: (directory: string) => T | undefined): T | undefined {
  let directory = start;
  for (let step = 0; step < MAX_CLIMB; step += 1) {
    const result = found(directory);
    if (result !== undefined) {
      return result;
    }
    const parent = dirname(directory);
    if (parent === directory) {
      return undefined;
    }
    directory = parent;
  }
  return undefined;
}

/** The directory where a file really is: its own real path's, or its nearest existing directory's. */
function realDirectoryOf(filePath: string, probe: RepositoryProbe): string | undefined {
  const real = probe.realPath(filePath);
  if (real !== null) {
    return dirname(real);
  }
  return climb(dirname(filePath), (directory) => probe.realPath(directory) ?? undefined);
}

/** The git directory a pointer file names, or `undefined` when it names none. */
function pointedGitDirectory(directory: string, probe: RepositoryProbe): string | undefined {
  const reading = probe.readText(join(directory, '.git'));
  const pointer = reading.kind === 'text' ? GITDIR_LINE.exec(reading.text)?.[1] : undefined;
  return pointer === undefined ? undefined : resolve(directory, pointer);
}

/**
 * A git directory's common directory: the one its `commondir` names, or itself
 * when it has none (git's own reading); `undefined` when `commondir` cannot be
 * read or names nothing.
 */
function commonOf(gitDirectory: string, probe: RepositoryProbe): string | undefined {
  const reading = probe.readText(join(gitDirectory, 'commondir'));
  if (reading.kind === 'absent') {
    return gitDirectory;
  }
  const pointer = reading.kind === 'text' ? reading.text.trim() : '';
  return pointer.length === 0 ? undefined : resolve(gitDirectory, pointer);
}

/** The identity of the repository whose `.git` entry sits in `directory`, if it is a valid one. */
function identityAt(directory: string, entry: 'directory' | 'file', probe: RepositoryProbe) {
  const gitDirectory =
    entry === 'directory' ? join(directory, '.git') : pointedGitDirectory(directory, probe);
  const common = gitDirectory === undefined ? undefined : commonOf(gitDirectory, probe);
  if (common === undefined || probe.readText(join(common, 'HEAD')).kind !== 'text') {
    return undefined;
  }
  return probe.identity(common) ?? undefined;
}

/**
 * The identity of the repository holding a directory: its nearest `.git`
 * entry's common git directory. `null` stands for a `.git` entry found and
 * not understood, which stops the climb as surely as an answer does.
 */
function identityFrom(start: string, probe: RepositoryProbe): string | undefined {
  const found = climb(start, (directory): string | null | undefined => {
    const entry = probe.gitEntry(directory);
    if (entry === 'absent') {
      return undefined;
    }
    return entry === 'unknown' ? null : (identityAt(directory, entry, probe) ?? null);
  });
  return found ?? undefined;
}

/**
 * The identity of the repository holding `filePath`: its common git
 * directory's, found from where the file really is.
 *
 * @param filePath - An absolute path; the file itself need not exist yet.
 * @param probe - The disk reads.
 * @returns The identity, or `undefined` when the file is in no repository or
 *   its repository cannot be read.
 */
export function repositoryIdentity(filePath: string, probe: RepositoryProbe): string | undefined {
  const start = realDirectoryOf(filePath, probe);
  return start === undefined ? undefined : identityFrom(start, probe);
}

/**
 * Whether `filePath` lies in a git repository other than this one.
 *
 * @param filePath - The file a content change targets.
 * @param ownIdentity - This repository's identity, when known.
 * @param probe - The disk reads.
 * @returns `true` only when the file's repository is found and differs from
 *   this one; every unknown reads as `false` (fail closed).
 */
export function isInOtherRepository(
  filePath: string,
  ownIdentity: string | undefined,
  probe: RepositoryProbe,
): boolean {
  if (ownIdentity === undefined || !isAbsolute(filePath)) {
    return false;
  }
  const fileIdentity = repositoryIdentity(filePath, probe);
  return fileIdentity !== undefined && fileIdentity !== ownIdentity;
}

/** Whether a failed file-system call failed because the path does not exist. */
function isMissing(error: unknown): boolean {
  return (
    error instanceof Error && 'code' in error && ['ENOENT', 'ENOTDIR'].includes(String(error.code))
  );
}

/** Read a regular file; anything else (a directory, a pipe, a link) reads as unreadable. */
function readRegularFile(filePath: string): FileReading {
  try {
    if (!lstatSync(filePath).isFile()) {
      return { kind: 'unreadable' };
    }
    return { kind: 'text', text: readFileSync(filePath, 'utf8') };
  } catch (error) {
    return isMissing(error) ? { kind: 'absent' } : { kind: 'unreadable' };
  }
}

/** The live disk reads: `lstat`, `readFile`, native `realpath` and `stat`. */
const diskRepositoryProbe: RepositoryProbe = {
  gitEntry: (directory) => {
    try {
      const stats = lstatSync(join(directory, '.git'));
      if (stats.isDirectory()) {
        return 'directory';
      }
      return stats.isFile() ? 'file' : 'unknown';
    } catch (error) {
      return isMissing(error) ? 'absent' : 'unknown';
    }
  },
  readText: readRegularFile,
  realPath: (filePath) => {
    try {
      return realpathSync.native(filePath);
    } catch {
      return null;
    }
  },
  identity: (directory) => {
    try {
      const stats = statSync(directory, { bigint: true });
      return stats.isDirectory() ? `${String(stats.dev)}:${String(stats.ino)}` : null;
    } catch {
      return null;
    }
  },
};

/**
 * The hook's test for a file in another repository: "another" is judged
 * against the repository `repoRoot` is in, whose identity is read once, on
 * the first file asked about, so a request that asks nothing reads nothing.
 *
 * @param repoRoot - The session's project directory.
 * @param probe - The disk reads; the live ones by default.
 * @returns Whether a file lies in a repository other than `repoRoot`'s.
 */
export function otherRepositoryTest(
  repoRoot: string,
  probe: RepositoryProbe = diskRepositoryProbe,
): (filePath: string) => boolean {
  let own: { readonly identity: string | undefined } | undefined;
  return (filePath) => {
    if (own === undefined) {
      const root = probe.realPath(repoRoot);
      own = { identity: root === null ? undefined : identityFrom(root, probe) };
    }
    return isInOtherRepository(filePath, own.identity, probe);
  };
}
