import http from "node:http";

import { stampFor } from "./port-handshake";

/**
 * The header a release request carries: the holder's own stamp, `<port>:<holder pid>`.
 */
export const RELEASE_HEADER = "x-playwright-site-port-release";

/**
 * Bind a free port on the unspecified address (every interface, as `next start` binds) and
 * keep holding it. The prober is the holder: the port is read from the bound socket and the
 * socket stays open, so there is no moment between "the port is chosen" and "the port is
 * held" in which another prober could be handed it. While held, every request is answered
 * 503 (Playwright's web-server check treats only 200 to 403 as available, so it launches the
 * server command and keeps polling) except a DELETE whose release header carries the
 * holder's own stamp, which is answered 204 and closes the listener; a DELETE with any other
 * value is refused 403 and the port stays held. The listener is unreferenced so it never
 * keeps its process alive on its own.
 *
 * @param pid - The holder's pid, stamped with the port to form the release token.
 * @returns The held port.
 */
export function holdFreePort(pid: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const holder = http.createServer((request, response) => {
      const address = holder.address();
      const port = address !== null && typeof address !== "string" ? address.port : undefined;
      if (
        request.method === "DELETE" &&
        port !== undefined &&
        request.headers[RELEASE_HEADER] === stampFor(port, pid)
      ) {
        response.statusCode = 204;
        // Close only once the 204 has left: the callback fires on finish.
        response.end(() => {
          holder.close();
          holder.closeAllConnections();
        });
        return;
      }
      response.statusCode = request.method === "DELETE" ? 403 : 503;
      response.setHeader("Retry-After", "1");
      response.end(request.method === "DELETE" ? "not the holder's stamp" : "held for the build");
    });
    holder.on("error", reject);
    holder.listen(0, () => {
      const address = holder.address();
      if (address === null || typeof address === "string") {
        reject(new Error("Could not determine the held port"));
        return;
      }
      holder.unref();
      resolve(address.port);
    });
  });
}
