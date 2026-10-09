'use client';

import { useTimezoneCheck } from '@/src/presentation/hooks/useTimezoneCheck';
import { useEffect, useState } from 'react';

// Local storage key for collapsed state
const TIMEZONE_NOTICE_COLLAPSED_KEY = 'timezone-notice-collapsed';

/**
 * TimezoneNotice - Shows a notice when user's timezone differs from shop timezone
 * 
 * Features:
 * - Real-time clock updates (every second)
 * - Toggle to collapse/expand for minimal UI
 * - Remembers collapsed state in localStorage
 * - Uses TIMEZONE_CONFIG as single source of truth
 */
export function TimezoneNotice() {
  const timezoneInfo = useTimezoneCheck({ updateInterval: 1000, includeSeconds: true });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load collapsed state from localStorage after hydration
  useEffect(() => {
    const saved = localStorage.getItem(TIMEZONE_NOTICE_COLLAPSED_KEY);
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
    setIsHydrated(true);
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem(TIMEZONE_NOTICE_COLLAPSED_KEY, JSON.stringify(newValue));
  };

  // Don't render until we have timezone info
  if (!timezoneInfo) return null;

  // Don't show notice if timezones match
  if (timezoneInfo.isMatchingTimezone) return null;

  // Don't render until hydrated to prevent mismatch
  if (!isHydrated) return null;

  const { shopTimezoneInfo, userTimezoneInfo } = timezoneInfo;

  // Collapsed/Minimal View
  if (isCollapsed) {
    return (
      <button
        onClick={toggleCollapsed}
        className="mb-4 w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🌍</span>
          <span className="text-amber-700 dark:text-amber-400 text-sm font-medium">
            เขตเวลาต่างกัน
          </span>
          <span className="text-muted">•</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground font-mono font-bold">
              {timezoneInfo.userCurrentTime}
            </span>
            <span className="text-muted">→</span>
            <span className="text-racing-flag font-mono font-bold">
              {shopTimezoneInfo.flag} {timezoneInfo.shopCurrentTime}
            </span>
          </div>
        </div>
        <span className="text-muted group-hover:text-foreground transition-colors text-xs">
          ▼ ขยาย
        </span>
      </button>
    );
  }

  // Dynamic display names from config
  const userDisplayName = userTimezoneInfo 
    ? `${userTimezoneInfo.flag} ${userTimezoneInfo.displayNameTH}`
    : `🏠 เวลาของคุณ`;

  // Full View
  return (
    <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl relative">
      {/* Collapse Button */}
      <button
        onClick={toggleCollapsed}
        className="absolute top-2 right-2 px-2 py-1 text-xs text-muted hover:text-foreground hover:bg-foreground/10 rounded-lg transition-all"
        title="ย่อ"
      >
        ▲ ย่อ
      </button>

      <div className="flex items-start gap-3">
        <span className="text-2xl">🌍</span>
        <div className="flex-1">
          <p className="font-bold text-amber-700 dark:text-amber-400 mb-2">
            ⚠️ เขตเวลาของคุณต่างจากร้าน
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* User's timezone */}
            <div className="bg-foreground/5 dark:bg-black/20 rounded-lg p-3">
              <p className="text-muted text-xs mb-1">{userDisplayName}</p>
              <p className="text-3xl font-bold text-foreground font-mono tracking-tight">
                {timezoneInfo.userCurrentTime}
              </p>
              <p className="text-xs text-muted mt-1">
                {timezoneInfo.userOffset}
              </p>
            </div>
            
            {/* Shop's timezone */}
            <div className="bg-racing-flag/20 rounded-lg p-3 border border-racing-flag/30">
              <p className="text-muted text-xs mb-1">🏪 เวลาร้าน ({shopTimezoneInfo.cityName})</p>
              <p className="text-3xl font-bold text-racing-flag font-mono tracking-tight">
                {timezoneInfo.shopCurrentTime}
              </p>
              <p className="text-xs text-muted mt-1">
                {timezoneInfo.shopOffset}
              </p>
            </div>
          </div>
          
          <p className="text-xs text-amber-600 dark:text-amber-400/90 mt-3">
            💡 เวลาที่แสดงทั้งหมดเป็น <strong>{shopTimezoneInfo.displayNameTH} ({shopTimezoneInfo.countryEN})</strong> กรุณาคำนวณเวลาก่อนมาถึงร้าน
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version of TimezoneNotice for smaller spaces
 * Also updates every second with seconds display
 */
export function TimezoneNoticeCompact() {
  const timezoneInfo = useTimezoneCheck({ updateInterval: 1000, includeSeconds: true });

  if (!timezoneInfo || timezoneInfo.isMatchingTimezone) return null;

  const { shopTimezoneInfo } = timezoneInfo;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs">
      <span>🌍</span>
      <span className="text-amber-700 dark:text-amber-400">
        เวลาของคุณ <strong className="font-mono">{timezoneInfo.userCurrentTime}</strong> ({timezoneInfo.userOffset})
      </span>
      <span className="text-muted">•</span>
      <span className="text-racing-flag">
        {shopTimezoneInfo.flag} เวลาร้าน <strong className="font-mono">{timezoneInfo.shopCurrentTime}</strong>
      </span>
    </div>
  );
}

/**
 * Floating version - Fixed position at bottom of screen
 * Good for always-visible timezone info
 */
export function TimezoneNoticeFloating() {
  const timezoneInfo = useTimezoneCheck({ updateInterval: 1000, includeSeconds: true });
  const [isVisible, setIsVisible] = useState(true);

  if (!timezoneInfo || timezoneInfo.isMatchingTimezone || !isVisible) return null;

  const { shopTimezoneInfo } = timezoneInfo;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50">
      <div className="flex items-center justify-between gap-4 px-4 py-2 bg-background/95 backdrop-blur-sm border border-amber-500/30 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-lg">🌍</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground font-mono font-bold">
              {timezoneInfo.userCurrentTime}
            </span>
            <span className="text-muted">→</span>
            <span className="text-racing-flag font-mono font-bold">
              {shopTimezoneInfo.flag} {timezoneInfo.shopCurrentTime}
            </span>
          </div>
          <span className="text-xs text-muted hidden sm:inline">
            ({shopTimezoneInfo.displayNameEN})
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted hover:text-foreground transition-colors"
          title="ปิด"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
