"use client";

import { useActiveBranch } from "@/src/presentation/components/branch/BranchScope";
import { SHOP_NAME } from "@/src/config/shop.config";
import { getShopNow } from "@/src/lib/date";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface PageHeaderProps {
  title: string;
  /** Overrides the branch mark. Only for genuinely branch-less pages. */
  icon?: string;
  showHomeButton?: boolean;
  rightContent?: React.ReactNode;
}

/**
 * Standard Full-Width Page Header
 * - Consistent across Home, Booking Status, Booking History
 * - Shows the branch's own mark
 * - Shows Title & Real-time Clock
 * - Optional "Home" navigation button
 *
 * The mark used to be a 🏎️ standing in for the shop logo, which read as "some
 * racing game" next to a shop that only runs Gran Turismo. Both consumers
 * (BookingStatusView, BookingHistoryView) render inside a BranchScope, so the
 * real branch logo is available and is what identifies the shop here.
 */
export function PageHeader({
  title,
  icon,
  showHomeButton = false,
  rightContent,
}: PageHeaderProps) {
  const branch = useActiveBranch();
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs | null>(null);

  // Initialize and update current time every second (client only)
  useEffect(() => {
    const updateTime = () => setCurrentTime(getShopNow());
    updateTime();

    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-surface border-b border-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-racing-flag/20 via-background to-background" />

      <div className="relative px-4 py-6 md:py-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href={`/${branch.slug}`}>
            {/* Wide plate, not a square tile: the marks are ~2.4:1 lockups, so a
                64×64 box scaled one down to a smudge. Height carries the size
                and the width follows the file's own ratio. */}
            <div className="h-14 px-3 rounded-xl bg-neutral-900 border border-racing-line flex items-center justify-center shadow-lg shadow-racing-flag/20 hover:scale-105 transition-transform cursor-pointer">
              {icon ? (
                <span className="text-2xl">{icon}</span>
              ) : (
                <Image
                  src={branch.logo}
                  alt={SHOP_NAME + " " + branch.shortName}
                  width={branch.logoWidth}
                  height={branch.logoHeight}
                  className="h-10 w-auto object-contain"
                />
              )}
            </div>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-racing-flag to-racing-flag bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-muted text-sm mt-1">
              {currentTime ? (
                <>
                  <span>📅 {currentTime.locale("th").format("D MMM BB")}</span>
                  <span>•</span>
                  <span className="font-variant-numeric tabular-nums">
                    ⏰ {currentTime.format("HH:mm:ss")}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-20 h-4 bg-surface/60 rounded animate-pulse" />
                  <span>•</span>
                  <span className="inline-block w-16 h-4 bg-surface/60 rounded animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content / Navigation */}
        <div className="flex gap-3">
          {rightContent}

          {showHomeButton && (
            <Link href={`/${branch.slug}`}>
              <div className="px-4 py-2 rounded-xl bg-surface border border-border flex items-center gap-2 hover:bg-surface/80 transition-colors cursor-pointer">
                <span className="text-sm">🏠 กลับหน้าหลัก</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
