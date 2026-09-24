import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';

import { isStaleLock } from './transaction-lock-staleness.js';

/**
 * Take the transaction lock beside `filePath`: a directory made exclusively,
 * holding an owner file with this holder's id and start time. A waiter may
 * reclaim a stale lock ({@link isStaleLock}), including one whose holder died
 * before writing its owner file. The returned release removes the lock only
 * while its owner file still names this holder, so a holder whose lock was
 * reclaimed does not remove a lock whose owner file names another holder (a
 * window between the read and the removal remains).
 */
export async function acquireFileTransactionLock(input: {
  readonly filePath: string;
  readonly staleMs: number;
  readonly attempts: number;
}): Promise<() => Promise<void>> {
  const lockDir = `${input.filePath}.transaction`;
  for (let attempt = 1; attempt <= input.attempts; attempt += 1) {
    const ownerId = await tryCreateLock(lockDir);
    if (ownerId !== undefined) {
      return () => releaseOwnLock(lockDir, ownerId);
    }
    await removeStaleLock(lockDir, input.staleMs);
    await delay(Math.min(attempt * 10, 100));
  }

  throw new Error(`could not acquire state transaction for ${input.filePath}`);
}

/**
 * Make the lock directory and write its owner file, returning the owner id,
 * or `undefined` when another holder has the directory. If the owner file
 * cannot be written, the directory is removed again before the write's error
 * goes up, so a failed write leaves no ownerless lock behind; a holder killed
 * between the two steps still does, and waiters reclaim that by its age.
 */
async function tryCreateLock(lockDir: string): Promise<string | undefined> {
  try {
    await mkdir(lockDir);
  } catch (error) {
    if (isFileExistsError(error)) {
      return undefined;
    }
    throw error;
  }
  const metadata = lockMetadata();
  try {
    await writeFile(`${lockDir}/owner.json`, `${JSON.stringify(metadata, null, 2)}\n`);
  } catch (error) {
    // A failed removal is not reported: the write's error is the cause, and
    // an ownerless directory left behind is reclaimed by its age.
    await rm(lockDir, { recursive: true, force: true }).catch(() => undefined);
    throw error;
  }
  return metadata.owner_id;
}

async function releaseOwnLock(lockDir: string, ownerId: string): Promise<void> {
  const metadata = await readLockMetadata(lockDir);
  if (metadata?.owner_id === ownerId) {
    await rm(lockDir, { recursive: true, force: true });
  }
}

async function removeStaleLock(lockDir: string, staleMs: number): Promise<void> {
  const metadata = await readLockMetadata(lockDir);
  const stale = isStaleLock({
    ownerCreatedAt: metadata?.created_at,
    directoryModifiedMs: await directoryModifiedMs(lockDir),
    nowMs: Date.now(),
    staleMs,
  });
  if (stale) {
    await rm(lockDir, { recursive: true, force: true });
  }
}

async function directoryModifiedMs(lockDir: string): Promise<number | undefined> {
  try {
    return (await stat(lockDir)).mtimeMs;
  } catch {
    return undefined;
  }
}

interface LockMetadata {
  readonly owner_id?: string;
  readonly created_at?: string;
}

async function readLockMetadata(lockDir: string): Promise<LockMetadata | undefined> {
  try {
    const parsed: unknown = JSON.parse(await readFile(`${lockDir}/owner.json`, 'utf8'));
    return isLockMetadata(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function lockMetadata(): { readonly owner_id: string; readonly created_at: string } {
  return {
    owner_id: randomUUID(),
    created_at: new Date().toISOString(),
  };
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function isLockMetadata(value: unknown): value is LockMetadata {
  return (
    typeof value === 'object' &&
    value !== null &&
    (!('owner_id' in value) || typeof value.owner_id === 'string') &&
    (!('created_at' in value) || typeof value.created_at === 'string')
  );
}

function isFileExistsError(error: unknown): error is Error & { readonly code: 'EEXIST' } {
  return error instanceof Error && 'code' in error && error.code === 'EEXIST';
}
