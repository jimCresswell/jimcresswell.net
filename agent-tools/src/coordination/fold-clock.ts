import { err, ok, type Result } from '@engraph/result';

/**
 * The fold's clock, computed from the API's instants and never read by the
 * seat (the retrospective of 2026-10-10: a seat's reading of the push gate
 * was wrong by three times; the owner's bound on a fold is wall time and
 * nothing in the estate measured it). Pure: the reading arrives validated
 * from `fold-clock-reading.ts`; this module pairs, subtracts and formats.
 *
 * Instants: the ready-mark (the last `ready_for_review`, else the pull
 * request's opening), checks green (the latest success among the base
 * branch's REQUIRED checks on the merged tip — never every check-run, since
 * a vendor's review runs as a check-run of its own), each vendor review
 * round (a Bot's `review_requested` paired with that Bot's first later
 * review), the merge, and the successor's first check-run start when a
 * successor tip is named. Every interval is minutes from the ready-mark to
 * one decimal, so a ledger row carries the fold's shape in one line.
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

interface ReviewRound {
  readonly login: string;
  readonly requestedAt: string;
  readonly reviewedAt: string | undefined;
  /** Request to review, minutes to one decimal; absent while the review is in flight. */
  readonly minutes: number | undefined;
}

export interface FoldClock {
  readonly prNumber: number;
  readonly headSha: string;
  readonly readyAt: string;
  readonly requiredChecks: readonly string[];
  readonly checksGreenAt: string | undefined;
  /** Required contexts with no success run on the tip. */
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

/** Each Bot request paired with that Bot's first later, still unpaired review (login case-insensitive). */
function pairRounds(
  requests: readonly ReviewerEvent[],
  reviews: readonly ReviewerEvent[],
): readonly ReviewRound[] {
  const unpaired = [...reviews];
  return requests.map((request) => {
    const index = unpaired.findIndex(
      (review) =>
        review.login.toLowerCase() === request.login.toLowerCase() && later(review.at, request.at),
    );
    const review = index === -1 ? undefined : unpaired.splice(index, 1)[0];
    return {
      login: request.login,
      requestedAt: request.at,
      reviewedAt: review?.at,
      minutes: review === undefined ? undefined : minutesBetween(request.at, review.at),
    };
  });
}

/** The latest success completion per required context; a context with none is missing. */
function requiredGreen(
  required: readonly string[],
  runs: readonly CheckRunReading[],
): { readonly greenAt: string | undefined; readonly missing: readonly string[] } {
  const completions = required.map((name) => ({
    name,
    at: latest(
      runs
        .filter((run) => run.name === name && run.conclusion === 'success')
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

const SHORT_SHA = 8;

function signed(minutes: number): string {
  return `${minutes < 0 ? '-' : '+'}${Math.abs(minutes).toFixed(1)} min`;
}

function checksSegment(clock: FoldClock): string {
  if (clock.requiredChecks.length === 0) {
    return 'checks: none required on the base';
  }
  if (clock.readyToGreenMinutes === undefined) {
    return `checks not green (${clock.checksMissing.join(', ')})`;
  }
  return `checks green ${signed(clock.readyToGreenMinutes)}`;
}

function roundsSegment(rounds: readonly ReviewRound[]): string {
  if (rounds.length === 0) {
    return 'rounds 0';
  }
  const described = rounds.map((round) =>
    round.minutes === undefined
      ? `${round.login} in flight since ${round.requestedAt}`
      : `${round.login} ${round.minutes.toFixed(1)}`,
  );
  return `rounds ${rounds.length} (${described.join(', ')} min)`;
}

function successorSegment(clock: FoldClock): string | undefined {
  if (clock.successorSha === undefined) {
    return undefined;
  }
  const short = clock.successorSha.slice(0, SHORT_SHA);
  return clock.readyToSuccessorMinutes === undefined
    ? `successor ${short} not yet on CI`
    : `successor ${short} on CI ${signed(clock.readyToSuccessorMinutes)}`;
}

/** The one line a ledger row carries. */
export function formatFoldClock(clock: FoldClock): string {
  const segments = [
    `fold-clock PR ${clock.prNumber} tip ${clock.headSha.slice(0, SHORT_SHA)}: ready ${clock.readyAt}`,
    checksSegment(clock),
    roundsSegment(clock.rounds),
    clock.readyToMergeMinutes === undefined
      ? 'not merged'
      : `merged ${signed(clock.readyToMergeMinutes)}`,
    successorSegment(clock),
  ];
  return segments.filter((segment) => segment !== undefined).join('; ');
}
