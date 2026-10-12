"use client";

import { SHOP_NAME } from "@/src/config/shop.config";
import Image from "next/image";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";

/**
 * BranchBanner — the branch's own lockup, big enough to read before booking.
 *
 * Why it exists: a customer who walks into the Pattani shop and books from the
 * Narathiwat page is a real failure here, not a typo — the two shops are far
 * apart and the booking is paid for in person. So the branch is not a chip in
 * the corner. It is a full-width plate directly under the page title, on every
 * step of the booking flow, with the mark rendered at 96px rather than the 24px
 * a header chip allows.
 *
 * The mark carries the branch on its own. The two logos differ in colour and
 * flag — silver/red chequered at Narathiwat, gold/black at Pattani — so someone
 * who cannot read the Thai name still sees the difference at a glance.
 *
 * Dark plate regardless of theme: the Narathiwat file is a white-and-silver
 * logo and it disappears into a light panel. Both files are transparent WebP
 * cut for a dark ground, so the plate is what makes them readable on a sunlit
 * phone screen.
 */
export function BranchBanner({ className = "" }: { className?: string }) {
  const branch = useBranchStore((s) => s.branch);
  const hasChosenBranch = useBranchStore((s) => s.hasChosen);
  const openBranchPicker = useBranchStore((s) => s.openPicker);

  // No choice yet means the gate modal is covering the page anyway — the
  // banner would only duplicate the picker underneath it.
  if (!hasChosenBranch) return null;

  return (
    <div className={`relative z-10 px-4 ${className}`}>
      <div className="max-w-md mx-auto rounded-2xl bg-neutral-900 border border-racing-flag/45 overflow-hidden shadow-lg shadow-racing-flag/20">
        {/* Accent bar across the top — the plate is neutral on purpose (the
            logos need a dark ground), so without it the panel reads as another
            card and the branch is back to being skimmable. */}
        <div className="h-1 w-full bg-gradient-to-r from-racing-flag via-racing-flag-soft to-racing-flag" />

        <div className="flex items-center gap-4 p-4">
          <Image
            src={branch.logo}
            alt={SHOP_NAME + " " + branch.shortName}
            width={branch.logoWidth}
            height={branch.logoHeight}
            priority
            className="h-20 sm:h-24 w-auto max-w-[60%] object-contain object-left shrink-0"
          />

          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-white/50">
              กำลังจองเวลากับ
            </p>
            <p className="text-xl sm:text-2xl font-bold text-white leading-tight truncate">
              สาขา{branch.shortName}
            </p>
            <button
              onClick={openBranchPicker}
              type="button"
              className="racing-branch-chip mt-2"
              aria-label={`สาขาปัจจุบัน: ${branch.shortName} — คลิกเพื่อเปลี่ยนสาขา`}
            >
              <svg
                className="w-3 h-3 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-7-5.6-7-11a7 7 0 1114 0c0 5.4-7 11-7 11z"
                />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>เปลี่ยนสาขา</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}