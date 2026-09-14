/**
 * The projection leg's mutations and the port it takes: each write and removal re-classifies
 * its ancestors and its leaf unfollowed immediately before acting (`rule-surface-fs.ts`) and
 * refuses when the entry is not what a projection surface admits (a real directory above,
 * an absent or regular-file leaf); the write is the estate's atomic writer (a synced temp
 * file renamed over the leaf, so a link at the leaf is replaced, never written through) and
 * the removal unlinks the leaf itself (the #74 round-three finding, 2026-09-14). What
 * remains is the window between an ancestor's classification and the rename into it, named
 * here and closed by nothing short of directory descriptors. Every outcome is typed, so the
 * leg ends a fix run at the first refusal with what it had written on record.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@engraph/result';

import { isEnoent } from '../../core/authored-surfaces.js';

import type { DirectoryListing, EntryRead } from './directory-listing.js';
import {
  classifyAncestors,
  listDirectory,
  readEntry,
  realSurfaceFs,
  type SurfaceFs,
} from './rule-surface-fs.js';

const REFUSING = 'refusing the projection write';

/** Every ancestor a real directory (created when absent for a write), else the refusal. */
async function admitAncestors(
  repoRoot: string,
  relPath: string,
  surfaceFs: SurfaceFs,
  create: boolean,
): Promise<Result<undefined, string>> {
  const relDir = path.posix.dirname(relPath);
  const ancestor =
    relDir === '.' ? undefined : await classifyAncestors(repoRoot, relDir, surfaceFs);
  if (ancestor === undefined || ancestor.kind === 'files') {
    return ok(undefined);
  }
  if (ancestor.kind === 'absent' && create) {
    await surfaceFs.mkdir(path.join(repoRoot, relDir));
    return ok(undefined);
  }
  if (ancestor.kind === 'foreign') {
    return err(`${ancestor.entry}: not a directory at the moment of the write; ${REFUSING}`);
  }
  const why = ancestor.kind === 'absent' ? 'vanished' : `unreadable (${ancestor.cause})`;
  return err(`${relDir}: ${why}; ${REFUSING}`);
}

/** The leaf as `lstat` finds it at the moment of the mutation. */
async function leafKind(
  absolutePath: string,
  surfaceFs: SurfaceFs,
): Promise<'absent' | 'file' | 'other'> {
  try {
    return (await surfaceFs.lstat(absolutePath)).isFile() ? 'file' : 'other';
  } catch (error: unknown) {
    if (isEnoent(error)) {
      return 'absent';
    }
    throw error;
  }
}

/**
 * Write a projection at `<repoRoot>/<relPath>`: ancestors admitted (created when absent), the
 * leaf absent or a regular file at the moment of the write, then the atomic writer.
 */
export async function writeProjection(
  repoRoot: string,
  relPath: string,
  text: string,
  surfaceFs: SurfaceFs = realSurfaceFs,
): Promise<Result<undefined, string>> {
  const admitted = await admitAncestors(repoRoot, relPath, surfaceFs, true);
  if (!admitted.ok) {
    return admitted;
  }
  const absolutePath = path.join(repoRoot, relPath);
  if ((await leafKind(absolutePath, surfaceFs)) === 'other') {
    return err(`${relPath}: not a regular file at the moment of the write; ${REFUSING}`);
  }
  await surfaceFs.writeAtomically(absolutePath, text);
  return ok(undefined);
}

/**
 * Remove a stale projection at `<repoRoot>/<relPath>`: ancestors admitted, the leaf a regular
 * file at the moment of the removal, then the leaf itself unlinked.
 */
export async function removeProjection(
  repoRoot: string,
  relPath: string,
  surfaceFs: SurfaceFs = realSurfaceFs,
): Promise<Result<undefined, string>> {
  const admitted = await admitAncestors(repoRoot, relPath, surfaceFs, false);
  if (!admitted.ok) {
    return admitted;
  }
  const absolutePath = path.join(repoRoot, relPath);
  if ((await leafKind(absolutePath, surfaceFs)) !== 'file') {
    return err(
      `${relPath}: not a regular file at the moment of the removal; refusing to remove it`,
    );
  }
  await surfaceFs.remove(absolutePath);
  return ok(undefined);
}

/** The file-system operations the projection leg needs, repo-relative, every one a typed outcome. */
export interface RuleProjectionFs {
  listDirectory: (relDir: string, extension: string) => Promise<DirectoryListing>;
  readEntry: (relPath: string) => Promise<EntryRead>;
  writeText: (relPath: string, text: string) => Promise<Result<undefined, string>>;
  removeFile: (relPath: string) => Promise<Result<undefined, string>>;
}

/** The real port over `<repoRoot>`. */
export function realRuleProjectionFs(repoRoot: string): RuleProjectionFs {
  return {
    listDirectory: (relDir, extension) => listDirectory(repoRoot, relDir, extension),
    readEntry: (relPath) => readEntry(repoRoot, relPath),
    writeText: (relPath, text) => writeProjection(repoRoot, relPath, text),
    removeFile: (relPath) => removeProjection(repoRoot, relPath),
  };
}
