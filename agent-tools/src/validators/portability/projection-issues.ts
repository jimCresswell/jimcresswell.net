/**
 * The projection leg's issue wording: what a listing or an entry read yields, or the one
 * issue that refuses the leg; and the drift issues that name the cure. Kept apart from the
 * leg so its refusal texts read in one place and the leg stays within the line cap.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import type { RuleProjectionDrift } from '../../rule-declarations/rule-projection-drift.js';

import type { DirectoryListing, EntryRead } from './directory-listing.js';

const FIX_HINT = 'run `pnpm portability:fix`';
export const REFUSING = 'refusing to regenerate the rule projections';

/**
 * The files a listing yields, or the one issue that refuses the leg. An absent projection
 * surface is empty (a fresh host has none yet) and a stray regular file on it is listed so
 * the drift reads it as stale; the absent canonical directory and a stray on it are refusals.
 */
export function filesOf(
  relDir: string,
  listing: DirectoryListing,
  surface: 'projection' | 'canonical',
): Result<readonly string[], string> {
  if (listing.kind === 'files') {
    if (surface === 'projection' || listing.stray.length === 0) {
      return ok([...listing.files, ...listing.stray].sort((a, b) => a.localeCompare(b)));
    }
    const strays = listing.stray.join(', ');
    return err(`${strays}: not a rule; the canonical rules directory admits .md rules only`);
  }
  if (listing.kind === 'absent') {
    return surface === 'projection' ? ok([]) : err(`${relDir}: no such directory; ${REFUSING}`);
  }
  if (listing.kind === 'unreadable') {
    return err(`${relDir}: unreadable (${listing.cause}); ${REFUSING}`);
  }
  return err(`${listing.entry}: not a regular file; the rule surfaces admit regular files only`);
}

/** The text an entry read yields, or the one issue that refuses the leg, naming the path. */
export function textOf(relPath: string, read: EntryRead): Result<string, string> {
  if (read.kind === 'text') {
    return ok(read.text);
  }
  if (read.kind === 'absent') {
    return err(`${relPath}: vanished between listing and read; ${REFUSING}`);
  }
  if (read.kind === 'unreadable') {
    return err(`${relPath}: unreadable (${read.cause}); ${REFUSING}`);
  }
  return err(`${relPath}: not a regular file; the rule surfaces admit regular files only`);
}

export function driftIssues(drift: RuleProjectionDrift): string[] {
  return [
    ...drift.missing.map((file) => `${file}: missing rule projection (${FIX_HINT})`),
    ...drift.drifted.map(
      (file) =>
        `${file}: drifted from the rule's declaration; projections are never hand-edited (${FIX_HINT})`,
    ),
    ...drift.stale.map(
      (file) => `${file}: no canonical rule renders it (${FIX_HINT} to remove it)`,
    ),
  ];
}
