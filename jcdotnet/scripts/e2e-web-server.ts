/**
 * The Playwright web server: build with the port held, then serve on it.
 *
 * Playwright treats the first server that answers `webServer.url` as the one it started, so
 * the harness owns its port from the moment it is chosen until Next binds it. The config
 * holds it (`port-hold.ts`: the prober is the holder, one listener that stays open answering
 * 503, so no other prober, the build's PDF generator among them, can be handed it; PR #60
 * round two found that generator on the harness's port on a Linux runner). This script
 * decides ownership by one bind before it builds: binding `PORT` refused with EADDRINUSE
 * means the runner's holder is up, and the script builds, then releases the holder with the
 * runner's own stamp (`PLAYWRIGHT_SITE_PORT_HANDSHAKE`, inherited from the runner) and
 * expects the holder's 204; binding succeeding means no holder is up (a re-setup inside one
 * long-lived runner, whose holder released on the first run), and the script is the holder
 * for its own build. Either way the port is held through the build. Then Next is started
 * directly on the port. The one unowned moment is Next's boot after the release, about a
 * second in which the port is free on the host; a bind that fails there exits this process
 * non-zero, and Playwright fails the start when that exit precedes a successful readiness
 * poll (its wait races the exit against the poll). Anything other than the holder's 204 to
 * the release (a stranger on the port) and any release failure other than a refused
 * connection exit non-zero before Next starts. Fail-fast at this entry point with the reason
 * (the site workspace has no Result type yet; that follow-on is on the board).
 */
import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";

import { RELEASE_HEADER } from "./port-hold";

/** The port the config holds, or undefined when the variable is absent or not a port. */
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
 * starts (`next start` and the `next-server` child Next forks) and releases the port; a
 * child in a group of its own would outlive that kill and hold the inherited pipes open. A
 * termination signal sent to this script alone is forwarded to the child as well.
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

/**
 * Bind the port as this script's own holder (a 503 responder), or learn that it is taken:
 * `runner-holds` on EADDRINUSE (the runner's holder, or a stranger, which the release step
 * then tells apart), the listening server otherwise.
 */
function tryHold(port: number): Promise<http.Server | "runner-holds"> {
  return new Promise((resolve, reject) => {
    const holder = http.createServer((_request, response) => {
      response.statusCode = 503;
      response.setHeader("Retry-After", "1");
      response.end("held for the build");
    });
    holder.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        resolve("runner-holds");
        return;
      }
      reject(error);
    });
    holder.listen(port, () => {
      resolve(holder);
    });
  });
}

/** The `code` a system error carries, or undefined for any other value. */
function errnoCode(value: unknown): string | undefined {
  return value instanceof Error && "code" in value && typeof value.code === "string"
    ? value.code
    : undefined;
}

/** The error code beneath a failed fetch, from its cause or the first aggregated cause. */
function causeCode(error: unknown): string | undefined {
  const cause = error instanceof Error ? error.cause : undefined;
  if (cause instanceof AggregateError) {
    const first: unknown = cause.errors[0];
    return errnoCode(first);
  }
  return errnoCode(cause);
}

/**
 * Ask the runner's holder to release the port. `released` on the holder's 204; otherwise the
 * reason the script must stop: a status a stranger answered, or a connection failure that is
 * not a plain refusal (a refusal after the bind was refused means the holder went away in the
 * build, which is also a stop).
 */
async function releaseHeldPort(port: number, stamp: string): Promise<"released" | string> {
  try {
    const response = await fetch(`http://localhost:${String(port)}/`, {
      method: "DELETE",
      headers: { [RELEASE_HEADER]: stamp },
    });
    await response.arrayBuffer();
    return response.status === 204
      ? "released"
      : `port ${String(port)} answered ${String(response.status)} to the release and is not held by this run's holder`;
  } catch (error: unknown) {
    const code = causeCode(error) ?? (error instanceof Error ? error.message : String(error));
    return `the release request to port ${String(port)} failed (${code})`;
  }
}

const port = portFromEnvironment(process.env.PORT);
const stamp = process.env.PLAYWRIGHT_SITE_PORT_HANDSHAKE;
if (port === undefined || stamp === undefined) {
  process.stderr.write(
    "e2e-web-server: PORT and PLAYWRIGHT_SITE_PORT_HANDSHAKE must carry the port the Playwright config holds\n"
  );
  process.exit(2);
}

const ownHold = await tryHold(port);
const built = await run("pnpm", ["build"]);
if (built !== 0) {
  process.stderr.write(`e2e-web-server: the build exited ${String(built)}\n`);
  process.exit(built);
}
if (ownHold === "runner-holds") {
  const release = await releaseHeldPort(port, stamp);
  if (release !== "released") {
    process.stderr.write(`e2e-web-server: ${release}\n`);
    process.exit(1);
  }
} else {
  await new Promise<void>((resolve) => {
    ownHold.close(() => {
      resolve();
    });
  });
}
const nextBin = path.resolve(process.cwd(), "node_modules", ".bin", "next");
process.exit(await run(nextBin, ["start", "--port", String(port)]));
