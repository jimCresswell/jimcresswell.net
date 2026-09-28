import { spawnSync } from 'node:child_process';

import { z } from 'zod';

import type { GithubApiFetch } from '../src/merge-bot/mint-installation-token';

import { GIT, git, refAt, SMOKE_TOKEN, type RetireRig } from './merge-bot-retire-fixture';

/**
 * GitHub, for the `merge-bot retire` smokes: a double of its documented
 * GraphQL contract, applied to the bare repository. The read answers the
 * bare ref, and the bare HEAD as the default branch with its tip;
 * `updateRefs` applies `afterOid` only when `beforeOid` matches, and answers
 * a generic error otherwise (the behaviour the `branch-retire` scope row's
 * live probe recorded). Its options depart from the contract on purpose, to
 * prove the command's fail-secure paths.
 */

/** How the GitHub double departs from the documented contract, to prove the command's fail-secure paths. */
export interface GithubDoubleOptions {
  /** Runs when a token is minted, before GitHub answers. */
  readonly onMint?: () => void;
  /** Answer the mint with a 500. */
  readonly failMint?: boolean;
  /** `updateRefs` answers success and changes nothing, or deletes and then answers an error. */
  readonly updateRefs?: 'contract' | 'accepts-without-deleting' | 'errors-after-deleting';
  /** Answer the Nth GraphQL call (1-based) with a GraphQL error instead. */
  readonly failGraphqlCall?: number;
}

const ZERO_OID = '0'.repeat(40);
const GRAPHQL_ERROR = { errors: [{ message: 'Something went wrong while executing your query' }] };

const graphqlDocument = z.object({
  query: z.string(),
  variables: z.object({
    ref: z.string(),
    before: z.string().optional(),
    after: z.string().optional(),
  }),
});

/** The repository read: its id, its default branch and tip, and the asked ref, from the bare repository. */
function answerRead(rig: RetireRig, ref: string): unknown {
  const head = git(rig, rig.origin, 'symbolic-ref', 'HEAD');
  const headSha = refAt(rig, rig.origin, head);
  const current = refAt(rig, rig.origin, ref);
  return {
    data: {
      repository: {
        id: 'R_1',
        defaultBranchRef:
          headSha === undefined
            ? null
            : { name: head.replace('refs/heads/', ''), target: { oid: headSha } },
        ref: current === undefined ? null : { target: { oid: current } },
      },
    },
  };
}

/** `updateRefs` with `beforeOid` and `afterOid`, applied to the bare repository as the options say. */
function answerUpdate(
  rig: RetireRig,
  variables: z.infer<typeof graphqlDocument>['variables'],
  mode: GithubDoubleOptions['updateRefs'],
): unknown {
  const { ref, before, after } = variables;
  const current = refAt(rig, rig.origin, ref);
  if (current === undefined || current !== before || after === undefined) {
    return GRAPHQL_ERROR;
  }
  if (mode === 'accepts-without-deleting') {
    return { data: { updateRefs: { clientMutationId: null } } };
  }
  const update =
    after === ZERO_OID ? ['update-ref', '-d', ref, current] : ['update-ref', ref, after, current];
  spawnSync(GIT, update, { cwd: rig.origin, env: rig.env });
  return mode === 'errors-after-deleting'
    ? GRAPHQL_ERROR
    : { data: { updateRefs: { clientMutationId: null } } };
}

/**
 * GitHub as a double of its GraphQL contract, applied to the bare
 * repository. It records no calls: every smoke reads the refs git holds
 * afterwards, and `mints()` counts tokens issued, an external effect.
 */
export function fakeGithub(
  rig: RetireRig,
  options: GithubDoubleOptions = {},
): { readonly fetchImpl: GithubApiFetch; readonly mints: () => number } {
  let mints = 0;
  let graphqlCalls = 0;
  const reply = (status: number, body: unknown): ReturnType<GithubApiFetch> =>
    Promise.resolve({ status, json: () => Promise.resolve(body) });
  const fetchImpl: GithubApiFetch = (url, init) => {
    if (url.endsWith('/installation')) {
      return reply(200, { id: 55 });
    }
    if (url.endsWith('/access_tokens')) {
      if (options.failMint === true) {
        return reply(500, { message: 'Server Error' });
      }
      mints += 1;
      options.onMint?.();
      return reply(201, { token: SMOKE_TOKEN, expires_at: '2026-09-28T15:00:00Z' });
    }
    graphqlCalls += 1;
    if (graphqlCalls === options.failGraphqlCall) {
      return reply(200, GRAPHQL_ERROR);
    }
    const document = graphqlDocument.parse(JSON.parse(init.body ?? '{}'));
    return reply(
      200,
      document.query.includes('updateRefs')
        ? answerUpdate(rig, document.variables, options.updateRefs)
        : answerRead(rig, document.variables.ref),
    );
  };
  return { fetchImpl, mints: () => mints };
}
