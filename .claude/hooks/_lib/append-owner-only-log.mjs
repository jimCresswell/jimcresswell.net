/**
 * Append one entry to `.claude/logs/hook-errors.log`, keeping the logs owner-only.
 *
 * The directory also holds the `PreCompact` observer's records of the raw
 * harness payload, so the directory is kept mode 700 and the log mode 600,
 * including when an earlier version left them open — the same policy as
 * `log-hook-errors.sh`. A symlinked logs directory or log, one another account
 * owns, or a log that is not a regular file is left alone and nothing is
 * written, so no mode change ever follows a link elsewhere. The log is opened
 * without following a final symlink and without blocking on a FIFO.
 *
 * A process with no uid (Node gives none on Windows or Android) cannot check
 * who owns a file, and on Windows the modes cannot make a file owner-only
 * either, since access there is governed by ACLs. The append then refuses
 * before touching anything and nothing is written.
 *
 * Callers treat this as best-effort observability and catch what it throws.
 */

import {
  appendFileSync,
  chmodSync,
  closeSync,
  constants,
  fchmodSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
} from 'node:fs';
import { resolve } from 'node:path';

const OWNER_ONLY_DIRECTORY = 0o700;
const OWNER_ONLY_FILE = 0o600;
const APPEND_WITHOUT_FOLLOWING =
  constants.O_WRONLY |
  constants.O_APPEND |
  constants.O_CREAT |
  constants.O_NOFOLLOW |
  constants.O_NONBLOCK;

/** Whether this process's user owns the file a stat describes. */
const ownedByThisUser = (stats) => stats.uid === process.getuid();

/**
 * Append text to the hook error log under a project root.
 *
 * @param {string} projectRoot - The project directory holding `.claude/logs`.
 * @param {string} text - The entry to append, including its trailing newline.
 * @returns {boolean} Whether the entry was written.
 */
export function appendOwnerOnlyLog(projectRoot, text) {
  if (process.getuid === undefined) {
    return false;
  }
  const logDir = resolve(projectRoot, '.claude', 'logs');
  mkdirSync(logDir, { recursive: true, mode: OWNER_ONLY_DIRECTORY });
  const directory = lstatSync(logDir);
  if (directory.isSymbolicLink() || !directory.isDirectory() || !ownedByThisUser(directory)) {
    return false;
  }
  chmodSync(logDir, OWNER_ONLY_DIRECTORY);
  const descriptor = openSync(
    resolve(logDir, 'hook-errors.log'),
    APPEND_WITHOUT_FOLLOWING,
    OWNER_ONLY_FILE,
  );
  try {
    const log = fstatSync(descriptor);
    if (!log.isFile() || !ownedByThisUser(log)) {
      return false;
    }
    fchmodSync(descriptor, OWNER_ONLY_FILE);
    appendFileSync(descriptor, text);
    return true;
  } finally {
    closeSync(descriptor);
  }
}
