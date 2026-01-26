import { HomeDashboardStats, IDashboardRepository } from '@/src/application/repositories/IDashboardRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseDashboardRepository implements IDashboardRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getHomeDashboardStats(): Promise<HomeDashboardStats> {
    // Current date string YYYY-MM-DD
    // Note: The RPC defaults to CURRENT_DATE so we can pass null or today's date
    // But better to be explicit.
    // However, JS Date might range, so let's pass the date string expected by RPC or let RPC handle valid input
    // The RPC expects 'p_date'. 
    
    // For now, let's assume we want "Today" relative to the server/shop time.
    // We can rely on RPC default.
    
    const { data, error } = await this.supabase
      .rpc('rpc_get_home_dashboard_stats', { p_date: new Date().toISOString().split('T')[0] });

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from dashboard stats RPC');
    }

    // Map snake_case to camelCase
    // We cast to authorized shape because RPC returns generic Json
    const result = data as {
      todayBookings: number;
      walkInQueue: number;
      generalCustomers: number;
      totalPlayers: number;
    };

    return {
      todayBookings: result.todayBookings,
      walkInQueue: result.walkInQueue,
      generalCustomers: result.generalCustomers,
      totalPlayers: result.totalPlayers,
    };
  }
}
