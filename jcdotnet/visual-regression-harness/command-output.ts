import path from "node:path";
import { spawn } from "node:child_process";

/**
 * Run a command to completion and return what it wrote to standard output.
 *
 * @remarks
 * Completion is the child's `close` event, which fires once the process has
 * exited and every stdio stream has reached end-of-file. The `exit` event is not
 * completion: Node documents that stdio streams may still be open when it fires.
 * On Linux, libuv reaps every exited child on any SIGCHLD it processes, so a child
 * can be reported as exited before the parent has read output that is already in
 * the pipe; a reader that stops at `exit` then returns short output with a zero
 * exit code.
 *
 * @param command Executable to run.
 * @param args Arguments passed to the executable.
 * @param workingDirectory Directory the command runs in.
 * @returns The command's standard output, decoded as UTF-8.
 * @throws When the command cannot start or ends with a non-zero code or a signal.
 */
export async function readCommandOutput(
  command: string,
  args: readonly string[],
  workingDirectory: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    const child = spawn(command, args, {
      cwd: workingDirectory,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk: Buffer) => {
      stdout.push(chunk);
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr.push(chunk);
    });

    child.on("error", reject);
    // `close`, never `exit`: see the function's remarks.
    child.on("close", (code, signal) => {
      if (code === 0) {
        resolve(Buffer.concat(stdout).toString("utf8"));
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} failed in ${path.resolve(workingDirectory)} with code ${code ?? "null"} and signal ${signal ?? "null"}\n${Buffer.concat(stderr).toString("utf8")}`.trim()
        )
      );
    });
  });
}
