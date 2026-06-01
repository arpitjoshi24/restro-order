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
      <div className="p-6">
        Loading kitchen orders...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Kitchen Dashboard
      </h1>

      {orders.length === 0 ? (
        <p>No active orders.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow"
            >
              <div className="flex justify-between mb-3">
                <h2 className="font-bold text-xl">
                  Table{" "}
                  {order.table_number}
                </h2>

                <span className="px-3 py-1 rounded bg-gray-200">
                  {order.status}
                </span>
              </div>

              <p className="mb-2">
                Total: ₹{order.total}
              </p>

              <div className="mb-3">
                <h3 className="font-semibold">
                  Items
                </h3>

                {order.items?.map(
                  (item, index) => (
                    <p key={index}>
                      {item.name} ×{" "}
                      {item.quantity}
                    </p>
                  )
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "PREPARING"
                    )
                  }
                  className="bg-yellow-500 text-white px-3 py-2 rounded"
                >
                  Preparing
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "READY"
                    )
                  }
                  className="bg-green-600 text-white px-3 py-2 rounded"
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
                  className="bg-blue-600 text-white px-3 py-2 rounded"
                >
                  Served
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}