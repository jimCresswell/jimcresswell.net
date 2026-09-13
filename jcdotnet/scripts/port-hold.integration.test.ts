import net from "node:net";

import { describe, expect, it } from "vitest";

import { stampFor } from "./port-handshake";
import { HOLDER_HEADER, holdFreePort, RELEASE_HEADER } from "./port-hold";

const HOLDER_PID = 4242;

async function status(port: number, init?: RequestInit): Promise<number> {
  const response = await fetch(`http://localhost:${port}/`, init);
  await response.arrayBuffer();
  return response.status;
}

async function holderHeader(port: number): Promise<string | null> {
  const response = await fetch(`http://localhost:${port}/`);
  await response.arrayBuffer();
  return response.headers.get(HOLDER_HEADER);
}

function release(port: number, pid: number): Promise<number> {
  return status(port, { method: "DELETE", headers: { [RELEASE_HEADER]: stampFor(port, pid) } });
}

function tryListen(port: number): Promise<string> {
  return new Promise((resolve) => {
    const claimer = net.createServer();
    claimer.on("error", (error: NodeJS.ErrnoException) => {
      resolve(error.code ?? "error");
    });
    claimer.listen(port, () => {
      claimer.close(() => {
        resolve("BOUND");
      });
    });
  });
}

async function refuses(port: number): Promise<boolean> {
  try {
    await fetch(`http://localhost:${port}/`);
    return false;
  } catch {
    return true;
  }
}

describe("holdFreePort", () => {
  it("holds the port it chose: a GET is answered 503 and a second listener is refused", async () => {
    const port = await holdFreePort(HOLDER_PID);
    try {
      expect(await status(port)).toBe(503);
      expect(await tryListen(port)).toBe("EADDRINUSE");
    } finally {
      await release(port, HOLDER_PID);
    }
  });

  it("keeps holding on a release that does not carry its own stamp", async () => {
    const port = await holdFreePort(HOLDER_PID);
    try {
      expect(await release(port, HOLDER_PID + 1)).toBe(403);
      expect(await status(port, { method: "DELETE" })).toBe(403);
      expect(await status(port)).toBe(503);
      expect(await tryListen(port)).toBe("EADDRINUSE");
    } finally {
      await release(port, HOLDER_PID);
    }
  });

  it("releases the port on a DELETE carrying its own stamp: nothing answers after and it binds at once", async () => {
    const port = await holdFreePort(HOLDER_PID);
    expect(await release(port, HOLDER_PID)).toBe(204);
    expect(await refuses(port)).toBe(true);
    expect(await tryListen(port)).toBe("BOUND");
  });

  it("names itself: the 503 carries the holder's own stamp, so a caller can tell it from a stranger", async () => {
    const port = await holdFreePort(HOLDER_PID);
    try {
      expect(await holderHeader(port)).toBe(stampFor(port, HOLDER_PID));
    } finally {
      await release(port, HOLDER_PID);
    }
  });
});
