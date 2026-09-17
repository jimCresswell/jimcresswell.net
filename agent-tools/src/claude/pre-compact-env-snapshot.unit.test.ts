import { describe, expect, it } from 'vitest';

import { snapshotEnv } from './pre-compact-env-snapshot.js';

describe('snapshotEnv', () => {
  it('records allowlisted identifiers, withholds other values by name, and ignores other namespaces', () => {
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
  });
});
