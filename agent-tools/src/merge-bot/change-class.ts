/**
 * The change class of a pull request, computed from its changed paths and
 * never declared by a seat.
 *
 * The owner's ruling of 2026-09-03 ("Change the merge policy instead") gives a
 * bot-authored pull request that touches only documentation and Practice
 * surfaces its merge at checks green with zero unresolved threads, no vendor
 * leg waited on; the retrospective of 2026-10-10 priced the synchronous round
 * every such fold was paying while the door knew one verdict. The lifetime
 * rule's test decides the other class: "is this code?" — source, workflows,
 * hooks, config-as-code, anything executable or CI-affecting. A Markdown file
 * is never executed by the estate's CI, so the records class is Markdown under
 * the documentation and Practice roots (the platform adapter directories hold
 * generated Markdown pointers), outside any directory whose Markdown a test or
 * a hook reads as an input. Everything else is code-class, conservatively: a
 * records fold that carries one code path keeps the SETTLE-READY door.
 */

const MARKDOWN_SUFFIX = '.md';

/** The top-level directories whose Markdown is documentation or Practice prose. */
const RECORDS_ROOTS: ReadonlySet<string> = new Set([
  '.agent',
  'docs',
  'linkedin',
  '.claude',
  '.codex',
  '.cursor',
  '.gemini',
  '.agents',
]);

/** Path segments under which Markdown is an input to code (fixtures, hooks, schemas), never prose. */
const CODE_SEGMENTS: ReadonlySet<string> = new Set([
  'hooks',
  'schemas',
  'setup',
  'src',
  'tests',
  'test',
  'fixtures',
  '__snapshots__',
  'e2e-tests',
]);

const OFFENDERS_NAMED = 5;

export type ChangeClass =
  | { readonly kind: 'records'; readonly pathCount: number }
  | { readonly kind: 'code'; readonly offenders: readonly string[] };

/** The policy in one sentence, for usage text and the merge report. */
export const RECORDS_CLASS_DESCRIPTION =
  'records-class: every changed path is a Markdown file at the repository root or under ' +
  '.agent, docs, linkedin or a platform adapter directory (.claude, .codex, .cursor, .gemini, ' +
  '.agents), outside any hooks, schemas, setup, src, tests, fixtures, snapshots or end-to-end ' +
  'directory';

function hasOnlyPlainSegments(segments: readonly string[]): boolean {
  return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..');
}

/** Whether one repository-relative path is documentation or Practice prose by the policy above. */
export function isRecordsPath(path: string): boolean {
  if (!path.endsWith(MARKDOWN_SUFFIX)) {
    return false;
  }
  const segments = path.split('/');
  if (!hasOnlyPlainSegments(segments)) {
    return false;
  }
  if (segments.length === 1) {
    return true;
  }
  if (!RECORDS_ROOTS.has(segments[0] ?? '')) {
    return false;
  }
  return !segments.slice(1, -1).some((segment) => CODE_SEGMENTS.has(segment));
}

/**
 * Classify a pull request by every path it changes (a rename contributes both
 * names). An empty set is code-class: absence of evidence is never prose.
 */
export function classifyChangedPaths(paths: readonly string[]): ChangeClass {
  const offenders = paths.filter((path) => !isRecordsPath(path));
  if (paths.length === 0 || offenders.length > 0) {
    return { kind: 'code', offenders };
  }
  return { kind: 'records', pathCount: paths.length };
}

/** The first few code-class paths for a refusal reason, the rest counted. */
export function describeOffenders(offenders: readonly string[]): string {
  const named = offenders.slice(0, OFFENDERS_NAMED).join(', ');
  const rest = offenders.length - OFFENDERS_NAMED;
  return rest > 0 ? `${named} and ${rest} more` : named;
}
