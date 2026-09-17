/**
 * The Claude Code `PreCompact` observer's answers to the harness.
 *
 * @remarks
 * The harness validates a `PreCompact` hook's JSON stdout against top-level
 * fields only (`continue`, `suppressOutput`, `stopReason`, `decision`,
 * `reason`, `systemMessage`, `terminalSequence`); it has no `PreCompact`
 * variant of `hookSpecificOutput` and fails validation on one (observed
 * 2026-09-16). Both answers carry `continue: true`, because this hook never
 * blocks a compaction.
 *
 * Loaded from TypeScript source by the hook entry
 * (`src/bin/claude-pre-compact-observe-hook.ts`), so a relative import added
 * here must name its `.ts` file.
 *
 * @packageDocumentation
 */

const RESPONSE_PREFIX = '[pre-compact-observe]';

/**
 * Build the response for an observation that was recorded.
 *
 * @param marker - The per-invocation marker, also written into the observation
 *   record, so a transcript read can pair the two.
 * @returns A JSON line carrying the marker as a `systemMessage`.
 */
export function buildProbeResponse(marker: string): string {
  return `${JSON.stringify({ continue: true, systemMessage: `${RESPONSE_PREFIX} ${marker}` })}\n`;
}

/**
 * Build the response for an observation that failed after the hook loaded.
 *
 * @param reason - What went wrong; for an evidence instrument the failure is
 *   itself evidence, so it is reported rather than swallowed.
 * @returns A JSON line carrying the reason as a `systemMessage`.
 */
export function buildFailOpenResponse(reason: string): string {
  return `${JSON.stringify({
    continue: true,
    systemMessage: `${RESPONSE_PREFIX} observation failed: ${reason}`,
  })}\n`;
}
