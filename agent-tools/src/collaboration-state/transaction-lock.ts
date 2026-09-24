import { lstat, readFile } from 'node:fs/promises';

import { nodeLockFileSystem, tryCreateLock } from './transaction-lock-create.js';
import { isStaleLock } from './transaction-lock-staleness.js';

/**
 * Take the transaction lock beside `filePath`: a directory made exclusively,
 * holding an owner file with this holder's id and start time. A waiter may
 * reclaim a stale lock ({@link isStaleLock}), including one whose holder died
 * before writing its owner file. The returned release removes the lock only
 * while its owner file still names this holder, so a holder whose lock was
 * reclaimed does not remove a lock whose owner file names another holder (a
 * window between the read and the removal remains). Only a directory at the
 * lock path is ever reclaimed. Two waiters that find one lock stale at once
 * can both remove it, the second removing the lock the first has just made.
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

async function releaseOwnLock(lockDir: string, ownerId: string): Promise<void> {
  const metadata = await readLockMetadata(lockDir);
  if (metadata?.owner_id === ownerId) {
    await nodeLockFileSystem.rm(lockDir);
  }
}

/**
 * Remove the lock at `lockDir` if it is stale. The entry's kind is checked
 * before its owner file is read, so no owner file read through a symbolic
 * link ever dates an entry `mkdir` did not make.
 */
async function removeStaleLock(lockDir: string, staleMs: number): Promise<void> {
  const modifiedMs = await directoryModifiedMs(lockDir);
  if (modifiedMs === undefined) {
    return;
  }
  const metadata = await readLockMetadata(lockDir);
  const stale = isStaleLock({
    ownerCreatedAt: metadata?.created_at,
    directoryModifiedMs: modifiedMs,
    nowMs: Date.now(),
    staleMs,
  });
  if (stale) {
    await nodeLockFileSystem.rm(lockDir);
  }
}

/**
 * The lock directory's modification time, or `undefined` when nothing is
 * there or the entry is not a directory: a regular file or a symbolic link at
 * the lock path was not made by `mkdir`, so its own age is no evidence of a
 * dead holder.
 */
async function directoryModifiedMs(lockDir: string): Promise<number | undefined> {
  try {
    const entry = await lstat(lockDir);
    return entry.isDirectory() ? entry.mtimeMs : undefined;
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
