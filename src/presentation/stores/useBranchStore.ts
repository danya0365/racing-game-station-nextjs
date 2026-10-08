"use client";

import { Branch, BRANCHES, DEFAULT_BRANCH } from "@/src/config/branch.config";
import { create } from "zustand";

interface BranchStore {
  /** Currently active branch — always defined so UI can render a fallback */
  branch: Branch;
  /**
   * Whether the customer has actively chosen a branch.
   *
   * Separate from `branch` because that one defaults to DEFAULT_BRANCH: without
   * this flag "never chose" and "chose Narathiwat" would be indistinguishable,
   * and the first-time picker would never appear.
   *
   * Set by BranchScope when the URL carries a branch — arriving at
   * /pattani/time-booking is itself a choice, so we do not make them pick again.
   */
  hasChosen: boolean;
  /** Set branch by slug (usually read from the URL) */
  setBranchBySlug: (slug: string) => void;
  /** Set branch by ID (when the row came from the DB) */
  setBranchById: (id: string) => void;
  /** Explicit choice — marks hasChosen so the picker stops appearing */
  selectBranch: (branch: Branch) => void;
  /** Forget the choice (used by the "reset" affordance, if added later) */
  clearBranch: () => void;
  /** Whether the branch modal is open — shared by the gate and header badge */
  isPickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
}

const BRANCH_STORAGE_KEY = "rgs-selected-branch";

const BY_SLUG: Record<string, Branch> = {};
const BY_ID: Record<string, Branch> = {};
for (const b of BRANCHES) {
  BY_SLUG[b.slug] = b;
  BY_ID[b.id] = b;
}

/**
 * Branch Store — holds the active branch for customer-facing screens.
 *
 * Scope is intentionally narrow: it only decides WHICH branch the UI talks to.
 * Filtering happens server-side (RPC takes branch_id), so no component has to
 * filter machines/bookings client-side.
 *
 * Persisted so a customer who lands on /narathiwas stays on Narathiwat when
 * they reach a page without the branch prefix.
 */
export const useBranchStore = create<BranchStore>((set, get) => ({
  branch: DEFAULT_BRANCH,
  hasChosen: false,
  isPickerOpen: false,

  setBranchBySlug: (slug) => {
    const found = BY_SLUG[slug];
    if (!found) return;
    // Reaching a branch URL counts as choosing it — no need to ask again.
    if (found.id === get().branch.id && get().hasChosen) return;
    set({ branch: found, hasChosen: true });
    persistBranch(found.slug);
  },

  setBranchById: (id) => {
    const found = BY_ID[id];
    if (!found) return;
    if (found.id === get().branch.id && get().hasChosen) return;
    set({ branch: found, hasChosen: true });
    persistBranch(found.slug);
  },

  selectBranch: (branch) => {
    if (branch.id === get().branch.id && get().hasChosen) return;
    set({ branch, hasChosen: true });
    persistBranch(branch.slug);
  },

  openPicker: () => set({ isPickerOpen: true }),

  closePicker: () => set({ isPickerOpen: false }),

  clearBranch: () => {
    set({ hasChosen: false, isPickerOpen: true });
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(BRANCH_STORAGE_KEY);
    } catch {
      // non-fatal
    }
  },
}));

/**
 * Read the persisted branch on app start (client-side only).
 * Returns false when nothing was stored, so the caller can show the picker.
 */
export function hydrateBranch(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = window.localStorage.getItem(BRANCH_STORAGE_KEY);
    if (saved && BY_SLUG[saved]) {
      useBranchStore.setState({ branch: BY_SLUG[saved], hasChosen: true });
      return true;
    }
  } catch {
    // localStorage blocked — treat as "not chosen yet"
  }
  // First visit on this device — the gate must ask before anything else.
  // Set here rather than in the component's effect so BranchGate stays free of
  // a setState-during-effect (which cascades an extra render on every mount).
  useBranchStore.setState({ isPickerOpen: true });
  return false;
}

function persistBranch(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BRANCH_STORAGE_KEY, slug);
  } catch {
    // non-fatal
  }
}
