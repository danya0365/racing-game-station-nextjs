/**
 * ChatService - Single Source of Truth
 * 
 * Business logic for the chat system (Web Chat + LINE OA)
 * Adapted for Racing Game Station domain
 * 
 * Used by:
 * - API routes (server-side, with SupabaseChatRepository)
 * - ApiChatRepository (client-side, via API calls)
 */

import { IChatRepository } from '@/src/application/repositories/IChatRepository';
import { ChatResponse } from '@/src/domain/types/chatTypes';

export class ChatService {
  private repo: IChatRepository;

  /**
   * Main menu commands
   */
  private mainMenuCommands = [
    '📊 สรุปวันนี้',
    '🎮 เครื่องเล่น',
    '📋 คิว',
    '📅 จอง',
    '🕹️ เซสชัน',
  ];

  constructor(repo: IChatRepository) {
    this.repo = repo;
  }

  // ==========================================
  // Command Processing (entry point)
  // ==========================================

  /**
   * ประมวลผลคำสั่ง - จุดเข้าหลัก
   */
  async processCommand(text: string): Promise<ChatResponse> {
    const trimmed = text.trim();
    const lower = trimmed.toLowerCase();

    // Menu
    if (['เมนู', 'menu', 'help', 'ช่วยเหลือ', 'start'].includes(lower)) {
      return this.getMainMenu();
    }

    // Today summary
    if (trimmed.includes('สรุปวันนี้') || lower === 'summary') {
      return this.getTodaySummary();
    }

    // Machine status
    if (trimmed.includes('เครื่องเล่น') || lower === 'machine' || lower === 'machines') {
      return this.getMachineStatus();
    }

    // Queue
    if (trimmed.includes('คิว') || lower === 'queue') {
      return this.getQueueInfo();
    }

    // Booking
    if (trimmed.includes('จอง') || lower === 'booking' || lower === 'bookings') {
      return this.getBookingInfo();
    }

    // Session
    if (trimmed.includes('เซสชัน') || lower === 'session' || lower === 'sessions') {
      return this.getSessionInfo();
    }

    // Unknown command
    return this.getMainMenu(`ขอโทษครับ ไม่เข้าใจคำสั่ง "${trimmed}"\n\nกรุณาเลือกเมนูด้านล่าง:`);
  }

  /**
   * ประมวลผล action (postback)
   */
  async processAction(action: string, params: Record<string, string> = {}): Promise<ChatResponse> {
    switch (action) {
      case 'today_summary':
        return this.getTodaySummary();
      case 'machine_status':
        return this.getMachineStatus();
      case 'queue_info':
        return this.getQueueInfo();
      case 'booking_info':
        return this.getBookingInfo();
      case 'session_info':
        return this.getSessionInfo();
      case 'machine_detail':
        return this.getMachineDetail(params.type);
      default:
        return this.getMainMenu();
    }
  }

  // ==========================================
  // Menus
  // ==========================================

  getMainMenu(greeting?: string): ChatResponse {
    return {
      type: 'menu',
      title: '📋 เมนูหลัก Racing Game Station',
      text: greeting ?? '📋 เมนูหลัก Racing Game Station\n\nกรุณาเลือกข้อมูลที่ต้องการ:',
      quickReplies: this.mainMenuCommands,
    };
  }

  // ==========================================
  // Data Views
  // ==========================================

  async getTodaySummary(): Promise<ChatResponse> {
    const stats = await this.repo.getTodayStats();

    return {
      type: 'card',
      title: '📊 สรุปวันนี้',
      subtitle: 'Racing Game Station',
      headerColor: '#6366F1',
      rows: [
        { label: '📅 วันที่', value: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
        { type: 'separator' },
        { label: '🎮 เครื่องเล่น', value: '', bold: true },
        { label: '✅ พร้อมใช้งาน', value: `${stats.availableMachines} เครื่อง`, valueColor: '#22C55E' },
        { label: '🔴 กำลังใช้งาน', value: `${stats.occupiedMachines} เครื่อง`, valueColor: '#EF4444' },
        { label: '🔧 ซ่อมบำรุง', value: `${stats.maintenanceMachines} เครื่อง`, valueColor: '#F59E0B' },
        { type: 'separator' },
        { label: '📋 คิว Walk-in รอ', value: `${stats.waitingQueues} คิว`, valueColor: stats.waitingQueues > 0 ? '#3B82F6' : '#6B7280' },
        { label: '📅 จองวันนี้', value: `${stats.todayBookings} รายการ` },
        { label: '🕹️ เซสชันกำลังเล่น', value: `${stats.activeSessions} เซสชัน`, valueColor: '#8B5CF6' },
        { label: '✅ เสร็จแล้ววันนี้', value: `${stats.todayCompletedSessions} เซสชัน` },
        { type: 'separator' },
        { label: '💰 รายได้วันนี้', value: `${stats.todayRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿`, valueColor: '#22C55E', bold: true },
      ],
    };
  }

  async getMachineStatus(): Promise<ChatResponse> {
    const machines = await this.repo.getMachineList();

    if (machines.length === 0) {
      return { type: 'text', text: '❌ ไม่พบข้อมูลเครื่องเล่น' };
    }

    const statusIcon = (s: string) => {
      switch (s) {
        case 'available': return '✅';
        case 'occupied': return '🔴';
        case 'maintenance': return '🔧';
        default: return '❓';
      }
    };

    const statusColor = (s: string) => {
      switch (s) {
        case 'available': return '#22C55E';
        case 'occupied': return '#EF4444';
        case 'maintenance': return '#F59E0B';
        default: return '#6B7280';
      }
    };

    const available = machines.filter(m => m.status === 'available').length;
    const occupied = machines.filter(m => m.status === 'occupied').length;
    const maintenance = machines.filter(m => m.status === 'maintenance').length;

    const rows = [
      { label: `✅ ${available}`, value: `🔴 ${occupied}  🔧 ${maintenance}`, bold: true },
      { type: 'separator' as const },
      ...machines.map(m => ({
        label: `${statusIcon(m.status)} ${m.name}`,
        value: `${m.hourlyRate}฿/ชม.`,
        valueColor: statusColor(m.status),
      })),
    ];

    return {
      type: 'card',
      title: '🎮 สถานะเครื่องเล่น',
      subtitle: `ทั้งหมด ${machines.length} เครื่อง`,
      headerColor: '#8B5CF6',
      rows,
    };
  }

  async getMachineDetail(type?: string): Promise<ChatResponse> {
    const machines = await this.repo.getMachineList();
    const filtered = type ? machines.filter(m => m.type === type) : machines;

    if (filtered.length === 0) {
      return { type: 'text', text: '❌ ไม่พบเครื่องเล่นประเภทนี้' };
    }

    const statusIcon = (s: string) => {
      switch (s) {
        case 'available': return '✅';
        case 'occupied': return '🔴';
        case 'maintenance': return '🔧';
        default: return '❓';
      }
    };

    return {
      type: 'card',
      title: `🎮 ${type ?? 'เครื่องเล่นทั้งหมด'}`,
      subtitle: `${filtered.length} เครื่อง`,
      headerColor: '#8B5CF6',
      rows: filtered.map(m => ({
        label: `${statusIcon(m.status)} ${m.name}`,
        value: `${m.hourlyRate}฿/ชม.`,
      })),
    };
  }

  async getQueueInfo(): Promise<ChatResponse> {
    const queue = await this.repo.getWaitingQueue();

    if (queue.length === 0) {
      return {
        type: 'card',
        title: '📋 คิว Walk-in',
        subtitle: 'ไม่มีคิวรอ',
        headerColor: '#3B82F6',
        rows: [
          { label: '📋 สถานะ', value: 'ไม่มีคิวรอขณะนี้', valueColor: '#22C55E' },
        ],
      };
    }

    return {
      type: 'card',
      title: '📋 คิว Walk-in',
      subtitle: `รอ ${queue.length} คิว`,
      headerColor: '#3B82F6',
      rows: [
        { label: `📋 จำนวนคิวรอ`, value: `${queue.length} คิว`, bold: true },
        { type: 'separator' },
        ...queue.slice(0, 10).map(q => ({
          label: `#${q.queueNumber} ${q.customerName}`,
          value: `รอ ${q.waitTimeMinutes} นาที`,
          valueColor: q.waitTimeMinutes > 30 ? '#EF4444' : '#3B82F6',
        })),
      ],
    };
  }

  async getBookingInfo(): Promise<ChatResponse> {
    const bookings = await this.repo.getTodayBookings();

    if (bookings.length === 0) {
      return {
        type: 'card',
        title: '📅 จองวันนี้',
        subtitle: 'ไม่มีการจอง',
        headerColor: '#F59E0B',
        rows: [
          { label: '📅 สถานะ', value: 'ไม่มีการจองวันนี้', valueColor: '#6B7280' },
        ],
      };
    }

    const statusLabel = (s: string) => {
      switch (s) {
        case 'confirmed': return '✅';
        case 'pending': return '⏳';
        case 'checked_in': return '🎮';
        case 'seated': return '🕹️';
        case 'completed': return '✔️';
        case 'cancelled': return '❌';
        default: return '📋';
      }
    };

    return {
      type: 'card',
      title: '📅 จองวันนี้',
      subtitle: `${bookings.length} รายการ`,
      headerColor: '#F59E0B',
      rows: [
        { label: '📅 จำนวน', value: `${bookings.length} รายการ`, bold: true },
        { type: 'separator' },
        ...bookings.slice(0, 10).map(b => ({
          label: `${statusLabel(b.status)} ${b.localStartTime}-${b.localEndTime}`,
          value: `${b.machineName}`,
        })),
      ],
    };
  }

  async getSessionInfo(): Promise<ChatResponse> {
    const sessions = await this.repo.getActiveSessions();

    if (sessions.length === 0) {
      return {
        type: 'card',
        title: '🕹️ เซสชันที่กำลังเล่น',
        subtitle: 'ไม่มีเซสชัน',
        headerColor: '#8B5CF6',
        rows: [
          { label: '🕹️ สถานะ', value: 'ไม่มีเซสชันกำลังเล่น', valueColor: '#6B7280' },
        ],
      };
    }

    return {
      type: 'card',
      title: '🕹️ เซสชันที่กำลังเล่น',
      subtitle: `${sessions.length} เซสชัน`,
      headerColor: '#8B5CF6',
      rows: [
        { label: '🕹️ กำลังเล่น', value: `${sessions.length} เซสชัน`, bold: true },
        { type: 'separator' },
        ...sessions.slice(0, 10).map(s => ({
          label: `🎮 ${s.stationName}`,
          value: `${s.customerName} (${s.durationMinutes} นาที)`,
          valueColor: '#8B5CF6',
        })),
      ],
    };
  }
}
