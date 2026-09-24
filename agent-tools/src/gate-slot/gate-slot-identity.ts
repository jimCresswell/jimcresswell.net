import { isAbsolute } from 'node:path';

import { z } from 'zod';

import { parseJsonTextResult } from '../core/json.js';

import type { GateHolderIdentity } from './gate-slot-contract.js';

/** The longest command a holder serves, so its line fits every reader's bound. */
const MAX_COMMAND_CHARS = 256;

/** The longest worktree path an identity may carry. */
const MAX_WORKTREE_CHARS = 1024;

/** True when no C0, DEL or C1 control character appears: nothing can forge a line or an escape. */
function isPrintable(text: string): boolean {
  return [...text].every((character) => {
    const code = character.codePointAt(0) ?? 0;
    return code >= 0x20 && (code < 0x7f || code > 0x9f);
  });
}

/**
 * The identity a gate serves, validated as untrusted input: it arrives from
 * whatever listens on a slot port and is printed in a seat's terminal.
 */
const HolderIdentitySchema = z.object({
  worktree: z
    .string()
    .max(MAX_WORKTREE_CHARS)
    .refine((path) => isAbsolute(path) && isPrintable(path)),
  pid: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  command: z.string().max(MAX_COMMAND_CHARS).refine(isPrintable),
  acquired_at: z.iso.datetime(),
});

/** The line a holder writes to every connection on its slot port. */
export function encodeHolderIdentity(identity: GateHolderIdentity): string {
  return `${JSON.stringify(identity)}\n`;
}

/**
 * The command a holder serves for `pnpmArgs`: control characters become
 * spaces and the text is cut to the served length, so its own identity
 * always passes a reader's validation.
 */
export function holderCommand(pnpmArgs: readonly string[]): string {
  const printable = [...['pnpm', ...pnpmArgs].join(' ')]
    .map((character) => (isPrintable(character) ? character : ' '))
    .join('');

  return printable.slice(0, MAX_COMMAND_CHARS);
}

/**
 * Read what a slot's listener answered. Anything that is not a whole,
 * well-formed identity (a foreign service's greeting, a cut-off answer, a
 * field carrying a line break or out of bounds) reads as `undefined`: the
 * slot still counts as held, but by no gate the same-tree rule can match.
 */
export function parseHolderIdentity(text: string): GateHolderIdentity | undefined {
  const parsed = parseJsonTextResult(text, 'gate slot holder identity');
  if (!parsed.ok) {
    return undefined;
  }
  const identity = HolderIdentitySchema.safeParse(parsed.value);

  return identity.success ? identity.data : undefined;
}
