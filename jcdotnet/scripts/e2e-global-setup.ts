/**
 * Playwright global setup: start the harness's server process and hand its origin to the
 * workers.
 *
 * Runs in the runner before any worker is forked. It starts `e2e-web-server.ts` (one child
 * process that binds a port, builds with it and serves the build from it) in the site
 * directory, reads the port from the child's first matching stdout line, writes the origin into
 * the runner's environment, which every worker inherits and reads as `baseURL` when it
 * evaluates the config, and waits for the child's `ready` line; one 120-second deadline covers
 * both lines. The returned teardown stops the child, which closes its socket, and rejects when
 * the child had already ended or ends other than with code 0 on the signal (a close that failed
 * inside the server exits 1), so the run is red rather than green with a line on stderr. A
 * child that exits before `ready`, one that cannot be started at all (the spawn's `error`
 * event: a missing binary, say), or one that misses the deadline, is stopped and fails the run
 * before any test starts; a child that ends during the run is reported on stderr with its code
 * as it happens and fails the teardown. `startServer`
 * is the seam the cells drive with a command of their own; the default export wires the real
 * one.
 */
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

export const BASE_URL_VARIABLE = "PLAYWRIGHT_SITE_BASE_URL";

const READY_TIMEOUT_MS = 120_000;

const SITE_DIRECTORY = fileURLToPath(new URL("..", import.meta.url));

/** The child's one terminal event: it exited (by code or signal), or it never started. */
type Terminal =
  | { readonly kind: "exit"; readonly code: number | null; readonly signal: NodeJS.Signals | null }
  | { readonly kind: "error"; readonly message: string };

/**
 * The terminal event taken from `event`: `exit` for the process itself, `close` for the end of
 * its output. `close` fires once the child has exited and its stdout has ended, so every line it
 * wrote has been delivered first; `exit` can fire with lines still unread. But `close` is not
 * bounded by the child: a descendant that inherited its stdout can hold it open after the child
 * has gone. So readiness races `close` (under the deadline), and stopping waits on `exit`.
 */
function terminalOf(child: ChildProcess, event: "exit" | "close"): Promise<Terminal> {
  return new Promise((resolve) => {
    child.once(event, (code: number | null, signal: NodeJS.Signals | null) => {
      resolve({ kind: "exit", code, signal });
    });
    child.once("error", (error) => {
      resolve({ kind: "error", message: error.message });
    });
  });
}

function describeTerminal(terminal: Terminal): string {
  return terminal.kind === "exit"
    ? `e2e server exited (code ${String(terminal.code)}, signal ${String(terminal.signal)})`
    : `e2e server could not be started: ${terminal.message}`;
}

/**
 * The child's stdout lines, buffered from the start: `port` and `ready` can arrive in one chunk,
 * and a listener attached after the first match would miss the second line and wait forever.
 * `done` stops the buffering once the protocol is complete, so the server's request-time
 * output is not retained for the run (the interface stays open: pausing it would fill the pipe
 * and block the child).
 */
interface LineStream {
  /** Resolve with the first unconsumed line matching `pattern`; reject on the terminal event or the deadline. */
  readonly next: (pattern: RegExp, deadline: Promise<never>) => Promise<RegExpExecArray>;
  /** Stop buffering and release the lines held so far. */
  readonly done: () => void;
}

function lineStream(lines: readline.Interface, terminal: Promise<Terminal>): LineStream {
  let buffer: string[] = [];
  let cursor = 0;
  let wake: () => void = () => {};
  const onLine = (text: string): void => {
    buffer.push(text);
    wake();
  };
  lines.on("line", onLine);
  const arrived = (): Promise<void> =>
    new Promise((resolve) => {
      wake = resolve;
    });
  // Only ever awaited inside `next`'s race, which is what handles its rejection; the first
  // `next` runs before any line can arrive, so a terminal event never rejects unobserved.
  const ended = terminal.then((event) => {
    throw new Error(`${describeTerminal(event)} before it was ready`);
  });
  const next = async (pattern: RegExp, deadline: Promise<never>): Promise<RegExpExecArray> => {
    for (;;) {
      while (cursor < buffer.length) {
        const match = pattern.exec(buffer[cursor] ?? "");
        cursor += 1;
        if (match !== null) {
          return match;
        }
      }
      await Promise.race([arrived(), ended, deadline]);
    }
  };
  const done = (): void => {
    lines.off("line", onLine);
    buffer = [];
    cursor = 0;
  };
  return { next, done };
}

/**
 * Stop the child, wait for its exit, then destroy the stdout reader; a child that never started
 * has already had its terminal event. The wait is on `exit`, never `close`: a descendant holding
 * the inherited stdout open would keep `close` from ever firing. Destroying the reader after the
 * exit releases this side of the pipe, so such a descendant meets EPIPE on its next write and the
 * runner keeps no handle open for it; destroying it before the exit could hand the same EPIPE to
 * a server still closing down.
 */
async function stopped(child: ChildProcess, exited: Promise<Terminal>): Promise<Terminal> {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGTERM");
  }
  const event = await exited;
  child.stdout?.destroy();
  return event;
}

/**
 * The stop a caller sees: it rejects when the child had already ended before the stop (the
 * server did not survive the run, whatever its code) or ends other than with code 0 on the
 * signal it was sent (a close that failed inside the server exits 1), so either fails
 * Playwright's teardown instead of being written to stderr and forgotten. The startup path
 * never uses this: there the child is stopped behind the original error, which is the one to
 * preserve.
 */
async function stopObserved(child: ChildProcess, exited: Promise<Terminal>): Promise<void> {
  const running = child.exitCode === null && child.signalCode === null;
  const event = await stopped(child, exited);
  if (!running) {
    throw new Error(`${describeTerminal(event)} before stop`);
  }
  if (event.kind !== "exit" || event.code !== 0) {
    throw new Error(`${describeTerminal(event)} on stop`);
  }
}

export interface StartedServer {
  readonly origin: string;
  /** Resolves when the child has ended, however it ended; a stop after that rejects. */
  readonly ended: Promise<void>;
  readonly stop: () => Promise<void>;
}

/**
 * Start the server command, wait for its `port` and `ready` lines under the deadline, and
 * return its origin with a stop function. Rejects, with the child stopped, when the child ends
 * or cannot start before `ready`, when it has exited by the time `ready` is read, or when the
 * deadline passes.
 */
export async function startServer(
  command: string,
  args: readonly string[],
  readyTimeoutMs = READY_TIMEOUT_MS
): Promise<StartedServer> {
  const child = spawn(command, args, { cwd: SITE_DIRECTORY, stdio: ["ignore", "pipe", "inherit"] });
  const exited = terminalOf(child, "exit");
  const outputEnded = terminalOf(child, "close");
  void exited.then((event) => {
    process.stderr.write(`${describeTerminal(event)}\n`);
  });
  let timer: NodeJS.Timeout | undefined;
  const deadline = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`e2e server was not ready within ${String(readyTimeoutMs)} ms`));
    }, readyTimeoutMs);
  });
  try {
    if (child.stdout === null) {
      throw new Error("e2e server: no stdout pipe");
    }
    const lines = lineStream(readline.createInterface({ input: child.stdout }), outputEnded);
    const [, port] = await lines.next(/^port (\d{1,5})$/u, deadline);
    await lines.next(/^ready$/u, deadline);
    lines.done();
    // Waiting on the end of the output reads every line the child wrote, even when its exit
    // came first, so `ready` can be read from a child that is already gone. The child is the
    // process that holds the port and serves on it (ADR-019), so an exited child leaves nothing
    // behind the origin: refuse it here, before any test starts.
    if (child.exitCode !== null || child.signalCode !== null) {
      const event: Terminal = { kind: "exit", code: child.exitCode, signal: child.signalCode };
      throw new Error(`${describeTerminal(event)} by the time its ready line was read`);
    }
    return {
      origin: `http://localhost:${port}`,
      ended: exited.then(() => undefined),
      stop: () => stopObserved(child, exited),
    };
  } catch (error: unknown) {
    await stopped(child, exited);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The server command: this node executable with tsx registered in-process, so the server script
 * IS the child. The tsx CLI would sit between as a relay that forwards the stop signal and
 * waits 30 ms for the script's acknowledgement before killing it and exiting 143, so a stall in
 * the server at that instant would read as a failed stop through no fault of the server.
 */
export function serverCommand(): { readonly command: string; readonly args: readonly string[] } {
  return {
    command: process.execPath,
    args: ["--import", "tsx", path.join(SITE_DIRECTORY, "scripts", "e2e-web-server.ts")],
  };
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  const { command, args } = serverCommand();
  const server = await startServer(command, args);
  process.env[BASE_URL_VARIABLE] = server.origin;
  return server.stop;
}
