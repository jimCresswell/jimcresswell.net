/**
 * The projection leg's surface reads: the listing and the single-entry read, each a typed
 * outcome and never a throw past the leg's refusal contract; the mutations and the port the
 * leg takes are next door (`rule-projection-fs.ts`) over the same injected `SurfaceFs`.
 *
 * Nothing here follows a link. The listing walks every path segment of the surface with
 * `lstat`, so a surface root or ancestor that is a symlink is `foreign` before `readdir`
 * could follow it into another tree (the #74 round-one finding, 2026-09-14). The entry
 * read classifies its leaf unfollowed and then reads through a descriptor opened with
 * `O_NOFOLLOW`, checked by `fstat` to be a regular file, so the classification and the
 * read are one open: a link swapped in between them fails the open (`ELOOP`) and reads as
 * `foreign`, never as its target (round three). Each mutation re-classifies its ancestors
 * and its leaf unfollowed immediately before acting and refuses when the entry is not what
 * a projection surface admits (a real directory above, an absent or regular-file leaf);
 * the write is the estate's atomic writer (a synced temp file renamed over the leaf, so a
 * link at the leaf is replaced, never written through) and the removal unlinks the leaf
 * itself. What remains is the window between an ancestor's classification and the mkdir,
 * rename or unlink into it (`rule-projection-fs.ts` says what that admits), closed by nothing
 * short of directory descriptors; on a platform without `O_NOFOLLOW` the unfollowed
 * classification is the read's only guard. ENOENT is the
 * only failure read as absence. The `node:fs` calls are an injected port (`SurfaceFs`), so
 * every order-of-operations claim is proven over an in-memory tree.
 *
 * @packageDocumentation
 */

import { constants } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { writeTextAtomically } from '../../collaboration-state/atomic-file.js';
import { isEnoent } from '../../core/authored-surfaces.js';
import { toLfText } from '../../core/lf-text.js';

import {
  classifyDirectoryEntries,
  type DirectoryEntry,
  type DirectoryListing,
  type EntryRead,
} from './directory-listing.js';

/** What `lstat` says about a path, its leaf unfollowed (`fs.Stats` satisfies it). */
export interface UnfollowedStat {
  isFile(): boolean;
  isDirectory(): boolean;
}

/**
 * The calls the surface helpers make, all on absolute paths; the real `node:fs` by default.
 * `readUnfollowed` reads a regular file through a no-follow open and throws with code
 * `ELOOP` for a link at the leaf and `ENOTREGULAR` (a code of this module's own, not an
 * errno) for any other non-file; `writeAtomically` renames a synced temp file over the leaf;
 * `remove` unlinks the leaf itself.
 */
export interface SurfaceFs {
  lstat: (absolutePath: string) => Promise<UnfollowedStat>;
  readdir: (absolutePath: string) => Promise<readonly DirectoryEntry[]>;
  readUnfollowed: (absolutePath: string) => Promise<string>;
  mkdir: (absolutePath: string) => Promise<void>;
  writeAtomically: (absolutePath: string, text: string) => Promise<void>;
  remove: (absolutePath: string) => Promise<void>;
}

/** The no-follow flag where the platform has one; zero elsewhere (the header says what holds then). */
const NO_FOLLOW = Object.hasOwn(constants, 'O_NOFOLLOW') ? constants.O_NOFOLLOW : 0;

function withCode(message: string, code: string): Error {
  return Object.assign(new Error(message), { code });
}

function codeOf(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : undefined;
}

async function readRegularFileUnfollowed(absolutePath: string): Promise<string> {
  const handle = await fs.open(absolutePath, constants.O_RDONLY | NO_FOLLOW);
  try {
    if (!(await handle.stat()).isFile()) {
      throw withCode(`${absolutePath}: not a regular file`, 'ENOTREGULAR');
    }
    return await handle.readFile('utf8');
  } finally {
    await handle.close();
  }
}

/** The real file system. */
export const realSurfaceFs: SurfaceFs = {
  lstat: (absolutePath) => fs.lstat(absolutePath),
  readdir: (absolutePath) => fs.readdir(absolutePath, { withFileTypes: true }),
  readUnfollowed: readRegularFileUnfollowed,
  mkdir: async (absolutePath) => {
    await fs.mkdir(absolutePath, { recursive: true });
  },
  writeAtomically: (absolutePath, text) => writeTextAtomically(absolutePath, text),
  remove: (absolutePath) => fs.rm(absolutePath),
};

function causeOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function failed(error: unknown): { kind: 'absent' } | { kind: 'unreadable'; cause: string } {
  return isEnoent(error) ? { kind: 'absent' } : { kind: 'unreadable', cause: causeOf(error) };
}

/**
 * The first ancestor of `<repoRoot>/<relDir>` (the directory itself included) that is not a
 * directory when its leaf is left unfollowed, as a listing outcome; `undefined` when every
 * segment is a real directory.
 */
export async function classifyAncestors(
  repoRoot: string,
  relDir: string,
  surfaceFs: SurfaceFs,
): Promise<DirectoryListing | undefined> {
  const segments = relDir.split('/');
  for (let depth = 1; depth <= segments.length; depth += 1) {
    const prefix = segments.slice(0, depth).join('/');
    try {
      if (!(await surfaceFs.lstat(path.join(repoRoot, prefix))).isDirectory()) {
        return { kind: 'foreign', entry: prefix };
      }
    } catch (error: unknown) {
      return failed(error);
    }
  }
  return undefined;
}

/**
 * List the regular files in `<repoRoot>/<relDir>`, sorted, as a typed outcome: absence is
 * ENOENT and nothing else, any other read failure is `unreadable`, and a directory, symlink or
 * special entry, on the surface or as the surface itself or any of its ancestors, is `foreign`
 * before any file is listed (`directory-listing.ts` says why a directory is foreign on a rule
 * surface). A caller that acts destructively on the listing can therefore never read a failure
 * as "nothing here" (the posture `carriage-fs.ts` documents).
 *
 * @param repoRoot  - Absolute path to the repository root.
 * @param relDir    - Repo-relative path to the directory to list.
 * @param extension - File extension that marks a rule file (including the leading dot).
 * @param surfaceFs - The file-system port; the real `node:fs` by default.
 * @returns The listing outcome; file paths are repo-relative.
 */
export async function listDirectory(
  repoRoot: string,
  relDir: string,
  extension: string,
  surfaceFs: SurfaceFs = realSurfaceFs,
): Promise<DirectoryListing> {
  const ancestor = await classifyAncestors(repoRoot, relDir, surfaceFs);
  if (ancestor !== undefined) {
    return ancestor;
  }
  try {
    const entries = await surfaceFs.readdir(path.join(repoRoot, relDir));
    return classifyDirectoryEntries(relDir, entries, extension);
  } catch (error: unknown) {
    return failed(error);
  }
}

/**
 * Read the regular file at `<repoRoot>/<relPath>` as a typed outcome: its leaf is classified
 * unfollowed first (a directory or link is `foreign` before any open), then read through a
 * no-follow open checked to be a regular file, so a link swapped in after the classification
 * is `foreign` too; ENOENT alone is `absent`; any other failure is `unreadable` with its
 * cause. Text is LF-normalised as `readText` normalises it.
 *
 * @param repoRoot  - Absolute path to the repository root.
 * @param relPath   - Repo-relative path to the file.
 * @param surfaceFs - The file-system port; the real `node:fs` by default.
 * @returns The read outcome.
 */
export async function readEntry(
  repoRoot: string,
  relPath: string,
  surfaceFs: SurfaceFs = realSurfaceFs,
): Promise<EntryRead> {
  const absolutePath = path.join(repoRoot, relPath);
  try {
    if (!(await surfaceFs.lstat(absolutePath)).isFile()) {
      return { kind: 'foreign' };
    }
    return { kind: 'text', text: toLfText(await surfaceFs.readUnfollowed(absolutePath)) };
  } catch (error: unknown) {
    const code = codeOf(error);
    return code === 'ELOOP' || code === 'ENOTREGULAR' ? { kind: 'foreign' } : failed(error);
  }
}
