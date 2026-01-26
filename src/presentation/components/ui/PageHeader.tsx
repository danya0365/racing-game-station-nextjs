'use client';

import { getShopNow } from '@/src/lib/date';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageHeaderProps {
  title: string;
  icon?: string;
  showHomeButton?: boolean;
  rightContent?: React.ReactNode;
}

/**
 * Standard Full-Width Page Header
 * - Consistent across Home, Booking Status, Booking History
 * - Shows Logo/Icon
 * - Shows Title & Real-time Clock
 * - Optional "Home" navigation button
 */
export function PageHeader({ 
  title, 
  icon = '🏎️', 
  showHomeButton = false,
  rightContent 
}: PageHeaderProps) {
  const [currentTime, setCurrentTime] = useState(getShopNow());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getShopNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-surface border-b border-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-background to-background" />
      
      <div className="relative px-4 py-6 md:py-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform cursor-pointer">
              {icon}
            </div>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-muted text-sm mt-1">
              <span>📅 {currentTime.locale('th').format('D MMM BB')}</span>
              <span>•</span>
              <span className="font-variant-numeric tabular-nums">⏰ {currentTime.format('HH:mm:ss')}</span>
            </div>
          </div>
        </div>

        {/* Right Content / Navigation */}
        <div className="flex gap-3">
          {rightContent}
          
          {showHomeButton && (
            <Link href="/">
              <div className="px-4 py-2 rounded-xl bg-surface border border-border flex items-center gap-2 hover:bg-surface/80 transition-colors cursor-pointer">
                <span className="text-sm">🏠 กลับหน้าหลัก</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
