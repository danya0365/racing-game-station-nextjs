/**
 * SupabaseChatRepository
 * 
 * Server-side implementation of IChatRepository
 * Uses Supabase RPC functions to query data
 * 
 * ✅ Used inside API routes (server-side only)
 */

import {
    BookingEntry,
    IChatRepository,
    MachineInfo,
    QueueEntry,
    SessionEntry,
    TodayStats,
} from '@/src/application/repositories/IChatRepository';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseChatRepository implements IChatRepository {
  constructor(private supabase: SupabaseClient) {}

  async getMachineList(): Promise<MachineInfo[]> {
    const { data, error } = await this.supabase.rpc('rpc_get_active_machines');

    if (error) {
      console.error('SupabaseChatRepository.getMachineList error:', error);
      return [];
    }

    return (data ?? []).map((m: Record<string, unknown>) => ({
      id: m.id as string,
      name: m.name as string,
      status: m.status as 'available' | 'occupied' | 'maintenance',
      type: (m.type as string) ?? null,
      hourlyRate: m.hourly_rate as number,
    }));
  }

  async getWaitingQueue(): Promise<QueueEntry[]> {
    const { data, error } = await this.supabase.rpc('rpc_get_waiting_queue');

    if (error) {
      console.error('SupabaseChatRepository.getWaitingQueue error:', error);
      return [];
    }

    return (data ?? []).map((q: Record<string, unknown>) => ({
      queueId: q.queue_id as string,
      queueNumber: q.queue_number as number,
      customerName: q.customer_name as string,
      customerPhoneMasked: q.customer_phone_masked as string,
      partySize: q.party_size as number,
      preferredStationType: (q.preferred_station_type as string) ?? null,
      preferredMachineName: (q.preferred_machine_name as string) ?? null,
      status: q.status as string,
      waitTimeMinutes: q.wait_time_minutes as number,
      joinedAt: q.joined_at as string,
    }));
  }

  async getTodayBookings(): Promise<BookingEntry[]> {
    // Use today's date in local timezone (Asia/Bangkok)
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }); // YYYY-MM-DD

    const { data, error } = await this.supabase.rpc('rpc_get_bookings_by_date', {
      p_date: today,
    });

    if (error) {
      console.error('SupabaseChatRepository.getTodayBookings error:', error);
      return [];
    }

    return (data ?? []).map((b: Record<string, unknown>) => ({
      bookingId: b.booking_id as string,
      machineName: b.machine_name as string,
      customerName: b.customer_name as string,
      localDate: b.local_date as string,
      localStartTime: b.local_start_time as string,
      localEndTime: b.local_end_time as string,
      durationMinutes: b.duration_minutes as number,
      status: b.status as string,
    }));
  }

  async getActiveSessions(): Promise<SessionEntry[]> {
    const { data, error } = await this.supabase.rpc('rpc_get_active_sessions');

    if (error) {
      console.error('SupabaseChatRepository.getActiveSessions error:', error);
      return [];
    }

    return (data ?? []).map((s: Record<string, unknown>) => ({
      sessionId: s.session_id as string,
      stationName: s.station_name as string,
      customerName: s.customer_name as string,
      startTime: s.start_time as string,
      estimatedEndTime: (s.estimated_end_time as string) ?? null,
      durationMinutes: s.duration_minutes as number,
      sourceType: s.source_type as string,
      paymentStatus: s.payment_status as string,
    }));
  }

  async getTodayStats(): Promise<TodayStats> {
    // Use rpc_get_backend_stats for aggregate data
    const { data, error } = await this.supabase.rpc('rpc_get_backend_stats');

    if (error) {
      console.error('SupabaseChatRepository.getTodayStats error:', error);
      return {
        totalMachines: 0,
        availableMachines: 0,
        occupiedMachines: 0,
        maintenanceMachines: 0,
        waitingQueues: 0,
        todayBookings: 0,
        activeSessions: 0,
        todayCompletedSessions: 0,
        todayRevenue: 0,
      };
    }

    const stats = data as Record<string, unknown>;

    // Get session stats for revenue
    const { data: sessionStatsData } = await this.supabase.rpc('rpc_get_session_stats');
    const sessionStats = (sessionStatsData as Record<string, unknown>) ?? {};

    return {
      totalMachines: (stats.total_machines as number) ?? 0,
      availableMachines: (stats.available_machines as number) ?? 0,
      occupiedMachines: (stats.occupied_machines as number) ?? 0,
      maintenanceMachines: (stats.maintenance_machines as number) ?? 0,
      waitingQueues: (stats.waiting_queues as number) ?? 0,
      todayBookings: (stats.today_bookings as number) ?? 0,
      activeSessions: (stats.active_sessions as number) ?? 0,
      todayCompletedSessions: (sessionStats.completed_sessions as number) ?? 0,
      todayRevenue: (sessionStats.total_revenue as number) ?? 0,
    };
  }
}
