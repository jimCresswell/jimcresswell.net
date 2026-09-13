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

function probes(input: { readonly exists: boolean; readonly ignored: boolean }): {
  readonly probes: InstanceTierProbes;
  readonly asked: string[];
} {
  const asked: string[] = [];
  return {
    asked,
    probes: {
      exists: (path) => {
        asked.push(`exists:${path}`);
        return input.exists;
      },
      isIgnored: (repoRoot, repoRelativePath) => {
        asked.push(`ignored:${repoRoot}:${repoRelativePath}`);
        return input.ignored;
      },
    },
  };
}

describe('classifySurfacePresence', () => {
  it('reads a file on disk as present without consulting the ignore rules', () => {
    const { probes: seams, asked } = probes({ exists: true, ignored: true });
    expect(classifySurfacePresence('/repo', 'a/b.json', seams)).toBe('present');
    expect(asked).toStrictEqual(['exists:/repo/a/b.json']);
  });

  it('reads an absent file the repository ignores as absent by design', () => {
    const { probes: seams, asked } = probes({ exists: false, ignored: true });
    expect(classifySurfacePresence('/repo', 'a/b.json', seams)).toBe('absent-by-design');
    expect(asked).toStrictEqual(['exists:/repo/a/b.json', 'ignored:/repo:a/b.json']);
  });

  it('reads an absent file the repository would track as absent', () => {
    const { probes: seams } = probes({ exists: false, ignored: false });
    expect(classifySurfacePresence('/repo', 'a/b.json', seams)).toBe('absent');
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
