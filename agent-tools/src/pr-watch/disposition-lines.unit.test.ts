import { describe, expect, it } from 'vitest';

import { dispositionLifts, parseDispositionLines } from './disposition-lines.js';

/**
 * The ratified disposition format (pr-lifecycle SKILL §Disposition format): a
 * signed comment carries one line per body-only finding, the bar marker, the
 * reference `head SHA:<sha> · review <id> · <anchor> · <item>`, then the
 * disposition sentence. The machine reads the marker, the reference and, for
 * the suppressed-findings hold alone, the sentence's verb (owner card, item 78,
 * 2026-09-14): a cure or a reasoned rejection lifts a finding, a routing does
 * not.
 */

const SIGNATURE = '— Saffron turns Verdure (c39ad7)';
const HEAD = 'abc1234def5678abc1234def5678abc1234def56';
const REVIEW = 'PRR_kwDORH1Wfc7AbCdE';

function signed(...lines: string[]): string {
  return [...lines, '', SIGNATURE].join('\n');
}

describe('dispositionLifts', () => {
  it.each([
    'Cured in SHA:abc1234',
    'Cured in `SHA:abc1234def5678abc1234def5678abc1234def56`',
    'Rejected: the finding does not reproduce; the falsifier is the cell at line 40',
    'Rejected.',
  ])('a cure or a reasoned rejection lifts: %j', (sentence) => {
    expect(dispositionLifts(sentence)).toBe(true);
  });

  it.each([
    'Routed to .agent/memory/operational/threads/closure-lane-a.next-session.md',
    'Routed to the 2a follow-on list',
    'Cured in the next push',
    'Cured in SHA:abc1234xyz',
    'Cured in `SHA:abc1234',
    'Cured in SHA:abc1234`',
    'Rejection pending',
    '',
    'see above',
  ])(
    'a routing, a cure without its SHA, or a sentence without the verb does not lift: %j',
    (sentence) => {
      expect(dispositionLifts(sentence)).toBe(false);
    },
  );
});

describe('parseDispositionLines', () => {
  it('reads each marked line of a signed comment: the head, the review id, the anchor, the item and the sentence', () => {
    const body = signed(
      'Dispositions for the round on this tip:',
      '',
      `**Over-bar** head SHA:${HEAD.slice(0, 7)} · review ${REVIEW} · agent-tools/src/x.ts:40 · item 1 of 3 — Cured in SHA:9f8e7d6`,
      `**In scope, below-bar on prong two.** head SHA:${HEAD} · review ${REVIEW} · docs/a.md:12 · item 2 of 3 — Routed to the 2a follow-on list`,
      `**Below-bar** head SHA:${HEAD.slice(0, 12)} · review ${REVIEW} · agent-tools/src/y.ts:7 · thread PRRT_1 — Rejected: does not reproduce, the falsifier is the cell at y.ts:9`,
    );
    expect(parseDispositionLines(body)).toStrictEqual([
      {
        headSha: HEAD.slice(0, 7),
        reviewId: REVIEW,
        anchor: 'agent-tools/src/x.ts:40',
        item: 'item 1 of 3',
        sentence: 'Cured in SHA:9f8e7d6',
      },
      {
        headSha: HEAD,
        reviewId: REVIEW,
        anchor: 'docs/a.md:12',
        item: 'item 2 of 3',
        sentence: 'Routed to the 2a follow-on list',
      },
      {
        headSha: HEAD.slice(0, 12),
        reviewId: REVIEW,
        anchor: 'agent-tools/src/y.ts:7',
        item: 'thread PRRT_1',
        sentence: 'Rejected: does not reproduce, the falsifier is the cell at y.ts:9',
      },
    ]);
  });

  it('reads no line from an unsigned comment, however well formed', () => {
    const body = `**Over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:1 · item 1 of 1 — Cured in SHA:9f8e7d6\n`;
    expect(parseDispositionLines(body)).toStrictEqual([]);
  });

  it('skips a line whose marker is not the bar marker, or whose reference is incomplete', () => {
    const body = signed(
      `**Not over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:1 · item 1 of 4 — Cured in SHA:9f8e7d6`,
      `**Over-bar** head SHA:${HEAD} · a.ts:1 · item 2 of 4 — Cured in SHA:9f8e7d6`,
      `Over-bar head SHA:${HEAD} · review ${REVIEW} · a.ts:1 · item 3 of 4 — Cured in SHA:9f8e7d6`,
      `**Over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:1 · item 4 of 4 — Cured in SHA:9f8e7d6`,
    );
    expect(parseDispositionLines(body).map((line) => line.item)).toStrictEqual(['item 4 of 4']);
  });

  it('reads a line whose sentence lacks the verb as a line with an empty sentence: counted by the marker, lifting nothing', () => {
    const body = signed(`**Over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:1 · item 1 of 1`);
    expect(parseDispositionLines(body)).toStrictEqual([
      { headSha: HEAD, reviewId: REVIEW, anchor: 'a.ts:1', item: 'item 1 of 1', sentence: '' },
    ]);
  });

  it('splits at the first separator, never at a verb: an item that begins with a verb is the item, and a routed sentence does not lift', () => {
    const body = signed(
      `**Over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:1 · Rejected promise not awaited — Routed to the follow-on list`,
      `**Over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:2 · item 2 of 2: Cured in SHA:9f8e7d6`,
    );
    const lines = parseDispositionLines(body);
    expect(lines.map((entry) => [entry.item, entry.sentence])).toStrictEqual([
      ['Rejected promise not awaited', 'Routed to the follow-on list'],
      ['item 2 of 2: Cured in SHA:9f8e7d6', ''],
    ]);
    expect(lines.map((entry) => dispositionLifts(entry.sentence))).toStrictEqual([false, false]);
  });

  it('reads a comment an outsider can shape, a long run of spaces inside the item, as one line with no sentence', () => {
    // The measured super-linear shape (the code-expert's probe, 2026-09-14): an
    // item of spaces with no separator and no verb; the split walks it once. The
    // time bound is structural (no pattern over comment text), never a clock in
    // the gated suite.
    const body = signed(
      `**Over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:1 · item${' '.repeat(60_000)}x`,
    );
    const lines = parseDispositionLines(body);
    expect(lines.map((entry) => [entry.item.length > 60_000, entry.sentence])).toStrictEqual([
      [true, ''],
    ]);
  });

  it('reads no line from a reference whose anchor or item is empty, so an empty item never counts as a distinct lifted finding', () => {
    const body = signed(
      `**Over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:1 ·  — Cured in SHA:9f8e7d6`,
      `**Over-bar** head SHA:${HEAD} · review ${REVIEW} ·   · item 1 of 1 — Cured in SHA:9f8e7d6`,
      `**Over-bar** head SHA:${HEAD} · review ${REVIEW} · a.ts:2 · item 2 of 2 — Cured in SHA:9f8e7d6`,
    );
    expect(parseDispositionLines(body).map((entry) => entry.item)).toStrictEqual(['item 2 of 2']);
  });
});
