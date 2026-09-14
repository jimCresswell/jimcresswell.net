import { z } from 'zod';

import { blockingRank, latestRunPerCheck } from './check-rollup.js';
import { classifyCheck, type ChecksSummary } from './index.js';
import type { NamedCheck } from './state-types.js';

/**
 * Boundary parser for the `pr state` view leg that the existing snapshot does
 * not carry: named per-check verdicts with the checks-green timestamp and
 * auto-merge intent. The review harvest and the review requests are parsed in
 * `harvest-fields.ts`, the `gh agent-task` shapes in `agent-task-fields.ts`.
 * Zod at the external boundary; misshapen input fails loud, while fields the
 * platform genuinely nulls normalise explicitly.
 */

// Superset of the pr-watch rollup schema: D1 additionally carries the check's
// NAME (CheckRun `name`, StatusContext `context`) — the #437 cure — and the
// CheckRun `completedAt` that anchors the checks-green timeout leg.
const namedRollupItemSchema = z
  .object({
    __typename: z.string(),
    name: z.string().optional(),
    context: z.string().optional(),
    workflowName: z.string().nullish(),
    status: z.string().optional(),
    conclusion: z.string().nullish(),
    state: z.string().optional(),
    completedAt: z.string().nullish(),
    startedAt: z.string().nullish(),
  })
  .loose();

const stateViewSchema = z.object({
  number: z.number(),
  url: z.string(),
  state: z.string(),
  // Drafts cannot merge via the sanctioned landing path — the verdict core
  // refuses them typed before any settlement read.
  isDraft: z.boolean(),
  mergeable: z.string(),
  mergeStateStatus: z.string(),
  headRefOid: z.string(),
  statusCheckRollup: z
    .array(namedRollupItemSchema)
    .nullish()
    .transform((value) => value ?? []),
  // Armed iff GitHub returns an auto-merge object; null/absent means unarmed.
  autoMergeRequest: z
    .object({})
    .loose()
    .nullish()
    .transform((value) => value !== null && value !== undefined),
});

/**
 * The exact `--json` field set the `pr state` gh call requests. Review
 * requests are deliberately NOT read here: gh's `reviewRequests` field (and
 * the REST endpoint beneath it) omits Bot requests, so a Copilot review in
 * flight read as "nobody requested" (verified live 2026-09-13, PR #60); the
 * GraphQL harvest carries them (`parseHarvest`).
 */
export const PR_STATE_VIEW_JSON_FIELDS = [
  'number',
  'url',
  'state',
  'isDraft',
  'mergeable',
  'mergeStateStatus',
  'headRefOid',
  'statusCheckRollup',
  'autoMergeRequest',
] as const;

/** The parsed `gh pr view` legs specific to `pr state`. */
export interface ParsedStateView {
  readonly number: number;
  readonly url: string;
  readonly state: string;
  readonly isDraft: boolean;
  readonly mergeable: string;
  readonly mergeStateStatus: string;
  readonly headRefOid: string;
  readonly checks: ChecksSummary;
  readonly namedChecks: readonly NamedCheck[];
  readonly checksGreenAt: string | null;
  readonly autoMergeArmed: boolean;
}

type NamedRollupItem = z.infer<typeof namedRollupItemSchema>;

function checkName(item: NamedRollupItem): string {
  return item.name ?? item.context ?? 'unnamed check';
}

function summarise(namedChecks: readonly NamedCheck[]): ChecksSummary {
  return {
    total: namedChecks.length,
    passed: namedChecks.filter((check) => check.bucket === 'passed').length,
    failed: namedChecks.filter((check) => check.bucket === 'failed').length,
    pending: namedChecks.filter((check) => check.bucket === 'pending').length,
  };
}

// Green means every check passed; the anchor is the LATEST timestamp any item
// reports — CheckRun `completedAt`, or StatusContext `startedAt` (its creation
// time; StatusContext has no completion timestamp). Null when the rollup is
// not green — or when ANY green item carries no timestamp: a max over the
// PRESENT timestamps can pre-date the unanchored item's green moment, so a
// partial anchor is unknown, not "latest known". A null anchor keeps the
// timeout leg conservatively un-fireable rather than firing off a wrong time.
function checksGreenAt(items: readonly NamedRollupItem[], summary: ChecksSummary): string | null {
  if (summary.total === 0 || summary.failed > 0 || summary.pending > 0) {
    return null;
  }
  const completions = items.map((item) => item.completedAt ?? item.startedAt ?? null);
  const present = completions
    .filter((value): value is string => value !== null)
    .sort((left, right) => left.localeCompare(right));
  if (present.length !== completions.length) {
    return null;
  }
  return present.at(-1) ?? null;
}

/**
 * Parse the extended `gh pr view --json` payload for `pr state`.
 *
 * @throws a ZodError when the payload is not the expected gh shape (strict
 *   validation at the external-input boundary).
 */
export function parseStateView(raw: unknown): ParsedStateView {
  const parsed = stateViewSchema.parse(raw);
  const liveChecks = latestRunPerCheck(parsed.statusCheckRollup, (item) =>
    blockingRank(classifyCheck(item)),
  );
  const namedChecks = liveChecks.map((item) => ({
    name: checkName(item),
    bucket: classifyCheck(item),
  }));
  const checks = summarise(namedChecks);
  return {
    number: parsed.number,
    url: parsed.url,
    state: parsed.state,
    isDraft: parsed.isDraft,
    mergeable: parsed.mergeable,
    mergeStateStatus: parsed.mergeStateStatus,
    headRefOid: parsed.headRefOid,
    checks,
    namedChecks,
    checksGreenAt: checksGreenAt(liveChecks, checks),
    autoMergeArmed: parsed.autoMergeRequest,
  };
}
