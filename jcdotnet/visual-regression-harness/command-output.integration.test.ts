import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { pipeCommandOutput, readCommandOutput } from "./command-output";

/**
 * Spawn-topology contracts for running commands: the whole of stdout is returned
 * even when the stdout pipe outlives the process, and a pipe between two commands
 * settles with no child left running when one end fails. Real spawns of the running
 * Node binary with `-e`; no shell, no git.
 */

/**
 * Writes one line once the process named by its argument has been reaped.
 * `process.kill(pid, 0)` succeeds on an exited process its parent has not yet
 * reaped and fails once it has, so the line cannot be written before the parent
 * has reaped the child. Bounded: it gives up without writing after 2000 polls.
 */
const WRITE_AFTER_REAP = `
const target = Number(process.argv[1]);
const poll = (remaining) => {
  try {
    process.kill(target, 0);
  } catch {
    process.stdout.write("written after the process was reaped\\n");
    return;
  }
  if (remaining > 0) setTimeout(poll, 5, remaining - 1);
};
poll(2000);
`;

/** Exits at once, leaving its stdout held open by a grandchild running WRITE_AFTER_REAP. */
const EXIT_LEAVING_STDOUT_OPEN = `
const { spawn } = require("node:child_process");
spawn(process.execPath, ["-e", ${JSON.stringify(WRITE_AFTER_REAP)}, String(process.pid)], {
  stdio: ["ignore", "inherit", "inherit"],
}).unref();
`;

describe("readCommandOutput", () => {
  it("returns output that reaches stdout after the process has exited", async () => {
    await expect(
      readCommandOutput(process.execPath, ["-e", EXIT_LEAVING_STDOUT_OPEN], os.tmpdir())
    ).resolves.toBe("written after the process was reaped\n");
  });

  it("rejects with the exit code when the command fails", async () => {
    await expect(
      readCommandOutput(process.execPath, ["-e", "process.exit(3)"], os.tmpdir())
    ).rejects.toMatchObject({ cause: { code: 3 } });
  });
});

/**
 * Records its pid in the file named by its argument, then writes up to 64 MiB, honouring
 * backpressure; a write error (EPIPE once the reading end is gone) exits 1 quietly.
 */
const SOURCE_KEEPS_WRITING = `
require("node:fs").writeFileSync(process.argv[1], String(process.pid));
process.stdout.on("error", () => process.exit(1));
const chunk = Buffer.alloc(64 * 1024);
let remaining = 1024;
const write = () => {
  while (remaining > 0) {
    remaining -= 1;
    if (!process.stdout.write(chunk)) {
      process.stdout.once("drain", write);
      return;
    }
  }
};
write();
`;

/** Records its pid, writes one chunk, then stays alive without writing, for at most 10 seconds. */
const SOURCE_STOPS_WRITING = `
require("node:fs").writeFileSync(process.argv[1], String(process.pid));
process.stdout.write(Buffer.alloc(64 * 1024));
setTimeout(() => {}, 10_000);
`;

/** Reads the first chunk, records its pid, and exits with the code given as its second argument. */
const SINK_EXITS_AFTER_FIRST_CHUNK = `
process.stdin.once("data", () => {
  require("node:fs").writeFileSync(process.argv[1], String(process.pid));
  process.exit(Number(process.argv[2]));
});
`;

function isRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

describe("pipeCommandOutput", () => {
  it.each([
    { source: SOURCE_KEEPS_WRITING, sourceShape: "keeps writing", sinkExitCode: "2" },
    { source: SOURCE_KEEPS_WRITING, sourceShape: "keeps writing", sinkExitCode: "0" },
    { source: SOURCE_STOPS_WRITING, sourceShape: "stops writing", sinkExitCode: "2" },
  ])(
    "rejects with no child left running when the sink exits $sinkExitCode mid-stream and the source $sourceShape",
    async ({ source, sinkExitCode }) => {
      const directory = await fs.mkdtemp(path.join(os.tmpdir(), "pipe-command-output-"));
      const sourcePidFile = path.join(directory, "source.pid");
      const sinkPidFile = path.join(directory, "sink.pid");
      try {
        await expect(
          pipeCommandOutput(
            { command: process.execPath, args: ["-e", source, sourcePidFile] },
            {
              command: process.execPath,
              args: ["-e", SINK_EXITS_AFTER_FIRST_CHUNK, sinkPidFile, sinkExitCode],
            },
            directory
          )
        ).rejects.toThrow();
        const pids = await Promise.all(
          [sourcePidFile, sinkPidFile].map(async (file) => Number(await fs.readFile(file, "utf8")))
        );
        expect(pids.filter(isRunning)).toEqual([]);
      } finally {
        await fs.rm(directory, { recursive: true, force: true });
      }
    }
  );
});
