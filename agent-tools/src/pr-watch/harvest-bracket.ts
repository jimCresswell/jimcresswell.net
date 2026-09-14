import { GH_EXEC_OPTIONS, parseGhJson, reviewThreadsArgs, type GhCommandExecutor } from './gh.js';
import { parseHarvest, type ReviewHarvest } from './harvest-fields.js';
import { parseReviewThreadPages, type ReviewThreadsSummary } from './review-threads.js';

/**
 * The `pr state` review surfaces: the FULL paginated reviews harvest (the
 * reviewer-leg source — never the `latestReviews` pointer) with the
 * outstanding requests riding the same query, and the review-threads slurp
 * (shared with `pr-watch`), read as one bracket.
 *
 * The harvest (reviews and requests) is read on BOTH sides of the thread read
 * and must agree. Reading it once before the threads left a window: an
 * expected reviewer already satisfied on the tip, re-requested after that
 * harvest returned and reviewing again (summary-only) before the thread
 * read, was absent from the reading with no thread, so nothing held the
 * round and it settled over the findings (Copilot's finding on #65, round
 * three, 2026-09-14). A harvest that moved re-reads the threads behind it;
 * two consecutive moves fail loud rather than compose across rounds. The
 * bracket binds one instant: a round opening after its closing harvest is the
 * next poll's, or the post-merge harvest's (pr-lifecycle SKILL, Phase 8).
 */

interface HarvestInput {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly prNumber: string;
  readonly repo: string | undefined;
}

// Paginated full-history reviews harvest; `--slurp` wraps pages into one array.
// The outstanding review requests ride the same query: this is the one surface
// that lists a Bot request (gh's `pr view --json reviewRequests` and REST omit
// it — verified live 2026-09-13 on PR #60, Copilot's request absent from both).
const REVIEWS_QUERY = `query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      reviews(first: 100, after: $endCursor) {
        pageInfo { hasNextPage endCursor }
        nodes { author { login } state body submittedAt commit { oid } }
      }
      reviewRequests(first: 100) {
        pageInfo { hasNextPage }
        nodes { requestedReviewer { __typename ... on Bot { login } ... on User { login } ... on Mannequin { login } ... on Team { slug name } } }
      }
    }
  }
}`;

function reviewsHarvestArgs(prNumber: string, repo: string | undefined): string[] {
  const [owner, name] = repo === undefined ? ['{owner}', '{repo}'] : repo.split('/');
  return [
    'api',
    'graphql',
    '--paginate',
    '--slurp',
    '-f',
    `query=${REVIEWS_QUERY}`,
    '-F',
    `owner=${owner}`,
    '-F',
    `name=${name}`,
    '-F',
    `number=${prNumber}`,
  ];
}

// Wrap the harvest failure with operator-grade evidence: a nonexistent or
// inaccessible PR surfaces as a null pullRequest deep in the GraphQL payload.
function readReviewHarvest(input: HarvestInput): ReviewHarvest {
  try {
    return parseHarvest(
      parseGhJson(
        input.run(input.gh, reviewsHarvestArgs(input.prNumber, input.repo), GH_EXEC_OPTIONS),
        'api graphql reviews',
      ),
    );
  } catch (cause) {
    throw new Error(
      `PR #${input.prNumber}: reviews harvest failed — does the PR exist and is it accessible?`,
      { cause },
    );
  }
}

function readReviewThreads(input: HarvestInput) {
  return parseReviewThreadPages(
    parseGhJson(
      input.run(input.gh, reviewThreadsArgs(input.prNumber, input.repo), GH_EXEC_OPTIONS),
      'api graphql reviewThreads',
    ),
  );
}

const HARVEST_CONSISTENT_ATTEMPTS = 2;

// Order-insensitive: the platform's connection order is not a contract, and
// a quiet PR whose two requests came back reordered must not read as a move.
function canonical(harvest: ReviewHarvest): string {
  const sorted = (entries: readonly unknown[]): string[] =>
    entries.map((entry) => JSON.stringify(entry)).sort((a, b) => a.localeCompare(b));
  return JSON.stringify([sorted(harvest.reviews), sorted(harvest.reviewRequests)]);
}

function sameHarvest(before: ReviewHarvest, after: ReviewHarvest): boolean {
  return canonical(before) === canonical(after);
}

/**
 * Read the reviews harvest and the review threads as one consistent bracket.
 *
 * @throws when a harvest fails, or when reviews land on consecutive attempts.
 */
export function readHarvestAndThreads(
  input: HarvestInput,
): ReviewHarvest & { readonly reviewThreads: ReviewThreadsSummary } {
  let before = readReviewHarvest(input);
  for (let attempt = 0; attempt < HARVEST_CONSISTENT_ATTEMPTS; attempt += 1) {
    const reviewThreads = readReviewThreads(input);
    const after = readReviewHarvest(input);
    if (sameHarvest(before, after)) {
      return { ...after, reviewThreads };
    }
    before = after;
  }
  throw new Error(
    `PR #${input.prNumber}: reviews landed during the compound read on consecutive attempts — the harvest and the threads cannot bind one round; re-run when the PR is quiet`,
  );
}
