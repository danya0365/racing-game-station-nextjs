'use client';

import { AnimatedButton } from '@/src/presentation/components/ui/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/ui/AnimatedCard';
import dayjs from 'dayjs';
import { useState } from 'react';

import { WalkInStatus } from '@/src/application/repositories/IWalkInQueueRepository';

// Type alias match BackendView
type QueueStatus = WalkInStatus | 'playing' | 'completed' | 'cancelled';

interface QueuesTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queues: any[];
  queueStats?: any;
  isUpdating: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUpdateStatus: (id: string, status: QueueStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function QueuesTab({ 
  queues, 
  queueStats,
  isUpdating, 
  currentPage,
  totalPages,
  onPageChange,
  onUpdateStatus, 
  onDelete 
}: QueuesTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const itemsPerPage = 20;

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(dayjs(dateString).toDate());
  };

  // `color` is the pill fill and `onColor` the text that sits on it. They differ
  // because the two colour sets have different on-colours: a branch flag is dark
  // in both modes (white text), while the LED colours are dark in light mode but
  // turn bright in dark mode, where white on them would drop to ~1.9:1.
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'waiting':
        return { label: 'รอคิว', color: 'bg-racing-flag', onColor: 'text-racing-on-flag', textColor: 'text-racing-flag-text' };
      case 'called':
        return { label: 'เรียกแล้ว', color: 'bg-racing-led-info', onColor: 'text-racing-led-on', textColor: 'text-racing-led-info' };
      case 'seated':
        return { label: 'เริ่มเล่นแล้ว', color: 'bg-racing-led-go', onColor: 'text-racing-led-on', textColor: 'text-racing-led-go' };
      case 'cancelled':
        return { label: 'ยกเลิก', color: 'bg-racing-led-stop', onColor: 'text-racing-led-on', textColor: 'text-racing-led-stop' };
      default:
        return { label: status, color: 'bg-racing-led-off', onColor: 'text-racing-led-on', textColor: 'text-racing-led-off' };
    }
  };

  // Filter queues by status (Client-side filtering on the fetched page)
  const filteredQueues = statusFilter === 'all' 
    ? queues 
    : queues.filter(q => q.status === statusFilter);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    // onPageChange(1); // Optional: if we want to reset page on filter change, but filtering is client-side on chunk currently.
  };

  // Count by status for filter badges
  const statusCounts = {
    all: queues.length,
    waiting: queues.filter(q => q.status === 'waiting').length,
    called: queues.filter(q => q.status === 'called').length,
    seated: queues.filter(q => q.status === 'seated').length,
    cancelled: queues.filter(q => q.status === 'cancelled').length,
  };

  // `onColor`/`badgeOn` follow the same flag-vs-LED split as the status pills.
  const filterButtons = [
    { key: 'all', label: 'ทั้งหมด', icon: '📋', color: 'from-racing-led-off to-racing-led-off', onColor: 'text-racing-led-on', badgeOn: 'bg-racing-led-on/20' },
    { key: 'waiting', label: 'รอคิว', icon: '⏳', color: 'from-racing-flag to-racing-flag-soft', onColor: 'text-racing-on-flag', badgeOn: 'bg-racing-on-flag/20' },
    { key: 'called', label: 'เรียกแล้ว', icon: '🔔', color: 'from-racing-led-info to-racing-led-info', onColor: 'text-racing-led-on', badgeOn: 'bg-racing-led-on/20' },
    { key: 'seated', label: 'เริ่มเล่นแล้ว', icon: '✅', color: 'from-racing-led-go to-racing-led-go', onColor: 'text-racing-led-on', badgeOn: 'bg-racing-led-on/20' },
    { key: 'cancelled', label: 'ยกเลิก', icon: '❌', color: 'from-racing-led-stop to-racing-led-stop', onColor: 'text-racing-led-on', badgeOn: 'bg-racing-led-on/20' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground">
          คิววันนี้ ({filteredQueues.length}{statusFilter !== 'all' ? ` / ${queues.length}` : ''})
        </h3>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleFilterChange(btn.key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              statusFilter === btn.key
                ? `bg-gradient-to-r ${btn.color} ${btn.onColor} shadow-lg`
                : 'bg-surface border border-border text-muted hover:bg-muted-light hover:text-foreground'
            }`}
          >
            <span>{btn.icon}</span>
            <span>{btn.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              statusFilter === btn.key 
                ? btn.badgeOn
                : 'bg-muted-light'
            }`}>
              {statusCounts[btn.key as keyof typeof statusCounts]}
            </span>
          </button>
        ))}
      </div>

      {/* Queue List */}
      {filteredQueues.length === 0 ? (
        <AnimatedCard className="p-8 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-muted">
            {statusFilter === 'all' ? 'ยังไม่มีคิววันนี้' : `ไม่มีคิวสถานะ "${getStatusConfig(statusFilter).label}"`}
          </p>
        </AnimatedCard>
      ) : (
        <div className="space-y-3">
          {filteredQueues.map((queue) => {
            const statusConfig = getStatusConfig(queue.status);
            return (
              <AnimatedCard key={queue.id} className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-racing-flag to-racing-flag-soft flex items-center justify-center text-xl font-bold text-racing-on-flag">
                      #{queue.queueNumber}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{queue.customerName}</p>
                      <p className="text-sm text-muted">{queue.customerPhone}</p>
                      <p className="text-xs text-muted mt-1">
                        🕐 {formatTime(queue.joinedAt)} • {queue.partySize} ท่าน
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full ${statusConfig.color} ${statusConfig.onColor} text-xs font-medium`}>
                      {statusConfig.label}
                    </span>

                    {queue.status === 'waiting' && (
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        onClick={() => onUpdateStatus(queue.id, 'called')}
                        disabled={isUpdating}
                      >
                        🔔 เรียกคิว
                      </AnimatedButton>
                    )}

                    {queue.status === 'called' && (
                      <div className="text-xs text-muted italic">รอจัดที่นั่งที่ 'ควบคุมห้องเกม'</div>
                    )}

                    {(queue.status === 'waiting' || queue.status === 'called') && (
                      <AnimatedButton
                        variant="danger"
                        size="sm"
                        onClick={() => onUpdateStatus(queue.id, 'cancelled')}
                        disabled={isUpdating}
                      >
                        ❌ ยกเลิก
                      </AnimatedButton>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-surface border border-border text-muted hover:bg-muted-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← ก่อนหน้า
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .map((page, index, arr) => {
                const prevPage = arr[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;
                
                return (
                  <span key={page} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-2 text-muted">...</span>}
                    <button
                      onClick={() => onPageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-racing-flag to-racing-flag-soft text-racing-on-flag shadow-lg'
                          : 'bg-surface border border-border text-muted hover:bg-muted-light'
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                );
              })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-surface border border-border text-muted hover:bg-muted-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ถัดไป →
          </button>
        </div>
      )}

      {/* Summary Footer */}
      {filteredQueues.length > 0 && (
        <div className="text-center text-sm text-muted">
          แสดงหน้า {currentPage}
        </div>
      )}
    </div>
  );
}
