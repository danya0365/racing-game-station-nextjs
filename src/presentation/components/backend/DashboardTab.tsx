'use client';

import { AnimatedCard } from '@/src/presentation/components/ui/AnimatedCard';
import { BackendViewModel } from '@/src/presentation/presenters/backend/BackendPresenter';
import dayjs from 'dayjs';
import { useMemo } from 'react';

interface DashboardTabProps {
  viewModel: BackendViewModel;
}

export function DashboardTab({ viewModel }: DashboardTabProps) {
  // Logic: Get Overdue and Upcoming Bookings
  const { overdueBookings, upcomingBookings } = useMemo(() => {
    const nowTime = dayjs().format('HH:mm'); 
    
    const relevantBookings = (viewModel.todayBookings || [])
      .filter(b => b.status === 'confirmed');

    const overdue = relevantBookings
      .filter(b => b.localStartTime < nowTime)
      .sort((a, b) => a.localStartTime.localeCompare(b.localStartTime)); // Oldest first

    const upcoming = relevantBookings
      .filter(b => b.localStartTime >= nowTime)
      .sort((a, b) => a.localStartTime.localeCompare(b.localStartTime)) // Sooner first
      .slice(0, 5);

    return { overdueBookings: overdue, upcomingBookings: upcoming };
  }, [viewModel.todayBookings]);

  // Logic: Traffic Source (Walk-in vs Booking)
  const trafficStats = useMemo(() => {
    const totalSessions = viewModel.sessionStats.totalSessions || 0;
    // We don't have direct "source" count in sessionStats yet, estimating:
    // This is a rough visualization currently
    const bookingCount = viewModel.bookingStats.seatedBookings + viewModel.bookingStats.completedBookings;
    const walkInCount = Math.max(0, totalSessions - bookingCount);
    
    return {
      walkIn: walkInCount,
      booking: bookingCount,
      total: totalSessions > 0 ? totalSessions : 1 // Avoid divide by zero
    };
  }, [viewModel.sessionStats, viewModel.bookingStats]);

  // Helper: Get Machine Name
  const getMachineName = (id: string) => {
    return viewModel.machines.find(m => m.id === id)?.name || 'ไม่ระบุเครื่อง';
  };

  return (
    <div className="space-y-6 animate-page-in">
      
      {/* 🚀 1. Real-time Status (Head-up Display) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... StatsCards ... */}
        <StatsCard 
          icon="🎮" 
          label="การใช้งานเครื่อง" 
          value={`${viewModel.machineStats.occupiedMachines}/${viewModel.machineStats.totalMachines}`} 
          subLabel={`${viewModel.machineStats.availableMachines} เครื่องว่าง`}
          color="from-racing-led-info to-racing-led-info"
          onColor="text-racing-led-on"  
        />
        
        <StatsCard 
          icon="⏳" 
          label="เวลารอโดยประมาณ" 
          value={`${viewModel.walkInQueueStats.averageWaitMinutes} นาที`}
          subLabel={`${viewModel.waitingQueues.length} คิวรอหน้าร้าน`}
          color="from-racing-flag to-racing-flag-soft"
          onColor="text-racing-on-flag"  
          alert={viewModel.waitingQueues.length > 5}
        />

        <StatsCard 
          icon="💰" 
          label="รายได้วันนี้" 
          value={`฿${(viewModel.sessionStats.totalRevenue || 0).toLocaleString()}`}
          subLabel={`${viewModel.sessionStats.completedSessions} รอบจบแล้ว`}
          color="from-racing-led-warn to-racing-led-warn"
          onColor="text-racing-led-on"  
        />

        <StatsCard 
          icon="📈" 
          label="จำนวนการเล่นวันนี้" 
          value={`${viewModel.sessionStats.totalSessions}`}
          subLabel="รวมทุกช่องทาง"
          color="from-racing-led-go to-racing-led-go"
          onColor="text-racing-led-on"  
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📅 2. Incoming Demand (Overdue & Upcoming Bookings) */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatedCard className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                📅 ตาราง Booking วันนี้
                <span className="text-xs font-normal text-muted bg-surface/50 px-2 py-1 rounded-full">
                  (เตรียมเครื่องให้ว่าง)
                </span>
              </h3>
            </div>

            {/* ⚠️ Overdue Section */}
            {overdueBookings.length > 0 && (
              <div className="mb-6 animate-pulse-slow">
                <div className="flex items-center gap-2 text-racing-led-stop font-bold mb-2">
                  <span>⚠️</span>
                  <span>เลยเวลาจอง (Overdue) - รีบติดต่อลูกค้า!</span>
                </div>
                <div className="space-y-2">
                  {overdueBookings.map((booking) => (
                    <div key={booking.id} className="group flex items-center justify-between p-3 rounded-xl bg-racing-led-stop/10 border border-racing-led-stop/30 hover:bg-racing-led-stop/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-racing-led-stop text-white rounded-lg shadow-lg shadow-racing-led-stop/30">
                          <span className="text-sm font-bold">{booking.localStartTime}</span>
                          <span className="text-[10px] opacity-90">เลยเวลา</span>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-racing-led-stop">{booking.customerName}</div>
                          <div className="flex items-center gap-2 text-sm text-racing-led-stop opacity-80">
                            <span>📞 {booking.customerPhone}</span>
                            <span>•</span>
                            <span>{getMachineName(booking.machineId)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-bold text-racing-led-stop bg-surface px-2 py-1 rounded-md">
                           รอ Check-in
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 📅 Upcoming Section */}
            {upcomingBookings.length === 0 && overdueBookings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted py-8 opacity-60">
                <div className="text-4xl mb-2">✨</div>
                <p>ไม่มี Booking เร็วๆ นี้</p>
                <p className="text-sm">รับ Walk-in ได้เต็มที่</p>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-bold text-muted mb-2 uppercase tracking-wide">กำลังจะมาถึงเร็วๆ นี้</h4>
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="group flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface/80 border border-border border-l-4 border-l-racing-led-go transition-all">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-racing-led-go/10 rounded-lg text-racing-led-go">
                          <span className="text-sm font-bold">{booking.localStartTime}</span>
                          <span className="text-[10px] opacity-70">ถึง {booking.localEndTime}</span>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-foreground">{booking.customerName}</div>
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <span>⏱️ {booking.durationMinutes} นาที</span>
                            <span>•</span>
                            <span>📞 {booking.customerPhone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                         <div className="text-racing-led-go font-medium text-sm px-3 py-1 bg-racing-led-go/5 rounded-full border border-racing-led-go/20">
                           {getMachineName(booking.machineId)}
                         </div>
                      </div>
                    </div>
                  ))}
                  {upcomingBookings.length === 0 && (
                    <p className="text-sm text-muted italic p-2">ไม่มีรายการจองล่วงหน้าในช่วงนี้</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm text-muted">
              <span>ทั้งหมดวันนี้: {viewModel.bookingStats.totalBookings}</span>
              <span>รอยืนยัน: {viewModel.bookingStats.pendingBookings}</span>
            </div>
          </AnimatedCard>
        </div>

        {/* 📊 3. Performance & Traffic Source */}
        <div className="space-y-6">
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-bold mb-4">📈 ที่มาลูกค้าวันนี้</h3>
            
            <div className="space-y-4">
              {/* Walk-in Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>🚶 Walk-in</span>
                  <span className="text-racing-flag-text">{trafficStats.walkIn} ({Math.round(trafficStats.walkIn/trafficStats.total*100)}%)</span>
                </div>
                <div className="h-3 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-racing-flag to-racing-flag-soft rounded-full transition-all duration-1000"
                    style={{ width: `${(trafficStats.walkIn / trafficStats.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Booking Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>📅 Booking</span>
                  <span className="text-racing-led-go">{trafficStats.booking} ({Math.round(trafficStats.booking/trafficStats.total*100)}%)</span>
                </div>
                <div className="h-3 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-racing-led-go to-racing-led-info rounded-full transition-all duration-1000"
                    style={{ width: `${(trafficStats.booking / trafficStats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-racing-led-stop">{viewModel.bookingStats.cancelledBookings}</div>
                <div className="text-xs text-muted">ยกเลิกจอง</div>
              </div>
              <div>
                 <div className="text-2xl font-bold text-racing-led-warn">{viewModel.walkInQueueStats.cancelledToday}</div>
                <div className="text-xs text-muted">หลุดคิว</div>
              </div>
            </div>
          </AnimatedCard>

          {/* Quick Actions / Tips */}
          <div className="p-4 rounded-2xl bg-racing-flag-dim border border-racing-flag/25">
            <h4 className="font-bold text-racing-flag-text mb-2">💡 ทริคการจัดการ</h4>
            <ul className="text-sm text-muted space-y-2 list-disc pl-4">
              <li>ถ้าคิวยาวเกิน 30 นาที ให้แนะนำลูกค้าจองล่วงหน้า</li>
              <li>{viewModel.machineStats.maintenanceMachines > 0 ? <span className="text-racing-led-stop">มีเครื่องซ่อม {viewModel.machineStats.maintenanceMachines} เครื่อง เร่งติดตามช่าง</span> : 'เครื่องพร้อมใช้งานทุกเครื่อง เยี่ยมมาก!'}</li>
            </ul>
          </div>
        </div>

      </div>

      {/* 4. Active Queue Preview (Short list) */}
      {viewModel.waitingQueues.length > 0 && (
         <AnimatedCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">🚶 คิวที่รออยู่ ({viewModel.waitingQueues.length})</h3>
              <span className="text-sm text-muted">ดูจัดการเต็มรูปแบบที่แท็บ "คิว Walk-in"</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
               {viewModel.waitingQueues.slice(0, 4).map(q => (
                 <div key={q.id} className="p-3 rounded-lg bg-surface border border-border flex justify-between items-center">
                    <div>
                      <div className="font-bold">คิว #{q.queueNumber}</div>
                      <div className="text-sm opacity-70">{q.customerName} ({q.partySize} คน)</div>
                    </div>
                    <div className="text-right text-xs text-racing-flag-text">
                      รอ {q.waitTimeMinutes} นาที
                    </div>
                 </div>
               ))}
            </div>
         </AnimatedCard>
      )}
    </div>
  );
}

// Reusable Stats Card Component
//
// `onColor` is not decoration. The fill comes from two different colour sets: a
// branch flag, which stays dark in both modes, and the LED colours, which turn
// bright in dark mode. White text over a dark-mode LED measures 2.5-3.8:1 —
// unreadable — so each card states which text colour its own fill needs.
function StatsCard({
  icon,
  label,
  value,
  subLabel,
  color,
  onColor,
  alert,
}: {
  icon: string;
  label: string;
  value: string;
  subLabel: string;
  color: string;
  onColor: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 shadow-lg cursor-default transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl group
        ${alert ? 'ring-2 ring-racing-led-stop/50 animate-pulse-slow' : ''}
      `}
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90`} />
      
      {/* Decorative Circles */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -left-6 -bottom-6 w-20 h-20 rounded-full bg-black/10 blur-xl" />

      <div className={`relative z-10 ${onColor}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-2xl shadow-inner">
            {icon}
          </div>
          {alert && (
            <span className="px-2 py-0.5 bg-black/40 text-current text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
              แจ้งเตือน
            </span>
          )}
        </div>
        
        <div className="mt-3">
          <div className="text-3xl font-bold tracking-tight drop-shadow-sm">{value}</div>
          <div className="text-sm font-medium opacity-90 mb-1">{label}</div>
          <div className="text-xs opacity-80 font-light flex items-center gap-1">
            {subLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
