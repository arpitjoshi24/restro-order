"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getOrders, Order } from "@/services/order.service";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
 const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
};
  // -----------------------------
  // LOAD INITIAL ORDERS
  // -----------------------------
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // -----------------------------
  // SOCKET REAL-TIME
  // -----------------------------
  useEffect(() => {
    const socket: Socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("new_order", (newOrder: Order) => {
      console.log("🔥 New order received:", newOrder);

      setOrders((prev) => {
        // prevent duplicates
        const exists = prev.find((o) => o.id === newOrder.id);
        if (exists) return prev;

        return [newOrder, ...prev];
      });
    });

    socket.on("order_status_updated", (updated: Order) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === updated.id
            ? { ...o, status: updated.status }
            : o
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);
 
  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            
            <div
              key={order.id}
              className="border rounded p-4 shadow-sm"
            >
                
              {/* HEADER */}
              <div className="flex justify-between mb-3">
                <h2 className="font-bold">
                  Table {order.table_number}
                </h2>

                <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                  {order.status}
                </span>
              </div>
 
              {/* TOTAL */}
              <p className="font-medium">
                Total: ₹{order.total}
              </p>

              {/* DATE */}
              <p className="text-sm text-gray-500">
                Date: {formatDate(order.created_at)}

              </p>

              {/* ITEMS */}
              <div className="mt-3">
                <h3 className="font-semibold mb-1">
                  Items
                </h3>

                {(order.items || []).map((item, index) => (
                  <div
                    key={`${order.id}-${item.name}-${index}`}
                    className="text-sm"
                  >
                    {item.name} × {item.quantity} - ₹{item.price}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}