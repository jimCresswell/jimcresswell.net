import { err, ok, type Result } from '@engraph/result';

import type { DirectoryListing, EntryRead } from '../directory-listing.js';
import type { RuleProjectionFs } from '../rule-projection-fs.js';

/** The in-memory repository the projection legs' cells run over. */
export type FakeProjectionRepo = RuleProjectionFs & { readonly files: Map<string, string> };

/** The direct children of `relDir` among the files, split by the surface's extension. */
function listingOf(
  files: ReadonlyMap<string, string>,
  relDir: string,
  extension: string,
): DirectoryListing {
  const under = [...files.keys()]
    .filter((file) => file.startsWith(`${relDir}/`))
    .filter((file) => !file.slice(relDir.length + 1).includes('/'))
    .sort((left, right) => left.localeCompare(right));
  if (under.length === 0) {
    return { kind: 'absent' };
  }
  return {
    kind: 'files',
    files: under.filter((file) => file.endsWith(extension)),
    stray: under.filter((file) => !file.endsWith(extension)),
  };
}

/** A mutation the port applies, or refuses when the entry changed under it. */
function mutation(
  refusals: ReadonlySet<string>,
  relPath: string,
  refusal: string,
  apply: () => void,
): Result<undefined, string> {
  if (refusals.has(relPath)) {
    return err(`${relPath}: ${refusal}`);
  }
  apply();
  return ok(undefined);
}

/**
 * An in-memory repository keyed by repo-relative path for the projection legs' cells; every
 * write and removal is applied. A directory exists when any path lies under it; `listings`
 * overrides what listing it yields, `reads` what reading a path yields (a foreign or
 * unreadable entry), and `refusals` the mutations the port refuses (the entry changed under
 * it).
 */
export function fakeProjectionRepo(
  initial: ReadonlyMap<string, string>,
  listings: ReadonlyMap<string, DirectoryListing> = new Map(),
  reads: ReadonlyMap<string, EntryRead> = new Map(),
  refusals: ReadonlySet<string> = new Set(),
): FakeProjectionRepo {
  const files = new Map(initial);
  return {
    files,
    listDirectory: async (relDir, extension) =>
      listings.get(relDir) ?? listingOf(files, relDir, extension),
    readEntry: async (relPath) => {
      const override = reads.get(relPath);
      if (override !== undefined) {
        return override;
      }
      const text = files.get(relPath);
      return text === undefined ? { kind: 'absent' } : { kind: 'text', text };
    },
    writeText: async (relPath, text) =>
      mutation(
        refusals,
        relPath,
        'not a regular file at the moment of the write; refusing the projection write',
        () => files.set(relPath, text),
      ),
    removeFile: async (relPath) =>
      mutation(
        refusals,
        relPath,
        'not a regular file at the moment of the removal; refusing to remove it',
        () => files.delete(relPath),
      ),
  };
}
