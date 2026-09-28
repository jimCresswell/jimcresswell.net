import { unwrap, unwrapErr } from '@engraph/result';
import { describe, expect, it } from 'vitest';

import {
  compareToCensus,
  countCitations,
  findAdrCitations,
  isCorePath,
  parseCensusText,
} from './validate-core-adr-citations-helpers.js';

/**
 * Pure cells over in-memory documents and census text; no filesystem. The
 * entry point's run over the tracked tree is proven by its CLI smoke.
 */

const PDR_A = '.agent/practice-core/decision-records/PDR-001-a.md';
const PDR_B = '.agent/practice-core/decision-records/PDR-002-b.md';
const CHANGELOG = '.agent/practice-core/CHANGELOG.md';

describe('isCorePath', () => {
  it('admits every file under the Core, at any depth', () => {
    expect(isCorePath(PDR_A)).toBe(true);
    expect(isCorePath(CHANGELOG)).toBe(true);
    expect(isCorePath('.agent/practice-core/incoming/.gitkeep')).toBe(true);
  });

  it('refuses a file outside the Core, including a look-alike prefix', () => {
    expect(isCorePath('.agent/rules/practice-core-portability.md')).toBe(false);
    expect(isCorePath('.agent/practice-core-archive/x.md')).toBe(false);
    expect(isCorePath('docs/architecture/decision-records/001-x.md')).toBe(false);
  });
});

describe('findAdrCitations', () => {
  it('finds every citation with its line, its column and the ADR it names', () => {
    expect(findAdrCitations('intro\nsee ADR-150 and ADR-7.\nend')).toEqual([
      { line: 2, column: 5, text: 'ADR-150', adr: 'ADR-150' },
      { line: 2, column: 17, text: 'ADR-7', adr: 'ADR-7' },
    ]);
  });

  it.each([
    ['in a code span', '`ADR-12`'],
    ['in underscore emphasis', '_ADR-12_'],
    ['in lower case', 'adr-12'],
    ['after an en dash', 'ADR\u201312'],
    ['after a non-breaking hyphen', 'ADR\u201112'],
    ['after a space', 'ADR 12'],
    ['after a no-break space', 'ADR\u00A012'],
    ['with a leading zero', 'ADR-012'],
  ])('reads a citation %s as the ADR it names', (_label, content) => {
    expect(findAdrCitations(content).map((citation) => citation.adr)).toEqual(['ADR-12']);
  });

  it('keys a number too large for an exact double as written, so two such ADRs stay distinct', () => {
    expect(
      findAdrCitations('ADR-9007199254740992 and ADR-0009007199254740993').map((c) => c.adr),
    ).toEqual(['ADR-9007199254740992', 'ADR-9007199254740993']);
  });

  it('keys ADR-0, written with any number of zeros, as ADR-0', () => {
    expect(findAdrCitations('ADR-0 and ADR-000').map((citation) => citation.adr)).toEqual([
      'ADR-0',
      'ADR-0',
    ]);
  });

  it.each([
    ['a PDR number', 'PDR-105'],
    ['a longer word', 'MADR-2'],
    ['the plural word', 'ADRs'],
    ['the bare word', 'an ADR is local'],
    ['a separator with no number after it', 'ADR- 5'],
    ['a number running into a letter', 'ADR-12a'],
  ])('does not read %s as a citation', (_label, content) => {
    expect(findAdrCitations(content)).toEqual([]);
  });
});

describe('countCitations', () => {
  it('counts per file and per ADR, keeping only the carriers', () => {
    const counts = countCitations([
      { path: PDR_A, content: 'ADR-9, then ADR-9 and ADR-3' },
      { path: PDR_B, content: 'clean' },
      { path: CHANGELOG, content: 'Host phenotype: ADR-221' },
    ]);
    expect(counts).toHaveLength(3);
    expect(counts).toEqual(
      expect.arrayContaining([
        { file: PDR_A, adr: 'ADR-9', count: 2 },
        { file: PDR_A, adr: 'ADR-3', count: 1 },
        { file: CHANGELOG, adr: 'ADR-221', count: 1 },
      ]),
    );
  });
});

describe('compareToCensus', () => {
  it('reports nothing when the live counts equal the census', () => {
    const rows = [{ file: PDR_A, adr: 'ADR-9', count: 2 }];
    expect(compareToCensus(rows, rows)).toEqual([]);
  });

  it('reports a new citation: a count above its row, or a carrier with no row', () => {
    expect(
      compareToCensus(
        [
          { file: PDR_A, adr: 'ADR-9', count: 3 },
          { file: PDR_B, adr: 'ADR-1', count: 1 },
        ],
        [{ file: PDR_A, adr: 'ADR-9', count: 2 }],
      ),
    ).toEqual([
      { reason: 'new', file: PDR_A, adr: 'ADR-9', live: 3, census: 2 },
      { reason: 'new', file: PDR_B, adr: 'ADR-1', live: 1, census: 0 },
    ]);
  });

  it('reports a stale census: a count below its row, or a row whose citations are cured', () => {
    expect(
      compareToCensus(
        [{ file: PDR_A, adr: 'ADR-9', count: 1 }],
        [
          { file: PDR_A, adr: 'ADR-9', count: 2 },
          { file: PDR_B, adr: 'ADR-1', count: 4 },
        ],
      ),
    ).toEqual([
      { reason: 'stale', file: PDR_A, adr: 'ADR-9', live: 1, census: 2 },
      { reason: 'stale', file: PDR_B, adr: 'ADR-1', live: 0, census: 4 },
    ]);
  });

  it('catches a swap that keeps the file total: one ADR cured, another cited', () => {
    expect(
      compareToCensus(
        [{ file: PDR_A, adr: 'ADR-221', count: 1 }],
        [{ file: PDR_A, adr: 'ADR-150', count: 1 }],
      ),
    ).toEqual([
      { reason: 'stale', file: PDR_A, adr: 'ADR-150', live: 0, census: 1 },
      { reason: 'new', file: PDR_A, adr: 'ADR-221', live: 1, census: 0 },
    ]);
  });

  it('orders findings by file, then by ADR number rather than by text', () => {
    const findings = compareToCensus(
      [],
      [
        { file: PDR_B, adr: 'ADR-1', count: 1 },
        { file: PDR_A, adr: 'ADR-10', count: 1 },
        { file: PDR_A, adr: 'ADR-9', count: 1 },
      ],
    );
    expect(findings.map((finding) => `${finding.file} ${finding.adr}`)).toEqual([
      `${PDR_A} ADR-9`,
      `${PDR_A} ADR-10`,
      `${PDR_B} ADR-1`,
    ]);
  });

  it('orders ADR numbers too large for an exact double by their digits', () => {
    const findings = compareToCensus(
      [],
      [
        { file: PDR_A, adr: 'ADR-9007199254740993', count: 1 },
        { file: PDR_A, adr: 'ADR-9007199254740992', count: 1 },
      ],
    );
    expect(findings.map((finding) => finding.adr)).toEqual([
      'ADR-9007199254740992',
      'ADR-9007199254740993',
    ]);
  });

  it('with an empty census, is strict: every carrier is new', () => {
    expect(compareToCensus([{ file: CHANGELOG, adr: 'ADR-221', count: 2 }], [])).toEqual([
      { reason: 'new', file: CHANGELOG, adr: 'ADR-221', live: 2, census: 0 },
    ]);
  });
});

describe('parseCensusText', () => {
  const label = 'the census under test';

  it('parses the rows of a well-formed census', () => {
    const text = JSON.stringify({
      $comment: 'why',
      entries: [{ file: PDR_A, adr: 'ADR-9', count: 2 }],
    });
    expect(unwrap(parseCensusText({ label, text }))).toEqual([
      { file: PDR_A, adr: 'ADR-9', count: 2 },
    ]);
  });

  it('accepts the empty census the last cure leaves', () => {
    expect(unwrap(parseCensusText({ label, text: '{ "entries": [] }' }))).toEqual([]);
  });

  it('refuses text that is not JSON, naming the census', () => {
    expect(unwrapErr(parseCensusText({ label, text: '{' })).message).toContain(label);
  });

  it.each([
    ['an unknown top-level key', { entries: [], extra: 1 }],
    ['an unknown row key', { entries: [{ file: PDR_A, adr: 'ADR-9', count: 1, note: 'x' }] }],
    ['a zero count', { entries: [{ file: PDR_A, adr: 'ADR-9', count: 0 }] }],
    ['a negative count', { entries: [{ file: PDR_A, adr: 'ADR-9', count: -1 }] }],
    ['a fractional count', { entries: [{ file: PDR_A, adr: 'ADR-9', count: 1.5 }] }],
  ])('refuses %s, naming the census', (_label, value) => {
    expect(unwrapErr(parseCensusText({ label, text: JSON.stringify(value) })).message).toContain(
      label,
    );
  });

  it('refuses a row that names a file outside the Core', () => {
    const text = JSON.stringify({ entries: [{ file: 'docs/x.md', adr: 'ADR-9', count: 1 }] });
    expect(unwrapErr(parseCensusText({ label, text })).message).toContain(
      'must name a file under .agent/practice-core/',
    );
  });

  it.each(['ADR-09', 'adr-9', 'ADR 9', '9'])('refuses the non-canonical ADR %s', (adr) => {
    const text = JSON.stringify({ entries: [{ file: PDR_A, adr, count: 1 }] });
    expect(unwrapErr(parseCensusText({ label, text })).message).toContain('canonical');
  });

  it('refuses a census that names the same file and ADR twice', () => {
    const text = JSON.stringify({
      entries: [
        { file: PDR_A, adr: 'ADR-9', count: 1 },
        { file: PDR_A, adr: 'ADR-9', count: 2 },
      ],
    });
    expect(unwrapErr(parseCensusText({ label, text })).message).toContain(
      `names a row twice: ${PDR_A} ADR-9`,
    );
  });
});
