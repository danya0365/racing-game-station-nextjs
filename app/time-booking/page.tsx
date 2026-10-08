import { RedirectToBranch } from "@/src/presentation/components/branch/RedirectToBranch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "จองเวลา | Racing Game Station",
  description: "จองเวลาเล่น เลือกวันเวลาที่สะดวก",
};

/**
 * Legacy un-prefixed URL → the customer's chosen branch.
 *
 * The real page lives under /pattani/time-booking or /narathiwas/time-booking.
 * Old bookmarks, QR codes and links from earlier app versions still point here,
 * and without a branch in the URL this page has no branch context — it would
 * show every branch's machines and no branch indicator. So hand off to the
 * branch-scoped URL instead of duplicating the page.
 */
export default function TimeBookingPage() {
  return <RedirectToBranch path="time-booking" />;
}
