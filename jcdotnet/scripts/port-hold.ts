import http from "node:http";

import { stampFor } from "./port-handshake";

/**
 * The header a release request carries: the holder's own stamp, `<port>:<holder pid>`.
 */
export const RELEASE_HEADER = "x-playwright-site-port-release";

/**
 * The header every held response carries: the holder's own stamp, so a caller can tell this
 * holder from any other server on the port before it trusts the port.
 */
export const HOLDER_HEADER = "x-playwright-site-port-holder";

/**
 * Bind a free port on the unspecified address (every interface, as `next start` binds) and
 * keep holding it. The prober is the holder: the port is read from the bound socket and the
 * socket stays open, so there is no moment between "the port is chosen" and "the port is
 * held" in which another prober could be handed it. While held, every request is answered
 * 503 carrying the holder's own stamp (Playwright's web-server check treats only 200 to 403
 * as available, so it launches the server command and keeps polling; the stamp lets the
 * server script authenticate the holder), except a DELETE whose release header carries that
 * same stamp: the listening handle is closed first (`net.Server.close` closes it
 * synchronously; only its callback waits for open connections), so the port binds the moment
 * the 204 arrives, and the connections are dropped once the 204 has left. A DELETE with any
 * other value is refused 403 and the port stays held. The listener is unreferenced so it
 * never keeps its process alive on its own.
 *
 * @param pid - The holder's pid, stamped with the port to form its identity and release token.
 * @returns The held port.
 */
export function holdFreePort(pid: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const holder = http.createServer((request, response) => {
      const address = holder.address();
      const port = address !== null && typeof address !== "string" ? address.port : undefined;
      const stamp = port !== undefined ? stampFor(port, pid) : undefined;
      if (
        request.method === "DELETE" &&
        stamp !== undefined &&
        request.headers[RELEASE_HEADER] === stamp
      ) {
        holder.close();
        response.statusCode = 204;
        response.end(() => {
          holder.closeAllConnections();
        });
        return;
      }
      response.statusCode = request.method === "DELETE" ? 403 : 503;
      response.setHeader("Retry-After", "1");
      if (stamp !== undefined) {
        response.setHeader(HOLDER_HEADER, stamp);
      }
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
