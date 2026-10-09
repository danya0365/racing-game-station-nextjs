'use client';

import { Machine } from '@/src/application/repositories/IMachineRepository';
import { WalkInQueue } from '@/src/application/repositories/IWalkInQueueRepository';
import { AnimatedButton } from '@/src/presentation/components/ui/AnimatedButton';
import dayjs from 'dayjs';
import { useState } from 'react';

// Type alias for backward compatibility
type Queue = WalkInQueue;

// Queue Detail Modal
interface QueueDetailModalProps {
  machine: Machine;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queues: any[];
  onClose: () => void;
}

export function QueueDetailModal({ 
  machine, 
  queues, 
  onClose 
}: QueueDetailModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const waitingQueues = queues.filter((q: any) => q.status === 'waiting').sort((a: any, b: any) => (a.queueNumber || a.position || 0) - (b.queueNumber || b.position || 0));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playingQueue = queues.find((q: any) => q.status === 'playing' || q.status === 'called' || q.status === 'seated');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedQueues = queues.filter((q: any) => q.status === 'completed' || q.status === 'seated').sort((a: any, b: any) => dayjs(b.updatedAt || b.seatedAt || b.joinedAt).unix() - dayjs(a.updatedAt || a.seatedAt || a.joinedAt).unix());

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(dayjs(dateString).toDate());
  };

  const [expanded, setExpanded] = useState(false);
  const INITIAL_SHOW_COUNT = 3;
  const visibleWaitingQueues = expanded ? waitingQueues : waitingQueues.slice(0, INITIAL_SHOW_COUNT);
  const remainingCount = waitingQueues.length - INITIAL_SHOW_COUNT;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 text-foreground">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-modal-in flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-border flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-lg">
                🎮
              </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">คิวเครื่อง: {machine.name}</h3>
              <p className="text-xs text-muted">ทั้งหมด {queues.length} รายการ (รอ {waitingQueues.length})</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface hover:bg-muted-light text-muted hover:text-foreground flex items-center justify-center transition-colors">✕</button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          
          {/* Playing Now */}
          <section>
             <h4 className="text-sm font-bold text-orange-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              กำลังเล่นอยู่
            </h4>
            {playingQueue ? (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                 <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground text-lg">{playingQueue.customerName}</p>
                      <p className="text-sm text-muted">{playingQueue.customerPhone}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-orange-400 font-bold mb-1">🏁 เริ่ม {formatTime(playingQueue.bookingTime)}</p>
                       <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-lg">
                        {playingQueue.duration} นาที
                       </span>
                    </div>
                 </div>
              </div>
            ) : (
               <div className="bg-surface border border-border/50 border-dashed rounded-xl p-4 text-center text-muted text-sm">
                 ว่าง - ไม่มีผู้เล่น
               </div>
            )}
          </section>

          {/* Waiting List */}
          <section>
            <h4 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              รอคิว ({waitingQueues.length})
            </h4>
            {waitingQueues.length > 0 ? (
              <div className="space-y-2">
                {visibleWaitingQueues.map((queue, index) => (
                  <div key={queue.id} className="bg-surface border border-border rounded-xl p-3 flex items-center justify-between hover:border-purple-500/30 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          index === 0 && !expanded ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-muted-light text-muted'
                        }`}>
                          {queue.position}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{queue.customerName}</p>
                          <p className="text-xs text-muted">{queue.customerPhone}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-muted mb-1">จอง {formatTime(queue.bookingTime)}</p>
                        <span className="px-2 py-0.5 bg-muted-light text-muted text-xs rounded-md">
                          {queue.duration} นาที
                        </span>
                     </div>
                  </div>
                ))}

                {waitingQueues.length > INITIAL_SHOW_COUNT && (
                   <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full py-2 text-xs text-muted hover:text-purple-400 transition-colors flex items-center justify-center gap-1"
                   >
                     {expanded ? (
                       <>▲ ย่อลง</>
                     ) : (
                       <>▼ ดูเพิ่มเติม ({remainingCount} รายการ)</>
                     )}
                   </button>
                )}
              </div>
            ) : (
              <div className="bg-surface border border-border/50 border-dashed rounded-xl p-8 text-center">
                 <div className="text-2xl mb-2">🍃</div>
                 <p className="text-muted text-sm">ไม่มีคิวรอ</p>
              </div>
            )}
          </section>

          {/* Recent Completed */}
          {completedQueues.length > 0 && (
             <section>
              <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                เล่นเสร็จล่าสุด
              </h4>
               <div className="space-y-2 opacity-70">
                {completedQueues.slice(0, 3).map((queue) => (
                  <div key={queue.id} className="bg-surface/50 border border-border/50 rounded-xl p-2 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs">
                          ✓
                        </div>
                        <span className="text-sm text-foreground">{queue.customerName}</span>
                     </div>
                     <span className="text-xs text-muted">{formatTime(queue.bookingTime)}</span>
                  </div>
                ))}
               </div>
             </section>
          )}

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface shrink-0">
          <AnimatedButton variant="primary" onClick={onClose} className="w-full">
            ปิดหน้าต่าง
          </AnimatedButton>
        </div>

      </div>
    </div>
  );
}
