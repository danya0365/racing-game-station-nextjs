'use client';

import { Machine } from '@/src/application/repositories/IMachineRepository';
import { createBookingRepositories } from '@/src/infrastructure/repositories/RepositoryFactory';
import { getShopNow, getShopTodayString, SHOP_TIMEZONE } from '@/src/lib/date';
import { AnimatedCard } from '@/src/presentation/components/ui/AnimatedCard';
import { GlowButton } from '@/src/presentation/components/ui/GlowButton';
import { HomeViewModel } from '@/src/presentation/presenters/home/HomePresenter';
import 'dayjs/locale/th';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_TIMEZONE = SHOP_TIMEZONE;

interface DashboardStats {
  totalMachines: number;
  availableMachines: number;
  occupiedMachines: number;
  todayBookings: number;
  activeBookings: number;
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
  const [machines, setMachines] = useState<Machine[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMachines: 0,
    availableMachines: 0,
    occupiedMachines: 0,
    todayBookings: 0,
    activeBookings: 0,
    waitingInQueue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(getShopNow());

  // Get today's date
  const today = useMemo(() => getShopTodayString(), []);

  // Repositories
  const { bookingRepo, machineRepo } = useMemo(
    () => createBookingRepositories(),
    []
  );

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getShopNow());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load dashboard data
  const loadData = useCallback(async () => {
    try {
      const allMachines = await machineRepo.getAll();
      const activeMachines = allMachines.filter(m => m.isActive);
      setMachines(activeMachines);

      // Count machine statuses
      const available = activeMachines.filter(m => m.status === 'available').length;
      const occupied = activeMachines.filter(m => m.status === 'occupied').length;

      // Load today's bookings
      const referenceTime = getShopNow().toISOString();
      let totalBookings = 0;
      let activeBookings = 0;

      await Promise.all(activeMachines.map(async (machine) => {
        const bookings = await bookingRepo.getByMachineAndDate(machine.id, today);
        totalBookings += bookings.length;
        activeBookings += bookings.filter(b => 
          b.status === 'confirmed' || b.status === 'pending'
        ).length;
      }));

      setStats({
        totalMachines: activeMachines.length,
        availableMachines: available,
        occupiedMachines: occupied,
        todayBookings: totalBookings,
        activeBookings,
        waitingInQueue: 0, // TODO: Load from walk-in queue
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [machineRepo, bookingRepo, today]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-background overflow-auto scrollbar-thin">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient - works in both light and dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-cyan-500/20 dark:from-purple-900/40 dark:via-pink-900/20 dark:to-cyan-900/30" />
        
        {/* Racing stripe decoration */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-pink-500 to-transparent" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
        </div>

        <div className="relative px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo / Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl shadow-purple-500/30 mb-8 animate-pulse">
              <span className="text-5xl">🏎️</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Racing Game Station
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted mb-8 max-w-2xl mx-auto">
              ระบบจัดการ Racing Game Station | จองล่วงหน้า • เข้าคิว Walk-in • ติดตามสถานะ
            </p>

            {/* Current time */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface/80 dark:bg-surface/50 backdrop-blur-sm border border-border rounded-full mb-10">
              <span className="text-2xl">📅</span>
              <span className="text-foreground font-medium">
                {currentTime.locale('th').format('dddd D MMMM YYYY')}
              </span>
              <span className="text-muted">•</span>
              <span className="text-xl font-bold text-foreground">
                {currentTime.format('HH:mm')}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/time-booking">
                <GlowButton color="purple" size="lg" className="w-full sm:w-auto">
                  📅 จองล่วงหน้า
                </GlowButton>
              </Link>
              <Link href="/walk-in">
                <GlowButton color="cyan" size="lg" className="w-full sm:w-auto">
                  🏁 เข้าคิว Walk-in
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Dashboard Section */}
      <section className="px-4 md:px-8 py-12 -mt-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              สถานะวันนี้
            </h2>
            <p className="text-muted">อัปเดตแบบ real-time</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Machines */}
            <AnimatedCard className="p-5 text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-3xl mb-3 shadow-lg">
                🎮
              </div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? '...' : stats.totalMachines}
              </div>
              <div className="text-sm text-muted">เครื่องทั้งหมด</div>
            </AnimatedCard>

            {/* Available */}
            <AnimatedCard className="p-5 text-center bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-3xl mb-3 shadow-lg">
                ✅
              </div>
              <div className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">
                {loading ? '...' : stats.availableMachines}
              </div>
              <div className="text-sm text-muted">ว่างพร้อมเล่น</div>
            </AnimatedCard>

            {/* Occupied */}
            <AnimatedCard className="p-5 text-center bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/30">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-3xl mb-3 shadow-lg">
                🔥
              </div>
              <div className="text-3xl font-bold text-orange-500 dark:text-orange-400">
                {loading ? '...' : stats.occupiedMachines}
              </div>
              <div className="text-sm text-muted">กำลังใช้งาน</div>
            </AnimatedCard>

            {/* Today's Bookings */}
            <AnimatedCard className="p-5 text-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl mb-3 shadow-lg">
                📋
              </div>
              <div className="text-3xl font-bold text-cyan-500 dark:text-cyan-400">
                {loading ? '...' : stats.activeBookings}
              </div>
              <div className="text-sm text-muted">การจองที่รออยู่</div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="px-4 md:px-8 py-12 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                เริ่มต้นใช้งาน
              </span>
            </h2>
            <p className="text-muted">เลือกบริการที่ต้องการ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Advance Booking */}
            <QuickActionCard
              href="/time-booking"
              icon="📅"
              title="จองล่วงหน้า"
              description="เลือกวันและเวลาที่ต้องการ จองได้ล่วงหน้าถึง 7 วัน"
              color="purple"
            />

            {/* Walk-in Queue */}
            <QuickActionCard
              href="/walk-in"
              icon="🏁"
              title="เข้าคิว Walk-in"
              description="มาถึงแล้ว? เข้าคิวรอเล่นได้เลย ไม่ต้องจอง"
              color="cyan"
            />

            {/* Booking History */}
            <QuickActionCard
              href="/customer/booking-history"
              icon="📋"
              title="ประวัติการจอง"
              description="ดูประวัติและสถานะการจองของคุณ"
              color="pink"
            />

            {/* QR Scan */}
            <QuickActionCard
              href="/qr-scan"
              icon="📱"
              title="สแกน QR"
              description="สแกน QR Code เพื่อเข้าถึงบริการอย่างรวดเร็ว"
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Machine Status Preview */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              สถานะเครื่อง
            </h2>
            <p className="text-muted">เครื่องที่พร้อมให้บริการ</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted">กำลังโหลด...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {machines.slice(0, 6).map((machine) => (
                <MachineStatusCard key={machine.id} machine={machine} />
              ))}
            </div>
          )}

          {machines.length > 6 && (
            <div className="text-center mt-8">
              <Link href="/time-booking">
                <GlowButton color="purple" size="md">
                  ดูเครื่องทั้งหมด ({machines.length} เครื่อง)
                </GlowButton>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 py-16 bg-gradient-to-b from-surface/50 to-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ทำไมต้องใช้ระบบนี้?
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="⏰"
              title="ไม่ต้องรอคิว"
              description="จองเวลาที่ต้องการล่วงหน้า มาถึงเวลาเล่นได้เลย ไม่เสียเวลารอ"
            />
            <FeatureCard
              icon="📱"
              title="จองง่ายทุกที่"
              description="จองผ่านมือถือได้ทุกที่ทุกเวลา ไม่ต้องโทรสอบถาม"
            />
            <FeatureCard
              icon="🔔"
              title="แจ้งเตือนอัตโนมัติ"
              description="รับการแจ้งเตือนเมื่อถึงคิว หรือใกล้ถึงเวลาจอง"
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            พร้อมเล่นแล้วหรือยัง?
          </h2>
          <p className="text-muted mb-8">
            เลือกวิธีที่สะดวกที่สุดสำหรับคุณ!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/walk-in">
              <GlowButton color="cyan" size="lg" className="w-full sm:w-auto">
                🏁 เข้าคิวหน้าร้าน
              </GlowButton>
            </Link>
            <Link href="/time-booking">
              <GlowButton color="pink" size="lg" className="w-full sm:w-auto">
                📅 จองล่วงหน้า
              </GlowButton>
            </Link>
          </div>
        </div>
      </section>
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

function QuickActionCard({ href, icon, title, description, color }: QuickActionCardProps) {
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
      </div>
    </Link>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center p-6 bg-background border border-border rounded-2xl hover:border-purple-500/50 transition-all hover:shadow-lg">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-4xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
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
