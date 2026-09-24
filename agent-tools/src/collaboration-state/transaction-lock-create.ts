import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';

/** The filesystem calls a lock takes: `node:fs/promises` in production. */
export interface LockFileSystem {
  /** Make a directory exclusively, failing with EEXIST when anything is at the path. */
  readonly mkdir: (path: string) => Promise<unknown>;
  readonly writeFile: (path: string, text: string) => Promise<void>;
  /** Remove a directory and its contents; a missing path is not an error. */
  readonly rm: (path: string) => Promise<void>;
}

/** The production lock filesystem, whose `rm` also removes every lock a holder releases or a waiter reclaims. */
export const nodeLockFileSystem: LockFileSystem = {
  mkdir: async (path) => mkdir(path),
  writeFile: async (path, text) => writeFile(path, text),
  rm: async (path) => rm(path, { recursive: true, force: true }),
};

/**
 * Make the lock directory and write its owner file, returning the owner id,
 * or `undefined` when another holder has the directory. If the owner file
 * cannot be written, the directory is removed again before the write's error
 * goes up, so a failed write leaves no ownerless lock behind; a holder killed
 * between the two steps still does, and waiters reclaim that by its age.
 * `fs` is the filesystem the lock is made on.
 */
export async function tryCreateLock(
  lockDir: string,
  fs: LockFileSystem = nodeLockFileSystem,
): Promise<string | undefined> {
  try {
    await fs.mkdir(lockDir);
  } catch (error) {
    if (isFileExistsError(error)) {
      return undefined;
    }
    throw error;
  }
  const metadata = lockMetadata();
  try {
    await fs.writeFile(`${lockDir}/owner.json`, `${JSON.stringify(metadata, null, 2)}\n`);
  } catch (error) {
    // A failed removal is not reported: the write's error is the cause, and
    // an ownerless directory left behind is reclaimed by its age.
    await fs.rm(lockDir).catch(() => undefined);
    throw error;
  }
  return metadata.owner_id;
}

function lockMetadata(): { readonly owner_id: string; readonly created_at: string } {
  return {
    owner_id: randomUUID(),
    created_at: new Date().toISOString(),
  };
}

function isFileExistsError(error: unknown): error is Error & { readonly code: 'EEXIST' } {
  return error instanceof Error && 'code' in error && error.code === 'EEXIST';
}
