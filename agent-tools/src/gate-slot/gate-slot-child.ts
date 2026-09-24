import { spawnInheritedProcess } from '../repo-check/repo-check-runtime.js';

import type { ChildRequest, GateChildEnd } from './gate-slot-types.js';

/** What the runner launches, where, and how long it lets the child run. */
export interface GateChildRunnerOptions {
  /** `pnpm` in production, resolved to its trusted binary by the spawn helper. */
  readonly command: string;
  /** The working tree the gate runs in, the same tree its slot names. */
  readonly cwd: string;
  readonly maxMs: number;
  readonly graceMs: number;
}

/** Whether a finished gate's group is swept: a negative pid names a group only on POSIX. */
const SWEEPS_GROUPS = process.platform !== 'win32';

/** The termination signals the wrapper passes on to the gate while it runs. */
const FORWARDED: readonly NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];

/**
 * Run a gate child with inherited stdio, bounded, in its own process group.
 *
 * Every signal goes to the whole group, because the gate's real work sits
 * below the process spawned here (the pnpm launcher is a shell script that
 * does not exec, and pnpm runs its scripts under `sh -c`). SIGINT, SIGTERM
 * and SIGHUP sent to the wrapper are passed on to the group, and so is one
 * that lands before the spawn has handed back its kill; the wrapper stays
 * until the child has ended, so it can free the slot. A passed-on signal, or
 * the bound at `maxMs`, starts a grace period of `graceMs`, after which the
 * group gets SIGKILL. However the child ends, its group then gets SIGKILL
 * before the slot is freed: anything still in the gate's own group is a
 * straggler (a process meant to outlive the gate leaves the group through
 * setsid), and none may keep loading the host outside the bound. A wrapper
 * that is itself SIGKILLed cannot pass anything on; its child's group runs on.
 */
export function createGateChildRunner(
  options: GateChildRunnerOptions,
): (request: ChildRequest) => Promise<GateChildEnd> {
  return async ({ args, extraEnv }) => {
    let killGroup: ((signal: NodeJS.Signals) => void) | undefined;
    let pending: NodeJS.Signals | undefined;
    let stoppedAtBound = false;
    let graceTimer: NodeJS.Timeout | undefined;
    const startGrace = (): void => {
      graceTimer ??= setTimeout(() => killGroup?.('SIGKILL'), options.graceMs);
    };
    const forward = (signal: NodeJS.Signals): void => {
      if (killGroup === undefined) {
        pending = signal;
      } else {
        killGroup(signal);
      }
      startGrace();
    };
    const stopForwarding = forwardSignals(forward);
    const boundTimer = setTimeout(() => {
      stoppedAtBound = true;
      forward('SIGTERM');
    }, options.maxMs);
    try {
      const end = await spawnInheritedProcess(options.command, args, {
        cwd: options.cwd,
        extraEnv,
        processGroup: true,
        onSpawn: (kill) => {
          killGroup = kill;
          if (pending !== undefined) {
            kill(pending);
          }
        },
      });
      if (SWEEPS_GROUPS) {
        killGroup?.('SIGKILL');
      }
      return { end, stoppedAtBoundMs: stoppedAtBound ? options.maxMs : undefined };
    } finally {
      clearTimeout(boundTimer);
      clearTimeout(graceTimer);
      stopForwarding();
    }
  };
}

/** Pass the forwarded signals to `forward` until the returned function is called. */
function forwardSignals(forward: (signal: NodeJS.Signals) => void): () => void {
  for (const signal of FORWARDED) {
    process.on(signal, forward);
  }
  return () => {
    for (const signal of FORWARDED) {
      process.off(signal, forward);
    }
  };
}
