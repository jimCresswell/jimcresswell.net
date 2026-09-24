/**
 * Behavioural contract for the workspace-config-isolation helpers.
 *
 * Every fixture is an inline string, never a committed file: a fixture
 * file named like a real config would itself be scanned by the gate it
 * proves (and exempting it would weaken the gate — forbidden). Each
 * suite carries the red-proof: the check demonstrably FIRES on the
 * violation class before it guards anything.
 */

import { describe, expect, it } from 'vitest';

import { findConfigEscapes } from './containment.js';
import { classifyTurboRootInput, scanTurboRootInputs } from './turbo-inputs.js';
import {
  expandWorkspaceGlobs,
  isDegenerateScan,
  isWorkspaceConfigFile,
  resolveOwner,
} from './workspace-topology.js';

describe('isWorkspaceConfigFile', () => {
  it('matches the vitest config family at any suffix depth', () => {
    expect(isWorkspaceConfigFile('tooling/result/vitest.config.ts')).toBe(true);
    expect(isWorkspaceConfigFile('agent-tools/vitest.e2e.config.ts')).toBe(true);
    expect(isWorkspaceConfigFile('agent-tools/vitest.synthetic-suffix.config.ts')).toBe(true);
    expect(isWorkspaceConfigFile('agent-tools/vitest.synthetic.two-deep.config.ts')).toBe(true);
  });

  it('matches tsup and eslint configs across extensions', () => {
    expect(isWorkspaceConfigFile('tooling/result/tsup.config.ts')).toBe(true);
    expect(isWorkspaceConfigFile('jcdotnet/eslint.config.ts')).toBe(true);
    expect(isWorkspaceConfigFile('eslint.runtime-only.config.mjs')).toBe(true);
  });

  it('rejects non-config sources, declarations, and other tools', () => {
    expect(isWorkspaceConfigFile('tooling/result/src/index.ts')).toBe(false);
    expect(isWorkspaceConfigFile('tooling/result/vitest.config.d.ts')).toBe(false);
    expect(isWorkspaceConfigFile('commitlint.config.mjs')).toBe(false);
    expect(isWorkspaceConfigFile('knip.config.ts')).toBe(false);
    expect(isWorkspaceConfigFile('jcdotnet/postcss.config.mjs')).toBe(false);
  });
});

describe('expandWorkspaceGlobs', () => {
  const tracked = [
    'agent-tools/package.json',
    'jcdotnet/package.json',
    'tooling/result/package.json',
    'tooling/safe-path/package.json',
    'tooling/safe-path/src/index.ts',
    'fixtures/nested/member/package.json',
    'fixtures/nested/member/deeper/package.json',
  ];

  it('keeps literal members and expands star globs to package.json holders', () => {
    const dirs = expandWorkspaceGlobs(['agent-tools', 'jcdotnet', 'tooling/*'], tracked);

    expect(dirs).toEqual(['agent-tools', 'jcdotnet', 'tooling/result', 'tooling/safe-path']);
  });

  it('keeps nested members whose parents are not members', () => {
    const dirs = expandWorkspaceGlobs(['fixtures/nested/member'], tracked);

    expect(dirs).toEqual(['fixtures/nested/member']);
  });

  it('expands a star glob exactly one level under a multi-segment prefix', () => {
    const dirs = expandWorkspaceGlobs(['fixtures/nested/*'], tracked);

    expect(dirs).toEqual(['fixtures/nested/member']);
  });
});

describe('resolveOwner', () => {
  const workspaces = ['agent-tools', 'tooling/result', 'tooling/result/fixtures/nested-member'];

  it('picks the longest matching workspace prefix, whatever the member order', () => {
    const file = 'tooling/result/fixtures/nested-member/vitest.config.ts';

    expect(resolveOwner(workspaces, file)).toBe('tooling/result/fixtures/nested-member');
    expect(resolveOwner([...workspaces].reverse(), file)).toBe(
      'tooling/result/fixtures/nested-member',
    );
    expect(resolveOwner(workspaces, 'tooling/result/tsup.config.ts')).toBe('tooling/result');
  });

  it('assigns the repo root to files outside every workspace', () => {
    expect(resolveOwner(workspaces, 'eslint.runtime-only.config.mjs')).toBe('');
  });

  it('does not treat a sibling name prefix as containment', () => {
    expect(resolveOwner(['tooling/result'], 'tooling/result-extras/tsup.config.ts')).toBe('');
  });
});

describe('findConfigEscapes — static specifiers are the resolver’s job', () => {
  it('does not scan static import specifiers (dependency-cruiser owns them)', () => {
    const { escapes, unanalysable } = findConfigEscapes({
      file: 'tooling/result/vitest.config.ts',
      owner: 'tooling/result',
      content:
        "import { baseTestConfig } from '@engraph/workspace-config/vitest';\n" +
        "import { helper } from './src/helper.js';\n",
    });

    expect(escapes).toEqual([]);
    expect(unanalysable).toEqual([]);
  });
});

describe('findConfigEscapes — path arithmetic', () => {
  it('fires on an import.meta.url resolve that leaves the workspace', () => {
    const { escapes } = findConfigEscapes({
      file: 'tooling/result/vitest.config.ts',
      owner: 'tooling/result',
      content:
        "setupFiles: [resolve(dirname(fileURLToPath(import.meta.url)), '../workspace-config/src/no-network.setup.ts')],\n",
    });

    expect(escapes).toHaveLength(1);
    expect(escapes[0]?.resolved).toBe('tooling/workspace-config/src/no-network.setup.ts');
  });

  it('fires on an absolute target, which runtime resolve would escape to directly', () => {
    const { escapes } = findConfigEscapes({
      file: 'tooling/result/vitest.config.ts',
      owner: 'tooling/result',
      content:
        "setupFiles: [resolve(dirname(fileURLToPath(import.meta.url)), '/etc/outside.ts')],\n",
    });

    expect(escapes).toHaveLength(1);
    expect(escapes[0]?.resolved).toBe('/etc/outside.ts');
  });

  it('passes an import.meta.url resolve that stays inside the workspace', () => {
    const { escapes } = findConfigEscapes({
      file: 'tooling/workspace-config/tsup.config.ts',
      owner: 'tooling/workspace-config',
      content:
        "setupFiles: [resolve(dirname(fileURLToPath(import.meta.url)), 'src/no-network.setup.ts')],\n",
    });

    expect(escapes).toEqual([]);
  });
});

describe('findConfigEscapes — comments are not code', () => {
  it('ignores import() mentioned in line and block comments', () => {
    const { escapes, unanalysable } = findConfigEscapes({
      file: 'tooling/type-helpers/eslint.config.ts',
      owner: 'tooling/type-helpers',
      content:
        '// JSDoc `@type {import(...)}` is the typing mechanism for a plain-JS\n' +
        '/* block comments may also mention import("anything") freely */\n',
    });

    expect(escapes).toEqual([]);
    expect(unanalysable).toEqual([]);
  });

  it('ignores a commented-out path-arithmetic escape', () => {
    const { escapes } = findConfigEscapes({
      file: 'tooling/result/vitest.config.ts',
      owner: 'tooling/result',
      content:
        '// setupFiles: [resolve(dirname(fileURLToPath(import.meta.url)), ' +
        "'../workspace-config/src/no-network.setup.ts')],\n",
    });

    expect(escapes).toEqual([]);
  });

  it('still fires on code that precedes a trailing comment', () => {
    const { escapes } = findConfigEscapes({
      file: 'tooling/result/vitest.config.ts',
      owner: 'tooling/result',
      content:
        'const setup = resolve(dirname(fileURLToPath(import.meta.url)), ' +
        "'../workspace-config/src/no-network.setup.ts'); // cross-workspace reach\n",
    });

    expect(escapes).toHaveLength(1);
  });
});

describe('isDegenerateScan', () => {
  it('refuses a zero-workspace scan (the manifest-tidy red-proof)', () => {
    expect(isDegenerateScan({ workspaceCount: 0, configFileCount: 1 })).toBe(true);
  });

  it('refuses a zero-config-file scan (the family-rename red-proof)', () => {
    expect(isDegenerateScan({ workspaceCount: 1, configFileCount: 0 })).toBe(true);
  });

  it('passes a populated scan set', () => {
    expect(isDegenerateScan({ workspaceCount: 1, configFileCount: 1 })).toBe(false);
  });
});

describe('findConfigEscapes — unanalysable constructs fail loud', () => {
  it('flags a non-literal dynamic import', () => {
    const { unanalysable } = findConfigEscapes({
      file: 'tooling/result/tsup.config.ts',
      owner: 'tooling/result',
      content: 'const mod = await import(configPath);\n',
    });

    expect(unanalysable).toHaveLength(1);
    expect(unanalysable[0]?.line).toBe(1);
  });

  it('flags an import.meta.url resolve whose target is not a literal', () => {
    const { unanalysable } = findConfigEscapes({
      file: 'tooling/result/vitest.config.ts',
      owner: 'tooling/result',
      content: 'setupFiles: [resolve(dirname(fileURLToPath(import.meta.url)), setupPath)],\n',
    });

    expect(unanalysable).toHaveLength(1);
  });
});

describe('classifyTurboRootInput — the pinned turbo-glob matcher', () => {
  const tracked = [
    'tsconfig.base.json',
    'fixtures/nested/pnpm-workspace.yaml',
    'fixtures/nested/.github/workflows/check.yml',
    'fixtures/nested/member/lib/cli.ts',
    'tooling/result/src/index.ts',
  ];

  it('reports a positive glob with zero tracked matches as dead (the red-proof)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/fixtures/nested/**/*.cjs', tracked)).toEqual({
      kind: 'dead',
    });
  });

  it('matches zero intermediate segments under ** (dry-run-pinned)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/fixtures/nested/**/*.yaml', tracked)).toEqual({
      kind: 'alive',
    });
  });

  it('matches dot-directory segments (turbo hashes dotfiles; JS glob defaults do not)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/fixtures/nested/**/*.yml', tracked)).toEqual({
      kind: 'alive',
    });
  });

  it('matches any depth under a trailing double-star', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/tooling/**', tracked)).toEqual({ kind: 'alive' });
  });

  it('does not let a single star cross a path separator', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/fixtures/*.ts', tracked)).toEqual({
      kind: 'dead',
    });
  });

  it('treats a literal dot as literal, never regex any-char', () => {
    expect(
      classifyTurboRootInput('$TURBO_ROOT$/fixtures/nested/member/lib/*.ts', [
        'fixtures/nested/member/lib/cliXts',
      ]),
    ).toEqual({ kind: 'dead' });
  });

  it('matches exactly one non-slash character per question mark', () => {
    expect(
      classifyTurboRootInput('$TURBO_ROOT$/tsconfig?base.json', ['tsconfigXbase.json']),
    ).toEqual({
      kind: 'alive',
    });
    expect(
      classifyTurboRootInput('$TURBO_ROOT$/tsconfig?base.json', ['tsconfig/base.json']),
    ).toEqual({
      kind: 'dead',
    });
  });

  it('resolves literal entries through the same tracked set as globs', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/tsconfig.base.json', tracked)).toEqual({
      kind: 'alive',
    });
    expect(classifyTurboRootInput('$TURBO_ROOT$/vitest.config.ts', tracked)).toEqual({
      kind: 'dead',
    });
  });

  it('treats a literal naming a tracked DIRECTORY as alive (turbo walks it — probe-measured)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/fixtures/nested/member', tracked)).toEqual({
      kind: 'alive',
    });
    expect(classifyTurboRootInput('$TURBO_ROOT$/missing-directory', tracked)).toEqual({
      kind: 'dead',
    });
  });

  it('treats the bare repository root as the directory it names (probe-measured)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/', tracked)).toEqual({ kind: 'alive' });
    expect(classifyTurboRootInput('$TURBO_ROOT$/', [])).toEqual({ kind: 'dead' });
  });

  it('treats a trailing-slash directory literal like the bare form (turbo walks both — probe-measured)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/fixtures/nested/member/', tracked)).toEqual({
      kind: 'alive',
    });
    expect(classifyTurboRootInput('$TURBO_ROOT$/missing-directory/', tracked)).toEqual({
      kind: 'dead',
    });
  });

  it('refuses embedded double-stars, which turbo normalises rather than treating as two stars', () => {
    const trailing = classifyTurboRootInput('$TURBO_ROOT$/fixtures/a**', tracked);
    expect(trailing.kind).toBe('unsupported');
    expect(trailing.kind === 'unsupported' && trailing.reason).toContain('double-star');

    const leading = classifyTurboRootInput('$TURBO_ROOT$/**f/x.ts', tracked);
    expect(leading.kind).toBe('unsupported');
  });

  it('exempts negated inputs entirely, including negations carrying unsupported syntax', () => {
    expect(classifyTurboRootInput('!$TURBO_ROOT$/tooling/result/dist/**', tracked)).toEqual({
      kind: 'exempt',
    });
    expect(classifyTurboRootInput('!$TURBO_ROOT$/**/{dist,coverage}/**', tracked)).toEqual({
      kind: 'exempt',
    });
  });

  it('refuses brace and extglob syntax by naming the token (the refusal red-proof)', () => {
    const brace = classifyTurboRootInput('$TURBO_ROOT$/tooling/{result,safe-path}/**', tracked);
    expect(brace.kind).toBe('unsupported');
    expect(brace.kind === 'unsupported' && brace.reason).toContain('{');

    const extglob = classifyTurboRootInput('$TURBO_ROOT$/tooling/+(result|safe-path)/**', tracked);
    expect(extglob.kind).toBe('unsupported');
  });

  it('refuses a $TURBO_ROOT$ occurrence outside leading prefix form', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$', tracked).kind).toBe('unsupported');
    expect(classifyTurboRootInput('tooling/$TURBO_ROOT$/x.ts', tracked).kind).toBe('unsupported');
  });

  it('refuses a repeated $TURBO_ROOT$ macro instead of misreading it as a dead literal', () => {
    const repeated = classifyTurboRootInput('$TURBO_ROOT$/foo/$TURBO_ROOT$/bar', tracked);
    expect(repeated.kind).toBe('unsupported');
    expect(repeated.kind === 'unsupported' && repeated.reason).toContain('repeated');
  });
});

describe('classifyTurboRootInput — separator and spelling truth cures', () => {
  const tracked = [
    'tsconfig.base.json',
    'fixtures/nested/pnpm-workspace.yaml',
    'fixtures/nested/.github/workflows/check.yml',
    'fixtures/nested/member/lib/cli.ts',
    'tooling/result/src/index.ts',
  ];

  it('refuses a backslash whether the entry reads as a literal or as a glob (the refusal red-proof)', () => {
    // turbo reads `\` as a glob ESCAPE (measured, 2.10.9, 2026-08-11):
    // an invalid escape rejects the WHOLE config as a bad pattern, and
    // the measured valid escape (`stdout-epipe\.ts`, in the lineage repository) was
    // accepted yet resolved ZERO files. Neither arm of the pinned
    // matcher reproduces either behaviour, so the entry refuses.
    const literalArm = classifyTurboRootInput(String.raw`$TURBO_ROOT$/a\b.ts`, [
      String.raw`a\b.ts`,
    ]);
    expect(literalArm.kind).toBe('unsupported');
    expect(literalArm.kind === 'unsupported' && literalArm.reason).toContain('\\');

    const globArm = classifyTurboRootInput(String.raw`$TURBO_ROOT$/a\b/*.ts`, [
      String.raw`a\b/x.ts`,
    ]);
    expect(globArm.kind).toBe('unsupported');
    expect(globArm.kind === 'unsupported' && globArm.reason).toContain('\\');
  });

  it('normalises interior doubled separators as turbo does (dry-run-pinned), literal and glob entries alike', () => {
    expect(
      classifyTurboRootInput('$TURBO_ROOT$/agent-tools//package.json', [
        'agent-tools/package.json',
      ]),
    ).toEqual({ kind: 'alive' });
    expect(
      classifyTurboRootInput('$TURBO_ROOT$/agent-tools/src//bin/*.ts', [
        'agent-tools/src/bin/x.ts',
      ]),
    ).toEqual({ kind: 'alive' });
  });

  it('normalises single-dot segments as turbo does (dry-run-pinned), in every position', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/./package.json', ['package.json'])).toEqual({
      kind: 'alive',
    });
    expect(
      classifyTurboRootInput('$TURBO_ROOT$/agent-tools/./tsconfig.json', [
        'agent-tools/tsconfig.json',
      ]),
    ).toEqual({ kind: 'alive' });
    expect(
      classifyTurboRootInput('$TURBO_ROOT$/agent-tools/./src/*.ts', ['agent-tools/src/x.ts']),
    ).toEqual({ kind: 'alive' });
  });

  it('treats a bare dot remainder as the repository root (turbo resolved the whole repo — dry-run-pinned)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/.', tracked)).toEqual({ kind: 'alive' });
    expect(classifyTurboRootInput('$TURBO_ROOT$/.', [])).toEqual({ kind: 'dead' });
  });

  it('treats a trailing dot segment as the directory it follows (turbo walked it — dry-run-pinned)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/fixtures/nested/member/.', tracked)).toEqual({
      kind: 'alive',
    });
  });

  it('drops trailing separator runs on both arms (directory literal stays alive; the glob gains its match)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/fixtures/nested/member//', tracked)).toEqual({
      kind: 'alive',
    });
    expect(classifyTurboRootInput('$TURBO_ROOT$/a/*//', ['a/x.ts'])).toEqual({ kind: 'alive' });
  });

  it('ignores a trailing slash after a glob as turbo does (dry-run-pinned)', () => {
    expect(classifyTurboRootInput('$TURBO_ROOT$/a/*/', ['a/x.ts'])).toEqual({ kind: 'alive' });
    expect(classifyTurboRootInput('$TURBO_ROOT$/a/**/', ['a/b/c.ts'])).toEqual({ kind: 'alive' });
  });

  it('refuses an absolute remainder, which turbo rejects config-wide (dry-run-pinned)', () => {
    const absolute = classifyTurboRootInput('$TURBO_ROOT$//package.json', ['package.json']);
    expect(absolute.kind).toBe('unsupported');
    expect(absolute.kind === 'unsupported' && absolute.reason).toContain('absolute');
  });

  it('normalises a non-escaping `..` segment as turbo does (dry-run-pinned), literal and glob entries alike', () => {
    expect(
      classifyTurboRootInput('$TURBO_ROOT$/agent-tools/../package.json', ['package.json']),
    ).toEqual({ kind: 'alive' });
    expect(classifyTurboRootInput('$TURBO_ROOT$/agent-tools/../src/*.ts', ['src/x.ts'])).toEqual({
      kind: 'alive',
    });
  });

  it('refuses a `..` that escapes the repository root, which turbo rejects config-wide (dry-run-pinned)', () => {
    const escaping = classifyTurboRootInput('$TURBO_ROOT$/..', ['package.json']);
    expect(escaping.kind).toBe('unsupported');
    expect(escaping.kind === 'unsupported' && escaping.reason).toContain('escape');
    expect(classifyTurboRootInput('$TURBO_ROOT$/a/../../b', ['b']).kind).toBe('unsupported');
  });
});

describe('scanTurboRootInputs', () => {
  it('reports each dead occurrence with its line in JSONC', () => {
    const turboJsonText = [
      '{',
      '  // pipeline',
      '  "tasks": {',
      '    "test": {',
      '      "inputs": ["$TURBO_ROOT$/vitest.config.ts", "$TURBO_ROOT$/tsconfig.base.json"]',
      '    },',
      '    "mutate": {',
      '      "inputs": ["$TURBO_ROOT$/vitest.config.ts"]',
      '    }',
      '  }',
      '}',
    ].join('\n');

    const scan = scanTurboRootInputs({
      turboJsonText,
      trackedFiles: ['tsconfig.base.json'],
    });

    expect(scan.parseErrors).toEqual([]);
    expect(scan.refusals).toEqual([]);
    expect(scan.findings).toEqual([
      { entry: '$TURBO_ROOT$/vitest.config.ts', line: 5 },
      { entry: '$TURBO_ROOT$/vitest.config.ts', line: 8 },
    ]);
  });

  it('ignores $TURBO_ROOT$ strings outside inputs arrays', () => {
    const turboJsonText = '{"tasks": {"test": {"outputs": ["$TURBO_ROOT$/missing/**"]}}}';

    const scan = scanTurboRootInputs({ turboJsonText, trackedFiles: [] });
    expect(scan.findings).toEqual([]);
    expect(scan.refusals).toEqual([]);
  });

  it('routes unsupported pattern syntax to the refusal stream, never to findings', () => {
    const turboJsonText =
      '{"tasks": {"test": {"inputs": ["$TURBO_ROOT$/tooling/{result,safe-path}/**"]}}}';

    const scan = scanTurboRootInputs({
      turboJsonText,
      trackedFiles: ['tooling/result/src/index.ts'],
    });

    expect(scan.findings).toEqual([]);
    expect(scan.refusals).toHaveLength(1);
    expect(scan.refusals[0]?.line).toBe(1);
    expect(scan.refusals[0]?.reason).toContain('{');
  });

  it('counts only the $TURBO_ROOT$ entries that matched tracked files — dead, refused, and negated all excluded', () => {
    // The bin's success line derives its claim ("N positive $TURBO_ROOT$
    // inputs each matching ≥1 tracked file") from this count, so the
    // sentence is true by construction in every state — the bare-prose predecessor
    // over-claimed "every positive turbo input" as bare prose while
    // only $TURBO_ROOT$ entries were ever evaluated.
    const turboJsonText = [
      '{',
      '  "tasks": {',
      '    "test": {',
      '      "inputs": [',
      '        "$TURBO_ROOT$/tsconfig.base.json",',
      '        "!$TURBO_ROOT$/tooling/result/dist/**",',
      '        "$TURBO_ROOT$/vitest.config.ts",',
      '        "$TURBO_ROOT$/tooling/{result,safe-path}/**",',
      '        "src/**/*.ts"',
      '      ]',
      '    }',
      '  }',
      '}',
    ].join('\n');

    const scan = scanTurboRootInputs({
      turboJsonText,
      trackedFiles: ['tsconfig.base.json'],
    });

    expect(scan.positives).toBe(1);
    expect(scan.findings).toHaveLength(1);
    expect(scan.refusals).toHaveLength(1);
  });

  it('surfaces JSONC parse errors instead of scanning recoverable fragments (the red-proof)', () => {
    // Truncated mid-array: the fault-tolerant visitor would happily visit
    // what it can recover and report a clean scan without onError.
    const truncated = '{"tasks": {"test": {"inputs": ["$TURBO_ROOT$/tsconfig.base.json",';

    const scan = scanTurboRootInputs({
      turboJsonText: truncated,
      trackedFiles: ['tsconfig.base.json'],
    });

    expect(scan.parseErrors.length).toBeGreaterThan(0);
  });
});
