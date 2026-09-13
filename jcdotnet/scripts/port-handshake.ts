/**
 * The runner-to-worker port handshake for the Playwright harness.
 *
 * Playwright evaluates its config file in the runner and again in every
 * worker process it forks. The runner probes a port once and stamps it into
 * its own environment as `<port>:<runner pid>`; the workers inherit that
 * environment. A stamp is accepted only from the one pid a process trusts:
 * the runner trusts itself (so a re-evaluation inside the runner keeps its
 * port), and a worker trusts its parent, the runner. Any other stamp,
 * including one set by a shell or task runner that happens to be the
 * runner's parent, is ignored and the process probes as if it were absent.
 */

export interface HandshakeProcess {
  readonly pid: number;
  readonly ppid: number;
  /** True inside a Playwright worker (Playwright sets `TEST_WORKER_INDEX` before evaluating the config there). */
  readonly isWorker: boolean;
}

const STAMP = /^(\d{1,5}):(\d{1,10})$/u;
const LOWEST_PORT = 1;
const HIGHEST_PORT = 65535;

/** The stamp a process writes for its children. */
export function stampFor(port: number, pid: number): string {
  return `${port}:${pid}`;
}

/**
 * The port a stamp assigns to this process, or undefined when the stamp is
 * absent, malformed, out of the port range, or stamped by a pid this process
 * does not trust.
 */
export function acceptStamp(
  stamp: string | undefined,
  process: HandshakeProcess
): number | undefined {
  if (stamp === undefined) {
    return undefined;
  }
  const match = STAMP.exec(stamp);
  if (match === null) {
    return undefined;
  }
  const port = Number(match[1]);
  const stampedPid = Number(match[2]);
  if (port < LOWEST_PORT || port > HIGHEST_PORT) {
    return undefined;
  }
  const trustedPid = process.isWorker ? process.ppid : process.pid;
  return stampedPid === trustedPid ? port : undefined;
}
