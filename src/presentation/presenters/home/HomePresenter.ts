/**
 * HomePresenter
 * Handles business logic for Home page
 * Receives repository via dependency injection
 * 
 * ✅ Updated to use IWalkInQueueRepository (new schema)
 */

// ... imports
import { IBookingRepository } from '@/src/application/repositories/IBookingRepository';
import { IDashboardRepository } from '@/src/application/repositories/IDashboardRepository';
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
  generalCustomers: number;
  totalPlayers: number;
  walkInQueueCount: number;
}

/**
 * Presenter for Home page
 * ✅ Receives repositories via constructor injection
 */
export class HomePresenter {
  constructor(
    private readonly machineRepository: IMachineRepository,
    private readonly walkInQueueRepository: IWalkInQueueRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly dashboardRepository: IDashboardRepository
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
      const [allMachines, machineStats, queueStats, bookings, dashboardStats] = await this.withTimeout(Promise.all([
        this.machineRepository.getAll(),
        this.machineRepository.getStats(),
        this.walkInQueueRepository.getStats(),
        this.bookingRepository.getByDate(todayStr),
        this.dashboardRepository.getHomeDashboardStats(), // New RPC call
      ]));

      // Filter only active machines for client display
      const machines = allMachines.filter(m => m.isActive);

      // Calculate booking stats (active currently running or pending)
      const activeBookings = bookings.filter(b => 
        b.status === 'confirmed' || b.status === 'pending'
      ).length;

      return {
        machines,
        machineStats,
        waitingQueues: [],
        queueStats,
        currentTime: now,
        todayBookings: dashboardStats.todayBookings, // from RPC
        activeBookings, // Calculated from bookings list for "Active/Pending" logic
        walkInQueueCount: dashboardStats.walkInQueue, // from RPC
        generalCustomers: dashboardStats.generalCustomers, // from RPC
        totalPlayers: dashboardStats.totalPlayers, // from RPC
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
    /** ... same ... */
    return {
      title: 'Racing Game Station - หน้าแรก',
      description: 'ระบบจองคิวสำหรับ Racing Game Station - ดูสถานะเครื่องและจองคิวได้ง่ายๆ',
    };
  }

  /**
   * Get available machines for booking
   */
  async getAvailableMachines(): Promise<Machine[]> {
    /** ... same ... */
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
    /** ... same ... */
    try {
      return await this.machineRepository.getById(id);
    } catch (error) {
      console.error('Error getting machine:', error);
      throw error;
    }
  }
}
