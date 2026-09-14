import { describe, expect, it } from 'vitest';

import { exists } from './portability-fs.js';

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
