"use client";

import { Branch, DEFAULT_BRANCH } from "@/src/config/branch.config";
import { persistBranch } from "@/src/lib/branchStorage";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";
import { createContext, ReactNode, useContext, useLayoutEffect } from "react";

/**
 * Branch context — the branch for the current page.
 *
 * Two ways in:
 *  - `branch` prop — the customer pages resolve it from the URL server-side
 *    (app/narathiwas/...), so it is correct on the very first render
 *  - no prop — follows the store, for pages like /backend/control that carry no
 *    branch segment in their URL and should honour the customer's choice
 *
 * The store is written too, so header links, the branch bar and the picker all
 * read the same value — but that write happens in a layout effect, never during
 * render (see below).
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

  // Publish the URL branch to the store in a LAYOUT effect, not during render.
  //
  // Writing during render was the previous behaviour and it warned: MainHeader
  // is an ancestor that subscribes to this store, so updating it mid-render
  // meant React had to schedule a re-render of a component that was already
  // rendered — "Cannot update a component (MainHeader) while rendering a
  // different component (BranchScope)".
  //
  // Layout effect rather than a passive one because both orderings were
  // considered and only this one keeps the guarantee the render-time write was
  // there for. Children whose first fetch depends on the branch read it from
  // CONTEXT (`useActiveBranch()`), which is correct from the first render
  // either way. What the store is for is the components that read it directly —
  // MainHeader's logo and nav links, TimeBookingView's branch buttons — and
  // those live ABOVE this component, so they are painted from their own first
  // render. A passive effect would run after the browser had already shown the
  // previous branch's logo; a layout effect runs after the whole tree commits
  // but before paint, and re-renders synchronously, so the wrong branch is never
  // visible.
  useLayoutEffect(() => {
    if (!branch) return;
    const state = useBranchStore.getState();
    if (state.branch.id !== branch.id || !state.hasChosen) {
      useBranchStore.setState({ branch, hasChosen: true, isPickerOpen: false });
      persistBranch(branch.slug);
    }
  }, [branch]);

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
