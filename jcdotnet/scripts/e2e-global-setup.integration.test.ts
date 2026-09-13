import { describe, expect, it } from "vitest";

import { startServer } from "./e2e-global-setup";

describe("startServer", () => {
  it("a command that cannot start rejects with the spawn error and its stop resolves, never hanging on an exit that cannot come", async () => {
    const started = startServer("/nonexistent/e2e-server-binary", [], 5_000);
    await expect(started).rejects.toThrow(/could not be started/u);
  });

  it("a command that exits before ready rejects with its exit code", async () => {
    const started = startServer(process.execPath, ["-e", "process.exit(3)"], 5_000);
    await expect(started).rejects.toThrow(/exited 3 before it was ready/u);
  });

  it("a command that prints port and ready resolves with the origin, and stop ends it", async () => {
    const script = "process.stdout.write('port 4242\\nready\\n'); setInterval(() => {}, 1000);";
    const server = await startServer(process.execPath, ["-e", script], 5_000);
    expect(server.origin).toBe("http://localhost:4242");
    await server.stop();
  });
});
