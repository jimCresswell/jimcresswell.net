/**
 * Playwright global setup: start the harness's server process and hand its origin to the
 * workers.
 *
 * Runs in the runner before any worker is forked. It starts `e2e-web-server.ts` (one child
 * process that binds a port, builds with it and serves the build from it) in the site
 * directory, reads the port from the child's first matching stdout line, writes the origin into
 * the runner's environment, which every worker inherits and reads as `baseURL` when it
 * evaluates the config, and waits for the child's `ready` line; one 120-second deadline covers
 * both lines. The returned teardown stops the child, which closes its socket. A child that
 * exits before `ready`, one that cannot be started at all (the spawn's `error` event: a missing
 * binary, say), or one that misses the deadline, is stopped and fails the run before any test
 * starts; a child that ends during the run is reported on stderr with its code. `startServer`
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

function terminalOf(child: ChildProcess): Promise<Terminal> {
  return new Promise((resolve) => {
    child.once("exit", (code, signal) => {
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

/** Stop the child and wait for its terminal event; a child that never started has already had it. */
function stopped(child: ChildProcess, terminal: Promise<Terminal>): Promise<void> {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGTERM");
  }
  return terminal.then(() => undefined);
}

export interface StartedServer {
  readonly origin: string;
  readonly stop: () => Promise<void>;
}

/**
 * Start the server command, wait for its `port` and `ready` lines under the deadline, and
 * return its origin with a stop function. Rejects, with the child stopped, when the child ends
 * or cannot start before `ready` or when the deadline passes.
 */
export async function startServer(
  command: string,
  args: readonly string[],
  readyTimeoutMs = READY_TIMEOUT_MS
): Promise<StartedServer> {
  const child = spawn(command, args, { cwd: SITE_DIRECTORY, stdio: ["ignore", "pipe", "inherit"] });
  const terminal = terminalOf(child);
  void terminal.then((event) => {
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
    const lines = lineStream(readline.createInterface({ input: child.stdout }), terminal);
    const [, port] = await lines.next(/^port (\d{1,5})$/u, deadline);
    await lines.next(/^ready$/u, deadline);
    lines.done();
    return { origin: `http://localhost:${port}`, stop: () => stopped(child, terminal) };
  } catch (error: unknown) {
    await stopped(child, terminal);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  const server = await startServer(path.join(SITE_DIRECTORY, "node_modules", ".bin", "tsx"), [
    path.join(SITE_DIRECTORY, "scripts", "e2e-web-server.ts"),
  ]);
  process.env[BASE_URL_VARIABLE] = server.origin;
  return server.stop;
}
