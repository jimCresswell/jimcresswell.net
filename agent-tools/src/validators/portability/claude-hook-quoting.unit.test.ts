import { describe, expect, it } from 'vitest';

import { claudeCommandQuotingIssues, projectDirCommandShapeIssue } from './claude-hook-quoting.js';

const SETTINGS = '.claude/settings.json';

describe('projectDirCommandShapeIssue', () => {
  it('accepts the shapes the settings use: plain words and double-quoted project paths', () => {
    for (const command of [
      'node "${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/run-pretooluse-guard.mjs" agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js',
      '"${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh" "${CLAUDE_PROJECT_DIR}/.claude/hooks/secrets/pretool-secrets.sh"',
      '"${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh" node "${CLAUDE_PROJECT_DIR}/agent-tools/src/bin/claude-pre-compact-observe-hook.ts"',
      'node "${CLAUDE_PROJECT_DIR}/.claude/scripts/statusline-identity.mjs"',
      'node "${CLAUDE_PROJECT_DIR}/tools/eval.mjs" --eval-mode',
      '"${CLAUDE_PROJECT_DIR}/wrap.sh" other.sh -c config',
      'bash "${CLAUDE_PROJECT_DIR}/x.sh"',
    ]) {
      expect(projectDirCommandShapeIssue(command), command).toBeUndefined();
    }
  });

  it('does not check a command that never names the project directory', () => {
    expect(
      projectDirCommandShapeIssue('.claude/hooks/practice-session-identity.mjs'),
    ).toBeUndefined();
    expect(
      projectDirCommandShapeIssue('node "$(git rev-parse --show-toplevel)/x.mjs"'),
    ).toBeUndefined();
  });

  it('reports a reference that is not a whole double-quoted word', () => {
    for (const command of [
      '${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh',
      'node $CLAUDE_PROJECT_DIR/x.mjs',
      "node '${CLAUDE_PROJECT_DIR}/x.mjs'",
      'node "${CLAUDE_PROJECT_DIR-.}/x.mjs"',
      'node "$(dirname "${CLAUDE_PROJECT_DIR}")/x.mjs"',
      'node "${CLAUDE_PROJECT_DIR}/my dir/x.mjs"',
      'D="${CLAUDE_PROJECT_DIR}"; node $D/x.mjs',
    ]) {
      expect(projectDirCommandShapeIssue(command), command).toBe(
        'a word is neither a plain word nor a double-quoted project path',
      );
    }
  });

  it('reports a command that hands the path to a shell or eval to parse again', () => {
    for (const command of [
      'bash -c "${CLAUDE_PROJECT_DIR}/x.sh"',
      'bash -lc "${CLAUDE_PROJECT_DIR}/x.sh"',
      '/bin/sh --noprofile -c "${CLAUDE_PROJECT_DIR}/x.sh"',
      'env zsh -o pipefail -c "${CLAUDE_PROJECT_DIR}/x.sh"',
      'eval "${CLAUDE_PROJECT_DIR}/x.sh"',
    ]) {
      expect(projectDirCommandShapeIssue(command), command).toBe(
        'a shell -c or eval parses the path again',
      );
    }
  });
});

describe('claudeCommandQuotingIssues', () => {
  it('names every hook and the status line whose command is outside the checked shape', () => {
    const settings = {
      hooks: {
        PreToolUse: [
          { matcher: 'Bash', hooks: [{ command: 'node "${CLAUDE_PROJECT_DIR}/a.mjs"' }] },
          { matcher: 'Read', hooks: [{ command: '${CLAUDE_PROJECT_DIR}/b.sh' }] },
        ],
        Stop: [{ hooks: [{ command: 'bash -lc "${CLAUDE_PROJECT_DIR}/c.sh"' }] }],
      },
      statusLine: { command: 'node ${CLAUDE_PROJECT_DIR}/d.mjs' },
    };

    expect(claudeCommandQuotingIssues(settings, SETTINGS)).toEqual([
      '.claude/settings.json: hooks.PreToolUse[1].hooks[0] names CLAUDE_PROJECT_DIR outside the checked shape (a word is neither a plain word nor a double-quoted project path), so a project path holding whitespace or glob characters may not reach the command as one word: ${CLAUDE_PROJECT_DIR}/b.sh',
      '.claude/settings.json: hooks.Stop[0].hooks[0] names CLAUDE_PROJECT_DIR outside the checked shape (a shell -c or eval parses the path again), so a project path holding whitespace or glob characters may not reach the command as one word: bash -lc "${CLAUDE_PROJECT_DIR}/c.sh"',
      '.claude/settings.json: statusLine names CLAUDE_PROJECT_DIR outside the checked shape (a word is neither a plain word nor a double-quoted project path), so a project path holding whitespace or glob characters may not reach the command as one word: node ${CLAUDE_PROJECT_DIR}/d.mjs',
    ]);
  });

  it('skips a hook in the args form, which Claude Code runs with no shell', () => {
    const settings = {
      hooks: {
        Stop: [
          { hooks: [{ command: '${CLAUDE_PROJECT_DIR}/x.sh', args: ['${CLAUDE_PROJECT_DIR}'] }] },
        ],
      },
    };

    expect(claudeCommandQuotingIssues(settings, SETTINGS)).toEqual([]);
  });

  it('reports settings whose hooks do not have the shape Claude Code reads, rather than passing them', () => {
    expect(claudeCommandQuotingIssues({ hooks: { PreToolUse: {} } }, SETTINGS)).toEqual([
      '.claude/settings.json: hooks or statusLine do not have the shape Claude Code reads, so their commands could not be checked for quoting',
    ]);
  });

  it('reports nothing for settings without hooks or a status line', () => {
    expect(claudeCommandQuotingIssues({ permissions: { allow: [] } }, SETTINGS)).toEqual([]);
  });
});
