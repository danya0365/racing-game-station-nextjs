'use client';

import Link from 'next/link';

export function MainFooter() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || '';
  const shortSha = commitSha.slice(0, 7);
  return (
    <footer className="h-14 bg-surface/80 backdrop-blur-lg border-t border-border/50 flex items-center justify-between px-4 md:px-8 shrink-0">
      {/* Copyright */}
      <div className="flex items-center gap-2 text-xs md:text-sm text-muted overflow-hidden">
        <span className="whitespace-nowrap">© 2025</span>
        <span className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-default truncate">
          Racing Game Station System
        </span>
        <span className="whitespace-nowrap">v{version} {shortSha && `(${shortSha})`}</span>
      </div>

      {/* Quick Links - Hidden on mobile, shown on desktop */}
      <div className="hidden md:flex items-center gap-4">
        <span className="text-border">|</span>
        <Link href="/qr-scan" className="text-xs font-medium text-gray-500 hover:text-cyan-400 transition-colors duration-200">
          สแกนคิวอาร์โค้ด
        </Link>
        <span className="text-border">|</span>
        <Link href="/docs" className="text-xs font-medium text-gray-500 hover:text-cyan-400 transition-colors duration-200">
          คู่มือ
        </Link>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
         {/* Show simple dot on mobile */}
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="hidden sm:inline text-xs text-muted">ระบบพร้อมใช้งาน</span>
      </div>
    </footer>
  );
}
