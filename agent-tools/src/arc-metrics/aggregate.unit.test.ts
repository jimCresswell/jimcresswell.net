import { describe, expect, it } from 'vitest';

import { aggregateSession } from './aggregate.js';

async function* lines(...values: readonly string[]): AsyncIterable<string> {
  for (const value of values) {
    yield value;
  }
}

function assistant(at: string, id: string, usage: Record<string, number>): string {
  return JSON.stringify({
    type: 'assistant',
    timestamp: at,
    message: { id, usage, content: [{ type: 'tool_use', name: 'Bash' }] },
  });
}

function userTurn(at: string, text: string): string {
  return JSON.stringify({ type: 'user', timestamp: at, message: { content: text } });
}

function event(type: string, at: string, fields: Record<string, unknown> = {}): string {
  return JSON.stringify({ type, timestamp: at, ...fields });
}

const USAGE = {
  input_tokens: 10,
  output_tokens: 100,
  cache_creation_input_tokens: 20,
  cache_read_input_tokens: 300,
};

describe('aggregateSession', () => {
  it('counts one model call per message id, however many entries repeat its usage', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        assistant('2026-09-16T10:00:00Z', 'msg_1', USAGE),
        assistant('2026-09-16T10:00:01Z', 'msg_1', USAGE),
        assistant('2026-09-16T10:00:02Z', 'msg_2', USAGE),
      ),
    });

    expect(session.apiCalls).toBe(2);
    expect(session.outputTokens).toBe(200);
    expect(session.cacheReadTokens).toBe(600);
    expect(session.medianContextTokens).toBe(330);
  });

  it('counts tool uses across every entry, including repeats of one call', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        assistant('2026-09-16T10:00:00Z', 'msg_1', USAGE),
        assistant('2026-09-16T10:00:01Z', 'msg_2', USAGE),
      ),
    });

    expect(session.toolCalls).toBe(2);
  });

  it('counts owner messages from user turns and from mid-turn enqueues', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        userTurn('2026-09-16T10:00:00Z', 'please do the thing'),
        JSON.stringify({
          type: 'queue-operation',
          operation: 'enqueue',
          timestamp: '2026-09-16T10:05:00Z',
          content: 'and also this',
        }),
        JSON.stringify({
          type: 'queue-operation',
          operation: 'remove',
          timestamp: '2026-09-16T10:05:00Z',
          content: 'and also this',
        }),
      ),
    });

    expect(session.ownerMessages).toBe(2);
    expect(session.ownerMessagesMidTurn).toBe(1);
  });

  it('excludes peer relays, limit continues and harness wrappers from owner messages', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        userTurn('2026-09-16T10:00:00Z', 'Another Claude session sent a message: hello'),
        userTurn('2026-09-16T10:01:00Z', 'Your claude.ai usage limit has reset.'),
        userTurn('2026-09-16T10:02:00Z', '<task-notification>done</task-notification>'),
        userTurn('2026-09-16T10:03:00Z', 'the real instruction'),
      ),
    });

    expect(session.ownerMessages).toBe(1);
  });

  it('excludes the bracket spelling of a peer notice, not only the angle-bracket one', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        userTurn('2026-09-16T10:00:00Z', '[Cross-session idle notice] a peer went idle'),
        userTurn(
          '2026-09-16T10:01:00Z',
          '<cross-session-message from="x">hello</cross-session-message>',
        ),
      ),
    });

    expect(session.ownerMessages).toBe(0);
  });

  it('counts what the filter removed, so an empty owner set is never silently a pass', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        userTurn('2026-09-16T10:00:00Z', '<bash-input>git status</bash-input>'),
        userTurn('2026-09-16T10:01:00Z', '(Re-invocation of /jc-wrap — previously loaded)'),
        userTurn('2026-09-16T10:02:00Z', '[Request interrupted by user]'),
      ),
    });

    expect(session.ownerMessages).toBe(0);
    expect(session.ownerMessagesFiltered).toBe(3);
  });

  it('sums only the gaps below the active-time threshold', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        assistant('2026-09-16T10:00:00Z', 'msg_1', USAGE),
        assistant('2026-09-16T10:05:00Z', 'msg_2', USAGE),
        assistant('2026-09-16T12:00:00Z', 'msg_3', USAGE),
        assistant('2026-09-16T12:02:00Z', 'msg_4', USAGE),
      ),
    });

    expect(session.activeSeconds).toBe(420);
    expect(session.wallSeconds).toBe(7320);
  });

  it('counts every timestamped entry as an event, not only turns', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        assistant('2026-09-16T10:00:00Z', 'msg_1', USAGE),
        event('system', '2026-09-16T10:06:00Z', { subtype: 'turn_duration' }),
        event('queue-operation', '2026-09-16T10:12:00Z', { operation: 'dequeue' }),
        assistant('2026-09-16T10:18:00Z', 'msg_2', USAGE),
      ),
    });

    expect(session.activeSeconds).toBe(1080);
  });

  it('measures the gaps between events in time order, which transcript lines are not in', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        assistant('2026-09-16T10:00:00Z', 'msg_1', USAGE),
        assistant('2026-09-16T10:05:00Z', 'msg_2', USAGE),
        assistant('2026-09-16T10:03:00Z', 'msg_3', USAGE),
        assistant('2026-09-16T10:06:00Z', 'msg_4', USAGE),
      ),
    });

    expect(session.activeSeconds).toBe(360);
  });

  it('spans the session from its first event to its last, whatever their class', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        event('attachment', '2026-09-16T09:58:00Z'),
        assistant('2026-09-16T10:00:00Z', 'msg_1', USAGE),
      ),
    });

    expect(session.firstAt).toBe('2026-09-16T09:58:00.000Z');
    expect(session.wallSeconds).toBe(120);
  });

  it('counts compaction summaries and usage-limit stalls', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(
        JSON.stringify({ type: 'user', timestamp: '2026-09-16T10:00:00Z', isCompactSummary: true }),
        JSON.stringify({
          type: 'system',
          timestamp: '2026-09-16T10:10:00Z',
          content: 'Usage limit reached · continuing automatically at 3:30am',
        }),
      ),
    });

    expect(session.compactions).toBe(1);
    expect(session.limitStalls).toBe(1);
  });

  it('skips an unparseable tail line rather than failing the session', async () => {
    const session = await aggregateSession({
      sessionId: 'abc',
      gapSeconds: 600,
      lines: lines(assistant('2026-09-16T10:00:00Z', 'msg_1', USAGE), '{"type":"assist'),
    });

    expect(session.apiCalls).toBe(1);
  });

  it('reports zeroed measures for an empty transcript', async () => {
    const session = await aggregateSession({ sessionId: 'abc', gapSeconds: 600, lines: lines() });

    expect(session).toMatchObject({
      apiCalls: 0,
      activeSeconds: 0,
      wallSeconds: 0,
      firstAt: '',
      medianContextTokens: 0,
    });
  });
});
