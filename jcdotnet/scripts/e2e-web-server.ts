/**
 * The Playwright web server: build with the port held, then serve on it.
 *
 * Playwright treats the first server that answers `webServer.url` as the one it started, so
 * the harness owns its port from the moment it is chosen until Next binds it. The config
 * holds it (`port-hold.ts`: the prober is the holder, one listener that stays open answering
 * 503 with its own stamp, so no other prober, the build's PDF generator among them, can be
 * handed it; PR #60 round two found that generator on the harness's port on a Linux runner).
 * This script decides ownership by one bind before it builds. Binding `PORT` refused with
 * EADDRINUSE means something holds the port, and the script identifies it before anything
 * else: the held port must answer 503 carrying the runner's own stamp
 * (`PLAYWRIGHT_SITE_PORT_HANDSHAKE`, inherited from the runner); any other answer is a
 * stranger, and the script exits non-zero before the build, so the failure reaches
 * Playwright's start race at once rather than after a full build (the stamp is a public token,
 * the non-adversarial scope the config header states). The script then builds, releases the holder with that
 * stamp expecting its 204, and confirms the port refuses connections before it starts Next.
 * Binding succeeding means no holder is up (a re-setup inside one long-lived runner, whose
 * holder released on the first run), and the script is the holder for its own build. Either
 * way the port is held through the build. Then Next is started directly on the port. The one
 * unowned moment is Next's boot after the release, about a second in which the port is free
 * on the host; a bind that fails there exits this process non-zero, and Playwright fails the
 * start when that exit precedes a successful readiness poll (its wait races the two).
 * Fail-fast at this entry point with the reason (the site workspace has no Result type yet;
 * that follow-on is on the board).
 */
import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import path from "node:path";

import { HOLDER_HEADER, RELEASE_HEADER } from "./port-hold";

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
 * `taken` on EADDRINUSE (the runner's holder, or a stranger, which identification then tells
 * apart), the listening server otherwise. This holder carries no identity header: nothing is
 * designed to identify it, since it exists only inside this process's own build.
 */
function tryHold(port: number): Promise<http.Server | "taken"> {
  return new Promise((resolve, reject) => {
    const holder = http.createServer((_request, response) => {
      response.statusCode = 503;
      response.setHeader("Retry-After", "1");
      response.end("held for the build");
    });
    holder.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        resolve("taken");
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

/** Why a request to the port failed, for the exit message. */
function failureReason(error: unknown): string {
  return causeCode(error) ?? (error instanceof Error ? error.message : String(error));
}

/**
 * Whether the taken port is this run's holder: a 503 carrying the runner's own stamp. Any
 * other answer, or no answer, names a stranger and stops the script before the build.
 */
async function identifyHolder(port: number, stamp: string): Promise<string | undefined> {
  try {
    const response = await fetch(`http://localhost:${String(port)}/`);
    await response.arrayBuffer();
    if (response.status === 503 && response.headers.get(HOLDER_HEADER) === stamp) {
      return undefined;
    }
    return `port ${String(port)} is held by something that is not this run's holder (status ${String(response.status)})`;
  } catch (error: unknown) {
    return `port ${String(port)} is taken but answered no request (${failureReason(error)})`;
  }
}

/** Ask the runner's holder to release the port; anything but its 204 stops the script. */
async function releaseHeldPort(port: number, stamp: string): Promise<string | undefined> {
  try {
    const response = await fetch(`http://localhost:${String(port)}/`, {
      method: "DELETE",
      headers: { [RELEASE_HEADER]: stamp },
    });
    await response.arrayBuffer();
    return response.status === 204
      ? undefined
      : `port ${String(port)} answered ${String(response.status)} to the release and is not held by this run's holder`;
  } catch (error: unknown) {
    return `the release request to port ${String(port)} failed (${failureReason(error)})`;
  }
}

/** Whether a connection to the port is refused right now (any other failure counts as not). */
function connectionRefused(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect(port, "localhost");
    socket.once("connect", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", (error) => {
      resolve(errnoCode(error) === "ECONNREFUSED");
    });
  });
}

const PORT_FREE_ATTEMPTS = 50;
const PORT_FREE_INTERVAL_MS = 20;

/**
 * Wait, briefly and boundedly, until nothing accepts connections on the port; the holder has
 * stopped listening before its 204, so this normally succeeds at once. A port still answering
 * after the bound is a stranger, and the script stops rather than start Next beside it.
 */
async function awaitPortFree(port: number): Promise<string | undefined> {
  for (let attempt = 0; attempt < PORT_FREE_ATTEMPTS; attempt += 1) {
    if (await connectionRefused(port)) {
      return undefined;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, PORT_FREE_INTERVAL_MS);
    });
  }
  return `port ${String(port)} still accepts connections after the release`;
}

function stop(reason: string, code = 1): never {
  process.stderr.write(`e2e-web-server: ${reason}\n`);
  process.exit(code);
}

const port = portFromEnvironment(process.env.PORT);
const stamp = process.env.PLAYWRIGHT_SITE_PORT_HANDSHAKE;
if (port === undefined || stamp === undefined) {
  stop(
    "PORT and PLAYWRIGHT_SITE_PORT_HANDSHAKE must carry the port the Playwright config holds",
    2
  );
}

const ownHold = await tryHold(port);
if (ownHold === "taken") {
  const stranger = await identifyHolder(port, stamp);
  if (stranger !== undefined) {
    stop(stranger);
  }
}
const built = await run("pnpm", ["build"]);
if (built !== 0) {
  stop(`the build exited ${String(built)}`, built);
}
if (ownHold === "taken") {
  const refused = await releaseHeldPort(port, stamp);
  if (refused !== undefined) {
    stop(refused);
  }
} else {
  await new Promise<void>((resolve) => {
    ownHold.close(() => {
      resolve();
    });
  });
}
const stillHeld = await awaitPortFree(port);
if (stillHeld !== undefined) {
  stop(stillHeld);
}
const nextBin = path.resolve(process.cwd(), "node_modules", ".bin", "next");
process.exit(await run(nextBin, ["start", "--port", String(port)]));
