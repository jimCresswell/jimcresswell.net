/**
 * The Playwright harness's server: bind a port, build with it, serve the build from it.
 *
 * Started by `e2e-global-setup.ts` in the runner's global setup, one process for the run, in
 * the site directory (`pnpm e2e:server` runs it there by hand). The flow is
 * `e2e-server-flow.ts`, driven here with the real seams: it binds a free port first
 * (`built-site-server.ts`: the socket stays open from here to exit, so no other process can be
 * handed the port and no server on it can be anything but this one), prints `port <n>` on
 * stdout, runs the site's build with `PORT` set so the build's canonical URLs and JSON-LD carry
 * this origin (`lib/site-config.ts`), attaches Next's production server to the bound socket in
 * this process, and prints `ready`. The two Vercel URL variables are cleared for the build and
 * for this serving process, since the site would otherwise give an inherited one precedence
 * over `PORT`. The protocol lines are the only stdout lines this script writes; the build's
 * output goes to stderr, and Next's own request-time logs may reach stdout later, which is why
 * the reader matches whole anchored lines. A termination signal does what the current phase
 * needs (the flow module says what, phase by phase) and exits. Fail-fast at this entry point
 * with the reason (the site workspace has no Result type yet; that follow-on is on the board).
 */
import { spawn } from "node:child_process";

import { attachBuiltSite, bindFreePort } from "./built-site-server";
import { createServerFlow, type BuildRun } from "./e2e-server-flow";

const VERCEL_URL_VARIABLES = ["VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL"] as const;

/** Run the site's build; its stdout and stderr go to this process's stderr. */
function build(): BuildRun {
  const child = spawn("pnpm", ["build"], { stdio: ["ignore", process.stderr, process.stderr] });
  const exited = new Promise<number>((resolve) => {
    child.on("error", (error) => {
      process.stderr.write(`e2e-web-server: the build failed to start: ${error.message}\n`);
      resolve(1);
    });
    child.on("exit", (code, signal) => {
      resolve(code ?? (signal === null ? 0 : 1));
    });
  });
  return {
    exited,
    stop: () => {
      child.kill("SIGTERM");
    },
  };
}

for (const name of VERCEL_URL_VARIABLES) {
  delete process.env[name];
}

const flow = createServerFlow({
  bind: async () => {
    const bound = await bindFreePort();
    process.env.PORT = String(bound.port);
    return bound;
  },
  build,
  attach: attachBuiltSite,
  writeLine: (line) => {
    process.stdout.write(`${line}\n`);
  },
  writeError: (line) => {
    process.stderr.write(`${line}\n`);
  },
  exit: (code) => {
    process.exit(code);
  },
});
process.once("SIGTERM", flow.stop);
process.once("SIGINT", flow.stop);
await flow.run();
