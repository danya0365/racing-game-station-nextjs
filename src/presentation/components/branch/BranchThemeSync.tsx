"use client";

import { resolveBranchSlugFromPath } from "@/src/lib/branchStorage";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Re-applies `data-racing` on <html> after client-side navigation.
 *
 * The inline script in BranchThemeScript covers the first paint but runs once per
 * document load, so navigating from /narathiwas to /pattani left the previous
 * branch's accent in place. This component is what keeps them in step.
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

  useEffect(() => {
    const next = resolveBranchSlugFromPath(pathname);
    if (document.documentElement.getAttribute("data-racing") !== next) {
      document.documentElement.setAttribute("data-racing", next);
    }
  }, [pathname]);

  return null;
}
