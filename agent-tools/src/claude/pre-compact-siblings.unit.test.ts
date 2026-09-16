import { describe, expect, it } from 'vitest';

import { selectSiblings } from './pre-compact-siblings.js';

describe('selectSiblings', () => {
  it('sorts the entries by name, caps the list, and reports how many there were in total', () => {
    expect(
      selectSiblings([{ name: 'c.jsonl' }, { name: 'a.jsonl' }, { name: 'b.jsonl' }], 2),
    ).toEqual({ entries: [{ name: 'a.jsonl' }, { name: 'b.jsonl' }], total: 3 });
  });
});
