import { describe, expect, it } from 'vitest';

import {
  baseMismatch,
  classifyCasOutcome,
  classifyRemoteReadback,
  classifyRemoteReread,
  decideRetirement,
  type PlannedDelete,
  type RetireReadings,
  type TipState,
} from './retire-decision.js';

/**
 * The retire decision: readings in, a refusal, "nothing to retire" or a
 * delete plan out. Written as relations over every combination of the three
 * names a branch can have, so no case is a hand-picked example.
 */

const BASE = { name: 'main', sha: '0'.repeat(39) + '1' };
const TIP_NAMES = ['local', 'tracking', 'remote'] as const;
type TipName = (typeof TIP_NAMES)[number];
type TipCase = 'absent' | 'merged' | 'unmerged';

const shaFor = (tip: TipName): string =>
  ({ local: 'a', tracking: 'b', remote: 'c' })[tip].repeat(40);

function tipState(tip: TipName, state: TipCase): TipState | undefined {
  return state === 'absent' ? undefined : { sha: shaFor(tip), onBase: state === 'merged' };
}

function readingsFor(states: Readonly<Record<TipName, TipCase>>): RetireReadings {
  return {
    branch: 'feat/x',
    base: BASE,
    local: tipState('local', states.local),
    tracking: tipState('tracking', states.tracking),
    remote: tipState('remote', states.remote),
    inUseBy: [],
    caseCollisions: [],
    symbolic: [],
  };
}

/** No names at all is "absent"; otherwise the plan holds exactly the present names at their shas. */
function expectPlanOfPresentNames(states: Readonly<Record<TipName, TipCase>>): void {
  const decision = decideRetirement(readingsFor(states));
  if (TIP_NAMES.every((tip) => states[tip] === 'absent')) {
    expect(decision).toEqual({ kind: 'absent' });
    return;
  }
  expect(decision.kind).toBe('plan');
  const plan = decision.kind === 'plan' ? decision.plan : undefined;
  for (const tip of TIP_NAMES) {
    const expected = states[tip] === 'merged' ? shaFor(tip) : undefined;
    expect(plan?.[tip]?.expectedSha).toBe(expected);
  }
}

function everyCombination(): readonly Readonly<Record<TipName, TipCase>>[] {
  const cases: TipCase[] = ['absent', 'merged', 'unmerged'];
  return cases.flatMap((local) =>
    cases.flatMap((tracking) => cases.map((remote) => ({ local, tracking, remote }))),
  );
}

describe('decideRetirement over every combination of the three names', () => {
  it('refuses whenever any present tip is off the default, naming that tip and its sha', () => {
    for (const states of everyCombination()) {
      const unmerged = TIP_NAMES.filter((tip) => states[tip] === 'unmerged');
      if (unmerged.length === 0) {
        continue;
      }
      const decision = decideRetirement(readingsFor(states));
      expect(decision.kind).toBe('refused');
      if (decision.kind === 'refused') {
        expect(unmerged.some((tip) => decision.reason.includes(shaFor(tip)))).toBe(true);
        expect(decision.reason).toContain(`main@${BASE.sha}`);
      }
    }
  });

  it('plans exactly the present names at the shas read, when every tip is on the default', () => {
    for (const states of everyCombination()) {
      if (TIP_NAMES.some((tip) => states[tip] === 'unmerged')) {
        continue;
      }
      expectPlanOfPresentNames(states);
    }
  });

  it('plans the refs by their exact full names', () => {
    const decision = decideRetirement(
      readingsFor({ local: 'merged', tracking: 'merged', remote: 'merged' }),
    );

    expect(decision.kind).toBe('plan');
    if (decision.kind === 'plan') {
      expect(decision.plan.local?.ref).toBe('refs/heads/feat/x');
      expect(decision.plan.tracking?.ref).toBe('refs/remotes/origin/feat/x');
      expect(decision.plan.remote?.ref).toBe('refs/heads/feat/x');
    }
  });
});

describe('decideRetirement refusals decided before the tips', () => {
  const merged = readingsFor({ local: 'merged', tracking: 'merged', remote: 'merged' });

  it('refuses the default branch in any case', () => {
    for (const branch of ['main', 'Main', 'MAIN']) {
      const decision = decideRetirement({ ...merged, branch });
      expect(decision.kind).toBe('refused');
    }
  });

  it('reads the default branch from the remote, not from a fixed name', () => {
    const engraph = { ...merged, base: { name: 'engraph', sha: BASE.sha } };

    expect(decideRetirement({ ...engraph, branch: 'Engraph' }).kind).toBe('refused');
    expect(decideRetirement({ ...engraph, branch: 'main' }).kind).toBe('plan');
  });

  it('refuses a branch whose own ref is symbolic, and names that ref', () => {
    const decision = decideRetirement({ ...merged, symbolic: ['refs/heads/feat/x'] });

    expect(decision.kind).toBe('refused');
    if (decision.kind === 'refused') {
      expect(decision.reason).toContain('refs/heads/feat/x');
    }
  });

  it('refuses a name that another existing ref matches when case is ignored, and names that ref', () => {
    const decision = decideRetirement({ ...merged, caseCollisions: ['refs/heads/Feat/X'] });

    expect(decision.kind).toBe('refused');
    if (decision.kind === 'refused') {
      expect(decision.reason).toContain('refs/heads/Feat/X');
    }
  });

  it('refuses a branch some worktree is using, and names the worktree', () => {
    const decision = decideRetirement({ ...merged, inUseBy: ['jcnet-wt-x'] });

    expect(decision.kind).toBe('refused');
    if (decision.kind === 'refused') {
      expect(decision.reason).toContain('jcnet-wt-x');
    }
  });
});

/** The plan for a branch present only on the remote. */
function remoteOnly(): PlannedDelete {
  const planned = decideRetirement(
    readingsFor({ local: 'absent', tracking: 'absent', remote: 'merged' }),
  );
  if (planned.kind !== 'plan' || planned.plan.remote === undefined) {
    throw new Error('the decision planned no remote delete');
  }
  return planned.plan.remote;
}

describe('classifyRemoteReread', () => {
  it('reads the proven sha as same, a missing ref as absent, and any other sha as moved', () => {
    const remote = remoteOnly();

    expect(classifyRemoteReread(remote, { kind: 'present', sha: remote.expectedSha })).toBe('same');
    expect(classifyRemoteReread(remote, { kind: 'absent' })).toBe('absent');
    expect(classifyRemoteReread(remote, { kind: 'present', sha: 'd'.repeat(40) })).toBe('moved');
  });
});

describe('classifyRemoteReadback', () => {
  const target = remoteOnly();
  const moved = { kind: 'present', sha: 'd'.repeat(40) } as const;
  const unchanged = { kind: 'present', sha: target.expectedSha } as const;

  it('reads an absent ref as deleted only when GitHub accepted the delete', () => {
    expect(classifyRemoteReadback(target, true, { kind: 'absent' })).toBe('deleted');
    expect(classifyRemoteReadback(target, false, { kind: 'absent' })).toBe('absent');
  });

  it('reads a ref still at the proven sha as unchanged, whatever GitHub answered', () => {
    expect(classifyRemoteReadback(target, true, unchanged)).toBe('unchanged');
    expect(classifyRemoteReadback(target, false, unchanged)).toBe('unchanged');
  });

  it('reads a ref at any other sha as moved, whatever GitHub answered', () => {
    expect(classifyRemoteReadback(target, true, moved)).toBe('moved');
    expect(classifyRemoteReadback(target, false, moved)).toBe('moved');
  });
});

describe('baseMismatch', () => {
  it('finds none when the identity repository reads the proven default name and tip', () => {
    expect(baseMismatch(BASE, BASE)).toBeUndefined();
  });

  it('names the difference when the name, the tip, or the default itself differs', () => {
    for (const read of [
      { name: 'trunk', sha: BASE.sha },
      { name: 'main', sha: 'e'.repeat(40) },
      undefined,
    ]) {
      expect(baseMismatch(BASE, read)).toContain(`main@${BASE.sha}`);
    }
  });
});

describe('classifyCasOutcome', () => {
  const target = remoteOnly();
  const failed = { exitedClean: false, detail: 'cannot lock ref' };

  it('reads a clean exit as deleted, whatever the re-read', () => {
    expect(
      classifyCasOutcome(target, { exitedClean: true, rereadSha: undefined, detail: '' }),
    ).toEqual({ kind: 'deleted' });
  });

  it('reads a failed compare-and-swap by the ref it left: gone is absent, moved is kept at its sha', () => {
    expect(classifyCasOutcome(target, { ...failed, rereadSha: undefined })).toEqual({
      kind: 'absent',
    });
    expect(classifyCasOutcome(target, { ...failed, rereadSha: 'e'.repeat(40) })).toEqual({
      kind: 'kept',
      sha: 'e'.repeat(40),
    });
  });

  it("reads a failure that left the ref at its proven sha as unchanged, with git's words", () => {
    expect(classifyCasOutcome(target, { ...failed, rereadSha: target.expectedSha })).toEqual({
      kind: 'unchanged',
      detail: 'cannot lock ref',
    });
  });
});
