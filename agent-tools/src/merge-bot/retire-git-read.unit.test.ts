import { assert, describe, expect, it } from 'vitest';

import type { GitCommandResult } from './git-executor.js';
import { probeReading } from './retire-git-read.js';

/**
 * The remote-branch probe's reading of git's answer, over literal results: a
 * failed read is a failure, never "absent", so a remote git could not reach
 * is never read as a branch already gone.
 */

const SHA = 'a'.repeat(40);

function answered(status: number, stdout: string, stderr = ''): GitCommandResult {
  return { status, signal: null, stdout, stderr };
}

describe('probeReading', () => {
  it('reads the exact ref as present at its sha', () => {
    const reading = probeReading(answered(0, `${SHA}\trefs/heads/feat/x\n`), 'feat/x');

    expect(reading).toEqual({ ok: true, value: { kind: 'present', sha: SHA } });
  });

  it('reads an empty answer as absent', () => {
    expect(probeReading(answered(0, ''), 'feat/x')).toEqual({
      ok: true,
      value: { kind: 'absent' },
    });
  });

  it.each([2, 128])('reads exit %i as a failure naming the branch, never as absent', (status) => {
    const reading = probeReading(answered(status, '', 'fatal: unable to access'), 'feat/x');

    assert(!reading.ok);
    expect(reading.error.message).toContain('reading the remote branch feat/x');
  });
});
