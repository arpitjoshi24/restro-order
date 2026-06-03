"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { useCart } from "@/context/cart.context";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category_name: string;
  image?: string;
};

export default function MenuPage() {
  const { addToCart } = useCart();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState<string>("All");

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenu(res.data.items || []);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const categories = [
    "All",
    ...new Set(
      menu.map((item) => item.category_name)
    ),
  ];

  const filteredItems =
    activeCategory === "All"
      ? menu
      : menu.filter(
          (item) =>
            item.category_name === activeCategory
        );

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
      {/* Header */}
      <div className="bg-[#2C1810] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="bg-[#C46A2D] px-5 py-2 rounded-full text-sm">
            Fresh • Tasty • Premium
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6">
            Explore Our Menu
          </h1>

          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Discover handcrafted dishes,
            premium ingredients and chef
            special recipes prepared fresh
            for every table.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(category)
              }
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                activeCategory === category
                  ? "bg-[#C46A2D] text-white shadow-lg"
                  : "bg-white text-[#2C1810] shadow-md hover:bg-[#FFF6EB]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#EFE3D1] hover:-translate-y-2 transition duration-300"
            >
              <div className="relative h-56">
                <Image
                  src={
                    item.image ||
                    "/margherita.png"
                  }
                  alt={item.name}
                  fill
                  className="object-cover"
                />

                <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow">
                  <span className="font-bold text-[#C46A2D]">
                    ₹{item.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#2C1810]">
                  {item.name}
                </h3>

                <p className="text-gray-500 mt-2">
                  {item.category_name}
                </p>

                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                    })
                  }
                  className="mt-6 w-full bg-[#C46A2D] hover:bg-[#AA5B24] text-white py-3 rounded-2xl font-semibold transition"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">
              No menu items found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}