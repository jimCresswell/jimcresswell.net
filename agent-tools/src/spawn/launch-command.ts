import { shellSingleQuote } from '../core/shell-single-quote.js';
import { type SpawnedWorktree } from './create.js';

/**
 * Render the copy-paste launch command for a freshly-spawned lane (spawn-flow 1E).
 *
 * The command starts a session rooted in the spawned worktree, so the launched
 * session's Bash tool and statusline operate in the worktree natively
 * (launch-in-worktree). The worktree path is single-quoted for shell safety.
 *
 * @remarks
 * Identity is intentionally NOT injected. The Claude `SessionStart` identity hook
 * (`../claude/session-identity-hook.ts`) derives a stable PDR-027 identity from the
 * harness `session_id` and, when the harness provides `$CLAUDE_ENV_FILE`, writes
 * `PRACTICE_AGENT_SESSION_ID_CLAUDE` there for later Bash tool shells; every Bash
 * tool shell also carries the harness-native `CLAUDE_CODE_SESSION_ID`, which the
 * seed CLIs read. Either way a launch-time seed injection is overridden and inert
 * (verified first-hand 2026-06-28; the native fallback added 2026-09-12). The
 * launched session adopts the harness-assigned identity; this is the
 * derive-don't-author path.
 *
 * Native `claude --worktree` is NOT used: that flag CREATES a new git worktree,
 * which would conflict with the worktree spawn already created — the `cd` form
 * enters the existing one.
 */
export function formatLaunchCommand(result: SpawnedWorktree): string {
  return [
    '  Launch this seat (starts a session rooted in the worktree):',
    `    cd ${shellSingleQuote(result.worktreePath)} && claude`,
    '',
  ].join('\n');
}
