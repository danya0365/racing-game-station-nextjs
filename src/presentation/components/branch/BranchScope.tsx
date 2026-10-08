"use client";

import { Branch, DEFAULT_BRANCH } from "@/src/config/branch.config";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";
import { createContext, ReactNode, useContext } from "react";

/**
 * Branch context — the branch for the current page.
 *
 * Two ways in:
 *  - `branch` prop — the customer pages resolve it from the URL server-side
 *    (app/narathiwas/...), so it is correct on the very first render
 *  - no prop — follows the store, for pages like /backend/control that carry no
 *    branch segment in their URL and should honour the customer's choice
 *
 * Context rather than store-only on purpose: a child's `useEffect` runs BEFORE
 * the parent's, so a store write inside an effect would land after the view's
 * first fetch already read the previous branch. Resolving during render means
 * the first fetch is correct.
 *
 * The store is written too, so header links, the branch bar and the picker all
 * read the same value.
 */
const BranchContext = createContext<Branch | null>(null);

export function BranchScope({
  branch,
  children,
}: {
  /** Omit to follow the customer-selected branch from the store */
  branch?: Branch;
  children: ReactNode;
}) {
  const storeBranch = useBranchStore((s) => s.branch);
  const resolved = branch ?? storeBranch;

  // Write during render, not in an effect: children render after this and may
  // read the store during their own first render. With a URL branch,
  // hasChosen goes true too — landing on /pattani/time-booking IS the choice, so
  // BranchGate should not then ask again. Without one (a URL-less page), the
  // existing flag is left alone; the gate keeps asking until they pick.
  if (branch) {
    const state = useBranchStore.getState();
    if (state.branch.id !== branch.id || !state.hasChosen) {
      useBranchStore.setState({ branch, hasChosen: true, isPickerOpen: false });
      persistBranch(branch.slug);
    }
  }

  return (
    <BranchContext.Provider value={resolved}>{children}</BranchContext.Provider>
  );
}

/**
 * Branch for the page being rendered.
 *
 * Falls back to the store outside a BranchScope, and to DEFAULT_BRANCH when
 * neither is available — callers should be on a branch-scoped page.
 */
export function useActiveBranch(): Branch {
  const fromContext = useContext(BranchContext);
  const storeBranch = useBranchStore((s) => s.branch);
  return fromContext ?? storeBranch ?? DEFAULT_BRANCH;
}

const BRANCH_STORAGE_KEY = "rgs-selected-branch";

function persistBranch(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BRANCH_STORAGE_KEY, slug);
  } catch {
    // non-fatal
  }
}
