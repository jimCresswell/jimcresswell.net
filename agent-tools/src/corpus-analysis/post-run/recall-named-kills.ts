/**
 * Restored from the lineage at pin `e477e62f7` on 2026-09-14 (practice-completion closure
 * item 4, row 3); the lineage's result and safe-path packages read here as `@engraph/result`
 * and `@engraph/safe-path`.
 */
import type { MetaOutput } from '../recall-schemas.js';

/**
 * Tier-D identification: killed candidates the meta stage's recall judgments identify as
 * baseline-matching (salvage ws1).
 *
 * @remarks
 * Two evidence routes, labelled by source: a `matchedCandidateId` on a recall match
 * (recall-matched — the meta stage's direct judgment) and a candidate-id mention inside a
 * recall note (note-named — the meta agent naming where a missed baseline's substance
 * actually lives). A recall-matched source outranks note-named when both name the same
 * kill. Mentions are intersected with the real candidate-id set before classification, so
 * a phantom id in free text can never mint a tier-D entry.
 */

/**
 * Whole-id candidate mentions in a recall note, matched against the run's own candidate ids
 * rather than a `C<digits>` shape the candidate schema never constrained: each id is
 * matched as a whole token (no id character on either side), so C18 never bleeds into C185
 * and an id such as `candidate-1` is found (#86 round two).
 */
function mentionedCandidateIds(note: string, candidateIds: ReadonlySet<string>): string[] {
  return [...candidateIds].filter((candidateId) =>
    new RegExp(`(?<![A-Za-z0-9_-])${escapeRegExp(candidateId)}(?![A-Za-z0-9_-])`, 'u').test(note),
  );
}

function escapeRegExp(text: string): string {
  return text.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/** How the recall judgments name one killed candidate, and which baselines name it. */
export interface RecallNamedKill {
  readonly source: 'recall-matched' | 'note-named';
  readonly baselineIds: ReadonlySet<string>;
}

/** Module-internal accumulator; the exported shape is the readonly projection above. */
interface MutableRecallNamedKill {
  source: RecallNamedKill['source'];
  readonly baselineIds: Set<string>;
}

export function recallNamedKills(
  meta: MetaOutput,
  candidateIds: ReadonlySet<string>,
  killIds: ReadonlySet<string>,
): ReadonlyMap<string, RecallNamedKill> {
  const records = new Map<string, MutableRecallNamedKill>();
  const add = (
    candidateId: string,
    source: RecallNamedKill['source'],
    baselineId: string,
  ): void => {
    const existing = records.get(candidateId);
    if (existing === undefined) {
      records.set(candidateId, { source, baselineIds: new Set([baselineId]) });
      return;
    }
    existing.baselineIds.add(baselineId);
    if (source === 'recall-matched') {
      existing.source = 'recall-matched';
    }
  };
  for (const match of meta.recallMatches) {
    if (match.matchedCandidateId !== undefined && killIds.has(match.matchedCandidateId)) {
      add(match.matchedCandidateId, 'recall-matched', match.baselineId);
    }
    // The note-named route applies to a MISSED baseline only: its note says where the
    // substance lives; a re-found baseline's note names its match, not a salvage.
    if (match.verdict !== 'missed') {
      continue;
    }
    for (const mentionedId of mentionedCandidateIds(match.note, candidateIds)) {
      if (killIds.has(mentionedId)) {
        add(mentionedId, 'note-named', match.baselineId);
      }
    }
  }
  return records;
}
