import { unwrap } from '@engraph/result';
import { describe, expect, it } from 'vitest';

import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';

import {
  lineageNeedles,
  needleDefects,
  scanForLineageNames,
  selectLineageNameBlock,
  type ScanFile,
} from './validate-no-lineage-names-helpers.js';

/**
 * The live `lineage-name` block, read from the canonical policy as the gate
 * and the write-hook read it (an integration cell: it touches the `.agent/`
 * substrate). What it proves is behaviour through the block, never the block's
 * list: a synthetic non-exempt file is in scope, each exempt surface is not,
 * and the declared names are well-formed.
 */

async function liveBlock() {
  return unwrap(selectLineageNameBlock(await loadScopedContentBlocks()));
}

describe('the live lineage-name block', () => {
  it('is one literal block declaring well-formed names', async () => {
    const block = await liveBlock();
    expect(needleDefects(block)).toEqual([]);
    expect(lineageNeedles(block).length).toBeGreaterThan(0);
  });

  it('a synthetic manifest carrying a name is in scope; the records and the content directory are exempt', async () => {
    const block = await liveBlock();
    const needles = lineageNeedles(block);
    const carrying = (path: string): ScanFile => ({
      path,
      content: `see ${needles[0] ?? 'nothing'} here`,
    });
    const hits = scanForLineageNames(
      [
        carrying('tooling/x/package.json'),
        carrying('agent-tools/src/validators/lineage-names/x.ts'),
        carrying('.agent/practice-core/provenance.yml'),
        carrying('.agent/practice-core/CHANGELOG.md'),
        carrying('.agent/memory/active/napkin.md'),
        carrying('.agent/reports/2026/x.md'),
        carrying('.agent/plans-legacy-2026-09/archive/x.plan.md'),
        carrying('docs/explorations/2026-09-12-x.md'),
        carrying('jcdotnet/content/entities.json'),
      ],
      block,
      needles,
    );
    expect(hits.map((hit) => hit.file)).toEqual([
      'tooling/x/package.json',
      'agent-tools/src/validators/lineage-names/x.ts',
    ]);
  });
});
