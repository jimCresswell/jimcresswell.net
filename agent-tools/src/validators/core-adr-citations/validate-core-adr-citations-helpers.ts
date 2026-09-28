/**
 * Pure helpers for the Core ADR-citation validator: PDR-105's portability axis,
 * in the strict form the `practice-core-portability` rule gives it.
 *
 * @remarks
 * The Practice Core travels to every Practice-bearing repository; an ADR is
 * one repository's decision. A Core file that names an ADR by its number points
 * at a record that is absent wherever the Core arrives, and the reader is left
 * holding a number with nothing behind it. The rule states it: no file under
 * `.agent/practice-core/` carries an ADR identifier. The reference-direction
 * validator enforces the axis for resolvable markdown links; this validator
 * enforces it for the written identifier, which no link check sees. The cure is
 * the concept named in place of the number, never a deleted sentence.
 *
 * Debt is held by a committed census: one row per (file, ADR) pair still
 * carrying citations, with its exact count. The live counts must equal the
 * census exactly. A count above its row, or a pair with no row, is a new
 * citation and fails; keying by ADR as well as by file means a swap that keeps
 * a file's total (one ADR cured, another cited) fails too. A count below its
 * row is a stale census and fails, because the census edit that records a cure
 * IS the ratchet-down, made in the same change as the cure. An empty census,
 * or none, makes the validator strict: every citation is new.
 *
 * A citation is `ADR`, one separator (an ASCII hyphen, a Unicode hyphen or
 * dash from U+2010 to U+2015, a space or a no-break space) and a number, in any
 * letter case, with no letter or digit on either side. So `_ADR-150_` in
 * underscore emphasis and `adr-7` are citations, while `PDR-105`, `MADR-2`,
 * `ADR-12a` and the bare word `ADRs` are not. Matching runs line by line, so a
 * citation never spans a line break. A citation is keyed by the ADR it names,
 * `ADR-<number>` without leading zeros.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { z } from 'zod';

import { parseJsonTextResult } from '../../core/json.js';
import { parseWithSchema } from '../../core/schema-parse.js';
import { type ScanFile } from '../../core/tracked-file-scan.js';

export type { ScanFile };

/** The census's repo-relative path. */
export const CENSUS_PATH = '.agent/reports/practice-transplant/core-adr-citations-census.json';

/** The Core's directory, with its trailing separator. */
const CORE_PREFIX = '.agent/practice-core/';

/** A citation, capturing the number. */
const ADR_CITATION_SOURCE = String.raw`(?<![\p{L}\p{N}])ADR[-\u2010-\u2015\u00A0 ](\d+)(?![\p{L}\p{N}])`;

/** The canonical key a citation is counted under. */
const CANONICAL_ADR = /^ADR-(?:0|[1-9]\d*)$/u;

/** One ADR citation inside a Core file. */
export interface AdrCitation {
  /** 1-based line number. */
  readonly line: number;
  /** 1-based column of the citation's first character. */
  readonly column: number;
  /** The citation as written. */
  readonly text: string;
  /** The ADR it names, canonical: `ADR-<number>` without leading zeros. */
  readonly adr: string;
}

/** A live count, and a census row: the citations of one ADR in one Core file. */
export interface CitationCount {
  readonly file: string;
  readonly adr: string;
  readonly count: number;
}

/** A divergence between the live counts and the census. */
export interface CensusFinding {
  /** `new`: more citations than the census allows; `stale`: fewer. */
  readonly reason: 'new' | 'stale';
  readonly file: string;
  readonly adr: string;
  readonly live: number;
  readonly census: number;
}

/** True when a repo-relative path is inside the Core. */
export function isCorePath(relativePath: string): boolean {
  return relativePath.startsWith(CORE_PREFIX);
}

/** Every ADR citation in a document, in reading order. */
export function findAdrCitations(content: string): AdrCitation[] {
  const citations: AdrCitation[] = [];
  for (const [index, lineText] of content.split('\n').entries()) {
    for (const match of lineText.matchAll(new RegExp(ADR_CITATION_SOURCE, 'giu'))) {
      citations.push({
        line: index + 1,
        column: match.index + 1,
        text: match[0],
        adr: `ADR-${String(Number.parseInt(match[1] ?? '', 10))}`,
      });
    }
  }
  return citations;
}

function rowKey(row: { readonly file: string; readonly adr: string }): string {
  return `${row.file}\u0000${row.adr}`;
}

/** The live count of every (file, ADR) pair with at least one citation. */
export function countCitations(files: readonly ScanFile[]): CitationCount[] {
  const counts = new Map<string, CitationCount>();
  for (const file of files) {
    for (const { adr } of findAdrCitations(file.content)) {
      const key = rowKey({ file: file.path, adr });
      counts.set(key, { file: file.path, adr, count: (counts.get(key)?.count ?? 0) + 1 });
    }
  }
  return [...counts.values()];
}

function byFileThenAdr(a: CensusFinding, b: CensusFinding): number {
  return (
    a.file.localeCompare(b.file) ||
    Number.parseInt(a.adr.slice(4), 10) - Number.parseInt(b.adr.slice(4), 10)
  );
}

/** The divergence of one pair: none when the two counts agree, else one finding. */
function divergence(
  pair: { readonly file: string; readonly adr: string },
  liveCount: number,
  censusCount: number,
): CensusFinding[] {
  if (liveCount === censusCount) {
    return [];
  }
  const reason = liveCount > censusCount ? 'new' : 'stale';
  return [{ reason, file: pair.file, adr: pair.adr, live: liveCount, census: censusCount }];
}

/**
 * Compare the live counts with the census. Every pair named by either side is
 * compared; a pair absent from one side counts zero there. Sorted by file,
 * then by ADR number.
 */
export function compareToCensus(
  live: readonly CitationCount[],
  census: readonly CitationCount[],
): CensusFinding[] {
  const liveByKey = new Map(live.map((row) => [rowKey(row), row.count]));
  const censusByKey = new Map(census.map((row) => [rowKey(row), row.count]));
  const pairs = new Map([...census, ...live].map((row) => [rowKey(row), row]));
  return [...pairs]
    .flatMap(([key, pair]) => divergence(pair, liveByKey.get(key) ?? 0, censusByKey.get(key) ?? 0))
    .sort(byFileThenAdr);
}

/**
 * The census schema, strict at every level (`strict-validation-at-boundary`):
 * an unknown key is a typo or a stale field, and in a ratchet contract either
 * one means the row does not say what its author thought. A row's count is at
 * least one, because a cured pair leaves the census rather than staying at
 * zero, and its ADR is canonical, so one pair cannot hide under two spellings.
 */
const censusFileSchema = z.strictObject({
  $comment: z.string().optional(),
  entries: z.array(
    z.strictObject({
      file: z.string().startsWith(CORE_PREFIX, `must name a file under ${CORE_PREFIX}`),
      adr: z.string().regex(CANONICAL_ADR, 'must be canonical: ADR-<number>, no leading zero'),
      count: z.number().int().positive(),
    }),
  ),
});

/** Parse the census text into its rows, refusing a pair named twice. */
export function parseCensusText(input: {
  readonly label: string;
  readonly text: string;
}): Result<CitationCount[], Error> {
  const json = parseJsonTextResult(input.text, input.label);
  if (!json.ok) {
    return json;
  }
  const parsed = parseWithSchema({
    label: input.label,
    schema: censusFileSchema,
    value: json.value,
  });
  if (!parsed.ok) {
    return parsed;
  }
  const rows = parsed.value.entries;
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const row of rows) {
    const key = rowKey(row);
    if (seen.has(key)) {
      duplicates.push(`${row.file} ${row.adr}`);
    }
    seen.add(key);
  }
  if (duplicates.length > 0) {
    return err(new Error(`${input.label} names a row twice: ${duplicates.join(', ')}`));
  }
  return ok(rows);
}
