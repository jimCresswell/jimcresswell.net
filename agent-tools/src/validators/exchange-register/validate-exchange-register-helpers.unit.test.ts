import { unwrap } from '@engraph/result';
import { describe, expect, it } from 'vitest';

import {
  countDrift,
  coverageOf,
  parseCoverageCounts,
  renderCoverageCounts,
} from './exchange-register-counts.js';
import { collectBadReferences } from './exchange-register-contested.js';
import {
  collectUnknownScopes,
  computeCoverage,
  globToRegExp,
  listsForGroup,
} from './exchange-register-coverage.js';
import { type PinsRow } from './exchange-register-types.js';
import { parseDeltaPaths, parsePinsRows } from './exchange-register-inputs.js';
import { parseRegisterRows } from './validate-exchange-register-helpers.js';

const PINS: readonly PinsRow[] = [
  { label: 'oce-since-jcnet-pin', estate: 'oce' },
  { label: 'jcnet-since-transplant', estate: 'jcnet' },
  { label: 'castr-since-transplant', estate: 'castr' },
  { label: 'oce-since-castr-pin', estate: 'oce' },
];

describe('parseRegisterRows', () => {
  it('reads row id, group, backticked globs and the catch-all mark from glob tables only', () => {
    const markdown = [
      '| Row | Concept | jcnet | lineage | castr | Path globs |',
      '| --- | --- | --- | --- | --- | --- |',
      '| L1 | profile | bring | origin | bring | `.agent/x/**`, `agent-tools/src/y/**` |',
      '| J15 | rest | origin | origin | bring | `**` (catch-all) |',
      '',
      '| Row | Estate | Pull request | Head read |',
      '| --- | --- | --- | --- | --- | --- |',
      '| L1 | jcnet | 137 | origin | bring | lineage `72cab5667c` |',
    ].join('\n');
    expect(unwrap(parseRegisterRows(markdown))).toStrictEqual([
      {
        id: 'L1',
        group: 'L',
        globs: ['.agent/x/**', 'agent-tools/src/y/**'],
        catchAll: false,
        lists: null,
        excepting: [],
        shares: [],
      },
      {
        id: 'J15',
        group: 'J',
        globs: ['**'],
        catchAll: true,
        lists: null,
        excepting: [],
        shares: [],
      },
    ]);
  });

  it('refuses a row id that appears twice, since ids are unique and never reused', () => {
    const markdown = [
      '| Row | Concept | jcnet | lineage | castr | Path globs |',
      '| --- | --- | --- | --- | --- | --- |',
      '| L21 | a | bring | origin | bring | `a/**` |',
      '| L21 | b | bring | origin | bring | `b/**` |',
    ].join('\n');
    const refused = parseRegisterRows(markdown);
    expect(refused.ok ? '' : refused.error).toContain('L21 appears more than once');
  });

  it.each(['(list: )', '(list:)'])(
    'refuses the empty scope %s, which would confine the row to no list',
    (scope) => {
      const markdown = [
        '| Row | Concept | jcnet | lineage | castr | Path globs |',
        '| --- | --- | --- | --- | --- | --- |',
        `| C9 | a | bring | origin | bring | \`a/**\` ${scope} |`,
      ].join('\n');
      const refused = parseRegisterRows(markdown);
      expect(refused.ok ? '' : refused.error).toContain('C9: an empty (list:) scope');
    },
  );

  it.each([
    ['`a/**` (list: jcnet-since-transplant', 'opens a (list: marker it never closes'],
    ['`a/**` (list: a) (list: b)', 'carries more than one (list: ...) marker'],
    ['`a/**` (list : castr-since-transplant)', 'carries the marker `(list :`'],
    ['`a/**` ( List: castr-since-transplant)', 'carries the marker `( List:`'],
    ['`a/**` (list: a,)', 'names an empty label in (list: ...)'],
    ['`a/**` (list: ,a)', 'names an empty label in (list: ...)'],
    ['`a/**` (list: a,,b)', 'names an empty label in (list: ...)'],
    ['`a/**` (excepting: J2', 'opens a (excepting: marker it never closes'],
    ['`a/**` (shares: J2) (shares: J3)', 'carries more than one (shares: ...) marker'],
    ['`a/**` (excepting: J1)', 'names itself in a marker'],
  ])('refuses the malformed scope cell %s rather than reading it as unscoped', (cell, message) => {
    const markdown = [
      '| Row | Concept | jcnet | lineage | castr | Path globs |',
      '| --- | --- | --- | --- | --- | --- |',
      `| J1 | a | bring | origin | bring | ${cell} |`,
    ].join('\n');
    const refused = parseRegisterRows(markdown);
    expect(refused.ok ? '' : refused.error).toContain(`J1: ${message}`);
  });

  it.each([
    [
      '| Row | Concept | Path globs |',
      '| --- | --- | --- |',
      '| J1 | a | `a/**` |',
      "a glob table's header is",
    ],
    [
      '| Row | Concept | jcnet | lineage | castr | Path globs |',
      '| --- | --- | --- | --- | --- | --- |',
      '| J1 | a | bring |  | bring | `a/**` |',
      'row J1: the lineage cell is empty',
    ],
    [
      '| Row | Concept | jcnet | lineage | castr | Path globs |',
      '| --- | --- | --- | --- | --- | --- |',
      '| J1 | a | bring | `a/**` |',
      'row J1: 4 cells, not 6',
    ],
  ])(
    'refuses a concept table with a wrong header or a blank cell: %s',
    (header, separator, row, message) => {
      const refused = parseRegisterRows([header, separator, row].join('\n'));
      expect(refused.ok ? '' : refused.error).toContain(message);
    },
  );

  it.each(['X1', 'l1', 'LL1', 'Lx', 'rest'])(
    'refuses the first cell %s in a glob table body, since a skipped row would fall to a catch-all',
    (cell) => {
      const markdown = [
        '| Row | Concept | jcnet | lineage | castr | Path globs |',
        '| --- | --- | --- | --- | --- | --- |',
        `| ${cell} | a | bring | origin | bring | \`a/**\` |`,
      ].join('\n');
      const refused = parseRegisterRows(markdown);
      expect(refused.ok ? '' : refused.error).toContain(`row cell \`${cell}\`: not a row id`);
    },
  );

  it('reads a (list: ...) scope as the lists the row is confined to', () => {
    const markdown = [
      '| Row | Concept | jcnet | lineage | castr | Path globs |',
      '| --- | --- | --- | --- | --- | --- |',
      '| C15 | rest | bring | origin | bring | `**` (catch-all) (list: oce-since-castr-pin) |',
      '| C9 | two | bring | origin | bring | `a/**` (list: castr-since-transplant, oce-since-castr-pin) |',
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

describe('excepting and shares', () => {
  const twoLists = new Map<string, readonly string[]>([
    ['oce-since-jcnet-pin', []],
    ['jcnet-since-transplant', ['rules/a.md', 'rules/b.md', 'x/y.ts']],
    ['castr-since-transplant', []],
    ['oce-since-castr-pin', []],
  ]);
  const table = (...rows: readonly string[]): string =>
    [
      '| Row | Concept | jcnet | lineage | castr | Path globs |',
      '| --- | --- | --- | --- | --- | --- |',
      ...rows,
    ].join('\n');

  it('refuses a path claimed by two specific rows of one group that declare nothing', () => {
    const rows = unwrap(
      parseRegisterRows(
        table(
          '| J1 | a | bring | origin | bring | `rules/*.md` |',
          '| J2 | b | bring | origin | bring | `rules/a.md` |',
        ),
      ),
    );
    const report = computeCoverage(rows, PINS, twoLists);
    expect(report.contested).toStrictEqual([
      { label: 'jcnet-since-transplant', path: 'rules/a.md', rowIds: ['J1', 'J2'] },
    ]);
  });

  it('yields every path an excepted row matches, so the narrower row alone is credited', () => {
    const rows = unwrap(
      parseRegisterRows(
        table(
          '| J1 | a | bring | origin | bring | `rules/*.md` (excepting: J2) |',
          '| J2 | b | bring | origin | bring | `rules/a.md` |',
        ),
      ),
    );
    const report = computeCoverage(rows, PINS, twoLists);
    expect(report.contested).toStrictEqual([]);
    expect(report.matchesByRow.get('J1')).toBe(1);
    expect(report.matchesByRow.get('J2')).toBe(1);
    expect(report.deadGlobs).toStrictEqual([]);
  });

  it('lets two rows share a path when one declares it, and refuses a share outside the group', () => {
    const rows = unwrap(
      parseRegisterRows(
        table(
          '| J1 | a | bring | origin | bring | `rules/*.md` (shares: J2) |',
          '| J2 | b | bring | origin | bring | `rules/a.md` |',
          '| J3 | c | bring | origin | bring | `x/**` (excepting: L1) |',
        ),
      ),
    );
    const report = computeCoverage(rows, PINS, twoLists);
    expect(report.contested).toStrictEqual([]);
    expect(report.matchesByRow.get('J1')).toBe(2);
    expect(collectBadReferences(rows)).toStrictEqual([
      { rowId: 'J3', marker: 'excepting', target: 'L1' },
    ]);
  });

  it('reports a glob on a row that covers no list (an O row) as dead', () => {
    const rows = unwrap(
      parseRegisterRows(table('| O1 | owner word | same | same | same | `x/**` |')),
    );
    const report = computeCoverage(rows, PINS, twoLists);
    expect(report.deadGlobs).toStrictEqual([{ rowId: 'O1', glob: 'x/**' }]);
  });
});

describe('collectUnknownScopes', () => {
  it('names a (list: ...) label outside the row group, which would otherwise empty the row silently', () => {
    const rows = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | jcnet | lineage | castr | Path globs |',
          '| --- | --- | --- | --- | --- | --- |',
          '| J1 | a | bring | origin | bring | `a/**` (list: oce-since-castr-pin) |',
          '| C1 | b | bring | origin | bring | `b/**` (list: castr-since-transplant) |',
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
        '| Row | Concept | jcnet | lineage | castr | Path globs |',
        '| --- | --- | --- | --- | --- | --- |',
        '| L1 | a | bring | origin | bring | `agent-tools/src/a/**` |',
        '| J1 | b | bring | origin | bring | `.agent/rules/*.md` |',
        '| J15 | rest | bring | origin | bring | `**` (catch-all) |',
        '| C1 | c | bring | origin | bring | `agent-tools/src/c/**` |',
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
          '| Row | Concept | jcnet | lineage | castr | Path globs |',
          '| --- | --- | --- | --- | --- | --- |',
          '| C12 | castr rest | bring | origin | bring | `**` (catch-all) (list: castr-since-transplant) |',
          '| C15 | lineage rest | bring | origin | bring | `**` (catch-all) (list: oce-since-castr-pin) |',
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
          '| Row | Concept | jcnet | lineage | castr | Path globs |',
          '| --- | --- | --- | --- | --- | --- |',
          '| L1 | a | bring | origin | bring | `a/**` |',
          '| C15 | lineage rest | bring | origin | bring | `**` (catch-all) (list: oce-since-castr-pin) |',
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

  it('keeps a catch-all alive when every path it matches is taken by a specific sibling', () => {
    const shadowed = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | jcnet | lineage | castr | Path globs |',
          '| --- | --- | --- | --- | --- | --- |',
          '| J1 | a | bring | origin | bring | `a/**` |',
          '| J15 | rest | bring | origin | bring | `**` (catch-all) |',
        ].join('\n'),
      ),
    );
    const report = computeCoverage(
      shadowed,
      PINS,
      new Map([
        ['oce-since-jcnet-pin', []],
        ['jcnet-since-transplant', ['a/x']],
        ['castr-since-transplant', []],
        ['oce-since-castr-pin', []],
      ]),
    );
    expect(report.uncovered).toStrictEqual([]);
    expect(report.deadGlobs).toStrictEqual([]);
    expect(report.matchesByRow.get('J1')).toBe(1);
    expect(report.matchesByRow.get('J15')).toBe(0);
  });

  it('counts a path once for a row however many of its globs match it', () => {
    const twoGlobs = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | jcnet | lineage | castr | Path globs |',
          '| --- | --- | --- | --- | --- | --- |',
          '| J1 | a | bring | origin | bring | `a/**`, `**/x.md` |',
        ].join('\n'),
      ),
    );
    const report = computeCoverage(
      twoGlobs,
      PINS,
      new Map([
        ['oce-since-jcnet-pin', []],
        ['jcnet-since-transplant', ['a/x.md']],
        ['castr-since-transplant', []],
        ['oce-since-castr-pin', []],
      ]),
    );
    expect(report.deadGlobs).toStrictEqual([]);
    expect(report.matchesByRow.get('J1')).toBe(1);
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

describe('coverage counts', () => {
  const rows = unwrap(
    parseRegisterRows(
      [
        '| Row | Concept | jcnet | lineage | castr | Path globs |',
        '| --- | --- | --- | --- | --- | --- |',
        '| J1 | a | bring | origin | bring | `a/**` |',
        '| J2 | b | bring | origin | bring | `b/**` |',
      ].join('\n'),
    ),
  );
  const lists = (
    a: readonly string[],
    b: readonly string[],
  ): ReadonlyMap<string, readonly string[]> =>
    new Map([
      ['oce-since-jcnet-pin', []],
      ['jcnet-since-transplant', [...a, ...b]],
      ['castr-since-transplant', []],
      ['oce-since-castr-pin', []],
    ]);

  it('renders one line per row in register order with a fingerprint, and reads it back', () => {
    const coverage = coverageOf(rows, computeCoverage(rows, PINS, lists(['a/x', 'a/y'], ['b/x'])));
    const text = renderCoverageCounts(coverage);
    expect(text).toMatch(
      /^row\tmatches\tfingerprint\nJ1\t2\t[0-9a-f]{16}\nJ2\t1\t[0-9a-f]{16}\n$/u,
    );
    expect(unwrap(parseCoverageCounts(text))).toStrictEqual(coverage);
  });

  it.each([
    ['row\tmatches\nJ1\t3\n', 'does not start with'],
    ['row\tmatches\tfingerprint\nJ1\tthree\t0123456789abcdef\n', 'whole number'],
    ['row\tmatches\tfingerprint\nJ1\t\t0123456789abcdef\n', 'whole number'],
    ['row\tmatches\tfingerprint\nJ1\t-1\t0123456789abcdef\n', 'whole number'],
    ['row\tmatches\tfingerprint\nJ1\t9007199254740993\t0123456789abcdef\n', 'whole number'],
    ['row\tmatches\tfingerprint\nJ1\t3\tnothex\n', '16-hex fingerprint'],
    ['row\tmatches\tfingerprint\nJ1\t3\n', '16-hex fingerprint'],
    [
      'row\tmatches\tfingerprint\nJ1\t3\t0123456789abcdef\nJ1\t4\t0123456789abcdef\n',
      'appears more than once',
    ],
  ])('refuses the counts file %j: %s', (tsv, message) => {
    const refused = parseCoverageCounts(tsv);
    expect(refused.ok ? '' : refused.error).toContain(message);
  });

  it('names a deleted row, a changed count and a new row as drift, so a specific row cannot vanish into a catch-all', () => {
    const tracked = coverageOf(rows, computeCoverage(rows, PINS, lists(['a/x', 'a/y'], ['b/x'])));
    const fewer = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | jcnet | lineage | castr | Path globs |',
          '| --- | --- | --- | --- | --- | --- |',
          '| J2 | b | bring | origin | bring | `b/**` |',
          '| J3 | c | bring | origin | bring | `**` (catch-all) |',
        ].join('\n'),
      ),
    );
    const recomputed = coverageOf(
      fewer,
      computeCoverage(fewer, PINS, lists(['a/x', 'a/y'], ['b/x'])),
    );
    expect(countDrift(tracked, recomputed).map((d) => d.rowId)).toStrictEqual(['J1', 'J3']);
    expect(countDrift(tracked, new Map(tracked))).toStrictEqual([]);
  });

  it('names a widened glob as drift even when the entries it credits today are unchanged', () => {
    const tracked = coverageOf(rows, computeCoverage(rows, PINS, lists(['a/x.md'], ['b/x'])));
    const widened = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | jcnet | lineage | castr | Path globs |',
          '| --- | --- | --- | --- | --- | --- |',
          '| J1 | a | bring | origin | bring | `a/**`, `a/*.md` |',
          '| J2 | b | bring | origin | bring | `b/**` |',
        ].join('\n'),
      ),
    );
    const recomputed = coverageOf(
      widened,
      computeCoverage(widened, PINS, lists(['a/x.md'], ['b/x'])),
    );
    expect([...recomputed.values()].map((c) => c.count)).toStrictEqual([1, 1]);
    expect(countDrift(tracked, recomputed).map((d) => d.rowId)).toStrictEqual(['J1']);
  });

  it('names swapped globs as drift even when every count is unchanged', () => {
    const tracked = coverageOf(rows, computeCoverage(rows, PINS, lists(['a/x'], ['b/x'])));
    const swapped = unwrap(
      parseRegisterRows(
        [
          '| Row | Concept | jcnet | lineage | castr | Path globs |',
          '| --- | --- | --- | --- | --- | --- |',
          '| J1 | a | bring | origin | bring | `b/**` |',
          '| J2 | b | bring | origin | bring | `a/**` |',
        ].join('\n'),
      ),
    );
    const recomputed = coverageOf(swapped, computeCoverage(swapped, PINS, lists(['a/x'], ['b/x'])));
    expect([...recomputed.values()].map((c) => c.count)).toStrictEqual([1, 1]);
    expect(countDrift(tracked, recomputed).map((d) => d.rowId)).toStrictEqual(['J1', 'J2']);
  });
});
