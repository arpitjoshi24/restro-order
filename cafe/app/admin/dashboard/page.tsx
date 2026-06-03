"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/admin.service";
import {
  UtensilsCrossed,
  CreditCard,
  Table,
  ClipboardList,
  Clock3,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F3EB]">
        <p className="text-orange-600 font-medium animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F3EB]">
        <p className="text-gray-500">No dashboard data available.</p>
      </div>
    );
  }
const overviewData = [
  {
    name: "Orders",
    value: stats.totalOrders,
  },
  {
    name: "Revenue",
    value: stats.totalRevenue,
  },
  {
    name: "Tables",
    value: stats.totalTables,
  },
  {
    name: "Menu",
    value: stats.totalMenuItems,
  },
  {
    name: "Pending",
    value: stats.pendingOrders,
  },
];

const orderStatusData = [
  {
    name: "Completed",
    value: Math.max(
      stats.totalOrders - stats.pendingOrders,
      0
    ),
  },
  {
    name: "Pending",
    value: stats.pendingOrders,
  },
];
  return (
    <div className="min-h-screen bg-[#F8F3EB] p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          📊 Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Restaurant overview & live analytics
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* ORDERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <ClipboardList className="text-orange-500" />
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-3">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalOrders}
          </p>
        </div>

        {/* REVENUE (HIGHLIGHT CARD) */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-md p-5 hover:scale-[1.02] transition">
          <div className="flex items-center justify-between">
            <CreditCard />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              Revenue
            </span>
          </div>
          <p className="text-sm mt-3 text-white/80">Total Revenue</p>
          <p className="text-2xl font-bold">
            ₹{stats.totalRevenue}
          </p>
        </div>

        {/* TABLES */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <Table className="text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-3">Tables</p>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalTables}
          </p>
        </div>

        {/* MENU ITEMS */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <UtensilsCrossed className="text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-3">Menu Items</p>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalMenuItems}
          </p>
        </div>

        {/* PENDING ORDERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <Clock3 className="text-orange-500" />
            {stats.pendingOrders > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Alert
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-3">Pending Orders</p>
          <p className="text-2xl font-bold text-gray-800">
            {stats.pendingOrders}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* OVERVIEW CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Restaurant Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#f97316"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ORDER STATUS */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Order Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              Completed
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Pending
            </div>
          </div>
        </div>

      </div>

      {/* QUICK STATS */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Revenue Insights
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-orange-500">
                ₹{stats.totalRevenue}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Average Revenue / Order
              </p>

              <p className="text-xl font-semibold">
                ₹
                {stats.totalOrders > 0
                  ? (
                      stats.totalRevenue /
                      stats.totalOrders
                    ).toFixed(2)
                  : 0}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Restaurant Capacity
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Total Tables</span>
              <span className="font-bold">
                {stats.totalTables}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Menu Items</span>
              <span className="font-bold">
                {stats.totalMenuItems}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Orders</span>
              <span className="font-bold">
                {stats.totalOrders}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Pending Orders</span>
              <span className="font-bold text-red-500">
                {stats.pendingOrders}
              </span>
            </div>

          </div>
        </div>
        </div>
      </div>
  );
}