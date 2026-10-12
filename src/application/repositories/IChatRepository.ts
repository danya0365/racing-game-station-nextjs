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
  /**
   * ราคา tier 1 ชั่วโมงของสาขานี้เครื่อง (rate_1h จาก rpc_get_active_machines)
   *
   * เดิมชื่อ hourlyRate และอ่านจาก machines.hourly_rate ซึ่งเป็นตัวเลขที่ไม่มีที่ไหน
   * แสดงให้ลูกค้าเห็น — ลูกค้าเห็น 100 บาท แต่ LINE บอก 200 บาท/ชม.
   * ตอนนี้เป็นราคาจริงจาก branch_rate_tiers ของสาขานั้น
   *
   * null = สาขายังไม่ได้ตั้งราคา → ผู้ใช้ต้องแสดง "ยังไม่มีข้อมูลราคา"
   * ห้ามแสดงเป็น 0 เพราะ 0 คือ "เล่นฟรี" ไม่ใช่ "ไม่รู้"
   */
  rate1h: number | null;
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
