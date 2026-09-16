import { describe, expect, it } from 'vitest';

import { buildObservation, readPayload, selectSiblings } from './pre-compact-observation.js';

const BASE = {
  nowIso: '2026-09-16T12:00:00.000Z',
  marker: 'probe-1',
  env: {},
  cwd: '/repo',
  argv: ['node', 'hook.js'],
};

describe('readPayload', () => {
  it('validates the fields the observer uses', () => {
    const read = readPayload(
      JSON.stringify({
        session_id: 'abc',
        transcript_path: '/tmp/abc.jsonl',
        hook_event_name: 'PreCompact',
        trigger: 'auto',
      }),
    );

    expect(read.status).toBe('ok');
    expect(read.known.session_id).toBe('abc');
    expect(read.known.trigger).toBe('auto');
    expect(read.mismatchedFields).toEqual([]);
  });

  it('accepts the payload a bare /compact actually sends, whose custom_instructions is null', () => {
    // The key set and value types of the first real PreCompact payload observed
    // (2026-09-16); the values are neutral stand-ins.
    const read = readPayload(
      JSON.stringify({
        session_id: 'session-id',
        transcript_path: '/transcripts/session-id.jsonl',
        cwd: '/repo',
        scratchpad_dir: '/scratch/session-id',
        prompt_id: 'prompt-id',
        hook_event_name: 'PreCompact',
        trigger: 'manual',
        custom_instructions: null,
      }),
    );

    expect(read.status).toBe('ok');
    expect(read.known.trigger).toBe('manual');
    expect(read.known.custom_instructions).toBeNull();
    expect(read.known.transcript_path).toBe('/transcripts/session-id.jsonl');
    expect(read.keys).toEqual(expect.arrayContaining(['scratchpad_dir', 'prompt_id']));
  });

  it('keeps every valid field when another carries the wrong type, and names the one that did', () => {
    const read = readPayload(
      JSON.stringify({ transcript_path: '/transcripts/session-id.jsonl', trigger: 7 }),
    );

    expect(read.status).toBe('schema-mismatch');
    expect(read.known).toEqual({ transcript_path: '/transcripts/session-id.jsonl' });
    expect(read.mismatchedFields).toEqual(['trigger']);
    expect(read.keys).toEqual(['transcript_path', 'trigger']);
  });

  it('records unknown top-level keys as evidence without consuming them as structure', () => {
    const read = readPayload(JSON.stringify({ session_id: 'abc', mystery_field: { deep: 1 } }));

    expect(read.keys).toContain('mystery_field');
    expect(Object.keys(read.known)).not.toContain('mystery_field');
  });

  it('reports an unparseable payload rather than throwing', () => {
    expect(readPayload('{"session_id":').status).toBe('unparseable-json');
  });

  it('reports an empty payload distinctly from a broken one', () => {
    expect(readPayload('   ').status).toBe('empty');
  });
});

describe('buildObservation', () => {
  it('keeps the raw payload verbatim, which is the whole point of the instrument', () => {
    const rawStdin = '{"session_id":"abc","mystery_field":1}';
    const observation = buildObservation({ ...BASE, rawStdin });

    expect(observation.rawStdin).toBe(rawStdin);
    expect(observation.payloadKeys).toContain('mystery_field');
    expect(observation.event).toBe('PreCompact');
  });

  it('counts the payload in bytes, not characters', () => {
    expect(buildObservation({ ...BASE, rawStdin: '{"a":"é"}' }).rawStdinBytes).toBe(10);
  });

  it('records an absent transcript and no siblings without failing', () => {
    const observation = buildObservation({ ...BASE, rawStdin: '{}' });

    expect(observation.transcriptBytes).toBeUndefined();
    expect(observation.projectSiblings).toEqual([]);
    expect(observation.projectSiblingsTotal).toBeUndefined();
    expect(observation.payloadStatus).toBe('ok');
    expect(observation.mismatchedFields).toEqual([]);
  });

  it('carries the measured siblings and their full count through', () => {
    const observation = buildObservation({
      ...BASE,
      rawStdin: '{}',
      projectSiblings: [
        { name: '.precompact.json', kind: 'file', bytes: 12 },
        { name: 'subagents', kind: 'directory' },
      ],
      projectSiblingsTotal: 40,
    });

    expect(observation.projectSiblings).toEqual([
      { name: '.precompact.json', kind: 'file', bytes: 12 },
      { name: 'subagents', kind: 'directory' },
    ]);
    expect(observation.projectSiblingsTotal).toBe(40);
  });
});

describe('selectSiblings', () => {
  it('sorts the entries by name, caps the list, and reports how many there were in total', () => {
    expect(
      selectSiblings([{ name: 'c.jsonl' }, { name: 'a.jsonl' }, { name: 'b.jsonl' }], 2),
    ).toEqual({ entries: [{ name: 'a.jsonl' }, { name: 'b.jsonl' }], total: 3 });
  });
});
