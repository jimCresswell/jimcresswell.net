import { describe, expect, it } from 'vitest';

import { installTimeClosure, type InstallTimeClosureVerdict } from './install-time-closure.js';

const leaf = (name: string, workspaceDeps: readonly string[] = []) => ({
  name,
  exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } },
  devDependencies: Object.fromEntries(workspaceDeps.map((dep) => [dep, 'workspace:*'])),
});

function depsOf(verdict: InstallTimeClosureVerdict) {
  if (!verdict.ok) {
    throw new Error(verdict.error);
  }
  return verdict.deps;
}

describe('installTimeClosure', () => {
  it('includes every dist-only package with the artefacts its entry points resolve to', () => {
    const deps = depsOf(
      installTimeClosure(
        [
          {
            dir: 'tooling/config',
            manifest: {
              name: '@x/config',
              exports: {
                './tsup': { types: './dist/tsup.base.d.ts', import: './dist/tsup.base.js' },
                './vitest': { import: './dist/vitest.base.js', default: './dist/vitest.base.js' },
              },
            },
          },
          { dir: 'tooling/result', manifest: leaf('@x/result') },
        ],
        { exclude: [] },
      ),
    );

    expect(deps.map((dep) => [dep.dir, dep.distArtifacts])).toStrictEqual([
      ['tooling/config', ['tsup.base.d.ts', 'tsup.base.js', 'vitest.base.js']],
      ['tooling/result', ['index.d.ts', 'index.js']],
    ]);
  });

  it('leaves out a package without entry points, one that resolves to source, and the excluded name', () => {
    const deps = depsOf(
      installTimeClosure(
        [
          { dir: 'app', manifest: { name: '@x/app', dependencies: { next: '1.0.0' } } },
          { dir: 'src-pkg', manifest: { name: '@x/src', exports: { '.': './src/index.ts' } } },
          { dir: 'tools', manifest: leaf('@x/tools') },
          { dir: 'tooling/result', manifest: leaf('@x/result') },
        ],
        { exclude: ['@x/tools'] },
      ),
    );

    expect(deps.map((dep) => dep.name)).toStrictEqual(['@x/result']);
  });

  it('orders the closure so a package builds after the workspace packages it declares', () => {
    const deps = depsOf(
      installTimeClosure(
        [
          { dir: 'tooling/result', manifest: leaf('@x/result', ['@x/eslint', '@x/config']) },
          { dir: 'tooling/eslint', manifest: leaf('@x/eslint', ['@x/config']) },
          { dir: 'tooling/config', manifest: leaf('@x/config') },
        ],
        { exclude: [] },
      ),
    );

    expect(deps.map((dep) => dep.name)).toStrictEqual(['@x/config', '@x/eslint', '@x/result']);
  });

  it('refuses a workspace dependency cycle by name', () => {
    const verdict = installTimeClosure(
      [
        { dir: 'a', manifest: leaf('@x/a', ['@x/b']) },
        { dir: 'b', manifest: leaf('@x/b', ['@x/a']) },
      ],
      { exclude: [] },
    );

    expect(verdict).toStrictEqual({
      ok: false,
      error: 'workspace dependency cycle among: @x/a, @x/b',
    });
  });

  it('refuses a manifest without a name', () => {
    const verdict = installTimeClosure([{ dir: 'broken', manifest: { exports: {} } }], {
      exclude: [],
    });

    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.error).toMatch(/^broken\/package\.json is not a readable manifest/);
    }
  });
});
