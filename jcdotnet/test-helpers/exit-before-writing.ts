/**
 * A `node -e` script for spawn-topology tests whose child's stdout outlives the child.
 *
 * The process running the script exits at once with code 0 and leaves its stdout to a
 * grandchild that writes `text` only after the process has been reaped:
 * `process.kill(pid, 0)` succeeds on an exited process its parent has not yet reaped and
 * fails once it has, so `text` cannot be written before the parent has reaped the child.
 * A parent that takes the child's `exit` as the end of its output reads none of `text`.
 * Bounded: the grandchild gives up without writing after 2000 polls, 5 ms apart.
 * A second copy of this write-after-reap script lives in
 * `agent-tools/smoke-tests/plan-gate-drift-alert-hook.smoke.ts`; where a helper shared across
 * the two workspaces should live is an open decision.
 *
 * @param text Text the grandchild writes to the stdout it inherits.
 * @returns The script, to pass after `-e`.
 */
export function exitBeforeWriting(text: string): string {
  const writeAfterReap = `
const target = Number(process.argv[1]);
const poll = (remaining) => {
  try {
    process.kill(target, 0);
  } catch {
    process.stdout.write(${JSON.stringify(text)});
    return;
  }
  if (remaining > 0) setTimeout(poll, 5, remaining - 1);
};
poll(2000);
`;
  return `
const { spawn } = require("node:child_process");
spawn(process.execPath, ["-e", ${JSON.stringify(writeAfterReap)}, String(process.pid)], {
  stdio: ["ignore", "inherit", "inherit"],
}).unref();
`;
}
