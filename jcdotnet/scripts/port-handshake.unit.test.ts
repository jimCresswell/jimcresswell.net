import { describe, expect, it } from "vitest";

import { acceptStamp, stampFor } from "./port-handshake";

const runner = { pid: 4242, ppid: 77, isWorker: false };
const worker = { pid: 5151, ppid: 4242, isWorker: true };

describe("acceptStamp", () => {
  it("gives the runner back the port it stamped itself", () => {
    expect(acceptStamp(stampFor(58078, runner.pid), runner)).toBe(58078);
  });

  it("gives a worker the port its parent, the runner, stamped", () => {
    expect(acceptStamp(stampFor(58078, runner.pid), worker)).toBe(58078);
  });

  it("ignores a stamp from the runner's own parent, so a shell cannot forge one", () => {
    expect(acceptStamp(stampFor(1, runner.ppid), runner)).toBeUndefined();
  });

  it("ignores a stamp carrying a worker's own pid or any other pid", () => {
    expect(acceptStamp(stampFor(58078, worker.pid), worker)).toBeUndefined();
    expect(acceptStamp(stampFor(58078, 999999), runner)).toBeUndefined();
    expect(acceptStamp(stampFor(58078, 999999), worker)).toBeUndefined();
  });

  it("treats an absent stamp as absent", () => {
    expect(acceptStamp(undefined, runner)).toBeUndefined();
  });

  it.each([
    "",
    "abc",
    "58078",
    "58078:4242:extra",
    "0x10:4242",
    " 58078 :4242",
    "1e3:4242",
    "58078:abc",
  ])("ignores the malformed stamp %j", (stamp) => {
    expect(acceptStamp(stamp, runner)).toBeUndefined();
  });

  it.each(["0:4242", "65536:4242", "100000:4242"])("ignores the out-of-range stamp %j", (stamp) => {
    expect(acceptStamp(stamp, runner)).toBeUndefined();
  });

  it.each(["1:4242", "65535:4242"])(
    "accepts the boundary stamp %j from the trusted pid",
    (stamp) => {
      expect(acceptStamp(stamp, runner)).toBe(Number(stamp.split(":")[0]));
    }
  );
});
