"use client";

import { DEFAULT_BRANCH } from "@/src/config/branch.config";
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
 * localStorage. The store is hydrated first, otherwise a first visit would
 * bounce to the default branch and skip the gate's branch prompt.
 */
export function RedirectToBranch({
  path = "",
  fallbackPath,
}: {
  /** Path under the branch prefix, e.g. 'time-booking' */
  path?: string;
  /** Used when there is no chosen branch yet (default: branch home) */
  fallbackPath?: string;
}) {
  const router = useRouter();
  const hasChosen = useBranchStore((s) => s.hasChosen);

  useEffect(() => {
    if (!hasChosen) hydrateBranch();

    const slug = useBranchStore.getState().hasChosen
      ? useBranchStore.getState().branch.slug
      : DEFAULT_BRANCH.slug;
    const suffix = path ? `/${path.replace(/^\//, "")}` : "";
    router.replace(`/${slug}${fallbackPath ?? suffix}`);
  }, [hasChosen, path, fallbackPath, router]);

  // Nothing to show while redirecting — this page exists only to hand off.
  return (
    <div className="min-h-full flex items-center justify-center">
      <p className="text-muted">กำลังพาไปสาขาของคุณ…</p>
    </div>
  );
}
