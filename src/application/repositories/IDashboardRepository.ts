export interface HomeDashboardStats {
  todayBookings: number;
  walkInQueue: number;
  generalCustomers: number;
  totalPlayers: number;
}

export interface IDashboardRepository {
  getHomeDashboardStats(): Promise<HomeDashboardStats>;
}
