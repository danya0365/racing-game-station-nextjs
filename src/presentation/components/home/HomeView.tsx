'use client';

import { Machine } from '@/src/application/repositories/IMachineRepository';
import { getShopNow, SHOP_TIMEZONE } from '@/src/lib/date';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import { useHomePresenter } from '@/src/presentation/presenters/home/useHomePresenter';
import 'dayjs/locale/th';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DEFAULT_TIMEZONE = SHOP_TIMEZONE;

interface DashboardStats {
  totalMachines: number;
  availableMachines: number;
  occupiedMachines: number;
  todayBookings: number;
  activeBookings: number;
  walkInQueueCount: number;
  averageWaitTime: number;
  generalCustomers: number;
  totalPlayers: number;
  waitingInQueue: number;
}

/**
 * HomeView - Racing Game Station Landing Page
 * 
 * Redesigned to support:
 * - Booking system (จองล่วงหน้า)
 * - Walk-in queue (เข้าคิวหน้าร้าน)
 * - Session management (การใช้งานเครื่อง)
 * - Real-time status
 * 
 * Features:
 * ✅ Hero section with racing theme
 * ✅ Quick action cards
 * ✅ Live dashboard
 * ✅ Dark mode support via CSS variables
 */
export function HomeView({ initialViewModel }: { initialViewModel?: HomeViewModel }) {
  const [{ viewModel, loading: isLoading }, { refreshData }] = useHomePresenter(initialViewModel);
  const [currentTime, setCurrentTime] = useState(getShopNow());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getShopNow());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Derive stats from viewModel
  const machines = viewModel?.machines || [];
  const stats: DashboardStats = {
    totalMachines: machines.length,
    availableMachines: machines.filter(m => m.status === 'available').length,
    occupiedMachines: machines.filter(m => m.status === 'occupied').length,
    todayBookings: viewModel?.todayBookings || 0,
    activeBookings: viewModel?.activeBookings || 0,
    walkInQueueCount: viewModel?.walkInQueueCount || 0,
    averageWaitTime: viewModel?.queueStats.averageWaitMinutes || 0,
    generalCustomers: viewModel?.generalCustomers || 0,
    totalPlayers: viewModel?.totalPlayers || 0,
    waitingInQueue: viewModel?.queueStats.waitingCount || 0,
  };

  const loading = isLoading && !viewModel;

  return (
    <div className="bg-background overflow-auto scrollbar-thin">
      {/* Hero Section - Compact & Informational */}
      <section className="relative overflow-hidden bg-surface border-b border-border">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-background to-background" />
        
        <div className="relative px-4 py-6 md:py-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
              🏎️
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Racing Game Station
              </h1>
              <div className="flex items-center gap-2 text-muted text-sm mt-1">
                <span>📅 {currentTime.locale('th').format('D MMM BB')}</span>
                <span>•</span>
                <span>⏰ {currentTime.format('HH:mm')}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-xl bg-surface border border-border flex flex-col items-center min-w-[100px]">
               <span className="text-xs text-muted mb-1">เครื่องว่าง</span>
               <span className="text-xl font-bold text-emerald-500">
                 {loading ? '-' : stats.availableMachines}
                 <span className="text-sm text-muted font-normal ml-1">/ {stats.totalMachines}</span>
               </span>
             </div>
             <div className="px-4 py-2 rounded-xl bg-surface border border-border flex flex-col items-center min-w-[100px]">
               <span className="text-xs text-muted mb-1">คิวรอ</span>
               <span className="text-xl font-bold text-amber-500">
                 {loading ? '-' : stats.waitingInQueue}
               </span>
             </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Quick Actions - Primary Utility */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              href="/walk-in"
              icon="🏁"
              title="เข้าคิวทันที"
              description="เล่นเลย ไม่ต้องจอง"
              color="cyan"
              isPrimary
            />
            <QuickActionCard
              href="/time-booking"
              icon="📅"
              title="จองล่วงหน้า"
              description="ล็อคเวลาที่ต้องการ"
              color="purple"
            />
            <QuickActionCard
              href="/customer/booking-history"
              icon="📋"
              title="ประวัติการจอง"
              description="เช็คสถานะของคุณ"
              color="pink"
            />
             <QuickActionCard
              href="/qr-scan"
              icon="📱"
              title="สแกน QR"
              description="เช็คอิน / จ่ายเงิน"
              color="green"
            />
          </div>
        </section>

        {/* Real-time Machine Status */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-6 md:h-8 rounded-full bg-purple-500" />
              สถานะเครื่อง
            </h2>
             <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> ว่าง
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-500/10 text-orange-500">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> ไม่ว่าง
                </div>
             </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin text-purple-500 text-2xl">⚡</div>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {machines.map((machine) => (
                <MachineStatusCard key={machine.id} machine={machine} />
              ))}
            </div>
          )}
        </section>

        {/* Today's Schedule Overview */}
        <section className="bg-surface/30 rounded-2xl p-6 border border-border/50">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-medium text-foreground">ภาพรวมวันนี้</h3>
             <Link href="/time-booking" className="text-sm text-purple-400 hover:text-purple-300">
               ดูตารางเวลาเต็ม →
             </Link>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="text-sm text-muted mb-1">จองวันนี้แล้ว</div>
                <div className="text-2xl font-bold">{stats.todayBookings} <span className="text-sm font-normal text-muted">รายการ</span></div>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="text-sm text-muted mb-1">คิว Walk-in</div>
                 <div className="text-2xl font-bold text-amber-500">{stats.walkInQueueCount} <span className="text-sm font-normal text-muted">คิว</span></div>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="text-sm text-muted mb-1">ลูกค้าทั่วไป</div>
                <div className="text-2xl font-bold text-blue-500">{stats.generalCustomers} <span className="text-sm font-normal text-muted">คน</span></div>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="text-sm text-muted mb-1">ผู้เล่นวันนี้</div>
                <div className="text-2xl font-bold text-emerald-500">{stats.totalPlayers} <span className="text-sm font-normal text-muted">คน</span></div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

interface QuickActionCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: 'purple' | 'cyan' | 'pink' | 'green' | 'orange';
  isPrimary?: boolean;
}

const colorMap = {
  purple: {
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30 hover:border-purple-500/60',
    iconBg: 'from-purple-500 to-pink-600',
    shadow: 'hover:shadow-purple-500/20',
  },
  cyan: {
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30 hover:border-cyan-500/60',
    iconBg: 'from-cyan-500 to-blue-600',
    shadow: 'hover:shadow-cyan-500/20',
  },
  pink: {
    gradient: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30 hover:border-pink-500/60',
    iconBg: 'from-pink-500 to-rose-600',
    shadow: 'hover:shadow-pink-500/20',
  },
  green: {
    gradient: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    iconBg: 'from-emerald-500 to-green-600',
    shadow: 'hover:shadow-emerald-500/20',
  },
  orange: {
    gradient: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/30 hover:border-orange-500/60',
    iconBg: 'from-orange-500 to-amber-600',
    shadow: 'hover:shadow-orange-500/20',
  },
};

function QuickActionCard({ href, icon, title, description, color, isPrimary }: QuickActionCardProps) {
  const colors = colorMap[color];
  
  return (
    <Link href={href}>
      <div
        className={`
          group relative p-6 rounded-2xl 
          bg-gradient-to-br ${colors.gradient}
          border ${colors.border}
          transition-all duration-300
          hover:scale-105 hover:-translate-y-1
          hover:shadow-xl ${colors.shadow}
          cursor-pointer
          ${isPrimary ? 'ring-2 ring-emerald-500/50' : ''}
          h-full
        `}
      >
        <div
          className={`
            inline-flex items-center justify-center 
            w-16 h-16 rounded-2xl 
            bg-gradient-to-br ${colors.iconBg}
            text-4xl mb-4 
            shadow-lg
            group-hover:scale-110 transition-transform
          `}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted text-sm">{description}</p>
        
        {/* Arrow indicator */}
        <div className="absolute top-6 right-6 text-muted group-hover:text-foreground transition-colors">
          →
        </div>
        
        {isPrimary && (
          <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
            แนะนำ
          </div>
        )}
      </div>
    </Link>
  );
}



function MachineStatusCard({ machine }: { machine: Machine }) {
  const statusConfig = {
    available: {
      color: 'bg-emerald-500',
      text: 'ว่าง',
      bgClass: 'bg-emerald-500/10 border-emerald-500/30',
    },
    occupied: {
      color: 'bg-orange-500',
      text: 'ไม่ว่าง',
      bgClass: 'bg-orange-500/10 border-orange-500/30',
    },
    maintenance: {
      color: 'bg-gray-500',
      text: 'ปิดปรับปรุง',
      bgClass: 'bg-gray-500/10 border-gray-500/30',
    },
  };

  const config = statusConfig[machine.status] || statusConfig.maintenance;

  return (
    <div className={`p-4 rounded-xl border ${config.bgClass} transition-all hover:scale-105`}>
      <div className="text-center">
        <div className="text-2xl mb-2">🎮</div>
        <h4 className="font-bold text-foreground text-sm truncate">{machine.name}</h4>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
          <span className="text-xs text-muted">{config.text}</span>
        </div>
      </div>
    </div>
  );
}
