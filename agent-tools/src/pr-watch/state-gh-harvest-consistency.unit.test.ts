import { describe, expect, it } from 'vitest';

import { readPrStateReading } from './state-gh.js';
import { stateViewFixture } from './state-view-fixture.js';
import { commentsPayload, graphqlResponse } from './test-helpers/state-gh-payloads.js';
import type { GhCommandExecutor } from './gh.js';

/**
 * The compound read's harvest bracket (#65 round four; #79 round three,
 * 2026-09-14): the reviews-and-requests harvest is read on both sides of every
 * other leg, the confirm view last, and must agree, so a review landing during
 * any leg is on the reading with its threads, never settled over. Injected
 * executor, no real gh; the harvest served per call, or timed by a view call,
 * scripts the landing.
 */

const HEAD = stateViewFixture().headRefOid;
const COPILOT = 'copilot-pull-request-reviewer';

/** A threads page with the given unresolved count (each unresolved thread its own node). */
function threadsPayload(unresolved: number): string {
  const nodes = Array.from({ length: unresolved }, () => ({ isResolved: false }));
  return JSON.stringify([
    {
      data: {
        repository: { pullRequest: { reviewThreads: { totalCount: unresolved, nodes } } },
      },
    },
  ]);
}

function review(body: string, submittedAt: string) {
  return {
    id: 'PRR_1',
    author: { login: COPILOT },
    state: 'COMMENTED',
    body,
    submittedAt,
    commit: { oid: HEAD },
  };
}

/** A harvest carrying the given reviews and the given outstanding Bot requests. */
function harvestPayload(
  reviews: readonly ReturnType<typeof review>[],
  requested: readonly string[] = [],
): string {
  return JSON.stringify([
    {
      data: {
        repository: {
          pullRequest: {
            reviews: { nodes: reviews },
            reviewRequests: {
              pageInfo: { hasNextPage: false },
              nodes: requested.map((login) => ({
                requestedReviewer: { __typename: 'Bot', login },
              })),
            },
          },
        },
      },
    },
  ]);
}

const FIRST = review('Reviewed 2 of 2 files.', '2026-07-21T12:00:00Z');
const LANDING = review('Needs a closer look. 3 suppressed findings.', '2026-07-21T12:09:00Z');

interface LandingScript {
  readonly harvests: readonly string[];
  readonly threads: readonly string[];
  /** A landing timed by a `pr view` call: from that call on, every harvest carries it. */
  readonly landingOnView?: { readonly call: number; readonly harvest: string };
}

/**
 * Serves one harvest per harvest call and one threads page per thread call
 * (the last of each repeats), so a landing between the calls is scripted; a
 * landing timed by a view call overrides the harvest from that call on. The
 * dispatch is the shared `graphqlResponse`, so a harvest is served only to a
 * query that selects the request connection (the #67 body finding).
 */
function landingExecutor(script: LandingScript, calls: string[][]): GhCommandExecutor {
  let harvestCall = 0;
  let threadsCall = 0;
  let viewCall = 0;
  const served = (pages: readonly string[], call: number): string =>
    pages[Math.min(call, pages.length - 1)] ?? '';
  const payloads = {
    threads: (): string => {
      threadsCall += 1;
      return served(script.threads, threadsCall - 1);
    },
    harvest: (): string => {
      harvestCall += 1;
      const landing = script.landingOnView;
      if (landing !== undefined && viewCall >= landing.call) {
        return landing.harvest;
      }
      return served(script.harvests, harvestCall - 1);
    },
    comments: (): string => commentsPayload(),
  };
  return (_file, args) => {
    calls.push([...args]);
    if (args[0] === 'pr') {
      viewCall += 1;
      return JSON.stringify(stateViewFixture());
    }
    if (args[0] === 'api') {
      return graphqlResponse(args, payloads);
    }
    if (args[0] === 'agent-task') {
      return JSON.stringify([]);
    }
    throw new Error(`unexpected gh argv: ${args.join(' ')}`);
  };
}

const isHarvestCall = (args: readonly string[]): boolean =>
  args[0] === 'api' &&
  args.some(
    (arg) =>
      arg.startsWith('query=') && !arg.includes('reviewThreads') && !arg.includes('comments('),
  );
const isThreadsCall = (args: readonly string[]): boolean =>
  args[0] === 'api' && args.some((arg) => arg.includes('reviewThreads'));
const isCommentsCall = (args: readonly string[]): boolean =>
  args[0] === 'api' &&
  args.some((arg) => arg.includes('comments(') && !arg.includes('reviewThreads'));
const isViewCall = (args: readonly string[]): boolean => args[0] === 'pr';

describe('readPrStateReading — the harvest brackets the thread read (#65 round four)', () => {
  it('a request registered between the harvest and the thread read moves the bracket: the request is on the reading, threads re-read', () => {
    const calls: string[][] = [];
    const reading = readPrStateReading({
      target: { number: 461 },
      ghPath: '/usr/bin/gh',
      exists: () => true,
      expectedReviewers: [COPILOT],
      execFileSync: landingExecutor(
        {
          harvests: [harvestPayload([FIRST]), harvestPayload([FIRST], [COPILOT])],
          threads: [threadsPayload(0)],
        },
        calls,
      ),
    });
    expect(reading.reviewRequests).toEqual([COPILOT]);
    expect(calls.filter(isHarvestCall)).toHaveLength(3);
    expect(calls.filter(isThreadsCall)).toHaveLength(2);
  });

  it('a summary-only review landing between the harvest and the thread read is on the reading, threads re-read', () => {
    const calls: string[][] = [];
    const reading = readPrStateReading({
      target: { number: 461 },
      ghPath: '/usr/bin/gh',
      exists: () => true,
      expectedReviewers: [COPILOT],
      execFileSync: landingExecutor(
        {
          harvests: [harvestPayload([FIRST]), harvestPayload([FIRST, LANDING])],
          // The first thread page predates the landing; the re-read carries its thread.
          threads: [threadsPayload(0), threadsPayload(1)],
        },
        calls,
      ),
    });
    expect(reading.reviews.map((entry) => entry.body)).toEqual([FIRST.body, LANDING.body]);
    expect(reading.reviewThreads).toEqual({ total: 1, unresolved: 1 });
    // Harvest before, harvest after (moved), harvest after the re-read (held).
    expect(calls.filter(isHarvestCall)).toHaveLength(3);
    expect(calls.filter(isThreadsCall)).toHaveLength(2);
  });

  it('a review landing at the confirm view, after the thread read, is on the reading: the bracket closes after the confirm and the comments (#79 round three)', () => {
    const calls: string[][] = [];
    const reading = readPrStateReading({
      target: { number: 461 },
      ghPath: '/usr/bin/gh',
      exists: () => true,
      expectedReviewers: [COPILOT],
      execFileSync: landingExecutor(
        {
          harvests: [harvestPayload([FIRST])],
          threads: [threadsPayload(0)],
          // The landing is timed by the confirm view (the second view call):
          // a bracket closed before the confirm never reads it.
          landingOnView: { call: 2, harvest: harvestPayload([FIRST, LANDING]) },
        },
        calls,
      ),
    });
    expect(reading.reviews.map((entry) => entry.body)).toEqual([FIRST.body, LANDING.body]);
    // Every leg reads inside one bracket: the closing harvest is the last
    // call, after the comments, which are read after the confirm view (#79
    // round four: the freshest leg of the matching-tip snapshot).
    const lastHarvestAt = calls.map(isHarvestCall).lastIndexOf(true);
    const lastViewAt = calls.map(isViewCall).lastIndexOf(true);
    const lastCommentsAt = calls.map(isCommentsCall).lastIndexOf(true);
    expect(lastHarvestAt).toBe(calls.length - 1);
    expect(lastCommentsAt).toBeGreaterThan(lastViewAt);
  });

  it('a quiet PR reads the harvest twice and the threads once', () => {
    const calls: string[][] = [];
    readPrStateReading({
      target: { number: 461 },
      ghPath: '/usr/bin/gh',
      exists: () => true,
      expectedReviewers: [COPILOT],
      execFileSync: landingExecutor(
        { harvests: [harvestPayload([FIRST])], threads: [threadsPayload(0)] },
        calls,
      ),
    });
    expect(calls.filter(isHarvestCall)).toHaveLength(2);
    expect(calls.filter(isThreadsCall)).toHaveLength(1);
  });

  it('fails loud when reviews land on consecutive attempts — a reading never spans two rounds', () => {
    const calls: string[][] = [];
    const THIRD = review('And again.', '2026-07-21T12:12:00Z');
    expect(() =>
      readPrStateReading({
        target: { number: 461 },
        ghPath: '/usr/bin/gh',
        exists: () => true,
        expectedReviewers: [COPILOT],
        execFileSync: landingExecutor(
          {
            harvests: [
              harvestPayload([FIRST]),
              harvestPayload([FIRST, LANDING]),
              harvestPayload([FIRST, LANDING, THIRD]),
            ],
            threads: [threadsPayload(0)],
          },
          calls,
        ),
      }),
    ).toThrow(/the review harvest or the request surface changed during the compound read/);
  });
});
