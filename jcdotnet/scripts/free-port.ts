import net from "node:net";

/**
 * A port free on the unspecified address (every interface, which is what
 * `next start` binds by default): listen on port 0, read the port the kernel
 * assigned, close. Used by the PDF generator for the throwaway server it
 * serves the built site from to a headless browser, so two checkouts on one
 * host never share a fixed port (testing-strategy §Harnesses Adapt to Shared
 * Hosts). The port is released before the caller's server binds it, so a
 * taker in between is possible; the caller fails loudly on a bind failure
 * rather than proving a server it did not start. The Playwright harness
 * holds its port instead (`port-hold.ts`).
 */
export function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const addr = srv.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("Could not determine port"));
        return;
      }
      const port = addr.port;
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}
