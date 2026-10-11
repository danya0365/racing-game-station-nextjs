import { RedirectToBranch } from "@/src/presentation/components/branch/RedirectToBranch";
import { Metadata } from "next";
import { shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("สถานะการจอง"),
  description: "ดูสถานะการจองเวลาของคุณ",
};

/**
 * Legacy un-prefixed URL → the customer's chosen branch.
 *
 * The real page lives under /pattani/customer/booking-status or
 * /narathiwas/customer/booking-status; see app/time-booking/page.tsx for why the
 * bare URL only redirects.
 */
export default function BookingStatusPage() {
  return <RedirectToBranch path="customer/booking-status" />;
}
