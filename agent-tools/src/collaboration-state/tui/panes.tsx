import { Box, Text } from 'ink';

import { type CollaborationTuiSnapshot } from './snapshot.js';
import { type TuiAgentEntry, type TuiMainEntry, type TuiQueueEntry } from './entry-types.js';

const VISIBLE_ROWS = 6;
type StatusTone = 'active' | 'success' | 'warning' | 'danger' | 'muted';

export function MainPane({
  entries,
  active,
}: {
  readonly entries: readonly TuiMainEntry[];
  readonly active: boolean;
}): React.JSX.Element {
  return (
    <Panel title={paneTitle('Main comms', active)}>
      {entries.length === 0 ? (
        <EmptyState>No shared comms.</EmptyState>
      ) : (
        entries.map(renderMainEntry)
      )}
    </Panel>
  );
}

export function AgentsPane({
  entries,
  active,
}: {
  readonly entries: readonly TuiAgentEntry[];
  readonly active: boolean;
}): React.JSX.Element {
  return (
    <Panel title={paneTitle('Agents', active)}>
      {entries.length === 0 ? (
        <EmptyState>No agent activity.</EmptyState>
      ) : (
        entries.map(renderAgentEntry)
      )}
    </Panel>
  );
}

export function QueuePane({
  entries,
  active,
}: {
  readonly entries: readonly TuiQueueEntry[];
  readonly active: boolean;
}): React.JSX.Element {
  return (
    <Panel title={paneTitle('Commit queue', active)}>
      {entries.length === 0 ? (
        <EmptyState>No queue entries.</EmptyState>
      ) : (
        entries.map(renderQueueEntry)
      )}
    </Panel>
  );
}

export function DirectedPane({
  entries,
  active,
}: {
  readonly entries: CollaborationTuiSnapshot['directed'];
  readonly active: boolean;
}): React.JSX.Element {
  return (
    <Panel title={paneTitle('Directed', active)}>
      {entries.length === 0 ? (
        <EmptyState>No directed messages.</EmptyState>
      ) : (
        entries.map(renderDirectedEntry)
      )}
    </Panel>
  );
}

export function visible<TEntry>(entries: readonly TEntry[], offset: number): readonly TEntry[] {
  const maxOffset = Math.max(0, entries.length - VISIBLE_ROWS);
  return entries.slice(Math.min(offset, maxOffset), Math.min(offset, maxOffset) + VISIBLE_ROWS);
}

function renderMainEntry(entry: TuiMainEntry): React.JSX.Element {
  return (
    <Box key={entry.id} flexDirection="column">
      <Text>
        <StatusBadge tone={entry.kind === 'lifecycle' ? 'warning' : 'active'}>
          {entry.kind}
        </StatusBadge>{' '}
        {entry.title}
      </Text>
      <Text dimColor>{entry.created_at}</Text>
      <Text>{truncate(entry.body)}</Text>
    </Box>
  );
}

function renderAgentEntry(entry: TuiAgentEntry): React.JSX.Element {
  return (
    <Box key={entry.routing_key} flexDirection="column">
      <Text>
        <StatusBadge tone={agentTone(entry)}>{entry.visibility_status}</StatusBadge>{' '}
        {entry.routing_key}
      </Text>
      <Text dimColor>
        claims {entry.claim_count} queue {entry.queue_count} closed {entry.closed_claim_count}
      </Text>
      {entry.latest_intent === undefined ? null : <Text>{truncate(entry.latest_intent)}</Text>}
    </Box>
  );
}

function renderQueueEntry(entry: TuiQueueEntry): React.JSX.Element {
  return (
    <Box key={entry.intent_id} flexDirection="column">
      <Text>
        <StatusBadge tone={queueTone(entry)}>{entry.status}</StatusBadge> {entry.commit_subject}
      </Text>
      <Text dimColor>
        {entry.phase} expires {entry.expires_at}
      </Text>
    </Box>
  );
}

function renderDirectedEntry(
  entry: CollaborationTuiSnapshot['directed'][number],
): React.JSX.Element {
  return (
    <Box key={entry.id} flexDirection="column">
      <Text>
        <StatusBadge tone="active">{entry.kind}</StatusBadge> {entry.subject}
      </Text>
      <Text dimColor>
        {entry.from}
        {' -> '}
        {entry.to}
      </Text>
      <Text>{truncate(entry.body)}</Text>
    </Box>
  );
}

function paneTitle(label: string, active: boolean): string {
  return active ? `> ${label}` : label;
}

function agentTone(entry: TuiAgentEntry): StatusTone {
  if (entry.collision_status === 'collision') {
    return 'danger';
  }
  if (entry.visibility_status === 'active') {
    return 'success';
  }
  if (entry.visibility_status === 'stale') {
    return 'warning';
  }

  return 'muted';
}

function queueTone(entry: TuiQueueEntry): StatusTone {
  if (entry.status === 'active') {
    return 'success';
  }
  if (entry.status === 'expired') {
    return 'warning';
  }

  return 'muted';
}

function Panel({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}): React.JSX.Element {
  const active = title.startsWith('>');
  return (
    <Box
      borderStyle="single"
      borderColor={active ? 'cyan' : 'gray'}
      flexDirection="column"
      paddingX={1}
      width={56}
    >
      <Text bold color={active ? 'cyan' : undefined}>
        {title}
      </Text>
      {children}
    </Box>
  );
}

function EmptyState({ children }: { readonly children: React.ReactNode }): React.JSX.Element {
  return <Text dimColor>{children}</Text>;
}

function StatusBadge({
  tone,
  children,
}: {
  readonly tone: StatusTone;
  readonly children: React.ReactNode;
}): React.JSX.Element {
  return <Text color={toneColor(tone)}>[{children}]</Text>;
}

function toneColor(tone: StatusTone): string | undefined {
  const colors: Record<StatusTone, string | undefined> = {
    active: 'cyan',
    success: 'green',
    warning: 'yellow',
    danger: 'red',
    muted: undefined,
  };

  return colors[tone];
}

function truncate(value: string): string {
  const oneLine = value.replaceAll(/\s+/g, ' ').trim();
  return oneLine.length > 96 ? `${oneLine.slice(0, 93)}...` : oneLine;
}
