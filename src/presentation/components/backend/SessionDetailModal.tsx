'use client';

import { Session } from '@/src/application/repositories/ISessionRepository';
import { GlowButton } from '@/src/presentation/components/ui/GlowButton';
import { Portal } from '@/src/presentation/components/ui/Portal';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';

dayjs.extend(duration);

interface SessionDetailModalProps {
  session: Session;
  onClose: () => void;
  onUpdatePayment?: (sessionId: string, status: 'paid' | 'unpaid' | 'partial') => void;
  onUpdateAmount?: (sessionId: string, amount: number) => Promise<void>;
}

export function SessionDetailModal({
  session,
  onClose,
  onUpdatePayment,
  onUpdateAmount,
}: SessionDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [editAmount, setEditAmount] = useState<string>('');

  useEffect(() => {
    if (session.totalAmount !== undefined) {
      setEditAmount(session.totalAmount.toString());
    }
  }, [session.totalAmount]);

  const handlePaymentUpdate = async (status: 'paid' | 'unpaid') => {
    if (!onUpdatePayment) return;
    setIsUpdating(true);
    try {
       await onUpdatePayment(session.id, status);
       // Wait a bit for effect
       await new Promise(r => setTimeout(r, 500));
       onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAmountUpdate = async () => {
    if (!onUpdateAmount) return;
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount < 0) return;

    setIsUpdating(true);
    try {
      await onUpdateAmount(session.id, amount);
      setIsEditingAmount(false);
      // Optional: don't close, just update state
    } catch (e) {
      console.error(e);
      alert('Failed to update amount');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl border border-white/20 w-full max-w-lg p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white"
          >
            ✕
          </button>
          
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            📄 รายละเอียดรอบการเล่น
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-xs text-white/40 mb-1">ลูกค้า</p>
                <p className="text-lg font-bold text-white">{session.customerName}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-xs text-white/40 mb-1">เครื่อง</p>
                <p className="text-lg font-bold text-white">{session.stationName || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">เริ่มเวลา</span>
                <span className="text-white font-mono">{dayjs(session.startTime).format('HH:mm:ss')}</span>
              </div>
              {session.endTime ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-white/60">สิ้นสุดเวลา</span>
                    <span className="text-white font-mono">{dayjs(session.endTime).format('HH:mm:ss')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">ระยะเวลา</span>
                    <span className="text-white font-mono">{session.durationMinutes} นาที</span>
                  </div>
                </>
              ) : (
                <div className="mt-2 -mx-2">
                  <SessionTimer 
                    startTime={session.startTime} 
                    estimatedEndTime={session.estimatedEndTime}
                  />
                </div>
              )}
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span className="text-white/60">ประเภท</span>
                <span className="text-emerald-400 capitalize">
                  {session.sourceType === 'booking' && 'จองล่วงหน้า'}
                  {session.sourceType === 'walk_in' && 'คิวหน้าร้าน (Walk-in)'}
                  {(session.sourceType === 'manual' || !session.sourceType) && 'ผู้เล่นทั่วไป'}
                </span>
              </div>
            </div>

            {session.notes && (
              <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                <p className="text-xs text-yellow-500 mb-1">หมายเหตุ</p>
                <p className="text-white/80 text-sm">{session.notes}</p>
              </div>
            )}
            
            {/* Payment Section */}
            {session.totalAmount !== undefined && (
              <div className={`p-4 rounded-xl border transition-all ${
                session.paymentStatus === 'paid' 
                  ? 'bg-emerald-500/20 border-emerald-500/30' 
                  : 'bg-red-500/20 border-red-500/30'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={session.paymentStatus === 'paid' ? 'text-emerald-300' : 'text-red-300'}>
                    ยอดชำระ
                  </span>
                  
                  {isEditingAmount ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="bg-black/30 border border-white/20 rounded px-2 py-1 text-white w-24 text-right font-bold focus:outline-none focus:border-purple-500"
                        autoFocus
                      />
                      <button 
                        onClick={handleAmountUpdate}
                        disabled={isUpdating}
                        className="w-8 h-8 rounded bg-green-500/20 text-green-400 hover:bg-green-500/40 flex items-center justify-center"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingAmount(false);
                          setEditAmount(session.totalAmount?.toString() || '0');
                        }}
                        className="w-8 h-8 rounded bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-white">฿{session.totalAmount}</span>
                      {onUpdateAmount && session.paymentStatus !== 'paid' && (
                        <button 
                          onClick={() => setIsEditingAmount(true)}
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                          title="แก้ไขราคา"
                        >
                          ✎
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/10">
                   <div className="flex items-center gap-2">
                     <span className={`w-3 h-3 rounded-full ${session.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                     <span className="text-sm font-medium text-white/80">
                       {session.paymentStatus === 'paid' ? 'ชำระเงินเรียบร้อย' : 'ยังไม่ชำระเงิน'}
                     </span>
                   </div>

                   {onUpdatePayment && (
                     session.paymentStatus === 'paid' ? (
                       <button 
                         onClick={() => handlePaymentUpdate('unpaid')}
                         disabled={isUpdating}
                         className="text-xs text-white/40 hover:text-white underline disabled:opacity-50"
                       >
                         ยกเลิกการชำระ
                       </button>
                     ) : (
                       <GlowButton 
                         color="green" 
                         size="sm"
                         onClick={() => handlePaymentUpdate('paid')}
                         disabled={isUpdating}
                         className="px-6"
                       >
                         {isUpdating ? 'บันทึก...' : '✅ รับเงิน'}
                       </GlowButton>
                     )
                   )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <GlowButton color="purple" className="w-full" onClick={onClose}>
              ปิด
            </GlowButton>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// Simplified SessionTimer for Modal usage only (No theming logic needed)
export function SessionTimer({ 
  startTime, 
  estimatedEndTime,
}: { 
  startTime: string; 
  estimatedEndTime?: string;
}) {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const diffMs = now.diff(dayjs(startTime));
  if (diffMs < 0) return null;

  const dur = dayjs.duration(diffMs);
  const hours = Math.floor(dur.asHours());
  const mins = dur.minutes();
  const secs = dur.seconds();

  const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  // Calculate remaining time
  let remainingStr = null;
  let isOvertime = false;
  
  if (estimatedEndTime) {
    const end = dayjs(estimatedEndTime);
    const remainingMs = end.diff(now);
    isOvertime = remainingMs < 0;
    
    const remainingDur = dayjs.duration(Math.abs(remainingMs));
    const rHours = Math.floor(remainingDur.asHours());
    const rMins = remainingDur.minutes();
    const rSecs = remainingDur.seconds();

    const timeString = `${rHours.toString().padStart(2, '0')}:${rMins.toString().padStart(2, '0')}:${rSecs.toString().padStart(2, '0')}`;
    
    remainingStr = isOvertime 
      ? `+${timeString}`
      : `-${timeString}`;
  }

  // Full View (Default Modal Style)
  return (
    <div className="bg-black/20 rounded-lg p-3 flex flex-col gap-1">
      <div className="flex justify-between items-center gap-2">
        <span className="text-sm text-white/60">⏱️ เวลาที่เล่น</span>
        <span className="font-mono font-bold text-xl text-emerald-400 animate-pulse">
          {timeStr}
        </span>
      </div>
      
      {remainingStr && (
        <div className="flex justify-between items-center border-t border-white/10 pt-1 mt-1">
           <span className="text-xs text-white/40">เหลือเวลา</span>
           <span className={`font-mono text-sm font-bold ${isOvertime ? 'text-red-400' : 'text-blue-300'}`}>
             {remainingStr}
           </span>
        </div>
      )}
    </div>
  );
}
