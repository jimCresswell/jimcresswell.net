import type { InheritedProcessEnd } from '../repo-check/repo-check-runtime.js';

import type { GateHolderIdentity, GateSlotLimit } from './gate-slot-contract.js';
import type { AdmissionDecision, SlotObservation } from './gate-slot-policy.js';

/**
 * The ports between the gate-slot command and its adapters: what `main`
 * asks of the slot registry and the child runner, and what they report.
 *
 * @packageDocumentation
 */

/** One admission attempt: who is asking, and the verdict to apply under the mutex. */
interface TransactRequest {
  readonly identity: GateHolderIdentity;
  readonly decide: (slots: readonly SlotObservation[]) => AdmissionDecision;
}

/** One admission attempt under the mutex, as the slot adapter reports it. */
export type TransactOutcome =
  | {
      readonly kind: 'decided';
      readonly decision: AdmissionDecision;
      /** Frees the slot an admitted gate holds; does nothing after a wait verdict. */
      readonly release: () => Promise<void>;
    }
  | { readonly kind: 'mutex-busy'; readonly port: number }
  | { readonly kind: 'failed'; readonly message: string };

/** One read of every slot under the mutex, for `status`. */
export type ObserveOutcome =
  | { readonly kind: 'observed'; readonly slots: readonly SlotObservation[] }
  | { readonly kind: 'mutex-busy'; readonly port: number }
  | { readonly kind: 'failed'; readonly message: string };

/** The gated pnpm command and the variables its environment gains. */
export interface ChildRequest {
  readonly args: readonly string[];
  readonly extraEnv: Readonly<Record<string, string>>;
}

/** How a gate child ended, and the bound that stopped it, if one did. */
export interface GateChildEnd {
  readonly end: InheritedProcessEnd;
  readonly stoppedAtBoundMs: number | undefined;
}

/** Everything gate-slot reads from or does to the world, injected. */
export interface GateSlotIo {
  readonly limit: GateSlotLimit;
  /** The real path of the working tree this gate runs in. */
  readonly worktree: string;
  readonly pid: number;
  /** The enclosing gate's slot, when this process runs inside a gate. */
  readonly heldMarker: string | undefined;
  readonly now: () => string;
  /**
   * Under the mutex, observe every slot, apply the request's verdict, and on
   * an admit keep the chosen slot, serving the request's identity on it until
   * released.
   */
  readonly transact: (request: TransactRequest) => Promise<TransactOutcome>;
  readonly observe: () => Promise<ObserveOutcome>;
  /** Run the gated pnpm command, bounded, forwarding termination signals to it. */
  readonly runChild: (request: ChildRequest) => Promise<GateChildEnd>;
  readonly sleep: (milliseconds: number) => Promise<void>;
  readonly stdout: (line: string) => void;
  readonly stderr: (line: string) => void;
}
