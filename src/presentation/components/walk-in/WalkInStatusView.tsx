'use client';

import { WalkInQueue } from '@/src/application/repositories/IWalkInQueueRepository';
import { AnimatedCard } from '@/src/presentation/components/ui/AnimatedCard';
import { GlowButton } from '@/src/presentation/components/ui/GlowButton';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface WalkInStatusViewProps {
  queue: WalkInQueue;
  onCancel: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * WalkInStatusView
 * Real-time queue tracking UI for customers
 */
export function WalkInStatusView({ queue, onCancel, onRefresh }: WalkInStatusViewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const isNextUp = (queue.queuesAhead ?? 0) === 0 && queue.status === 'waiting';
  const isCalled = queue.status === 'called';
  const isSeated = queue.status === 'seated';

  const getStatusColor = () => {
    if (isSeated) return 'from-emerald-500 to-green-600';
    if (isCalled || isNextUp) return 'from-racing-flag to-racing-flag-soft';
    return 'from-racing-flag-soft to-racing-flag';
  };

  return (
    <div className={`fixed inset-0 z-[100] overflow-y-auto transition-colors duration-700 bg-white dark:bg-black`}>

      {/* Backdrop Layer - Fake View for Opacity */}
      <div className={`fixed inset-0 z-[-1] ${
      isSeated 
        ? 'bg-emerald-950' 
        : isCalled 
          ? 'bg-racing-bg' 
          : 'bg-racing-gradient'
    }`} />

      {/* Background Effects (Dark Mode Only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-racing-flag/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-racing-flag/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border hover:bg-muted-light dark:bg-white/10 dark:border-transparent dark:hover:bg-white/20 rounded-full text-foreground dark:text-white font-medium transition-all"
        >
          <span>←</span>
          <span className="hidden sm:inline">หน้าแรก</span>
        </Link>
      </header>

      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md relative z-10">
          {/* Header / Current Time */}
          <div className="flex justify-between items-center mb-8 px-2">
            <div className="bg-gradient-to-br from-racing-flag-dim to-racing-flag-dim dark:from-racing-flag-dim dark:to-racing-flag-dim border border-racing-line dark:border-racing-line rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <span className="text-racing-flag-text text-sm font-medium">เวลา:</span>
              <span className="text-racing-fg dark:text-white font-mono font-bold text-lg">{currentTime.format('HH:mm:ss')}</span>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`text-muted dark:text-white/60 hover:text-foreground dark:hover:text-white transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              🔄
            </button>
          </div>

          {/* Main Status Hero */}
          <AnimatedCard className="p-8 text-center overflow-hidden relative bg-white dark:bg-surface/80 border border-border dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none" glowColor="rgba(255,255,255,0.1)">
            {/* Animated Glow Background for Called state */}
            {(isCalled || isNextUp) && (
              <div className="absolute inset-0 bg-racing-flag-dim dark:bg-racing-flag-dim animate-pulse pointer-events-none" />
            )}

            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 bg-gradient-to-br ${getStatusColor()} flex flex-col items-center justify-center shadow-2xl relative z-10 ${isCalled || isNextUp ? 'animate-bounce' : ''}`}>
              <span className="text-white/90 dark:text-white/80 text-xs md:text-sm uppercase tracking-widest">ลำดับคิว</span>
              <span className="text-5xl md:text-6xl font-black text-white">#{queue.queueNumber}</span>
            </div>

            <div className="relative z-10 space-y-2">
              <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${
                isSeated ? 'text-emerald-600 dark:text-emerald-400' : isCalled ? 'text-racing-flag-text' : 'text-foreground dark:text-white'
              }`}>
                {isSeated ? '✅ พร้อมเล่นแล้ว' : isCalled ? '🔔 ถึงคิวคุณแล้ว!' : '⌛ กำลังรอคิว'}
              </h2>
              
              <p className="text-muted dark:text-white/60 text-lg">
                {isSeated 
                  ? 'ขอให้สนุกกับการซิ่ง!' 
                  : isCalled 
                  ? 'กรุณาติดต่อเจ้าหน้าที่ที่เคาน์เตอร์' 
                  : `มีอีก ${queue.queuesAhead ?? 0} คิวก่อนหน้าคุณ`}
              </p>
            </div>

            {!isSeated && !isCalled && (
              <div className="mt-8 pt-8 border-t border-border dark:border-white/10 space-y-1">
                <p className="text-muted dark:text-white/40 text-sm">เวลารอโดยประมาณ</p>
                <p className="text-3xl font-bold text-racing-flag-text">
                  ~{queue.estimatedWaitMinutes ?? (queue.queuesAhead ?? 0) * 30} นาที
                </p>
              </div>
            )}
          </AnimatedCard>

          {/* Customer Info Card */}
          <div className="mt-6 grid grid-cols-2 gap-4 animate-page-in delay-200">
             <div className="bg-white dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10 rounded-2xl p-4 shadow-none">
                <p className="text-muted dark:text-white/40 text-xs uppercase mb-1">ผู้เล่น</p>
                <p className="text-foreground dark:text-white font-bold truncate">{queue.customerName}</p>
             </div>
             <div className="bg-white dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10 rounded-2xl p-4 shadow-none">
                <p className="text-muted dark:text-white/40 text-xs uppercase mb-1">กลุ่ม</p>
                <p className="text-foreground dark:text-white font-bold">{queue.partySize} ท่าน</p>
             </div>
          </div>

          {/* Booking Details */}
          <div className="mt-4 animate-page-in delay-300 space-y-3">
             {/* Machine & Type */}
             <div className="bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                   <p className="text-muted dark:text-white/40 text-xs uppercase mb-1">เครื่องที่เลือก</p>
                   <p className="text-foreground dark:text-white font-bold">
                     {queue.preferredMachineName || (queue.preferredStationType ? `${queue.preferredStationType} (Any)` : 'ไม่ระบุ')}
                   </p>
                </div>
                <div className="text-2xl opacity-50">
                  {queue.preferredStationType?.includes('PS5') ? '🎮' : '🏎️'}
                </div>
             </div>

             {/* Notes */}
             {queue.notes && (
               <div className="bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl p-4">
                  <p className="text-muted dark:text-white/40 text-xs uppercase mb-1">หมายเหตุ</p>
                  <p className="text-foreground dark:text-white/80 text-sm whitespace-pre-wrap">
                    {queue.notes}
                  </p>
               </div>
             )}

             {/* Phone */}
             <div className="bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl p-4 flex justify-between items-center">
                 <div>
                    <p className="text-muted dark:text-white/40 text-xs uppercase mb-1">เบอร์โทรศัพท์</p>
                    <p className="text-foreground dark:text-white font-mono tracking-wider">{queue.customerPhone}</p>
                 </div>
                 <div className="text-xl opacity-50">📞</div>
             </div>
          </div>

          {/* Help Notice */}
          <div className="mt-8 p-4 bg-white/50 dark:bg-white/5 border border-dashed border-border dark:border-white/20 rounded-2xl text-center">
              <p className="text-muted dark:text-white/60 text-sm italic">
                "กรุณาอยู่ใกล้ๆ บริเวณร้านเพื่อไม่ให้พลาดการเรียกคิว"
              </p>
          </div>

          {/* Actions */}
          {!isSeated && (
            <div className="mt-8 flex flex-col gap-3 pb-8">
               <GlowButton 
                 color="red" 
                 className="w-full"
                 onClick={() => {
                   if (confirm('คุณต้องการยกเลิกคิวนี้ใช่หรือไม่?')) {
                     onCancel();
                   }
                 }}
               >
                 ❌ ยกเลิกคิวนี้
               </GlowButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
