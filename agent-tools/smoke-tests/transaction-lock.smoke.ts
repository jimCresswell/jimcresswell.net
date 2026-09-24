import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, rm, symlink, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { acquireFileTransactionLock } from '../src/collaboration-state/transaction-lock';

/**
 * The collaboration-state transaction lock on a real filesystem: a lock left
 * without its owner file (its holder died between making the directory and
 * writing the file) is reclaimed once its directory is older than the stale
 * age; an entry at the lock path that `mkdir` did not make is never taken
 * for a lock; and a holder's release never removes a lock that has since
 * passed to another owner. Real filesystem IO makes this a smoke; `test:e2e`
 * gates it. A failed owner write is proven through a fake filesystem in the
 * unit tests, since no permission trick fails it on every host and for every
 * user.
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

/**
 * An old entry at the lock path that `mkdir` did not make is no lock, and is
 * never removed: a regular file, a symbolic link to an old directory, or a
 * symbolic link to an old directory holding an old owner file.
 */
async function proveAnEntryThatIsNoLockIsLeftAlone(
  dir: string,
  entry: 'file' | 'link' | 'link-to-an-old-lock',
): Promise<void> {
  const filePath = join(dir, `occupied-by-${entry}.json`);
  const longAgo = new Date(Date.now() - 60_000);
  if (entry === 'file') {
    await writeFile(`${filePath}.transaction`, 'not a lock\n');
    await utimes(`${filePath}.transaction`, longAgo, longAgo);
  } else {
    const target = join(dir, `target-of-${entry}`);
    await mkdir(target);
    if (entry === 'link-to-an-old-lock') {
      const owner = { owner_id: 'long-gone', created_at: longAgo.toISOString() };
      await writeFile(join(target, 'owner.json'), `${JSON.stringify(owner)}\n`);
    }
    await utimes(target, longAgo, longAgo);
    await symlink(target, `${filePath}.transaction`);
  }
  await assert.rejects(
    acquireFileTransactionLock({ filePath, staleMs: STALE_MS, attempts: 2 }),
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

const dir = await mkdtemp(join(tmpdir(), 'transaction-lock-smoke-'));
try {
  await proveAnAgedOwnerlessLockIsReclaimed(dir);
  await proveAFreshOwnerlessLockIsLeftAlone(dir);
  await proveAnEntryThatIsNoLockIsLeftAlone(dir, 'file');
  await proveAnEntryThatIsNoLockIsLeftAlone(dir, 'link');
  await proveAnEntryThatIsNoLockIsLeftAlone(dir, 'link-to-an-old-lock');
  await proveAReleaseLeavesAnotherOwnersLock(dir);
  process.stdout.write('transaction-lock smoke: 6/6 proofs passed\n');
} finally {
  await rm(dir, { recursive: true, force: true });
}
