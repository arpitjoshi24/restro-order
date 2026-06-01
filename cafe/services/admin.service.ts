import api from "@/lib/axios";

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalTables: number;
  totalMenuItems: number;
  pendingOrders: number;
}

export const getDashboardStats = async (): Promise<{
  stats: DashboardStats;
}> => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};