import { readFile } from 'node:fs/promises';

import { renderSharedCommsLog } from '../collaboration-state/comms.js';
import {
  classifySurfacePresence,
  instanceTierAbsentFinding,
  liveInstanceTierProbes,
  missingSurfaceFinding,
  type InstanceTierProbes,
} from './instance-tier.js';
import { readCommsEventFiles } from './live-comms-events.js';
import { SHARED_COMMS_LOG, absolutePath } from './live-types.js';
import { evaluateGeneratedReadModelDrift } from './structural-evaluators.js';
import { type SubstrateFinding } from './types.js';

/**
 * The generated shared-comms-log render, evaluated against its source events.
 *
 * The render is instance tier (`instance-tier.ts`): absent by design on a
 * checkout with no comms events. Absent while events are present, it is drift
 * — the read model has not been regenerated — and is reported exactly as a
 * stale render would be, so a deleted render can never read as clean. Absent
 * where the repository would track it, it is a blocking missing surface.
 *
 * @packageDocumentation
 */

/**
 * Evaluate the shared-comms-log render for drift against the live events.
 *
 * @param repoRoot - Repository root.
 * @param probes - Presence probes; injectable for tests over a temp tree.
 * @returns The findings: the event readers' own, one informational absence,
 * or a drift finding.
 */
export async function evaluateSharedCommsLog(
  repoRoot: string,
  probes: InstanceTierProbes = liveInstanceTierProbes,
): Promise<readonly SubstrateFinding[]> {
  const events = await readCommsEventFiles(repoRoot);
  if (events.findings.length > 0) {
    return events.findings;
  }
  const allEvents = [...events.narrative, ...events.lifecycle, ...events.directed];

  const presence = classifySurfacePresence(repoRoot, SHARED_COMMS_LOG, probes);
  if (presence === 'absent') {
    return [missingSurfaceFinding('collaboration-shared-comms-log', SHARED_COMMS_LOG)];
  }
  if (presence === 'absent-by-design' && allEvents.length === 0) {
    return [instanceTierAbsentFinding('collaboration-shared-comms-log', SHARED_COMMS_LOG)];
  }

  const committedText =
    presence === 'absent-by-design'
      ? ''
      : await readFile(absolutePath(repoRoot, SHARED_COMMS_LOG), 'utf8');
  return evaluateGeneratedReadModelDrift({
    surface: 'collaboration-shared-comms-log',
    outputPath: SHARED_COMMS_LOG,
    committedText,
    regeneratedText: renderSharedCommsLog({ events: allEvents }),
  });
}
