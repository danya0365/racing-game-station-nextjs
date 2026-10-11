import { RedirectToBranch } from "@/src/presentation/components/branch/RedirectToBranch";
import { Metadata } from "next";
import { SHOP_NAME, shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("เข้าคิวเล่นเกม"),
  description: `ระบบรับบำดับคิวสำหรับลูกค้า Walk-in ที่ ${SHOP_NAME}`,
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
