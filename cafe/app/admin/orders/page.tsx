"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import {
  KitchenOrder,
  getKitchenOrders,
  updateKitchenOrderStatus,
} from "@/services/kitchen.service";

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getKitchenOrders();

      const filtered = data.filter(
        (order) =>
          order.status !== "SERVED" &&
          order.status !== "CANCELLED"
      );

      setOrders(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadOrders();
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const socket: Socket = io(
      "http://localhost:5000"
    );

    socket.on(
      "new_order",
      (newOrder: KitchenOrder) => {
        setOrders((prev) => [
          newOrder,
          ...prev,
        ]);
      }
    );

    socket.on(
      "order_status_updated",
      (updatedOrder) => {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === updatedOrder.id
              ? {
                  ...order,
                  status:
                    updatedOrder.status,
                }
              : order
          )
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {
      await updateKitchenOrderStatus(
        id,
        status
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EB] flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-3xl shadow-lg">
          <p className="text-lg font-medium text-[#2C1810]">
            Loading kitchen orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EB] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2C1810]">
          Kitchen Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Live restaurant orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <p className="text-gray-500 text-sm">
            Active Orders
          </p>

          <h2 className="text-3xl font-bold text-[#C46A2D] mt-2">
            {orders.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">
          <p className="text-gray-500 text-sm">
            Preparing
          </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {
              orders.filter(
                (o) =>
                  o.status?.toUpperCase() ===
                  "PREPARING"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">
          <p className="text-gray-500 text-sm">
            Ready
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              orders.filter(
                (o) =>
                  o.status?.toUpperCase() ===
                  "READY"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-md text-center">
          <h2 className="text-2xl font-semibold text-[#2C1810]">
            No Active Orders
          </h2>

          <p className="text-gray-500 mt-2">
            New orders will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => {
            const status =
              order.status?.toUpperCase();

            const statusColor =
              status === "READY"
                ? "bg-green-100 text-green-700"
                : status === "PREPARING"
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-700";

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#EFE3D1]"
              >
                {/* Header */}
                <div className="bg-[#FFF6EB] border-b p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Table
                      </p>

                      <h2 className="text-2xl font-bold text-[#2C1810]">
                        #{order.table_number}
                      </h2>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold ${statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Order Items
                  </h3>

                  <div className="space-y-3">
                    {order.items?.map(
                      (
                        item: any,
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="flex justify-between"
                        >
                          <span className="text-gray-700">
                            {item.name}
                          </span>

                          <span className="font-medium">
                            ×{" "}
                            {item.quantity}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="border-t mt-5 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">
                        Total
                      </span>

                      <span className="text-xl font-bold text-[#C46A2D]">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 pt-0">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      disabled={
                        status === "PREPARING"
                      }
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "PREPARING"
                        )
                      }
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-medium transition"
                    >
                      Preparing
                    </button>

                    <button
                      disabled={
                        status === "READY"
                      }
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "READY"
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-medium transition"
                    >
                      Ready
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          "SERVED"
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium transition"
                    >
                      Served
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}