import { RedirectToBranch } from "@/src/presentation/components/branch/RedirectToBranch";
import { Metadata } from "next";
import { shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("ตารางการจอง"),
  description: "ดูตารางและประวัติการจองเวลาทั้งหมด",
};

/**
 * Legacy un-prefixed URL → the customer's chosen branch.
 *
 * The real page lives under /pattani/customer/booking-history or
 * /narathiwas/customer/booking-history; see app/time-booking/page.tsx for why
 * the bare URL only redirects.
 */
export default function BookingHistoryPage() {
  return <RedirectToBranch path="customer/booking-history" />;
}
