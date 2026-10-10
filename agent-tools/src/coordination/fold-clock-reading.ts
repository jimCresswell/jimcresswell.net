import { ok, type Result } from '@engraph/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import type { CheckRunReading, FoldClockReading, ReviewerEvent } from './fold-clock.js';

/**
 * The fold clock's read boundary: four GitHub surfaces parsed to the exact
 * shape the clock needs (`strict-validation-at-boundary`), each a pure
 * function of one JSON value. Shapes verified live on pull request 326,
 * 2026-10-10: the issue timeline carries `ready_for_review`,
 * `review_requested` (with `requested_reviewer.login` "Copilot", type
 * "Bot") and `reviewed` (with `user.login` "Copilot" and `submitted_at`),
 * so requests and reviews pair on the timeline's own logins; the REST
 * reviews list names the same reviewer `copilot-pull-request-reviewer[bot]`
 * and is not read. The branch rules name the required contexts; the
 * check-runs list on a commit carries each run's name, conclusion and
 * instants.
 */

const instant = z.iso.datetime();

const pullSchema = z.object({
  created_at: instant,
  merged_at: instant.nullable(),
  head: z.object({ sha: z.string().regex(/^[0-9a-f]{40}$/u) }),
  base: z.object({ ref: z.string().min(1) }),
});

export interface PullReading {
  readonly createdAt: string;
  readonly mergedAt: string | undefined;
  readonly headSha: string;
  readonly baseRef: string;
}

export function parsePull(value: unknown): Result<PullReading, Error> {
  const parsed = parseWithSchema({ label: 'fold-clock pull request', schema: pullSchema, value });
  if (!parsed.ok) {
    return parsed;
  }
  return ok({
    createdAt: parsed.value.created_at,
    mergedAt: parsed.value.merged_at ?? undefined,
    headSha: parsed.value.head.sha,
    baseRef: parsed.value.base.ref,
  });
}

const actorSchema = z.object({ login: z.string().min(1), type: z.string() });

const timelineItemSchema = z.object({
  event: z.string(),
  created_at: instant.nullish(),
  submitted_at: instant.nullish(),
  requested_reviewer: actorSchema.nullish(),
  user: actorSchema.nullish(),
});

/** `gh api --paginate --slurp` wraps the pages in one array. */
const timelineSchema = z.array(z.array(timelineItemSchema));

export interface TimelineReading {
  readonly readyMarks: readonly string[];
  readonly requests: readonly ReviewerEvent[];
  readonly reviews: readonly ReviewerEvent[];
}

type TimelineItem = z.output<typeof timelineItemSchema>;

function readyMark(item: TimelineItem): readonly string[] {
  return item.event === 'ready_for_review' && item.created_at != null ? [item.created_at] : [];
}

function botRequest(item: TimelineItem): readonly ReviewerEvent[] {
  const reviewer = item.requested_reviewer;
  if (item.event !== 'review_requested' || reviewer == null || item.created_at == null) {
    return [];
  }
  return reviewer.type === 'Bot' ? [{ at: item.created_at, login: reviewer.login }] : [];
}

function review(item: TimelineItem): readonly ReviewerEvent[] {
  if (item.event !== 'reviewed' || item.user == null || item.submitted_at == null) {
    return [];
  }
  return [{ at: item.submitted_at, login: item.user.login }];
}

export function parseTimeline(value: unknown): Result<TimelineReading, Error> {
  const parsed = parseWithSchema({ label: 'fold-clock timeline', schema: timelineSchema, value });
  if (!parsed.ok) {
    return parsed;
  }
  const items = parsed.value.flat();
  return ok({
    readyMarks: items.flatMap(readyMark),
    requests: items.flatMap(botRequest),
    reviews: items.flatMap(review),
  });
}

const rulesSchema = z.array(
  z.object({
    type: z.string(),
    parameters: z
      .object({
        required_status_checks: z.array(z.object({ context: z.string().min(1) })).optional(),
      })
      .optional(),
  }),
);

/** The contexts every `required_status_checks` rule on the branch names, in rule order. */
export function parseRequiredChecks(value: unknown): Result<readonly string[], Error> {
  const parsed = parseWithSchema({ label: 'fold-clock branch rules', schema: rulesSchema, value });
  if (!parsed.ok) {
    return parsed;
  }
  return ok(
    parsed.value
      .filter((rule) => rule.type === 'required_status_checks')
      .flatMap((rule) => rule.parameters?.required_status_checks ?? [])
      .map((check) => check.context),
  );
}

const checkRunsSchema = z.object({
  check_runs: z.array(
    z.object({
      name: z.string().min(1),
      conclusion: z.string().nullable(),
      started_at: instant.nullable(),
      completed_at: instant.nullable(),
    }),
  ),
});

export function parseCheckRuns(value: unknown): Result<readonly CheckRunReading[], Error> {
  const parsed = parseWithSchema({
    label: 'fold-clock check runs',
    schema: checkRunsSchema,
    value,
  });
  if (!parsed.ok) {
    return parsed;
  }
  return ok(
    parsed.value.check_runs.map((run) => ({
      name: run.name,
      conclusion: run.conclusion ?? undefined,
      startedAt: run.started_at ?? undefined,
      completedAt: run.completed_at ?? undefined,
    })),
  );
}

export interface AssembleReadingInput {
  readonly prNumber: number;
  readonly pull: PullReading;
  readonly timeline: TimelineReading;
  readonly requiredChecks: readonly string[];
  readonly headCheckRuns: readonly CheckRunReading[];
  readonly successor:
    { readonly sha: string; readonly checkRuns: readonly CheckRunReading[] } | undefined;
}

/** The validated surfaces as the clock's one reading. */
export function assembleReading(input: AssembleReadingInput): FoldClockReading {
  return {
    prNumber: input.prNumber,
    headSha: input.pull.headSha,
    createdAt: input.pull.createdAt,
    readyMarks: input.timeline.readyMarks,
    mergedAt: input.pull.mergedAt,
    requests: input.timeline.requests,
    reviews: input.timeline.reviews,
    requiredChecks: input.requiredChecks,
    headCheckRuns: input.headCheckRuns,
    successor: input.successor,
  };
}
