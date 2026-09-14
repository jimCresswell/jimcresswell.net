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
import { readHarvestBracket, readReviewThreads } from './harvest-bracket.js';
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
 * The harvest (reviews and requests) brackets every other leg, the confirm
 * view then the comments, and must agree on both sides (readHarvestBracket),
 * so a review seen landed has its threads on the reading, a review not yet
 * landed shows as its request, a review landing during any leg, the confirm
 * included, re-reads the legs behind it, and the dispositions are read on the
 * confirmed tip (#65 round four; #79 rounds three and four). What remains is the
 * window between the comments read and the merge call: a disposition edited or
 * deleted there is the next poll's, accepted because GitHub offers no
 * compare-and-swap on comment state, the merge stays tip-bound, and a lifting
 * line is edited or deleted only by its author or a write-access login, here
 * the owner or the seat (#79 round five, the Director's ruling).
 *
 * @throws when the primary `pr view`, review-threads, reviews-harvest or
 *   issue-comments legs fail (a verdict without them would be a guess), when
 *   an open PR's mergeability is not yet computed on either view read, or
 *   when the tip or the harvest moves on consecutive attempts; only the
 *   agent-task leg degrades typed.
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
  const legInput = { run, gh, prNumber, repo };
  for (let attempt = 0; attempt < TIP_CONSISTENT_ATTEMPTS; attempt += 1) {
    const prUrl = view.url;
    // Every leg reads inside one harvest bracket: the confirm view closes the
    // tip's race window and, on a match, is the freshest same-tip snapshot the
    // reading composes from; the closing harvest then proves no review landed
    // during any leg. The dispositions of body-only findings are mutable
    // comments, read AFTER the confirm so they are the freshest leg of the
    // matching-tip snapshot (a line edited or deleted between an earlier read
    // and the confirm would lift a stale count, #79 round four): a line binds
    // itself to the tip and the review by its own SHA and review id
    // (suppressed-hold.ts), and a comment landing or changing after the
    // comments read is the next poll's (the closing harvest covers reviews and
    // requests, not comments).
    const { confirm, ...legs } = readHarvestBracket(legInput, () => {
      const reviewThreads = readReviewThreads(legInput);
      const reviewRuns = readReviewRunsLeg({ run, gh, prNumber: number, prUrl });
      const tip = readMergeabilityComputedView({ run, gh, viewArgs, prNumber });
      const issueComments = readIssueComments(legInput);
      return { reviewThreads, reviewRuns, issueComments, confirm: tip };
    });
    if (confirm.headRefOid === view.headRefOid) {
      return {
        ...confirm,
        ...legs,
        ...expectedSet(options.expectedReviewers ?? [], legs.reviews, legs.reviewRequests),
      };
    }
    view = confirm;
  }
  throw new Error(
    `PR #${prNumber}: head moved during the compound read on consecutive attempts — the reading cannot bind one tip; re-run when the PR is quiet`,
  );
}
