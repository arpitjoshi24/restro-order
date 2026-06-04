"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import {
  UtensilsCrossed,
  Clock3,
  MapPin,
  Phone,
  Star,
  ChevronRight,
} from "lucide-react";
type MenuItem = {
  id: string;
  name: string;
  price: number;
  category_name: string;
  image?: string;
};
export default function HomePage() {
  const [specials, setSpecials] = useState<MenuItem[]>([]);
const [loadingSpecials, setLoadingSpecials] =
  useState(true);

useEffect(() => {
  const loadSpecials = async () => {
    try {
      const res = await api.get("/menu");

      setSpecials(
        (res.data.items || []).slice(0, 3)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSpecials(false);
    }
  };

  loadSpecials();
}, []);
  return (
    <div className="min-h-screen bg-[#F8F3EB]">
      
      {/* HERO */}
     <section className="relative min-h-screen overflow-hidden">
  {/* Background Image */}
  <Image
    src="/image.png"
    alt="Restaurant Background"
    fill
    priority
    className="object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050200a9] to-[#ffffff00]" />

  {/* Content */}
  <div className="relative  max-w-7xl mx-auto px-6 py-32">
    <div className="max-w-3xl">
      <span className=" text-white bg-[#aa5c24af] px-5 py-2 rounded-full text-sm">
        Premium Dining Experience
      </span>

      <h1 className="text-6xl lg:text-7xl font-bold text-white mt-8 leading-tight">
        Fresh Food.
        <br />
        Great Taste.
      </h1>

      <p className="text-gray-200 text-lg mt-6 max-w-xl">
        Experience delicious handcrafted meals,
        premium ingredients and quick table
        service through our smart QR ordering
        system.
      </p>

      <div className="flex flex-wrap gap-4 mt-10">
        <a
          href="/menu"
          className="bg-[#C46A2D] hover:bg-[#AA5B24] text-white px-8 py-4 rounded-2xl font-semibold transition"
        >
          View Specials
        </a>

        <a
          href="#contact"
          className="border border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-black transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  </div>
</section>

      {/* FEATURES */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-[#2C1810]">
            Why Choose Us
          </h2>

          <p className="text-gray-600 mt-4">
            Quality food and premium dining experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[32px] shadow-lg">
            <div className="w-16 h-16 bg-[#FFF6EB] rounded-2xl flex items-center justify-center">
              <Star className="text-[#C46A2D]" />
            </div>

            <h3 className="text-2xl font-bold mt-6">
              Premium Quality
            </h3>

            <p className="text-gray-600 mt-3">
              Carefully selected ingredients and
              handcrafted dishes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-lg">
            <div className="w-16 h-16 bg-[#FFF6EB] rounded-2xl flex items-center justify-center">
              <Clock3 className="text-[#C46A2D]" />
            </div>

            <h3 className="text-2xl font-bold mt-6">
              Fast Service
            </h3>

            <p className="text-gray-600 mt-3">
              Quick ordering and efficient kitchen
              preparation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-lg">
            <div className="w-16 h-16 bg-[#FFF6EB] rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="text-[#C46A2D]" />
            </div>

            <h3 className="text-2xl font-bold mt-6">
              Smart QR Ordering
            </h3>

            <p className="text-gray-600 mt-3">
              Scan, order and enjoy without waiting.
            </p>
          </div>
        </div>
      </section>

      {/* SPECIALS */}
      <section
        id="specials"
        className="max-w-7xl mx-auto px-6 pb-24"
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-5xl font-bold text-[#2C1810]">
            Restro Specials
          </h2>

          <Link
          href="/menu"
          className="flex items-center gap-2 text-[#C46A2D] font-semibold">
            View More
            <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
  {loadingSpecials ? (
    <p>Loading specials...</p>
  ) : (
    specials.map((item) => (
      <div
        key={item.id}
        className="bg-white rounded-[32px] overflow-hidden shadow-lg"
      >
        <div className="h-48 bg-[#FFF6EB] flex items-center justify-center">
  <UtensilsCrossed
    size={64}
    className="text-[#C46A2D]"
  />
</div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-[#2C1810]">
            {item.name}
          </h3>

          <p className="text-gray-500 mt-2">
            {item.category_name}
          </p>

          <p className="text-[#C46A2D] text-xl font-bold mt-2">
            ₹{item.price}
          </p>
        </div>
      </div>
    ))
  )}
</div>
      </section>


      {/* CONTACT */}
      <section
        id="contact"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="bg-[#2C1810] rounded-[40px] p-12 text-white">
          <h2 className="text-5xl font-bold">
            Visit Our Restaurant
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            <div className="flex gap-4">
              <MapPin className="text-[#C46A2D]" />

              <div>
                <h3 className="font-bold">
                  Address
                </h3>

                <p className="text-gray-300">
                  Main Market Road,
                  City Center
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-[#C46A2D]" />

              <div>
                <h3 className="font-bold">
                  Phone
                </h3>

                <p className="text-gray-300">
                  +91 9876543210
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock3 className="text-[#C46A2D]" />

              <div>
                <h3 className="font-bold">
                  Open Hours
                </h3>

                <p className="text-gray-300">
                  10:00 AM - 11:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1E120C] text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
          Restro
          </h2>

          <p className="text-gray-400 mt-3">
            Premium Restaurant & Bistro
          </p>

          <p className="text-gray-500 mt-6">
            © 2026 All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}