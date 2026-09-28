import { err, ok, type Result } from '@engraph/result';

import { printable } from '../pr-watch/printable.js';

/**
 * The text parsers behind `merge-bot retire`: what git and a remote URL
 * print, turned into typed readings. Pure, so every reading the command
 * decides on is proven here without a git process.
 *
 * Exactness is the point of each. `git ls-remote` matches any ref ENDING in
 * its pattern, and a case-insensitive filesystem lets `rev-parse` resolve
 * `refs/heads/Main` to `main`'s file, so the command never asks git "which
 * ref is this?": it lists refs and compares whole names itself.
 */

const SHA_PATTERN = /^[0-9a-f]{40}$/;

/**
 * The branch names this command will retire: ASCII letters, digits, dot,
 * underscore, hyphen and slash. A URL-safety policy on top of git's own ref
 * grammar (which `ref-format.ts` asks git for), not a replacement for it:
 * git accepts `#` and `%` in a branch name, and a URL or a server decoding a
 * path would read either as something else. A name outside the list is
 * retired by hand.
 */
const RETIRABLE_BRANCH = /^[A-Za-z0-9._/-]+$/;

/** Whether this command may retire a branch of this name (see `RETIRABLE_BRANCH`). */
export function isRetirableBranchName(name: string): boolean {
  return RETIRABLE_BRANCH.test(name);
}

/** The remote's default branch and its tip, from one `ls-remote --symref origin HEAD`. */
export interface DefaultBranchReading {
  readonly name: string;
  readonly sha: string;
}

/**
 * Read `git ls-remote --symref origin HEAD`: a `ref: refs/heads/<name>\tHEAD`
 * line, then `<sha>\tHEAD`. The name is server-supplied and lands in a later
 * argv, so it must be a retirable name and must not read as a flag.
 */
export function parseSymrefHead(stdout: string): Result<DefaultBranchReading, Error> {
  const lines = stdout.split('\n');
  const name = symrefName(lines);
  const sha = headSha(lines);
  if (name === undefined || sha === undefined) {
    return err(new Error(`the remote's HEAD could not be read from: ${JSON.stringify(stdout)}`));
  }
  if (name.startsWith('-') || !isRetirableBranchName(name)) {
    return err(
      new Error(
        `the remote's default branch name "${printable(name)}" is outside the names this command handles`,
      ),
    );
  }
  return ok({ name, sha });
}

/** The branch name on the `ref: refs/heads/<name>\tHEAD` line. */
function symrefName(lines: readonly string[]): string | undefined {
  const line = lines.find((candidate) => candidate.startsWith('ref: ')) ?? '';
  return /^ref: refs\/heads\/(\S+)\tHEAD$/.exec(line)?.[1];
}

/** The sha on the `<sha>\tHEAD` line, when it is a full sha. */
function headSha(lines: readonly string[]): string | undefined {
  const line = lines.find(
    (candidate) => candidate.endsWith('\tHEAD') && !candidate.startsWith('ref: '),
  );
  const sha = line?.split('\t')[0];
  return sha !== undefined && SHA_PATTERN.test(sha) ? sha : undefined;
}

/** A remote branch as the probe read it. */
export type RemoteRefReading =
  { readonly kind: 'present'; readonly sha: string } | { readonly kind: 'absent' };

/**
 * Read `git ls-remote origin refs/heads/<branch>` taking ONLY the line whose
 * refname is exactly `refs/heads/<branch>`: git's pattern also matches a ref
 * such as `refs/heads/a/refs/heads/<branch>`, and proving that one would let a
 * delete land on the unproven exact ref.
 */
export function parseExactRemoteRef(stdout: string, branch: string): RemoteRefReading {
  const wanted = `refs/heads/${branch}`;
  for (const line of stdout.split('\n')) {
    const [sha, refname] = line.split('\t');
    if (refname === wanted && sha !== undefined && SHA_PATTERN.test(sha)) {
      return { kind: 'present', sha };
    }
  }
  return { kind: 'absent' };
}

/** One ref as `git for-each-ref` lists it. */
export interface ListedRef {
  readonly sha: string;
  /** The ref this one points at when it is symbolic; undefined for a plain ref. */
  readonly symref: string | undefined;
}

/** The `for-each-ref` format {@link parseRefListing} reads. */
export const REF_LISTING_FORMAT = '--format=%(refname) %(objectname) %(symref)';

/**
 * Read `git for-each-ref` in {@link REF_LISTING_FORMAT} into a map from the
 * exact full refname to its object name and, for a symbolic ref, its target.
 * Lookups are case-sensitive by construction, whatever the filesystem folds.
 * A symbolic ref lists its TARGET's sha, which is why the target is read: a
 * delete through a symbolic ref lands on the ref it points at.
 */
export function parseRefListing(stdout: string): ReadonlyMap<string, ListedRef> {
  const refs = new Map<string, ListedRef>();
  for (const line of stdout.split('\n')) {
    const [refname, sha, symref] = line.split(' ');
    if (refname !== undefined && refname !== '' && sha !== undefined && SHA_PATTERN.test(sha)) {
      refs.set(refname, {
        sha,
        symref: symref === undefined || symref === '' ? undefined : symref,
      });
    }
  }
  return refs;
}

const BRANCH_REF_PREFIXES = ['refs/heads/', 'refs/remotes/origin/'] as const;

/**
 * Every listed local or tracking ref, other than the branch's own two, whose
 * branch part equals `branch` when case is ignored. On a case-insensitive
 * filesystem such a pair shares one loose-ref file, so a delete of either
 * could land on the other.
 */
export function caseCollisionsOf(
  listing: ReadonlyMap<string, ListedRef>,
  branch: string,
): readonly string[] {
  const folded = branch.toLowerCase();
  const collisions: string[] = [];
  for (const refname of listing.keys()) {
    const prefix = BRANCH_REF_PREFIXES.find((candidate) => refname.startsWith(candidate));
    const name = prefix === undefined ? undefined : refname.slice(prefix.length);
    if (name !== undefined && name !== branch && name.toLowerCase() === folded) {
      collisions.push(refname);
    }
  }
  return collisions;
}

/** One entry of `git worktree list --porcelain`. */
export interface WorktreeEntry {
  readonly path: string;
  /** The full refname checked out there; undefined when HEAD is detached. */
  readonly branch: string | undefined;
  /** Whether git marks it prunable: its directory is gone, so it has no state left to read. */
  readonly prunable: boolean;
}

/** Read `git worktree list --porcelain`: blank-line-separated records. */
export function parseWorktrees(porcelain: string): readonly WorktreeEntry[] {
  const entries: WorktreeEntry[] = [];
  for (const record of porcelain.split('\n\n')) {
    const lines = record.split('\n');
    const path = lines.find((line) => line.startsWith('worktree '))?.slice('worktree '.length);
    if (path !== undefined) {
      const branch = lines.find((line) => line.startsWith('branch '))?.slice('branch '.length);
      const prunable = lines.some((line) => line === 'prunable' || line.startsWith('prunable '));
      entries.push({ path, branch, prunable });
    }
  }
  return entries;
}

/** A GitHub repository named by a remote URL. */
export interface GithubRepo {
  readonly owner: string;
  readonly repo: string;
}

const GITHUB_URL_FORMS: readonly RegExp[] = [
  /^https:\/\/(?:[^@/]+@)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/,
  /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/,
  /^ssh:\/\/git@github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/,
];

/**
 * The owner and repository a GitHub remote URL names, in the https (with or
 * without credentials in it), scp-like and ssh forms; undefined for anything
 * else. The URL itself is never echoed: an https URL can carry a token. Read from the RAW configured
 * URL: `git remote get-url` applies `insteadOf` rewriting, which would bind
 * the check to whatever a rewrite made of it.
 */
export function githubRepoOf(url: string): GithubRepo | undefined {
  for (const form of GITHUB_URL_FORMS) {
    const match = form.exec(url.trim());
    const owner = match?.[1];
    const repo = match?.[2];
    if (owner !== undefined && repo !== undefined) {
      return { owner, repo };
    }
  }
  return undefined;
}
