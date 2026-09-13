import { describe, expect, it } from 'vitest';

import {
  markdownOnly,
  markdownlintArgs,
  parseNulSeparatedPaths,
  parseSymlinkPaths,
  prettierArgs,
  withoutSymlinks,
} from './repo-check-files.js';

/**
 * The universe of the root format and markdown gates is what git records.
 * These tests describe the pure mapping from captured git output to the file
 * list, and from the file list to each tool's argv; the process edge lives in
 * the composition root and is proved by the gate itself running.
 */

describe('parseNulSeparatedPaths', () => {
  it('splits -z output into paths, keeping a path with a newline whole', () => {
    // The reason -z exists: a newline inside a path is content, not a separator.
    expect(parseNulSeparatedPaths('README.md\0docs/a b.md\0docs/line\nbreak.md\0')).toStrictEqual([
      'README.md',
      'docs/a b.md',
      'docs/line\nbreak.md',
    ]);
  });

  it('reads empty output as no paths', () => {
    expect(parseNulSeparatedPaths('')).toStrictEqual([]);
  });
});

describe('parseSymlinkPaths', () => {
  it('names only the index entries whose mode is a symbolic link', () => {
    const output =
      '100644 0123abc 0\tREADME.md\0' +
      '120000 4567def 0\t.claude/skills/linked\0' +
      '100755 89ab012 0\tbin/run.sh\0';
    expect([...parseSymlinkPaths(output)]).toStrictEqual(['.claude/skills/linked']);
  });

  it('keeps a symlink path whole when the path itself carries a tab', () => {
    // -z preserves tabs in paths; only the first tab ends the metadata.
    const output = '120000 4567def 0\tdocs/tab\there.md\0';
    expect([...parseSymlinkPaths(output)]).toStrictEqual(['docs/tab\there.md']);
  });
});

describe('withoutSymlinks', () => {
  it('keeps order and drops every symlink path', () => {
    expect(withoutSymlinks(['a.md', 'link', 'b.ts'], new Set(['link']))).toStrictEqual([
      'a.md',
      'b.ts',
    ]);
  });
});

describe('markdownOnly', () => {
  it('keeps the .md files in order', () => {
    expect(markdownOnly(['a.md', 'b.ts', 'c/d.md', 'e.mdx'])).toStrictEqual(['a.md', 'c/d.md']);
  });
});

describe('prettierArgs', () => {
  it('checks explicit files read-only, skipping types prettier cannot parse', () => {
    expect(prettierArgs('check', ['a.md', 'b.sh'])).toStrictEqual([
      'exec',
      'prettier',
      '--check',
      '--ignore-unknown',
      'a.md',
      'b.sh',
    ]);
  });

  it('writes with the cache in repair mode', () => {
    expect(prettierArgs('write', ['a.md'])).toStrictEqual([
      'exec',
      'prettier',
      '--write',
      '--cache',
      '--ignore-unknown',
      'a.md',
    ]);
  });
});

describe('markdownlintArgs', () => {
  it('lints only the explicit files, never the config globs', () => {
    expect(markdownlintArgs('check', ['a.md', 'b.md'])).toStrictEqual([
      'exec',
      'markdownlint-cli2',
      '--no-globs',
      'a.md',
      'b.md',
    ]);
  });

  it('adds --fix in repair mode, before the files', () => {
    expect(markdownlintArgs('fix', ['a.md'])).toStrictEqual([
      'exec',
      'markdownlint-cli2',
      '--no-globs',
      '--fix',
      'a.md',
    ]);
  });
});
