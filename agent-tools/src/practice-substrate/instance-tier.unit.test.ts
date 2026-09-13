import { describe, expect, it } from 'vitest';

import {
  classifySurfacePresence,
  instanceTierAbsentFinding,
  type InstanceTierProbes,
} from './instance-tier.js';

/**
 * Presence of an instance-tier surface is a pure function of two probes: the
 * disk and the repository's ignore rules. These tests describe the three
 * verdicts and the finding an absent-by-design surface produces.
 */

function probes(input: {
  readonly exists: boolean;
  readonly ignored: boolean;
}): InstanceTierProbes {
  return {
    exists: () => input.exists,
    isIgnored: () => input.ignored,
  };
}

describe('classifySurfacePresence', () => {
  it('reads a file on disk as present, whatever the ignore rules say', () => {
    expect(
      classifySurfacePresence('/repo', 'a/b.json', probes({ exists: true, ignored: true })),
    ).toBe('present');
  });

  it('reads an absent file the repository ignores as absent by design', () => {
    expect(
      classifySurfacePresence('/repo', 'a/b.json', probes({ exists: false, ignored: true })),
    ).toBe('absent-by-design');
  });

  it('reads an absent file the repository would track as absent', () => {
    expect(
      classifySurfacePresence('/repo', 'a/b.json', probes({ exists: false, ignored: false })),
    ).toBe('absent');
  });
});

describe('instanceTierAbsentFinding', () => {
  it('is informational with a deterministic repair and the path as evidence', () => {
    const finding = instanceTierAbsentFinding('collaboration-active-claims', 'x/active.json');
    expect(finding.id).toBe('instance-tier-surface-absent');
    expect(finding.surface).toBe('collaboration-active-claims');
    expect(finding.severity).toBe('informational');
    expect(finding.repair).toBe('deterministic');
    expect(finding.evidence).toStrictEqual(['x/active.json']);
    expect(finding.message).toContain('x/active.json');
  });
});
