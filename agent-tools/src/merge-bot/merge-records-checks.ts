import { err, ok, type Result } from '@engraph/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { isBranchName, parseRequiredChecks } from '../pr-watch/required-checks.js';
import type { NamedCheck, PrStateReading, PrVerdict } from '../pr-watch/state-types.js';
import { computePrVerdict } from '../pr-watch/states.js';
import { classifyChangedPaths, type ChangeClass } from './change-class.js';
import { classWhenItDecides, listChangedPaths } from './merge-changed-files.js';
import { GITHUB_API } from './merge-github-api.js';
import {
  githubHeaders,
  readJsonBody,
  sendGithubRequest,
  type GithubApiFetch,
} from './mint-installation-token.js';
import type { BotIdentity } from './resolve-identity.js';

/**
 * "Checks green by name" for the records class. The verdict core holds
 * CHECKS-RUNNING on ANY pending check run, and a vendor's review runs as a
 * check run on the tip for the whole round (`copilot-pull-request-reviewer`
 * on 326's tip, 2026-10-10), so a records-class pull request with the
 * review requested at its ready-mark would wait the whole round under the
 * unqualified verdict — the cost the owner's ruling of 2026-09-03 removes.
 * The fold skill's full condition is exactly the contexts the base branch's
 * rules require, read at run time, and no other name: for a records-class
 * reading this module sets aside every PENDING check the rules do not
 * require and recomputes the verdict. A FAILED check of any name still
 * holds (a secret scan or a dependency review is information the merge must
 * not outrun), and a required context the tip has not reported yet is
 * pending by construction. The code class is untouched: every live check
 * binds it as before. The reads here (the pull request's base, the branch's
 * rules, then the files only when the narrowing would move the verdict) run
 * once per poll on CHECKS-RUNNING; a failure leaves the verdict as read with
 * the reason in its evidence, never ending the poll.
 */

interface RulesTarget {
  readonly identity: BotIdentity;
  readonly prNumber: number;
}

const pullBaseSchema = z.object({ base: z.object({ ref: z.string().min(1) }) });

async function readJson(
  fetchImpl: GithubApiFetch,
  token: string,
  url: string,
  surface: string,
): Promise<Result<unknown, Error>> {
  const sent = await sendGithubRequest(
    fetchImpl,
    url,
    { method: 'GET', headers: githubHeaders(token) },
    surface,
  );
  if (!sent.ok) {
    return sent;
  }
  if (sent.value.status !== 200) {
    return err(new Error(`${surface} answered ${sent.value.status}`));
  }
  return readJsonBody(sent.value, surface);
}

/** The base branch's required contexts: the pull request's base ref, then that branch's rules. */
async function readRequiredContexts(
  fetchImpl: GithubApiFetch,
  token: string,
  target: RulesTarget,
): Promise<Result<readonly string[], Error>> {
  const repo = `${GITHUB_API}/repos/${target.identity.owner}/${target.identity.repoName}`;
  const pull = await readJson(
    fetchImpl,
    token,
    `${repo}/pulls/${target.prNumber}`,
    'base ref read',
  );
  if (!pull.ok) {
    return pull;
  }
  const base = parseWithSchema({
    label: 'pull request base',
    schema: pullBaseSchema,
    value: pull.value,
  });
  if (!base.ok) {
    return base;
  }
  const ref = base.value.base.ref;
  if (!isBranchName(ref)) {
    return err(new Error(`the base ref '${ref}' is not a branch name`));
  }
  const rules = await readJson(
    fetchImpl,
    token,
    `${repo}/rules/branches/${encodeURIComponent(ref)}`,
    'branch rules read',
  );
  return rules.ok ? parseRequiredChecks(rules.value) : rules;
}

export interface NarrowedReading {
  readonly reading: PrStateReading;
  /** The pending, non-required checks set aside, by name. */
  readonly setAside: readonly string[];
}

/** The reading with pending non-required checks set aside and absent required contexts pending. */
export function narrowToRequired(
  reading: PrStateReading,
  required: readonly string[],
): NarrowedReading {
  const requiredSet = new Set(required);
  const kept = reading.namedChecks.filter(
    (check) => check.bucket !== 'pending' || requiredSet.has(check.name),
  );
  const reported = new Set(reading.namedChecks.map((check) => check.name));
  const absent: readonly NamedCheck[] = required
    .filter((name) => !reported.has(name))
    .map((name) => ({ name, bucket: 'pending' }));
  const namedChecks = [...kept, ...absent];
  const setAside = reading.namedChecks
    .filter((check) => check.bucket === 'pending' && !requiredSet.has(check.name))
    .map((check) => check.name);
  const count = (bucket: NamedCheck['bucket']): number =>
    namedChecks.filter((check) => check.bucket === bucket).length;
  return {
    setAside,
    reading: {
      ...reading,
      namedChecks,
      checks: {
        total: namedChecks.length,
        passed: count('passed'),
        failed: count('failed'),
        pending: count('pending'),
      },
    },
  };
}

export interface ResolvedVerdict {
  readonly verdict: PrVerdict;
  readonly changeClass: ChangeClass | undefined;
}

interface ResolveInput {
  readonly reading: PrStateReading;
  readonly nowIso: string;
  readonly fetchImpl: GithubApiFetch;
  readonly token: string;
  readonly target: RulesTarget;
}

function withNote(verdict: PrVerdict, note: string): PrVerdict {
  return { state: verdict.state, evidence: [...verdict.evidence, note] };
}

/**
 * The verdict recomputed over the required contexts, when the rules can be
 * read and the narrowing moves it; otherwise the verdict as read, with the
 * reason the narrowing did not apply when a read failed. A failed read here
 * never ends a poll: CHECKS-RUNNING is a wait state, the next poll reads
 * again, and the note keeps a persistent failure visible on every poll.
 */
async function narrowedVerdict(
  input: ResolveInput,
  verdict: PrVerdict,
): Promise<{ readonly verdict: PrVerdict; readonly moved: boolean }> {
  const required = await readRequiredContexts(input.fetchImpl, input.token, input.target);
  if (!required.ok) {
    return {
      verdict: withNote(
        verdict,
        `records-class narrowing unavailable this poll: ${required.error.message}`,
      ),
      moved: false,
    };
  }
  const narrowed = narrowToRequired(input.reading, required.value);
  if (required.value.length === 0 || narrowed.setAside.length === 0) {
    return { verdict, moved: false };
  }
  const recomputed = computePrVerdict(narrowed.reading, input.nowIso);
  const note =
    `records-class: ${narrowed.setAside.length} pending check(s) the base branch's rules do not ` +
    `require set aside (${narrowed.setAside.join(', ')}); required contexts ${required.value.join(', ')}`;
  return { verdict: withNote(recomputed, note), moved: recomputed.state !== 'CHECKS-RUNNING' };
}

/**
 * CHECKS-RUNNING: read the rules first (two cheap reads), and only when the
 * narrowing would move the verdict read the files — so a code-class pull
 * request waiting on its own required checks pays no files read per poll,
 * and a code-class pull request waiting only on the vendor's run keeps the
 * verdict as read.
 */
async function resolveChecksRunning(
  input: ResolveInput,
  verdict: PrVerdict,
): Promise<ResolvedVerdict> {
  const narrowed = await narrowedVerdict(input, verdict);
  if (!narrowed.moved) {
    return { verdict: narrowed.verdict, changeClass: undefined };
  }
  const paths = await listChangedPaths(input.fetchImpl, input.token, input.target);
  if (!paths.ok) {
    return {
      verdict: withNote(
        verdict,
        `records-class narrowing unavailable this poll: ${paths.error.message}`,
      ),
      changeClass: undefined,
    };
  }
  const changeClass = classifyChangedPaths(paths.value);
  return changeClass.kind === 'records'
    ? { verdict: narrowed.verdict, changeClass }
    : { verdict, changeClass };
}

/**
 * The verdict and the class together: the verdict as the core reads it; the
 * class read only where it decides; and, for a reading held at
 * CHECKS-RUNNING, the verdict recomputed over the required contexts when the
 * diff is records-class.
 */
export async function resolveVerdict(input: ResolveInput): Promise<Result<ResolvedVerdict, Error>> {
  const verdict = computePrVerdict(input.reading, input.nowIso);
  if (verdict.state === 'CHECKS-RUNNING') {
    return ok(await resolveChecksRunning(input, verdict));
  }
  const changeClass = await classWhenItDecides(verdict, input.fetchImpl, input.token, input.target);
  return changeClass.ok ? ok({ verdict, changeClass: changeClass.value }) : changeClass;
}
