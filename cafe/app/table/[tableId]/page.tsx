"use client";
import axios from "axios";
import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useCart } from "@/context/cart.context";
import { useRouter } from "next/navigation";
type MenuItem = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category_name: string;
  image?: string;
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
  const router = useRouter();

const [placingOrder, setPlacingOrder] =
  useState(false);

const [showSuccess, setShowSuccess] =
  useState(false);
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
  if (cart.length === 0) return;

  try {
    setPlacingOrder(true);

    const payload = {
      table_number: Number(tableId),
      items: cart.map((i) => ({
        menu_item_id: i.id,
        quantity: i.quantity,
      })),
    };

    await api.post("/orders", payload);

    clearCart();

    router.push("/order-success");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(
        err.response?.data?.message ||
          "Order failed"
      );
    } else {
      alert("Something went wrong");
    }
  } finally {
    setPlacingOrder(false);
  }
};
  useEffect(() => {
  localStorage.setItem("tableId", tableId);
}, [tableId]);

 if (loading) {
  return (
    <div className="min-h-screen bg-[#F8F3EB] flex items-center justify-center">
      <div className="bg-white px-8 py-6 rounded-3xl shadow-lg">
        Loading menu...
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-[#F8F3EB]">
    {/* Hero */}
    <div className="bg-[#2C1810] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <span className="bg-[#C46A2D] px-4 py-2 rounded-full text-sm">
            Table #{tableId}
          </span>

          <h1 className="text-5xl font-bold mt-6">
            Delicious Food,
            <br />
            Delivered To Your Table
          </h1>

          <p className="text-gray-300 mt-4">
            Browse our menu and place your
            order instantly.
          </p>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
  {/* MENU */}
  <div className="lg:col-span-2">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-[#2C1810]">
        Our Menu
      </h2>

      <span className="bg-white px-4 py-2 rounded-xl shadow">
        {menu.length} Items
      </span>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {menu.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#EFE3D1] hover:-translate-y-1 transition"
        >
          {/* Food Image */}
          <div className="h-48 overflow-hidden">
            <img
              src={
                item.image ||
                "/margherita.png"
              }
              alt={item.name}
              className="w-full h-full object-cover hover:scale-110 transition duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl text-[#2C1810]">
                  {item.name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {item.category_name}
                </p>
              </div>

              <span className="font-bold text-[#C46A2D] text-lg">
                ₹{item.price}
              </span>
            </div>

            <button
              onClick={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                })
              }
              className="w-full mt-5 bg-[#C46A2D] hover:bg-[#AA5B24] text-white py-3 rounded-2xl font-medium transition"
            >
              Add To Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* CART */}
  <div>
    <div className="sticky top-6 bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-[#FFF6EB] p-6 border-b">
        <h2 className="text-2xl font-bold text-[#2C1810]">
          Your Cart
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Table #{tableId}
        </p>
      </div>

      <div className="p-6">
        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No items added yet
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b pb-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        ₹{item.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        className="w-8 h-8 rounded-full bg-gray-100"
                      >
                        -
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price:
                              item.price,
                          })
                        }
                        className="w-8 h-8 rounded-full bg-[#C46A2D] text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>

                <span className="text-[#C46A2D]">
                  ₹{total}
                </span>
              </div>

              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className="w-full bg-[#C46A2D] hover:bg-[#AA5B24] disabled:opacity-70 text-white py-4 rounded-2xl mt-5 font-semibold transition"
              >
                {placingOrder ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Order...
                  </div>
                ) : (
                  "Place Order"
                )}
              </button>

              {placingOrder && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-[#C46A2D] animate-pulse" />
                  </div>

                  <p className="text-sm text-center text-gray-500 mt-2">
                    Sending your order to kitchen...
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
</div>
    
  </div>
  </div>
);}