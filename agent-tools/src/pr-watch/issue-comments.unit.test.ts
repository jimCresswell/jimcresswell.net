import { describe, expect, it } from 'vitest';

import { issueCommentsArgs, parseIssueCommentPages } from './issue-comments.js';

/**
 * The issue-comments boundary of `pr state`: the PR's conversation comments,
 * paginated fully through `gh api graphql --paginate --slurp` like the review
 * harvest, carrying each comment's author and body (a body-only finding's
 * disposition lives here; pr-lifecycle SKILL §Disposition format).
 */

function page(nodes: readonly unknown[]): unknown {
  return { data: { repository: { pullRequest: { comments: { nodes } } } } };
}

describe('parseIssueCommentPages', () => {
  it('reads every comment across the pages in page order, a deleted author as unknown', () => {
    expect(
      parseIssueCommentPages([
        page([
          { author: { login: 'jimCresswell' }, body: 'first' },
          { author: null, body: 'ghost' },
        ]),
        page([{ author: { login: 'copilot-pull-request-reviewer' }, body: 'third' }]),
      ]),
    ).toStrictEqual([
      { author: 'jimCresswell', body: 'first' },
      { author: 'unknown', body: 'ghost' },
      { author: 'copilot-pull-request-reviewer', body: 'third' },
    ]);
  });

  it('reads an empty first page as no comments, and refuses a payload without the connection', () => {
    expect(parseIssueCommentPages([page([])])).toStrictEqual([]);
    expect(() => parseIssueCommentPages([])).toThrow();
    expect(() => parseIssueCommentPages([{ data: { repository: { pullRequest: {} } } }])).toThrow();
  });
});

describe('issueCommentsArgs', () => {
  it('lets gh page the comments connection itself, with placeholder variables or the given repo', () => {
    const args = issueCommentsArgs('42', undefined);
    expect(args.slice(0, 4)).toStrictEqual(['api', 'graphql', '--paginate', '--slurp']);
    const query = args.find((arg) => arg.startsWith('query=')) ?? '';
    expect(query).toContain('comments(first: 100, after: $endCursor)');
    expect(query).toContain('pageInfo { hasNextPage endCursor }');
    expect(args).toContain('owner={owner}');
    expect(args).toContain('name={repo}');
    expect(args).toContain('number=42');
    expect(issueCommentsArgs('7', 'o/r')).toEqual(expect.arrayContaining(['owner=o', 'name=r']));
  });
});
