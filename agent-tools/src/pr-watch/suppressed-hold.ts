import { tallyReviewBody } from './body-tally.js';
import { dispositionLifts, parseDispositionLines } from './disposition-lines.js';
import type { IssueComment } from './issue-comments.js';
import {
  hasLanded,
  isSignedSelfReply,
  normaliseLogin,
  type HarvestedReview,
} from './reviewer-legs.js';

/**
 * The suppressed-findings hold: the fourth measured-state clause (closure item
 * 5a-vi, the owner's card "block on any finding", item 78, 2026-09-14). The
 * body tally (`body-tally.ts`) already measures what a vendor's summary review
 * says it suppressed; this module turns the measurement into a hold. A
 * tip-bound, landed, non-self-reply review body declaring N suppressed
 * findings holds the merge while fewer than N distinct findings of that review
 * carry a lifting disposition line: a line in a signed comment
 * (`disposition-lines.ts`) whose author is the repository owner or the pull
 * request's author (the seat's dispositions are posted as the bot that
 * authored the pull request; any other login's line is ignored, because the
 * signature is a text convention any commenter could write), bound to this
 * head and this review, whose sentence is a cure with its SHA or a rejection
 * (the rationale is the convention a reader checks; the machine reads the
 * verb); a routing never lifts. Because the hold binds the tip, a later review
 * on a later tip carrying none lifts it too, and the cure for a finding is the
 * cure for a thread: change, push, new review.
 *
 * @packageDocumentation
 */

/** What the hold reads from the compound reading. */
export interface SuppressedHoldReading {
  readonly url: string;
  /** The pull request's author as `gh pr view` spells it (`app/<slug>` for an App). */
  readonly author: string;
  readonly headRefOid: string;
  readonly reviews: readonly HarvestedReview[];
  readonly issueComments: readonly IssueComment[];
}

/** One review holding the merge, with the count and how much of it is lifted. */
export interface SuppressedHold {
  readonly author: string;
  readonly state: string;
  readonly reviewId: string;
  /** The tip the hold binds, as the disposition line names it. */
  readonly headRefOid: string;
  readonly verdict: string | null;
  readonly suppressed: number;
  readonly lifted: number;
}

// One key for the two spellings of a login: `gh pr view` names an App author
// `app/<slug>` while GraphQL names the same App's comments and reviews by the
// bare slug (both verified live on PRs #77 and #74, 2026-09-14); users are the
// same login on both, compared case-insensitively.
function loginKey(login: string): string {
  return normaliseLogin(login.replace(/^app\//u, ''));
}

/** The logins whose disposition lines lift: the repository owner and the pull request's author. */
function liftingLogins(reading: SuppressedHoldReading): ReadonlySet<string> {
  const owner = /^https:\/\/github\.com\/([^/]+)\//u.exec(reading.url)?.[1];
  return new Set([reading.author, ...(owner === undefined ? [] : [owner])].map(loginKey));
}

/**
 * The distinct items of a review lifted by permitted, signed disposition lines
 * bound to this head. The key is the item alone, never the anchor with it: the
 * item (an ordinal, a heading, a thread id) is unique within a review by the
 * format's definition, and an anchor-qualified key would let one finding lift
 * twice under two anchors.
 */
function liftedItems(reading: SuppressedHoldReading, reviewId: string): number {
  const permitted = liftingLogins(reading);
  const items = new Set<string>();
  for (const comment of reading.issueComments) {
    if (!permitted.has(loginKey(comment.author))) {
      continue;
    }
    for (const line of parseDispositionLines(comment.body)) {
      const boundHere = reading.headRefOid.startsWith(line.headSha) && line.reviewId === reviewId;
      if (boundHere && dispositionLifts(line.sentence)) {
        items.add(line.item);
      }
    }
  }
  return items.size;
}

/** The reviews holding the merge on this tip; none when nothing holds. */
export function suppressedHolds(reading: SuppressedHoldReading): SuppressedHold[] {
  return reading.reviews
    .filter((review) => review.commitOid === reading.headRefOid)
    .filter((review) => hasLanded(review) && !isSignedSelfReply(review.body))
    .map((review) => ({ review, tally: tallyReviewBody(review.body) }))
    .filter(({ tally }) => tally.suppressed > 0)
    .map(({ review, tally }) => ({
      author: review.author,
      state: review.state,
      reviewId: review.id,
      headRefOid: reading.headRefOid,
      verdict: tally.verdict,
      suppressed: tally.suppressed,
      lifted: liftedItems(reading, review.id),
    }))
    .filter((hold) => hold.lifted < hold.suppressed);
}

/** One evidence line per holding review: the review and its id, the tip, the count, the lift and the shortfall. */
export function suppressedHoldEvidence(holds: readonly SuppressedHold[]): string[] {
  return holds.map((hold) => {
    const verdict = hold.verdict === null ? 'no headline verdict' : `verdict "${hold.verdict}"`;
    return `suppressed findings hold the merge: ${hold.author} (${hold.state}), review ${hold.reviewId} on head SHA:${hold.headRefOid.slice(0, 7)}, ${verdict}, ${String(hold.suppressed)} suppressed finding(s), ${String(hold.lifted)} lifted by a signed disposition line from the repository owner or the pull request's author (a cure with its SHA or a rejection lifts; a routing does not: owner card item 78, 2026-09-14), ${String(hold.suppressed - hold.lifted)} remaining — cure and push, disposition the rest, or a later review on a later tip carrying none`;
  });
}
