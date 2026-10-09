"use client";

import { BRANCHES, Branch } from "@/src/config/branch.config";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import { Portal } from "../ui/Portal";

interface BranchModalProps {
  open: boolean;
  /** False on first visit — the customer must pick, so there is no dismiss */
  dismissible: boolean;
  onClose: () => void;
}

/**
 * BranchModal — pick or switch branch.
 *
 * Two behaviours, same dialog:
 *  - first visit (dismissible=false): covers the page until a branch is chosen
 *  - later (dismissible=true): opened from the header's branch badge
 *
 * Switching rewrites the current path's branch prefix so the customer keeps the
 * page they were on, just at the other branch.
 */
export function BranchModal({ open, dismissible, onClose }: BranchModalProps) {
  const router = useRouter();
  const currentBranch = useBranchStore((s) => s.branch);
  const selectBranch = useBranchStore((s) => s.selectBranch);

  // Escape closes only when dismissible — a forced choice can't be escaped.
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  const handleSelect = (branch: Branch) => {
    if (branch.id === currentBranch.id) {
      if (dismissible) onClose();
      return;
    }
    selectBranch(branch);
    // A branch-prefixed URL moves to the same page at the new branch. On a page
    // with no branch segment — /backend/control — stay put and let it re-read
    // the store, so staff keep their panel instead of landing on the customer
    // home page.
    const nextPath = swapBranchInPath(branch.slug);
    if (nextPath) router.push(nextPath);
    onClose();
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="เลือกสาขา"
      >
        {/* Backdrop — non-dismissible on first visit */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-backdrop-in"
          onClick={dismissible ? onClose : undefined}
        />

        <div className="racing-panel-solid relative w-full max-w-md rounded-2xl overflow-hidden animate-modal-in">
          <div className="racing-panel-top p-5 border-b border-racing-line flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-racing-fg">เลือกสาขา</h2>
              {!dismissible && (
                <p className="text-xs text-racing-fg-2 mt-0.5">
                  เลือกสาขาที่ต้องการใช้บริการ — เปลี่ยนได้ตลอดเวลา
                </p>
              )}
            </div>
            {dismissible && (
              <button
                onClick={onClose}
                className="text-racing-fg-3 hover:text-racing-fg transition-colors text-xl leading-none"
                type="button"
                aria-label="ปิด"
              >
                ✕
              </button>
            )}
          </div>

          <div className="p-4 space-y-3">
            {BRANCHES.map((branch) => {
              const isCurrent = branch.id === currentBranch.id;
              return (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch)}
                  type="button"
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isCurrent
                      ? "border-racing-flag bg-racing-flag-dim"
                      : "border-racing-line bg-racing-panel hover:border-racing-flag hover:bg-racing-flag-dim"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Each branch's own mark — this dialog shows both at once,
                        so the logo is what distinguishes them, not just text. */}
                    <Image
                      src={branch.logo}
                      alt=""
                      width={92}
                      height={24}
                      className="h-6 w-auto max-w-23 object-contain object-left shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-racing-fg truncate">
                        สาขา{branch.shortName}
                      </p>
                      <p className="text-xs text-racing-fg-2 truncate">
                        {branch.name}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-racing-flag-dim text-racing-flag font-medium shrink-0">
                        สาขาปัจจุบัน
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {dismissible && (
            <div className="p-4 border-t border-racing-line bg-racing-panel-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-racing-line text-sm text-racing-fg-2 hover:text-racing-fg hover:border-racing-flag transition-colors"
                type="button"
              >
                ยกเลิก
              </button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}

/**
 * Replace the branch segment in the current path: /pattani/time-booking
 * + narathiwas → /narathiwas/time-booking. Paths without a known branch prefix
 * (e.g. /backend) go to the branch home.
 */
function swapBranchInPath(slug: string): string | null {
  if (typeof window === "undefined") return null;
  const segments = window.location.pathname.split("/").filter(Boolean);
  const known = BRANCHES.map((b) => b.slug);
  if (segments.length > 0 && known.includes(segments[0])) {
    return `/${[slug, ...segments.slice(1)].join("/")}`;
  }
  // No branch prefix in the path (e.g. /backend/control) — don't navigate.
  return null;
}
