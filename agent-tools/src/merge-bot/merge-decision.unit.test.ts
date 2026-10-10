import { describe, expect, it } from 'vitest';

import { PR_VERDICT_STATES, type PrVerdict } from '../pr-watch/state-types.js';
import {
  decideMergeAction,
  RECORDS_CLASS_MERGE_STATES,
  verdictAwaitsSettlement,
  verdictMergesRecordsClass,
} from './merge-decision.js';

describe('the records class at the door', () => {
  const owedLeg: PrVerdict = {
    state: 'SILENT-WAIT-NO-REVIEWER',
    evidence: ['copilot-pull-request-reviewer: OWED — no review binds the current tip'],
  };
  const records = { kind: 'records', pathCount: 4 } as const;
  const code = { kind: 'code', offenders: ['.claude/settings.json'] } as const;

  it('merges a records-class pull request on every verdict that differs from settled only by the vendor leg', () => {
    for (const state of RECORDS_CLASS_MERGE_STATES) {
      const decision = decideMergeAction({
        verdict: { state, evidence: [] },
        allowMergeCommit: true,
        expectedDeclared: true,
        changeClass: records,
      });
      expect(decision.kind, state).toBe('merge');
    }
  });

  it('names the ground when the class, not the verdict, opened the door, and stays silent on SETTLE-READY', () => {
    const byClass = decideMergeAction({
      verdict: owedLeg,
      allowMergeCommit: true,
      expectedDeclared: true,
      changeClass: records,
    });
    expect(byClass.kind).toBe('merge');
    if (byClass.kind === 'merge') {
      expect(byClass.ground).toContain('records-class (4 changed paths');
      expect(byClass.ground).toContain('SILENT-WAIT-NO-REVIEWER');
      expect(byClass.ground).toContain('harvested after the merge');
    }

    const settled = decideMergeAction({
      verdict: { state: 'SETTLE-READY', evidence: [] },
      allowMergeCommit: true,
      expectedDeclared: true,
      changeClass: records,
    });
    expect(settled).toStrictEqual({ kind: 'merge' });
  });

  it('keeps a code-class pull request at the door on the same verdict and names the code paths', () => {
    const decision = decideMergeAction({
      verdict: owedLeg,
      allowMergeCommit: true,
      expectedDeclared: true,
      changeClass: code,
    });

    expect(decision).toStrictEqual({
      kind: 'refuse',
      reason:
        'verdict SILENT-WAIT-NO-REVIEWER — only SETTLE-READY merges; a records-class pull request would merge here, but the diff is code-class (.claude/settings.json)',
    });
  });

  it('never lets the records class past a red check, an open thread, a held finding or a draft', () => {
    for (const state of [
      'CHECKS-RED',
      'CHECKS-RUNNING',
      'THREADS-OPEN',
      'SUPPRESSED-FINDINGS-OPEN',
      'DRAFT',
      'BEHIND-BASE',
      'CONFLICT-DIRTY',
      'ARMED-BEHIND-RED',
      'CLOSED',
    ] as const) {
      const decision = decideMergeAction({
        verdict: { state, evidence: [] },
        allowMergeCommit: true,
        expectedDeclared: true,
        changeClass: records,
      });
      expect(decision, state).toStrictEqual({
        kind: 'refuse',
        reason: `verdict ${state} — only SETTLE-READY merges`,
      });
      expect(verdictMergesRecordsClass(state), state).toBe(false);
    }
  });

  it('still refuses a defaulted expected set and disallowed merge commits for the records class', () => {
    expect(
      decideMergeAction({
        verdict: owedLeg,
        allowMergeCommit: true,
        expectedDeclared: false,
        changeClass: records,
      }).kind,
    ).toBe('refuse');
    expect(
      decideMergeAction({
        verdict: owedLeg,
        allowMergeCommit: false,
        expectedDeclared: true,
        changeClass: records,
      }),
    ).toStrictEqual({
      kind: 'refuse',
      reason:
        'repo settings no longer allow merge commits (allow_merge_commit is false) — the never-squash ruling stands; restore the setting rather than changing method',
    });
  });
});

/**
 * The verdict→action mapping is the heart of `merge-bot merge`: it acts only
 * on SETTLE-READY, and every other outcome is a typed refusal carrying the
 * verdict's own evidence. The estate's never-squash ruling and the
 * tip-consistency guarantee are pinned here as behaviour, not prose.
 */

const SETTLE_READY: PrVerdict = {
  state: 'SETTLE-READY',
  evidence: [
    'every expected reviewer leg settled; no expected reviewer requested; no live run observed',
  ],
};

const baseInput = {
  verdict: SETTLE_READY,
  allowMergeCommit: true,
  expectedDeclared: true,
} as const;

describe('decideMergeAction', () => {
  it('merges a settled verdict when merge commits are allowed and the expected set was declared', () => {
    const decision = decideMergeAction(baseInput);

    expect(decision).toEqual({ kind: 'merge' });
  });

  it('refuses every non-settled verdict, carrying the verdict state in the reason', () => {
    const nonSettled: PrVerdict = {
      state: 'CHECKS-RED',
      evidence: ['check lint: fail'],
    };

    const decision = decideMergeAction({ ...baseInput, verdict: nonSettled });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('CHECKS-RED');
    }
  });

  it('refuses SUPPRESSED-FINDINGS-OPEN by name — suppressed body findings hold the merge (5a-vi, owner card item 78)', () => {
    const decision = decideMergeAction({
      ...baseInput,
      verdict: {
        state: 'SUPPRESSED-FINDINGS-OPEN',
        evidence: ['suppressed findings hold the merge'],
      },
    });
    expect(decision).toStrictEqual({
      kind: 'refuse',
      reason: 'verdict SUPPRESSED-FINDINGS-OPEN — only SETTLE-READY merges',
    });
  });

  it('refuses an already-merged PR — another actor merging is never this invocation merging', () => {
    const merged: PrVerdict = { state: 'MERGED', evidence: ['PR is merged'] };

    const decision = decideMergeAction({ ...baseInput, verdict: merged });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('MERGED');
      expect(decision.reason).toContain('another');
    }
  });

  it('refuses when repo settings no longer allow merge commits, never falling back to squash', () => {
    const decision = decideMergeAction({ ...baseInput, allowMergeCommit: false });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('merge commits');
      expect(decision.reason).not.toContain('squash instead');
    }
  });

  it('refuses when the expected reviewer set was defaulted rather than declared', () => {
    const decision = decideMergeAction({ ...baseInput, expectedDeclared: false });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('--expect');
    }
  });
});

describe('verdictAwaitsSettlement', () => {
  // The CLOSED partition of the verdict set: exactly two verdicts resolve
  // by waiting (checks finishing; a review round in flight, which is an
  // outstanding request or a live run, completing). Everything else needs an
  // operator act or is terminal, so polling on it would burn the budget
  // silently. The `satisfies` record is the compile-time anchor: a verdict
  // state added later fails TYPE-CHECK here until it is deliberately
  // classified (test-review D-1 cure — the earlier includes() form defaulted
  // BOTH sides to false for a new state).
  const CLASSIFICATION = {
    'SETTLE-READY': false,
    DRAFT: false,
    'WAITING-REVIEW-RUN-LIVE': true,
    'SILENT-WAIT-NO-REVIEWER': false,
    'CHECKS-RUNNING': true,
    'CHECKS-RED': false,
    'THREADS-OPEN': false,
    'SUPPRESSED-FINDINGS-OPEN': false,
    'BEHIND-BASE': false,
    'ARMED-BEHIND-RED': false,
    'QUOTA-SKIPPED': false,
    'SETTLED-NO-REVIEW': false,
    MERGED: false,
    CLOSED: false,
    'CONFLICT-DIRTY': false,
  } satisfies Record<PrVerdict['state'], boolean>;

  it.each(PR_VERDICT_STATES)('classifies %s deliberately', (state) => {
    expect(verdictAwaitsSettlement(state)).toBe(CLASSIFICATION[state]);
  });
});

describe('decideMergeAction — the timeout-skip settled round (security D1)', () => {
  it('refuses SETTLED-NO-REVIEW by name — a round nobody reviewed never merges', () => {
    const decision = decideMergeAction({
      ...baseInput,
      verdict: {
        state: 'SETTLED-NO-REVIEW',
        evidence: ['round settled ONLY by timeout — an expected reviewer never reviewed this tip'],
      },
    });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('SETTLED-NO-REVIEW');
    }
  });
});
