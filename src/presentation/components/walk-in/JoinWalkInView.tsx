"use client";

import { useActiveBranch } from "@/src/presentation/components/branch/BranchScope";
import { useWalkInPresenter } from "@/src/presentation/presenters/walkIn/useWalkInPresenter";
import Image from "next/image";
import { SHOP_NAME } from "@/src/config/shop.config";
import Link from "next/link";
import { WalkInStatusView } from "./WalkInStatusView";

/**
 * JoinWalkInView — walk-in is now a counter service.
 *
 * Customers used to fill in a form here, which wrote a queue row straight from
 * the browser. Staff enter the walk-in themselves at the counter, so the form
 * was a second, competing way into the same table — two names for one person,
 * one of them typed by whoever happened to open the page. That is what the
 * counter staff meant by the booking side being confused.
 *
 * So this page only says so, and points at the way in that actually works. The
 * status view above it is untouched: someone who joined earlier still needs to
 * see their number, and their queue row is real.
 */
export function JoinWalkInView() {
  const [state, actions] = useWalkInPresenter();
  const { currentQueue } = state;
  const branch = useActiveBranch();

  // Someone who joined before the form was retired still needs their number.
  if (currentQueue) {
    return (
      <WalkInStatusView
        queue={currentQueue}
        onCancel={() => actions.cancelQueue(currentQueue.id)}
        onRefresh={actions.loadData}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-racing-bg overflow-y-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-racing-flag-dim rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-racing-flag/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <Link
          href={`/${branch.slug}`}
          className="flex items-center gap-2 px-4 py-2 bg-racing-panel border border-racing-line hover:bg-racing-panel-2 rounded-full text-racing-fg font-medium transition-all"
        >
          <span>←</span>
          <span className="hidden sm:inline">หน้าแรก</span>
        </Link>
      </header>

      <div className="relative z-10 min-h-[calc(100vh-72px)] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          {/* The branch's own mark, so someone sent here from a link for the
              wrong branch can see that before asking anyone. It replaced a
              🏎️ tile that sat directly above it — two logos stacked, the
              generic one saying less than the real one. */}
          <Image
            src={branch.logo}
            alt={SHOP_NAME + " " + branch.shortName}
            width={branch.logoWidth}
            height={branch.logoHeight}
            priority
            className="h-14 w-auto max-w-56 object-contain mx-auto mb-8"
          />

          <h1 className="text-3xl font-bold text-racing-fg mb-3">
            เข้าคิวที่หน้าเคาน์เตอร์
          </h1>

          <div className="racing-panel-solid rounded-2xl p-6">
            <p className="text-racing-fg text-lg leading-relaxed">
              ถ้าต้องการเล่นทันที
              <br />
              <strong className="font-bold">
                กรุณาติดต่อเจ้าหน้าที่ในร้านโดยตรง
              </strong>
            </p>

            <p className="text-racing-fg-2 text-sm mt-4 pt-4 border-t border-racing-line">
              เจ้าหน้าที่จะใส่ข้อมูลและแจ้งลำดับคิวให้คุณเองค่ะ
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-racing-fg-2 text-sm">
              ถ้าต้องการจองล่วงหน้า
            </p>
            <Link
              href={`/${branch.slug}/time-booking`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-racing-panel border border-racing-line hover:bg-racing-panel-2 rounded-xl text-racing-fg font-medium transition-all"
            >
              📅 จองล่วงหน้า
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
