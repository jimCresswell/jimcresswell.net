import path from "node:path";
import { execFile, spawn, type ChildProcess, type StdioOptions } from "node:child_process";
import { pipeline } from "node:stream/promises";
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

/** A command to run: the executable and its arguments. */
export interface CommandInvocation {
  readonly command: string;
  readonly args: readonly string[];
}

function describeInvocation({ command, args }: CommandInvocation): string {
  return [command, ...args].join(" ");
}

/**
 * Settle once the child has closed: resolve on exit code 0, reject otherwise.
 *
 * Node emits `close` after `error` when a spawn fails (ENOENT, EMFILE), so waiting
 * for `close` cannot hang on a child that never started; the recorded error is then
 * the rejection reason.
 */
function closeOf(child: ChildProcess, invocation: CommandInvocation): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let processError: Error | undefined;
    child.on("error", (error) => {
      processError ??= error;
    });
    child.once("close", (code, signal) => {
      if (processError === undefined && code === 0) {
        resolve();
        return;
      }
      reject(
        processError ??
          new Error(
            `${describeInvocation(invocation)} exited with code ${String(code)} and signal ${String(signal)}`
          )
      );
    });
  });
}

/**
 * Run `source` with its standard output piped into the standard input of `sink`.
 *
 * @remarks
 * Settles only once both children have closed, so no child outlives the returned
 * promise. The bytes flow through `stream.pipeline`, which handles an error on
 * either end (EPIPE when the sink stops reading, a premature close when it exits)
 * by destroying both ends: the sink then meets end-of-file and the source EPIPE on
 * its next write. When either child fails (a spawn error, a non-zero exit code, a
 * signal), the other is killed with SIGKILL, so a source that has stopped writing,
 * or a sink still waiting on input, cannot keep the pipe open. Success is both
 * commands exiting 0; a stream error alone is not a failure, because a sink that
 * exits 0 has accepted what it read and a source cut short by EPIPE exits non-zero.
 *
 * @param source Command whose standard output is piped.
 * @param sink Command that reads the piped output on its standard input.
 * @param workingDirectory Directory both commands run in.
 * @throws An `Error` naming both commands and the directory, whose `cause` is the
 * first failure: a spawn error or a non-zero close.
 */
export async function pipeCommandOutput(
  source: CommandInvocation,
  sink: CommandInvocation,
  workingDirectory: string
): Promise<void> {
  const children: ChildProcess[] = [];
  const settled: Promise<void>[] = [];
  const failures: unknown[] = [];

  const fail = (error: unknown): void => {
    failures.push(error);
    for (const child of children) {
      // A child whose spawn failed has no pid, and signalling it would pass an unset
      // pid to kill(2), where 0 means this whole process group. Node does not signal
      // a child whose exit it has already handled.
      if (child.pid !== undefined) {
        child.kill("SIGKILL");
      }
    }
  };

  const start = (invocation: CommandInvocation, stdio: StdioOptions): ChildProcess => {
    const child = spawn(invocation.command, invocation.args, { cwd: workingDirectory, stdio });
    children.push(child);
    settled.push(closeOf(child, invocation).catch(fail));
    return child;
  };

  try {
    const producer = start(source, ["ignore", "pipe", "inherit"]);
    const consumer = start(sink, ["pipe", "inherit", "inherit"]);
    // A stream is missing only when its spawn failed, which that child's close reports.
    if (producer.stdout && consumer.stdin) {
      // See the remarks: the exit codes decide the outcome, not the stream error.
      settled.push(pipeline(producer.stdout, consumer.stdin).catch(() => undefined));
    }
  } catch (error: unknown) {
    fail(error);
  }

  await Promise.all(settled);
  if (failures.length > 0) {
    throw new Error(
      `${describeInvocation(source)} | ${describeInvocation(sink)} failed in ${path.resolve(workingDirectory)}`,
      { cause: failures[0] }
    );
  }
}
