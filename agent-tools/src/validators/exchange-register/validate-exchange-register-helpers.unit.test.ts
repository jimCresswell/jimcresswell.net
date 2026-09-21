import { describe, expect, it } from 'vitest';

import { computeCoverage, globToRegExp, listsForGroup } from './exchange-register-coverage.js';
import { type PinsRow } from './exchange-register-types.js';
import {
  parseDeltaPaths,
  parsePinsRows,
  parseRegisterRows,
} from './validate-exchange-register-helpers.js';

const PINS: readonly PinsRow[] = [
  { label: 'oce-since-jcnet-pin', estate: 'oce' },
  { label: 'jcnet-since-transplant', estate: 'jcnet' },
  { label: 'castr-since-transplant', estate: 'castr' },
  { label: 'oce-since-castr-pin', estate: 'oce' },
];

describe('parseRegisterRows', () => {
  it('reads row id, group, backticked globs and the catch-all mark from glob tables only', () => {
    const markdown = [
      '| Row | Concept | jcnet | Path globs |',
      '| --- | --- | --- | --- |',
      '| L1 | profile | bring | `.agent/x/**`, `agent-tools/src/y/**` |',
      '| J15 | rest | origin | `**` (catch-all) |',
      '',
      '| Row | Estate | Pull request | Head read |',
      '| --- | --- | --- | --- |',
      '| L1 | jcnet | 137 | lineage `72cab5667c` |',
    ].join('\n');
    expect(parseRegisterRows(markdown)).toStrictEqual([
      { id: 'L1', group: 'L', globs: ['.agent/x/**', 'agent-tools/src/y/**'], catchAll: false },
      { id: 'J15', group: 'J', globs: ['**'], catchAll: true },
    ]);
  });
});

describe('parsePinsRows and parseDeltaPaths', () => {
  it('reads labels and estates by header name, and the third column of a delta list', () => {
    const pins = parsePinsRows('label\testate\torigin\nx\tjcnet\tgithub.com/a/b\n');
    expect(pins).toStrictEqual([{ label: 'x', estate: 'jcnet' }]);
    expect(parseDeltaPaths('x\tA\t.agent/a.md\nx\tM\tagent-tools/b.ts\n')).toStrictEqual([
      '.agent/a.md',
      'agent-tools/b.ts',
    ]);
  });

  it('refuses a pins file without the named columns', () => {
    expect(() => parsePinsRows('a\tb\n1\t2\n')).toThrow('label');
  });
});

describe('listsForGroup', () => {
  it('maps L to both lineage lists, J to jcnet, C to castr plus lineage-since-castr, O to none', () => {
    expect(listsForGroup('L', PINS)).toStrictEqual(['oce-since-jcnet-pin', 'oce-since-castr-pin']);
    expect(listsForGroup('J', PINS)).toStrictEqual(['jcnet-since-transplant']);
    expect(listsForGroup('C', PINS)).toStrictEqual([
      'castr-since-transplant',
      'oce-since-castr-pin',
    ]);
    expect(listsForGroup('O', PINS)).toStrictEqual([]);
  });
});

describe('globToRegExp', () => {
  it.each([
    ['**', 'anything/at/all.ts', true],
    ['agent-tools/src/x/**', 'agent-tools/src/x/a/b.ts', true],
    ['agent-tools/src/x/**', 'agent-tools/src/xy/a.ts', false],
    ['.agent/rules/*.md', '.agent/rules/a.md', true],
    ['.agent/rules/*.md', '.agent/rules/sub/a.md', false],
    ['PDR-008*', 'PDR-008-canonical.md', true],
    ['.husky/pre-push', '.husky/pre-push', true],
    ['.husky/pre-push', '.husky/pre-push.bak', false],
  ])('%s against %s is %s', (glob, path, expected) => {
    expect(globToRegExp(glob).test(path)).toBe(expected);
  });
});

describe('computeCoverage', () => {
  const rows = parseRegisterRows(
    [
      '| Row | Concept | Path globs |',
      '| --- | --- | --- |',
      '| L1 | a | `agent-tools/src/a/**` |',
      '| J1 | b | `.agent/rules/*.md` |',
      '| J15 | rest | `**` (catch-all) |',
      '| C1 | c | `agent-tools/src/c/**` |',
    ].join('\n'),
  );

  it('covers a path by a specific row first and a catch-all only when nothing else matches', () => {
    const report = computeCoverage(
      rows,
      PINS,
      new Map([
        ['oce-since-jcnet-pin', ['agent-tools/src/a/x.ts']],
        ['jcnet-since-transplant', ['.agent/rules/r.md', 'agent-tools/src/z.ts']],
        ['castr-since-transplant', ['agent-tools/src/c/y.ts']],
        ['oce-since-castr-pin', ['agent-tools/src/a/x.ts', 'agent-tools/src/c/y.ts']],
      ]),
    );
    expect(report.uncovered).toStrictEqual([]);
    expect(report.deadGlobs).toStrictEqual([]);
    expect(report.matchesByRow.get('J15')).toBe(1);
    expect(report.matchesByRow.get('L1')).toBe(2);
  });

  it('reports an uncovered path and a dead glob', () => {
    const report = computeCoverage(
      rows,
      PINS,
      new Map([
        ['oce-since-jcnet-pin', ['agent-tools/src/q/x.ts']],
        ['jcnet-since-transplant', []],
        ['castr-since-transplant', []],
        ['oce-since-castr-pin', []],
      ]),
    );
    expect(report.uncovered).toStrictEqual([
      { label: 'oce-since-jcnet-pin', path: 'agent-tools/src/q/x.ts' },
    ]);
    expect(report.deadGlobs.map((d) => d.rowId)).toStrictEqual(['L1', 'J1', 'J15', 'C1']);
  });
});
