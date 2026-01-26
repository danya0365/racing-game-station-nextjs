'use client';

import type { WalkInStatus } from '@/src/application/repositories/IWalkInQueueRepository';
import { AnimatedButton } from '@/src/presentation/components/ui/AnimatedButton';
import { GlowButton } from '@/src/presentation/components/ui/GlowButton';
import {
  BackendSkeleton
} from '@/src/presentation/components/ui/Skeleton';
import { BackendViewModel } from '@/src/presentation/presenters/backend/BackendPresenter';
import { useBackendPresenter } from '@/src/presentation/presenters/backend/useBackendPresenter';
import Link from 'next/link';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { BookingsTab } from './BookingsTab';
import { CustomersTab } from './CustomersTab';
import { DashboardTab } from './DashboardTab';
import { MachinesTab } from './MachinesTab';
import { QueuesTab } from './QueuesTab';
import { QuickBookingQRCode } from './QuickBookingQRCode';
import { SessionsTab } from './SessionsTab';

// Type alias for backward compatibility - includes legacy 'playing' and 'completed' statuses
type QueueStatus = WalkInStatus | 'playing' | 'completed' | 'cancelled';

interface BackendViewProps {
  initialViewModel?: BackendViewModel;
}

export function BackendView({ initialViewModel }: BackendViewProps) {
  const [state, actions] = useBackendPresenter(initialViewModel);
  const viewModel = state.viewModel;

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const handlePrintQR = useReactToPrint({
    contentRef: qrCodeRef,
  });

  // NOTE: Removed pageSpring for better performance
  // Using CSS animations instead (animate-page-in)

  // Loading state - using Skeleton UI instead of spinner
  if (state.loading && !viewModel) {
    return <BackendSkeleton />;
  }

  // Error state
  if (state.error && !viewModel) {
    return (
      <div className="h-full flex items-center justify-center bg-racing-gradient">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-error mb-4">{state.error}</p>
          <GlowButton color="purple" onClick={actions.loadData}>
            ลองใหม่อีกครั้ง
          </GlowButton>
        </div>
      </div>
    );
  }

  if (!viewModel) return null;

  return (
    <div className="h-full overflow-auto scrollbar-thin">
      {/* Header */}
      <section className="px-4 md:px-8 py-6 bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl shadow-lg">
                ⚙️
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    แอดมิน Dashboard
                  </span>
                </h1>
                <p className="text-muted">จัดการคิวและเครื่องเล่น</p>
              </div>
            </div>

            <div className="flex gap-3">
              <GlowButton color="cyan" onClick={() => handlePrintQR && handlePrintQR()}>
                🖨️ Print QR
              </GlowButton>
              <Link href="/backend/control">
                <GlowButton color="pink">
                  📅 ห้องควบคุม
                </GlowButton>
              </Link>
              <AnimatedButton variant="secondary" onClick={actions.refreshData}>
                🔄 รีเฟรช
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 md:px-8 py-4 bg-surface/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          <TabButton
            active={state.activeTab === 'dashboard'}
            onClick={() => actions.setActiveTab('dashboard')}
          >
            📊 Dashboard
          </TabButton>
          <TabButton
            active={state.activeTab === 'machines'}
            onClick={() => actions.setActiveTab('machines')}
          >
            🎮 จัดการเครื่อง ({viewModel.machines.length})
          </TabButton>
          <TabButton
            active={state.activeTab === 'customers'}
            onClick={() => actions.setActiveTab('customers')}
          >
            👥 จัดการลูกค้า
          </TabButton>
          <TabButton
            active={state.activeTab === 'queues'}
            onClick={() => actions.setActiveTab('queues')}
          >
            🚶 คิว Walk-in ({viewModel.waitingQueues.length})
          </TabButton>
          <TabButton
            active={state.activeTab === 'advanceBookings'}
            onClick={() => actions.setActiveTab('advanceBookings')}
          >
            📅 จองเวลา
          </TabButton>
          <TabButton
            active={state.activeTab === 'sessions'}
            onClick={() => actions.setActiveTab('sessions')}
          >
            ⏱️ ประวัติการเล่น
          </TabButton>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {state.activeTab === 'dashboard' && (
            <DashboardTab viewModel={viewModel} />
          )}
          {state.activeTab === 'queues' && (
            <QueuesTab
              queues={viewModel.walkInQueues || []}
              queueStats={viewModel.walkInQueueStats}
              isUpdating={state.isUpdating}
              currentPage={state.pagination?.page || 1}
              totalPages={Math.ceil((viewModel.walkInQueueStats?.totalHistoryCount || 0) / (state.pagination?.limit || 20))}
              onPageChange={actions.setPage}
              onUpdateStatus={actions.updateQueueStatus}
              onDelete={actions.deleteQueue}
            />
          )}
          {state.activeTab === 'machines' && (
            <MachinesTab
              machines={viewModel.machines}
              isUpdating={state.isUpdating}
              onUpdateStatus={actions.updateMachineStatus}
              onUpdateMachine={actions.updateMachine}
            />
          )}
          {state.activeTab === 'customers' && (
            <CustomersTab />
          )}
          {state.activeTab === 'advanceBookings' && (
            <BookingsTab />
          )}
          {state.activeTab === 'sessions' && (
            <SessionsTab 
              sessions={viewModel.sessions || []}
              sessionStats={viewModel.sessionStats}
              totalSessions={viewModel.sessionStats.totalSessions}
              currentPage={state.pagination?.page || 1}
              totalPages={Math.ceil((viewModel.sessionStats.totalSessions || 0) / (state.pagination?.limit || 20))}
              onPageChange={actions.setPage}
              onUpdatePayment={actions.updateSessionPayment}
              onUpdateAmount={actions.updateSessionAmount}
            />
          )}
        </div>
      </section>

      {/* Error Toast */}
      {state.error && viewModel && (
        <div className="fixed bottom-4 right-4 bg-error text-white px-6 py-3 rounded-xl shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{state.error}</span>
            <button onClick={() => actions.setError(null)} className="ml-4 hover:opacity-70">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hidden Printable Component */}
      <div style={{ display: 'none' }}>
        <QuickBookingQRCode ref={qrCodeRef} url="http://localhost:3000/time-booking" />
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
          : 'bg-surface text-muted hover:bg-muted-light hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}





// Queue Detail Modal




// Machines Tab







