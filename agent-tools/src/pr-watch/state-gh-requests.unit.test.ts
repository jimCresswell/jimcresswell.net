import { describe, expect, it } from 'vitest';

import type { GhCommandExecutor } from './gh.js';
import { readPrStateReading } from './state-gh.js';
import {
  commentsPayload,
  graphqlResponse,
  HEAD,
  threadsPayload,
  viewPayload,
  type GraphqlPayloads,
} from './test-helpers/state-gh-payloads.js';

/**
 * The review-request surface of `readPrStateReading`. Requests are read from
 * the GraphQL harvest, the one surface that lists a Bot request: gh's
 * `pr view --json reviewRequests` and the REST endpoint beneath it omit Bot
 * requests entirely, so a Copilot review in flight read as "nobody requested"
 * (verified live 2026-09-13 on PR #60, whose verdict read
 * SILENT-WAIT-NO-REVIEWER with Copilot's request outstanding on GraphQL).
 */

const COPILOT = 'copilot-pull-request-reviewer';

/** The harvest page: no review landed yet, one Bot request and one User request outstanding. */
function harvestPayload(): string {
  const reviewRequests = {
    pageInfo: { hasNextPage: false },
    nodes: [
      { requestedReviewer: { __typename: 'Bot', login: COPILOT } },
      { requestedReviewer: { __typename: 'User', login: 'jimCresswell' } },
    ],
  };
  const pullRequest = { reviews: { nodes: [] }, reviewRequests };
  return JSON.stringify([{ data: { repository: { pullRequest } } }]);
}

/**
 * A review landing mid-read: the harvest returns it landed (request cleared);
 * the threads read carries its one unresolved thread only once the harvest
 * has been read, as the platform would after the review's submission.
 */
function landingPayloads(): GraphqlPayloads {
  let landed = false;
  return {
    harvest: () => {
      landed = true;
      const review = {
        id: 'PRR_landing',
        author: { login: COPILOT },
        state: 'COMMENTED',
        body: 'One finding.',
      };
      const pullRequest = {
        reviews: { nodes: [{ ...review, submittedAt: 't1', commit: { oid: HEAD } }] },
        reviewRequests: { pageInfo: { hasNextPage: false }, nodes: [] },
      };
      return JSON.stringify([{ data: { repository: { pullRequest } } }]);
    },
    threads: () => {
      const nodes = landed ? [{ isResolved: false }] : [];
      const reviewThreads = { totalCount: nodes.length, nodes };
      return JSON.stringify([{ data: { repository: { pullRequest: { reviewThreads } } } }]);
    },
    comments: () => commentsPayload(),
  };
}

function executor(
  calls: string[][],
  payloads: GraphqlPayloads = {
    harvest: harvestPayload,
    threads: () => threadsPayload(0),
    comments: () => commentsPayload(),
  },
): GhCommandExecutor {
  return (_file, args) => {
    calls.push([...args]);
    if (args[0] === 'pr') {
      return viewPayload();
    }
    if (args[0] === 'agent-task') {
      return JSON.stringify([]);
    }
    return graphqlResponse(args, payloads);
  };
}

const ghSeam = { ghPath: '/usr/bin/gh', exists: () => true };

describe('readPrStateReading — review requests', () => {
  it('reads review requests from the GraphQL harvest, where a Bot request is visible, never from pr view', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: executor([]),
    });
    // The view payload carries no requests, so this set can only have come from the harvest.
    expect(reading.reviewRequests).toEqual([COPILOT, 'jimCresswell']);
  });

  it('a review landing mid-read is read with its threads: the harvest is read before the threads', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: executor([], landingPayloads()),
    });
    expect(reading.reviewRequests).toEqual([]);
    expect(reading.reviews).toHaveLength(1);
    expect(reading.reviewThreads).toEqual({ total: 1, unresolved: 1 });
  });

  it('an outstanding Bot request enters the defaulted expected set', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: executor([]),
    });
    expect(reading.expectedDeclared).toBe(false);
    expect(reading.expectedReviewers).toEqual([COPILOT, 'jimCresswell']);
  });
});
