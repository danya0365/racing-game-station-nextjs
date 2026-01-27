'use client';

import { Booking } from '@/src/application/repositories/IBookingRepository';
import { Session } from '@/src/application/repositories/ISessionRepository';
import { WalkInQueue } from '@/src/application/repositories/IWalkInQueueRepository';
import { BookingDetailModal } from '@/src/presentation/components/backend/BookingDetailModal';
import { SessionDetailModal, SessionTimer } from '@/src/presentation/components/backend/SessionDetailModal';
import { ConfirmationModal } from '@/src/presentation/components/ui/ConfirmationModal';
import { GlowButton } from '@/src/presentation/components/ui/GlowButton';
import { Portal } from '@/src/presentation/components/ui/Portal';
import { ControlViewModel, StationViewModel } from '@/src/presentation/presenters/backend/ControlPresenter';
import { useControlPresenter } from '@/src/presentation/presenters/backend/useControlPresenter';
import { ThemeConfig, useControlThemeStore } from '@/src/presentation/stores/useControlThemeStore';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TailwindPreloader } from './TailwindPreloader';

dayjs.extend(duration);

// ============================================================
// PROPS
// ============================================================

interface ControlViewProps {
  initialViewModel?: ControlViewModel;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function ControlView({ initialViewModel }: ControlViewProps) {
  const [state, actions] = useControlPresenter(initialViewModel);
  const [currentTime, setCurrentTime] = useState(dayjs());
  
  // Theme Store - Wait for hydration to complete
  const themeStore = useControlThemeStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use default theme during SSR/initial hydration, then switch to stored theme
  const theme: ThemeConfig | null = (mounted && themeStore.isInitialized 
    ? themeStore.getThemeConfig() 
    : null); // null during hydration to show skeleton
  
  // Manual start modal form state
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(60);
  
  // Booking detail modal state
  const [detailModalBooking, setDetailModalBooking] = useState<Booking | null>(null);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (state.loading && !state.viewModel) {
    return <ControlViewSkeleton />;
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (state.error && !state.viewModel) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90`}>
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl text-white mb-4">{state.error}</p>
          <GlowButton color="purple" onClick={actions.loadData}>
            ลองใหม่
          </GlowButton>
        </div>
      </div>
    );
  }

  // ============================================================
  // SKELETON STATE (Theme not loaded yet)
  // ============================================================

  if (!theme) {
    return <ControlViewSkeleton />;
  }

  const viewModel = state.viewModel!;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={`fixed inset-0 z-[100] overflow-auto transition-colors duration-500 ${theme?.colors?.bg || 'bg-neutral-900'}`}>
      {/* Tailwind Preloader - Hidden component to ensure all theme classes are included */}
      <TailwindPreloader />
      
      {/* Header - Mobile Optimized */}
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-500 ${theme?.colors?.header || 'bg-black/40 border-white/10'}`}>
        {/* Row 1: Back, Title, Time */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/backend">
              <button className={`w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-500/50 flex items-center justify-center ${theme?.colors?.text?.primary || 'text-white'} font-bold`}>
                ←
              </button>
            </Link>
            <h1 className={`text-lg md:text-xl font-bold ${theme?.colors?.text?.primary || 'text-white'}`}>
              🎮 ควบคุมการเล่น
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Time - Compact on mobile */}
            <div className={`${theme?.id === 'sunrise' ? 'bg-orange-100/50 border-orange-300/50' : 'bg-white/10 border-white/20'} rounded-lg px-3 py-1.5 border`}>
              <p className={`text-lg md:text-xl font-bold ${theme?.colors?.text?.primary || 'text-white'} font-mono`}>
                {currentTime.format('HH:mm:ss')}
              </p>
            </div>
            
            {/* Theme Switcher */}
            <button
              onClick={themeStore.cycleTheme}
              className={`px-3 h-10 rounded-xl ${theme?.id === 'sunrise' ? 'bg-orange-100/50 border-orange-300/50' : 'bg-white/10 border-white/20'} border flex items-center gap-2 text-sm ${theme?.colors?.text?.primary || 'text-white'} font-medium ${theme?.id === 'sunrise' ? 'hover:bg-orange-200/50' : 'hover:bg-white/20'} transition-all`}
            >
              <span>🎨</span>
              <span className="hidden md:inline">{theme?.name || 'Theme'}</span>
            </button>
            
            {/* Refresh */}
            <button
              onClick={() => actions.loadData()}
              disabled={state.isUpdating}
              className={`w-10 h-10 rounded-xl ${theme?.id === 'sunrise' ? 'bg-orange-100/50 border-orange-300/50' : 'bg-white/10 border-white/20'} border flex items-center justify-center text-lg disabled:opacity-50`}
            >
              🔄
            </button>
          </div>
        </div>
        
        {/* Row 2: Full Width Stats Grid */}
        <div className="px-3 pb-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          <MiniStat icon="🟢" value={viewModel.stats.availableCount} label="ว่าง" color="emerald" theme={theme} />
          <MiniStat icon="🔴" value={viewModel.stats.inUseCount} label="ใช้งาน" color="orange" theme={theme} />
          <MiniStat icon="🟡" value={viewModel.stats.reservedCount} label="จอง" color="yellow" theme={theme} />
          <MiniStat icon="📋" value={viewModel.stats.waitingQueueCount} label="คิว" color="cyan" theme={theme} />
        </div>
      </header>

      {/* Station Grid - Full width cards on mobile */}
      <div className="px-3 py-3 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {viewModel.stations.map((station) => (
            <StationCard
              key={station.machine.id}
              station={station}
              currentTime={currentTime}
              waitingQueue={viewModel.waitingQueue}
              isUpdating={state.isUpdating}
              onStartManual={() => actions.openManualStartModal(station.machine.id)}
              onSelectFromQueue={() => actions.openQueueSelectModal(station.machine.id)}
              onCheckIn={() => {
                if (station.reservedBooking) {
                  actions.openCheckInModal(station.machine.id, station.reservedBooking);
                }
              }}
              onEndSession={() => {
                if (station.activeSession) {
                  actions.openEndSessionModal(station.activeSession.id);
                }
              }}
              onViewDetails={(session) => actions.openSessionDetailModal(session)}
              onViewHistory={() => actions.openHistoryModal(station.machine.id)}
              onViewBookingDetail={(booking) => setDetailModalBooking(booking)}
              theme={theme}
            />
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODALS */}
      {/* ============================================================ */}

      {/* Manual Start Modal */}
      {state.manualStartModal.isOpen && (
        <Portal>
          <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl border border-white/20 w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                ▶️ เริ่มเล่น (ผู้เล่นทั่วไป)
              </h3>
              <p className="text-white/60 mb-4">
                เครื่อง: {viewModel.stations.find(s => s.machine.id === state.manualStartModal.machineId)?.machine.name}
              </p>
              <input
                type="text"
                placeholder="ชื่อลูกค้า"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 mb-4"
                value={manualCustomerName}
                onChange={(e) => setManualCustomerName(e.target.value)}
                autoFocus
              />
              <div className="mb-6">
                <label className="text-white/60 text-sm mb-2 block">เวลาเล่น (นาที)</label>
                <div className="flex flex-wrap gap-2">
                  {[30, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setEstimatedDuration(mins)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        estimatedDuration === mins
                          ? 'bg-purple-500 border-purple-400 text-white font-bold'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {mins}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 min-w-[100px]">
                     <span className="text-white/40 text-xs">กำหนดเอง:</span>
                     <input 
                        type="number"
                        className="w-full bg-transparent text-white text-sm py-2 focus:outline-none"
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 0)}
                     />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <GlowButton
                  color="purple"
                  className="flex-1"
                  onClick={() => {
                    setManualCustomerName('');
                    setEstimatedDuration(60);
                    actions.closeManualStartModal();
                  }}
                >
                  ยกเลิก
                </GlowButton>
                <GlowButton
                  color="emerald-dark"
                  className="flex-1"
                  disabled={!manualCustomerName.trim() || state.isUpdating || estimatedDuration <= 0}
                  onClick={() => {
                    if (state.manualStartModal.machineId && manualCustomerName.trim()) {
                      actions.startManualSession(
                        state.manualStartModal.machineId,
                        manualCustomerName.trim(),
                        undefined,
                        estimatedDuration
                      );
                      setManualCustomerName('');
                      setEstimatedDuration(60);
                    }
                  }}
                >
                  {state.isUpdating ? '...' : '✅ เริ่มเลย'}
                </GlowButton>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Queue Select Modal */}
      {state.queueSelectModal.isOpen && (
        <Portal>
          <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl border border-white/20 w-full max-w-md p-6 max-h-[80vh] overflow-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                📋 เลือกจากคิว
              </h3>
              {viewModel.waitingQueue.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <p className="text-4xl mb-2">📭</p>
                  <p>ไม่มีคิวรออยู่</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10">
                     <label className="text-white/60 text-xs mb-2 block">ตั้งเวลาเล่นสำหรับคิวนี้ (นาที)</label>
                     <div className="flex flex-wrap gap-2">
                        {[30, 60, 90, 120].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => setEstimatedDuration(mins)}
                            className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                              estimatedDuration === mins
                                ? 'bg-purple-500 border-purple-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            {mins}
                          </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                    {viewModel.waitingQueue.map((queue) => (
                      <QueueSelectItem
                        key={queue.id}
                        queue={queue}
                        isUpdating={state.isUpdating}
                        onSelect={() => {
                          if (state.queueSelectModal.machineId) {
                            actions.startFromQueue(
                                state.queueSelectModal.machineId, 
                                queue,
                                estimatedDuration
                            );
                            // Reset duration for next time
                            setTimeout(() => setEstimatedDuration(60), 500);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4">
                <GlowButton
                  color="purple"
                  className="w-full"
                  onClick={actions.closeQueueSelectModal}
                >
                  ปิด
                </GlowButton>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Check-in Modal */}
      {state.checkInModal.isOpen && state.checkInModal.booking && (
        <ConfirmationModal
          isOpen={true}
          title="✅ Check-in ลูกค้า?"
          description={`ยืนยัน Check-in สำหรับ ${state.checkInModal.booking.customerName} (${state.checkInModal.booking.localStartTime} - ${state.checkInModal.booking.localEndTime})`}
          confirmText="✅ Check-in"
          cancelText="ยกเลิก"
          variant="info"
          onConfirm={() => {
            if (state.checkInModal.machineId && state.checkInModal.booking) {
              actions.startFromBooking(state.checkInModal.machineId, state.checkInModal.booking);
            }
          }}
          onClose={actions.closeCheckInModal}
          isLoading={state.isUpdating}
        />
      )}

      {/* End Session Modal */}
      {state.endSessionModal.isOpen && state.endSessionModal.sessionId && (
        <EndSessionModal
          sessionId={state.endSessionModal.sessionId}
          onClose={actions.closeEndSessionModal}
          onConfirm={(amount) => {
             if (state.endSessionModal.sessionId) {
               actions.endSession(state.endSessionModal.sessionId, amount);
             }
          }}
          isLoading={state.isUpdating}
        />
      )}

      {/* Error Toast */}
      {state.error && state.viewModel && (
        <div className="fixed bottom-4 right-4 z-[300] bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span>{state.error}</span>
            <button
              onClick={() => actions.setError(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {state.sessionDetailModal.isOpen && state.sessionDetailModal.session && (
        <SessionDetailModal
          session={state.sessionDetailModal.session}
          onClose={actions.closeSessionDetailModal}
          onUpdatePayment={actions.updateSessionPayment}
          onUpdateAmount={actions.updateSessionAmount}
        />
      )}

      {/* History Modal */}
      {state.historyModal.isOpen && (
        <HistoryModal
          machineId={state.historyModal.machineId}
          machineName={viewModel.stations.find(s => s.machine.id === state.historyModal.machineId)?.machine.name || ''}
          sessions={state.historyModal.sessions}
          onClose={actions.closeHistoryModal}
          isLoading={state.isUpdating}
        />
      )}
      {/* Booking Detail Modal (Read Only) */}
      {detailModalBooking && (
        <BookingDetailModal 
          booking={detailModalBooking}
          onClose={() => setDetailModalBooking(null)}
          onCheckIn={() => {
            setDetailModalBooking(null);
            if (detailModalBooking.status === 'confirmed') {
              actions.openCheckInModal(detailModalBooking.machineId, detailModalBooking);
            }
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function MiniStat({ 
  icon, 
  value, 
  label, 
  color,
  theme
}: { 
  icon: string; 
  value: number; 
  label: string;
  color: 'emerald' | 'orange' | 'yellow' | 'cyan';
  theme: ThemeConfig;
}) {
  const colorMap = {
    emerald: 'bg-emerald-900/40 border-emerald-700/50 text-emerald-400',
    orange: 'bg-orange-900/40 border-orange-700/50 text-orange-400',
    yellow: 'bg-yellow-900/40 border-yellow-700/50 text-yellow-400',
    cyan: 'bg-cyan-900/40 border-cyan-700/50 text-cyan-400',
  };
  
  // For sunrise theme, use lighter version
  const sunriseColorMap = {
    emerald: 'bg-emerald-100 border-emerald-400 text-emerald-700',
    orange: 'bg-orange-100 border-orange-400 text-orange-700',
    yellow: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    cyan: 'bg-cyan-100 border-cyan-400 text-cyan-700',
  };

  const activeColorMap = theme?.id === 'sunrise' ? sunriseColorMap : colorMap;

  return (
    <div className={`${activeColorMap[color]} border rounded-lg px-3 py-2 flex items-center gap-2 w-full`}>
      <span className="text-lg">{icon}</span>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold">{value}</span>
        <span className={`text-[10px] ${theme?.id === 'sunrise' ? 'text-gray-700/70' : 'text-white/70'} uppercase tracking-wide`}>{label}</span>
      </div>
    </div>
  );
}

function StationCard({
  station,
  currentTime,
  waitingQueue,
  isUpdating,
  onStartManual,
  onSelectFromQueue,
  onCheckIn,
  onEndSession,
  onViewDetails,
  onViewHistory,
  onViewBookingDetail,
  theme,
}: {
  station: StationViewModel;
  currentTime: dayjs.Dayjs;
  waitingQueue: WalkInQueue[];
  isUpdating: boolean;
  onStartManual: () => void;
  onSelectFromQueue: () => void;
  onCheckIn: () => void;
  onEndSession: () => void;
  onViewDetails: (session: Session) => void;
  onViewHistory: () => void;
  onViewBookingDetail: (booking: Booking) => void;
  theme: ThemeConfig;
}) {
  const { machine, state: stationState, activeSession, reservedBooking } = station;
  
  // Check if booking is overdue
  const isOverdue = reservedBooking && reservedBooking.localStartTime < currentTime.format('HH:mm');
  const isSunrise = theme?.id === 'sunrise';

  // Color mapping
  const darkStateColors = {
    available: 'border-emerald-600/40 shadow-lg shadow-emerald-900/10 hover:border-emerald-500/60 hover:shadow-emerald-900/30 transition-all duration-300',
    in_use: 'border-orange-600/40 bg-zinc-900/80 shadow-lg shadow-orange-900/10 hover:border-orange-500/60 hover:shadow-orange-900/30 hover:bg-zinc-800 transition-all duration-300',
    reserved: isOverdue ? 'border-red-600/40 shadow-lg shadow-red-900/10 hover:border-red-500/60' : 'border-yellow-600/40 shadow-lg shadow-yellow-900/10 hover:border-yellow-500/60',
  };

  const sunriseStateColors = {
    available: 'border-emerald-200 bg-emerald-50/50 shadow-lg shadow-emerald-100/50 hover:border-emerald-300 hover:shadow-emerald-100/80 transition-all duration-300',
    in_use: 'border-orange-200 bg-orange-50/50 shadow-lg shadow-orange-100/50 hover:border-orange-300 hover:shadow-orange-100/80 hover:bg-orange-50 transition-all duration-300',
    reserved: isOverdue ? 'border-red-200 bg-red-50/50 shadow-lg shadow-red-100/50 hover:border-red-300' : 'border-yellow-200 bg-yellow-50/50 shadow-lg shadow-yellow-100/50 hover:border-yellow-300',
  };

  const darkHeaderColors = {
    available: 'from-emerald-700 to-emerald-900 text-emerald-100',
    in_use: 'from-orange-700 to-red-900 text-orange-100',
    reserved: isOverdue ? 'from-red-700 to-rose-900 text-red-100' : 'from-yellow-600 to-orange-800 text-yellow-100',
  };

  const sunriseHeaderColors = {
    available: 'from-emerald-400 to-emerald-500 text-white shadow-emerald-200/50 shadow-md',
    in_use: 'from-orange-400 to-orange-500 text-white shadow-orange-200/50 shadow-md',
    reserved: isOverdue ? 'from-red-400 to-red-500 text-white shadow-red-200/50 shadow-md' : 'from-yellow-400 to-yellow-500 text-white shadow-yellow-200/50 shadow-md',
  };

  const darkBadgeColors = {
    available: 'bg-emerald-950/50 border border-emerald-800 text-emerald-400',
    in_use: 'bg-orange-950/50 border border-orange-800 text-orange-400 animate-pulse',
    reserved: isOverdue ? 'bg-red-950/50 border border-red-800 text-red-400 animate-bounce' : 'bg-yellow-950/50 border border-yellow-800 text-yellow-400',
  };

  const sunriseBadgeColors = {
    available: 'bg-emerald-100 border border-emerald-200 text-emerald-700',
    in_use: 'bg-orange-100 border border-orange-200 text-orange-700 animate-pulse',
    reserved: isOverdue ? 'bg-red-100 border border-red-200 text-red-700 animate-bounce' : 'bg-yellow-100 border border-yellow-200 text-yellow-700',
  };

  const stateColors = isSunrise ? sunriseStateColors : darkStateColors;
  const headerColors = isSunrise ? sunriseHeaderColors : darkHeaderColors;
  const badgeColors = isSunrise ? sunriseBadgeColors : darkBadgeColors;

  const stateLabels = {
    available: '✅ ว่าง',
    in_use: '🏁 เล่นอยู่',
    reserved: isOverdue ? '⚠️ เลยเวลา' : '📅 จอง',
  };

  return (
    <div className={`rounded-xl border backdrop-blur-sm transition-all duration-300 ${stateColors[stationState]} ${stationState === 'in_use' && !isSunrise ? '' : theme?.colors?.card?.base || 'bg-zinc-900/80'} ${theme?.colors?.card?.hover || ''}`}>
      {/* Header - Compact */}
      <div className={`px-3 py-2 border-b ${
        isSunrise 
          ? (stationState === 'in_use' ? 'border-orange-200' : stationState === 'reserved' ? 'border-yellow-200' : 'border-emerald-200')
          : (stationState === 'in_use' ? 'border-orange-500/30' : stationState === 'reserved' ? 'border-yellow-500/30' : 'border-emerald-500/30')
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br ${headerColors[stationState]}`}>
              🎮
            </div>
            <div>
              <h3 className={`text-base font-bold ${theme?.colors?.text?.primary || 'text-white'}`}>{machine.name}</h3>
              <p className={`text-xs ${theme?.colors?.text?.secondary || 'text-white/50'}`}>#{machine.position}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${badgeColors[stationState]}`}>
            {stateLabels[stationState]}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewHistory();
            }}
            className={`ml-2 w-8 h-8 rounded-full ${theme?.id === 'sunrise' ? 'bg-orange-100/70 hover:bg-orange-200 text-orange-600' : 'bg-white/10 hover:bg-white/20'} flex items-center justify-center text-xs`}
            title="ดูประวัติ"
          >
            🕒
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* NOT IN USE STATE (Available or Reserved) */}
        {stationState !== 'in_use' && (
          <div className="space-y-3">
            {/* RESERVED INFO & CHECK-IN */}
            {stationState === 'reserved' && reservedBooking && (
              <div className={`space-y-3 pb-3 border-b ${isSunrise ? 'border-gray-200' : 'border-white/10'}`}>
                <div className={`${isOverdue 
                    ? (isSunrise ? 'bg-red-50 border-red-200' : 'bg-red-500/20 border-red-500/30') 
                    : (isSunrise ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-500/20 border-yellow-500/30')} border rounded-xl p-3`}>
                  <p className={`text-xs ${isOverdue 
                      ? (isSunrise ? 'text-red-600' : 'text-red-400') 
                      : (isSunrise ? 'text-yellow-700' : 'text-yellow-400')} mb-1`}>
                    {isOverdue ? '⚠️ เลยเวลา' : '📅 จองไว้'}
                  </p>
                  <p className={`text-lg font-bold ${theme?.colors?.text?.primary || 'text-white'}`}>{reservedBooking.customerName}</p>
                  <p className={`text-sm ${theme?.colors?.text?.secondary || 'text-white/60'}`}>
                    {reservedBooking.localStartTime} - {reservedBooking.localEndTime}
                  </p>
                </div>
                
                <GlowButton
                  color={isOverdue ? (isSunrise ? 'red' : 'red-dark') : (isSunrise ? 'green' : 'emerald-dark')}
                  className="w-full py-3"
                  onClick={onCheckIn}
                  disabled={isUpdating}
                >
                  ✅ Check-in
                </GlowButton>
              </div>
            )}

            {/* MANUAL & QUEUE ACTIONS (Always visible when not in use) */}
            <div className="space-y-2">
              <GlowButton
                color={isSunrise ? 'green' : 'emerald-dark'}
                className="w-full py-3"
                onClick={onStartManual}
                disabled={isUpdating}
              >
                ▶️ เริ่มเล่น (ผู้เล่นทั่วไป)
              </GlowButton>
              {waitingQueue.length > 0 && (
                <GlowButton
                  color="purple"
                  className="w-full py-3"
                  onClick={onSelectFromQueue}
                  disabled={isUpdating}
                >
                  📋 เลือกจากคิว ({waitingQueue.length})
                </GlowButton>
              )}
            </div>
          </div>
        )}

        {/* IN USE STATE */}
        {stationState === 'in_use' && activeSession && (
          <div className="space-y-3">
            <div 
              className={`${isSunrise ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' : 'bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30'} border rounded-xl p-3 cursor-pointer transition-colors`}
              onClick={() => onViewDetails(activeSession)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-xs ${isSunrise ? 'text-orange-600' : 'text-orange-400'} mb-1`}>👤 ผู้เล่น (กดเพื่อดูรายละเอียด)</p>
                  <p className={`text-lg font-bold ${theme?.colors?.text?.primary || 'text-white'}`}>{activeSession.customerName}</p>
                </div>
                <span className="text-lg">ℹ️</span>
              </div>
            </div>
            
            <SessionTimer 
              startTime={activeSession.startTime} 
              estimatedEndTime={activeSession.estimatedEndTime}
              theme={theme}
            />
            
            <GlowButton
              color={isSunrise ? 'red' : 'red-dark'}
              className="w-full py-3"
              onClick={onEndSession}
              disabled={isUpdating}
            >
              ⏹️ จบการเล่น
            </GlowButton>
          </div>
        )}

        {/* Upcoming Bookings */}
        {station.upcomingBookings.length > 0 && (
          <div className={`pt-2 border-t ${theme?.id === 'sunrise' ? 'border-gray-200' : 'border-white/10'}`}>
            <p className={`text-xs ${theme?.id === 'sunrise' ? 'text-gray-500' : 'text-white/40'} mb-2`}>การจองถัดไป</p>
            <div className="space-y-1">
              {station.upcomingBookings.map(b => (
                <div key={b.id} className={`flex justify-between text-sm ${theme?.colors?.text?.secondary || 'text-white/60'}`}>
                  <span>{b.customerName}</span>
                  <span>{b.localStartTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Schedule Slots Bar */}
        <div className={`pt-2 border-t ${theme?.id === 'sunrise' ? 'border-gray-200' : 'border-white/10'}`}>
           <div className="flex gap-[1px] h-2 w-full rounded-full overflow-hidden mb-1">
             {station.slots.map((slot) => {
               // Determine color based on status and theme
               let bgClass = theme?.id === 'sunrise' ? 'bg-gray-200' : 'bg-white/10'; // Default/Unknown
               if (slot.status === 'passed') bgClass = theme?.id === 'sunrise' ? 'bg-gray-100' : 'bg-white/5';
               else if (slot.status === 'booked') bgClass = theme?.id === 'sunrise' ? 'bg-red-400' : 'bg-red-900';
               else if (slot.status === 'available') bgClass = theme?.id === 'sunrise' ? 'bg-emerald-400' : 'bg-emerald-900';
               
               return (
                 <div 
                   key={slot.id} 
                   className={`flex-1 ${bgClass} cursor-pointer hover:opacity-80 transition-opacity relative group`}
                   title={`${slot.startTime} - ${slot.endTime} (${slot.status})`} 
                   onClick={(e) => {
                     e.stopPropagation();
                     // If it's the active session, view session details
                     if (activeSession && (
                         activeSession.id === slot.bookingId || 
                         (activeSession.bookingId && activeSession.bookingId === slot.bookingId)
                       )) {
                       onViewDetails(activeSession);
                       return;
                     }
                     
                     // Otherwise try to find the booking
                     if (slot.bookingId && station.allBookings) {
                       const booking = station.allBookings.find(b => b.id === slot.bookingId);
                       if (booking) {
                         onViewBookingDetail(booking);
                       }
                     }
                   }}
                 />
               );
             })}
           </div>
           <div className={`flex justify-between text-[10px] ${theme?.id === 'sunrise' ? 'text-gray-500' : 'text-white/30'} font-mono`}>
             <span>00:00</span>
             <span>12:00</span>
             <span>23:59</span>
           </div>
        </div>
      </div>
    </div>
  );
}



function HistoryModal({
  machineId,
  machineName,
  sessions,
  onClose,
  isLoading,
}: {
  machineId: string | null;
  machineName: string;
  sessions: Session[];
  onClose: () => void;
  isLoading: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Show only 5 items if not expanded
  const displayedSessions = isExpanded ? sessions : sessions.slice(0, 5);
  const hiddenCount = sessions.length - 5;

  return (
    <Portal>
      <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
        <div className={`bg-slate-800 rounded-2xl border border-white/20 w-full max-w-2xl p-6 flex flex-col transition-all duration-300 ${isExpanded ? 'h-[80vh]' : 'max-h-[80vh]'}`}>
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
              <h3 className="text-xl font-bold text-white">
                📜 ประวัติการเล่น
              </h3>
              <p className="text-white/60 text-sm mt-1">
                เครื่อง: {machineName} (ล่าสุด {sessions.length} รายการ)
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/40 hover:text-white text-xl w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar space-y-2 pr-2">
            {isLoading && sessions.length === 0 ? (
              <div className="text-center py-10 text-white/40">
                กำลังโหลด...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-10 text-white/40">
                ไม่มีประวัติการเล่น
              </div>
            ) : (
              <>
                {displayedSessions.map((session) => (
                  <div key={session.id} className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-lg font-bold text-white block">{session.customerName}</span>
                        <div className="flex gap-2 mt-1">
                           <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full inline-block">
                             {session.sourceType === 'manual' || !session.sourceType ? 'ผู้เล่นทั่วไป' : session.sourceType}
                           </span>
                           {session.notes && (
                              <span className="text-xs text-yellow-500/80 bg-yellow-500/10 px-2 py-0.5 rounded-full inline-block">
                                📝 มีโน้ต
                              </span>
                           )}
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-emerald-600 font-bold">฿{session.totalAmount || 0}</div>
                         <div className={`text-xs ${session.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-red-500'}`}>
                           {session.paymentStatus === 'paid' ? 'จ่ายแล้ว' : 'ยังไม่จ่าย'}
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60 font-mono bg-black/20 p-2 rounded-lg">
                      <div>
                        <span className="opacity-50 mr-2">Start:</span>
                        {dayjs(session.startTime).format('HH:mm')}
                      </div>
                      <div>
                        <span className="opacity-50 mr-2">End:</span>
                        {session.endTime ? dayjs(session.endTime).format('HH:mm') : '-'}
                      </div>
                      <div className="ml-auto">
                        {session.durationMinutes ? `${session.durationMinutes} min` : 'On-going'}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show Expand Button if there are hidden items */}
                {!isExpanded && hiddenCount > 0 && (
                  <button 
                    onClick={() => setIsExpanded(true)}
                    className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    👇 แสดงเพิ่มอีก {hiddenCount} รายการ
                  </button>
                )}
                
                {/* Show Collapse Button if expanded */}
                {isExpanded && sessions.length > 5 && (
                   <button 
                     onClick={() => setIsExpanded(false)}
                     className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm font-medium sticky bottom-0 bg-slate-800/90 backdrop-blur"
                   >
                     👆 ย่อรายการ
                   </button>
                )}
              </>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
            <GlowButton color="purple" className="w-full" onClick={onClose}>
              ปิด
            </GlowButton>
          </div>
        </div>
      </div>
    </Portal>
  );
}

function QueueSelectItem({
  queue,
  isUpdating,
  onSelect,
}: {
  queue: WalkInQueue;
  isUpdating: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
            #{queue.queueNumber}
          </span>
          <span className="font-bold text-white">{queue.customerName}</span>
        </div>
        {queue.preferredMachineName && (
          <p className="text-xs text-white/50 mt-1">
            ต้องการ: {queue.preferredMachineName}
          </p>
        )}
      </div>
      <GlowButton
        color="green"
        size="sm"
        onClick={onSelect}
        disabled={isUpdating}
      >
        เลือก
      </GlowButton>
    </div>
  );
}

function EndSessionModal({
  sessionId,
  onClose,
  onConfirm,
  isLoading,
}: {
  sessionId: string;
  onClose: () => void;
  onConfirm: (amount?: number) => void;
  isLoading: boolean;
}) {
  const [amount, setAmount] = useState<string>('');

  return (
    <Portal>
      <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl border border-white/20 w-full max-w-sm p-6 relative">
          <h3 className="text-xl font-bold text-white mb-2">
            ⏹️ จบการเล่น?
          </h3>
          <p className="text-white/60 mb-6">
            ยืนยันการจบการทำงาน? ระบบจะคำนวณเงินให้อัตโนมัติ หรือคุณสามารถระบุยอดเงินเองได้
          </p>

          <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
            <label className="text-xs text-white/40 block mb-2">ระบุยอดเงิน (บาท) *เว้นว่างเพื่อคำนวณอัตโนมัติ</label>
            <div className="flex items-center gap-2">
              <span className="text-white/40 font-bold">฿</span>
              <input
                type="number"
                placeholder="Auto"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-xl font-bold text-white placeholder-white/20 focus:outline-none w-full border-b border-white/10 focus:border-purple-500 transition-colors pb-1"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-3">
            <GlowButton
              color="purple"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              ยกเลิก
            </GlowButton>
            <GlowButton
              color="red"
              className="flex-1"
              onClick={() => {
                const parsedAmount = amount ? parseFloat(amount) : undefined;
                onConfirm(parsedAmount);
              }}
              disabled={isLoading}
            >
              จบการทำงาน
            </GlowButton>
          </div>
        </div>
      </div>
    </Portal>
  );
}


// ============================================================
// SKELETON COMPONENT
// ============================================================

export function ControlViewSkeleton() {
  return (
    <div className="fixed inset-0 z-[100] overflow-auto bg-neutral-900">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
        {/* Row 1: Back, Title, Time */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            {/* Time skeleton */}
            <div className="bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
              <div className="h-6 w-20 bg-white/10 rounded animate-pulse" />
            </div>
            
            {/* Theme switcher skeleton */}
            <div className="px-3 h-10 rounded-xl bg-white/10 border border-white/20 w-24 animate-pulse" />
            
            {/* Refresh skeleton */}
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 animate-pulse" />
          </div>
        </div>
        
        {/* Row 2: Stats Grid */}
        <div className="px-3 pb-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-white/10 rounded animate-pulse" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-5 w-8 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Station Grid Skeleton */}
      <div className="px-3 py-3 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <StationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StationCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/20 bg-zinc-900/80 backdrop-blur-sm">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
            <div>
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-1" />
              <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Action buttons skeleton */}
        <div className="space-y-2">
          <div className="w-full h-12 rounded-xl bg-white/10 animate-pulse" />
          <div className="w-full h-12 rounded-xl bg-white/10 animate-pulse" />
        </div>

        {/* Schedule bar skeleton */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex gap-[1px] h-2 w-full rounded-full overflow-hidden mb-1 bg-white/5 animate-pulse" />
          <div className="flex justify-between">
            <div className="h-3 w-10 bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-10 bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-10 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
