import { describe, expect, it } from 'vitest';

import type { HarvestedReview } from './reviewer-legs.js';
import type { IssueComment } from './issue-comments.js';
import { suppressedHoldEvidence, suppressedHolds } from './suppressed-hold.js';

/**
 * The suppressed-findings hold (closure item 5a-vi, the owner's card "block on
 * any finding", item 78, 2026-09-14): a tip-bound, landed, non-self-reply review
 * body declaring N suppressed findings holds the merge while fewer than N
 * distinct findings of that review have a lifting disposition line (a signed
 * comment line by the repository owner or the pull request's author, whose
 * sentence is a cure with its SHA or a rejection; a routing does not lift). A
 * later review on a later tip carrying none lifts it too, because the hold
 * binds the tip.
 */

const TIP = 'a'.repeat(40);
const OLD_TIP = 'b'.repeat(40);
const COPILOT = 'copilot-pull-request-reviewer';
const REVIEW = 'PRR_kwDORH1Wfc7AbCdE';
const SIGNATURE = '— Saffron turns Verdure (c39ad7)';
const URL = 'https://github.com/jimCresswell/jimcresswell.net/pull/77';
/** The pull request's author as `gh pr view` spells an App; GraphQL names its comments by the bare slug. */
const PR_AUTHOR = 'app/jimbot-of-the-devonshire-jimbots';
const BOT_COMMENT_LOGIN = 'jimbot-of-the-devonshire-jimbots';

function closerLook(suppressed: number, overrides: Partial<HarvestedReview> = {}): HarvestedReview {
  return {
    id: REVIEW,
    author: COPILOT,
    state: 'COMMENTED',
    body: `### 🔵 Needs a closer look\n\n<details>\n### Suppressed comments (${String(suppressed)})\n</details>`,
    commitOid: TIP,
    submittedAt: '2026-09-14T09:00:00Z',
    ...overrides,
  };
}

function line(item: string, sentence: string, head: string = TIP.slice(0, 7)): string {
  return `**Over-bar** head SHA:${head} · review ${REVIEW} · a.ts:1 · ${item} — ${sentence}`;
}

function comment(author: string, ...lines: string[]): IssueComment {
  return { author, body: [...lines, '', SIGNATURE].join('\n') };
}

function dispositions(...sentences: string[]): IssueComment {
  return comment(
    'jimCresswell',
    ...sentences.map((sentence, index) =>
      line(`item ${String(index + 1)} of ${String(sentences.length)}`, sentence),
    ),
  );
}

const reading = (
  reviews: readonly HarvestedReview[],
  issueComments: readonly IssueComment[] = [],
) => ({ url: URL, author: PR_AUTHOR, headRefOid: TIP, reviews, issueComments });

describe('suppressedHolds', () => {
  it('holds on a tip-bound closer-look body with suppressed findings and no disposition lines', () => {
    expect(suppressedHolds(reading([closerLook(3)]))).toStrictEqual([
      {
        author: COPILOT,
        state: 'COMMENTED',
        reviewId: REVIEW,
        headRefOid: TIP,
        verdict: 'Needs a closer look',
        suppressed: 3,
        lifted: 0,
      },
    ]);
  });

  it('lifts a finding per cure or rejection line and never per routing line; the hold stands while any remains', () => {
    const partial = suppressedHolds(
      reading(
        [closerLook(3)],
        [
          dispositions(
            'Cured in SHA:9f8e7d6',
            'Routed to the follow-on list',
            'Rejected: does not reproduce',
          ),
        ],
      ),
    );
    expect(partial.map((hold) => [hold.suppressed, hold.lifted])).toStrictEqual([[3, 2]]);

    const lifted = suppressedHolds(
      reading(
        [closerLook(2)],
        [dispositions('Cured in SHA:9f8e7d6', 'Rejected: the falsifier is the cell at a.ts:9')],
      ),
    );
    expect(lifted).toStrictEqual([]);
  });

  it('lifts only from the repository owner or the pull request author, the App under either spelling; any other login lifts nothing', () => {
    const cure = line('item 1 of 1', 'Cured in SHA:9f8e7d6');
    const byStranger = suppressedHolds(
      reading([closerLook(1)], [comment('mallory', cure), comment('Copilot', cure)]),
    );
    expect(byStranger.map((hold) => hold.lifted)).toStrictEqual([0]);

    const byOwner = suppressedHolds(reading([closerLook(1)], [comment('jimcresswell', cure)]));
    expect(byOwner).toStrictEqual([]);

    const byBot = suppressedHolds(reading([closerLook(1)], [comment(BOT_COMMENT_LOGIN, cure)]));
    expect(byBot).toStrictEqual([]);
  });

  it('never reads a bot-suffixed login as the bare login: `jimcresswell[bot]` is not the owner and lifts nothing', () => {
    const cure = line('item 1 of 1', 'Cured in SHA:9f8e7d6');
    const bySuffixed = suppressedHolds(
      reading([closerLook(1)], [comment('jimcresswell[bot]', cure)]),
    );
    expect(bySuffixed.map((hold) => hold.lifted)).toStrictEqual([0]);
  });

  it('never treats the deleted-account sentinel as an identity: with the pull request author unknown, a sentinel-authored line lifts nothing and the owner still lifts', () => {
    const cure = line('item 1 of 1', 'Cured in SHA:9f8e7d6');
    const bySentinel = {
      ...reading([closerLook(1)], [comment('unknown', cure)]),
      author: 'unknown',
    };
    expect(suppressedHolds(bySentinel).map((hold) => hold.lifted)).toStrictEqual([0]);
    const byOwner = {
      ...reading([closerLook(1)], [comment('jimCresswell', cure)]),
      author: 'unknown',
    };
    expect(suppressedHolds(byOwner)).toStrictEqual([]);
  });

  it('counts distinct items, so a finding dispositioned twice lifts once', () => {
    const twice = comment(
      'jimCresswell',
      line('item 1 of 2', 'Cured in SHA:9f8e7d6', TIP),
      line('item 1 of 2', 'Rejected: also', TIP),
    );
    expect(
      suppressedHolds(reading([closerLook(2)], [twice])).map((hold) => hold.lifted),
    ).toStrictEqual([1]);
  });

  it('reads only lines bound to this head and this review: another head or another review id lifts nothing', () => {
    const elsewhere = comment(
      'jimCresswell',
      line('item 1 of 1', 'Cured in SHA:9f8e7d6', OLD_TIP.slice(0, 7)),
      `**Over-bar** head SHA:${TIP.slice(0, 7)} · review PRR_other · a.ts:1 · item 1 of 1 — Cured in SHA:9f8e7d6`,
    );
    expect(
      suppressedHolds(reading([closerLook(1)], [elsewhere])).map((hold) => hold.lifted),
    ).toStrictEqual([0]);
  });

  it('holds nothing for a body on an older tip, a signed self-reply, an unlanded review, or a body declaring none', () => {
    const olderTip = closerLook(4, { commitOid: OLD_TIP });
    const selfReply = closerLook(4, {
      author: 'jimCresswell',
      body: `### Suppressed comments (4)\n\n${SIGNATURE}`,
    });
    const pending = closerLook(4, { state: 'PENDING' });
    const clean = closerLook(0, { body: '### 🔵 Needs a closer look\n\nNo suppressed block.' });
    expect(suppressedHolds(reading([olderTip, selfReply, pending, clean]))).toStrictEqual([]);
  });

  it('holds on an unbounded count, which no disposition line lifts, and says so in its evidence naming the review id (#79 round four)', () => {
    const unbounded = closerLook(0, {
      body: `### 🔵 Needs a closer look\n\n<details>\n### Suppressed comments (${'9'.repeat(400)})\n</details>`,
    });
    const holds = suppressedHolds(
      reading([unbounded], [dispositions('Cured in SHA:9f8e7d6', 'Rejected: no')]),
    );
    expect(holds.map((hold) => [hold.reviewId, hold.suppressed, hold.lifted])).toStrictEqual([
      [REVIEW, null, 2],
    ]);
    const [evidence] = suppressedHoldEvidence(holds);
    expect(evidence).toContain(`review ${REVIEW} on head SHA:aaaaaaa`);
    expect(evidence).toContain(
      'an unbounded count of suppressed finding(s), a count the instrument cannot bound',
    );
    expect(evidence).toContain('no disposition line lifts it');
  });

  it('names the review and its id, the tip, the count and the shortfall in its evidence, one line per holding review', () => {
    const [evidence] = suppressedHoldEvidence([
      {
        author: COPILOT,
        state: 'COMMENTED',
        reviewId: REVIEW,
        headRefOid: TIP,
        verdict: 'Needs a closer look',
        suppressed: 3,
        lifted: 1,
      },
    ]);
    expect(evidence).toContain(`${COPILOT} (COMMENTED), review ${REVIEW} on head SHA:aaaaaaa`);
    expect(evidence).toContain('verdict "Needs a closer look", 3 suppressed finding(s), 1 lifted');
    expect(evidence).toContain('2 remaining');
    expect(evidence).toContain('owner card item 78, 2026-09-14');
  });
});
