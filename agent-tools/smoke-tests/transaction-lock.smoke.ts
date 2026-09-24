import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, rm, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { acquireFileTransactionLock } from '../src/collaboration-state/transaction-lock';

/**
 * The collaboration-state transaction lock on a real filesystem: a lock left
 * without its owner file (its holder died between making the directory and
 * writing the file) is reclaimed once its directory is older than the stale
 * age, and a holder's release never removes a lock that has since passed to
 * another owner. Real filesystem IO makes this a smoke; `test:e2e` gates it.
 */

const STALE_MS = 1000;

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function proveAnAgedOwnerlessLockIsReclaimed(dir: string): Promise<void> {
  const filePath = join(dir, 'aged.json');
  await mkdir(`${filePath}.transaction`);
  const longAgo = new Date(Date.now() - 60_000);
  await utimes(`${filePath}.transaction`, longAgo, longAgo);
  const release = await acquireFileTransactionLock({ filePath, staleMs: STALE_MS, attempts: 3 });
  await release();
  assert.equal(await exists(`${filePath}.transaction`), false);
}

async function proveAFreshOwnerlessLockIsLeftAlone(dir: string): Promise<void> {
  const filePath = join(dir, 'fresh.json');
  await mkdir(`${filePath}.transaction`);
  await assert.rejects(
    acquireFileTransactionLock({ filePath, staleMs: 60_000, attempts: 2 }),
    /could not acquire/u,
  );
  assert.equal(await exists(`${filePath}.transaction`), true);
}

async function proveAReleaseLeavesAnotherOwnersLock(dir: string): Promise<void> {
  const filePath = join(dir, 'passed-on.json');
  const release = await acquireFileTransactionLock({ filePath, staleMs: STALE_MS, attempts: 3 });
  // Another waiter found this lock stale and took it: the owner file now names it.
  await writeFile(
    `${filePath}.transaction/owner.json`,
    `${JSON.stringify({ owner_id: 'another-owner', created_at: new Date().toISOString() })}\n`,
  );
  await release();
  assert.equal(await exists(`${filePath}.transaction`), true);
}

/**
 * A umask of 0o222 makes the fresh lock directory read-only, so the owner
 * file cannot be written (EACCES); the directory must not be left behind.
 * Under root the write would succeed and this proof fails loudly.
 */
async function proveAFailedOwnerWriteLeavesNoLock(dir: string): Promise<void> {
  const filePath = join(dir, 'unwritable.json');
  const previous = process.umask(0o222);
  try {
    await assert.rejects(acquireFileTransactionLock({ filePath, staleMs: 60_000, attempts: 1 }), {
      code: 'EACCES',
    });
  } finally {
    process.umask(previous);
  }
  assert.equal(await exists(`${filePath}.transaction`), false);
}

const dir = await mkdtemp(join(tmpdir(), 'transaction-lock-smoke-'));
try {
  await proveAnAgedOwnerlessLockIsReclaimed(dir);
  await proveAFreshOwnerlessLockIsLeftAlone(dir);
  await proveAReleaseLeavesAnotherOwnersLock(dir);
  await proveAFailedOwnerWriteLeavesNoLock(dir);
  process.stdout.write('transaction-lock smoke: 4/4 proofs passed\n');
} finally {
  await rm(dir, { recursive: true, force: true });
}
