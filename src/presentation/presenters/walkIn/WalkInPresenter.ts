/**
 * WalkInPresenter
 * Handles business logic for the redesigned Walk-in Queue flow
 */

import { IMachineRepository, Machine } from '@/src/application/repositories/IMachineRepository';
import { IWalkInQueueRepository, JoinWalkInQueueData, WalkInQueue } from '@/src/application/repositories/IWalkInQueueRepository';

export interface WalkInViewModel {
  currentQueue: WalkInQueue | null;
  availableMachines: Machine[];
  isLoading: boolean;
  error: string | null;
}

export class WalkInPresenter {
  constructor(
    private readonly walkInRepo: IWalkInQueueRepository,
    private readonly machineRepo: IMachineRepository
  ) {}

  /**
   * Join the walk-in queue
   */
  /**
   * Join the walk-in queue
   * @param branchId - Used only when no machine is picked; otherwise the RPC
   *   derives the branch from the chosen machine so a queue can't land in the
   *   wrong branch.
   */
  async joinQueue(data: JoinWalkInQueueData, branchId?: string): Promise<WalkInQueue> {
    try {
      return await this.walkInRepo.join({
        ...data,
        branchId: data.preferredMachineId ? undefined : (data.branchId ?? branchId),
      });
    } catch (error) {
      console.error('Error joining queue:', error);
      throw error;
    }
  }

  /**
   * Get queue status for a customer
   */
  async getMyQueueStatus(customerId: string): Promise<WalkInQueue | null> {
    try {
      const queues = await this.walkInRepo.getMyQueueStatus(customerId);
      // Return the most recent active queue
      return queues[0] || null;
    } catch (error) {
      console.error('Error getting queue status:', error);
      return null;
    }
  }

  /**
   * Get active machines (status can be anything, but must be isActive=true)
   * @param branchId - Restrict machines to one branch
   */
  async getActiveMachines(branchId?: string): Promise<Machine[]> {
    try {
      // We want all machines that are present in the shop (isActive), regardless of status (occupied/available)
      const machines = await this.machineRepo.getAll(branchId);
      return machines.filter(m => m.isActive);
    } catch (error) {
      console.error('Error getting machines:', error);
      return [];
    }
  }

  /**
   * Cancel a queue entry
   */
  async cancelQueue(queueId: string, customerId: string): Promise<boolean> {
    try {
      return await this.walkInRepo.cancel(queueId, customerId);
    } catch (error) {
      console.error('Error cancelling queue:', error);
      throw error;
    }
  }
}
