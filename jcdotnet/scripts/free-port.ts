import net from "node:net";

/**
 * A port free on the unspecified address (every interface, which is what
 * `next start` binds by default): listen on port 0, read the port the kernel
 * assigned, close. Shared by the PDF generator (which serves the built site
 * to a headless browser) and the Playwright config (which serves it to the
 * suite), so two checkouts on one host never share a fixed port
 * (testing-strategy §Harnesses Adapt to Shared Hosts). The port is released
 * before the caller's server binds it, so a taker in between is possible;
 * both callers fail loudly on a bind failure rather than proving a server
 * they did not start.
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
