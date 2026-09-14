import {
  computeReviewerLegs,
  hasLanded,
  isSignedSelfReply,
  mostBlockingLeg,
  normaliseLogin,
} from './reviewer-legs.js';
import type { ReviewerLeg } from './reviewer-legs.js';
import { suppressedCountLabel, tallyReviewBody } from './body-tally.js';
import type { PrStateReading, PrVerdict, ReviewRun } from './state-types.js';

/**
 * The reviewer-leg and settlement half of the `pr state` verdict (SKILL items
 * 3–4): per-expected-reviewer legs over the full harvest, the most-blocking
 * OWED leg, and the settled path read from MEASURED state: every expected leg
 * landed on the tip, no expected reviewer requested, no live run observed.
 * The ten-minute quiet window that stood in for that state (a clock, because
 * agents could not see a review round's boundary) went on 2026-09-13 on the
 * owner's word ("nothing is happening on the PR ... the 'quiet window' could
 * be replaced with measured state", on #56); the boundary is measured now:
 * the platform clears the request when the review lands, and the compound
 * read brackets its thread read with a harvest on each side that must agree
 * (harvest-bracket.ts), so a review seen landed has its threads on the read
 * and a review not yet landed shows as its request.
 *
 * The run leg's contract, exactly: an OBSERVED live run mapped to the PR is a
 * measured guard and blocks settlement (roundInFlight); an unavailable or
 * truncated run surface is named on the settled verdict and does not block.
 * The asymmetry is measured: the `gh agent-task` surface lists coding-agent
 * sessions and never carried a review round (5a-i, 2026-09-13), so the review
 * round's own signal is the request, read on every compound read, and
 * blocking on an unobservable optional gh extension (a CI host has none)
 * would be the SETTLED-NO-REVIEW deadlock in another coat (the Director's
 * verdict on #65, 2026-09-14).
 */

/**
 * The run surface's gaps, named on every verdict that carries the runs leg.
 * A truncated read that still observed a live run says so through the run's
 * own line (roundInFlight), not through a "none observed" line beside it.
 */
function runsEvidence(reading: PrStateReading): string[] {
  if (reading.reviewRuns.kind === 'unavailable') {
    return [
      `review-run surface unavailable (${reading.reviewRuns.reason}): no live run observed; the review round is measured by the request surface, which this read carries`,
    ];
  }
  const note = reading.reviewRuns.note === undefined ? [] : [reading.reviewRuns.note];
  return reading.reviewRuns.truncated === true && liveRuns(reading).length === 0
    ? [
        ...note,
        'review-run surface incomplete: no live run observed in the part read; the review round is measured by the request surface, which this read carries',
      ]
    : note;
}

function expectedSetEvidence(reading: PrStateReading): string[] {
  return reading.expectedDeclared
    ? []
    : [
        'expected reviewer set DEFAULTED from the observed surface — declare --expect for the first-round guarantee',
      ];
}

function legLine(leg: ReviewerLeg): string {
  return `${leg.reviewer}: ${leg.state} — ${leg.detail}`;
}

/** The runs mapped to the PR and still in flight; none when the leg is unavailable. */
function liveRuns(reading: PrStateReading): readonly ReviewRun[] {
  return reading.reviewRuns.kind === 'read'
    ? reading.reviewRuns.runs.filter((run) => run.completedAt === null)
    : [];
}

// SKILL item 4, measured: on a tip whose legs have all landed, an outstanding
// request for an expected reviewer (a re-request after a disposition pass,
// say) or a live agent-task run OBSERVED mapped to the PR holds the round (the
// ruling: no expected reviewer requested, no live run observed). Both are
// bounded by the caller's poll budget, not by a clock: a re-request on a
// satisfied tip has no timeout leg, since the leg is SATISFIED by the review
// that landed. A request for a reviewer outside the expected set never
// holds: the owner's credential registers a request for the owner on every
// re-request (the merge-bot reference), and holding on it would deadlock
// every landing. An unavailable or truncated run surface holds nothing (the
// header says why) and is named by runsEvidence. Names what is in flight so
// the wait reads as a round, never as silence.
function roundInFlight(reading: PrStateReading): string[] {
  const expected = new Set(reading.expectedReviewers.map(normaliseLogin));
  const requested = reading.reviewRequests.filter((login) => expected.has(normaliseLogin(login)));
  return [
    ...requested.map((login) => `expected reviewer requested: ${login}`),
    ...liveRuns(reading).map((run) => `review run live: ${run.id} (${run.name})`),
  ];
}

// SKILL item 2: findings count from BOTH harvest surfaces — review threads
// AND review bodies bound to the tip; a summary-only review carrying findings
// in its body otherwise never enters the round count. The instrument cannot
// classify prose as findings (a CLEAN Copilot round also posts a non-empty
// summary body — refusing settlement on body PRESENCE would deadlock every
// landing), so the evidence hands the reader the body-tally inputs: the
// body's own headline verdict and the count it declares suppressed
// (body-tally.ts). Since 2026-09-14 the suppressed count is also a hold
// (suppressed-hold.ts, the verdict ladder in states.ts): a settled verdict
// reaches here only when every suppressed finding on the tip has been lifted
// by a disposition line, and the evidence says so.
function bodyTallyEvidence(reading: PrStateReading): string[] {
  return reading.reviews
    .filter((review) => review.commitOid === reading.headRefOid)
    .filter((review) => hasLanded(review) && !isSignedSelfReply(review.body))
    .filter((review) => review.body.trim() !== '')
    .map((review) => {
      const tally = tallyReviewBody(review.body);
      const verdict = tally.verdict === null ? 'no headline verdict' : `verdict "${tally.verdict}"`;
      const lifted =
        tally.suppressed === 0
          ? ''
          : ', each lifted by a signed disposition line (else this round would read SUPPRESSED-FINDINGS-OPEN)';
      return `tip-bound review body present: ${review.author} (${review.state}), ${verdict}, ${suppressedCountLabel(tally.suppressed)} suppressed finding(s)${lifted} — tally body findings (SKILL item 2) before reading this round as zero-finding`;
    });
}

function settledVerdict(input: {
  readonly reading: PrStateReading;
  readonly legs: readonly ReviewerLeg[];
}): PrVerdict {
  const { reading, legs } = input;
  const shared = [
    ...legs.map((leg) => legLine(leg)),
    ...bodyTallyEvidence(reading),
    ...expectedSetEvidence(reading),
    ...runsEvidence(reading),
  ];
  // A SKIPPED leg is classified first: a request still outstanding after the
  // checks-green timeout is the leg nobody served, and the timeout arm (SKILL
  // item 3, the one clock) ends the watch rather than reading it as a round
  // in flight forever. A skip on one leg thereby masks a re-request on
  // another; both readings are operator-act states, never merge-eligible.
  const skipped = skippedRoundVerdict(legs, shared);
  if (skipped !== undefined) {
    return skipped;
  }
  const inFlight = roundInFlight(reading);
  if (inFlight.length > 0) {
    return {
      state: 'WAITING-REVIEW-RUN-LIVE',
      evidence: [
        'every expected reviewer leg landed, but a round is in flight',
        ...inFlight,
        ...shared,
      ],
    };
  }
  return {
    state: 'SETTLE-READY',
    evidence: [
      'every expected reviewer leg settled; no expected reviewer requested; no live run observed',
      ...shared,
    ],
  };
}

/**
 * A settled round carrying SKIPPED legs is classified STRUCTURALLY on the
 * skip reason: quota skips take the owner-ruled QUOTA-SKIPPED state, and
 * timeout skips take SETTLED-NO-REVIEW — the timeout arm exists so a WATCH
 * can end rather than hang forever, and must never launder "nobody reviewed"
 * into merge-eligibility (security D1, 2026-08-06).
 */
function skippedRoundVerdict(
  legs: readonly ReviewerLeg[],
  shared: readonly string[],
): PrVerdict | undefined {
  if (legs.some((leg) => leg.state === 'SKIPPED' && leg.skipReason === 'quota')) {
    return {
      state: 'QUOTA-SKIPPED',
      evidence: [
        'round settled with a quota-skipped reviewer leg (owner ruling 2026-07-21)',
        ...shared,
      ],
    };
  }
  if (legs.some((leg) => leg.state === 'SKIPPED' && leg.skipReason === 'timeout')) {
    return {
      state: 'SETTLED-NO-REVIEW',
      evidence: [
        'round settled by TIMEOUT — an expected reviewer never reviewed this tip; not merge-eligible',
        ...shared,
      ],
    };
  }
  return undefined;
}

// An EMPTY expected set can never settle (SKILL CRITICAL first-round rule: an
// initial tip must not read merge-ready before the first bot round). Fires
// when --expect is undeclared and nothing is observable yet.
function emptyExpectedSetVerdict(reading: PrStateReading): PrVerdict {
  return {
    state: 'SILENT-WAIT-NO-REVIEWER',
    evidence: [
      'expected reviewer set is EMPTY (undeclared and nothing observed on an initial tip) — declare --expect; the first-round guarantee cannot hold vacuously',
      ...runsEvidence(reading),
    ],
  };
}

// On an OWED leg the request surface decides the reading; a live agent-task
// run mapped to the PR is evidence beside it (and holds a settled round, see
// roundInFlight). Name it so SILENT-WAIT never reads as "nothing is
// happening".
function unmappedLiveRunEvidence(reading: PrStateReading, blockingKind: string): string[] {
  const hasUnmappedLiveRun =
    blockingKind === 'SILENT-WAIT-NO-REVIEWER' && liveRuns(reading).length > 0;
  return hasUnmappedLiveRun
    ? ['note: a coding-agent session (agent-task run) IS live for this PR, unmapped to any request']
    : [];
}

/** Resolve the reviewer-leg half of the verdict for an otherwise-green PR. */
export function reviewerLegVerdict(reading: PrStateReading, now: string): PrVerdict {
  if (reading.expectedReviewers.length === 0) {
    return emptyExpectedSetVerdict(reading);
  }
  const legs = computeReviewerLegs({
    headRefOid: reading.headRefOid,
    expectedReviewers: reading.expectedReviewers,
    reviews: reading.reviews,
    reviewRequests: reading.reviewRequests,
    checksGreenAt: reading.checksGreenAt,
    now,
  });
  const blocking = mostBlockingLeg({ legs, reviewRequests: reading.reviewRequests });
  if (blocking.kind === 'settled') {
    return settledVerdict({ reading, legs });
  }
  const legDetail = legs.filter((leg) => leg.state === 'OWED').map((leg) => legLine(leg));
  return {
    state: blocking.kind,
    evidence: [
      `most blocking reviewer leg: ${blocking.reviewer}`,
      ...legDetail,
      ...unmappedLiveRunEvidence(reading, blocking.kind),
      ...expectedSetEvidence(reading),
      ...runsEvidence(reading),
    ],
  };
}
