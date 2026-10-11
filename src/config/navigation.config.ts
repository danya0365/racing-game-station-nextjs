import { Branch, BRANCHES, DEFAULT_BRANCH } from "@/src/config/branch.config";

/**
 * Build nav links scoped to a branch.
 *
 * Customer links carry the branch prefix (/narathiwas/time-booking) so someone who
 * switched branches can't wander into the other branch's screens by clicking a
 * header link. /backend is staff-only and stays unprefixed — staff see all
 * branches from there.
 */
/**
 * Build nav links scoped to a branch.
 *
 * Customer links carry the branch prefix (/narathiwas/time-booking) so someone who
 * switched branches can't wander into the other branch's screens by clicking a
 * header link. /backend is staff-only and stays unprefixed — staff see all
 * branches from there.
 *
 * No walk-in link: the queue is entered by staff at the counter, so there is
 * nothing for a customer to open from here.
 */
function buildLinks(branch: Branch) {
  const base = `/${branch.slug}`;
  return [
    { href: base, label: "หน้าแรก", icon: "🏠" },
    { href: `${base}/time-booking`, label: "จองเวลา", icon: "🎮" },
    {
      href: `${base}/customer/booking-status`,
      label: "สถานะการจอง",
      icon: "📋",
    },
    { href: `${base}/customer/booking-history`, label: "ตารางจอง", icon: "📜" },
    { href: "/backend", label: "แอดมิน", icon: "⚙️" },
  ];
}

export type NavLink = ReturnType<typeof buildLinks>[number];

/** Default (Narathiwat) links — for server components with no branch context */
export const NAV_LINKS: NavLink[] = buildLinks(DEFAULT_BRANCH);

/**
 * Branch-aware links
 * @param branch - Branch from the URL or the client store
 */
export function getNavLinks(branch: Branch = DEFAULT_BRANCH): NavLink[] {
  return buildLinks(branch);
}

export { BRANCHES };
