/**
 * Operator profile — reading one document. A document is opened read-only
 * and never through a symlink (`O_NOFOLLOW`), read whole, and closed; each
 * of the three steps has its own Result, and nothing here throws. The error
 * code helper lives here because every filesystem refusal names one.
 */

import { constants } from 'node:fs';
import { type FileHandle, open } from 'node:fs/promises';

import { err, ok, type Result } from '@engraph/result';

export function errorCode(cause: unknown): string {
  return cause instanceof Error && 'code' in cause ? String(cause.code) : 'unknown';
}

/**
 * `O_NOFOLLOW` where the platform defines it. Node types it as always
 * present; Windows has no such flag, and there the listing's refusal of
 * symlink entries is the whole guard.
 */
const O_NOFOLLOW: number | undefined = constants.O_NOFOLLOW;

/** The open flags a document is read with: read-only, never through a symlink. */
const DOCUMENT_OPEN_FLAGS: number = constants.O_RDONLY | (O_NOFOLLOW ?? 0);

/** What a read needs of an open file; a `FileHandle` is one. */
export interface DocumentHandle {
  readFile(encoding: 'utf8'): Promise<string>;
  close(): Promise<void>;
}

/** Opens a path with flags; the filesystem one is the default, tests inject a fake. */
export type OpenDocument = (absolute: string, flags: number) => Promise<DocumentHandle>;

const openReal: OpenDocument = async (absolute, flags) => {
  const handle: FileHandle = await open(absolute, flags);
  return handle;
};

/**
 * Read a document without following a symlink at its path. The layout has
 * already refused every symlink entry; opening with `O_NOFOLLOW` closes the
 * window between the listing and the read, so a link planted in between
 * fails (ELOOP) instead of reading a file outside the profile root.
 *
 * @param absolute - the document's absolute path
 * @param openDocument - opens the path (the filesystem by default)
 * @returns the document text, or the failure as a message (never a thrown error)
 */
export async function readDocument(
  absolute: string,
  openDocument: OpenDocument = openReal,
): Promise<Result<string, string>> {
  let opened: DocumentHandle;
  try {
    opened = await openDocument(absolute, DOCUMENT_OPEN_FLAGS);
  } catch (cause) {
    return err(unreadable(cause));
  }
  let text: string;
  try {
    text = await opened.readFile('utf8');
  } catch (cause) {
    await closeQuietly(opened);
    return err(unreadable(cause));
  }
  try {
    await opened.close();
  } catch (cause) {
    return err(
      `cannot close the document after reading it (${errorCode(cause)}) — the text read is discarded, never trusted`,
    );
  }
  return ok(text);
}

/**
 * Closes a handle whose read already failed: the refusal is the outcome, so
 * a second failure here, thrown or rejected, adds nothing and is contained.
 */
async function closeQuietly(handle: DocumentHandle): Promise<void> {
  try {
    await handle.close();
  } catch {
    // Contained on purpose; see above.
  }
}

function unreadable(cause: unknown): string {
  return `cannot read the document (${errorCode(cause)}) — a symlink or an unreadable file is never a profile document`;
}
