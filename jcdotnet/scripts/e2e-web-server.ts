/**
 * The Playwright harness's server: bind a port, build with it, serve the build from it.
 *
 * Started by `e2e-global-setup.ts` in the runner's global setup, one process for the run, in
 * the site directory (`pnpm e2e:server` runs it there by hand). It binds a free port first
 * (`built-site-server.ts`: the socket stays open from here to exit, so no other process can be
 * handed the port and no server on it can be anything but this one), prints `port <n>` on
 * stdout, runs the site's build with `PORT` set so the build's canonical URLs and JSON-LD carry
 * this origin (`lib/site-config.ts`), attaches Next's production server to the bound socket in
 * this process, and prints `ready`. The two Vercel URL variables are cleared for the build and
 * for this serving process, since the site would otherwise give an inherited one precedence
 * over `PORT`. The protocol lines are the only stdout lines this script writes; the build's
 * output goes to stderr, and Next's own request-time logs may reach stdout later, which is why
 * the reader matches whole anchored lines. A termination signal at any phase stops the build
 * child if one is running, closes the socket if it is serving, and exits. Fail-fast at this
 * entry point with the reason (the site workspace has no Result type yet; that follow-on is on
 * the board).
 */
import { spawn, type ChildProcess } from "node:child_process";

import { attachBuiltSite, bindFreePort } from "./built-site-server";

const VERCEL_URL_VARIABLES = ["VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL"] as const;

/** What a termination signal does in the current phase. */
let onSignal: () => void = () => {
  process.exit(1);
};
const forward = (): void => {
  onSignal();
};
process.once("SIGTERM", forward);
process.once("SIGINT", forward);

/** Run the site's build to completion; its stdout and stderr go to this process's stderr. */
function build(): Promise<number> {
  return new Promise((resolve) => {
    const child: ChildProcess = spawn("pnpm", ["build"], {
      stdio: ["ignore", process.stderr, process.stderr],
    });
    onSignal = () => {
      child.kill("SIGTERM");
      child.once("exit", () => {
        process.exit(1);
      });
    };
    child.on("error", (error) => {
      process.stderr.write(`e2e-web-server: the build failed to start: ${error.message}\n`);
      resolve(1);
    });
    child.on("exit", (code, signal) => {
      resolve(code ?? (signal === null ? 0 : 1));
    });
  });
}

for (const name of VERCEL_URL_VARIABLES) {
  delete process.env[name];
}
const bound = await bindFreePort();
process.env.PORT = String(bound.port);
process.stdout.write(`port ${String(bound.port)}\n`);

const built = await build();
if (built !== 0) {
  process.stderr.write(`e2e-web-server: the build exited ${String(built)}\n`);
  process.exit(built);
}

const close = await attachBuiltSite(bound);
onSignal = () => {
  void close().finally(() => {
    process.exit(0);
  });
};
process.stdout.write("ready\n");
