"use client";

import { BRANCH_SLUGS } from "@/src/config/branch.config";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Whether the first path segment names a branch (as in /pattani/time-booking). */
function hasBranchSegment(pathname: string): boolean {
  const first = pathname.split("/").filter(Boolean)[0];
  return first !== undefined && (BRANCH_SLUGS as string[]).includes(first);
}

/**
 * Re-applies `data-racing` on <html> whenever the active branch changes.
 *
 * The inline script in BranchThemeScript covers the first paint but runs once per
 * document load, so navigating from /narathiwas to /pattani left the previous
 * branch's accent in place. This component is what keeps them in step.
 *
 * Two sources feed it, and both are needed:
 *
 *  - the path, so a client-side navigation between branch URLs repaints
 *  - the store, so switching branches on a page with NO branch segment
 *    repaints too. /backend and /backend/control keep their path when the
 *    branch changes, so watching the path alone left the old accent showing
 *    until a manual refresh.
 *
 * Split from BranchThemeScript because the two need opposite module kinds: that
 * one is imported by the root layout (a Server Component) and must stay free of
 * hooks, while this one uses usePathname and must be a Client Component. Keeping
 * both in one file means a "use client" at the top would drag the head script
 * into the client bundle, and omitting it fails the build outright.
 *
 * Renders nothing. Safe to mount more than once — it writes only when the value
 * actually differs, so it cannot loop.
 */
export function BranchThemeSync() {
  const pathname = usePathname();
  // Subscribing to `branch.slug` is what makes the in-page switch work: the
  // store is written by the branch modal before any navigation happens.
  const storedSlug = useBranchStore((s) => s.branch.slug);

  useEffect(() => {
    // A branch in the URL wins — it is what the user navigated to. Only when the
    // path carries no branch segment do we follow the store, which is how the
    // in-page switch on /backend reaches the DOM.
    //
    // The store value comes from the subscription rather than from localStorage
    // so this cannot disagree with what the rest of the UI just rendered, and
    // so it does not depend on persistBranch having run already.
    const segments = pathname.split("/").filter(Boolean);
    const next = hasBranchSegment(pathname) ? segments[0] : storedSlug;
    if (document.documentElement.getAttribute("data-racing") !== next) {
      document.documentElement.setAttribute("data-racing", next);
    }
  }, [pathname, storedSlug]);

  return null;
}
