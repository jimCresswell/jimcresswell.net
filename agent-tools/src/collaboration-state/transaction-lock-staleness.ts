/** What a waiter knows about a transaction lock it could not take. */
export interface LockAgeEvidence {
  /** The owner file's `created_at`, when the file exists and parses. */
  readonly ownerCreatedAt: string | undefined;
  /** The modification time of the directory at the lock path; a waiter dates only a real directory. */
  readonly directoryModifiedMs: number;
  readonly nowMs: number;
  readonly staleMs: number;
}

/**
 * Whether a waiter may reclaim a transaction lock: its age exceeds `staleMs`.
 * The age is the owner's `created_at`; when the owner file is missing or its
 * time does not parse, it is the directory's own modification time. A holder
 * that dies between making the directory and writing the owner file leaves a
 * lock with no owner, and without this fallback no waiter would ever reclaim
 * it.
 */
export function isStaleLock(evidence: LockAgeEvidence): boolean {
  const createdMs =
    evidence.ownerCreatedAt === undefined ? Number.NaN : Date.parse(evidence.ownerCreatedAt);
  const since = Number.isNaN(createdMs) ? evidence.directoryModifiedMs : createdMs;

  return evidence.nowMs - since > evidence.staleMs;
}
