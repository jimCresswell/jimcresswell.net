import { describe, expect, it } from 'vitest';

import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';
import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

import {
  findLineageNameHits,
  lineageNeedles,
  needleDefects,
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

describe('needleDefects and lineageNeedles', () => {
  it('a padded, empty or duplicate name is a defect: the hook and the gate would read it apart', () => {
    expect(
      needleDefects({ ...BLOCK, patterns: ['exampleorg', ' ExampleOrg ', '', 'ExampleOrg'] }),
    ).toEqual([
      'padded or empty name " ExampleOrg "',
      'duplicate name " ExampleOrg "',
      'padded or empty name ""',
      'duplicate name "ExampleOrg"',
    ]);
    expect(needleDefects(BLOCK)).toEqual([]);
  });

  it('the needles are the declared names as written', () => {
    expect(lineageNeedles({ ...BLOCK, patterns: ['exampleorg', 'upstream-lineage'] })).toEqual([
      'exampleorg',
      'upstream-lineage',
    ]);
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

/**
 * An inert stand-in used ONLY when the live block is absent: it exempts
 * nothing and names nothing, so every live-block cell below fails visibly
 * beside the existence guard; absence is loud.
 */
const INERT_BLOCK: ScopedContentBlockGroup = {
  concept: 'lineage-name-missing',
  kind: 'literal',
  patterns: [],
  include_paths: [''],
  citation: 'placeholder — the existence guard cell reds when this is in use',
};

async function loadLiveBlockOrInert(): Promise<ScopedContentBlockGroup> {
  return selectLineageNameBlock(await loadScopedContentBlocks()) ?? INERT_BLOCK;
}

describe('the live lineage-name block', () => {
  it('exists in the policy, is literal, and declares well-formed names', async () => {
    const block = selectLineageNameBlock(await loadScopedContentBlocks());
    expect(block).toBeDefined();
    expect(block?.kind).toBe('literal');
    expect(needleDefects(block ?? INERT_BLOCK)).toEqual([]);
    expect(lineageNeedles(block ?? INERT_BLOCK).length).toBeGreaterThan(0);
  });

  it('through the live block a manifest is in scope and the records and the CV content are exempt', async () => {
    const block = await loadLiveBlockOrInert();
    const needles = lineageNeedles(block);
    const carrying = (path: string): ScanFile => ({
      path,
      content: `see ${needles[0] ?? 'nothing'} here`,
    });
    const hits = scanForLineageNames(
      [
        carrying('tooling/x/package.json'),
        carrying('.agent/practice-core/provenance.yml'),
        carrying('.agent/practice-core/CHANGELOG.md'),
        carrying('.agent/memory/active/napkin.md'),
        carrying('.agent/reports/2026/x.md'),
        carrying('.agent/plans-legacy-2026-09/archive/x.plan.md'),
        carrying('docs/explorations/2026-09-12-x.md'),
        carrying('jcdotnet/content/cv.content.json'),
      ],
      block,
      needles,
    );
    expect(hits.map((hit) => hit.file)).toEqual(['tooling/x/package.json']);
  });
});
