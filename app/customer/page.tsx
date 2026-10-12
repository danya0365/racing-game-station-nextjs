import { RedirectToBranch } from "@/src/presentation/components/branch/RedirectToBranch";

/**
 * Legacy un-prefixed URL → the customer's chosen branch.
 *
 * Kept redirecting to booking-history, matching what the branch-scoped
 * /pattani/customer and /narathiwas/customer pages do.
 */
export default function CustomerPage() {
  return <RedirectToBranch path="customer/booking-history" />;
}
