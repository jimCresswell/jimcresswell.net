/**
 * The bounded retry around the bot's push. GitHub has refused a push with a
 * freshly minted installation token at the ref advertisement, the first
 * request git makes, before it runs the pre-push hook; a second push minutes
 * later went through each time (four times on 2026-09-28). A push whose whole
 * transcript is that refusal is therefore tried again with a fresh token, up
 * to `PUSH_ATTEMPTS` in all. Any other failure is final at once: a refusal
 * after the hook ran would run the whole gate again, and a gate's own failure
 * is the operator's to read.
 *
 * @packageDocumentation
 */

/** How many times, in all, a refused push is tried. */
export const PUSH_ATTEMPTS = 3;

/** The wait before each further attempt. */
const RETRY_WAIT_MS = 10_000;

/**
 * The refusal's lines, in order, as git prints them: GitHub's reason, then
 * git's own failure. The repository and the bot are whatever the push named.
 */
const REFUSAL_LINES: readonly RegExp[] = [
  /^remote: Permission to \S+ denied to \S+\.$/u,
  /^fatal: unable to access '[^']+': The requested URL returned error: 403$/u,
];

/** git's exit status for a fatal error, the refusal's. */
const GIT_FATAL = 128;

/**
 * Whether a failed push is GitHub's refusal at the ref advertisement: git
 * exited 128 and its whole transcript is the refusal's two lines, so the
 * pre-push hook never ran.
 *
 * @param status - The push's exit status; null when a signal ended it.
 * @param transcript - Everything the push printed, both streams.
 */
export function isAdvertisementRefusal(status: number | null, transcript: string): boolean {
  const lines = transcript
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line !== '');
  return (
    status === GIT_FATAL &&
    lines.length === REFUSAL_LINES.length &&
    lines.every((line, index) => REFUSAL_LINES[index]?.test(line) === true)
  );
}

/** One attempt's end: the exit it would report, and whether it was the refusal. */
export interface PushAttempt {
  readonly exit: number;
  readonly refused: boolean;
}

/** Where the retry waits and reports. */
export interface PushRetrySeams {
  readonly sleep: (ms: number) => Promise<void>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

/**
 * Run the attempt, and again after a wait each time GitHub refused it at the
 * ref advertisement, up to `PUSH_ATTEMPTS` in all.
 *
 * @param attempt - One whole push: a fresh mint, then the transfer.
 * @param seams - The wait, and the stream each retry and the last refusal are named on.
 * @returns The exit of the last attempt.
 */
export function pushWithRetry(
  attempt: () => Promise<PushAttempt>,
  seams: PushRetrySeams,
): Promise<number> {
  return attemptFrom(1, attempt, seams);
}

async function attemptFrom(
  number: number,
  attempt: () => Promise<PushAttempt>,
  seams: PushRetrySeams,
): Promise<number> {
  const outcome = await attempt();
  if (!outcome.refused) {
    return outcome.exit;
  }
  if (number >= PUSH_ATTEMPTS) {
    seams.stderr.write(
      `merge-bot push: GitHub refused the push ${String(PUSH_ATTEMPTS)} times before the pre-push hook ran, each refusal shown above; nothing was pushed\n`,
    );
    return outcome.exit;
  }
  seams.stderr.write(
    `merge-bot push: GitHub refused attempt ${String(number)} of ${String(PUSH_ATTEMPTS)} before the pre-push hook ran; trying again with a fresh token in ${String(RETRY_WAIT_MS / 1000)} s\n`,
  );
  await seams.sleep(RETRY_WAIT_MS);
  return attemptFrom(number + 1, attempt, seams);
}
