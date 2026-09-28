import { describe, expect, it } from 'vitest';

import { exitCodeFor, writeRetireOutcome, type RetireOutcome } from './retire-report.js';

/**
 * The retire outcome: its exit code and the two ways it is written. Pure
 * over a recording sink; `--json` puts exactly the outcome object on stdout.
 */

const BASE = { name: 'main', sha: 'b'.repeat(40) };
const retired: RetireOutcome = {
  kind: 'retired',
  branch: 'feat/x',
  base: BASE,
  names: {
    remote: { state: 'deleted', sha: 'a'.repeat(40) },
    tracking: { state: 'absent' },
    local: { state: 'deleted', sha: 'a'.repeat(40) },
  },
};

function recorder(): {
  readonly stdout: string[];
  readonly stderr: string[];
  readonly sinks: Parameters<typeof writeRetireOutcome>[2];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    stdout,
    stderr,
    sinks: {
      stdout: { write: (chunk: string) => stdout.push(chunk) > 0 },
      stderr: { write: (chunk: string) => stderr.push(chunk) > 0 },
    },
  };
}

describe('exitCodeFor', () => {
  it('maps retired and absent to 0, refused to 3, and partial and failed to 1', () => {
    expect(exitCodeFor(retired)).toBe(0);
    expect(exitCodeFor({ kind: 'absent', branch: 'feat/x' })).toBe(0);
    expect(exitCodeFor({ kind: 'refused', branch: 'feat/x', reason: 'r' })).toBe(3);
    expect(exitCodeFor({ ...retired, kind: 'partial', reason: 'r' })).toBe(1);
    expect(exitCodeFor({ kind: 'failed', branch: 'feat/x', reason: 'r' })).toBe(1);
  });
});

describe('writeRetireOutcome', () => {
  it('writes exactly the outcome object on stdout under --json', () => {
    const out = recorder();
    writeRetireOutcome(retired, true, out.sinks);

    expect(JSON.parse(out.stdout.join(''))).toEqual(retired);
  });

  it('writes a line per name in human output, naming each state', () => {
    const out = recorder();
    writeRetireOutcome(retired, false, out.sinks);
    const text = out.stdout.join('');

    expect(text).toContain('feat/x');
    expect(text).toContain(`remote: deleted at ${'a'.repeat(40)}`);
    expect(text).toContain('tracking: absent');
  });

  it('writes a refusal and a failure to stderr in human output, with the reason', () => {
    const out = recorder();
    writeRetireOutcome(
      { kind: 'refused', branch: 'feat/x', reason: 'in use in worktree wt' },
      false,
      out.sinks,
    );

    expect(out.stdout.join('')).toBe('');
    expect(out.stderr.join('')).toContain('in use in worktree wt');
  });

  it('names a kept ref with the sha it moved to', () => {
    const out = recorder();
    const kept = { state: 'kept', sha: 'c'.repeat(40) } as const;
    writeRetireOutcome(
      {
        ...retired,
        kind: 'partial',
        reason: 'the local branch moved',
        names: { ...retired.names, local: kept },
      },
      false,
      out.sinks,
    );

    expect(out.stderr.join('')).toContain(`local: kept at ${'c'.repeat(40)}`);
  });

  it('names a delete that failed, and a state that could not be read, apart from a move', () => {
    const out = recorder();
    writeRetireOutcome(
      {
        ...retired,
        kind: 'partial',
        reason: 'the local branch was not deleted',
        names: { ...retired.names, tracking: { state: 'unknown' }, local: { state: 'failed' } },
      },
      false,
      out.sinks,
    );

    expect(out.stderr.join('')).toContain('tracking: unknown');
    expect(out.stderr.join('')).toContain('local: failed');
  });
});
