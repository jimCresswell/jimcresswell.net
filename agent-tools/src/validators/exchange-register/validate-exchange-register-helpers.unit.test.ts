import { unwrap } from '@engraph/result';
import { describe, expect, it } from 'vitest';

import {
  collectUnknownScopes,
  computeCoverage,
  globToRegExp,
  listsForGroup,
} from './exchange-register-coverage.js';
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
    expect(unwrap(parseRegisterRows(markdown))).toStrictEqual([
      {
        id: 'L1',
        group: 'L',
        globs: ['.agent/x/**', 'agent-tools/src/y/**'],
        catchAll: false,
        lists: null,
      },
      { id: 'J15', group: 'J', globs: ['**'], catchAll: true, lists: null },
    ]);
  });

  it('refuses a row id that appears twice, since ids are unique and never reused', () => {
    const markdown = [
      '| Row | Concept | Path globs |',
      '| --- | --- | --- |',
      '| L21 | a | `a/**` |',
      '| L21 | b | `b/**` |',
    ].join('\n');
    const refused = parseRegisterRows(markdown);
    expect(refused.ok ? '' : refused.error).toContain('L21 appears more than once');
  });

  it.each(['(list: )', '(list:)'])(
    'refuses the empty scope %s, which would confine the row to no list',
    (scope) => {
      const markdown = [
        '| Row | Concept | Path globs |',
        '| --- | --- | --- |',
        `| C9 | a | \`a/**\` ${scope} |`,
      ].join('\n');
      const refused = parseRegisterRows(markdown);
      expect(refused.ok ? '' : refused.error).toContain('C9: an empty (list:) scope');
    },
  );

  it('refuses a row whose group is not L, J, C or O, which would resolve to no list', () => {
    const markdown = [
      '| Row | Concept | Path globs |',
      '| --- | --- | --- |',
      '| X1 | a | `a/**` |',
    ].join('\n');
    const refused = parseRegisterRows(markdown);
    expect(refused.ok ? '' : refused.error).toContain('X1: the group is not one of L, J, C, O');
  });

  it('reads a (list: ...) scope as the lists the row is confined to', () => {
    const markdown = [
      '| Row | Concept | Path globs |',
      '| --- | --- | --- |',
      '| C15 | rest | `**` (catch-all) (list: oce-since-castr-pin) |',
      '| C9 | two | `a/**` (list: castr-since-transplant, oce-since-castr-pin) |',
    ].join('\n');
    expect(unwrap(parseRegisterRows(markdown)).map((row) => row.lists)).toStrictEqual([
      ['oce-since-castr-pin'],
      ['castr-since-transplant', 'oce-since-castr-pin'],
    ]);
  });
});

describe('parsePinsRows and parseDeltaPaths', () => {
  it('reads labels and estates by header name, and the third column of a delta list', () => {
    const pins = unwrap(parsePinsRows('label\testate\torigin\nx\tjcnet\tgithub.com/a/b\n'));
    expect(pins).toStrictEqual([{ label: 'x', estate: 'jcnet' }]);
    expect(
      unwrap(parseDeltaPaths('x\tA\t.agent/a.md\nx\tM\tagent-tools/b.ts\n', 'x')),
    ).toStrictEqual(['.agent/a.md', 'agent-tools/b.ts']);
  });

  it('refuses a pins file without the named columns', () => {
    const refused = parsePinsRows('a\tb\n1\t2\n');
    expect(refused.ok ? '' : refused.error).toContain('label');
  });

  it.each([
    ['label\testate\nx\tjcnet\nx\toce\n', 'appears more than once'],
    ['label\testate\n../x\tjcnet\n', 'not lower-case words'],
    ['label\testate\n\tjcnet\n', 'not lower-case words'],
    ['label\testate\nx\tmoon\n', 'not one of oce, jcnet, castr'],
  ])('refuses the pins file %j: %s', (tsv, message) => {
    const refused = parsePinsRows(tsv);
    expect(refused.ok ? '' : refused.error).toContain(message);
  });

  it.each([
    ['x\tA\n', 'not `label<TAB>status<TAB>path`'],
    ['x\tA\t\n', 'not `label<TAB>status<TAB>path`'],
    ['x\tA\ta.md\textra\n', 'not `label<TAB>status<TAB>path`'],
    ['y\tA\ta.md\n', 'labelled `y`, not x'],
  ])('refuses the delta list %j: %s', (tsv, message) => {
    const refused = parseDeltaPaths(tsv, 'x');
    expect(refused.ok ? '' : refused.error).toContain(message);
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

describe('collectUnknownScopes', () => {
  it('names a (list: ...) label outside the row group, which would otherwise empty the row silently', () => {
    const rows = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | Path globs |',
          '| --- | --- | --- |',
          '| J1 | a | `a/**` (list: oce-since-castr-pin) |',
          '| C1 | b | `b/**` (list: castr-since-transplant) |',
        ].join('\n'),
      ),
    );
    expect(collectUnknownScopes(rows, PINS)).toStrictEqual([
      { rowId: 'J1', label: 'oce-since-castr-pin' },
    ]);
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
    ['a?b.md', 'a?b.md', true],
    ['a?b.md', 'axb.md', false],
  ])('%s against %s is %s', (glob, path, expected) => {
    expect(globToRegExp(glob).test(path)).toBe(expected);
  });
});

describe('computeCoverage', () => {
  const rows = unwrap(
    parseRegisterRows(
      [
        '| Row | Concept | Path globs |',
        '| --- | --- | --- |',
        '| L1 | a | `agent-tools/src/a/**` |',
        '| J1 | b | `.agent/rules/*.md` |',
        '| J15 | rest | `**` (catch-all) |',
        '| C1 | c | `agent-tools/src/c/**` |',
      ].join('\n'),
    ),
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

  it('confines a list-scoped catch-all to its list, so a sibling catch-all owns the other', () => {
    const scoped = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | Path globs |',
          '| --- | --- | --- |',
          '| C12 | castr rest | `**` (catch-all) (list: castr-since-transplant) |',
          '| C15 | lineage rest | `**` (catch-all) (list: oce-since-castr-pin) |',
        ].join('\n'),
      ),
    );
    const report = computeCoverage(
      scoped,
      PINS,
      new Map([
        ['oce-since-jcnet-pin', []],
        ['jcnet-since-transplant', []],
        ['castr-since-transplant', ['a.md', 'b.md']],
        ['oce-since-castr-pin', ['c.md']],
      ]),
    );
    expect(report.uncovered).toStrictEqual([]);
    expect(report.deadGlobs).toStrictEqual([]);
    expect(report.matchesByRow.get('C12')).toBe(2);
    expect(report.matchesByRow.get('C15')).toBe(1);
  });

  it('lets a C catch-all take a lineage-since-castr path an L-specific row also covers', () => {
    const crossGroup = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | Path globs |',
          '| --- | --- | --- |',
          '| L1 | a | `a/**` |',
          '| C15 | lineage rest | `**` (catch-all) (list: oce-since-castr-pin) |',
        ].join('\n'),
      ),
    );
    const report = computeCoverage(
      crossGroup,
      PINS,
      new Map([
        ['oce-since-jcnet-pin', ['a/x.md']],
        ['jcnet-since-transplant', []],
        ['castr-since-transplant', []],
        ['oce-since-castr-pin', ['a/x.md']],
      ]),
    );
    expect(report.uncovered).toStrictEqual([]);
    expect(report.deadGlobs).toStrictEqual([]);
    expect(report.matchesByRow.get('L1')).toBe(2);
    expect(report.matchesByRow.get('C15')).toBe(1);
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
