import os from "node:os";
import { describe, expect, it } from "vitest";
import { exitBeforeWriting } from "../test-helpers/exit-before-writing";
import { readCommandOutput } from "./command-output";

/**
 * Spawn-topology contract for reading a command's output: the whole of stdout is
 * returned even when the stdout pipe outlives the process, and a failure names its
 * exit code and stderr. Real spawns of the running Node binary with `-e`; no shell,
 * no git.
 */

describe("readCommandOutput", () => {
  it("returns output that reaches stdout after the process has exited", async () => {
    const script = exitBeforeWriting("written after the process was reaped\n");
    await expect(readCommandOutput(process.execPath, ["-e", script], os.tmpdir())).resolves.toBe(
      "written after the process was reaped\n"
    );
  });

  it("rejects with the exit code and the command's stderr in the message when the command fails", async () => {
    const script = 'process.stderr.write("fatal: stub failure\\n"); process.exit(3);';
    await expect(
      readCommandOutput(process.execPath, ["-e", script], os.tmpdir())
    ).rejects.toMatchObject({
      message: expect.stringMatching(/with code 3 and signal null\nfatal: stub failure$/u),
      cause: { code: 3 },
    });
  });
});
