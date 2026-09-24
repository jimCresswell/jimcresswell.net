/** How a process is signalled: `process.kill` in production. */
type Kill = (pid: number, signal: NodeJS.Signals) => true;

/**
 * Signal every process in the group `leader` leads. A group that has ended is
 * not an error: Linux reports it as ESRCH, and macOS as EPERM while the group
 * still holds members that have exited and not yet been reaped. Any other
 * failure is thrown. A launch that never got a pid has no group.
 */
export function signalProcessGroup(
  leader: number | undefined,
  signal: NodeJS.Signals,
  kill: Kill = process.kill.bind(process),
): void {
  if (leader === undefined) {
    return;
  }
  try {
    kill(-leader, signal);
  } catch (error: unknown) {
    if (!isEndedGroupError(error)) {
      throw error;
    }
  }
}

function isEndedGroupError(error: unknown): boolean {
  return (
    error instanceof Error && 'code' in error && (error.code === 'ESRCH' || error.code === 'EPERM')
  );
}
