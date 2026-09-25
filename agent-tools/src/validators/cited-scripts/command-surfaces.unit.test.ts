import { describe, expect, it } from 'vitest';

import {
  findMissingFilteredCommands,
  linesOfCommandFile,
  scriptLinesOfManifest,
} from './command-surfaces.js';
import type { WorkspaceScripts } from './validate-cited-scripts-helpers.js';

/**
 * The commands a gate runs (package.json scripts, the git hooks, CI
 * workflow steps), read for filtered pnpm calls. A filter that names no
 * workspace makes pnpm exit 0 without running anything, so every such call
 * must name a real workspace and a script that workspace defines.
 */

const scripts: WorkspaceScripts = {
  root: new Set(['check']),
  workspaces: new Map([
    ['@jimcresswell/www', new Set(['test:e2e'])],
    ['@engraph/agent-tools', new Set(['repo-check'])],
  ]),
};

function surface(...lines: readonly string[]): {
  readonly path: string;
  readonly lines: ReturnType<typeof linesOfCommandFile>;
} {
  return { path: '.husky/pre-push', lines: linesOfCommandFile(lines.join('\n')) };
}

describe('linesOfCommandFile', () => {
  it('numbers every line from one', () => {
    expect(linesOfCommandFile('a\nb')).toStrictEqual([
      { line: 1, text: 'a' },
      { line: 2, text: 'b' },
    ]);
  });
});

describe('scriptLinesOfManifest', () => {
  it('reads each script with the line it is declared on', () => {
    const manifest = [
      '{',
      '  "name": "@jimcresswell/root",',
      '  "scripts": {',
      '    "e2e": "pnpm --filter @jimcresswell/www test:e2e",',
      '    "types": "tsc"',
      '  }',
      '}',
    ].join('\n');

    expect(scriptLinesOfManifest(manifest)).toStrictEqual([
      { line: 4, text: 'pnpm --filter @jimcresswell/www test:e2e' },
      { line: 5, text: 'tsc' },
    ]);
  });

  it('numbers a script by its own line, not an earlier key of the same name', () => {
    const manifest = [
      '{',
      '  "config": { "e2e": "headless" },',
      '  "scripts": {',
      '    "e2e": "pnpm --filter @jimcresswell/www test:e2e"',
      '  }',
      '}',
    ].join('\n');

    expect(scriptLinesOfManifest(manifest)).toStrictEqual([
      { line: 4, text: 'pnpm --filter @jimcresswell/www test:e2e' },
    ]);
  });

  it('reads nothing from a manifest without scripts', () => {
    expect(scriptLinesOfManifest('{ "name": "x" }')).toStrictEqual([]);
  });
});

describe('findMissingFilteredCommands', () => {
  it('passes a filtered call that names a real workspace and script, a semicolon included', () => {
    expect(
      findMissingFilteredCommands(
        [surface('if ! pnpm --filter @jimcresswell/www test:e2e; then')],
        scripts,
      ),
    ).toStrictEqual([]);
  });

  it('reports a filter that names no workspace, where it is', () => {
    const findings = findMissingFilteredCommands(
      [surface('', '        run: pnpm --filter @jimcresswell/wwwx test:e2e')],
      scripts,
    );

    expect(findings).toStrictEqual([
      {
        path: '.husky/pre-push',
        line: 2,
        match: 'pnpm --filter @jimcresswell/wwwx test:e2e',
        scriptName: 'test:e2e',
        scope: '@jimcresswell/wwwx',
        reason: 'unknown-workspace',
      },
    ]);
  });

  it('reports a script the filtered workspace does not define', () => {
    const findings = findMissingFilteredCommands(
      [surface('pnpm --filter @engraph/agent-tools gate-slot run pnpm check')],
      scripts,
    );

    expect(findings.map((finding) => [finding.scriptName, finding.reason])).toStrictEqual([
      ['gate-slot', 'missing-script'],
    ]);
  });

  it('reports a missing script that a semicolon closes, named without the semicolon', () => {
    const findings = findMissingFilteredCommands(
      [surface('if ! pnpm --filter @engraph/agent-tools nope; then')],
      scripts,
    );

    expect(findings.map((finding) => [finding.match, finding.reason])).toStrictEqual([
      ['pnpm --filter @engraph/agent-tools nope', 'missing-script'],
    ]);
  });

  it.each([
    { name: 'an unfiltered call, whose scope depends on where it runs', line: 'pnpm nope' },
    { name: 'a comment', line: '# pnpm --filter @nope/missing run-me' },
    { name: 'an echoed hint', line: `echo "Run 'pnpm --filter @nope/missing run-me'"` },
  ])('ignores $name', ({ line }) => {
    expect(findMissingFilteredCommands([surface(line)], scripts)).toStrictEqual([]);
  });
});
