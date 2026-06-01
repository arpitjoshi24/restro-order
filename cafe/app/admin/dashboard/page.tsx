"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/admin.service";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalTables: number;
  totalMenuItems: number;
  pendingOrders: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStats = async (): Promise<void> => {
      try {
        const data = await getDashboardStats();

        setStats(data.stats);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!stats) {
    return <p>No dashboard data available.</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded border p-4">
          <h2 className="text-sm text-gray-500">Orders</h2>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="rounded border p-4">
          <h2 className="text-sm text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
        </div>

        <div className="rounded border p-4">
          <h2 className="text-sm text-gray-500">Tables</h2>
          <p className="text-2xl font-bold">{stats.totalTables}</p>
        </div>

        <div className="rounded border p-4">
          <h2 className="text-sm text-gray-500">Menu Items</h2>
          <p className="text-2xl font-bold">{stats.totalMenuItems}</p>
        </div>

        <div className="rounded border p-4">
          <h2 className="text-sm text-gray-500">Pending Orders</h2>
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
}