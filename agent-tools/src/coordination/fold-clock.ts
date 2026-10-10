import { err, ok, type Result } from '@engraph/result';

/**
 * The fold's clock, computed from the API's instants and never read by the
 * seat (the retrospective of 2026-10-10: a seat's reading of the push gate
 * was wrong by three times; the owner's bound on a fold is wall time and
 * nothing in the estate measured it). Pure: the reading arrives validated
 * from `fold-clock-reading.ts`; this module pairs, subtracts and formats.
 *
 * Instants: the ready-mark (the last `ready_for_review`, else the pull
 * request's opening), checks green (the latest passing completion among the
 * base branch's REQUIRED contexts on the tip — the merge door's own
 * definition for the records class, never every check-run, since a vendor's
 * review runs as a check-run of its own), each vendor review round (a Bot's
 * `review_requested` answered by that Bot's first later review; a request
 * re-made before the review lands supersedes the earlier one, so a review
 * answers the LATEST request before it), the merge, and the successor's first
 * check-run start when a successor tip is named. Every interval is minutes
 * from the ready-mark to one decimal, so a ledger row carries the fold's
 * shape in one line.
 */

export interface ReviewerEvent {
  readonly at: string;
  readonly login: string;
}

export interface CheckRunReading {
  readonly name: string;
  readonly conclusion: string | undefined;
  readonly startedAt: string | undefined;
  readonly completedAt: string | undefined;
}

export interface FoldClockReading {
  readonly prNumber: number;
  readonly headSha: string;
  readonly createdAt: string;
  /** Every `ready_for_review` instant, in timeline order. */
  readonly readyMarks: readonly string[];
  readonly mergedAt: string | undefined;
  /** Bot review requests, in timeline order. */
  readonly requests: readonly ReviewerEvent[];
  /** Submitted reviews, in timeline order. */
  readonly reviews: readonly ReviewerEvent[];
  /** The status contexts the base branch's rules require. */
  readonly requiredChecks: readonly string[];
  readonly headCheckRuns: readonly CheckRunReading[];
  readonly successor:
    { readonly sha: string; readonly checkRuns: readonly CheckRunReading[] } | undefined;
}

type RoundOutcome = 'reviewed' | 'superseded' | 'in-flight';

export interface ReviewRound {
  readonly login: string;
  readonly requestedAt: string;
  readonly reviewedAt: string | undefined;
  /** Request to review, minutes to one decimal; absent unless reviewed. */
  readonly minutes: number | undefined;
  readonly outcome: RoundOutcome;
}

export interface FoldClock {
  readonly prNumber: number;
  readonly headSha: string;
  readonly readyAt: string;
  readonly requiredChecks: readonly string[];
  readonly checksGreenAt: string | undefined;
  /** Required contexts with no passing run on the tip. */
  readonly checksMissing: readonly string[];
  readonly readyToGreenMinutes: number | undefined;
  readonly rounds: readonly ReviewRound[];
  readonly mergedAt: string | undefined;
  readonly readyToMergeMinutes: number | undefined;
  readonly successorSha: string | undefined;
  readonly successorLandedAt: string | undefined;
  readonly readyToSuccessorMinutes: number | undefined;
}

const MILLIS_PER_MINUTE = 60_000;
const TENTHS = 10;
/** GitHub's required-check gate passes these conclusions; the merge door reads the same set. */
const PASSING_CONCLUSIONS: ReadonlySet<string> = new Set(['success', 'neutral', 'skipped']);

/** Minutes from `from` to `to`, to one decimal; both are validated ISO instants. */
function minutesBetween(from: string, to: string): number {
  const raw = (Date.parse(to) - Date.parse(from)) / MILLIS_PER_MINUTE;
  return Math.round(raw * TENTHS) / TENTHS;
}

function later(a: string, b: string): boolean {
  return Date.parse(a) > Date.parse(b);
}

function latest(instants: readonly string[]): string | undefined {
  return instants.reduce<string | undefined>(
    (best, instant) => (best === undefined || later(instant, best) ? instant : best),
    undefined,
  );
}

function earliest(instants: readonly string[]): string | undefined {
  return instants.reduce<string | undefined>(
    (best, instant) => (best === undefined || later(best, instant) ? instant : best),
    undefined,
  );
}

function sameLogin(a: ReviewerEvent, b: ReviewerEvent): boolean {
  return a.login.toLowerCase() === b.login.toLowerCase();
}

/** The index of the latest request this review answers: same login, earlier, not yet answered. */
function latestEarlierUnpaired(
  requests: readonly ReviewerEvent[],
  review: ReviewerEvent,
  paired: ReadonlyMap<number, ReviewerEvent>,
): number {
  let chosen = -1;
  requests.forEach((request, index) => {
    const candidate =
      !paired.has(index) && sameLogin(request, review) && later(review.at, request.at);
    if (candidate && (chosen === -1 || later(request.at, requests[chosen]?.at ?? request.at))) {
      chosen = index;
    }
  });
  return chosen;
}

function roundOf(
  request: ReviewerEvent,
  review: ReviewerEvent | undefined,
  reviews: readonly ReviewerEvent[],
): ReviewRound {
  if (review !== undefined) {
    return {
      login: request.login,
      requestedAt: request.at,
      reviewedAt: review.at,
      minutes: minutesBetween(request.at, review.at),
      outcome: 'reviewed',
    };
  }
  const answeredLater = reviews.some((r) => sameLogin(r, request) && later(r.at, request.at));
  return {
    login: request.login,
    requestedAt: request.at,
    reviewedAt: undefined,
    minutes: undefined,
    outcome: answeredLater ? 'superseded' : 'in-flight',
  };
}

/** Each review answers the latest earlier unanswered request of its login; the rest are superseded or in flight. */
function pairRounds(
  requests: readonly ReviewerEvent[],
  reviews: readonly ReviewerEvent[],
): readonly ReviewRound[] {
  const paired = new Map<number, ReviewerEvent>();
  const ordered = [...reviews].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  for (const review of ordered) {
    const index = latestEarlierUnpaired(requests, review, paired);
    if (index !== -1) {
      paired.set(index, review);
    }
  }
  return requests.map((request, index) => roundOf(request, paired.get(index), ordered));
}

/** The latest passing completion per required context; a context with none is missing. */
function requiredGreen(
  required: readonly string[],
  runs: readonly CheckRunReading[],
): { readonly greenAt: string | undefined; readonly missing: readonly string[] } {
  const completions = required.map((name) => ({
    name,
    at: latest(
      runs
        .filter((run) => run.name === name && PASSING_CONCLUSIONS.has(run.conclusion ?? ''))
        .flatMap((run) => (run.completedAt === undefined ? [] : [run.completedAt])),
    ),
  }));
  const missing = completions.filter((entry) => entry.at === undefined).map((entry) => entry.name);
  const greenAt =
    missing.length > 0 || required.length === 0
      ? undefined
      : latest(completions.flatMap((entry) => (entry.at === undefined ? [] : [entry.at])));
  return { greenAt, missing };
}

function delta(readyAt: string, instant: string | undefined): number | undefined {
  return instant === undefined ? undefined : minutesBetween(readyAt, instant);
}

/** Compute the clock; fails only when an instant the reading carries does not parse. */
export function computeFoldClock(reading: FoldClockReading): Result<FoldClock, Error> {
  const readyAt = latest(reading.readyMarks) ?? reading.createdAt;
  if (Number.isNaN(Date.parse(readyAt))) {
    return err(new Error(`fold-clock: the ready instant '${readyAt}' is not a date`));
  }
  const checks = requiredGreen(reading.requiredChecks, reading.headCheckRuns);
  const successorLandedAt =
    reading.successor === undefined
      ? undefined
      : earliest(
          reading.successor.checkRuns.flatMap((run) =>
            run.startedAt === undefined ? [] : [run.startedAt],
          ),
        );
  return ok({
    prNumber: reading.prNumber,
    headSha: reading.headSha,
    readyAt,
    requiredChecks: reading.requiredChecks,
    checksGreenAt: checks.greenAt,
    checksMissing: checks.missing,
    readyToGreenMinutes: delta(readyAt, checks.greenAt),
    rounds: pairRounds(reading.requests, reading.reviews),
    mergedAt: reading.mergedAt,
    readyToMergeMinutes: delta(readyAt, reading.mergedAt),
    successorSha: reading.successor?.sha,
    successorLandedAt,
    readyToSuccessorMinutes: delta(readyAt, successorLandedAt),
  });
}
