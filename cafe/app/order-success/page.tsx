"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3EB] flex items-center justify-center px-4">
      <div
        className={`bg-white max-w-lg w-full rounded-[36px] shadow-2xl p-10 text-center transition-all duration-500 ${
          show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        {/* Success Circle */}
        <div className="w-32 h-32 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-8">
          <svg
            className="w-16 h-16 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-[#2C1810]">
          Order Confirmed!
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          Your order has been sent to
          the kitchen successfully.
        </p>

        {/* Info Card */}
        <div className="bg-[#FFF6EB] rounded-3xl p-5 mt-8">
          <h3 className="font-semibold text-[#2C1810]">
            What Happens Next?
          </h3>

          <div className="space-y-3 mt-4 text-sm text-gray-600 text-left">
            <div className="flex gap-3">
              <span>🍳</span>
              <span>
                Kitchen starts preparing
                your food
              </span>
            </div>

            <div className="flex gap-3">
              <span>👨‍🍳</span>
              <span>
                Staff updates order
                status live
              </span>
            </div>

            <div className="flex gap-3">
              <span>🍽️</span>
              <span>
                Food will be served at
                your table
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid gap-3 mt-8">
          <Link
            href="/menu"
            className="bg-[#C46A2D] hover:bg-[#AA5B24] text-white py-4 rounded-2xl font-semibold transition"
          >
            Order More Food
          </Link>
{/* 
          <Link
          href="/track"
            className="border border-[#C46A2D] text-[#C46A2D] py-4 rounded-2xl font-semibold"
          >
            Track Order Status
          </Link> */}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Thank you for dining with us.
        </p>
      </div>
    </div>
  );
}