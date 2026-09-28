import type { DefaultBranchReading } from './retire-parse.js';

/**
 * The outcome of `merge-bot retire`, its exit code, and how it is written.
 * Pure. The outcome is a closed union with no credential field anywhere in
 * it, so no token can reach either stream through the report.
 */

/**
 * What happened to one name of the branch: deleted (at the sha it was proven
 * at); absent; kept, because it moved after its proof (at the sha it moved
 * to); failed, a delete that did not take, the ref still at its proven sha;
 * or unknown, when the delete ran and its outcome could not be read.
 */
export type NameReport =
  | { readonly state: 'deleted'; readonly sha: string }
  | { readonly state: 'absent' }
  | { readonly state: 'kept'; readonly sha: string }
  | { readonly state: 'failed' }
  | { readonly state: 'unknown' };

/** The three names a branch can have. */
export interface NameReports {
  readonly remote: NameReport;
  readonly tracking: NameReport;
  readonly local: NameReport;
}

export type RetireOutcome =
  | {
      readonly kind: 'retired';
      readonly branch: string;
      readonly base: DefaultBranchReading;
      readonly names: NameReports;
    }
  | { readonly kind: 'absent'; readonly branch: string }
  | { readonly kind: 'refused'; readonly branch: string; readonly reason: string }
  | {
      readonly kind: 'partial';
      readonly branch: string;
      readonly base: DefaultBranchReading;
      readonly names: NameReports;
      readonly reason: string;
    }
  | { readonly kind: 'failed'; readonly branch: string; readonly reason: string };

const EXIT_CODES: Readonly<Record<RetireOutcome['kind'], number>> = {
  retired: 0,
  absent: 0,
  refused: 3,
  partial: 1,
  failed: 1,
};

/** 0 retired or nothing to retire; 3 refused before any delete; 1 a failure, before or after a delete. */
export function exitCodeFor(outcome: RetireOutcome): number {
  return EXIT_CODES[outcome.kind];
}

function describeName(report: NameReport): string {
  return 'sha' in report ? `${report.state} at ${report.sha}` : report.state;
}

function nameLines(names: NameReports): string {
  return (['remote', 'tracking', 'local'] as const)
    .map((key) => `  ${key}: ${describeName(names[key])}\n`)
    .join('');
}

interface Sinks {
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

/** Write the outcome: exactly the object on stdout under `--json`; otherwise success to stdout and the rest to stderr. */
export function writeRetireOutcome(outcome: RetireOutcome, json: boolean, sinks: Sinks): void {
  if (json) {
    sinks.stdout.write(`${JSON.stringify(outcome)}\n`);
    return;
  }
  switch (outcome.kind) {
    case 'retired':
      sinks.stdout.write(
        `retired: ${outcome.branch} (on ${outcome.base.name}@${outcome.base.sha})\n${nameLines(outcome.names)}`,
      );
      return;
    case 'absent':
      sinks.stdout.write(
        `nothing to retire: ${outcome.branch} has no local, tracking or remote name\n`,
      );
      return;
    case 'refused':
      sinks.stderr.write(`merge-bot retire: refused: ${outcome.reason}\n`);
      return;
    case 'partial':
      sinks.stderr.write(
        `merge-bot retire: ${outcome.branch} partly retired: ${outcome.reason}\n${nameLines(outcome.names)}`,
      );
      return;
    case 'failed':
      sinks.stderr.write(`merge-bot retire: ${outcome.reason}\n`);
      return;
  }
}
