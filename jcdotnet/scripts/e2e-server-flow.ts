/**
 * The harness server's flow, phase by phase, with what a termination signal does in each:
 * before the socket is bound a signal exits 1 (nothing to close); bind the socket and print
 * the port; build (a signal stops the build child, and the flow exits 1 once it has gone,
 * returning rather than exiting a second time); attach the site to the socket (a signal closes
 * the socket and exits 1, since the build child is gone and the site is not yet served); serve
 * (a signal closes the site and exits 0). A build that exits non-zero exits the process with
 * the build's code, the socket left to die with it. The stop action is swapped BEFORE each
 * await, so no phase's signal can act on the previous phase's process: a signal during attach
 * used to call kill on the exited build child and wait for an exit that could not come, leaving
 * the socket open and the runner's teardown hung. `e2e-web-server.ts` wires the real seams; the
 * cells drive fakes over a real bound socket.
 */
import type { BoundSocket } from "./built-site-server";

/** A running build: its exit code, and a way to stop it. */
export interface BuildRun {
  readonly exited: Promise<number>;
  readonly stop: () => void;
}

/** The flow's five seams; the entry script supplies the real ones. */
export interface ServerFlowSeams {
  /** Bind the socket the site will be served from. */
  readonly bind: () => Promise<BoundSocket>;
  /** Start the site's build with the port already in the environment. */
  readonly build: () => BuildRun;
  /** Attach the built site to the socket; resolves with the function that closes it. */
  readonly attach: (bound: BoundSocket) => Promise<() => Promise<void>>;
  /** One protocol line to stdout, without the newline. */
  readonly writeLine: (line: string) => void;
  /** One diagnostic line to stderr, without the newline. */
  readonly writeError: (line: string) => void;
  /** End the process with the code. */
  readonly exit: (code: number) => void;
}

export interface ServerFlow {
  /** The whole flow; resolves once the site is served (or the process has been told to exit). */
  readonly run: () => Promise<void>;
  /** What a termination signal does now; the entry script binds it to SIGTERM and SIGINT. */
  readonly stop: () => void;
}

function closeSocket(bound: BoundSocket): Promise<void> {
  return new Promise((resolve) => {
    bound.server.close(() => {
      resolve();
    });
    bound.server.closeAllConnections();
  });
}

/** The flow over the seams; `stop` acts for the phase `run` is in. */
export function createServerFlow(seams: ServerFlowSeams): ServerFlow {
  let onStop: () => void = () => {
    seams.exit(1);
  };
  const run = async (): Promise<void> => {
    const bound = await seams.bind();
    const closeAndExit = (): void => {
      void closeSocket(bound).finally(() => {
        seams.exit(1);
      });
    };
    onStop = closeAndExit;
    seams.writeLine(`port ${String(bound.port)}`);

    const building = seams.build();
    let stopping = false;
    onStop = () => {
      stopping = true;
      building.stop();
      void building.exited.finally(() => {
        seams.exit(1);
      });
    };
    const built = await building.exited;
    if (stopping) {
      // The stop path exits once the build child has gone; nothing more to do here.
      return;
    }
    // The build child is gone: a signal from here until the site is served closes the socket.
    onStop = closeAndExit;
    if (built !== 0) {
      seams.exit(built);
      return;
    }

    const close = await seams.attach(bound);
    onStop = () => {
      // A close that rejects leaves the socket's state unknown: say so and exit non-zero.
      close().then(
        () => {
          seams.exit(0);
        },
        (error: unknown) => {
          seams.writeError(
            `e2e-web-server: close failed: ${error instanceof Error ? error.message : String(error)}`
          );
          seams.exit(1);
        }
      );
    };
    seams.writeLine("ready");
  };
  return {
    run,
    stop: () => {
      onStop();
    },
  };
}
