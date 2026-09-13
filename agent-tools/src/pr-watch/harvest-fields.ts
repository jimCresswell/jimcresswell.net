import { z } from 'zod';

import type { HarvestedReview } from './reviewer-legs.js';

/**
 * Boundary parsers for the GraphQL review harvest of `pr state`: the FULL
 * paginated review harvest (the `latestReviews` per-author pointer is
 * deliberately NOT a source here — it moves backwards when an older-tip review
 * job completes late) and the outstanding review requests, which ride the same
 * query because GraphQL is the one surface that lists a Bot request. Zod at the
 * external boundary; misshapen input fails loud, while fields the platform
 * genuinely nulls normalise explicitly.
 */

// A requested reviewer names a Bot, User or Mannequin (`login`) or a Team
// (`slug`, with `name` as a fallback). An entry with NO identity field is
// misshapen external input and fails loud at the boundary
// (strict-validation-at-boundary): transforming it to 'unknown' would mint a
// real reviewer identifier that drives leg verdicts.
const requestedReviewerSchema = z
  .object({
    login: z.string().optional(),
    slug: z.string().optional(),
    name: z.string().optional(),
  })
  .loose()
  .transform((value, context) => {
    const identity = value.login ?? value.slug ?? value.name;
    if (identity === undefined) {
      context.addIssue({
        code: 'custom',
        message: 'review request carries no Bot/User/Team identity field (login/slug/name)',
      });
      return z.NEVER;
    }
    return identity;
  });

const authorLogin = z
  .object({ login: z.string() })
  .nullish()
  .transform((value) => value?.login ?? 'unknown');

// One page of the paginated `reviews` connection as `gh api graphql --paginate
// --slurp` returns it. The FULL harvest is the reviewer-leg source (SKILL item
// 3); a bounded `reviews(last:N)` read is the recorded wrong shape. The same
// query carries the outstanding review requests (every page repeats them; the
// first page is read), so the request surface is GraphQL, where Bot requests
// are visible. A page without the connection fails loud: a silent empty
// would read "nobody requested" over a review in flight.
const reviewsPageSchema = z.object({
  data: z.object({
    repository: z.object({
      pullRequest: z.object({
        reviews: z.object({
          nodes: z.array(
            z.object({
              author: authorLogin,
              state: z.string(),
              body: z.string(),
              submittedAt: z
                .string()
                .nullish()
                .transform((value) => value ?? ''),
              commit: z
                .object({ oid: z.string() })
                .nullish()
                .transform((value) => value?.oid ?? ''),
            }),
          ),
        }),
        reviewRequests: z.object({
          // The request connection is read unpaginated; a second page would be
          // silently missed, so its presence fails loud.
          pageInfo: z.object({ hasNextPage: z.literal(false) }),
          nodes: z.array(z.object({ requestedReviewer: requestedReviewerSchema })),
        }),
      }),
    }),
  }),
});

// A non-empty page array, modelled as such: the first page is always present,
// so no branch can turn a missing page into a silent empty.
const reviewsPagesSchema = z.tuple([reviewsPageSchema]).rest(reviewsPageSchema);

/**
 * Parse the outstanding review requests from the harvest's first page: Bot,
 * User and Mannequin logins, Team slugs.
 *
 * @throws a ZodError when the pages lack the connection, the connection has a
 *   further page, or a request carries no identity (strict validation at the
 *   external-input boundary).
 */
export function parseRequestedReviewers(raw: unknown): string[] {
  const [first] = reviewsPagesSchema.parse(raw);
  return first.data.repository.pullRequest.reviewRequests.nodes.map(
    (node) => node.requestedReviewer,
  );
}

/**
 * Parse the slurped multi-page `reviews` harvest into {@link HarvestedReview}s.
 *
 * @throws a ZodError when the input is not the expected slurped page-array
 *   shape (never a silent empty — an empty harvest must be a real empty page).
 */
export function parseReviewsHarvest(raw: unknown): HarvestedReview[] {
  return reviewsPagesSchema
    .parse(raw)
    .flatMap((page) => page.data.repository.pullRequest.reviews.nodes)
    .map((node) => ({
      author: node.author,
      state: node.state,
      body: node.body,
      commitOid: node.commit,
      submittedAt: node.submittedAt,
    }));
}
