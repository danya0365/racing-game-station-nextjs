"use client";

import {
  useBranchStore,
  hydrateBranch,
} from "@/src/presentation/stores/useBranchStore";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useSyncExternalStore } from "react";
import { BranchModal } from "./BranchModal";

/** Staff-only or branch-agnostic pages — the customer gate does not apply */
const EXEMPT_PREFIXES = [
  "/profile",
  "/auth",
  "/docs",
  "/qa-checklist",
  "/qr-scan",
];


/**
 * BranchGate — forces a one-time branch choice, then keeps it switchable.
 *
 * The modal covers the page until a branch is picked, then never appears again
 * on this device (persisted in localStorage). Reaching a branch URL such as
 * /pattani/time-booking counts as a choice — BranchScope marks it — so someone
 * who went straight to a branch is not interrupted.
 *
 * Mounted once from MainLayout, above the header. Both this gate and the
 * header's branch badge drive the same dialog through the store's
 * `isPickerOpen`, so there is only ever one modal.
 */
export function BranchGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPickerOpen = useBranchStore((s) => s.isPickerOpen);
  const hasChosen = useBranchStore((s) => s.hasChosen);
  const closePicker = useBranchStore((s) => s.closePicker);


  // localStorage is unavailable during SSR, so hydration is a client-only
  // fact. Subscribe instead of setting state in an effect: reading it during
  // render would mismatch the server HTML, and writing it in an effect would
  // trigger a cascading re-render on every mount.
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    // First client commit: restore any stored choice, then announce that
    // hydration is done so this component can re-read the snapshot.
    if (!hydrated) {
      hydrateBranch();
      markHydrated();
    }
  }, [hydrated]);

  // NOTE: nothing closes the modal here on purpose. Closing it "when a choice
  // exists" also closed it the instant the header badge opened it, so the
  // switch dialog could never be used. Each opener closes what it opened:
  // BranchModal calls onClose after a pick, BranchScope clears the flag when
  // the URL itself names a branch.

  // /backend and /backend/control are per-branch like the customer pages, so
  // only the genuinely branch-agnostic ones are exempt.
  const isExempt = EXEMPT_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <>
      {children}

      {/* Non-dismissible until a branch is chosen — it is a required step */}
      {hydrated && !isExempt && (
        <BranchModal
          open={isPickerOpen}
          dismissible={hasChosen}
          onClose={closePicker}
        />
      )}
    </>
  );
}

let hydrationListeners: Array<() => void> = [];
let hydrationSnapshot = false;

/**
 * Called by the subscribe callback once, before React reads the snapshot, so
 * `hydrateBranch()` runs in time for the first client render.
 */
function subscribeToHydration(callback: () => void): () => void {
  hydrationListeners.push(callback);
  return () => {
    hydrationListeners = hydrationListeners.filter((l) => l !== callback);
  };
}

function getHydratedSnapshot(): boolean {
  return hydrationSnapshot;
}

/** Server render — always "not hydrated" so the first paint matches */
function getServerSnapshot(): boolean {
  return false;
}

/** Called once from AuthInitializerWrapper-style client boot */
export function markHydrated(): void {
  hydrationSnapshot = true;
  hydrationListeners.forEach((l) => l());
}
