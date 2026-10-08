/**
 * IWalkInQueueRepository
 * Repository interface for Walk-In Queue data access
 * Following Clean Architecture - Application layer
 * 
 * This replaces the old IQueueRepository with redesigned status flow:
 * waiting → called → seated → (creates session)
 *         ↘ cancelled
 */

// ============================================================
// TYPES
// ============================================================

export type WalkInStatus = 'waiting' | 'called' | 'seated' | 'cancelled';

/**
 * Walk-In Queue entry
 */
export interface WalkInQueue {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  preferredMachineId?: string;
  preferredMachineName?: string;
  partySize: number;
  preferredStationType?: string;
  queueNumber: number;
  status: WalkInStatus;
  notes?: string;
  joinedAt: string;
  calledAt?: string;
  seatedAt?: string;
  waitTimeMinutes?: number;
  queuesAhead?: number;
  estimatedWaitMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Statistics for walk-in queue
 */
export interface WalkInQueueStats {
  waitingCount: number;
  calledCount: number;
  seatedToday: number;
  cancelledToday: number;
  averageWaitMinutes: number;
  totalHistoryCount?: number;
}

/**
 * Data required to join walk-in queue
 */
export interface JoinWalkInQueueData {
  customerName: string;
  customerPhone: string;
  partySize?: number;
  preferredStationType?: string;
  preferredMachineId?: string;
  notes?: string;
  customerId: string; // For ownership verification (empty string if new/guest)
  /**
   * Branch to queue into. Only used when no machine is picked — when a
   * machine is given, the RPC derives the branch from that machine instead.
   */
  branchId?: string;
}



// ============================================================
// REPOSITORY INTERFACE
// ============================================================

export interface IWalkInQueueRepository {
  /**
   * Get queue entry by ID
   */
  getById(id: string): Promise<WalkInQueue | null>;

  /**
   * Get all queue entries (paginated)
   */
  /**
   * @param branchId - Restrict to one branch; omit for all branches
   */
  getAll(limit?: number, page?: number, branchId?: string): Promise<WalkInQueue[]>;

  /**
   * Get all waiting queue entries (ordered by queue number)
   *
   * @param branchId - Restrict to one branch; omit for all
   */
  getWaiting(branchId?: string): Promise<WalkInQueue[]>;

  /**
   * Get queue entries by customer ID
   */
  getByCustomerId(customerId: string): Promise<WalkInQueue[]>;

  /**
   * Get my active queue status (for customer view)
   */
  getMyQueueStatus(customerId: string): Promise<WalkInQueue[]>;

  /**
   * Join the walk-in queue
   */
  join(data: JoinWalkInQueueData): Promise<WalkInQueue>;

  /**
   * Call a customer from the queue (status: waiting → called)
   */
  callCustomer(queueId: string): Promise<WalkInQueue>;



  /**
   * Cancel a queue entry (status: waiting/called → cancelled)
   */
  cancel(queueId: string, customerId?: string): Promise<boolean>;

  /**
   * Get the next queue number for today
   */
  getNextQueueNumber(): Promise<number>;

  /**
   * Get statistics
   */
  getStats(branchId?: string): Promise<WalkInQueueStats>;
}
