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
  <div className="min-h-screen bg-[#F8F3EB] py-10 px-4">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2C1810]">
          Checkout
        </h1>

        <p className="text-gray-600 mt-2">
          Review your order before placing it
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-[#2C1810]">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            Add some delicious dishes to continue
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-[#FFF6EB] p-6 border-b">
              <h2 className="text-2xl font-bold text-[#2C1810]">
                Order Summary
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Table #{tableId}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <h3 className="font-semibold text-[#2C1810]">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[#C46A2D]">
                      ₹
                      {item.price *
                        item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-[#2C1810] mb-5">
              Payment Details
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span>₹{total}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Service Charge
                </span>

                <span>₹0</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>

                <span className="text-[#C46A2D]">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">
                Payment Method
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:border-[#C46A2D]">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                  />

                  <span>Pay at Table</span>
                </label>

                <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:border-[#C46A2D]">
                  <input
                    type="radio"
                    name="payment"
                  />

                  <span>UPI Payment</span>
                </label>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-[#C46A2D] hover:bg-[#A9541F] text-white py-4 rounded-2xl font-semibold transition disabled:opacity-50"
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By placing this order you agree
              to restaurant policies.
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);
}