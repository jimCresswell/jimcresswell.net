import { z } from 'zod';

import { GH_EXEC_OPTIONS, parseGhJson, type GhCommandExecutor } from './gh.js';
import { authorLogin } from './harvest-fields.js';

/**
 * The issue-comments boundary of `pr state`: the pull request's conversation
 * comments, read in full through `gh api graphql --paginate --slurp` as the
 * review harvest is, each with its author and body. A body-only finding (a
 * Copilot suppressed item) has no thread, so its disposition is a signed
 * issue comment (pr-lifecycle SKILL §Disposition format); this is the surface
 * the suppressed-findings hold reads them from (`suppressed-hold.ts`). Zod at
 * the external boundary: a payload without the connection fails loud, never a
 * silent "no comments" that would read every finding as undispositioned or,
 * worse, every hold as lifted.
 *
 * @packageDocumentation
 */

/** One conversation comment on the pull request. */
export interface IssueComment {
  readonly author: string;
  readonly body: string;
}

const COMMENTS_QUERY = `query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      comments(first: 100, after: $endCursor) {
        pageInfo { hasNextPage endCursor }
        nodes { author { login } body }
      }
    }
  }
}`;

/** The `gh api graphql` argv for the paginated comments read (placeholder variables when no repo). */
export function issueCommentsArgs(prNumber: string, repo: string | undefined): string[] {
  const [owner, name] = repo === undefined ? ['{owner}', '{repo}'] : repo.split('/');
  return [
    'api',
    'graphql',
    '--paginate',
    '--slurp',
    '-f',
    `query=${COMMENTS_QUERY}`,
    '-F',
    `owner=${owner}`,
    '-F',
    `name=${name}`,
    '-F',
    `number=${prNumber}`,
  ];
}

const commentsPageSchema = z.object({
  data: z.object({
    repository: z.object({
      pullRequest: z.object({
        comments: z.object({
          nodes: z.array(z.object({ author: authorLogin, body: z.string() })),
        }),
      }),
    }),
  }),
});

const commentsPagesSchema = z.array(commentsPageSchema).min(1);

/**
 * Parse the slurped comment pages into the comments, in page order.
 *
 * @throws a ZodError when the input is not the non-empty page array with the
 *   connection on every page (strict validation at the external-input boundary).
 */
export function parseIssueCommentPages(raw: unknown): readonly IssueComment[] {
  return commentsPagesSchema
    .parse(raw)
    .flatMap((page) => page.data.repository.pullRequest.comments.nodes);
}

/** Read the comments through the gh executor; a failure names the surface. */
export function readIssueComments(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly prNumber: string;
  readonly repo: string | undefined;
}): readonly IssueComment[] {
  try {
    return parseIssueCommentPages(
      parseGhJson(
        input.run(input.gh, issueCommentsArgs(input.prNumber, input.repo), GH_EXEC_OPTIONS),
        'api graphql comments',
      ),
    );
  } catch (cause) {
    throw new Error(`PR #${input.prNumber}: issue-comments harvest failed`, { cause });
  }
}
