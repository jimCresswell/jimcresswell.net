import { describe, expect, it } from 'vitest';

import {
  extractScriptCitations,
  findMissingScriptCitations,
  type WorkspaceScripts,
} from './validate-cited-scripts-helpers.js';

const scripts: WorkspaceScripts = {
  root: new Set(['check', 'build', 'test', 'agent-tools:agent-identity']),
  workspaces: new Map([
    ['@jimcresswell/www', new Set(['test:e2e', 'logo:statusline'])],
    ['@engraph/agent-tools', new Set(['validate-markdown-links'])],
  ]),
};

describe('extractScriptCitations', () => {
  it('reads every line of a fenced block and only code spans outside it', () => {
    const content = [
      'Prose mentioning pnpm workspaces is not a command.',
      'Run `pnpm check` first.',
      '```bash',
      'pnpm build   # makes changes',
      'pnpm test',
      '```',
      'and pnpm outdated in prose is ignored too.',
    ].join('\n');

    expect(extractScriptCitations(content).map((c) => [c.line, c.scriptName])).toStrictEqual([
      [2, 'check'],
      [4, 'build'],
      [5, 'test'],
    ]);
  });

  it('carries the --filter target and skips run and pass-through flags', () => {
    const content = [
      '`pnpm --filter @jimcresswell/www test:e2e`',
      '`pnpm -F @engraph/agent-tools run validate-markdown-links`',
      '`pnpm --filter=@jimcresswell/www logo:statusline`',
      '`pnpm -s agent-tools:agent-identity --format display`',
    ].join('\n');

    expect(
      extractScriptCitations(content).map((c) => [c.scriptName, c.workspaceFilter]),
    ).toStrictEqual([
      ['test:e2e', '@jimcresswell/www'],
      ['validate-markdown-links', '@engraph/agent-tools'],
      ['logo:statusline', '@jimcresswell/www'],
      ['agent-tools:agent-identity', undefined],
    ]);
  });

  it.each([
    ['a pnpm built-in', '`pnpm install --frozen-lockfile`'],
    ['pnpm exec', '`pnpm exec tsx scripts/foo.ts`'],
    ['pnpm dlx', '`pnpm dlx create-thing`'],
    ['a placeholder name', '`pnpm <script>`'],
    ['a directory switch', '`pnpm -C jcdotnet build`'],
    ['a recursive run', '`pnpm -r build`'],
    ['a path filter', '`pnpm --filter ./jcdotnet build`'],
    ['a glob filter', '`pnpm --filter "@engraph/*" build`'],
    ['a placeholder filter', '`pnpm --filter <workspace> type-check`'],
    ['a bare pnpm at the end of a command', '`corepack enable pnpm`'],
    ['a colon-terminated word from quoted prose', '`"Lane <name> pnpm check: green"`'],
    ['a pnpm mention inside a shell comment', '```sh\n# the pnpm banner goes to stderr\n```'],
  ])('omits %s rather than guessing', (_label, content) => {
    expect(extractScriptCitations(content)).toStrictEqual([]);
  });

  it('reads a fenced command up to its trailing comment only', () => {
    const content = '```sh\npnpm check # then pnpm imaginary\n```';

    expect(extractScriptCitations(content).map((c) => c.scriptName)).toStrictEqual(['check']);
  });

  it('stops at a shell terminator and finds a second command after it', () => {
    const content = '`pnpm --filter @jimcresswell/www && pnpm check`';

    expect(extractScriptCitations(content).map((c) => c.scriptName)).toStrictEqual(['check']);
  });

  it('reports the command text and line of each citation', () => {
    const content = '```sh\n\n  pnpm run build --force\n```';

    expect(extractScriptCitations(content)).toStrictEqual([
      { line: 3, match: 'pnpm run build', scriptName: 'build' },
    ]);
  });
});

describe('findMissingScriptCitations', () => {
  it('returns no findings when every citation resolves', () => {
    const files = [
      {
        path: 'docs/a.md',
        content: 'Run `pnpm check` then `pnpm --filter @jimcresswell/www test:e2e`.',
      },
    ];

    expect(findMissingScriptCitations(files, scripts)).toStrictEqual([]);
  });

  it('reports a root citation of a script the root does not define', () => {
    const files = [{ path: '.agent/skills/x.md', content: '```bash\npnpm sdk-codegen\n```' }];

    expect(findMissingScriptCitations(files, scripts)).toStrictEqual([
      {
        path: '.agent/skills/x.md',
        line: 2,
        match: 'pnpm sdk-codegen',
        scriptName: 'sdk-codegen',
        scope: 'root',
        reason: 'missing-script',
      },
    ]);
  });

  it('reports a workspace citation of a script that workspace does not define', () => {
    const files = [{ path: 'docs/a.md', content: '`pnpm --filter @jimcresswell/www test:widget`' }];

    expect(
      findMissingScriptCitations(files, scripts).map((f) => [f.scope, f.reason]),
    ).toStrictEqual([['@jimcresswell/www', 'missing-script']]);
  });

  it('reports a filter that names no workspace', () => {
    const files = [{ path: 'docs/a.md', content: '`pnpm --filter @engraph/jc-widget build`' }];

    expect(
      findMissingScriptCitations(files, scripts).map((f) => [f.scope, f.reason]),
    ).toStrictEqual([['@engraph/jc-widget', 'unknown-workspace']]);
  });
});
