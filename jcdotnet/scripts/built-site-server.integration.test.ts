import net from "node:net";

import { describe, expect, it } from "vitest";

import { attachBuiltSite, bindFreePort, type SitePreparer } from "./built-site-server";

async function status(port: number): Promise<number> {
  const response = await fetch(`http://localhost:${port}/`);
  await response.arrayBuffer();
  return response.status;
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

/** A fake site: answers 200 with the port it was prepared for, so the cell can see the seam. */
const fakeSite: SitePreparer = (port) =>
  Promise.resolve((_request, response) => {
    response.statusCode = 200;
    response.end(`site on ${String(port)}`);
  });

describe("bindFreePort and attachBuiltSite", () => {
  it("holds the port it bound: a GET is answered 503 and a second listener is refused", async () => {
    const bound = await bindFreePort();
    try {
      expect(await status(bound.port)).toBe(503);
      expect(await tryListen(bound.port)).toBe("EADDRINUSE");
    } finally {
      await new Promise<void>((resolve) => {
        bound.server.close(() => {
          resolve();
        });
      });
    }
  });

  it("serves the site from the same listening socket it bound, never closing and reopening it", async () => {
    const bound = await bindFreePort();
    const socketBefore = bound.server;
    const close = await attachBuiltSite(bound, fakeSite);
    try {
      expect(bound.server).toBe(socketBefore);
      expect(bound.server.listening).toBe(true);
      const address = bound.server.address();
      expect(address).not.toBeNull();
      expect(typeof address).toBe("object");
      if (address === null || typeof address === "string") {
        throw new Error("the bound server has no address");
      }
      expect(address.port).toBe(bound.port);
      const response = await fetch(`http://localhost:${bound.port}/`);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe(`site on ${String(bound.port)}`);
      expect(await tryListen(bound.port)).toBe("EADDRINUSE");
    } finally {
      await close();
    }
  });

  it("releases the port only at close: nothing answers after and it binds at once", async () => {
    const bound = await bindFreePort();
    const close = await attachBuiltSite(bound, fakeSite);
    await close();
    expect(bound.server.listening).toBe(false);
    expect(await refuses(bound.port)).toBe(true);
    expect(await tryListen(bound.port)).toBe("BOUND");
  });

  it("closes without waiting on a request whose response is still pending", async () => {
    const bound = await bindFreePort();
    let requestArrived: () => void = () => {};
    const arrived = new Promise<void>((resolve) => {
      requestArrived = resolve;
    });
    // A site that never answers: the request stays in flight until the connection is dropped.
    const hangingSite: SitePreparer = () =>
      Promise.resolve(() => {
        requestArrived();
      });
    const close = await attachBuiltSite(bound, hangingSite);
    const pending = fetch(`http://localhost:${bound.port}/`).then(
      () => "answered",
      () => "dropped"
    );
    await arrived;
    const outcome = await Promise.race([
      close().then(() => "closed"),
      new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve("still waiting");
        }, 2_000);
      }),
    ]);
    expect(outcome).toBe("closed");
    expect(await pending).toBe("dropped");
    expect(bound.server.listening).toBe(false);
  });
});
