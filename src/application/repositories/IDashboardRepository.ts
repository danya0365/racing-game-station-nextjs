export interface HomeDashboardStats {
  todayBookings: number;
  walkInQueue: number;
  generalCustomers: number;
  totalPlayers: number;
}

export interface IDashboardRepository {
  /**
   * Get today's counts for the home dashboard
   * @param branchId - Restrict to one branch; omit for all (staff view)
   */
  getHomeDashboardStats(branchId?: string): Promise<HomeDashboardStats>;
}
