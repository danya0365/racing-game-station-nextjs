'use client';

import { HomeDashboardStats, IDashboardRepository } from '@/src/application/repositories/IDashboardRepository';

export class ApiDashboardRepository implements IDashboardRepository {
  private baseUrl = '/api/dashboard/stats';

  async getHomeDashboardStats(): Promise<HomeDashboardStats> {
    const res = await fetch(this.baseUrl);
    
    if (!res.ok) {
      // Return default zeroes on error to prevent page crash
      console.error('Failed to fetch dashboard stats');
      return {
        todayBookings: 0,
        walkInQueue: 0,
        generalCustomers: 0,
        totalPlayers: 0,
      };
    }
    
    return res.json();
  }
}
