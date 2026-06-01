"use client";

import { useCart } from "@/context/cart.context";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const tableId = localStorage.getItem("tableId"); 
  // optional: store tableId when user enters table page

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!tableId) {
      alert("Table not found!");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        table_id: tableId,
        items: cart.map((i) => ({
          menu_item_id: i.id,
          quantity: i.quantity,
        })),
      };

      await api.post("/orders", payload);

      clearCart();

      alert("Order placed successfully!");

      router.push("/order-success");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Checkout
      </h1>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {/* ITEMS */}
          <div className="border rounded p-4 mb-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between mb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="text-xl font-bold mb-4">
            Total: ₹{total}
          </div>

          {/* BUTTON */}
          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}