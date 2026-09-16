import os from "node:os";
import { describe, expect, it } from "vitest";
import { readCommandOutput } from "./command-output";

/**
 * Spawn-topology contract for reading a command's output: the whole of stdout is
 * returned even when the stdout pipe outlives the process. Real spawns of the
 * running Node binary with `-e`; no shell, no git.
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
