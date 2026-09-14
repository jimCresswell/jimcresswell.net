import { describe, expect, it } from 'vitest';

import { exists, listSubdirs } from './portability-fs.js';

function failing(code: string, message: string): (absolutePath: string) => Promise<void> {
  return async () => {
    throw Object.assign(new Error(message), { code });
  };
}

describe('exists', () => {
  it('is true when the probe succeeds and false only when the path does not exist', async () => {
    expect(await exists('/repo', 'a.md', async () => undefined)).toBe(true);
    expect(await exists('/repo', 'a.md', failing('ENOENT', 'ENOENT: no such file'))).toBe(false);
  });

  it('throws any failure other than absence, so an unreadable path is never reported as missing', async () => {
    await expect(
      exists('/repo', 'a.md', failing('EACCES', 'EACCES: permission denied')),
    ).rejects.toThrow('EACCES: permission denied');
  });
});

describe('listSubdirs', () => {
  const entry = (name: string, isDirectory: boolean) => ({ name, isDirectory: () => isDirectory });

  it('lists the directory names sorted, files left out', async () => {
    expect(
      await listSubdirs('/repo', '.agent/skills', async () => [
        entry('zeta', true),
        entry('README.md', false),
        entry('alpha', true),
      ]),
    ).toStrictEqual({ kind: 'ok', value: ['alpha', 'zeta'] });
  });

  it('reads any listing failure, absence included, as a typed failure naming the directory: an unlisted tree is never "no skills"', async () => {
    const denied = async () => {
      throw new Error('EACCES: permission denied');
    };
    expect(await listSubdirs('/repo', '.agent/skills', denied)).toStrictEqual({
      kind: 'failure',
      message: 'cannot list .agent/skills: EACCES: permission denied',
    });
    const absent = async () => {
      throw Object.assign(new Error('ENOENT: no such file or directory'), { code: 'ENOENT' });
    };
    expect(await listSubdirs('/repo', '.agent/skills', absent)).toStrictEqual({
      kind: 'failure',
      message: 'cannot list .agent/skills: ENOENT: no such file or directory',
    });
  });
});
