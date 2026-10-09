"use client";

import { BRANCHES } from "@/src/config/branch.config";
import { getNavLinks } from "@/src/config/navigation.config";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";
import { useAuthPresenter } from "../../presenters/auth/useAuthPresenter";
import { Portal } from "../ui/Portal";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MobileMenu } from "./MobileMenu";

/**
 * Pages whose view renders its own full-screen header above the app header.
 * Those views put their own branch button in theirs, so the one here is hidden
 * to avoid showing two.
 */
const SELF_HEADED_ROUTES = ["/time-booking", "/walk-in"];

/** Branch prefixes — routes above also exist under /pattani and /narathiwas */
const BRANCH_PREFIXES = BRANCHES.map((b) => `/${b.slug}`);

/**
 * The single nav link that owns the current path, or null.
 *
 * Longest href wins. Each link deciding for itself looked simpler but marked
 * two entries at once on /narathiwas/time-booking — the branch home is a prefix
 * of every other branch page, so "หน้าแรก" matched alongside "จองเวลา".
 */
function findActiveNavHref(
  pathname: string,
  links: { href: string }[],
): string | null {
  const trimmed = pathname.replace(/\/+$/, "");
  let best: string | null = null;
  for (const { href } of links) {
    const candidate = href.replace(/\/+$/, "");
    const matches =
      trimmed === candidate || trimmed.startsWith(`${candidate}/`);
    if (matches && (best === null || candidate.length > best.length)) {
      best = candidate;
    }
  }
  return best;
}

export function MainHeader() {
  const router = useRouter();
  const [authState, authActions] = useAuthPresenter();
  // Header links follow the active branch so switching branch is sticky
  const pathname = usePathname();
  const branch = useBranchStore((s) => s.branch);
  const hasChosenBranch = useBranchStore((s) => s.hasChosen);
  const openBranchPicker = useBranchStore((s) => s.openPicker);
  const navLinks = getNavLinks(branch);
  const activeNavHref = findActiveNavHref(pathname, navLinks);
  const hasBranchPrefix = BRANCH_PREFIXES.some((p) => pathname.startsWith(p));
  const pathWithoutBranch = pathname
    .split("/")
    .slice(hasBranchPrefix ? 2 : 1)
    .join("/");
  const isCoveredByOwnHeader = SELF_HEADED_ROUTES.includes(
    `/${pathWithoutBranch}`,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authActions.signOut();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  // Get display name - prefer fullName from profile, fallback to email
  const displayName =
    authState.profile?.fullName ||
    authState.user?.email?.split("@")[0] ||
    "ผู้ใช้";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* h-20, not h-16: the logos are ~2.4:1, so a legible 150px-wide lockup
          needs ~62px of height. In a 64px bar it had to drop to 36px tall and
          85px wide, which read as a smudge rather than a mark. */}
      <header className="racing-chrome h-20 border-b flex items-center justify-between px-4 md:px-8 z-50">
        {/* Logo — the branch's own file, so switching branch swaps the mark */}
        <Link
          href={`/${branch.slug}`}
          className="flex items-center gap-3 group shrink-0"
        >
          <Image
            src={branch.logo}
            alt={`Racing Game Station ${branch.shortName}`}
            width={branch.logoWidth}
            height={branch.logoHeight}
            priority
            /* Box tracks the file's own ratio (branch.logoWidth/Height), so the
               logo fills the header instead of being letterboxed inside a box
               with a different shape. Sized in em rather than px so the whole
               lockup scales with the root font size. */
            className="h-12 w-auto max-w-50 object-contain object-left transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              isCurrent={activeNavHref === link.href}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Current branch — opens the switch modal. Lives in the header rather
              than floating above it so it never covers the nav links.

              Views that render their own full-screen header (TimeBookingView and
              friends) sit above this one, so the button is hidden there — they
              put their own copy in their header instead. Without this the
              customer sees two identical buttons. */}
          {hasChosenBranch && !isCoveredByOwnHeader && (
            <button
              onClick={openBranchPicker}
              type="button"
              className="racing-branch-chip"
              aria-label={`สาขาปัจจุบัน: ${branch.shortName} — คลิกเพื่อเปลี่ยนสาขา`}
            >
              <svg
                className="w-3.5 h-3.5 shrink-0"
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
              <span className="max-w-[100px] truncate">{branch.shortName}</span>
              <svg
                className="w-3.5 h-3.5 shrink-0 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4M16 15l-4 4-4-4"
                />
              </svg>
            </button>
          )}

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Auth Section */}
          {authState.isLoading ? null : authState.isAuthenticated ? (
            /* User Menu - Logged In */
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-racing-panel-2 transition-all"
              >
                {/* Avatar */}
                <div className="racing-avatar w-9 h-9 text-sm">
                  {userInitial}
                </div>
                {/* Name - Desktop only */}
                <span className="hidden lg:block text-sm font-medium text-racing-fg max-w-[120px] truncate">
                  {displayName}
                </span>
                {/* Dropdown Arrow */}
                <svg
                  className={`w-4 h-4 text-racing-fg-3 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />

                  <div className="racing-panel-solid absolute right-0 top-full mt-2 w-56 rounded-xl z-50 overflow-hidden animate-modal-in">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-racing-line bg-racing-panel-2">
                      <p className="text-sm font-medium text-racing-fg truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-racing-fg-2 truncate">
                        {authState.user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-racing-fg-2 hover:text-racing-fg hover:bg-racing-panel-2 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        โปรไฟล์
                      </Link>
                      <Link
                        href="/customer/queue-history"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-racing-fg-2 hover:text-racing-fg hover:bg-racing-panel-2 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        ประวัติการจอง
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="py-2 border-t border-racing-line">
                      <button
                        onClick={handleLogout}
                        disabled={authState.isSubmitting}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        {authState.isSubmitting
                          ? "กำลังออกจากระบบ..."
                          : "ออกจากระบบ"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 rounded-lg bg-racing-panel border border-racing-line flex items-center justify-center text-racing-fg hover:bg-racing-panel-2 transition-colors"
            aria-label="เปิดเมนู"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <Portal>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </Portal>
    </>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  /** Decided by the caller — see activeNavHref */
  isCurrent: boolean;
}

function NavLink({ href, children, isCurrent }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="racing-nav-link"
      aria-current={isCurrent ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
