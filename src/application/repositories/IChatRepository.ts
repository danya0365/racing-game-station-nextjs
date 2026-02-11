/**
 * IChatRepository
 * 
 * Interface for data access methods that ChatService needs.
 * Implemented by SupabaseChatRepository (server-side) and ApiChatRepository (client-side).
 */

export interface MachineInfo {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'maintenance';
  type: string | null;
  hourlyRate: number;
}

export interface QueueEntry {
  queueId: string;
  queueNumber: number;
  customerName: string;
  customerPhoneMasked: string;
  partySize: number;
  preferredStationType: string | null;
  preferredMachineName: string | null;
  status: string;
  waitTimeMinutes: number;
  joinedAt: string;
}

export interface BookingEntry {
  bookingId: string;
  machineName: string;
  customerName: string;
  localDate: string;
  localStartTime: string;
  localEndTime: string;
  durationMinutes: number;
  status: string;
}

export interface SessionEntry {
  sessionId: string;
  stationName: string;
  customerName: string;
  startTime: string;
  estimatedEndTime: string | null;
  durationMinutes: number;
  sourceType: string;
  paymentStatus: string;
}

export interface TodayStats {
  totalMachines: number;
  availableMachines: number;
  occupiedMachines: number;
  maintenanceMachines: number;
  waitingQueues: number;
  todayBookings: number;
  activeSessions: number;
  todayCompletedSessions: number;
  todayRevenue: number;
}

export interface IChatRepository {
  /** Get all machines with status */
  getMachineList(): Promise<MachineInfo[]>;

  /** Get waiting queue entries */
  getWaitingQueue(): Promise<QueueEntry[]>;

  /** Get today's bookings */
  getTodayBookings(): Promise<BookingEntry[]>;

  /** Get active sessions */
  getActiveSessions(): Promise<SessionEntry[]>;

  /** Get aggregate stats for today summary */
  getTodayStats(): Promise<TodayStats>;
}
