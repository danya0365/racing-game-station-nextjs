"use client";

import { getNavLinks } from "@/src/config/navigation.config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";
import { useAuthPresenter } from "../../presenters/auth/useAuthPresenter";
import { ThemeToggle } from "../ui/ThemeToggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const [authState, authActions] = useAuthPresenter();
  const branch = useBranchStore((s) => s.branch);
  const hasChosenBranch = useBranchStore((s) => s.hasChosen);
  const openBranchPicker = useBranchStore((s) => s.openPicker);

  const handleLogout = async () => {
    await authActions.signOut();
    onClose();
    router.push("/");
  };

  // Get display name - prefer fullName from profile, fallback to email
  const displayName =
    authState.profile?.fullName ||
    authState.user?.email?.split("@")[0] ||
    "ผู้ใช้";
  const userInitial = displayName.charAt(0).toUpperCase();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-in"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-72 bg-racing-panel border-l border-racing-line shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-racing-line">
          <span className="font-bold text-racing-fg">เมนู</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-racing-bg flex items-center justify-center text-racing-fg-2 hover:text-racing-fg transition-colors"
            aria-label="ปิดเมนู"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* User Section */}
        {authState.isLoading ? (
          <div className="p-4 border-b border-racing-line">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-racing-panel-2 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-racing-panel-2 animate-pulse rounded" />
                <div className="h-3 w-32 bg-racing-panel-2 animate-pulse rounded mt-1" />
              </div>
            </div>
          </div>
        ) : authState.isAuthenticated ? (
          <div className="p-4 border-b border-racing-line bg-racing-panel-2">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="racing-avatar w-10 h-10 text-sm">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-racing-fg truncate">
                  {displayName}
                </p>
                <p className="text-xs text-racing-fg-2 truncate">
                  {authState.user?.email}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Current branch — opens the switch modal, same as the header badge */}
        {hasChosenBranch && (
          <div className="p-4 border-b border-racing-line">
            <button
              onClick={() => {
                openBranchPicker();
                onClose();
              }}
              type="button"
              className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-racing-flag/35 bg-racing-flag-dim text-racing-flag text-sm font-medium transition-all hover:bg-racing-flag/20"
              aria-label={`สาขาปัจจุบัน: ${branch.shortName} — คลิกเพื่อเปลี่ยนสาขา`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <svg
                  className="w-4 h-4 shrink-0"
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
                <span className="truncate">สาขา{branch.shortName}</span>
              </span>
              <span className="text-xs shrink-0">เปลี่ยน ›</span>
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto border-b border-racing-line">
          <div className="pb-2 mb-2 border-b border-racing-line-soft">
            <p className="racing-label !text-[10px] px-4 mb-2">
              เมนูหลัก
            </p>
            {getNavLinks(branch).map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                onClick={onClose}
                icon={link.icon}
              >
                {link.label}
              </MobileNavLink>
            ))}
          </div>

          {/* Logged in user links */}
          {authState.isAuthenticated && (
            <div>
              <p className="racing-label !text-[10px] px-4 mb-2">
                บัญชีของฉัน
              </p>
              <MobileNavLink
                href="/customer/queue-status"
                onClick={onClose}
                icon="⚡"
              >
                สถานะคิวปัจจุบัน
              </MobileNavLink>
              <MobileNavLink
                href="/customer/queue-history"
                onClick={onClose}
                icon="🕒"
              >
                ประวัติคิว
              </MobileNavLink>
              <MobileNavLink href="/profile" onClick={onClose} icon="👤">
                โปรไฟล์
              </MobileNavLink>
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-racing-line space-y-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-racing-fg-2">เปลี่ยนธีม</span>
            <ThemeToggle />
          </div>

          {/* Logout Button - Only when logged in */}
          {authState.isAuthenticated && (
            <button
              onClick={handleLogout}
              disabled={authState.isSubmitting}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
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
              {authState.isSubmitting ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface MobileNavLinkProps {
  href: string;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}

function MobileNavLink({ href, onClick, icon, children }: MobileNavLinkProps) {
  return (
    <Link href={href} onClick={onClick}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-racing-panel-2 transition-colors">
        <span className="text-xl">{icon}</span>
        <span className="font-medium text-racing-fg">{children}</span>
      </div>
    </Link>
  );
}
