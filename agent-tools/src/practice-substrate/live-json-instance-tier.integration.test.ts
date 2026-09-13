import { describe, expect, it } from 'vitest';

import { createCommsEvent, renderSharedCommsLog } from '../collaboration-state/index.js';
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
 * disk and can never be a gate. A surface the repository would track is a
 * different matter: absent, it is a blocking missing surface, named. The
 * ignore verdict is injected because the temp tree is not a git repository;
 * the disk is real.
 */

function narrativeEvent(eventId: string, createdAt: string): string {
  return JSON.stringify(
    createCommsEvent(
      {
        schema_version: '2.0.0',
        event_id: eventId,
        created_at: createdAt,
        kind: 'narrative',
        author: {
          agent_name: 'Saffron turns Verdure',
          platform: 'claude',
          model: 'claude-fable-5-1',
          session_id_prefix: 'c39ad7',
        },
        title: `event ${eventId}`,
        body: `Body of ${eventId}.`,
      },
      { nowIso: createdAt },
    ),
    null,
    2,
  );
}

const oneEvent = { 'one.json': narrativeEvent('one', '2026-09-13T14:00:00Z') };

function verdicts(findings: readonly { readonly id: string; readonly severity: string }[]) {
  return findings.map((finding) => [finding.id, finding.severity]);
}

describe('evaluateCollaborationJsonSurfaces on a fresh checkout', () => {
  it('reports each absent, ignored claim registry as one informational finding', async () => {
    const root = await makeTempSubstrateRepo();
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

  it('reports an absent registry the repository would track as a blocking missing surface', async () => {
    const root = await makeTempSubstrateRepo();
    try {
      const findings = await evaluateCollaborationJsonSurfaces(root, trackedTierProbes);
      expect(verdicts(findings)).toStrictEqual([
        ['missing-surface', 'blocking'],
        ['missing-surface', 'blocking'],
      ]);
      expect(findings[0]?.evidence).toStrictEqual([
        '.agent/state/collaboration/active-claims.json',
      ]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('validates a registry that is present, with no absence finding', async () => {
    const root = await makeTempSubstrateRepo({
      activeClaims: { schema_version: '1.4.0', claims: [] },
    });
    try {
      expect(await evaluateCollaborationJsonSurfaces(root, ignoredTierProbes)).toStrictEqual([]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });
});

describe('evaluateSharedCommsLog', () => {
  it('reports the absent, ignored render as informational when there are no events to render', async () => {
    const root = await makeTempSubstrateRepo();
    try {
      expect(verdicts(await evaluateSharedCommsLog(root, ignoredTierProbes))).toStrictEqual([
        ['instance-tier-surface-absent', 'informational'],
      ]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('reports an absent render the repository would track as a blocking missing surface', async () => {
    const root = await makeTempSubstrateRepo();
    try {
      expect(verdicts(await evaluateSharedCommsLog(root, trackedTierProbes))).toStrictEqual([
        ['missing-surface', 'blocking'],
      ]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('reports the absent, ignored render as drift when events exist to render', async () => {
    // A deleted render is never clean: the read model has a source, and a
    // source with no rendered output is exactly the drift a stale render is.
    const root = await makeTempSubstrateRepo({ commsEventFiles: oneEvent });
    try {
      expect(verdicts(await evaluateSharedCommsLog(root, ignoredTierProbes))).toStrictEqual([
        ['generated-read-model-drift', 'blocking'],
      ]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('passes a render that matches its events', async () => {
    const eventText = oneEvent['one.json'];
    const rendered = renderSharedCommsLog({
      events: [createCommsEvent(JSON.parse(eventText), { nowIso: '2026-09-13T14:00:00Z' })],
    });
    const root = await makeTempSubstrateRepo({
      commsEventFiles: oneEvent,
      sharedCommsLog: rendered,
    });
    try {
      expect(await evaluateSharedCommsLog(root, ignoredTierProbes)).toStrictEqual([]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });

  it('reports a render that no longer matches its events as blocking drift', async () => {
    // The render was made for one event; a second event has since landed.
    const rendered = renderSharedCommsLog({
      events: [
        createCommsEvent(JSON.parse(oneEvent['one.json']), { nowIso: '2026-09-13T14:00:00Z' }),
      ],
    });
    const root = await makeTempSubstrateRepo({
      commsEventFiles: { ...oneEvent, 'two.json': narrativeEvent('two', '2026-09-13T14:05:00Z') },
      sharedCommsLog: rendered,
    });
    try {
      expect(verdicts(await evaluateSharedCommsLog(root, ignoredTierProbes))).toStrictEqual([
        ['generated-read-model-drift', 'blocking'],
      ]);
    } finally {
      await removeTempSubstrateRepo(root);
    }
  });
});
