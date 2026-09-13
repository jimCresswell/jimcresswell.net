/**
 * Shared gh payload builders for the `readPrStateReading` suites — shapes
 * mirror gh 2.x and GraphQL verified live on 2026-07-21 (PR #461) and
 * 2026-09-13 (PR #60). One owner (consolidate-at-second-consumer): the two
 * suites vary through their own harvest fixtures, never by editing these.
 */

export const HEAD = 'f'.repeat(40);
export const PR_URL = 'https://github.com/oaknational/jimcresswell.net/pull/461';

/** The `pr view` payload: one green check; no review requests (gh omits Bot requests anyway). */
export function viewPayload(oid: string = HEAD): string {
  return JSON.stringify({
    number: 461,
    url: PR_URL,
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: oid,
    statusCheckRollup: [
      {
        __typename: 'CheckRun',
        name: 'secret-scan',
        status: 'COMPLETED',
        conclusion: 'SUCCESS',
        completedAt: '2026-07-21T10:33:35Z',
      },
    ],
    autoMergeRequest: null,
  });
}

/** The review-threads page: `resolved` threads, every one resolved. */
export function threadsPayload(resolved = 2): string {
  const nodes = Array.from({ length: resolved }, () => ({ isResolved: true }));
  const reviewThreads = { totalCount: resolved, nodes };
  return JSON.stringify([{ data: { repository: { pullRequest: { reviewThreads } } } }]);
}

/** The two GraphQL legs a suite answers: the threads page and the review harvest. */
export interface GraphqlPayloads {
  readonly threads: () => string;
  readonly harvest: () => string;
}

// The harvest connection the product's query must select; whitespace-tolerant
// so the fixture binds to the selection, not to the query's formatting.
const SELECTS_REQUESTS = /reviewRequests\s*\(/u;

/**
 * Dispatch one `api graphql` call on its query text. The harvest fixture
 * answers only a query that selects the request connection: a query that
 * dropped it gets an error, never a fixture that happens to fit.
 */
export function graphqlResponse(args: readonly string[], payloads: GraphqlPayloads): string {
  const query = args.find((arg) => arg.startsWith('query=')) ?? '';
  if (query.includes('reviewThreads')) {
    return payloads.threads();
  }
  if (!SELECTS_REQUESTS.test(query)) {
    throw new Error('the harvest query no longer selects reviewRequests');
  }
  return payloads.harvest();
}
