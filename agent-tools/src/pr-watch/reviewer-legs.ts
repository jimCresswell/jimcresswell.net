/**
 * Per-(reviewer, tip) leg computation for `pr state`, executing the
 * pr-lifecycle SKILL review-round state machine item 3 (the SKILL stays
 * canonical): each EXPECTED reviewer's leg reads SATISFIED, SKIPPED, or OWED,
 * evaluated against the FULL review harvest — never the per-author
 * `latestReviews` pointer, which moves BACKWARDS when an older-tip review job
 * completes after a newer push (the false-silent-wait class).
 *
 * The expected reviewer set is a DECLARED input (SKILL: read from the
 * repository's automatic-review configuration, declared by the shepherd) —
 * the caller supplies it; this module never infers it from who happened to
 * review.
 */

/** One review from the full paginated harvest (`reviews` connection). */
export interface HarvestedReview {
  readonly author: string;
  /** `APPROVED` | `CHANGES_REQUESTED` | `COMMENTED` | `DISMISSED` | … */
  readonly state: string;
  readonly body: string;
  /** Empty when gh omits the reviewed commit. */
  readonly commitOid: string;
  readonly submittedAt: string;
}

/**
 * One expected reviewer's leg for the current tip. A SKIPPED leg carries its
 * reason STRUCTURALLY — settlement classifies on `skipReason`, never on the
 * prose `detail` (security D1, 2026-08-06): a quota skip is an owner-ruled
 * settled state, while a timeout skip means THAT expected reviewer never
 * reviewed this tip and must never read merge-eligible — other legs in the
 * same round may well be SATISFIED.
 */
export type ReviewerLeg =
  | {
      readonly reviewer: string;
      readonly state: 'SATISFIED' | 'OWED';
      readonly detail: string;
    }
  | {
      readonly reviewer: string;
      readonly state: 'SKIPPED';
      readonly skipReason: 'quota' | 'timeout';
      readonly detail: string;
    };

export interface ComputeReviewerLegsInput {
  readonly headRefOid: string;
  readonly expectedReviewers: readonly string[];
  readonly reviews: readonly HarvestedReview[];
  readonly reviewRequests: readonly string[];
  /** Max completedAt across green checks; null while checks are not yet green. */
  readonly checksGreenAt: string | null;
  /** Injected clock (ISO) — the checks-green timeout leg is time-bound. */
  readonly now: string;
}

/**
 * SKILL item 3: the checks-green timeout (more than 10 min) that ends a leg
 * nobody serves. The only clock in settlement: item 4 reads measured state
 * (every leg landed, no expected reviewer requested, no run live).
 */
const REVIEW_TIMEOUT_MS = 10 * 60 * 1000;

// Skip-marker classification (SKILL: substantive reviews vs SKIPPED markers).
// A skip phrase alone declares NO REVIEW OCCURRED — such a body must never
// read SATISFIED. Only a marker whose scope is evaluable (a quota/billing
// declaration, per the owner ruling 2026-07-21) settles the leg as SKIPPED
// immediately; an unevaluable marker ("service unavailable") falls through
// to the checks-green timeout arm instead.
const SKIP_PATTERN = /review skipped|unable to review/iu;
const QUOTA_PATTERN = /spend limit|overage|quota/iu;

function isSkipMarker(body: string): boolean {
  return SKIP_PATTERN.test(body);
}

function isScopeDeclaredSkip(body: string): boolean {
  return isSkipMarker(body) && QUOTA_PATTERN.test(body);
}

// Binding is EXACT: the full harvest retains historical reviews, so a
// missing/empty commit oid must stay UNPROVEN — a wildcard would let an old
// null-commit review satisfy every later push forever. The conservative wait
// this creates is already bounded by the checks-green timeout leg.
function bindsTip(review: HarvestedReview, headRefOid: string): boolean {
  return review.commitOid === headRefOid;
}

// Logins are case-insensitive; compare through one casing so a declared
// `--expect jimcresswell` matches the API's `jimCresswell` (display keeps the
// declared form). An app login's `[bot]` suffix is the REST spelling; GraphQL
// carries Bot logins without it on both the reviews harvest and the
// review-request surface, and the `--expect` grammar admits either form, so
// the suffix is stripped on both sides of every comparison.
const BOT_SUFFIX = /\[bot\]$/u;

/** The one login comparison key: lower-cased, the app suffix stripped. */
export function normaliseLogin(login: string): string {
  return login.toLowerCase().replace(BOT_SUFFIX, '');
}

// A PENDING (draft, unsubmitted) review has not landed: it must neither
// satisfy a leg nor act as a skip marker.
export function hasLanded(review: HarvestedReview): boolean {
  return review.state !== 'PENDING';
}

// Signed self-authored disposition replies posted through the shared owner
// credential carry the PDR-027 identity-tuple signature ("— <name> (<hex6>)")
// on their FINAL line; the canonical contract excludes them from the body
// tally and they must not pollute a defaulted expected-reviewer set. The
// check is two linear probes, not one ambiguous regex (S8786 backtracking).
// The canonical parenthesised field is the BARE session_id_prefix (the join
// key — pr-lifecycle SKILL); the optional `-hex3` arm additionally tolerates
// the MCP-145 display token a seat may paste from a rendered surface (the id
// tail can be uppercase: stored ids are lowercase but externally-parsed
// blocks are rendered verbatim). The prefix arm deliberately stays exactly
// six lowercase hex and is NEVER widened toward the schema-unbounded prefix
// domain: a false POSITIVE here is silently destructive at both consumers —
// it removes the reply from body-tally evidence (settlement.ts) and, most
// dangerously, drops its author from the DEFAULTED expected-reviewer set
// (state-gh.ts), which can settle a round without a real reviewer — while a
// false NEGATIVE costs one wrong body-tally evidence line and a phantom leg
// in a defaulted set, ended by the timeout arm — so the ratified non-hex,
// uppercase-prefix, and hyphen-bearing-prefix rows (the 2a token table in
// tests/collaboration-state/visual-disambiguator.unit.test.ts) are
// deliberate non-matches, and this stays a predicate, never an extractor
// (the token is non-injective; no decode of it can be correct). Reviewer-leg
// SATISFACTION is deliberately unfiltered: a signed self-reply by a DECLARED
// expected reviewer still satisfies that leg — the exclusion binds only the
// body tally and the defaulted set.
const SIGNATURE_SUFFIX = /\([0-9a-f]{6}(?:-[0-9a-fA-F]{3})?\)$/u;

export function isSignedSelfReply(body: string): boolean {
  const lastLine = (body.trimEnd().split('\n').at(-1) ?? '').trim();
  return lastLine.startsWith('—') && SIGNATURE_SUFFIX.test(lastLine);
}

function elapsedMs(fromIso: string, nowIso: string): number {
  return Date.parse(nowIso) - Date.parse(fromIso);
}

function legFor(input: ComputeReviewerLegsInput, reviewer: string): ReviewerLeg {
  const tipBound = input.reviews.filter(
    (review) =>
      normaliseLogin(review.author) === normaliseLogin(reviewer) &&
      hasLanded(review) &&
      bindsTip(review, input.headRefOid),
  );
  if (tipBound.some((review) => !isSkipMarker(review.body))) {
    return { reviewer, state: 'SATISFIED', detail: 'review binds current tip' };
  }
  if (tipBound.some((review) => isScopeDeclaredSkip(review.body))) {
    return {
      reviewer,
      state: 'SKIPPED',
      skipReason: 'quota',
      detail: 'tip-bound quota/skip marker (scope-declared; owner ruling 2026-07-21)',
    };
  }
  const unevaluableMarker = tipBound.some((review) => isSkipMarker(review.body));
  if (
    input.checksGreenAt !== null &&
    elapsedMs(input.checksGreenAt, input.now) > REVIEW_TIMEOUT_MS
  ) {
    return {
      reviewer,
      state: 'SKIPPED',
      skipReason: 'timeout',
      detail: `timeout: no ${unevaluableMarker ? 'substantive ' : ''}tip-bound review more than 10 min after checks green (${input.checksGreenAt})`,
    };
  }
  return {
    reviewer,
    state: 'OWED',
    detail: unevaluableMarker
      ? 'tip-bound skip marker with unevaluable scope — no substantive review; awaiting the timeout arm'
      : 'no review binds the current tip',
  };
}

/** Compute every expected reviewer's leg for the current tip, in declared order. */
export function computeReviewerLegs(input: ComputeReviewerLegsInput): ReviewerLeg[] {
  return input.expectedReviewers.map((reviewer) => legFor(input, reviewer));
}

/** The most blocking unresolved leg, or `settled` when nothing is OWED. */
export type BlockingLegVerdict =
  | { readonly kind: 'settled' }
  | {
      readonly kind: 'SILENT-WAIT-NO-REVIEWER' | 'WAITING-REVIEW-RUN-LIVE';
      readonly reviewer: string;
    };

export interface MostBlockingLegInput {
  readonly legs: readonly ReviewerLeg[];
  /** Logins with an outstanding review request, from the GraphQL surface. */
  readonly reviewRequests: readonly string[];
}

/**
 * Resolve OWED legs to the most blocking per-reviewer verdict. An outstanding
 * request IS the round in flight: the platform clears it when the review
 * lands, and no other surface carries a Copilot review run (the agent-task
 * list never did, so reading "requested with no mapped run" as dead read
 * every Copilot review in progress as silent — PR #60, 2026-09-13). An
 * unrequested owed reviewer outranks a requested one, so one
 * reviewer's round in flight never masks another reviewer's stalled leg; a
 * request never served is ended by the checks-green timeout arm (SKILL item
 * 3), never by a deadness inference.
 */
export function mostBlockingLeg(input: MostBlockingLegInput): BlockingLegVerdict {
  const owed = input.legs.filter((leg) => leg.state === 'OWED');
  const requested = new Set(input.reviewRequests.map((login) => normaliseLogin(login)));

  const unrequested = owed.find((leg) => !requested.has(normaliseLogin(leg.reviewer)));
  if (unrequested !== undefined) {
    return { kind: 'SILENT-WAIT-NO-REVIEWER', reviewer: unrequested.reviewer };
  }
  const waiting = owed[0];
  if (waiting !== undefined) {
    return { kind: 'WAITING-REVIEW-RUN-LIVE', reviewer: waiting.reviewer };
  }
  return { kind: 'settled' };
}
