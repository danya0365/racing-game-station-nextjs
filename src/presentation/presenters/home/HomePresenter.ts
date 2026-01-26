/**
 * HomePresenter
 * Handles business logic for Home page
 * Receives repository via dependency injection
 * 
 * ✅ Updated to use IWalkInQueueRepository (new schema)
 */

import { IBookingRepository } from '@/src/application/repositories/IBookingRepository';
import { IMachineRepository, Machine, MachineStats } from '@/src/application/repositories/IMachineRepository';
import { IWalkInQueueRepository, WalkInQueue, WalkInQueueStats } from '@/src/application/repositories/IWalkInQueueRepository';
import { Metadata } from 'next';

export interface HomeViewModel {
  machines: Machine[];
  machineStats: MachineStats;
  waitingQueues: WalkInQueue[];
  queueStats: WalkInQueueStats;
  currentTime: string;
  todayBookings: number;
  activeBookings: number;
}

/**
 * Presenter for Home page
 * ✅ Receives repositories via constructor injection
 */
export class HomePresenter {
  constructor(
    private readonly machineRepository: IMachineRepository,
    private readonly walkInQueueRepository: IWalkInQueueRepository,
    private readonly bookingRepository: IBookingRepository
  ) {}

  /**
   * Helper to wrap promise with timeout
   */
  private async withTimeout<T>(promise: Promise<T>, ms: number = 5000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Connection timed out (${ms}ms)`)), ms)
      )
    ]);
  }

  /**
   * Get view model for the home page
   */
  async getViewModel(todayStr: string, now: string): Promise<HomeViewModel> {
    try {
      // Get data in parallel for better performance
      const [allMachines, machineStats, waitingQueues, queueStats, bookings] = await this.withTimeout(Promise.all([
        this.machineRepository.getAll(),
        this.machineRepository.getStats(),
        this.walkInQueueRepository.getWaiting(),
        this.walkInQueueRepository.getStats(),
        this.bookingRepository.getByDate(todayStr),
      ]));

      // Filter only active machines for client display
      const machines = allMachines.filter(m => m.isActive);

      // Calculate booking stats
      const todayBookings = bookings.length;
      const activeBookings = bookings.filter(b => 
        b.status === 'confirmed' || b.status === 'pending'
      ).length;

      return {
        machines,
        machineStats,
        waitingQueues,
        queueStats,
        currentTime: now,
        todayBookings,
        activeBookings,
      };
    } catch (error) {
      console.error('Error getting home view model:', error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  generateMetadata(): Metadata {
    return {
      title: 'Racing Game Station - หน้าแรก',
      description: 'ระบบจองคิวสำหรับ Racing Game Station - ดูสถานะเครื่องและจองคิวได้ง่ายๆ',
    };
  }

  /**
   * Get available machines for booking
   */
  async getAvailableMachines(): Promise<Machine[]> {
    try {
      return await this.machineRepository.getAvailable();
    } catch (error) {
      console.error('Error getting available machines:', error);
      throw error;
    }
  }

  /**
   * Get machine by ID
   */
  async getMachineById(id: string): Promise<Machine | null> {
    try {
      return await this.machineRepository.getById(id);
    } catch (error) {
      console.error('Error getting machine:', error);
      throw error;
    }
  }
}
