import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Ceiling on the standard output and standard error a command may produce, in bytes.
 *
 * The largest output read here is a path listing (`git diff --name-only`,
 * `git ls-files --others`). 32 MiB is several times the listing
 * `git ls-files --others` gives for this repository even without the standard
 * excludes, when every installed dependency file counts as untracked; a command
 * that writes more fails with Node's `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` as the cause.
 */
const MAX_OUTPUT_BYTES = 32 * 1024 * 1024;

/**
 * Run a command to completion and return what it wrote to standard output.
 *
 * @remarks
 * Built on `execFile`, which settles on the child's `close` event: once the
 * process has exited and every stdio stream has reached end-of-file. The `exit`
 * event is not completion: Node documents that stdio streams may still be open
 * when it fires, and on Linux libuv reaps every exited child on any SIGCHLD it
 * processes, so a reader that stops at `exit` can return short output with a zero
 * exit code. `execFile` also attaches its `error` listener whatever the spawn
 * outcome, so a spawn that fails (EMFILE, ENOENT) rejects instead of surfacing
 * as an uncaught exception, and it decodes the output once, as UTF-8.
 *
 * @param command Executable to run.
 * @param args Arguments passed to the executable.
 * @param workingDirectory Directory the command runs in.
 * @returns The command's standard output.
 * @throws An `Error` whose message names the command and directory, then the exit
 * code and signal (or, for a command that did not run to an exit, the reason) and
 * the command's trimmed stderr, and whose `cause` is the `execFile` error, when
 * the command cannot start, ends with a non-zero code or a signal, or exceeds the
 * output ceiling.
 */
export async function readCommandOutput(
  command: string,
  args: readonly string[],
  workingDirectory: string
): Promise<string> {
  try {
    const { stdout } = await execFileAsync(command, args, {
      cwd: workingDirectory,
      encoding: "utf8",
      maxBuffer: MAX_OUTPUT_BYTES,
    });
    return stdout;
  } catch (cause: unknown) {
    throw new Error(
      `${command} ${args.join(" ")} failed in ${path.resolve(workingDirectory)}${describeFailure(cause)}`,
      { cause }
    );
  }
}

/**
 * The reason an `execFile` call failed, for the error message: the exit code and signal
 * when the command ran to an exit, the error's own message otherwise (a spawn error, the
 * output ceiling), then the command's trimmed stderr on its own lines.
 */
function describeFailure(cause: unknown): string {
  if (!(cause instanceof Error)) {
    return `: ${String(cause)}`;
  }
  const code = "code" in cause ? cause.code : undefined;
  const signal = "signal" in cause ? cause.signal : undefined;
  const ranToExit = typeof code === "number" || typeof signal === "string";
  const reason = ranToExit
    ? ` with code ${String(code ?? null)} and signal ${String(signal ?? null)}`
    : `: ${cause.message}`;
  const stderr = "stderr" in cause && typeof cause.stderr === "string" ? cause.stderr.trim() : "";
  return stderr.length > 0 ? `${reason}\n${stderr}` : reason;
}
