import { describe, expect, it } from "vitest";

import { bindFreePort, type BoundSocket } from "./built-site-server";
import {
  createServerFlow,
  type BuildRun,
  type ServerFlow,
  type ServerFlowSeams,
} from "./e2e-server-flow";

interface Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

/** The flow over fake seams and a real bound socket; every step it takes is awaitable. */
interface Harness {
  readonly flow: ServerFlow;
  readonly buildExit: Deferred<number>;
  readonly attachStarted: Promise<BoundSocket>;
  readonly attachClose: Deferred<() => Promise<void>>;
  readonly lines: string[];
  readonly errors: string[];
  readonly exits: number[];
  readonly buildStops: number[];
  readonly bound: Promise<BoundSocket>;
  readonly portPrinted: Promise<void>;
  readonly buildStarted: Promise<void>;
  /** The first exit code the flow hands the exit seam. */
  readonly exited: Promise<number>;
}

function harness(): Harness {
  const buildExit = deferred<number>();
  const attachClose = deferred<() => Promise<void>>();
  const attachStart = deferred<BoundSocket>();
  const boundOnce = deferred<BoundSocket>();
  const portPrinted = deferred<void>();
  const buildStarted = deferred<void>();
  const exited = deferred<number>();
  const lines: string[] = [];
  const errors: string[] = [];
  const exits: number[] = [];
  const buildStops: number[] = [];
  const seams: ServerFlowSeams = {
    bind: async () => {
      const bound = await bindFreePort();
      boundOnce.resolve(bound);
      return bound;
    },
    build: (): BuildRun => {
      buildStarted.resolve();
      return {
        exited: buildExit.promise,
        stop: () => {
          buildStops.push(1);
        },
      };
    },
    attach: (bound) => {
      attachStart.resolve(bound);
      return attachClose.promise;
    },
    writeLine: (line) => {
      lines.push(line);
      if (line.startsWith("port ")) {
        portPrinted.resolve();
      }
    },
    writeError: (line) => {
      errors.push(line);
    },
    exit: (code) => {
      exits.push(code);
      exited.resolve(code);
    },
  };
  return {
    flow: createServerFlow(seams),
    buildExit,
    attachStarted: attachStart.promise,
    attachClose,
    lines,
    errors,
    exits,
    buildStops,
    bound: boundOnce.promise,
    portPrinted: portPrinted.promise,
    buildStarted: buildStarted.promise,
    exited: exited.promise,
  };
}

describe("createServerFlow", () => {
  it("prints the port, builds, attaches and prints ready; a signal once served closes the site and exits 0", async () => {
    const h = harness();
    const running = h.flow.run();
    const bound = await h.bound;
    await h.portPrinted;
    expect(h.lines).toEqual([`port ${String(bound.port)}`]);
    h.buildExit.resolve(0);
    await h.attachStarted;
    const closes: number[] = [];
    h.attachClose.resolve(async () => {
      closes.push(1);
      await new Promise<void>((resolve) => {
        bound.server.close(() => {
          resolve();
        });
      });
    });
    await running;
    expect(h.lines).toEqual([`port ${String(bound.port)}`, "ready"]);
    h.flow.stop();
    expect(await h.exited).toBe(0);
    expect(closes).toEqual([1]);
    expect(h.exits).toEqual([0]);
  });

  it("a close that rejects once served is reported and exits 1, never 0", async () => {
    const h = harness();
    const running = h.flow.run();
    const bound = await h.bound;
    try {
      h.buildExit.resolve(0);
      await h.attachStarted;
      h.attachClose.resolve(() => Promise.reject(new Error("socket state unknown")));
      await running;
      h.flow.stop();
      expect(await h.exited).toBe(1);
      expect(h.errors).toEqual(["e2e-web-server: close failed: socket state unknown"]);
    } finally {
      // The fake close never closes the real socket; the cell does, whatever its assertions say.
      bound.server.close();
    }
  });

  it("a signal during the build stops the build child, and the flow exits 1 once, after the child has gone", async () => {
    const h = harness();
    const running = h.flow.run();
    const bound = await h.bound;
    try {
      await h.buildStarted;
      h.flow.stop();
      expect(h.buildStops).toEqual([1]);
      expect(h.exits).toEqual([]);
      h.buildExit.resolve(1);
      expect(await h.exited).toBe(1);
      await running;
      expect(h.exits).toEqual([1]);
    } finally {
      bound.server.close();
    }
  });

  it("a signal after the build has exited and before the site is attached closes the socket and exits 1, never touching the exited build", async () => {
    const h = harness();
    // run() stays pending on attach for the rest of the cell, by design: the gap is the subject.
    void h.flow.run();
    const bound = await h.bound;
    h.buildExit.resolve(0);
    await h.attachStarted;
    h.flow.stop();
    expect(await h.exited).toBe(1);
    expect(h.buildStops).toEqual([]);
    expect(bound.server.listening).toBe(false);
    expect(h.exits).toEqual([1]);
  });

  it("a failed build exits with the build's code, the socket still bound for the exit", async () => {
    const h = harness();
    const running = h.flow.run();
    const bound = await h.bound;
    h.buildExit.resolve(2);
    await running;
    expect(h.exits).toEqual([2]);
    expect(h.lines).toEqual([`port ${String(bound.port)}`]);
    bound.server.close();
  });
});
