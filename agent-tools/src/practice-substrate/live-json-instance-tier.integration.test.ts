import { describe, expect, it } from 'vitest';

import { evaluateCollaborationJsonSurfaces } from './live-json.js';
import { evaluateSharedCommsLog } from './live-shared-comms-log.js';
import {
  ignoredTierProbes,
  makeTempSubstrateRepo,
  removeTempSubstrateRepo,
  trackedTierProbes,
} from './test-helpers/temp-substrate-repo.js';

/**
 * The instance tier on a fresh checkout. A worktree or a CI checkout carries
 * none of the untracked-by-design collaboration state, and the substrate
 * audit must read that as "absent by design, validated when present" rather
 * than as a blocking reader failure — otherwise the audit proves the local
 * disk and can never be a gate. The ignore verdict is injected because the
 * temp tree is not a git repository; the disk is real.
 */

describe('evaluateCollaborationJsonSurfaces on a fresh checkout', () => {
  it('reports each absent, ignored claim registry as one informational finding', async () => {
    const root = await makeTempSubstrateRepo(undefined, { withoutClaimRegistries: true });
    try {
      const findings = await evaluateCollaborationJsonSurfaces(root, ignoredTierProbes);
      expect(
        findings.map((finding) => [finding.surface, finding.id, finding.severity]),
      ).toStrictEqual([
        ['collaboration-active-claims', 'instance-tier-surface-absent', 'informational'],
        ['collaboration-closed-claims', 'instance-tier-surface-absent', 'informational'],
      ]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('still fails loudly when an absent registry is one the repository would track', async () => {
    const root = await makeTempSubstrateRepo(undefined, { withoutClaimRegistries: true });
    try {
      await expect(evaluateCollaborationJsonSurfaces(root, trackedTierProbes)).rejects.toThrow(
        /ENOENT/u,
      );
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('validates a registry that is present, with no absence finding', async () => {
    const root = await makeTempSubstrateRepo({ schema_version: '1.4.0', claims: [] });
    try {
      expect(await evaluateCollaborationJsonSurfaces(root, ignoredTierProbes)).toStrictEqual([]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });
});

describe('evaluateSharedCommsLog on a fresh checkout', () => {
  it('reports the absent, ignored render as informational when there are no events to render', async () => {
    const root = await makeTempSubstrateRepo(undefined, { withoutClaimRegistries: true });
    try {
      const findings = await evaluateSharedCommsLog(root, ignoredTierProbes);
      expect(findings.map((finding) => [finding.id, finding.severity])).toStrictEqual([
        ['instance-tier-surface-absent', 'informational'],
      ]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('still fails loudly when the absent render is one the repository would track', async () => {
    const root = await makeTempSubstrateRepo(undefined, { withoutClaimRegistries: true });
    try {
      await expect(evaluateSharedCommsLog(root, trackedTierProbes)).rejects.toThrow(/ENOENT/u);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });
});
