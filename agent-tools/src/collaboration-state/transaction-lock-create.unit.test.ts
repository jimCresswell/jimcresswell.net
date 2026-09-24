import { describe, expect, it } from 'vitest';

import { tryCreateLock, type LockFileSystem } from './transaction-lock-create.js';

/**
 * Making a transaction lock: the directory, made exclusively, then its owner
 * file. A holder whose owner file cannot be written removes its directory
 * before the write's error goes up, so the failure leaves no ownerless lock.
 * The filesystem is a fake that records calls and fails where it is told to.
 */

const LOCK_DIR = '/state/claims.json.transaction';

function failure(code: string): Error {
  return Object.assign(new Error(`${code}: refused`), { code });
}

function recordingFileSystem(fails: {
  readonly mkdir?: Error;
  readonly writeFile?: Error;
  readonly rm?: Error;
}): { readonly fs: LockFileSystem; readonly calls: string[]; readonly written: string[] } {
  const calls: string[] = [];
  const written: string[] = [];
  const step = async (name: string, error: Error | undefined): Promise<void> => {
    calls.push(name);
    if (error !== undefined) {
      throw error;
    }
  };
  return {
    calls,
    written,
    fs: {
      mkdir: async (path) => step(`mkdir ${path}`, fails.mkdir),
      writeFile: async (path, text) => {
        written.push(text);
        await step(`writeFile ${path}`, fails.writeFile);
      },
      rm: async (path) => step(`rm ${path}`, fails.rm),
    },
  };
}

describe('tryCreateLock', () => {
  it('takes a free lock and names its owner in the owner file', async () => {
    const { fs, calls, written } = recordingFileSystem({});

    const ownerId = await tryCreateLock(LOCK_DIR, fs);

    expect(calls).toStrictEqual([`mkdir ${LOCK_DIR}`, `writeFile ${LOCK_DIR}/owner.json`]);
    expect(ownerId).toBeDefined();
    expect(JSON.parse(written[0] ?? '')).toMatchObject({ owner_id: ownerId });
    expect(written[0]).toMatch(/"created_at": "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"/u);
  });

  it('reports a lock another holder has, and writes nothing', async () => {
    const { fs, calls } = recordingFileSystem({ mkdir: failure('EEXIST') });

    await expect(tryCreateLock(LOCK_DIR, fs)).resolves.toBeUndefined();
    expect(calls).toStrictEqual([`mkdir ${LOCK_DIR}`]);
  });

  it('reports any other failure to make the directory', async () => {
    const { fs } = recordingFileSystem({ mkdir: failure('EACCES') });

    await expect(tryCreateLock(LOCK_DIR, fs)).rejects.toThrow('EACCES');
  });

  it('removes its directory when the owner file cannot be written, and reports the write', async () => {
    const { fs, calls } = recordingFileSystem({ writeFile: failure('ENOSPC') });

    await expect(tryCreateLock(LOCK_DIR, fs)).rejects.toThrow('ENOSPC');
    expect(calls).toContain(`rm ${LOCK_DIR}`);
  });

  it('reports the write, not the removal, when both fail', async () => {
    const { fs } = recordingFileSystem({ writeFile: failure('ENOSPC'), rm: failure('EBUSY') });

    await expect(tryCreateLock(LOCK_DIR, fs)).rejects.toThrow('ENOSPC');
  });

  it('holds the write error back until its directory is gone', async () => {
    let finishRemoval = (): void => undefined;
    const removal = new Promise<void>((resolve) => {
      finishRemoval = resolve;
    });
    const fs: LockFileSystem = {
      mkdir: async () => undefined,
      writeFile: async () => {
        throw failure('ENOSPC');
      },
      rm: async () => removal,
    };
    let settled = false;
    const outcome = tryCreateLock(LOCK_DIR, fs).then(
      () => {
        settled = true;
        return 'taken';
      },
      (error: unknown) => {
        settled = true;
        return error instanceof Error ? error.message : String(error);
      },
    );

    await new Promise((resolve) => {
      setImmediate(resolve);
    });
    expect(settled).toBe(false);
    finishRemoval();
    await expect(outcome).resolves.toContain('ENOSPC');
  });
});
