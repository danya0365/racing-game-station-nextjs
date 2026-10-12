"use client";

import {
  hydrateBranch,
  useBranchStore,
} from "@/src/presentation/stores/useBranchStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * RedirectToBranch — sends an un-prefixed URL to the customer's chosen branch.
 *
 * `/time-booking` and friends still exist as bookmarks, QR codes and links from
 * older copies of the app. Every real page lives under /pattani or /narathiwas,
 * so the bare URL has no branch context: it would show the wrong machines and no
 * branch at all.
 *
 * The redirect has to happen on the client because the chosen branch lives in
 * localStorage, so this waits for the store to be hydrated first.
 *
 * It also waits when there is no choice at all, rather than falling back to the
 * default branch. Falling back won the race against the gate: this page mounted,
 * redirected to DEFAULT_BRANCH, and unmounted the modal in the same few hundred
 * milliseconds — so someone opening a QR code on a first visit never got asked
 * and silently landed on Narathiwat. Waiting costs nothing here (this page is
 * only a hand-off) and leaves the gate as the one thing that decides.
 */
export function RedirectToBranch({
  path = "",
  fallbackPath,
}: {
  /** Path under the branch prefix, e.g. 'time-booking' */
  path?: string;
  /** Used when the branch has no path to preserve */
  fallbackPath?: string;
}) {
  const router = useRouter();
  const hasChosen = useBranchStore((s) => s.hasChosen);

  useEffect(() => {
    if (!useBranchStore.getState().isHydrated) hydrateBranch();
  }, []);

  useEffect(() => {
    // Not hydrated yet, or hydrated with no choice — the gate is asking.
    // Both cases resolve when the customer picks: hasChosen flips and this
    // runs again, now with a branch to redirect to.
    if (!hasChosen) return;

    const suffix = path ? `/${path.replace(/^\//, "")}` : "";
    router.replace(`/${useBranchStore.getState().branch.slug}${fallbackPath ?? suffix}`);
  }, [hasChosen, path, fallbackPath, router]);

  // Nothing to show while the gate decides — this page exists only to hand off.
  return (
    <div className="min-h-full flex items-center justify-center">
      <p className="text-muted">กำลังพาไปสาขาของคุณ…</p>
    </div>
  );
}
