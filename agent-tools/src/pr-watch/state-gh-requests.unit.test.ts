import { describe, expect, it } from 'vitest';

import type { GhCommandExecutor } from './gh.js';
import { readPrStateReading } from './state-gh.js';

/**
 * The review-request surface of `readPrStateReading`. Requests are read from
 * the GraphQL harvest, the one surface that lists a Bot request: gh's
 * `pr view --json reviewRequests` and the REST endpoint beneath it omit Bot
 * requests entirely, so a Copilot review in flight read as "nobody requested"
 * (verified live 2026-09-13 on PR #60, whose verdict read
 * SILENT-WAIT-NO-REVIEWER with Copilot's request outstanding on GraphQL).
 */

const HEAD = 'f'.repeat(40);
const COPILOT = 'copilot-pull-request-reviewer';

function viewPayload(): string {
  return JSON.stringify({
    number: 461,
    url: 'https://github.com/oaknational/jimcresswell.net/pull/461',
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: HEAD,
    statusCheckRollup: [],
    autoMergeRequest: null,
  });
}

function threadsPayload(): string {
  const reviewThreads = { totalCount: 0, nodes: [] };
  return JSON.stringify([{ data: { repository: { pullRequest: { reviewThreads } } } }]);
}

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

function executor(calls: string[][]): GhCommandExecutor {
  return (_file, args) => {
    calls.push([...args]);
    if (args[0] === 'pr') {
      return viewPayload();
    }
    if (args[0] === 'agent-task') {
      return JSON.stringify([]);
    }
    const query = args.find((arg) => arg.startsWith('query='));
    return query?.includes('reviewThreads') === true ? threadsPayload() : harvestPayload();
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
