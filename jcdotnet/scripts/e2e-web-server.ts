/**
 * The Playwright web server: build, then serve, on one port the harness owns throughout.
 *
 * Playwright treats the first server that answers `webServer.url` as the one it started, so
 * the harness must own its port for as long as any other prober could be handed it. The build
 * is such a stretch: `pnpm build` runs the PDF generator, which probes a free port for its own
 * throwaway Next server, and on a Linux runner that probe was handed the port this harness had
 * probed and released (PR #60, CI run 34780744411: the readiness poll accepted the generator's
 * server, the first tests ran against it, then it went away). This script owns the port
 * instead: it takes the port the config probed (`PORT`), binds it with a listener that answers
 * 503 for the whole build (Playwright keeps polling on a 5xx; a bound port cannot be handed to
 * any prober), then closes the listener and starts Next on it. The two hand-offs, the config's
 * probe to this bind and this listener to Next, run with no build in flight, so no prober
 * exists to take the port; a port taken anyway fails the bind loudly. Fail-fast at this entry
 * point: an unusable `PORT`, a taken port or a failed build exits non-zero with the reason (the
 * site workspace has no Result type yet; that follow-on is on the board).
 */
import { spawn } from "node:child_process";
import http from "node:http";

/** The port the config probed, or undefined when the variable is absent or not a port. */
function portFromEnvironment(text: string | undefined): number | undefined {
  if (text === undefined || !/^\d{1,5}$/u.test(text)) {
    return undefined;
  }
  const port = Number(text);
  return port >= 1 && port <= 65535 ? port : undefined;
}

/**
 * Run a command to completion with inherited stdio, in this script's own process group:
 * Playwright stops its web server by killing that group, which takes the whole tree this
 * starts (pnpm, `next start` and the `next-server` child Next forks) and releases the port;
 * a child in a group of its own would outlive that kill and hold the inherited pipes open.
 * A termination signal sent to this script alone is forwarded to the child as well.
 */
function run(command: string, args: readonly string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "inherit" });
    const forward = (signal: NodeJS.Signals): void => {
      child.kill(signal);
    };
    process.once("SIGTERM", forward);
    process.once("SIGINT", forward);
    child.on("error", (error) => {
      process.stderr.write(`e2e-web-server: ${command} failed to start: ${error.message}\n`);
      resolve(1);
    });
    child.on("exit", (code, signal) => {
      process.off("SIGTERM", forward);
      process.off("SIGINT", forward);
      resolve(code ?? (signal === null ? 0 : 1));
    });
  });
}

const port = portFromEnvironment(process.env.PORT);
if (port === undefined) {
  process.stderr.write("e2e-web-server: PORT must carry the port the Playwright config probed\n");
  process.exit(2);
}

const holder = http.createServer((_request, response) => {
  response.statusCode = 503;
  response.setHeader("Retry-After", "1");
  response.end("building");
});
holder.on("error", (error) => {
  process.stderr.write(`e2e-web-server: cannot hold port ${String(port)}: ${error.message}\n`);
  process.exit(1);
});
holder.listen(port, () => {
  void run("pnpm", ["build"]).then((built) => {
    if (built !== 0) {
      process.stderr.write(`e2e-web-server: the build exited ${String(built)}\n`);
      process.exit(built);
    }
    holder.close(() => {
      void run("pnpm", ["start", "--port", String(port)]).then((served) => {
        process.exit(served);
      });
    });
  });
});
