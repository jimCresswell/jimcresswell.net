import { describe, expect, it } from 'vitest';

import { PR_VERDICT_STATES } from './state-types.js';
import type { PrStateReading } from './state-types.js';
import { computePrVerdict } from './states.js';

/**
 * The D1 verdict function: one closed, typed verdict per compound reading,
 * executing the pr-lifecycle SKILL review-round state machine. Every
 * silent-wait class from the 2026-07-20/21 net-to-zero drive has a regression
 * fixture, plus the r2 classes: per-reviewer legs (never collapsed), measured
 * settlement (no clock), and the latestReviews backwards-pointer.
 */

const TIP = 'a'.repeat(40);
const OLD_TIP = 'b'.repeat(40);
const COPILOT = 'copilot-pull-request-reviewer';
/** A now safely past every fixture timestamp's checks-green timeout. */
const LATE_NOW = '2026-07-21T13:00:00Z';

function settledReading(overrides: Partial<PrStateReading> = {}): PrStateReading {
  return {
    number: 999,
    url: 'https://github.com/jimCresswell/jimcresswell.net/pull/999',
    author: 'app/jimbot-of-the-devonshire-jimbots',
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: TIP,
    checks: { total: 3, passed: 3, failed: 0, pending: 0 },
    namedChecks: [
      { name: 'secret-scan', bucket: 'passed' },
      { name: 'SonarCloud Code Analysis', bucket: 'passed' },
      { name: 'CI / static-checks', bucket: 'passed' },
    ],
    checksGreenAt: '2026-07-21T12:00:00Z',
    reviewThreads: { total: 4, unresolved: 0 },
    autoMergeArmed: false,
    reviewRequests: [],
    expectedReviewers: [COPILOT],
    expectedDeclared: true,
    reviews: [
      {
        id: 'PRR_1',
        author: COPILOT,
        state: 'COMMENTED',
        body: 'Reviewed 2 of 2 files.',
        commitOid: TIP,
        submittedAt: '2026-07-21T12:05:00Z',
      },
    ],
    reviewRuns: { kind: 'read', runs: [] },
    issueComments: [],
    ...overrides,
  };
}

describe('PR_VERDICT_STATES', () => {
  it('is the closed set from the plan plus the typed extensions', () => {
    const byLocale = (left: string, right: string): number => left.localeCompare(right);
    expect([...PR_VERDICT_STATES].sort(byLocale)).toEqual(
      [
        'SETTLE-READY',
        'DRAFT',
        'WAITING-REVIEW-RUN-LIVE',
        'SILENT-WAIT-NO-REVIEWER',
        'CHECKS-RUNNING',
        'CHECKS-RED',
        'THREADS-OPEN',
        'SUPPRESSED-FINDINGS-OPEN',
        'BEHIND-BASE',
        'ARMED-BEHIND-RED',
        'QUOTA-SKIPPED',
        'SETTLED-NO-REVIEW',
        'MERGED',
        'CLOSED',
        'CONFLICT-DIRTY',
      ].sort(byLocale),
    );
  });
});

describe('computePrVerdict — the timeout-skip settled round (security D1, 2026-08-06)', () => {
  // The timeout arm exists so a WATCH can end rather than hang forever; it
  // must never launder "nobody reviewed" into merge-eligibility. A round
  // settled by timeout-skips gets its own typed state, mirroring the
  // QUOTA-SKIPPED carve-out.
  it('a round settled ONLY by timeout-skips reads SETTLED-NO-REVIEW, never SETTLE-READY', () => {
    const verdict = computePrVerdict(settledReading({ reviews: [] }), LATE_NOW);

    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
    expect(verdict.evidence.join('\n')).toContain(COPILOT);
  });

  it('an outwaited LIVE review run still refuses — liveness stops mattering for wait, not for merge-eligibility', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        reviewRuns: {
          kind: 'read',
          runs: [
            {
              id: 'run-1',
              name: 'copilot review',
              createdAt: '2026-07-21T12:01:00Z',
              completedAt: null,
            },
          ],
        },
      }),
      LATE_NOW,
    );

    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
  });

  it('one SATISFIED leg does not launder another reviewer timing out unreviewed', () => {
    const verdict = computePrVerdict(
      settledReading({ expectedReviewers: [COPILOT, 'second-reviewer'] }),
      LATE_NOW,
    );

    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
    expect(verdict.evidence.join('\n')).toContain('second-reviewer');
  });
});

describe('computePrVerdict — terminal and conflict states', () => {
  it('reports MERGED regardless of other legs', () => {
    const verdict = computePrVerdict(
      settledReading({ state: 'MERGED', checks: { total: 3, passed: 1, failed: 1, pending: 1 } }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('MERGED');
  });

  it('reports CLOSED (typed refusal) for closed-unmerged', () => {
    expect(computePrVerdict(settledReading({ state: 'CLOSED' }), LATE_NOW).state).toBe('CLOSED');
  });

  it('reports CONFLICT-DIRTY on CONFLICTING or DIRTY', () => {
    expect(computePrVerdict(settledReading({ mergeable: 'CONFLICTING' }), LATE_NOW).state).toBe(
      'CONFLICT-DIRTY',
    );
    expect(
      computePrVerdict(
        settledReading({ mergeable: 'UNKNOWN', mergeStateStatus: 'DIRTY' }),
        LATE_NOW,
      ).state,
    ).toBe('CONFLICT-DIRTY');
  });
});

describe('computePrVerdict — the armed-behind-red regression class (#437, 2026-07-21)', () => {
  it('an armed auto-merge behind a red check can NEVER read healthy, and names the check', () => {
    const verdict = computePrVerdict(
      settledReading({
        autoMergeArmed: true,
        checks: { total: 3, passed: 2, failed: 1, pending: 0 },
        namedChecks: [
          { name: 'secret-scan', bucket: 'passed' },
          { name: 'CI / static-checks', bucket: 'passed' },
          { name: 'SonarCloud Code Analysis', bucket: 'failed' },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('ARMED-BEHIND-RED');
    expect(verdict.evidence.join('\n')).toContain('SonarCloud Code Analysis');
  });

  it('unarmed red reads CHECKS-RED; red outranks pending', () => {
    expect(
      computePrVerdict(
        settledReading({
          checks: { total: 2, passed: 0, failed: 1, pending: 1 },
          namedChecks: [
            { name: 'CI / test', bucket: 'failed' },
            { name: 'CI / build', bucket: 'pending' },
          ],
        }),
        LATE_NOW,
      ).state,
    ).toBe('CHECKS-RED');
  });
});

describe('computePrVerdict — checks and threads ladder', () => {
  it('reports CHECKS-RUNNING while pending, and zero checks are never vacuously green', () => {
    expect(
      computePrVerdict(
        settledReading({
          checks: { total: 2, passed: 1, failed: 0, pending: 1 },
          namedChecks: [
            { name: 'secret-scan', bucket: 'passed' },
            { name: 'CI / test', bucket: 'pending' },
          ],
        }),
        LATE_NOW,
      ).state,
    ).toBe('CHECKS-RUNNING');
    expect(
      computePrVerdict(
        settledReading({ checks: { total: 0, passed: 0, failed: 0, pending: 0 }, namedChecks: [] }),
        LATE_NOW,
      ).state,
    ).toBe('CHECKS-RUNNING');
  });

  it('reports THREADS-OPEN when checks green but threads unresolved', () => {
    expect(
      computePrVerdict(settledReading({ reviewThreads: { total: 5, unresolved: 2 } }), LATE_NOW)
        .state,
    ).toBe('THREADS-OPEN');
  });
});

describe('computePrVerdict — per-reviewer legs (the collapsed-legs r2 class)', () => {
  it('one reviewer’s current review never settles another expected reviewer’s owed leg', () => {
    const verdict = computePrVerdict(
      settledReading({
        expectedReviewers: [COPILOT, 'claude'],
        checksGreenAt: '2026-07-21T12:56:00Z',
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(verdict.evidence.join('\n')).toContain('claude');
  });

  it('an old-tip review submitted LATER never hides the current-tip review (backwards pointer)', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [
          {
            id: 'PRR_2',
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Reviewed current tip.',
            commitOid: TIP,
            submittedAt: '2026-07-21T12:01:00Z',
          },
          {
            id: 'PRR_3',
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Older-tip job finishing late.',
            commitOid: OLD_TIP,
            submittedAt: '2026-07-21T12:09:00Z',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('a stale-tip-only review leaves the leg owed', () => {
    const verdict = computePrVerdict(
      settledReading({
        checksGreenAt: '2026-07-21T12:56:00Z',
        reviews: [
          {
            id: 'PRR_4',
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Reviewed an older push.',
            commitOid: OLD_TIP,
            submittedAt: '2026-07-21T12:01:00Z',
          },
        ],
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
  });

  it('an empty commitOid never proves tip binding; the timeout settles the WATCH but the round is not merge-eligible', () => {
    // Until the security D1 cure (2026-08-06) this round read SETTLE-READY —
    // the exact hole: a timeout-settled round has no proven tip-bound review.
    const verdict = computePrVerdict(
      settledReading({
        reviews: [
          {
            id: 'PRR_5',
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Reviewed.',
            commitOid: '',
            submittedAt: '2026-07-21T12:05:00Z',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
    expect(verdict.evidence.join('\n')).toContain('timeout');
  });
});

describe('computePrVerdict — the outstanding request is the round in flight', () => {
  // The review-request surface is the measured signal for a review round:
  // the platform clears the request when the review lands. The `gh agent-task`
  // leg never carried a Copilot review run (verified live 2026-09-13 on PR
  // #60, which read SILENT-WAIT-NO-REVIEWER with Copilot's review in
  // progress, its request invisible to `pr view`), so a request with no
  // mapped run is never read as dead; a request never served is ended by the
  // checks-green timeout arm.
  it('WAITING-REVIEW-RUN-LIVE when the owed reviewer is requested, whatever the run surface shows', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        checksGreenAt: '2026-07-21T12:56:00Z',
        reviewRuns: {
          kind: 'read',
          runs: [
            {
              id: 'run-1',
              name: 'Review from @jimCresswell',
              createdAt: 't0',
              completedAt: '2026-07-21T12:40:00Z',
            },
          ],
        },
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('WAITING-REVIEW-RUN-LIVE');
  });

  it('an unavailable runs leg with a requested owed reviewer still reads the round in flight, named in evidence', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        checksGreenAt: '2026-07-21T12:56:00Z',
        reviewRuns: { kind: 'unavailable', reason: 'gh agent-task missing' },
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('WAITING-REVIEW-RUN-LIVE');
    expect(verdict.evidence.join('\n')).toContain('review-run surface unavailable');
  });

  // The run leg's contract: an OBSERVED live run blocks (the cell below and
  // the settlement block); an UNOBSERVABLE surface (the extension lists
  // coding-agent sessions and never carried a review round) settles with the
  // gap named rather than blocking on an optional gh extension (the
  // Director's verdict on #65, 2026-09-14).
  it('an unavailable run surface settles a landed round with the gap named, never blocks', () => {
    const verdict = computePrVerdict(
      settledReading({ reviewRuns: { kind: 'unavailable', reason: 'gh agent-task missing' } }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
    expect(verdict.evidence.join('\n')).toContain(
      'review-run surface unavailable (gh agent-task missing): no live run observed',
    );
  });

  it('a truncated run surface settles a landed round with the gap named, never blocks', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviewRuns: {
          kind: 'read',
          runs: [],
          truncated: true,
          note: 'agent-task list truncated at 100 — older runs unobserved',
        },
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
    expect(verdict.evidence.join('\n')).toContain('older runs unobserved');
    expect(verdict.evidence.join('\n')).toContain(
      'review-run surface incomplete: no live run observed in the part read',
    );
  });

  // The contract's other half: an OBSERVED live run is a measured guard and
  // blocks, truncated surface or not, and the verdict says so through the
  // run's own line, never beside a "no live run observed" line.
  it('a truncated run surface that still observed a live run blocks on that run, without the gap line', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviewRuns: {
          kind: 'read',
          runs: [
            { id: 'run-7', name: 'Task from @jimCresswell', createdAt: 't0', completedAt: null },
          ],
          truncated: true,
          note: 'agent-task list truncated at 100 — older runs unobserved',
        },
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('WAITING-REVIEW-RUN-LIVE');
    expect(verdict.evidence.join('\n')).toContain('review run live: run-7');
    expect(verdict.evidence.join('\n')).toContain('older runs unobserved');
    expect(verdict.evidence.join('\n')).not.toContain('no live run observed');
  });
});

describe('computePrVerdict — base currency and vacuous sets', () => {
  it('a BEHIND base never reads settled — the founding BEHIND-stall class', () => {
    const verdict = computePrVerdict(settledReading({ mergeStateStatus: 'BEHIND' }), LATE_NOW);
    expect(verdict.state).toBe('BEHIND-BASE');
  });

  it('an EMPTY expected set can never settle (first-round rule holds vacuously nowhere)', () => {
    const verdict = computePrVerdict(
      settledReading({ expectedReviewers: [], expectedDeclared: false, reviews: [] }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(verdict.evidence.join('\n')).toContain('EMPTY');
  });

  it('a tip-bound review with no submittedAt still settles: settlement reads measured state, not a clock', () => {
    const verdict = computePrVerdict(
      settledReading({
        checksGreenAt: null,
        reviews: [
          {
            id: 'PRR_6',
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Reviewed.',
            commitOid: TIP,
            submittedAt: '',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
  });
});

describe('computePrVerdict — measured state and settlement (SKILL item 4)', () => {
  // The owner's design note (2026-09-13, on #56: "nothing is happening on the
  // PR ... the 'quiet window' could be replaced with measured state"): a round
  // is settled when every expected leg has landed on the tip, no expected
  // reviewer is requested, and no live run is observed. No clock.
  it('reports SETTLE-READY the moment every leg has landed with nothing requested and no live run observed', () => {
    const verdict = computePrVerdict(
      settledReading(),
      // 4 seconds after the fixture's 12:05 review: the old window would have held this open.
      '2026-07-21T12:05:04Z',
    );
    expect(verdict.state).toBe('SETTLE-READY');
    expect(verdict.evidence.join('\n')).toContain('no expected reviewer requested');
  });

  it('withholds settlement while an expected reviewer is requested again on a satisfied tip', () => {
    const verdict = computePrVerdict(settledReading({ reviewRequests: [COPILOT] }), LATE_NOW);
    expect(verdict.state).toBe('WAITING-REVIEW-RUN-LIVE');
    expect(verdict.evidence.join('\n')).toContain(`expected reviewer requested: ${COPILOT}`);
  });

  it('a re-request matches a declared [bot] spelling too (the strip applies to both sides)', () => {
    const verdict = computePrVerdict(
      settledReading({ expectedReviewers: [`${COPILOT}[bot]`], reviewRequests: [COPILOT] }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('WAITING-REVIEW-RUN-LIVE');
  });

  it('withholds settlement while an agent-task run mapped to the PR is live', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviewRuns: {
          kind: 'read',
          runs: [
            { id: 'run-1', name: 'Task from @jimCresswell', createdAt: 't0', completedAt: null },
          ],
        },
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('WAITING-REVIEW-RUN-LIVE');
    expect(verdict.evidence.join('\n')).toContain('review run live: run-1');
  });

  it('a request for a reviewer outside the expected set does not hold a settled round', () => {
    // The owner's credential registers a request for the owner on every
    // re-request (merge-bot.md); holding on it would deadlock every landing.
    const verdict = computePrVerdict(
      settledReading({ reviewRequests: ['jimCresswell'] }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('a settled round with a quota-skipped leg reads QUOTA-SKIPPED (owner ruling: skipped, not satisfied)', () => {
    const verdict = computePrVerdict(
      settledReading({
        expectedReviewers: [COPILOT, 'claude'],
        reviews: [
          ...settledReading().reviews,
          {
            id: 'PRR_7',
            author: 'claude',
            state: 'COMMENTED',
            body: '⚠️ **Code review skipped** — overage spend limit reached.',
            commitOid: TIP,
            submittedAt: '2026-07-21T12:05:30Z',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('QUOTA-SKIPPED');
    expect(verdict.evidence.join('\n')).toContain('claude: SKIPPED');
  });

  // Both signature forms: the bare prefix and the MCP-145 display token
  // (prefix-idTail) a seat pastes from its rendered identity. The token form
  // once had its own cell against the quiet window; the exclusion it proves
  // outlives the window (the #65 round-three finding, 2026-09-14).
  it.each(['(92e9d6)', '(92e9d6-9c1)'])(
    'a self-authored reply signed %s never enters the body tally (SKILL exclusion)',
    (signature) => {
      const verdict = computePrVerdict(
        settledReading({
          reviews: [
            ...settledReading().reviews,
            {
              id: 'PRR_8',
              author: 'jimCresswell',
              state: 'COMMENTED',
              body: `Fixed at source in abc1234.\n\n— Moth mends Dreamscape ${signature}`,
              commitOid: TIP,
              submittedAt: '2026-07-21T12:58:00Z',
            },
          ],
        }),
        '2026-07-21T12:58:04Z',
      );
      expect(verdict.state).toBe('SETTLE-READY');
      expect(verdict.evidence.join('\n')).not.toContain('jimCresswell (COMMENTED)');
    },
  );

  it('an undeclared expected set is named in evidence, never silent', () => {
    const verdict = computePrVerdict(settledReading({ expectedDeclared: false }), LATE_NOW);
    expect(verdict.evidence.join('\n')).toContain('DEFAULTED from the observed surface');
  });
});

describe('computePrVerdict — round-6 classes (2026-07-21)', () => {
  it('a fully green settled DRAFT reads the typed DRAFT refusal, never SETTLE-READY (r6 regression)', () => {
    // Drafts cannot merge via the sanctioned landing path (the landing-path
    // invariant) — unlike review-gate BLOCKED (ratified landable), draftness
    // is a real merge blocker, so no settlement read may proceed over it.
    const verdict = computePrVerdict(settledReading({ isDraft: true }), LATE_NOW);
    expect(verdict.state).toBe('DRAFT');
    expect(verdict.evidence.join('\n')).toContain('mark ready for review');
  });
});

describe('computePrVerdict — round-4 residual classes (2026-07-21)', () => {
  it('a TRUNCATED run list still reads the requested owed leg as the round in flight, the gap in evidence', () => {
    // A full-window agent-task list (100 rows) leaves older runs unobserved;
    // the request surface, not the run list, says the round is in flight, so
    // truncation changes only the evidence.
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        checksGreenAt: '2026-07-21T12:58:00Z',
        reviewRuns: {
          kind: 'read',
          runs: [],
          truncated: true,
          note: 'agent-task list truncated at 100 — older runs unobserved',
        },
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('WAITING-REVIEW-RUN-LIVE');
    expect(verdict.evidence.join('\n')).toContain('older runs unobserved');
  });

  it('SETTLE-READY evidence hands over the body-tally inputs (SKILL item 2: bodies count into the round tally)', () => {
    // A summary-only review carrying findings in its body would otherwise
    // read healthy at zero threads. The instrument cannot classify prose as
    // findings (a CLEAN Copilot round also posts a non-empty summary body —
    // verified on the merged #460's final tip — so refusing on body PRESENCE
    // would deadlock every landing); it names the tally inputs instead.
    const verdict = computePrVerdict(settledReading(), LATE_NOW);
    expect(verdict.state).toBe('SETTLE-READY');
    expect(verdict.evidence.join('\n')).toContain(
      `tip-bound review body present: ${COPILOT} (COMMENTED)`,
    );
  });

  it('a closer-look body with suppressed findings holds the round as SUPPRESSED-FINDINGS-OPEN (the bot merged on one, #60 and #64; the owner ruled block on any finding, item 78, 2026-09-14)', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [
          {
            id: 'PRR_9',
            author: COPILOT,
            state: 'COMMENTED',
            body: '### 🔵 Needs a closer look\n\n<details>\n### Suppressed comments (6)\n</details>',
            commitOid: TIP,
            submittedAt: '2026-07-21T12:05:00Z',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SUPPRESSED-FINDINGS-OPEN');
    expect(verdict.evidence.join('\n')).toContain(
      `suppressed findings hold the merge: ${COPILOT} (COMMENTED), review PRR_9 on head SHA:aaaaaaa, verdict "Needs a closer look", 6 suppressed finding(s), 0 lifted`,
    );
  });
});

describe('computePrVerdict — the suppressed-findings hold (5a-vi, 2026-09-14)', () => {
  const SIGNATURE = '— Saffron turns Verdure (c39ad7)';
  const closerLook = (suppressed: number, commitOid: string = TIP) => ({
    id: 'PRR_hold',
    author: COPILOT,
    state: 'COMMENTED',
    body: `### 🔵 Needs a closer look\n\n<details>\n### Suppressed comments (${String(suppressed)})\n</details>`,
    commitOid,
    submittedAt: '2026-07-21T12:05:00Z',
  });
  const line = (item: string, sentence: string): string =>
    `**Over-bar** head SHA:${TIP.slice(0, 7)} · review PRR_hold · a.ts:1 · ${item} — ${sentence}`;

  it('lifts when every finding is cured or rejected by a signed disposition line, and settles', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [closerLook(2)],
        issueComments: [
          {
            author: 'jimCresswell',
            body: [
              line('item 1 of 2', 'Cured in SHA:9f8e7d6'),
              line(
                'item 2 of 2',
                'Rejected: does not reproduce; the falsifier is the cell at a.ts:9',
              ),
              '',
              SIGNATURE,
            ].join('\n'),
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('a routed finding still holds: the owner asked to block on any finding', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [closerLook(1)],
        issueComments: [
          {
            author: 'jimCresswell',
            body: [line('item 1 of 1', 'Routed to the 2a follow-on list'), '', SIGNATURE].join(
              '\n',
            ),
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SUPPRESSED-FINDINGS-OPEN');
    expect(verdict.evidence.join('\n')).toContain('1 suppressed finding(s), 0 lifted');
  });

  it('open threads and suppressed findings hold together: THREADS-OPEN, with the count in its evidence', () => {
    const verdict = computePrVerdict(
      settledReading({ reviewThreads: { total: 4, unresolved: 1 }, reviews: [closerLook(3)] }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('THREADS-OPEN');
    expect(verdict.evidence).toStrictEqual([
      '1/4 review threads unresolved',
      expect.stringContaining('3 suppressed finding(s), 0 lifted'),
    ]);
  });

  it('a body on an older tip holds nothing: a later review on a later tip carrying none lifts the hold', () => {
    const verdict = computePrVerdict(
      settledReading({ reviews: [closerLook(5, OLD_TIP), { ...closerLook(0), id: 'PRR_clean' }] }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
  });
});
