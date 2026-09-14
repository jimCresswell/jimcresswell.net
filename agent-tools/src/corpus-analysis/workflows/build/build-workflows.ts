/**
 * Composition root: verify every corpus-analysis workflow artefact on each build.
 *
 * @remarks
 * Passes this module's config + stage registry to the shared verification runner
 * (`src/workflow-build/run-verification-build.ts`). This file is the single process
 * boundary: failures become a non-zero exit.
 *
 * @packageDocumentation
 *
 * Restored from the lineage at pin `e477e62f7` on 2026-09-14 (practice-completion closure
 * item 4, row 3); the lineage's result and safe-path packages read here as `@engraph/result`
 * and `@engraph/safe-path`.
 */

import { runVerificationBuild } from '../../../workflow-build/run-verification-build.js';
import { BUILD_CONFIG, STAGE_DEFINITIONS } from './build-config.js';

const green = await runVerificationBuild({
  config: BUILD_CONFIG,
  stages: STAGE_DEFINITIONS,
  writeOut: (line) => process.stdout.write(line),
  writeErr: (line) => process.stderr.write(line),
});

if (!green) {
  process.exitCode = 1;
}
