/**
 * The real reads behind the rule-projection leg's file-system port: a surface listing and a
 * single-entry read, each a typed outcome and never a throw past the leg's refusal contract.
 *
 * Both classify before they follow anything. The listing walks every path segment of the
 * surface with `lstat`, so a surface root or ancestor that is a symlink is `foreign` before
 * `readdir` could follow it into another tree (the #74 round-one finding, 2026-09-14); the
 * entry read `lstat`s its leaf the same way, so a symlinked index or projection is refused
 * rather than read and later written through. ENOENT is the only failure read as absence.
 * The three `node:fs` calls are an injected port (`SurfaceFs`), so the classify-before-follow
 * order is proven over an in-memory tree that says what each path is.
 *
 * Named, not closed: the classification and the leg's later write are separate calls, so a
 * link swapped in between them is followed by the write (a removal is safe: `rm` on a link
 * removes the link). The structural cure is a no-follow open on the leaf, POSIX-only, and
 * is follow-on work; the sweep's port (`sweep-fs.ts`) documents the same window.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises';
import path from 'node:path';

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

/** The three reads the surface helpers make, all on absolute paths; the real `node:fs` by default. */
export interface SurfaceFs {
  lstat: (absolutePath: string) => Promise<UnfollowedStat>;
  readdir: (absolutePath: string) => Promise<readonly DirectoryEntry[]>;
  readFile: (absolutePath: string) => Promise<string>;
}

/** The real file system. */
const realSurfaceFs: SurfaceFs = {
  lstat: (absolutePath) => fs.lstat(absolutePath),
  readdir: (absolutePath) => fs.readdir(absolutePath, { withFileTypes: true }),
  readFile: (absolutePath) => fs.readFile(absolutePath, 'utf8'),
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
async function classifyAncestors(
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
 * unfollowed first, so a symlink is `foreign` rather than read through; ENOENT alone is
 * `absent`; any other failure, of the classification or the read, is `unreadable` with its
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
    return { kind: 'text', text: toLfText(await surfaceFs.readFile(absolutePath)) };
  } catch (error: unknown) {
    return failed(error);
  }
}
