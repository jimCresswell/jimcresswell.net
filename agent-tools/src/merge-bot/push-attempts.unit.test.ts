import { describe, expect, it } from 'vitest';

import {
  isAdvertisementRefusal,
  PUSH_ATTEMPTS,
  pushWithRetry,
  type PushAttempt,
} from './push-attempts.js';

/**
 * The bounded push retry: which failed push is GitHub's refusal at the ref
 * advertisement, and what the retry returns and says for a run of attempts.
 * The push itself, minted and transferred, is `push-cli.integration.test.ts`'s.
 */

/** GitHub's refusal as git printed it on 2026-09-28, the repository and bot renamed. */
const REFUSAL =
  'remote: Permission to acme/widgets.git denied to jimbot-oakington-iii[bot].\n' +
  "fatal: unable to access 'https://github.com/acme/widgets.git/': The requested URL returned error: 403\n";

describe('isAdvertisementRefusal', () => {
  it('holds for exit 128 with the two refusal lines and nothing else', () => {
    expect(isAdvertisementRefusal(128, REFUSAL)).toBe(true);
  });

  it('holds when the lines end with carriage returns or blank lines surround them', () => {
    expect(isAdvertisementRefusal(128, `\n${REFUSAL.replaceAll('\n', '\r\n')}\n`)).toBe(true);
  });

  it('does not hold when anything else was printed, such as the pre-push gate', () => {
    expect(isAdvertisementRefusal(128, `Running pre-push checks...\n${REFUSAL}`)).toBe(false);
  });

  it('does not hold for a fatal exit that printed nothing', () => {
    expect(isAdvertisementRefusal(128, '')).toBe(false);
  });

  it('does not hold for another exit or a signal', () => {
    expect(isAdvertisementRefusal(1, REFUSAL)).toBe(false);
    expect(isAdvertisementRefusal(null, REFUSAL)).toBe(false);
  });

  it('does not hold for another failure at the same request', () => {
    const notFound = REFUSAL.replace('error: 403', 'error: 404');
    expect(isAdvertisementRefusal(128, notFound)).toBe(false);
    expect(isAdvertisementRefusal(128, REFUSAL.split('\n')[1] ?? '')).toBe(false);
  });

  it('does not hold with the two lines in the other order', () => {
    const [reason = '', failure = ''] = REFUSAL.split('\n');
    expect(isAdvertisementRefusal(128, `${failure}\n${reason}\n`)).toBe(false);
  });
});

const REFUSED: PushAttempt = { exit: 1, refused: true };

/** Run the retry over attempts that end as given, in order, and collect what it writes. */
async function retried(ends: readonly PushAttempt[]): Promise<{ exit: number; text: string }> {
  let text = '';
  const remaining = [...ends];
  const exit = await pushWithRetry(() => Promise.resolve(remaining.shift() ?? REFUSED), {
    sleep: () => Promise.resolve(),
    stderr: {
      write: (chunk: string) => {
        text += chunk;
        return true;
      },
    },
  });
  return { exit, text };
}

describe('pushWithRetry', () => {
  it('returns a first attempt that pushed, saying nothing', async () => {
    await expect(retried([{ exit: 0, refused: false }])).resolves.toStrictEqual({
      exit: 0,
      text: '',
    });
  });

  it('tries again after a refusal and returns the attempt that pushed', async () => {
    const { exit, text } = await retried([REFUSED, { exit: 0, refused: false }]);

    expect(exit).toBe(0);
    expect(text).toBe(
      'merge-bot push: GitHub refused attempt 1 of 3 before the pre-push hook ran; trying again with a fresh token in 10 s\n',
    );
  });

  it('stops at the third refusal and says so', async () => {
    const { exit, text } = await retried([REFUSED, REFUSED, REFUSED, { exit: 0, refused: false }]);

    expect(exit).toBe(1);
    expect(text.trimEnd().split('\n')).toStrictEqual([
      expect.stringContaining('refused attempt 1 of 3'),
      expect.stringContaining('refused attempt 2 of 3'),
      `merge-bot push: GitHub refused the push ${String(PUSH_ATTEMPTS)} times before the pre-push hook ran, each refusal shown above; nothing was pushed`,
    ]);
  });

  it('returns any other failure at once', async () => {
    await expect(
      retried([
        { exit: 1, refused: false },
        { exit: 0, refused: false },
      ]),
    ).resolves.toStrictEqual({ exit: 1, text: '' });
  });
});
