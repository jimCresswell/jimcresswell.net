import { describe, expect, it } from 'vitest';

import { computeFoldClock, formatFoldClock, type FoldClockReading } from './fold-clock.js';

/**
 * The clock over the instants pull request 326 carried on 2026-10-10 (read
 * from the API that day): ready 11:18:20Z; Copilot requested 11:18:35Z and
 * 11:28:55Z, its reviews 11:22:45Z and 11:32:47Z; the owner's own code-owner
 * request is not a round; the merge bot's disposition reviews pair with
 * nothing; the tip's required checks completed 11:32:30Z and 11:29:35Z while
 * the vendor's own check-run completed later; merged 11:33:09Z.
 */

const HEAD = '6c340d864683792c36e12fb43f71cddafac58bbb';

function run(name: string, completedAt: string, conclusion = 'success') {
  return { name, conclusion, startedAt: '2026-10-10T11:28:54Z', completedAt };
}

const fold326: FoldClockReading = {
  prNumber: 326,
  headSha: HEAD,
  createdAt: '2026-10-09T13:34:15Z',
  readyMarks: ['2026-10-10T11:18:20Z'],
  mergedAt: '2026-10-10T11:33:09Z',
  requests: [
    { at: '2026-10-10T11:18:35Z', login: 'Copilot' },
    { at: '2026-10-10T11:28:55Z', login: 'Copilot' },
  ],
  reviews: [
    { at: '2026-10-10T11:22:45Z', login: 'Copilot' },
    { at: '2026-10-10T11:26:50Z', login: 'jimbot-of-the-devonshire-jimbots[bot]' },
    { at: '2026-10-10T11:32:47Z', login: 'Copilot' },
  ],
  requiredChecks: ['run-quality-gates', 'CodeQL'],
  headCheckRuns: [
    run('run-quality-gates', '2026-10-10T11:32:30Z'),
    run('CodeQL', '2026-10-10T11:29:35Z'),
    run('copilot-pull-request-reviewer', '2026-10-10T11:32:46Z'),
    run('Vercel Preview Comments', '2026-10-10T11:30:06Z'),
  ],
  successor: undefined,
};

describe('computeFoldClock', () => {
  it('measures the fold of 326 from its instants', () => {
    const clock = computeFoldClock(fold326);

    expect(clock.ok).toBe(true);
    if (clock.ok) {
      expect(clock.value.readyAt).toBe('2026-10-10T11:18:20Z');
      expect(clock.value.checksGreenAt).toBe('2026-10-10T11:32:30Z');
      expect(clock.value.checksMissing).toStrictEqual([]);
      expect(clock.value.readyToGreenMinutes).toBe(14.2);
      expect(clock.value.rounds.map((round) => round.minutes)).toStrictEqual([4.2, 3.9]);
      expect(clock.value.readyToMergeMinutes).toBe(14.8);
      expect(clock.value.successorLandedAt).toBeUndefined();
    }
  });

  it('pairs each request with the first later review by the same login, case-insensitively, once', () => {
    const clock = computeFoldClock({
      ...fold326,
      requests: [
        { at: '2026-10-10T11:18:35Z', login: 'copilot' },
        { at: '2026-10-10T11:28:55Z', login: 'Copilot' },
      ],
      reviews: [
        { at: '2026-10-10T11:18:00Z', login: 'Copilot' },
        { at: '2026-10-10T11:22:45Z', login: 'Copilot' },
      ],
    });

    expect(clock.ok).toBe(true);
    if (clock.ok) {
      expect(clock.value.rounds).toStrictEqual([
        {
          login: 'copilot',
          requestedAt: '2026-10-10T11:18:35Z',
          reviewedAt: '2026-10-10T11:22:45Z',
          minutes: 4.2,
        },
        {
          login: 'Copilot',
          requestedAt: '2026-10-10T11:28:55Z',
          reviewedAt: undefined,
          minutes: undefined,
        },
      ]);
    }
  });

  it('takes the last ready-mark, and the opening when the pull request was never a draft', () => {
    const twice = computeFoldClock({
      ...fold326,
      readyMarks: ['2026-10-10T10:00:00Z', '2026-10-10T11:18:20Z'],
    });
    const never = computeFoldClock({ ...fold326, readyMarks: [] });

    expect(twice.ok && twice.value.readyAt).toBe('2026-10-10T11:18:20Z');
    expect(never.ok && never.value.readyAt).toBe('2026-10-09T13:34:15Z');
  });

  it('names a required context with no success run and leaves green undefined', () => {
    const clock = computeFoldClock({
      ...fold326,
      headCheckRuns: [
        run('run-quality-gates', '2026-10-10T11:32:30Z'),
        run('CodeQL', '2026-10-10T11:29:35Z', 'failure'),
      ],
    });

    expect(clock.ok).toBe(true);
    if (clock.ok) {
      expect(clock.value.checksGreenAt).toBeUndefined();
      expect(clock.value.checksMissing).toStrictEqual(['CodeQL']);
      expect(clock.value.readyToGreenMinutes).toBeUndefined();
    }
  });

  it('takes the latest success per context when a context ran more than once', () => {
    const clock = computeFoldClock({
      ...fold326,
      headCheckRuns: [
        run('run-quality-gates', '2026-10-10T11:20:00Z', 'failure'),
        run('run-quality-gates', '2026-10-10T11:25:00Z'),
        run('run-quality-gates', '2026-10-10T11:40:00Z'),
        run('CodeQL', '2026-10-10T11:29:35Z'),
      ],
    });

    expect(clock.ok && clock.value.checksGreenAt).toBe('2026-10-10T11:40:00Z');
  });

  it('reads the successor as on CI at its earliest check-run start', () => {
    const clock = computeFoldClock({
      ...fold326,
      successor: {
        sha: 'fa74b7270000000000000000000000000000abcd',
        checkRuns: [
          {
            name: 'install',
            conclusion: undefined,
            startedAt: '2026-10-10T11:38:10Z',
            completedAt: undefined,
          },
          {
            name: 'e2e',
            conclusion: undefined,
            startedAt: '2026-10-10T11:38:00Z',
            completedAt: undefined,
          },
        ],
      },
    });

    expect(clock.ok).toBe(true);
    if (clock.ok) {
      expect(clock.value.successorLandedAt).toBe('2026-10-10T11:38:00Z');
      expect(clock.value.readyToSuccessorMinutes).toBe(19.7);
    }
  });

  it('refuses a ready instant that is not a date', () => {
    const clock = computeFoldClock({ ...fold326, readyMarks: ['yesterday'] });

    expect(clock.ok).toBe(false);
    if (!clock.ok) {
      expect(clock.error.message).toContain("'yesterday'");
    }
  });
});

describe('formatFoldClock', () => {
  it('prints the fold of 326 as one line', () => {
    const clock = computeFoldClock(fold326);

    expect(clock.ok && formatFoldClock(clock.value)).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:18:20Z; checks green +14.2 min; ' +
        'rounds 2 (Copilot 4.2, Copilot 3.9 min); merged +14.8 min',
    );
  });

  it('names a round in flight, missing checks, an unmerged pull request and a successor not yet on CI', () => {
    const clock = computeFoldClock({
      ...fold326,
      mergedAt: undefined,
      requests: [{ at: '2026-10-10T11:28:55Z', login: 'Copilot' }],
      reviews: [],
      headCheckRuns: [run('CodeQL', '2026-10-10T11:29:35Z')],
      successor: { sha: 'fa74b7270000000000000000000000000000abcd', checkRuns: [] },
    });

    expect(clock.ok && formatFoldClock(clock.value)).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:18:20Z; checks not green (run-quality-gates); ' +
        'rounds 1 (Copilot in flight since 2026-10-10T11:28:55Z min); not merged; successor fa74b727 not yet on CI',
    );
  });

  it('says so when the base requires no checks, and signs a green that preceded the ready-mark', () => {
    const clock = computeFoldClock({
      ...fold326,
      requiredChecks: [],
      requests: [],
      reviews: [],
    });
    const early = computeFoldClock({
      ...fold326,
      readyMarks: ['2026-10-10T11:35:00Z'],
      requests: [],
      reviews: [],
      mergedAt: undefined,
    });

    expect(clock.ok && formatFoldClock(clock.value)).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:18:20Z; checks: none required on the base; rounds 0; merged +14.8 min',
    );
    expect(early.ok && formatFoldClock(early.value)).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:35:00Z; checks green -2.5 min; rounds 0; not merged',
    );
  });
});
