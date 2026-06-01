"use client";
import axios from "axios";
import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useCart } from "@/context/cart.context";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category_name: string;
};

export default function TablePage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const { tableId } = use(params); // ✅ FIX HERE

  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenu(res.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      const payload = {
       table_number: Number(tableId),
        items: cart.map((i) => ({
          menu_item_id: i.id,
          quantity: i.quantity,
        })),
      };

      await api.post("/orders", payload);

      alert("Order placed successfully!");
      clearCart();
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);

    alert(err.response?.data?.message || "Order failed");
  } else {
    console.log("Unknown error:", err);
    alert("Something went wrong");
  }
}
  };
  useEffect(() => {
  localStorage.setItem("tableId", tableId);
}, [tableId]);

  if (loading) return <p className="p-6">Loading menu...</p>;

  return (
    <div className="p-6 flex gap-8">
      {/* MENU */}
      <div className="w-2/3">
        <h1 className="text-2xl font-bold mb-4">
          Table {tableId} - Menu
        </h1>

        <div className="grid gap-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded flex justify-between"
            >
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>₹{item.price}</p>
                <p className="text-sm text-gray-500">
                  {item.category_name}
                </p>
              </div>

              <button
                onClick={() =>
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                  })
                }
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="w-1/3 border p-4 rounded h-fit">
        <h2 className="text-xl font-bold mb-4">
          Cart
        </h2>

        {cart.length === 0 ? (
          <p>No items</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between mb-2"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    -
                  </button>

                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <hr className="my-2" />

            <p className="font-bold">
              Total: ₹{total}
            </p>

            <button
              onClick={placeOrder}
              className="w-full bg-blue-600 text-white py-2 mt-3 rounded"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}