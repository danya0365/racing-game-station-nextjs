"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

// Subscription function that never triggers updates
const emptySubscribe = () => () => {};

// Server always returns false
const getServerSnapshot = () => false;

// Client returns true after hydration
const getClientSnapshot = () => true;

/**
 * ThemeToggle - Uses CSS transitions for better performance
 * Replaced react-spring with CSS to avoid render blocking issues
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  // useSyncExternalStore is the recommended way to handle client-only rendering
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-racing-flag focus-visible:ring-offset-2 focus-visible:ring-offset-racing-bg border border-racing-line bg-racing-panel-2"
      aria-label={isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
    >
      {/* Icons rather than emoji — they inherit currentColor and stay legible
          against both branch accents. */}
      <svg
        className={`w-4.5 h-4.5 transition-transform duration-300 ${
          isDark ? "rotate-0 text-racing-fg" : "-rotate-90 text-racing-fg-2"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        {isDark ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path
              strokeLinecap="round"
              d="M12 2v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            />
          </>
        )}
      </svg>
    </button>
  );
}
