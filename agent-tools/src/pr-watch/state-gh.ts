import { execFileSync } from 'node:child_process';

import {
  GH_EXEC_OPTIONS,
  parseGhJson,
  resolveGhPath,
  type GhCommandExecutor,
  type PathExistsCheck,
  type PrTarget,
} from './gh.js';
import { readReviewRunsLeg } from './review-runs.js';
import { readHarvestAndThreads } from './harvest-bracket.js';
import { readIssueComments } from './issue-comments.js';
import { hasLanded, isSignedSelfReply } from './reviewer-legs.js';
import { parseStateView, PR_STATE_VIEW_JSON_FIELDS } from './state-fields.js';
import type { PrStateReading } from './state-types.js';

/**
 * The gh IO composition for `pr state`: one extended `pr view` call, the
 * review-threads GraphQL slurp (shared with `pr-watch`), the FULL paginated
 * `reviews` harvest (the reviewer-leg source — never the `latestReviews`
 * pointer), the `gh agent-task` review-run legs, and the paginated issue
 * comments (the dispositions of body-only findings), composed into one
 * {@link PrStateReading}.
 *
 * The expected reviewer set is a DECLARED input (`expectedReviewers`); when
 * undeclared it defaults to the observed surface (requests ∪ harvest authors)
 * and the reading marks `expectedDeclared: false` so the verdict names the
 * first-round-guarantee gap instead of silently passing it.
 *
 * The `gh agent-task` review-run leg (bounded run→PR mapping, typed
 * degradation) lives in `review-runs.ts`.
 */

export interface ReadPrStateOptions {
  readonly target: PrTarget;
  readonly ghPath?: string;
  readonly execFileSync?: GhCommandExecutor;
  readonly exists?: PathExistsCheck;
  /** The declared expected reviewer set (`--expect`, repeatable). */
  readonly expectedReviewers?: readonly string[];
}

// `mergeable: UNKNOWN` means GitHub has not computed mergeability yet — a
// documented transient computed over seconds, so an immediate retry is a
// no-op. Fail loud once rather than let a green reading settle over an
// uncomputed conflict state.
function readMergeabilityComputedView(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly viewArgs: readonly string[];
  readonly prNumber: string;
}) {
  const view = parseStateView(
    parseGhJson(input.run(input.gh, input.viewArgs, GH_EXEC_OPTIONS), 'pr view'),
  );
  // The refusal binds OPEN PRs only: GitHub stops computing (and commonly
  // returns UNKNOWN for) merged/closed PRs, whose terminal verdicts must
  // remain reachable — including a PR that closes mid-compound-read.
  if (view.state === 'OPEN' && view.mergeable === 'UNKNOWN') {
    throw new Error(
      `PR #${input.prNumber}: mergeability not yet computed (mergeable=UNKNOWN) — re-run in a few seconds`,
    );
  }
  return view;
}

// The compound reading must bind ONE tip: a push landing between the view
// snapshot and the later legs lets an old-tip review match the stored SHA
// and read settled against a tip that owes fresh checks and a review. One
// moved tip retries the legs against the fresh snapshot; a second
// consecutive move fails loud rather than composing across tips.
const TIP_CONSISTENT_ATTEMPTS = 2;

// The declared expected set, or the observed one when none was declared. A
// defaulted expected set must not be polluted by the agent's own signed
// disposition replies (shared-credential reviews), unsubmitted drafts, or
// deleted-account 'unknown' authors — each would mint a phantom OWED leg.
function expectedSet(
  declared: readonly string[],
  reviews: PrStateReading['reviews'],
  reviewRequests: readonly string[],
): Pick<PrStateReading, 'expectedReviewers' | 'expectedDeclared'> {
  const observedAuthors = reviews
    .filter((review) => hasLanded(review) && !isSignedSelfReply(review.body))
    .map((review) => review.author)
    .filter((author) => author !== 'unknown');
  const observed = [...new Set([...reviewRequests, ...observedAuthors])];
  return {
    expectedReviewers: declared.length > 0 ? declared : observed,
    expectedDeclared: declared.length > 0,
  };
}

/**
 * Fetch the `pr state` gh surfaces and compose the compound reading.
 *
 * The harvest (reviews and requests) brackets the thread read and must agree
 * on both sides (readHarvestAndThreads), so a review seen landed has its
 * threads on the reading and a review not yet landed shows as its request;
 * a review landing inside the bracket re-reads the threads.
 *
 * @throws when the primary `pr view`, review-threads, or reviews-harvest legs
 *   fail (a verdict without them would be a guess); only the agent-task leg
 *   degrades typed.
 */

export function readPrStateReading(options: ReadPrStateOptions): PrStateReading {
  const run = options.execFileSync ?? execFileSync;
  const gh = resolveGhPath(options.ghPath, options.exists);
  const { number, repo } = options.target;
  const prNumber = String(number);

  const viewArgs = ['pr', 'view', prNumber, '--json', PR_STATE_VIEW_JSON_FIELDS.join(',')];
  if (repo !== undefined) {
    viewArgs.push('--repo', repo);
  }

  let view = readMergeabilityComputedView({ run, gh, viewArgs, prNumber });
  for (let attempt = 0; attempt < TIP_CONSISTENT_ATTEMPTS; attempt += 1) {
    const { reviews, reviewRequests, reviewThreads } = readHarvestAndThreads({
      run,
      gh,
      prNumber,
      repo,
    });
    const reviewRuns = readReviewRunsLeg({ run, gh, prNumber: number, prUrl: view.url });
    // The confirm read closes the race window; on a match it is also the
    // freshest same-tip snapshot, so the reading composes from it.
    const confirm = readMergeabilityComputedView({ run, gh, viewArgs, prNumber });
    if (confirm.headRefOid === view.headRefOid) {
      // The dispositions of body-only findings are mutable comments, read after
      // the confirm so they are the freshest leg of the reading; a line binds
      // itself to the tip and the review by its own SHA and review id
      // (suppressed-hold.ts), and a comment landing after this read is the
      // next poll's.
      const issueComments = readIssueComments({ run, gh, prNumber, repo });
      return {
        ...confirm,
        reviewThreads,
        reviewRequests,
        reviews,
        reviewRuns,
        issueComments,
        ...expectedSet(options.expectedReviewers ?? [], reviews, reviewRequests),
      };
    }
    view = confirm;
  }
  throw new Error(
    `PR #${prNumber}: head moved during the compound read on consecutive attempts — the reading cannot bind one tip; re-run when the PR is quiet`,
  );
}
