import { describe, expect, it } from 'vitest';

import { isPathInScope } from './path-scope.js';

/**
 * The path scoping shared by the write-hook and the two whole-tree gates
 * (lineage names, machine-local paths). Three scope forms: a substring, a
 * `**\/*` suffix, and a root-anchored path led by `./` (5c-ii: a substring
 * exclusion let a nested copy of an exempt path bypass the gate).
 */
describe('isPathInScope', () => {
  it('a substring scope matches anywhere in the path, a slash-led one included', () => {
    expect(isPathInScope('a/hooks/policy.json', [''], ['hooks/policy.json'])).toBe(false);
    expect(isPathInScope('a/other.json', [''], ['hooks/policy.json'])).toBe(true);
    expect(isPathInScope('pkg/tests/x.ts', [''], ['/tests/'])).toBe(false);
  });

  it('a suffix scope matches the path end', () => {
    expect(isPathInScope('x/y.plan.md', ['**/*.plan.md'])).toBe(true);
    expect(isPathInScope('x/y.md', ['**/*.plan.md'])).toBe(false);
  });

  it('a root-anchored scope matches only from the repository root, never a nested copy', () => {
    const excludes = ['./.agent/hooks/policy.json', './.agent/memory/'];
    expect(isPathInScope('.agent/hooks/policy.json', [''], excludes)).toBe(false);
    expect(isPathInScope('.agent/memory/active/napkin.md', [''], excludes)).toBe(false);
    expect(isPathInScope('evil/.agent/hooks/policy.json', [''], excludes)).toBe(true);
    expect(isPathInScope('docs/.agent/memory/x.md', [''], excludes)).toBe(true);
  });

  it('with the repo root known, an absolute path inside it is anchored at that root', () => {
    const root = '/checkout/repo';
    const excludes = ['./.agent/hooks/policy.json'];
    expect(isPathInScope('/checkout/repo/.agent/hooks/policy.json', [''], excludes, root)).toBe(
      false,
    );
    expect(
      isPathInScope('/checkout/repo/evil/.agent/hooks/policy.json', [''], excludes, root),
    ).toBe(true);
  });

  it('a root-anchored scope never matches a path outside the repository', () => {
    const excludes = ['./.agent/hooks/policy.json'];
    expect(
      isPathInScope('/elsewhere/.agent/hooks/policy.json', [''], excludes, '/checkout/repo'),
    ).toBe(true);
    expect(isPathInScope('/elsewhere/.agent/hooks/policy.json', [''], excludes)).toBe(true);
  });

  it('a file entry anchors the file itself or a descendant, never a sibling sharing the name', () => {
    const excludes = ['./.agent/hooks/policy.json', './.agent/memory/'];
    expect(isPathInScope('.agent/hooks/policy.json.bak', [''], excludes)).toBe(true);
    expect(isPathInScope('.agent/hooks/policy.json/inner.json', [''], excludes)).toBe(false);
    expect(isPathInScope('.agent/memory-notes/x.md', [''], excludes)).toBe(true);
  });

  it('reads a Windows path and root with their own separators (drive letter and UNC)', () => {
    const excludes = ['./.agent/hooks/policy.json'];
    expect(
      isPathInScope(
        String.raw`C:\repo\.agent\hooks\policy.json`,
        [''],
        excludes,
        String.raw`C:\repo`,
      ),
    ).toBe(false);
    expect(
      isPathInScope(
        String.raw`C:\repo\nested\.agent\hooks\policy.json`,
        [''],
        excludes,
        String.raw`C:\repo`,
      ),
    ).toBe(true);
    expect(
      isPathInScope(
        String.raw`\\server\share\repo\.agent\hooks\policy.json`,
        [''],
        excludes,
        String.raw`\\server\share\repo`,
      ),
    ).toBe(false);
    // The substring and suffix forms read the same separators.
    expect(isPathInScope(String.raw`a\hooks\policy.json`, [''], ['hooks/policy.json'])).toBe(false);
    expect(isPathInScope(String.raw`x\y.plan.md`, ['**/*.plan.md'])).toBe(true);
  });

  it('an undefined path is never in scope', () => {
    expect(isPathInScope(undefined, [''])).toBe(false);
  });
});
