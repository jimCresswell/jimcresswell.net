import { describe, expect, it } from 'vitest';

import { parseAgentTaskList, parseAgentTaskView } from './agent-task-fields.js';
import { parseRequestedReviewers, parseReviewsHarvest } from './harvest-fields.js';
import { parseStateView, PR_STATE_VIEW_JSON_FIELDS } from './state-fields.js';
import { stateViewFixture } from './state-view-fixture.js';

/**
 * Boundary parsers for the D1 legs of `pr state`. Fixtures mirror shapes
 * verified live on 2026-07-21 (gh 2.x, PR #461 and the day's agent-task list):
 * autoMergeRequest null-when-unarmed; reviews with an EMPTY commit oid; a
 * User-shaped review request; CheckRun `name` / StatusContext `context` with
 * CheckRun `completedAt` anchoring checks-green.
 */

describe('parseStateView', () => {
  it('carries per-check verdicts BY NAME (CheckRun name, StatusContext context)', () => {
    const parsed = parseStateView(stateViewFixture());
    expect(parsed.namedChecks).toEqual([
      { name: 'secret-scan', bucket: 'passed' },
      { name: 'run-quality-gates', bucket: 'passed' },
      { name: 'legacy/status', bucket: 'passed' },
    ]);
    expect(parsed.checks).toEqual({ total: 3, passed: 3, failed: 0, pending: 0 });
  });

  it('anchors checksGreenAt on the LATEST completion when every green item is anchored, null otherwise', () => {
    const allAnchored = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'secret-scan',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          completedAt: '2026-07-21T10:33:35Z',
        },
        {
          __typename: 'CheckRun',
          name: 'run-quality-gates',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          completedAt: '2026-07-21T10:41:02Z',
        },
      ],
    });
    expect(allAnchored.checksGreenAt).toBe('2026-07-21T10:41:02Z');
    const notGreen = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        { __typename: 'CheckRun', name: 'a', status: 'IN_PROGRESS', conclusion: null },
      ],
    });
    expect(notGreen.checksGreenAt).toBeNull();
  });

  it('a green item with NO timestamp makes checksGreenAt null — a partial anchor can pre-date the all-green moment (r4 regression)', () => {
    // The default fixture's `legacy/status` context is green with neither
    // completedAt nor startedAt: a max over PRESENT timestamps would anchor
    // settlement at 10:41:02Z while the unanchored item's green moment is
    // unknown, letting reviewer timeout/settlement fire off a wrong time.
    expect(parseStateView(stateViewFixture()).checksGreenAt).toBeNull();
  });

  it('anchors on StatusContext startedAt when contexts are the only green items', () => {
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'StatusContext',
          context: 'Vercel',
          state: 'SUCCESS',
          startedAt: '2026-07-21T10:50:00Z',
        },
      ],
    });
    expect(parsed.checksGreenAt).toBe('2026-07-21T10:50:00Z');
  });

  it('reads autoMergeRequest null as unarmed and an object as armed', () => {
    expect(parseStateView(stateViewFixture()).autoMergeArmed).toBe(false);
    expect(
      parseStateView({
        ...stateViewFixture(),
        autoMergeRequest: { enabledAt: '2026-07-21T10:00:00Z', mergeMethod: 'MERGE' },
      }).autoMergeArmed,
    ).toBe(true);
  });

  it('normalises a null rollup to empty (no-checks PRs parse)', () => {
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: null,
    });
    expect(parsed.namedChecks).toEqual([]);
    expect(parsed.checksGreenAt).toBeNull();
  });

  it('fails loud on a genuinely misshapen payload', () => {
    expect(() => parseStateView({ number: 'not-a-number' })).toThrow();
  });

  it('parses isDraft through (drafts are refused typed downstream) — r6 regression', () => {
    expect(parseStateView({ ...stateViewFixture(), isDraft: true }).isDraft).toBe(true);
    expect(parseStateView(stateViewFixture()).isDraft).toBe(false);
  });

  it('requests exactly the fields it parses', () => {
    expect([...PR_STATE_VIEW_JSON_FIELDS]).toEqual([
      'number',
      'url',
      'state',
      'isDraft',
      'mergeable',
      'mergeStateStatus',
      'headRefOid',
      'statusCheckRollup',
      'autoMergeRequest',
    ]);
  });
});

function page(
  nodes: readonly unknown[],
  requests: readonly unknown[] = [],
  hasNextPage = false,
): unknown {
  const reviewRequests = { pageInfo: { hasNextPage }, nodes: requests };
  return { data: { repository: { pullRequest: { reviews: { nodes }, reviewRequests } } } };
}

describe('parseRequestedReviewers', () => {
  // The review-request surface is GraphQL: gh's `pr view --json reviewRequests`
  // and the REST requested_reviewers endpoint omit Bot requests entirely
  // (verified live 2026-09-13 on PR #60: Copilot's outstanding request was
  // absent from both and present on GraphQL as Bot login
  // `copilot-pull-request-reviewer`).
  it('reads Bot and User logins and Team slugs from the harvest page', () => {
    const requests = parseRequestedReviewers([
      page(
        [],
        [
          { requestedReviewer: { __typename: 'Bot', login: 'copilot-pull-request-reviewer' } },
          { requestedReviewer: { __typename: 'User', login: 'jimCresswell' } },
          { requestedReviewer: { __typename: 'Team', name: 'platform', slug: 'platform-team' } },
        ],
      ),
    ]);
    expect(requests).toEqual(['copilot-pull-request-reviewer', 'jimCresswell', 'platform-team']);
  });

  it('a request with NO identity field fails loud at the boundary, never becomes reviewer "unknown"', () => {
    expect(() => parseRequestedReviewers([page([], [{ requestedReviewer: {} }])])).toThrow(
      /identity field/,
    );
    expect(() => parseRequestedReviewers([page([], [{ requestedReviewer: null }])])).toThrow();
  });

  it('a request connection with a further page fails loud (an unread page would hide a request)', () => {
    expect(() => parseRequestedReviewers([page([], [], true)])).toThrow();
  });

  it('a page without the reviewRequests connection fails loud (a silent empty would read nobody requested)', () => {
    expect(() =>
      parseRequestedReviewers([
        { data: { repository: { pullRequest: { reviews: { nodes: [] } } } } },
      ]),
    ).toThrow();
  });
});

describe('parseReviewsHarvest', () => {
  it('flattens all pages and normalises null author/commit/submittedAt', () => {
    const reviews = parseReviewsHarvest([
      page([
        {
          author: { login: 'copilot-pull-request-reviewer' },
          state: 'COMMENTED',
          body: 'Reviewed.',
          submittedAt: '2026-07-21T12:00:00Z',
          commit: { oid: 'f'.repeat(40) },
        },
      ]),
      page([
        {
          author: null,
          state: 'COMMENTED',
          body: 'Deleted account review.',
          submittedAt: null,
          commit: null,
        },
      ]),
    ]);
    expect(reviews).toEqual([
      {
        author: 'copilot-pull-request-reviewer',
        state: 'COMMENTED',
        body: 'Reviewed.',
        submittedAt: '2026-07-21T12:00:00Z',
        commitOid: 'f'.repeat(40),
      },
      {
        author: 'unknown',
        state: 'COMMENTED',
        body: 'Deleted account review.',
        submittedAt: '',
        commitOid: '',
      },
    ]);
  });

  it('fails loud on an empty page array (a silent zero is the defect)', () => {
    expect(() => parseReviewsHarvest([])).toThrow();
  });
});

describe('parseAgentTaskList / parseAgentTaskView', () => {
  it('parses the list shape (no PR number on this surface) with null-safe completedAt', () => {
    const runs = parseAgentTaskList([
      {
        id: 'run-1',
        name: 'Review from @jimCresswell',
        createdAt: '2026-07-21T10:22:07Z',
        completedAt: null,
      },
    ]);
    expect(runs).toEqual([
      {
        id: 'run-1',
        name: 'Review from @jimCresswell',
        createdAt: '2026-07-21T10:22:07Z',
        completedAt: null,
      },
    ]);
  });

  it('parses the view shape carrying the run→PR mapping', () => {
    expect(
      parseAgentTaskView({
        id: 'run-1',
        name: 'Review',
        completedAt: null,
        pullRequestNumber: 461,
        pullRequestUrl: 'https://github.com/jimCresswell/jimcresswell.net/pull/461',
      }),
    ).toEqual({
      id: 'run-1',
      completedAt: null,
      pullRequestNumber: 461,
      pullRequestUrl: 'https://github.com/jimCresswell/jimcresswell.net/pull/461',
    });
  });

  it('rejects a partial pair (a number without its URL) as an unknown shape', () => {
    // The vendor pairs the two fields; a half-mapped view must not read as
    // "an observed run for some other PR".
    expect(() =>
      parseAgentTaskView({ id: 'run-1', completedAt: null, pullRequestNumber: 461 }),
    ).toThrow();
  });

  it('rejects a one-sided null (the other key omitted) before normalising', () => {
    // The raw states are validated before null collapses to "absent": a key
    // missing beside an explicit null is not the vendor's shape and must not
    // read as "both absent, no mapping".
    expect(() =>
      parseAgentTaskView({ id: 'run-1', completedAt: null, pullRequestNumber: null }),
    ).toThrow();
    expect(() =>
      parseAgentTaskView({ id: 'run-1', completedAt: null, pullRequestUrl: null }),
    ).toThrow();
  });

  it('rejects one null beside one value', () => {
    expect(() =>
      parseAgentTaskView({
        id: 'run-1',
        completedAt: null,
        pullRequestNumber: null,
        pullRequestUrl: 'https://github.com/jimCresswell/jimcresswell.net/pull/461',
      }),
    ).toThrow();
  });

  it('rejects a view carrying NEITHER pull-request key as an unknown shape', () => {
    // The vendor always sends both keys (explicit nulls for a PR-less run).
    // A view with neither is not a known shape: reading it as "no mapping"
    // would drop a live run for THIS PR as observed-and-unrelated, the
    // unsafe direction (adversarial review on #113, 2026-09-10).
    expect(() => parseAgentTaskView({ id: 'run-1', completedAt: null })).toThrow();
  });

  it('parses a PR-less view (explicit null PR fields — verified live 2026-09-09) as no mapping', () => {
    // `gh agent-task view` on a run that opened no pull request returns
    // `pullRequestNumber: null, pullRequestUrl: null`, not absent keys.
    expect(
      parseAgentTaskView({
        completedAt: '2026-09-06T20:37:00.148299674Z',
        id: 'aa61c92c-d7ad-4362-b5d5-a4cbdd941ff8',
        pullRequestNumber: null,
        pullRequestUrl: null,
      }),
    ).toEqual({
      id: 'aa61c92c-d7ad-4362-b5d5-a4cbdd941ff8',
      completedAt: '2026-09-06T20:37:00.148299674Z',
    });
  });

  it('fails loud on misshapen agent-task output', () => {
    expect(() => parseAgentTaskList({ not: 'an array' })).toThrow();
  });
});
