import { BRANCH_SLUGS, DEFAULT_BRANCH } from "@/src/config/branch.config";
import { BRANCH_STORAGE_KEY } from "@/src/lib/branchStorage";

/**
 * Branch theme — puts `data-racing` on <html> so the racing theme picks the
 * right accent per branch (นราธิวาส = แดง, ปัตตานี = ทอง).
 *
 * Two parts, because one is not enough:
 *
 *  1. `BranchThemeScript` (this file) — a blocking inline script in <head>. It
 *     covers the FIRST paint, so a cold load never flashes the default branch's
 *     colour. A React effect cannot do this: effects run after the browser has
 *     already painted.
 *
 *  2. `BranchThemeSync` (BranchThemeSync.tsx) — re-applies the attribute when the
 *     path changes. The inline script only runs once per document load, so a
 *     client-side navigation would otherwise leave the previous accent in place.
 *
 * This file deliberately has NO "use client". The root layout is a Server
 * Component, and a directive here would both drag the head script into the
 * client bundle and pull the sync component's hooks into the server graph. The
 * sync half lives in its own file so neither has to compromise.
 */
export function BranchThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}

/**
 * Blocking script for <head>.
 *
 * Must stay a self-contained IIFE string: it is injected as raw text, so it
 * cannot import or reference anything in module scope. Every constant it needs
 * is therefore interpolated here from the same source
 * `resolveBranchSlugFromPath` reads. Values go through JSON.stringify rather
 * than sitting inside double quotes, because a slug containing a quote or a
 * backslash would otherwise break out of the string literal.
 */
const SCRIPT = `(function(){
try {
  var slugs = ${JSON.stringify(BRANCH_SLUGS)};
  var path = window.location.pathname.split("/").filter(Boolean);
  var slug = path.length > 0 && slugs.indexOf(path[0]) > -1 ? path[0] : null;
  if (!slug) {
    var saved = localStorage.getItem(${JSON.stringify(BRANCH_STORAGE_KEY)});
    if (slugs.indexOf(saved) > -1) slug = saved;
  }
  document.documentElement.setAttribute("data-racing", slug || ${JSON.stringify(DEFAULT_BRANCH.slug)});
} catch (e) {
  /* localStorage blocked — leave whatever the server already set */
}
})();`;
