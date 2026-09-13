import { describe, expect, it } from 'vitest';

import { smokeTestFiles, summariseSmokeRun } from './smoke-suite.js';

/**
 * The smoke suite is derived from the directory: every `*.smoke.ts` runs, in
 * a stable order, and the verdict is the conjunction of every run.
 */

describe('smokeTestFiles', () => {
  it('keeps only the smoke files, sorted, whatever else the directory holds', () => {
    expect(smokeTestFiles(['b.smoke.ts', 'README.md', 'a.smoke.ts', 'helper.ts'])).toStrictEqual([
      'a.smoke.ts',
      'b.smoke.ts',
    ]);
  });

  it('reads an empty directory as no smoke files', () => {
    expect(smokeTestFiles([])).toStrictEqual([]);
  });
});

describe('summariseSmokeRun', () => {
  it('is green only when every smoke exited 0, with one line per smoke and a verdict', () => {
    const summary = summariseSmokeRun([
      { file: 'a.smoke.ts', exitCode: 0 },
      { file: 'b.smoke.ts', exitCode: 0 },
    ]);
    expect(summary.ok).toBe(true);
    expect(summary.lines).toStrictEqual([
      'smoke ok   a.smoke.ts (exit 0)',
      'smoke ok   b.smoke.ts (exit 0)',
      'smoke suite: 2 passed',
    ]);
  });

  it('names every failure and counts them in the verdict', () => {
    const summary = summariseSmokeRun([
      { file: 'a.smoke.ts', exitCode: 0 },
      { file: 'b.smoke.ts', exitCode: 2 },
    ]);
    expect(summary.ok).toBe(false);
    expect(summary.lines[1]).toBe('smoke FAIL b.smoke.ts (exit 2)');
    expect(summary.lines[2]).toBe('smoke suite: 1 of 2 failed');
  });

  it('reads an empty suite as a failure, never a pass', () => {
    const summary = summariseSmokeRun([]);
    expect(summary.ok).toBe(false);
    expect(summary.lines).toHaveLength(1);
  });
});
