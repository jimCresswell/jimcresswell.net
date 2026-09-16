import { describe, expect, it } from 'vitest';

import {
  buildObservation,
  buildProbeResponse,
  readPayload,
  snapshotEnv,
} from './pre-compact-observation.js';

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

  it('reports a schema mismatch when a used field carries the wrong type', () => {
    const read = readPayload(JSON.stringify({ session_id: 42 }));

    expect(read.status).toBe('schema-mismatch');
    expect(read.keys).toContain('session_id');
  });
});

describe('snapshotEnv', () => {
  it('records allowlisted identifiers and withholds every other value by name', () => {
    const snapshot = snapshotEnv({
      CLAUDE_PROJECT_DIR: '/repo',
      CLAUDE_CODE_OAUTH_TOKEN: 'withheld-value',
      PRACTICE_AGENT_SESSION_ID_CLAUDE: '880ff9',
      PATH: '/usr/bin',
    });

    expect(snapshot.values).toEqual({
      CLAUDE_PROJECT_DIR: '/repo',
      PRACTICE_AGENT_SESSION_ID_CLAUDE: '880ff9',
    });
    expect(snapshot.withheld).toEqual(['CLAUDE_CODE_OAUTH_TOKEN']);
    expect(JSON.stringify(snapshot)).not.toContain('withheld-value');
  });

  it('records the session-shape flags whose value is the finding, and withholds the transport ones', () => {
    const snapshot = snapshotEnv({
      CLAUDE_CODE_CHILD_SESSION: 'true',
      CLAUDE_CODE_SESSION_ATTENDED: 'true',
      CLAUDE_CODE_MESSAGING_TOKEN: 'withheld-value',
      CLAUDE_CODE_MESSAGING_SOCKET: '/withheld/socket.sock',
    });

    expect(snapshot.values).toEqual({
      CLAUDE_CODE_CHILD_SESSION: 'true',
      CLAUDE_CODE_SESSION_ATTENDED: 'true',
    });
    expect(snapshot.withheld).toEqual([
      'CLAUDE_CODE_MESSAGING_SOCKET',
      'CLAUDE_CODE_MESSAGING_TOKEN',
    ]);
    expect(JSON.stringify(snapshot)).not.toContain('withheld-value');
  });

  it('ignores variables outside the CLAUDE and PRACTICE namespaces entirely', () => {
    const snapshot = snapshotEnv({ PATH: '/usr/bin', AWS_SECRET_ACCESS_KEY: 'unused' });

    expect(snapshot.values).toEqual({});
    expect(snapshot.withheld).toEqual([]);
  });
});

describe('buildObservation', () => {
  it('keeps the raw payload verbatim, which is the whole point of the instrument', () => {
    const rawStdin = '{"session_id":"abc","mystery_field":1}';
    const observation = buildObservation({ ...BASE, rawStdin });

    expect(observation.rawStdin).toBe(rawStdin);
    expect(observation.rawStdinBytes).toBe(rawStdin.length);
    expect(observation.payloadKeys).toContain('mystery_field');
    expect(observation.event).toBe('PreCompact');
  });

  it('records an absent transcript and no siblings without failing', () => {
    const observation = buildObservation({ ...BASE, rawStdin: '{}' });

    expect(observation.transcriptBytes).toBeUndefined();
    expect(observation.projectSiblings).toEqual([]);
    expect(observation.payloadStatus).toBe('ok');
  });

  it('carries the measured siblings through', () => {
    const observation = buildObservation({
      ...BASE,
      rawStdin: '{}',
      projectSiblings: [{ name: '.precompact.json', bytes: 12 }],
    });

    expect(observation.projectSiblings).toEqual([{ name: '.precompact.json', bytes: 12 }]);
  });
});

describe('buildProbeResponse', () => {
  it('plants the marker on both response surfaces and never blocks', () => {
    const parsed: unknown = JSON.parse(buildProbeResponse('probe-1'));

    expect(parsed).toMatchObject({
      continue: true,
      systemMessage: '[pre-compact-observe] probe-1',
      hookSpecificOutput: {
        hookEventName: 'PreCompact',
        additionalContext: '[pre-compact-observe] probe-1',
      },
    });
  });
});
