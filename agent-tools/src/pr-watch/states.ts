import { reviewerLegVerdict } from './settlement.js';
import type { PrStateReading, PrVerdict } from './state-types.js';
import { suppressedHoldEvidence, suppressedHolds } from './suppressed-hold.js';

/**
 * The D1 verdict core for `agent-tools pr state`: resolve one compound
 * {@link PrStateReading} to exactly one verdict from the CLOSED verdict set
 * (`state-types.ts`). Pure and total — no IO; the gh seam lives in
 * `state-gh.ts`, the per-reviewer leg machine in `reviewer-legs.ts`, the
 * settlement half in `settlement.ts`. The set and precedence execute the
 * pr-lifecycle SKILL's review-round state machine (the SKILL stays
 * canonical); per-check verdicts travel BY NAME, never positionally (the
 * #437 cure — fixtures in `states.unit.test.ts`).
 *
 * Two states extend the plan's 11-state enumeration, each typed honesty over
 * a lie: `CLOSED` (a closed-unmerged PR gets a refusal, never a mis-mapped
 * healthy verdict) and `BEHIND-BASE` (a stale base never reads settled — the
 * founding BEHIND-stall class). Three were retired on 2026-09-13: the two
 * run-deadness states (`SILENT-WAIT-RUN-DEAD`, `SILENT-WAIT-RUNS-UNREADABLE`),
 * because a run's ABSENCE cannot be inferred from the `gh agent-task`
 * surface (it lists coding-agent sessions and never carried a review run),
 * so an outstanding request with no mapped run is the round in flight
 * (`WAITING-REVIEW-RUN-LIVE`) and a request never served is ended by the
 * timeout arm, while an OBSERVED live session mapped to the PR still blocks
 * settlement (`settlement.ts` roundInFlight); and `SETTLING-QUIET-WINDOW`,
 * the ten-minute clock that stood in for a round boundary agents could not
 * see, replaced by measured state on the owner's word (no expected reviewer
 * requested, no live run observed). One was added on 2026-09-14:
 * `SUPPRESSED-FINDINGS-OPEN`, the fourth measured-state clause (closure item
 * 5a-vi, the owner's card "block on any finding"): the body tally that was
 * evidence beside a settled verdict now holds the round (`suppressed-hold.ts`).
 */

function failedCheckNames(reading: PrStateReading): string[] {
  return reading.namedChecks
    .filter((check) => check.bucket === 'failed')
    .map((check) => check.name);
}

type VerdictRule = (reading: PrStateReading) => PrVerdict | undefined;

const terminalRules: readonly VerdictRule[] = [
  (r) => (r.state === 'MERGED' ? { state: 'MERGED', evidence: [] } : undefined),
  (r) =>
    r.state === 'CLOSED'
      ? { state: 'CLOSED', evidence: ['closed without merging — no healthy verdict exists'] }
      : undefined,
  (r) =>
    r.mergeable === 'CONFLICTING' || r.mergeStateStatus === 'DIRTY'
      ? {
          state: 'CONFLICT-DIRTY',
          evidence: [`mergeable=${r.mergeable} mergeStateStatus=${r.mergeStateStatus}`],
        }
      : undefined,
];

const checksAndThreadsRules: readonly VerdictRule[] = [
  // A draft cannot merge via the sanctioned landing path whatever the legs
  // say (the landing-path invariant) — typed refusal before any settlement
  // read; unlike review-gate BLOCKED (ratified landable), draftness is a
  // REAL merge blocker at the REST endpoint.
  (r) =>
    r.isDraft
      ? {
          state: 'DRAFT',
          evidence: [
            'draft PR — the sanctioned landing path cannot merge a draft; mark ready for review first',
          ],
        }
      : undefined,
  (r) =>
    r.autoMergeArmed && r.checks.failed > 0
      ? {
          state: 'ARMED-BEHIND-RED',
          evidence: [
            'auto-merge is ARMED behind red — progresses nothing, alerts nobody',
            ...failedCheckNames(r).map((name) => `failed check: ${name}`),
          ],
        }
      : undefined,
  (r) =>
    r.checks.failed > 0
      ? {
          state: 'CHECKS-RED',
          evidence: failedCheckNames(r).map((name) => `failed check: ${name}`),
        }
      : undefined,
  // Zero checks are never vacuously green: absence of evidence is not a pass.
  (r) =>
    r.checks.pending > 0 || r.checks.passed === 0
      ? {
          state: 'CHECKS-RUNNING',
          evidence: [
            `checks ${r.checks.passed}/${r.checks.total} passed, none failed`,
            ...(r.checks.total === 0
              ? ['no checks configured or reported yet — nothing will transition without one']
              : []),
          ],
        }
      : undefined,
  // Open threads and suppressed body findings can hold together; the verdict
  // is THREADS-OPEN and its evidence names both.
  (r) =>
    r.reviewThreads.unresolved > 0
      ? {
          state: 'THREADS-OPEN',
          evidence: [
            `${r.reviewThreads.unresolved}/${r.reviewThreads.total} review threads unresolved`,
            ...suppressedHoldEvidence(suppressedHolds(r)),
          ],
        }
      : undefined,
  // The fourth measured-state clause (5a-vi, the owner's card "block on any
  // finding", item 78, 2026-09-14): a tip-bound review body's suppressed
  // findings hold the merge until each is cured or reasonably rejected by a
  // signed disposition line, or a later review on a later tip carries none.
  (r) => {
    const holds = suppressedHolds(r);
    return holds.length > 0
      ? { state: 'SUPPRESSED-FINDINGS-OPEN', evidence: suppressedHoldEvidence(holds) }
      : undefined;
  },
  // The founding BEHIND-stall class: a BEHIND base blocks the merge whatever
  // the legs say, and an armed intent behind it stalls silently. Never a
  // settled verdict here — fold/update the branch first.
  (r) =>
    r.mergeStateStatus === 'BEHIND'
      ? {
          state: 'BEHIND-BASE',
          evidence: [
            'base branch has moved (mergeStateStatus=BEHIND) — update/fold before arming; an armed intent behind a moved base stalls silently',
          ],
        }
      : undefined,
];

/**
 * Resolve the compound reading to its single verdict, most-blocking first:
 * terminal states, then conflict, then the armed/checks/threads ladder, then
 * the per-reviewer legs and measured settlement.
 *
 * @param reading - the compound reading from the gh seam
 * @param nowIso - injected clock; only the checks-green timeout leg is
 *   time-bound (SKILL item 3)
 */
export function computePrVerdict(reading: PrStateReading, nowIso: string): PrVerdict {
  for (const rule of [...terminalRules, ...checksAndThreadsRules]) {
    const verdict = rule(reading);
    if (verdict !== undefined) {
      return verdict;
    }
  }
  return reviewerLegVerdict(reading, nowIso);
}
