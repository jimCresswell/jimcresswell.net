import { writeErrorLine, writeLine } from '../core/terminal-output.js';

import { defaultRuntime } from './repo-check-runtime.js';
import type { RepoCheckCommandResult, RepoCheckRuntime } from './repo-check-types.js';

/**
 * The knip gate: knip run captured, so a crash that knip swallows behind
 * exit 0 (F-147) or a child that died without a verdict (F-112) fails the
 * gate loudly instead of reading as a pass.
 *
 * @packageDocumentation
 */

// knip reports per-workspace plugin-config load failures via a bare
// console.error ("ERROR: Error loading <path> (<cause>)") without recording an
// issue or throwing, then exits 0 — so a crashed analysis reads as a passing
// gate (frictions register F-147). The gate must run knip CAPTURED and treat
// any such swallowed-crash signature on a zero exit as a loud failure: a crash
// suppresses the very analysis that could find issues, so exit 0 lies twice.
// \p{Cc} (a control character) followed by "[<codes>m" is an ANSI SGR sequence;
// the property class expresses the ESC byte without a control char in the source.
const ANSI_ESCAPE_PATTERN = /\p{Cc}\[[0-9;]*m/gu;
// Match the exact F-147 signature (knip's WorkspaceWorker logError line), not
// any `ERROR:`-prefixed output — an unrelated ERROR line from a successfully
// loaded config must stay a clean pass, never a false-red gate.
const KNIP_SWALLOWED_CRASH_PATTERN = /^ERROR: Error loading /mu;

/**
 * Crash-class discriminator (F-112): knip always prints its verdict, so a
 * non-zero run that never spoke — or a null status, meaning a signal kill —
 * is a crash class, not a finding. The diagnosis line goes to STDOUT by
 * default: under the F-112 failure this line exists for, the hook chain's
 * stderr is the poisoned stream and writes to it vanish (observed
 * first-hand 2026-08-07, push path); stdout was the channel that survived.
 */
function knipCrashDiagnosis(result: RepoCheckCommandResult): string | null {
  const spoke = result.stdout.length > 0 || result.stderr.length > 0;
  if (result.status !== null && spoke) {
    return null;
  }
  return (
    'repo-check knip-gate: the knip child died without a verdict — ' +
    `status=${String(result.status)} signal=${String(result.signal)} ` +
    `stdout=${result.stdout.length}B stderr=${result.stderr.length}B ` +
    '(crash class, not unused code — F-112 names the pipe-backed-stdio mechanism to check first)'
  );
}

/** Forward the captured streams so a knip verdict reaches the operator verbatim. */
function reemitCapturedStreams(result: RepoCheckCommandResult): void {
  if (result.stdout.length > 0) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr.length > 0) {
    process.stderr.write(result.stderr);
  }
}

/** Run knip captured and fail the gate on any swallowed crash or verdict-less death. */
export async function runKnipGate(
  runtime: RepoCheckRuntime = defaultRuntime,
  emitDiagnostic: (line: string) => void = writeLine,
): Promise<number> {
  const result = runtime.runCaptured('pnpm', ['exec', 'knip']);
  reemitCapturedStreams(result);

  const status = result.status ?? 1;
  if (status !== 0) {
    const diagnosis = knipCrashDiagnosis(result);
    if (diagnosis !== null) {
      emitDiagnostic(diagnosis);
    }
    return status;
  }

  const plainOutput = `${result.stdout}\n${result.stderr}`.replaceAll(ANSI_ESCAPE_PATTERN, '');
  if (KNIP_SWALLOWED_CRASH_PATTERN.test(plainOutput)) {
    writeErrorLine(
      'repo-check knip-gate: knip exited 0 but reported a crash-class error above (F-147); ' +
        'a crashed analysis cannot count as a pass — failing the gate.',
    );
    return 1;
  }

  return 0;
}
