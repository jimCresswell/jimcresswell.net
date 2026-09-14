import { describe, expect, it } from 'vitest';

import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';
import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

import {
  findLineageNameHits,
  lineageNeedles,
  scanForLineageNames,
  selectLineageNameBlock,
  type ScanFile,
} from './validate-no-lineage-names-helpers.js';

const BLOCK: ScopedContentBlockGroup = {
  concept: 'lineage-name',
  kind: 'literal',
  patterns: ['exampleorg'],
  include_paths: [''],
  exclude_paths: ['records/', 'content/'],
  citation: 'a cell fixture',
};

describe('lineageNeedles', () => {
  it('takes the declared names, trimmed and deduplicated case-insensitively', () => {
    expect(
      lineageNeedles({
        ...BLOCK,
        patterns: ['exampleorg', ' ExampleOrg ', 'upstream-lineage', ''],
      }),
    ).toEqual(['exampleorg', 'upstream-lineage']);
  });
});

describe('findLineageNameHits', () => {
  it('reports the line and column of a hit, case-insensitively, with the text as written', () => {
    const hits = findLineageNameHits('f.md', 'ok\nsee https://github.com/ExampleOrg/x\nok', [
      'exampleorg',
    ]);
    expect(hits).toStrictEqual([{ file: 'f.md', line: 2, column: 24, text: 'ExampleOrg' }]);
  });

  it('records at most one hit per line', () => {
    expect(
      findLineageNameHits('f', 'exampleorg and upstream-lineage', [
        'exampleorg',
        'upstream-lineage',
      ]),
    ).toHaveLength(1);
  });

  it('a name is literal, never a pattern', () => {
    expect(findLineageNameHits('f', 'a.b', ['a.b'])).toHaveLength(1);
    expect(findLineageNameHits('f', 'axb', ['a.b'])).toHaveLength(0);
  });
});

describe('scanForLineageNames', () => {
  const files: readonly ScanFile[] = [
    { path: 'tooling/x/package.json', content: '"url": "https://github.com/exampleorg/x"' },
    { path: 'records/provenance.yml', content: 'repo: exampleorg' },
    { path: 'content/cv.json', content: 'worked at exampleorg' },
    { path: 'src/clean.ts', content: 'nothing here' },
  ];

  it('scans the in-scope files and exempts the excluded ones', () => {
    const hits = scanForLineageNames(files, BLOCK, ['exampleorg']);
    expect(hits.map((hit) => hit.file)).toEqual(['tooling/x/package.json']);
  });
});

describe('the live lineage-name block', () => {
  it('exists in the policy, is literal, and exempts the records and the CV content', async () => {
    const block = selectLineageNameBlock(await loadScopedContentBlocks());
    expect(block).toBeDefined();
    expect(block?.kind).toBe('literal');
    expect(block?.exclude_paths).toEqual(
      expect.arrayContaining([
        '.agent/practice-core/provenance.yml',
        '.agent/practice-core/CHANGELOG.md',
        '.agent/memory/',
        '.agent/reports/',
        'jcdotnet/content/',
      ]),
    );
  });
});
