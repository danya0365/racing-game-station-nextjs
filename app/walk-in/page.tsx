import { RedirectToBranch } from "@/src/presentation/components/branch/RedirectToBranch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "เข้าคิวเล่นเกม | Racing Game Station",
  description: "ระบบรับบำดับคิวสำหรับลูกค้า Walk-in ที่ Racing Game Station",
};

/**
 * Legacy un-prefixed URL → the customer's chosen branch.
 *
 * The real page lives under /pattani/walk-in or /narathiwas/walk-in; see
 * app/time-booking/page.tsx for why the bare URL only redirects.
 */
export default function WalkInPage() {
  return <RedirectToBranch path="walk-in" />;
}
