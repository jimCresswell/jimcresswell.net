import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { exitBeforeWriting } from "../test-helpers/exit-before-writing";
import { serverCommand, startServer } from "./e2e-global-setup";

/**
 * A grandchild that holds the stdout it inherits open: it writes a line that is neither `port`
 * nor `ready` every 50 ms, for at most 10 seconds, and exits as soon as a write fails, which
 * happens once the reading end has been destroyed.
 */
const HOLD_STDOUT = `
process.stdout.on("error", () => process.exit(0));
let remaining = 200;
const tick = () => {
  if (remaining === 0) return;
  remaining -= 1;
  process.stdout.write("holding stdout\\n");
  setTimeout(tick, 50);
};
tick();
`;

/**
 * A `node -e` script that writes nothing, starts a HOLD_STDOUT grandchild on its own stdout,
 * records the grandchild's pid in the file named by its first argument, and exits 0.
 */
const EXIT_LEAVING_STDOUT_HELD = `
const { spawn } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const grandchild = spawn(process.execPath, ["-e", ${JSON.stringify(HOLD_STDOUT)}], {
  stdio: ["ignore", "inherit", "ignore"],
});
writeFileSync(process.argv[1], String(grandchild.pid));
grandchild.unref();
`;

/**
 * A `node -e` script for a server that records its pid in the file named by its first argument,
 * prints its port and ready lines, and stays up until it receives SIGUSR2; then it runs
 * `onSignal` and exits 0 on its own. The pid file is written before the lines, so it exists once
 * the setup has read `ready`, and the exit comes only when the cell sends the signal.
 */
function readyUntilSignal(onSignal: string): string {
  return `
const { spawn } = require("node:child_process");
const { writeFileSync } = require("node:fs");
writeFileSync(process.argv[1], String(process.pid));
process.on("SIGUSR2", () => {
  ${onSignal}
  process.exit(0);
});
process.stdout.write("port 4242\\nready\\n");
setInterval(() => {}, 1000);
`;
}

/** For `readyUntilSignal`: start a HOLD_STDOUT grandchild, its pid to the second argument's file. */
const START_STDOUT_HOLDER = `
  const grandchild = spawn(process.execPath, ["-e", ${JSON.stringify(HOLD_STDOUT)}], {
    stdio: ["ignore", "inherit", "ignore"],
  });
  writeFileSync(process.argv[2], String(grandchild.pid));
  grandchild.unref();
`;

async function readPid(file: string): Promise<number> {
  return Number(await readFile(file, "utf8"));
}

function isRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Spawn-topology cells (testing-strategy §No process spawning names this shape as the
 * sanctioned exception): the behaviour under proof IS the child's `error` and `exit` fidelity,
 * the order of its lines against its end, and the release of a stdout a descendant still
 * holds, so real children run, as `node -e` scripts and one unstartable path, with no shell.
 * The deadlines (5 seconds, and 2 seconds where the deadline itself is reached) are harness
 * bounds, not wall-clock claims.
 */
describe("serverCommand", () => {
  it("runs the server script as this node executable's own child, no CLI relay between", () => {
    const { command, args } = serverCommand();
    expect(command).toBe(process.execPath);
    expect(args.slice(0, 2)).toEqual(["--import", "tsx"]);
    expect(args.at(-1)).toMatch(/e2e-web-server\.ts$/u);
  });
});

describe("startServer", () => {
  it("a command that cannot start rejects with the spawn error and its stop resolves, never hanging on an exit that cannot come", async () => {
    const started = startServer("/nonexistent/e2e-server-binary", [], 5_000);
    await expect(started).rejects.toThrow(/could not be started/u);
  });

  it("a command that exits before ready rejects with its exit code", async () => {
    const started = startServer(process.execPath, ["-e", "process.exit(3)"], 5_000);
    await expect(started).rejects.toThrow(/exited \(code 3, signal null\) before it was ready/u);
  });

  it("a command that has exited by the time its ready line is read rejects, naming the exit, after reading its lines", async () => {
    // The child exits 0 at once; a grandchild writes both lines only after the child is reaped.
    // The lines are read, since the wait ends on the end of the output and not on the exit: a
    // wait that ended on the exit would reject with "before it was ready" instead. The child is
    // refused all the same, because the process that held the port is gone.
    const script = exitBeforeWriting("port 4242\nready\n");
    const started = startServer(process.execPath, ["-e", script], 5_000);
    await expect(started).rejects.toThrow(
      /^e2e server exited \(code 0, signal null\) by the time its ready line was read$/u
    );
  });

  it("a command that prints port and ready resolves with the origin, and stop ends it", async () => {
    // The child ends with code 0 on the signal, as the real server does after its close.
    const script =
      "process.on('SIGTERM', () => process.exit(0)); process.stdout.write('port 4242\\nready\\n'); setInterval(() => {}, 1000);";
    const server = await startServer(process.execPath, ["-e", script], 5_000);
    try {
      expect(server.origin).toBe("http://localhost:4242");
    } finally {
      // The real child is stopped whatever the assertion says; a failing cell leaves no orphan.
      await server.stop();
    }
  });

  it("a child that exits non-zero after the stop signal makes stop reject, so the teardown is red", async () => {
    // The child ignores SIGTERM's default and exits 1 on it: a close that failed inside the server.
    const script =
      "process.on('SIGTERM', () => process.exit(1)); process.stdout.write('port 4242\\nready\\n'); setInterval(() => {}, 1000);";
    const server = await startServer(process.execPath, ["-e", script], 5_000);
    await expect(server.stop()).rejects.toThrow(/exited \(code 1, signal null\) on stop/u);
  });

  it("a child killed by the stop signal without a handler makes stop reject: no close ran", async () => {
    const script = "process.stdout.write('port 4242\\nready\\n'); setInterval(() => {}, 1000);";
    const server = await startServer(process.execPath, ["-e", script], 5_000);
    await expect(server.stop()).rejects.toThrow(/exited \(code null, signal SIGTERM\) on stop/u);
  });

  it("a child that exits while a descendant holds its stdout open rejects at the deadline, and the descendant is released", async () => {
    const directory = await mkdtemp(join(tmpdir(), "e2e-setup-held-stdout-"));
    try {
      const pidFile = join(directory, "grandchild.pid");
      const started = startServer(
        process.execPath,
        ["-e", EXIT_LEAVING_STDOUT_HELD, pidFile],
        2_000
      );
      await expect(started).rejects.toThrow(/was not ready within 2000 ms/u);
      // The setup has released the stdout it was reading, so the grandchild's next write fails.
      const grandchild = await readPid(pidFile);
      await expect.poll(() => isRunning(grandchild)).toBe(false);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("a child that ended during the run while a descendant holds its stdout makes stop reject, and the descendant is released", async () => {
    const directory = await mkdtemp(join(tmpdir(), "e2e-setup-held-stdout-"));
    try {
      const serverPidFile = join(directory, "server.pid");
      const grandchildPidFile = join(directory, "grandchild.pid");
      const script = readyUntilSignal(START_STDOUT_HOLDER);
      const server = await startServer(
        process.execPath,
        ["-e", script, serverPidFile, grandchildPidFile],
        5_000
      );
      process.kill(await readPid(serverPidFile), "SIGUSR2");
      await server.ended;
      await expect(server.stop()).rejects.toThrow(/exited \(code 0, signal null\) before stop/u);
      const grandchild = await readPid(grandchildPidFile);
      await expect.poll(() => isRunning(grandchild)).toBe(false);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("a child that ended on its own during the run makes stop reject, even at code 0", async () => {
    const directory = await mkdtemp(join(tmpdir(), "e2e-setup-ended-"));
    try {
      const serverPidFile = join(directory, "server.pid");
      const server = await startServer(
        process.execPath,
        ["-e", readyUntilSignal(""), serverPidFile],
        5_000
      );
      process.kill(await readPid(serverPidFile), "SIGUSR2");
      await server.ended;
      await expect(server.stop()).rejects.toThrow(/exited \(code 0, signal null\) before stop/u);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
