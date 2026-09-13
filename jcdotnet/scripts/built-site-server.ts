import http from "node:http";

import next from "next";

/**
 * Serve the built site from a socket this process binds once and keeps.
 *
 * The port is read from the bound socket and the socket stays open until `close`, so there is
 * no moment between "the port is chosen" and "the site is served" in which another process
 * could be handed the port, and no server on it can be anything but this one: one holder for
 * the socket's whole life. Until the site is attached every request is answered 503.
 * `attachBuiltSite` then prepares Next's production server against the `.next` build in the
 * working directory through Next's custom-server API (`next({ dev: false })`, `prepare()`,
 * `getRequestHandler()`, all in this process) and swaps the handler on the same listening
 * server, so the socket never closes and reopens. `prepareNextSite` itself has no cell; its
 * proof is the site's e2e suite and the PDF build, both of which serve through it.
 *
 * Two consumers, each in its own process: the Playwright harness's server
 * (`e2e-web-server.ts`, which binds before it builds so the build's canonical origin carries
 * the port) and the PDF generator (`generate-pdf.ts`, which binds after the build to render the
 * CV page). `attachBuiltSite` sets in its process what `next start` sets in its own:
 * `NODE_ENV=production` before Next's server is prepared, and `PORT` to the bound port, which
 * `lib/site-config.ts` reads for the site's own URL on routes rendered at request time.
 * Importing `next` installs its require hook in the importing process (a vitest worker running
 * this module's cells included); its aliases are inert outside a Next server.
 */

type Handler = (request: http.IncomingMessage, response: http.ServerResponse) => void;

export interface BoundSocket {
  /** The listening server; the same object serves the hold and, once attached, the site. */
  readonly server: http.Server;
  /** The port the kernel assigned at bind, read from the socket. */
  readonly port: number;
  /** Swap the request handler on the listening server; the socket is untouched. */
  readonly swapHandler: (handler: Handler) => void;
}

/** Prepares the site for the bound port and returns its request handler. */
export type SitePreparer = (port: number) => Promise<Handler>;

const holding: Handler = (_request, response) => {
  response.statusCode = 503;
  response.setHeader("Retry-After", "1");
  response.end("the site is not attached yet");
};

/**
 * Bind a free port on the unspecified address (every interface, as `next start` binds) and
 * keep it, answering 503 until a site is attached.
 */
export function bindFreePort(): Promise<BoundSocket> {
  return new Promise((resolve, reject) => {
    let current: Handler = holding;
    const server = http.createServer((request, response) => {
      current(request, response);
    });
    server.on("error", reject);
    server.listen(0, () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        reject(new Error("Could not determine the bound port"));
        return;
      }
      resolve({
        server,
        port: address.port,
        swapHandler: (handler) => {
          current = handler;
        },
      });
    });
  });
}

/** Next's production server for the `.next` build in the working directory. */
export const prepareNextSite: SitePreparer = async (port) => {
  // Next's global declaration types NODE_ENV read-only; this is the write `next start` makes
  // in its own process. Next reads it when the server is prepared, not when its module is
  // imported (`next.js` consults NODE_ENV only for the non-standard-value warning).
  Object.assign(process.env, { NODE_ENV: "production", PORT: String(port) });
  const app = next({ dev: false, dir: process.cwd(), port, hostname: "localhost" });
  await app.prepare();
  const handle = app.getRequestHandler();
  // Next's own custom-server shape: a handler rejection answers 500 rather than becoming an
  // unhandled rejection that would end the serving process mid-suite.
  return (request, response) => {
    handle(request, response).catch((error: unknown) => {
      process.stderr.write(
        `built-site-server: ${error instanceof Error ? error.message : String(error)}\n`
      );
      if (!response.headersSent) {
        response.statusCode = 500;
      }
      response.end();
    });
  };
};

/**
 * Attach the built site to the bound socket: prepare it, then swap the handler on the same
 * listening server. Returns the function that closes the socket, the only release there is;
 * it drops any connection still open so the close never waits on a lingering request.
 */
export async function attachBuiltSite(
  bound: BoundSocket,
  prepare: SitePreparer = prepareNextSite
): Promise<() => Promise<void>> {
  bound.swapHandler(await prepare(bound.port));
  return () =>
    new Promise((resolve, reject) => {
      bound.server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
      bound.server.closeAllConnections();
    });
}
