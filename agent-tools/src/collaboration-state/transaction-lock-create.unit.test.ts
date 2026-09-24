import { describe, expect, it } from 'vitest';

import { tryCreateLock, type LockFileSystem } from './transaction-lock-create.js';

/**
 * Making a transaction lock: the directory, made exclusively, then its owner
 * file. A holder whose owner file cannot be written removes its directory
 * before the write's error goes up, so the failure leaves no ownerless lock.
 * The filesystem is an in-memory fake whose entries map each path to a file's
 * text or to a directory mark; a removal completes on a later turn, as a real
 * one does. Tests read what the lock leaves on it.
 */

const LOCK_DIR = '/state/claims.json.transaction';
const OWNER_FILE = `${LOCK_DIR}/owner.json`;
const DIRECTORY = '<directory>';

function failure(code: string): Error {
  return Object.assign(new Error(`${code}: refused`), { code });
}

function rejectWith(error: Error): () => Promise<never> {
  return async () => Promise.reject(error);
}

function memoryFileSystem(entries: Map<string, string>): LockFileSystem {
  return {
    mkdir: async (path) => entries.set(path, DIRECTORY),
    writeFile: async (path, text) => {
      entries.set(path, text);
    },
    rm: async (path) =>
      new Promise((resolve) => {
        setImmediate(() => {
          entries.delete(path);
          resolve();
        });
      }),
  };
}

describe('tryCreateLock', () => {
  it('takes a free lock and names its owner in the owner file', async () => {
    const entries = new Map<string, string>();

    const ownerId = await tryCreateLock(LOCK_DIR, memoryFileSystem(entries));

    expect(ownerId).toBeDefined();
    expect(entries.get(LOCK_DIR)).toBe(DIRECTORY);
    expect(JSON.parse(entries.get(OWNER_FILE) ?? 'null')).toMatchObject({ owner_id: ownerId });
  });

  it('leaves a lock another holder has as it was', async () => {
    const theirs = '{"owner_id":"another holder"}\n';
    const entries = new Map([
      [LOCK_DIR, DIRECTORY],
      [OWNER_FILE, theirs],
    ]);
    const fs = { ...memoryFileSystem(entries), mkdir: rejectWith(failure('EEXIST')) };

    await expect(tryCreateLock(LOCK_DIR, fs)).resolves.toBeUndefined();
    expect(entries.get(OWNER_FILE)).toBe(theirs);
  });

  it('reports any other failure to make the directory', async () => {
    const fs = { ...memoryFileSystem(new Map()), mkdir: rejectWith(failure('EACCES')) };

    await expect(tryCreateLock(LOCK_DIR, fs)).rejects.toThrow('EACCES');
  });

  it('reports a failed owner write only once its directory is gone', async () => {
    const entries = new Map<string, string>();
    const fs = { ...memoryFileSystem(entries), writeFile: rejectWith(failure('ENOSPC')) };

    const seen = await tryCreateLock(LOCK_DIR, fs).then(
      () => ({ error: 'none', left: [...entries.keys()] }),
      (error: unknown) => ({ error: String(error), left: [...entries.keys()] }),
    );

    expect(seen.error).toContain('ENOSPC');
    expect(seen.left).toStrictEqual([]);
  });

  it('reports the write, not the removal, when both fail', async () => {
    const fs = {
      ...memoryFileSystem(new Map()),
      writeFile: rejectWith(failure('ENOSPC')),
      rm: rejectWith(failure('EBUSY')),
    };

    await expect(tryCreateLock(LOCK_DIR, fs)).rejects.toThrow('ENOSPC');
  });
});
