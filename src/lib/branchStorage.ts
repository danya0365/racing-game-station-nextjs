/**
 * Branch persistence — the one place that knows how a branch choice is stored.
 *
 * Three callers write and read the same key: the store (when the customer picks
 * in the modal), BranchScope (when the URL names a branch), and the theme script
 * (to pick an accent on the first paint). When those each held their own copy of
 * the key, renaming it or adding a branch meant finding all of them — and the
 * theme script would silently fall back to the default accent if one was missed.
 *
 * `branchStorage.ts` sits in `src/lib/` rather than beside the components: it is
 * plain logic with no React and no store, so all three can depend on it.
 */

import { BRANCH_SLUGS, DEFAULT_BRANCH } from "@/src/config/branch.config";

/** localStorage key holding the slug this device chose. */
export const BRANCH_STORAGE_KEY = "rgs-selected-branch";

/**
 * The stored slug, or null when nothing valid is stored.
 *
 * Rejects unknown slugs so a stale key (a branch that was renamed or removed)
 * cannot put the UI into a state no branch matches.
 */
export function readStoredBranchSlug(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(BRANCH_STORAGE_KEY);
    return saved && (BRANCH_SLUGS as string[]).includes(saved) ? saved : null;
  } catch {
    // localStorage blocked — treat as "nothing stored"
    return null;
  }
}

/** Remember this device's choice. Non-fatal if storage is unavailable. */
export function persistBranch(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BRANCH_STORAGE_KEY, slug);
  } catch {
    // non-fatal
  }
}

/** Forget the choice — the next visit asks again. */
export function clearStoredBranch(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(BRANCH_STORAGE_KEY);
  } catch {
    // non-fatal
  }
}

/**
 * Branch for a URL path: the slug segment when there is one, else this device's
 * stored choice, else the default.
 *
 * `/pattani/time-booking` → "pattani"; `/time-booking` → whatever was chosen.
 * Returns a slug rather than a Branch so the caller can compare it against what
 * is already on <html>.
 */
export function resolveBranchSlugFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && (BRANCH_SLUGS as string[]).includes(segments[0])) {
    return segments[0];
  }
  return readStoredBranchSlug() ?? DEFAULT_BRANCH.slug;
}
