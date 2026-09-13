import { describe, expect, it } from 'vitest';

import { withImpliedDirectories } from './repository-paths.js';

describe('withImpliedDirectories', () => {
  it('adds every ancestor directory below the root for each file', () => {
    expect(
      [...withImpliedDirectories(['a/b/c.md', 'a/d.md'])].sort((a, b) => a.localeCompare(b)),
    ).toStrictEqual(['a', 'a/b', 'a/b/c.md', 'a/d.md']);
  });

  it('keeps a root-level file without inventing a "." entry', () => {
    expect([...withImpliedDirectories(['README.md'])]).toStrictEqual(['README.md']);
  });
});
