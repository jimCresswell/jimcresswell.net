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
 * exits before `ready`, or one that misses the deadline, is stopped and fails the run before
 * any test starts; a child that exits during the run is reported on stderr with its code.
 */
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

export const BASE_URL_VARIABLE = "PLAYWRIGHT_SITE_BASE_URL";

const READY_TIMEOUT_MS = 120_000;

const SITE_DIRECTORY = fileURLToPath(new URL("..", import.meta.url));

/** Resolve with the first stdout line matching `pattern`; reject on exit or at the deadline. */
function awaitLine(
  child: ChildProcess,
  lines: readline.Interface,
  pattern: RegExp,
  deadline: Promise<never>
): Promise<RegExpExecArray> {
  const line = new Promise<RegExpExecArray>((resolve, reject) => {
    const onLine = (text: string): void => {
      const match = pattern.exec(text);
      if (match !== null) {
        lines.off("line", onLine);
        child.off("exit", onExit);
        resolve(match);
      }
    };
    const onExit = (code: number | null): void => {
      lines.off("line", onLine);
      reject(new Error(`e2e server exited ${String(code)} before it was ready`));
    };
    lines.on("line", onLine);
    child.once("exit", onExit);
  });
  return Promise.race([line, deadline]);
}

function stopped(child: ChildProcess): Promise<void> {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }
    child.once("exit", () => {
      resolve();
    });
    child.kill("SIGTERM");
  });
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  const child = spawn(
    path.join(SITE_DIRECTORY, "node_modules", ".bin", "tsx"),
    [path.join(SITE_DIRECTORY, "scripts", "e2e-web-server.ts")],
    { cwd: SITE_DIRECTORY, stdio: ["ignore", "pipe", "inherit"] }
  );
  child.once("exit", (code, signal) => {
    process.stderr.write(`e2e server exited (code ${String(code)}, signal ${String(signal)})\n`);
  });
  let timer: NodeJS.Timeout | undefined;
  const deadline = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`e2e server was not ready within ${String(READY_TIMEOUT_MS)} ms`));
    }, READY_TIMEOUT_MS);
  });
  try {
    if (child.stdout === null) {
      throw new Error("e2e server: no stdout pipe");
    }
    const lines = readline.createInterface({ input: child.stdout });
    const [, port] = await awaitLine(child, lines, /^port (\d{1,5})$/u, deadline);
    process.env[BASE_URL_VARIABLE] = `http://localhost:${port}`;
    await awaitLine(child, lines, /^ready$/u, deadline);
  } catch (error: unknown) {
    await stopped(child);
    throw error;
  } finally {
    clearTimeout(timer);
  }
  return () => stopped(child);
}
