"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

type Order = {
  id: string;
  table_number: number;
  status: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 🔥 NEW ORDER
    socket.on("new_order", (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    });

    // 🔥 STATUS UPDATE
    socket.on("order_status_updated", ({ order_id, status }) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === order_id
            ? { ...order, status }
            : order
        )
      );
    });

    return () => {
      socket.off("new_order");
      socket.off("order_status_updated");
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        🍳 Kitchen Dashboard
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded">
            
            <div className="flex justify-between">
              <h2 className="font-bold">
                Table {order.table_number}
              </h2>
              <span>{order.status}</span>
            </div>

            <div className="mt-2">
              {order.items?.map((item, i) => (
                <div key={i}>
                  {item.name} × {item.quantity}
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateStatus(order.id, "PREPARING")}
                className="bg-yellow-500 px-3 py-1 rounded"
              >
                Preparing
              </button>

              <button
                onClick={() => updateStatus(order.id, "READY")}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Ready
              </button>

              <button
                onClick={() => updateStatus(order.id, "SERVED")}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                Served
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}